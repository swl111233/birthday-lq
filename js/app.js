/* ============================================================
   迎接李晴的22岁 — 主逻辑文件
   包含：粒子特效 / 留言(GitHub API) / 照片(Cloudinary) / 音乐 / 动画
   ============================================================ */

/* ==================== 配置区（部署时修改这里） ==================== */
const CONFIG = {
  // GitHub Issues 配置（留言功能）
  github: {
    owner: 'swl111233',      // ← 改成你的 GitHub 用户名
    repo: 'birthday-lq',                 // ← 改成你的仓库名
    token: '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',        // ← 粘贴你的 GitHub Token
    label: 'birthday-comment',           // Issues 标签
    perPage: 10,
  },

  // Cloudinary 配置（照片上传功能）
  cloudinary: {
    cloudName: '1399793684',        // ← 改成你的 Cloudinary Cloud Name
    uploadPreset: 'birthday_photos',      // ← 改成你的 Upload Preset 名称
    folder: 'birthday-lq-photos',        // 存储的文件夹名
    maxResults: 30,                      // 最多显示的照片数量
  },

  // 音乐配置
  music: {
    path: 'music/birthday.mp3',          // 音乐文件路径
    autoplay: true,                      // 是否自动播放
  },
};

/* ==================== 工具函数 ==================== */

// Toast 提示
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// 时间格式化
function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

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

  // 1.5秒后隐藏加载画面
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

  // 加载画面结束后开始打字
  setTimeout(type, 2000);
}

/* ==================== 3. 粒子背景系统 (Canvas) ==================== */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const maxParticles = 60;

  // 粒子类型
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

  // 初始化粒子
  for (let i = 0; i < maxParticles; i++) {
    const p = createParticle();
    p.y = Math.random() * height; // 初始分布在整个画面
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      // 更新位置
      p.y -= p.speed;
      p.wobble += p.wobbleSpeed;
      const x = p.x + Math.sin(p.wobble) * 30;
      p.fadePhase += 0.01;
      const opacity = p.opacity + Math.sin(p.fadePhase) * 0.15;

      // 回收到顶部
      if (p.y < -30) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }

      // 绘制
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
    // 不在输入框、按钮等元素上触发
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'button' || tag === 'label') return;

    const emoji = hearts[Math.floor(Math.random() * hearts.length)];
    const isStar = emoji === '✨' || emoji === '⭐' || emoji === '🌟' || emoji === '💫';

    if (isStar) {
      // 星星效果：向随机方向飘散
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
      // 爱心效果：向上飘
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

  // 点击视频也可以暂停/播放
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  // 滚动到视频区域时自动播放
  const videoSection = document.getElementById('videoSection');
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // 自动播放被阻止（正常情况，等待用户交互）
          });
        }
      });
    },
    { threshold: 0.5 }
  );
  videoObserver.observe(videoSection);
}

