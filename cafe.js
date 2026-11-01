(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const el = {
    story: $('story'), ambient: $('ambient'), sceneImage: $('sceneImage'), video: $('greetingVideo'),
    header: $('storyHeader'), soundToggle: $('soundToggle'), soundIcon: $('soundIcon'), soundLabel: $('soundLabel'),
    caption: $('sceneCaption'), dialogue: $('dialoguePanel'), speaker: $('speakerName'), speakerBow: $('speakerBow'),
    dialogueText: $('dialogueText'), progress: $('dialogueProgress'), dialogueNext: $('dialogueNext'),
    dock: $('actionDock'), action: $('actionButton'), actionHint: $('actionHint'), confetti: $('confettiLayer'),
    letterBackdrop: $('letterBackdrop'), letterTitle: $('letterTitle'), letterDate: $('letterDate'), letterCopy: $('letterCopy'),
    letterSignoff: $('letterSignoff'), letterContinue: $('letterContinue'), albumCover: $('albumCoverLayer'),
    openAlbum: $('openAlbum'), albumModal: $('albumModal'), albumSpread: $('albumSpread'), leftPage: $('leftAlbumPage'),
    rightPage: $('rightAlbumPage'), flipSheet: $('pageFlipSheet'), albumPrevious: $('albumPrevious'), albumNext: $('albumNext'),
    albumContinue: $('albumContinue'), albumPageCount: $('albumPageCount'), albumClose: $('albumClose'), albumMissingNote: $('albumMissingNote'),
    photoLightbox: $('photoLightbox'), lightboxFrame: $('lightboxFrame'), lightboxClose: $('lightboxClose'), lightboxCount: $('lightboxCount'),
    finalOverlay: $('finalOverlay'), music: $('backgroundMusic'), sfx: $('soundEffect')
  };

  // Final letter copy supplied for the birthday experience.
  const FIRST_LETTER = {
    date: 'A little birthday note',
    title: 'A Little More Beautiful ❤️',
    body: `I wonder if the stars ever know,
How much beauty they fail to show,
For somewhere beneath their endless light,
There's a smile that shines just as bright.

There's something special in the little things,
In the happiness a simple smile brings,
In the kindness you show without a thought,
And the warmth in moments that you've brought.

Perhaps you don't see it the way I do,
The little things that make you, you,
The way your laughter brightens the day,
Or how your presence can chase gloom away.

If beauty were measured in something more,
Than pretty faces and things we adore,
It would be found in a heart so kind,
And in the little joys you leave behind.

I hope life gives you skies of blue,
And brings along dreams that come true,
May you find happiness wherever you go,
And have a thousand reasons to let your smile show.

And when the days aren't quite so bright,
I hope you find your own little light,
For even the stars sometimes hide from view,
But that never makes them any less beautiful.

So here's a wish, simple and true,
For all the lovely things awaiting you,
May life be as wonderful as it can be,
And may you always find reasons to be happy.

And if you ever wonder what makes this world worthwhile,
Remember, somewhere in it, there's a reason to smile. ❤️`,
    signoff: 'With love, always ♡'
  };
  const HOME_LETTER = {
    date: 'For when you are home',
    title: 'Something I wanted you to know',
    body: `Hey, Saloni! ❤️

Well, we've finally reached the end of this little adventure!

I hope you enjoyed everything I made for you. I won't lie, it took quite a bit of effort to put all of this together. There are approximately **1,500 lines of code** behind this little birthday world, along with countless images, animations, music and probably more hours than I should admit. 😭

And honestly? I don't even have a proper explanation for why I did all this.

I just felt like doing something special for you. Something a little different from the usual birthday wishes and gifts. I wanted to create an experience that you could explore, something that might make you smile even after the birthday is over.

I tried to understand the little things you like. Pokémon, Hello Kitty, cute things and all those tiny details that make something feel special. And then I tried to bring a little bit of all of that together into one place.

I hope I got most of it right. And if I got something wrong, please forgive me. I tried my best! 😭

But jokes aside, there's something I genuinely want to tell you.

You have a beautiful way of making the simplest moments feel a little brighter. Your kindness, your smile, and that adorable little charm of yours are things I hope you never lose. There's something lovely about the way you carry yourself, and I hope you always see at least a little of the beauty that other people get to see in you.

I hope life continues to be kind to you. I hope you find reasons to laugh on ordinary days, people who appreciate you without hesitation, and places where you feel completely comfortable being yourself.

May you never have to dim your happiness to make someone else comfortable. May your dreams find their way to you, even if the journey takes a little longer than expected.

And whenever life gets difficult, I hope you remember that difficult days are only a part of your story, never the whole story.

If I could wish one thing for you beyond all the usual birthday wishes, it would be this:

**I hope you never run out of reasons to smile. And when you do smile, I hope the world gives you a thousand reasons to keep doing it.**

I don't know how much of this little project you'll remember, or which part you'll like the most. Maybe the café, maybe the album, maybe the cake, or perhaps just the silly conversations with Hello Kitty.

But I hope that someday, when you come across it again, it brings back a little warmth.

Because somewhere behind all these animations, pictures, and lines of code, there was simply someone who wanted to make your day a little more special.

And I'm genuinely glad I got to do that.

So, once again...

**Happy Birthday, Saloni!** ❤️

Keep being the lovely, kind, beautiful and wonderfully cute person you are.

The world could always use a little more of your smile.

With lots of warmth,

**Vasanth** ♡`,
    signoff: '— Vasanth'
  };

  const SCENES = {
    portal: { src: 'assets/cafe/scene-01-portal.webp', alt: 'Saloni stepping into a glowing portal near the café' },
    outside: { src: 'assets/cafe/scene-02-outside-cafe.webp', alt: 'Saloni outside the pastel Hello Kitty Café' },
    together: { src: 'assets/cafe/scene-04-cafe-conversation.webp', alt: 'Saloni and Hello Kitty together at the café' },
    pov: { src: 'assets/cafe/scene-05-table-pov.webp', alt: 'Saloni’s point of view at the café table' },
    cake: { src: 'assets/cafe/scene-06-cake.webp', alt: 'A birthday cake waiting at the café table' },
    candles: { src: 'assets/cafe/scene-07-candles-blown.webp', alt: 'A birthday celebration at the café' },
    album: { src: 'assets/cafe/scene-08-album.webp', alt: 'A Hello Kitty birthday scrapbook on the café table' },
    envelope: { src: 'assets/cafe/scene-09-envelope.webp', alt: 'A sealed pink envelope on the café table' },
    homePortal: { src: 'assets/cafe/scene-10-portal-homebound.webp', alt: 'Saloni beside a glowing portal outside the café' },
    outsideHome: { src: 'assets/cafe/scene-11-outside.webp', alt: 'Saloni outside in the evening' },
    building: { src: 'assets/cafe/scene-12-building.webp', alt: 'The apartment building under the evening sky' },
    home: { src: 'assets/cafe/scene-13-home-letter.webp', alt: 'Saloni sitting at home with her envelope' },
    envelopePov: { src: 'assets/cafe/scene-14-envelope-pov.webp', alt: 'A first-person view of the sealed pink envelope' },
    end: { src: 'assets/cafe/scene-end.webp', alt: 'A thank-you ending illustration' }
  };

  const albumItems = [
    { file: 'A1.mp4', type: 'video' },
    { file: 'A2.jpg', type: 'image' },
    { file: 'A3.jpg', type: 'image' },
    { file: 'A4.jpg', type: 'image' },
    { file: 'A5.jpg', type: 'image' },
    { file: 'A6.jpg', type: 'image' },
    { file: 'A7.mp4', type: 'video' },
    { file: 'A8.mp4', type: 'video' },
    { file: 'A9.jpg', type: 'image' },
    { file: 'A10.jpg', type: 'image' },
    { file: 'A11.jpg', type: 'image' },
    { file: 'A12.mp4', type: 'video' },
    { file: 'A13.mp4', type: 'video' },
    { file: 'A14.jpg', type: 'image' },
    // A15–A20 resolve their format automatically (.jpg/.jpeg/.png/.webp/.avif or video formats).
    { file: 'A15', type: 'auto' },
    { file: 'A16', type: 'auto' },
    { file: 'A17', type: 'auto' },
    { file: 'A18', type: 'auto' },
    { file: 'A19', type: 'auto' },
    { file: 'A20', type: 'auto' }
  ];

  let audioEnabled = true;
  let desiredTrack = 'cafe1.mp3';
  let currentSequence = [];
  let dialogueIndex = 0;
  let actionHandler = null;
  let sceneTimer = null;
  let letterTimer = null;
  let albumSpreadIndex = 0;
  let albumMissing = false;
  let journeyTimers = [];
  let unlockedAudio = false;

  function safePlay(audio) {
    if (!audioEnabled || !audio || !audio.getAttribute('src')) return;
    const p = audio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {
      unlockedAudio = false;
      updateSoundButton();
    });
  }
  function setMusic(filename, options = {}) {
    desiredTrack = filename || '';
    const music = el.music;
    music.pause();
    music.loop = options.loop !== false;
    music.volume = options.volume == null ? 0.38 : options.volume;
    music.src = filename ? `assets/${filename}` : '';
    music.load();
    if (filename && audioEnabled) safePlay(music);
  }
  function playSfx(filename = 'p.mp3', volume = 0.7) {
    if (!filename || !audioEnabled) return;
    el.sfx.pause();
    el.sfx.src = `assets/${filename}`;
    el.sfx.currentTime = 0;
    el.sfx.volume = volume;
    el.sfx.load();
    safePlay(el.sfx);
  }
  function updateSoundButton() {
    el.soundToggle.setAttribute('aria-pressed', String(audioEnabled));
    el.soundIcon.textContent = audioEnabled ? '♫' : '♪';
    el.soundLabel.textContent = audioEnabled ? (unlockedAudio ? 'Sound on' : 'Enable sound') : 'Sound off';
  }
  function unlockAudio() {
    if (!audioEnabled) return;
    unlockedAudio = true;
    if (desiredTrack && el.music.getAttribute('src')) safePlay(el.music);
    updateSoundButton();
  }
  el.soundToggle.addEventListener('click', () => {
    // The first click is an explicit sound-enable gesture, not a mute action.
    if (!unlockedAudio) {
      audioEnabled = true;
      unlockedAudio = true;
      if (desiredTrack) setMusic(desiredTrack);
      updateSoundButton();
      return;
    }
    audioEnabled = !audioEnabled;
    if (audioEnabled) {
      if (desiredTrack) setMusic(desiredTrack);
    } else {
      el.music.pause(); el.sfx.pause();
    }
    updateSoundButton();
  });
  document.addEventListener('pointerdown', (event) => {
    if (!event.target.closest('#soundToggle')) unlockAudio();
  }, { once: true, passive: true });

  function clearTimers() {
    if (sceneTimer) clearTimeout(sceneTimer);
    if (letterTimer) clearTimeout(letterTimer);
    sceneTimer = null; letterTimer = null;
    journeyTimers.forEach(clearTimeout); journeyTimers = [];
  }
  function hideDialogue() { el.dialogue.hidden = true; currentSequence = []; actionHandler = null; }
  function hideDock() { el.dock.hidden = true; el.actionHint.hidden = true; actionHandler = null; }
  function hidePopups() {
    el.letterBackdrop.hidden = true; el.albumCover.hidden = true; el.albumModal.hidden = true; el.finalOverlay.hidden = true;
  }
  function setScene(key, { caption = '', keepDock = false } = {}) {
    const scene = SCENES[key];
    if (!scene) return;
    clearTimers();
    el.video.pause(); el.video.classList.remove('is-visible');
    el.sceneImage.classList.remove('is-visible');
    el.sceneImage.alt = scene.alt;
    el.ambient.style.backgroundImage = `url("${scene.src}")`;
    window.setTimeout(() => {
      el.sceneImage.src = scene.src;
      el.sceneImage.classList.add('is-visible');
    }, 90);
    el.caption.textContent = caption;
    el.caption.hidden = !caption;
    el.story.dataset.scene = key;
    if (!keepDock) hideDock();
    hideDialogue();
    el.confetti.replaceChildren();
  }
  function showDock(label, handler, hint = '') {
    el.action.textContent = label;
    el.dock.hidden = false;
    el.actionHint.textContent = hint;
    el.actionHint.hidden = !hint;
    actionHandler = handler;
  }
  el.action.addEventListener('click', () => {
    unlockAudio();
    if (typeof actionHandler === 'function') {
      const handler = actionHandler;
      actionHandler = null;
      handler();
    }
  });
  function showDialogue(lines, onDone, progressLabel = '') {
    currentSequence = lines;
    dialogueIndex = 0;
    hideDock();
    el.dialogue.hidden = false;
    showDialogueLine();
    el.dialogueNext.onclick = () => {
      unlockAudio();
      dialogueIndex += 1;
      if (dialogueIndex >= currentSequence.length) {
        hideDialogue();
        if (typeof onDone === 'function') onDone();
      } else showDialogueLine(progressLabel);
    };
    function showDialogueLine() {
      const line = currentSequence[dialogueIndex];
      if (!line) return;
      el.speaker.textContent = line.who;
      el.speakerBow.textContent = line.who.toLowerCase().includes('saloni') ? '♡' : '🎀';
      el.dialogueText.textContent = line.text;
      el.progress.textContent = progressLabel || `${String(dialogueIndex + 1).padStart(2, '0')} / ${String(currentSequence.length).padStart(2, '0')}`;
      el.dialogueNext.textContent = dialogueIndex === currentSequence.length - 1 ? 'Continue ♡' : 'Next ♡';
      el.dialogueNext.setAttribute('aria-label', dialogueIndex === currentSequence.length - 1 ? 'Continue conversation' : 'Next dialogue line');
    }
  }
  function useDialogue(line, onDone, label = 'Continue ♡') {
    showDialogue([line], onDone);
    el.dialogueNext.textContent = label;
  }
  function playGreetingVideo() {
    hideDock(); hideDialogue(); el.caption.hidden = true;
    el.sceneImage.classList.remove('is-visible');
    el.ambient.style.backgroundImage = `url("${SCENES.outside.src}")`;
    el.video.currentTime = 0;
    el.video.classList.add('is-visible');
    el.video.muted = false;
    el.music.pause();
    const p = el.video.play();
    if (p && typeof p.then === 'function') p.catch(() => {
      // If video playback is unavailable, retain the flow and provide a clear manual continuation.
      showDock('Continue to the café ♡', enterConversation, 'The greeting clip could not autoplay. Continue to the café scene.');
    });
  }
  el.video.addEventListener('ended', () => {
    setScene('together'); setMusic('cafe1.mp3'); startCafeConversation();
  });
  el.video.addEventListener('error', () => {
    if (el.video.classList.contains('is-visible')) showDock('Continue to the café ♡', enterConversation, 'The video file is unavailable; the café story can still continue.');
  });
  function enterConversation() {
    setScene('together'); setMusic('cafe1.mp3'); startCafeConversation();
  }
  function startCafeConversation() {
    showDialogue([
      { who: 'Hello Kitty', text: 'Happy Birthday Saloni!!! 🎀💗' },
      { who: 'Hello Kitty', text: 'Vasanth told me about you. Nice to meet you! ♡' },
      { who: 'Saloni', text: 'Thank you! What do you have for me?' },
      { who: 'Hello Kitty', text: "Well, he has planned some things for you. Let's do them! I'll record your reaction! 💗" }
    ], () => {
      setScene('pov');
      useDialogue({ who: 'Hello Kitty', text: "First, we'll celebrate your birthday with a cake! I'll bring it to you! 🎂" }, () => {
        setScene('cake');
        setMusic('cafe2.mp3');
        showDock('Blow the candles ✨', blowCandles, 'Make a birthday wish, then tap to blow out the candles.');
      }, 'Let’s celebrate ♡');
    }, 'A little café conversation');
  }
  function scatterCelebration() {
    el.confetti.replaceChildren();
    const pieces = ['💗', '🎀', '✨', '🌸', '💕', '✿', '🎉', '💖'];
    for (let i = 0; i < 52; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece'; piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--delay', `${Math.random() * 1.3}s`);
      piece.style.setProperty('--fall', `${2.6 + Math.random() * 2.2}s`);
      piece.style.setProperty('--size', `${14 + Math.random() * 20}px`);
      piece.style.setProperty('--drift', `${-90 + Math.random() * 180}px`);
      piece.style.setProperty('--spin', `${360 + Math.random() * 900}deg`);
      el.confetti.appendChild(piece);
    }
    const balloons = ['🎈', '💗', '🎈', '🎀', '🎈'];
    balloons.forEach((symbol, i) => {
      const balloon = document.createElement('span'); balloon.className = 'balloon'; balloon.textContent = symbol;
      balloon.style.left = `${8 + i * 19}%`; balloon.style.setProperty('--delay', `${i * .35}s`); balloon.style.setProperty('--rise', `${4.5 + Math.random() * 2}s`);
      balloon.style.fontSize = `${28 + Math.random() * 18}px`; el.confetti.appendChild(balloon);
    });
  }
  function blowCandles() {
    hideDock(); playSfx('p.mp3', .45); setScene('candles');
    scatterCelebration();
    letterTimer = window.setTimeout(() => showLetter(FIRST_LETTER, () => {
      setMusic('cafe3.mp3');
      setScene('pov');
      useDialogue({ who: 'Hello Kitty', text: 'I was given this album for you. Take a look! ♡' }, () => {
        setScene('album');
        hideDock();
        el.albumCover.hidden = false;
      }, 'Show me ♡');
    }), 4000);
  }
  function showLetter(data, onContinue) {
    el.letterDate.textContent = data.date;
    el.letterTitle.textContent = data.title;
    // Render **emphasis** as bold text without interpreting arbitrary HTML.
    el.letterCopy.replaceChildren();
    const emphasisParts = data.body.split(/(\\*\\*[^*]+\\*\\*)/g);
    emphasisParts.forEach((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const strong = document.createElement('strong');
        strong.textContent = part.slice(2, -2);
        el.letterCopy.appendChild(strong);
      } else {
        el.letterCopy.appendChild(document.createTextNode(part));
      }
    });
    el.letterSignoff.textContent = data.signoff;
    el.letterBackdrop.hidden = false;
    el.letterContinue.onclick = () => {
      unlockAudio(); el.letterBackdrop.hidden = true;
      if (typeof onContinue === 'function') onContinue();
    };
  }
  el.openAlbum.addEventListener('click', () => { unlockAudio(); openAlbum(); });
  const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
  const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v'];

  function makeMissingPlaceholder(item, index) {
    const placeholder = document.createElement('div');
    placeholder.className = 'memory-placeholder';
    const bow = document.createElement('span');
    bow.className = 'placeholder-icon';
    bow.textContent = '♡';
    const title = document.createElement('strong');
    title.textContent = `Memory ${String(index + 1).padStart(2, '0')}`;
    const filename = document.createElement('span');
    filename.className = 'placeholder-file';
    filename.textContent = `${item.file}${item.type === 'auto' ? '.[jpg / png / mp4 …]' : ''}`;
    placeholder.append(bow, title, filename);
    return placeholder;
  }

  function configurePreviewVideo(video, item) {
    video.src = `assets/${item.file}`;
    video.autoplay = true;
    video.loop = true;
    video.muted = true; // Muted autoplay is permitted by modern browsers.
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.preload = 'auto';
    video.setAttribute('aria-label', `Looping video memory ${item.file}`);
  }

  function updateMediaReady(photo, placeholder, media, item, type) {
    item.resolvedFile = item.file;
    item.resolvedType = type;
    photo.replaceChildren(media);
    if (type === 'video') {
      const playPromise = media.play();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {
        // The looping preview remains available; browser autoplay policy may defer playback.
      });
    }
  }

  function resolveAutoMedia(item, photo, placeholder, index) {
    const stem = item.file;
    let imageIndex = 0;
    let videoIndex = 0;
    const tryVideo = () => {
      if (videoIndex >= VIDEO_EXTENSIONS.length) {
        photo.replaceChildren(placeholder);
        albumMissing = true;
        updateAlbumMissingNote();
        return;
      }
      const ext = VIDEO_EXTENSIONS[videoIndex++];
      const video = document.createElement('video');
      video.autoplay = true; video.loop = true; video.muted = true; video.defaultMuted = true;
      video.playsInline = true; video.controls = false; video.preload = 'metadata';
      video.addEventListener('loadedmetadata', () => {
        item.file = `${stem}.${ext}`;
        updateMediaReady(photo, placeholder, video, item, 'video');
      }, { once: true });
      video.addEventListener('error', tryVideo, { once: true });
      video.src = `assets/${stem}.${ext}`;
      video.load();
    };
    const tryImage = () => {
      if (imageIndex >= IMAGE_EXTENSIONS.length) { tryVideo(); return; }
      const ext = IMAGE_EXTENSIONS[imageIndex++];
      const image = new Image();
      image.alt = `Photo memory ${index + 1}`;
      image.addEventListener('load', () => {
        item.file = `${stem}.${ext}`;
        updateMediaReady(photo, placeholder, image, item, 'image');
      }, { once: true });
      image.addEventListener('error', tryImage, { once: true });
      image.src = `assets/${stem}.${ext}`;
    };
    tryImage();
  }

  function createMemoryCard(item, index) {
    const card = document.createElement('article');
    card.className = 'memory-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open memory ${index + 1} in full screen`);
    const corner = document.createElement('span');
    corner.className = 'photo-corner';
    corner.textContent = '🎀';
    corner.setAttribute('aria-hidden', 'true');

    const photo = document.createElement('span');
    photo.className = 'memory-photo';
    const placeholder = makeMissingPlaceholder(item, index);
    photo.appendChild(placeholder);
    card.append(corner, photo);

    if (item.type === 'auto') {
      resolveAutoMedia(item, photo, placeholder, index);
    } else if (item.type === 'video') {
      const media = document.createElement('video');
      configurePreviewVideo(media, item);
      media.addEventListener('loadeddata', () => {
        if (placeholder.isConnected) placeholder.remove();
      }, { once: true });
      media.addEventListener('error', () => {
        if (photo.isConnected) photo.replaceChildren(placeholder);
        albumMissing = true; updateAlbumMissingNote();
      }, { once: true });
      photo.appendChild(media);
      const playPromise = media.play();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
    } else {
      const media = document.createElement('img');
      media.src = `assets/${item.file}`;
      media.alt = `Photo memory ${index + 1}`;
      media.loading = 'lazy';
      media.addEventListener('load', () => {
        item.resolvedFile = item.file; item.resolvedType = 'image';
        if (placeholder.isConnected) placeholder.remove();
      }, { once: true });
      media.addEventListener('error', () => {
        if (photo.isConnected) photo.replaceChildren(placeholder);
        albumMissing = true; updateAlbumMissingNote();
      }, { once: true });
      photo.appendChild(media);
    }

    card.addEventListener('click', () => openMemoryLightbox(item, index));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMemoryLightbox(item, index); }
    });
    return card;
  }

  function renderAlbumSpread(index) {
    const spreadCount = Math.ceil(albumItems.length / 2);
    albumSpreadIndex = Math.max(0, Math.min(spreadCount - 1, index));
    el.leftPage.replaceChildren(); el.rightPage.replaceChildren();
    const leftItemIndex = albumSpreadIndex * 2;
    const rightItemIndex = leftItemIndex + 1;
    if (albumItems[leftItemIndex]) el.leftPage.appendChild(createMemoryCard(albumItems[leftItemIndex], leftItemIndex));
    if (albumItems[rightItemIndex]) el.rightPage.appendChild(createMemoryCard(albumItems[rightItemIndex], rightItemIndex));
    const lastItem = Math.min(rightItemIndex + 1, albumItems.length);
    el.albumPageCount.textContent = `MEMORIES ${String(leftItemIndex + 1).padStart(2, '0')}–${String(lastItem).padStart(2, '0')} / ${albumItems.length}`;
    el.albumPrevious.hidden = albumSpreadIndex === 0;
    el.albumNext.hidden = albumSpreadIndex === spreadCount - 1;
    el.albumContinue.hidden = albumSpreadIndex !== spreadCount - 1;
    updateAlbumMissingNote();
  }

  function updateAlbumMissingNote() {
    el.albumMissingNote.hidden = !albumMissing;
  }

  function openMemoryLightbox(item, index) {
    if (!item.resolvedFile || !item.resolvedType) return;
    el.lightboxFrame.replaceChildren();
    const media = item.resolvedType === 'video' ? document.createElement('video') : document.createElement('img');
    media.className = 'lightbox-media';
    media.src = `assets/${item.resolvedFile}`;
    if (item.resolvedType === 'video') {
      media.autoplay = true; media.loop = true; media.muted = true; media.defaultMuted = true;
      media.playsInline = true; media.controls = true; media.preload = 'auto';
      media.setAttribute('aria-label', `Looping video memory ${index + 1}`);
      media.addEventListener('loadeddata', () => {
        const p = media.play(); if (p && typeof p.catch === 'function') p.catch(() => {});
      }, { once: true });
    } else {
      media.alt = `Photo memory ${index + 1}`;
    }
    el.lightboxFrame.appendChild(media);
    el.lightboxCount.textContent = `${String(index + 1).padStart(2, '0')} / ${albumItems.length}`;
    el.photoLightbox.hidden = false;
    el.lightboxClose.focus();
  }

  function closeMemoryLightbox() {
    if (el.photoLightbox.hidden) return;
    const video = el.lightboxFrame.querySelector('video');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    el.lightboxFrame.replaceChildren();
    el.photoLightbox.hidden = true;
  }

  function turnAlbum(direction) {
    const spreadCount = Math.ceil(albumItems.length / 2);
    const target = albumSpreadIndex + direction;
    if (target < 0 || target >= spreadCount) return;
    el.albumSpread.classList.remove('turning-next', 'turning-previous');
    void el.albumSpread.offsetWidth;
    el.albumSpread.classList.add(direction > 0 ? 'turning-next' : 'turning-previous');
    window.setTimeout(() => {
      renderAlbumSpread(target);
      el.albumSpread.classList.remove('turning-next', 'turning-previous');
    }, 720);
  }

  function openAlbum() {
    el.albumCover.hidden = true; hideDock(); el.albumModal.hidden = false; albumMissing = false; renderAlbumSpread(0);
  }
  el.albumPrevious.addEventListener('click', () => turnAlbum(-1));
  el.albumNext.addEventListener('click', () => turnAlbum(1));
  el.albumClose.addEventListener('click', () => {
    closeMemoryLightbox();
    el.albumModal.hidden = true;
    el.albumCover.hidden = false;
    hideDock();
  });
  el.lightboxClose.addEventListener('click', closeMemoryLightbox);
  el.photoLightbox.addEventListener('click', (event) => {
    if (event.target === el.photoLightbox) closeMemoryLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !el.photoLightbox.hidden) closeMemoryLightbox();
  });
  el.albumContinue.addEventListener('click', () => {
    unlockAudio(); el.albumModal.hidden = true; el.albumCover.hidden = true;
    setScene('pov'); setMusic('cafe4.mp3');
    useDialogue({ who: 'Hello Kitty', text: 'Lastly, I have one envelope that I want you to open when you get home. ♡' }, () => {
      setScene('envelope');
      showDock('Take the envelope 💌', takeEnvelope, 'Keep it safe until you get home.');
    }, 'Tell me more ♡');
  });
  function takeEnvelope() {
    setScene('pov');
    showDialogue([
      { who: 'Hello Kitty', text: "Once again, happy birthday, Saloni! I'll see you later, I guess. 💗" },
      { who: 'Saloni', text: "Okay, Hello Kitty! It was awesome. I'll see you later. Bubyeee! 🎀" }
    ], beginJourney, 'Time to say goodbye');
  }
  function beginJourney() {
    hideDock();
    setMusic('cafe5.mp3');
    setScene('homePortal', { caption: 'One last little journey home ♡' });
    // Run this as a chain so each setScene() can safely clear any prior timer.
    const journey = [
      { key: 'outsideHome', delay: 2400, caption: 'On her way home…' },
      { key: 'building', delay: 2300, caption: 'Almost home…' },
      { key: 'home', delay: 2600, caption: 'A quiet evening at home…' },
      { key: 'envelopePov', delay: 2600, caption: 'A quiet moment, just for you' }
    ];
    const advance = (index) => {
      if (index >= journey.length) {
        setMusic('cafe6.mp3');
        showDock('Open the envelope 💌', openFinalLetter, 'The last part of your little story is waiting inside.');
        return;
      }
      const stop = journey[index];
      const timer = window.setTimeout(() => {
        setScene(stop.key, { caption: stop.caption });
        if (stop.key === 'envelopePov') setMusic('cafe6.mp3');
        if (index === journey.length - 1) {
          showDock('Open the envelope 💌', openFinalLetter, 'The last part of your little story is waiting inside.');
        } else {
          advance(index + 1);
        }
      }, stop.delay);
      journeyTimers = [timer];
    };
    advance(0);
  }
  function openFinalLetter() {
    hideDock(); el.finalOverlay.hidden = false;
    window.setTimeout(() => {
      el.finalOverlay.hidden = true;
      showLetter(HOME_LETTER, () => {
        hidePopups(); setScene('end'); setMusic('cafe7.mp3');
        el.header.hidden = true; el.caption.hidden = true; hideDialogue(); hideDock();
      });
    }, 650);
  }

  // Initial scene is visible immediately. Audio starts here when browser policy permits.
  setScene('portal');
  setMusic('cafe1.mp3');
  playSfx('p.mp3', .6);
  updateSoundButton();
  sceneTimer = window.setTimeout(() => {
    setScene('outside');
    showDock('Enter Café ♡', playGreetingVideo, 'A little welcome is waiting inside.');
  }, 1000);
})();
