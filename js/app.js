/* ============================================================
   迎接李晴的22岁 — 主逻辑文件
   包含：粒子特效 / 视频 / 音乐 / 动画
   ============================================================ */

/* ==================== 配置区 ==================== */
const CONFIG = {
  music: {
    path: 'music/birthday.mp3',
    autoplay: true,
  },
};

/* ==================== 1. 页面加载动画 ==================== */
function initLoadingScreen() {
  const texts = [
    '正在准备惊喜... 🎁',
    '吹蜡烛时间到... 🕯️',
    '许个愿吧... ✨',
    '生日快乐！🎉',
  ];
  const typewriter = document.getElementById('loadingTypewriter');
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      typewriter.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriter.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === currentText.length) {
      speed = 1200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      speed = 300;
    }
    window._typewriterTimer = setTimeout(type, speed);
  }

  type();

  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    clearTimeout(window._typewriterTimer);
  }, 1800);
}

/* ==================== 2. 打字机效果（Hero 副标题） ==================== */
function initHeroTypewriter() {
  const subtitle = document.getElementById('heroSubtitle');
  const fullText = '愿22岁的你，永远闪闪发光';
  let index = 0;

  function type() {
    if (index < fullText.length) {
      subtitle.textContent += fullText[index];
      index++;
      setTimeout(type, 100);
    }
  }

  setTimeout(type, 2000);
}

/* ==================== 3. 粒子背景系统 (Canvas) ==================== */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const maxParticles = 60;

  const types = [
    { emoji: '✨', size: 16, speed: 0.3 },
    { emoji: '⭐', size: 14, speed: 0.2 },
    { emoji: '💕', size: 12, speed: 0.4 },
    { emoji: '🌸', size: 15, speed: 0.25 },
    { emoji: '🎀', size: 13, speed: 0.35 },
    { emoji: '💫', size: 14, speed: 0.3 },
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      x: Math.random() * width,
      y: height + 20,
      size: type.size,
      emoji: type.emoji,
      speed: type.speed + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.02,
      opacity: 0.3 + Math.random() * 0.4,
      fadePhase: Math.random() * Math.PI * 2,
    };
  }

  for (let i = 0; i < maxParticles; i++) {
    const p = createParticle();
    p.y = Math.random() * height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speed;
      p.wobble += p.wobbleSpeed;
      const x = p.x + Math.sin(p.wobble) * 30;
      p.fadePhase += 0.01;
      const opacity = p.opacity + Math.sin(p.fadePhase) * 0.15;

      if (p.y < -30) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(p.emoji, x, p.y);
      ctx.restore();
    });

    window._particleRAF = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}

/* ==================== 4. 点击爱心/星星特效 ==================== */
function initClickEffects() {
  const hearts = ['💕', '💖', '💗', '💝', '✨', '⭐', '🌟', '💫', '🎀', '🌸'];

  document.addEventListener('click', (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'button' || tag === 'label') return;

    const emoji = hearts[Math.floor(Math.random() * hearts.length)];
    const isStar = emoji === '✨' || emoji === '⭐' || emoji === '🌟' || emoji === '💫';

    if (isStar) {
      const el = document.createElement('span');
      el.className = 'click-star';
      el.textContent = emoji;
      el.style.left = e.clientX - 9 + 'px';
      el.style.top = e.clientY - 9 + 'px';
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 60;
      el.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
      el.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    } else {
      const el = document.createElement('span');
      el.className = 'click-heart';
      el.textContent = emoji;
      el.style.left = e.clientX - 12 + 'px';
      el.style.top = e.clientY - 12 + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }
  });
}

/* ==================== 5. 滚动淡入动画 ==================== */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
}

/* ==================== 6. 回到顶部按钮 ==================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==================== 7. 视频播放器 ==================== */
function initVideoPlayer() {
  const video = document.getElementById('birthdayVideo');
  const overlay = document.getElementById('videoOverlay');
  const playBtn = document.getElementById('videoPlayBtn');

  playBtn.addEventListener('click', () => {
    video.play();
    overlay.classList.add('hidden');
  });

  video.addEventListener('play', () => {
    overlay.classList.add('hidden');
  });

  video.addEventListener('pause', () => {
    if (video.paused && !video.ended) {
      overlay.classList.remove('hidden');
    }
  });

  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  const videoSection = document.getElementById('videoSection');
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        }
      });
    },
    { threshold: 0.5 }
  );
  videoObserver.observe(videoSection);
}

/* ==================== 8. 背景音乐播放器 ==================== */
function initMusicPlayer() {
  const btn = document.getElementById('musicBtn');
  const player = document.getElementById('musicPlayer');
  let audio = null;
  let isPlaying = false;

  function createAudio() {
    if (audio) return;
    audio = new Audio(CONFIG.music.path);
    audio.loop = true;
    audio.volume = 0.5;

    audio.addEventListener('play', () => {
      isPlaying = true;
      btn.classList.add('playing');
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
      btn.classList.remove('playing');
    });

    audio.addEventListener('error', () => {
      player.style.display = 'none';
    });
  }

  function tryAutoplay() {
    createAudio();
    if (audio && CONFIG.music.autoplay) {
      audio.play().catch(() => {});
    }
  }

  const autoplayHandler = () => {
    tryAutoplay();
    document.removeEventListener('click', autoplayHandler);
    document.removeEventListener('touchstart', autoplayHandler);
  };
  document.addEventListener('click', autoplayHandler);
  document.addEventListener('touchstart', autoplayHandler);

  setTimeout(() => {
    createAudio();
    if (audio) {
      audio.play().catch(() => {});
    }
  }, 2500);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    createAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  });
}

/* ==================== 启动一切 ==================== */
function init() {
  initLoadingScreen();
  initHeroTypewriter();
  initParticles();
  initClickEffects();
  initScrollAnimations();
  initBackToTop();
  initVideoPlayer();
  initMusicPlayer();
}

document.addEventListener('DOMContentLoaded', init);