/* ==================== 8. 留言系统 (GitHub Issues API) ==================== */
const CommentsSystem = {
  currentPage: 1,
  totalCount: 0,

  // 判断是否已配置
  isConfigured() {
    return (
      CONFIG.github.owner !== 'YOUR_GITHUB_USERNAME' &&
      CONFIG.github.token !== 'ghp_YOUR_TOKEN_HERE'
    );
  },

  // 获取 Issues 列表（留言）
  async fetch(page = 1) {
    if (!this.isConfigured()) {
      this.showNotConfigured();
      return;
    }

    const { owner, repo, token, label, perPage } = CONFIG.github;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${label}&state=open&sort=created&direction=desc&per_page=${perPage}&page=${page}`;

    try {
      document.getElementById('commentsLoading').style.display = 'block';
      document.getElementById('commentsEmpty').style.display = 'none';

      const res = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const issues = await res.json();
      document.getElementById('commentsLoading').style.display = 'none';

      // 解析 Link header 获取总数信息
      const linkHeader = res.headers.get('Link');

      this.renderList(issues);
      this.renderPagination(linkHeader, page);
      this.updateCount();
    } catch (err) {
      document.getElementById('commentsLoading').style.display = 'none';
      console.error('获取留言失败:', err);
      showToast('加载留言失败，请检查配置是否正确 😢');
    }
  },

  // 提交新留言（创建 Issue）
  async submit(name, body) {
    if (!this.isConfigured()) {
      showToast('请先配置 GitHub Token 🙏');
      return false;
    }

    const { owner, repo, token, label } = CONFIG.github;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `💌 ${name} 的祝福 - ${new Date().toLocaleDateString('zh-CN')}`,
          body: body,
          labels: [label],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    } catch (err) {
      console.error('发送留言失败:', err);
      showToast('发送失败，请稍后再试 😢');
      return false;
    }
  },

  // 获取总留言数
  async updateCount() {
    if (!this.isConfigured()) return;

    const { owner, repo, token, label } = CONFIG.github;
    const url = `https://api.github.com/search/issues?q=repo:${owner}/${repo}+label:${label}+state:open+type:issue`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        document.getElementById('commentCount').textContent = data.total_count;
      }
    } catch (err) {
      // 静默失败
    }
  },

  // 渲染留言列表
  renderList(issues) {
    const list = document.getElementById('commentsList');
    const empty = document.getElementById('commentsEmpty');
    const loading = document.getElementById('commentsLoading');

    loading.style.display = 'none';

    // 清除旧卡片（保留空状态和加载状态元素）
    list.querySelectorAll('.comment-card').forEach((el) => el.remove());

    if (issues.length === 0) {
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';

    // 随机颜色生成头像背景
    const avatarColors = [
      '#FF6B9D', '#FF85B3', '#B388D9', '#FFB347',
      '#87CEEB', '#FFD1E0', '#77DD77', '#FF6961',
    ];

    issues.forEach((issue, i) => {
      const card = document.createElement('div');
      card.className = 'comment-card';
      card.style.animationDelay = `${i * 0.06}s`;

      const name = issue.title.replace(/^💌?\s*/, '').replace(/\s*的祝福.*$/, '') || '匿名小伙伴';
      const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
      const initial = name.charAt(0);

      card.innerHTML = `
        <div class="comment-card-header">
          <div class="comment-avatar" style="background:${color}">${initial}</div>
          <span class="comment-name">${escapeHtml(name)}</span>
          <span class="comment-time">${formatTime(issue.created_at)}</span>
        </div>
        <div class="comment-body">${escapeHtml(issue.body)}</div>
      `;

      list.appendChild(card);
    });
  },

  // 渲染翻页
  renderPagination(linkHeader, currentPage) {
    const container = document.getElementById('commentsPagination');
    container.innerHTML = '';

    if (!linkHeader) return;

    // 解析 GitHub Link header
    const links = {};
    linkHeader.split(',').forEach((part) => {
      const match = part.match(/<([^>]+)>;\s*rel="(\w+)"/);
      if (match) links[match[2]] = match[1];
    });

    const hasPrev = !!links.prev;
    const hasNext = !!links.next;

    if (!hasPrev && !hasNext) return;

    if (hasPrev) {
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '← 上一页';
      prevBtn.addEventListener('click', () => {
        this.currentPage = currentPage - 1;
        this.fetch(this.currentPage);
        document.getElementById('commentsList').scrollIntoView({ behavior: 'smooth' });
      });
      container.appendChild(prevBtn);
    }

    const pageIndicator = document.createElement('span');
    pageIndicator.style.cssText = 'padding:8px 16px;font-size:14px;color:#7A6B78;';
    pageIndicator.textContent = `第 ${currentPage} 页`;
    container.appendChild(pageIndicator);

    if (hasNext) {
      const nextBtn = document.createElement('button');
      nextBtn.textContent = '下一页 →';
      nextBtn.addEventListener('click', () => {
        this.currentPage = currentPage + 1;
        this.fetch(this.currentPage);
        document.getElementById('commentsList').scrollIntoView({ behavior: 'smooth' });
      });
      container.appendChild(nextBtn);
    }
  },

  // 未配置时显示提示
  showNotConfigured() {
    document.getElementById('commentsLoading').style.display = 'none';
    document.getElementById('commentsEmpty').style.display = 'block';
    const empty = document.getElementById('commentsEmpty');
    empty.querySelector('p').textContent = '留言功能尚未配置，请参考 README 设置 GitHub Token ✨';
  },
};

