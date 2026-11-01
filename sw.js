/* Background asset warmer. The two-request limit keeps the UI responsive on phones. */
importScripts("./preload-manifest.js");
const CACHE_NAME = "saloni-birthday-assets-v13-v1";
const MANIFEST = self.BIRTHDAY_PRELOAD_MANIFEST;
const GROUPS = MANIFEST.groups;
const SIZES = MANIFEST.sizes;
let activeFetches = 0;
const waitingTasks = [];
const inFlight = new Map();

self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter(name => name.startsWith("saloni-birthday-assets-") && name !== CACHE_NAME).map(name => caches.delete(name)));
  await self.clients.claim();
})()));

function schedule(task) {
  return new Promise((resolve, reject) => {
    waitingTasks.push({ task, resolve, reject });
    pump();
  });
}
function pump() {
  while (activeFetches < 2 && waitingTasks.length) {
    const item = waitingTasks.shift();
    activeFetches++;
    Promise.resolve().then(item.task).then(item.resolve, item.reject).finally(() => {
      activeFetches--;
      pump();
    });
  }
}

async function getAsset(path) {
  if (inFlight.has(path)) return inFlight.get(path);
  const url = new URL(path, self.registration.scope).href;
  const promise = (async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);
    if (cached) return { ok: true, cached: true };
    return schedule(async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      try {
        const response = await fetch(url, { signal: controller.signal, priority: "low" });
        if (!response.ok) return { ok: false, cached: false, status: response.status };
        let saved = false;
        try { await cache.put(url, response.clone()); saved = true; } catch (e) { /* storage quota or private-mode restriction */ }
        return { ok: true, cached: saved };
      } catch (error) {
        return { ok: false, cached: false, error: String(error && error.message || error) };
      } finally {
        clearTimeout(timeout);
      }
    });
  })();
  inFlight.set(path, promise);
  promise.then(() => inFlight.delete(path), () => inFlight.delete(path));
  return promise;
}

function post(client, data) {
  if (client) { try { client.postMessage(data); } catch (e) {} }
}
async function warmGroup(groupName, requestId, client) {
  const paths = GROUPS[groupName] || [];
  const totalBytes = paths.reduce((sum, path) => sum + (SIZES[path] || 0), 0);
  let loadedBytes = 0, completed = 0, failed = 0, uncached = 0, cursor = 0;
  post(client, { type: "PRELOAD_PROGRESS", requestId, group: groupName, loadedBytes, totalBytes, completed, total: paths.length, failed, uncached });
  const worker = async () => {
    while (true) {
      const index = cursor++;
      if (index >= paths.length) return;
      const path = paths[index];
      const result = await getAsset(path);
      completed++;
      loadedBytes += SIZES[path] || 0;
      if (!result.ok) failed++;
      else if (!result.cached) uncached++;
      post(client, { type: "PRELOAD_PROGRESS", requestId, group: groupName, path, loadedBytes, totalBytes, completed, total: paths.length, failed, uncached });
    }
  };
  await Promise.all([worker(), worker()]);
  return { group: groupName, loadedBytes, totalBytes, completed, total: paths.length, failed, uncached };
}

self.addEventListener("message", event => {
  const data = event.data || {};
  const client = event.source;
  if (data.type === "PRELOAD_START") {
    const requestId = data.requestId;
    if (data.mode === "quick") {
      event.waitUntil((async () => {
        const first = await warmGroup("first", requestId, client);
        post(client, { type: "PRELOAD_READY", requestId, ...first });
        // Keep preparing later scenes after Quick Start has entered the reveal.
        for (const group of ["battle", "stage", "cafe", "extras"]) {
          await warmGroup(group, "background:" + group, null);
        }
        post(client, { type: "PRELOAD_BACKGROUND_COMPLETE" });
      })());
    } else {
      event.waitUntil((async () => {
        const result = await warmGroup("all", requestId, client);
        post(client, { type: "PRELOAD_COMPLETE", requestId, ...result });
      })());
    }
  } else if (data.type === "PRELOAD_GROUP") {
    event.waitUntil((async () => {
      const result = await warmGroup(data.group, data.requestId, client);
      post(client, { type: "PRELOAD_COMPLETE", requestId: data.requestId, ...result });
    })());
  }
});

// Serve warmed assets from Cache Storage. Range requests are left to the network
// so audio/video seeking keeps the browser's normal 206 response behavior.
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || request.headers.has("X-Birthday-Preload")) return;
  const url = new URL(request.url);
  const scopePath = new URL(self.registration.scope).pathname;
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scopePath + "assets/")) return;
  const rangeHeader = request.headers.get("range");
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (rangeHeader) {
      // Media elements commonly request byte ranges. If the complete file was
      // warmed earlier, answer the range from that cached copy instead of
      // downloading the same audio/video again.
      const full = await cache.match(new Request(url.href, { method: "GET" }));
      if (full) {
        const blob = await full.blob();
        const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
        if (match) {
          const size = blob.size;
          let start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2] || 0));
          let end = match[2] && match[1] ? Number(match[2]) : size - 1;
          if (Number.isFinite(start) && Number.isFinite(end) && start <= end && start < size) {
            end = Math.min(end, size - 1);
            const headers = new Headers();
            headers.set("Content-Type", full.headers.get("Content-Type") || "application/octet-stream");
            headers.set("Accept-Ranges", "bytes");
            headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
            headers.set("Content-Length", String(end - start + 1));
            return new Response(blob.slice(start, end + 1), { status: 206, statusText: "Partial Content", headers });
          }
        }
      }
      return fetch(request);
    }
    const hit = await cache.match(request);
    if (hit) return hit;
    const response = await fetch(request);
    if (response.ok) { try { await cache.put(request, response.clone()); } catch (e) {} }
    return response;
  })());
});
