/* Small page-side API for the service-worker asset cache, with a direct-fetch fallback. */
(() => {
  "use strict";
  const manifest = window.BIRTHDAY_PRELOAD_MANIFEST;
  const jobs = new Map();
  let registrationPromise = null;
  let requestCounter = 0;

  function requestId() { requestCounter++; return "preload-" + Date.now() + "-" + requestCounter; }
  function getRegistration() {
    if (!registrationPromise) registrationPromise = (async () => {
      if (!("serviceWorker" in navigator)) throw new Error("Service workers are not supported here.");
      const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./" });
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Service worker activation timed out.")), 15000);
        navigator.serviceWorker.ready.then(value => { clearTimeout(timeout); resolve(value); }, error => { clearTimeout(timeout); reject(error); });
      });
      return registration;
    })();
    return registrationPromise;
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", event => {
      const data = event.data || {};
      const job = jobs.get(data.requestId);
      if (!job) return;
      if (data.type === "PRELOAD_PROGRESS") {
        if (job.onProgress) job.onProgress(data);
      } else if (data.type === "PRELOAD_READY" || data.type === "PRELOAD_COMPLETE") {
        if (job.onProgress && data.type === "PRELOAD_COMPLETE") job.onProgress({ ...data, loadedBytes: data.totalBytes || data.loadedBytes || 0, totalBytes: data.totalBytes || 0, completed: data.total || data.completed || 0, total: data.total || data.completed || 0 });
        jobs.delete(data.requestId);
        job.resolve(data);
      }
    });
  }
  async function directGroup(groupName, onProgress) {
    const paths = manifest.groups[groupName] || [];
    const totalBytes = paths.reduce((sum, path) => sum + (manifest.sizes[path] || 0), 0);
    let loadedBytes = 0, completed = 0, failed = 0, uncached = 0, cursor = 0;
    let cache = null;
    try { if ("caches" in window) cache = await caches.open("saloni-birthday-assets-v13-v1"); } catch (e) {}
    const update = () => onProgress && onProgress({ group: groupName, loadedBytes, totalBytes, completed, total: paths.length, failed, uncached });
    update();
    const worker = async () => {
      while (true) {
        const index = cursor++;
        if (index >= paths.length) return;
        const path = paths[index];
        try {
          // Bypass the service worker fetch handler; this page owns the write
          // into Cache Storage, which keeps Full Experience alive for long runs.
          const response = await fetch(path, { headers: { "X-Birthday-Preload": "1" }, priority: "low" });
          if (!response.ok) throw new Error("HTTP " + response.status);
          let saved = false;
          if (cache) {
            try { await cache.put(new URL(path, location.href).href, response.clone()); saved = true; }
            catch (e) { /* storage quota: finish reading, then continue gracefully */ }
          }
          if (!saved) {
            uncached++;
            if (response.body && response.body.getReader) {
              const reader = response.body.getReader();
              while (true) { const part = await reader.read(); if (part.done) break; }
            } else { await response.blob(); }
          }
        } catch (e) { failed++; }
        loadedBytes += manifest.sizes[path] || 0;
        completed++;
        update();
      }
    };
    await Promise.all([worker(), worker()]);
    return { group: groupName, loadedBytes, totalBytes, completed, total: paths.length, failed, uncached };
  }
  function swJob(worker, message, onProgress) {
    return new Promise((resolve, reject) => {
      const id = message.requestId;
      jobs.set(id, { resolve, reject, onProgress });
      try { worker.postMessage({ ...message, requestId: id }); }
      catch (error) { jobs.delete(id); reject(error); }
    });
  }
  async function decodeFirstScene() {
    const image = new Image();
    image.src = "assets/reveal.png";
    if (image.decode) { try { await image.decode(); } catch (e) {} }
    else if (!image.complete) await new Promise(resolve => { image.onload = image.onerror = resolve; });
  }
  async function start(mode, onProgress) {
    const id = requestId();
    if (mode === "full") {
      // Keep the page alive while every asset is downloaded and written to Cache Storage.
      try { await getRegistration(); } catch (e) {}
      return directGroup("all", onProgress);
    }
    try {
      const registration = await getRegistration();
      const worker = registration.active || registration.waiting || registration.installing;
      if (!worker) throw new Error("No active service worker.");
      const result = await swJob(worker, { type: "PRELOAD_START", mode, requestId: id }, onProgress);
      await decodeFirstScene();
      return result;
    } catch (error) {
      const first = await directGroup("first", onProgress);
      await decodeFirstScene();
      // Best-effort background warm; navigation may cancel this fallback request.
      void (async () => { for (const name of ["battle", "stage", "cafe", "extras"]) await directGroup(name, null); })();
      return first;
    }
  }
  async function ensureGroup(groupName, onProgress) {
    const id = requestId();
    try {
      const registration = await getRegistration();
      const worker = registration.active || registration.waiting || registration.installing;
      if (!worker) throw new Error("No active service worker.");
      return await swJob(worker, { type: "PRELOAD_GROUP", group: groupName, requestId: id }, onProgress);
    } catch (error) {
      return directGroup(groupName, onProgress);
    }
  }
  window.BirthdayPreloader = { start, ensureGroup, manifest };
})();
