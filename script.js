/* ==========================================================================
   INTERACTIVE LOGIC FOR RANI'S LOVE LETTER WEBSITE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const envelope = document.getElementById('envelope');
  const envelopeSection = document.getElementById('envelope-section');
  const letterSection = document.getElementById('letter-section');
  const musicBtn = document.getElementById('music-btn');
  const sendHugBtn = document.getElementById('send-hug-btn');
  const toggleReasonsBtn = document.getElementById('toggle-reasons-btn');
  const secretNotesContainer = document.getElementById('secret-notes-container');
  const noteCards = document.querySelectorAll('.note-card');
  const burstZone = document.getElementById('heart-burst-zone');

  // ==========================================
  // 1. WAX SEAL & ENVELOPE OPENING
  // ==========================================
  let isOpening = false;

  function openLetter() {
    if (isOpening) return;
    isOpening = true;

    // Trigger visual opening
    envelope.classList.add('open');
    triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 25);
    playSealBreakChime();

    // Auto-start sweet ambient music if not already started
    if (!isPlayingMusic) {
      toggleMusic();
    }

    setTimeout(() => {
      envelopeSection.style.opacity = '0';
      envelopeSection.style.transform = 'translateY(-30px)';

      setTimeout(() => {
        envelopeSection.classList.remove('active');
        envelopeSection.classList.add('hidden');

        letterSection.classList.remove('hidden');
        letterSection.classList.add('active');

        // Scroll to top of letter smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Extra celebratory burst
        triggerHeartExplosion(window.innerWidth / 2, 200, 30);
      }, 700);
    }, 1200);
  }

  if (waxSeal) waxSeal.addEventListener('click', openLetter);
  if (envelopeWrapper) envelopeWrapper.addEventListener('click', openLetter);

  // ==========================================
  // 2. SECRET "OPEN WHEN" CARDS INTERACTION
  // ==========================================
  noteCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      playSoftClickTone();
    });
  });

  if (toggleReasonsBtn) {
    toggleReasonsBtn.addEventListener('click', () => {
      secretNotesContainer.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ==========================================
  // 3. VIRTUAL HUG & KISS GENERATOR
  // ==========================================
  if (sendHugBtn) {
    sendHugBtn.addEventListener('click', (e) => {
      const rect = sendHugBtn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      triggerHeartExplosion(x, y, 35);
      playHarpChime();

      sendHugBtn.innerHTML = '<span class="btn-icon">🤗</span> Hug & High-Five Sent to Rani!';
      setTimeout(() => {
        sendHugBtn.innerHTML = '<span class="btn-icon">🤗</span> Send Another Hug & High-Five';
      }, 2500);
    });
  }

  function triggerHeartExplosion(originX, originY, count = 20) {
    const emojis = ['✨', '🤗', '💫', '💛', '💌', '🌸', '⭐', '🎉'];

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart-burst';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const spreadX = (Math.random() - 0.5) * 320;
      const spreadY = (Math.random() - 0.5) * 100;
      const size = Math.random() * 1.5 + 1.2;
      const duration = Math.random() * 1.5 + 1.5;

      heart.style.left = `${originX + spreadX}px`;
      heart.style.top = `${originY + spreadY}px`;
      heart.style.fontSize = `${size}rem`;
      heart.style.animationDuration = `${duration}s`;

      burstZone.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    }
  }

  // ==========================================
  // 4. ROMANTIC AMBIENT WEB AUDIO SYNTHESIZER
  // (Zero external dependencies, works offline!)
  // ==========================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Gentle notes progression (C major / A minor romantic arpeggios)
  const romanticMelody = [
    { freq: 261.63, delay: 0 },    // C4
    { freq: 329.63, delay: 400 },  // E4
    { freq: 392.00, delay: 800 },  // G4
    { freq: 523.25, delay: 1200 }, // C5
    { freq: 440.00, delay: 1800 }, // A4
    { freq: 349.23, delay: 2400 }, // F4
    { freq: 392.00, delay: 3000 }, // G4
    { freq: 493.88, delay: 3600 }, // B4
    { freq: 523.25, delay: 4200 }, // C5
    { freq: 392.00, delay: 4800 }, // G4
  ];

  function playTone(freq, type = 'sine', duration = 1.6, volume = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn(e);
    }
  }

  function playSealBreakChime() {
    initAudioContext();
    playTone(523.25, 'sine', 0.8, 0.1);
    setTimeout(() => playTone(659.25, 'sine', 1.0, 0.1), 150);
    setTimeout(() => playTone(783.99, 'sine', 1.4, 0.12), 300);
  }

  function playSoftClickTone() {
    initAudioContext();
    playTone(440, 'triangle', 0.25, 0.04);
  }

  function playHarpChime() {
    initAudioContext();
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 1.2, 0.08), idx * 80);
    });
  }

  function playMelodyLoop() {
    romanticMelody.forEach(note => {
      setTimeout(() => {
        if (isPlayingMusic) {
          playTone(note.freq, 'sine', 2.2, 0.05);
        }
      }, note.delay);
    });
  }

  function toggleMusic() {
    initAudioContext();
    isPlayingMusic = !isPlayingMusic;

    if (isPlayingMusic) {
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.music-label').textContent = 'Music Playing 🎶';
      playMelodyLoop();
      musicInterval = setInterval(playMelodyLoop, 5600);
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.querySelector('.music-label').textContent = 'Play Music';
      clearInterval(musicInterval);
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  // ==========================================
  // 5. FLOATING AMBIENT CANVAS PARTICLES (STARS & PETALS)
  // ==========================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.6 + 0.2;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.4 ? '#ffccd5' : '#ffd700';
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      if (this.y < 0) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
});