function initComments() {
  // 加载留言
  CommentsSystem.fetch(1);

  // 发送留言
  const sendBtn = document.getElementById('sendCommentBtn');
  const nameInput = document.getElementById('commentName');
  const bodyInput = document.getElementById('commentBody');
  const hintEl = document.getElementById('commentHint');

  sendBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const body = bodyInput.value.trim();

    if (!name) {
      hintEl.textContent = '请填写你的名字哦 💕';
      hintEl.style.color = '#FF6B9D';
      nameInput.focus();
      return;
    }
    if (!body) {
      hintEl.textContent = '写下你想说的话吧 ✨';
      hintEl.style.color = '#FF6B9D';
      bodyInput.focus();
      return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;margin:0;"></span> 发送中...';
    hintEl.textContent = '';

    const success = await CommentsSystem.submit(name, body);

    if (success) {
      nameInput.value = '';
      bodyInput.value = '';
      hintEl.textContent = '祝福发送成功！💕';
      hintEl.style.color = '#77DD77';

      // 发射小烟花
      triggerMiniFireworks();

      setTimeout(() => { hintEl.textContent = ''; }, 3000);

      // 刷新列表
      CommentsSystem.currentPage = 1;
      CommentsSystem.fetch(1);
    }

    sendBtn.disabled = false;
    sendBtn.innerHTML = '<span class="btn-text">发送祝福</span><span class="btn-icon">💌</span>';
  });

  // Enter 键发送
  bodyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      sendBtn.click();
    }
  });
}

// 小烟花效果（留言成功时触发）
function triggerMiniFireworks() {
  const emojis = ['🎆', '🎇', '✨', '🎉', '🎊', '💖', '🌟', '💝'];
  const count = 12;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'click-star';
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = Math.random() * window.innerWidth + 'px';
      el.style.top = window.innerHeight * 0.4 + Math.random() * 100 + 'px';
      el.style.fontSize = (18 + Math.random() * 20) + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 100;
      el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--dy', Math.sin(angle) * dist - 40 + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }, i * 50);
  }
}

/* ==================== 9. 照片上传与展示 (Cloudinary) ==================== */
const PhotosSystem = {
  // 判断是否已配置
  isConfigured() {
    return CONFIG.cloudinary.cloudName !== 'YOUR_CLOUD_NAME';
  },

  // 上传图片
  async upload(file) {
    if (!this.isConfigured()) {
      showToast('请先配置 Cloudinary 📷');
      return null;
    }

    const { cloudName, uploadPreset, folder } = CONFIG.cloudinary;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    // 显示进度条
    const progressDiv = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    progressDiv.classList.add('active');
    progressFill.style.width = '0%';
    progressText.textContent = '准备上传...';

    try {
      const res = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);

        // 监听进度
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressFill.style.width = percent + '%';
            progressText.textContent = `上传中 ${percent}%`;
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('网络错误')));
        xhr.send(formData);
      });

      progressText.textContent = '上传成功！✅';
      setTimeout(() => progressDiv.classList.remove('active'), 1500);
      return res;
    } catch (err) {
      progressDiv.classList.remove('active');
      console.error('上传失败:', err);
      showToast('上传失败，请重试 😢');
      return null;
    }
  },

  // 获取 Cloudinary 文件夹中的图片列表
  async fetchPhotos() {
    if (!this.isConfigured()) {
      this.showNotConfigured();
      return [];
    }

    const { cloudName, folder, maxResults } = CONFIG.cloudinary;
    // 使用 Cloudinary Admin API 需要签名，这里改用 search API 或直接列出
    // 简单方案：使用 client-side 方式，存储图片 URL 到 GitHub Gist 或 localStorage
    // 更好的方案：另建一个 GitHub Issue 存储图片 URL 列表

    // 方案：使用 GitHub Issues 的另一个 label 存储照片
    const imageList = await this.fetchFromGitHubIssues();
    return imageList;
  },

  // 从 GitHub Issues 读取照片列表
  async fetchFromGitHubIssues() {
    if (!CommentsSystem.isConfigured()) return [];

    const { owner, repo, token } = CONFIG.github;
    const label = 'birthday-photo';
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?labels=${label}&state=open&sort=created&direction=desc&per_page=30`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      if (!res.ok) return [];
      const issues = await res.json();
      return issues.map((issue) => {
        const lines = issue.body.split('\n');
        return {
          url: lines[0] || '',
          thumbnail: lines[0] || '',
          created_at: issue.created_at,
        };
      }).filter((img) => img.url);
    } catch (err) {
      console.error('获取照片列表失败:', err);
      return [];
    }
  },

  // 保存照片到 GitHub Issue
  async savePhotoUrl(imageUrl) {
    if (!CommentsSystem.isConfigured()) return false;

    const { owner, repo, token } = CONFIG.github;
    const label = 'birthday-photo';
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `📸 回忆照片 - ${new Date().toLocaleDateString('zh-CN')}`,
          body: imageUrl,
          labels: [label],
        }),
      });
      return res.ok;
    } catch (err) {
      console.error('保存照片URL失败:', err);
      return false;
    }
  },

  // 渲染照片墙
  renderPhotos(photos) {
    const grid = document.getElementById('photosGrid');
    const empty = document.getElementById('photosEmpty');
    const loading = document.getElementById('photosLoading');

    loading.style.display = 'none';
    grid.querySelectorAll('.photo-card').forEach((el) => el.remove());

    if (photos.length === 0) {
      empty.style.display = 'block';
      return;
    }

    empty.style.display = 'none';

    photos.forEach((photo, i) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.animationDelay = `${i * 0.05}s`;

      card.innerHTML = `
        <img src="${photo.url}" alt="回忆照片" loading="lazy">
      `;

      // 点击放大
      card.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        modal.classList.add('active');
        modalImg.src = photo.url;
      });

      grid.appendChild(card);
    });
  },

  showNotConfigured() {
    document.getElementById('photosLoading').style.display = 'none';
    document.getElementById('photosEmpty').style.display = 'block';
    const empty = document.getElementById('photosEmpty');
    empty.querySelector('p').textContent = '照片功能尚未配置，请参考 README 设置 Cloudinary 📸';
  },
};

function initPhotos() {
  // 加载已有照片
  PhotosSystem.fetchPhotos().then((photos) => {
    PhotosSystem.renderPhotos(photos);
  });

  // 上传图片
  const input = document.getElementById('photoInput');

  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 文件校验
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件哦 📷');
      input.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('图片太大了，请选择小于 10MB 的图片 📷');
      input.value = '';
      return;
    }

    // 上传到 Cloudinary
    const result = await PhotosSystem.upload(file);

    if (result && result.secure_url) {
      // 保存到 GitHub Issues
      await PhotosSystem.savePhotoUrl(result.secure_url);

      // 刷新图片列表
      const photos = await PhotosSystem.fetchPhotos();
      PhotosSystem.renderPhotos(photos);

      showToast('照片上传成功！📸');
    }

    input.value = '';
  });
}

/* ==================== 10. 图片模态框 ==================== */
function initImageModal() {
  const modal = document.getElementById('imageModal');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/* ==================== 11. 背景音乐播放器 ==================== */
function initMusicPlayer() {
  const btn = document.getElementById('musicBtn');
  const player = document.getElementById('musicPlayer');
  let audio = null;
  let isPlaying = false;

  // 创建音频元素
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
      // 音乐文件不存在时隐藏播放器
      player.style.display = 'none';
    });
  }

  // 首次用户交互时创建音频对象（绕过浏览器自动播放限制）
  function tryAutoplay() {
    createAudio();
    if (audio && CONFIG.music.autoplay) {
      audio.play().catch(() => {
        // 自动播放被阻止，显示提示让用户手动点击
      });
    }
  }

  // 监听首次用户交互
  const autoplayHandler = () => {
    tryAutoplay();
    document.removeEventListener('click', autoplayHandler);
    document.removeEventListener('touchstart', autoplayHandler);
  };
  document.addEventListener('click', autoplayHandler);
  document.addEventListener('touchstart', autoplayHandler);

  // 也尝试立即播放
  setTimeout(() => {
    createAudio();
    if (audio) {
      audio.play().catch(() => {});
    }
  }, 2500);

  // 按钮点击切换播放/暂停
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    createAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        showToast('点击页面任意位置后，再试一次 🎵');
      });
    }
  });
}

/* ==================== HTML 转义 ==================== */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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
  initComments();
  initPhotos();
  initImageModal();
  initMusicPlayer();
}

// DOM 加载完成后启动
document.addEventListener('DOMContentLoaded', init);
