# 迎接李晴的22岁 🎂

一个温暖、梦幻的生日祝福网站，可直接部署到 GitHub Pages。

---

## 本地运行

1. 克隆仓库到本地
2. 把 `HBD.mp4` 放到项目根目录
3. 把生日音乐放到 `music/birthday.mp3`
4. 用浏览器直接打开 `index.html`，或用 Live Server 打开

```
birthday-lq/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 所有功能逻辑
├── music/
│   └── birthday.mp3    # 背景音乐（需自行添加）
├── HBD.mp4             # 生日视频（需自行添加）
├── .gitignore
└── README.md
```

---

## 部署到 GitHub Pages

### 第一步：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 仓库名填写：`birthday-lq`（或任意名称）
4. 选择 **Public**（公开）
5. 点击 **Create repository**

### 第二步：上传代码

```bash
cd birthday-lq
git init
git add .
git commit -m "首次提交 - 李晴生日网站"
git branch -M main
git remote add origin https://github.com/你的用户名/birthday-lq.git
git push -u origin main
```

### 第三步：开启 GitHub Pages

1. 进入仓库 → **Settings** → **Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，目录选 `/ (root)`
4. 点击 **Save**
5. 等待 1-2 分钟，页面会显示网址：
   `https://你的用户名.github.io/birthday-lq`

### 第四步：配置留言功能（GitHub Issues API）

留言通过 GitHub Issues 存储和读取。

#### 4.1 创建 GitHub Token

1. 进入 [GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. 点击 **Generate new token → Generate new token (classic)**
3. **Note**：填写 `birthday-site-comments`
4. **Expiration**：选择 `No expiration`
5. 勾选权限：
   - ✅ `public_repo`（访问公开仓库 Issues）
6. 点击 **Generate token**
7. **复制 token**（只显示一次！）

#### 4.2 配置 Token

打开 `js/app.js`，找到开头的配置区域：

```javascript
// ==================== 配置区 ====================
const CONFIG = {
  // GitHub 配置
  github: {
    owner: '你的GitHub用户名',     // ← 改成你的
    repo: 'birthday-lq',            // ← 改成你的仓库名
    token: 'ghp_xxxxxxxxxxxx',      // ← 粘贴你的 token
    label: 'birthday-comment',
  },
  // ...
};
```

#### 4.3 开启 Issues 功能

1. 进入仓库 → **Settings** → **General**
2. 往下滚动找到 **Features**
3. 确保 **Issues** ✅ 已勾选

### 第五步：配置照片上传（Cloudinary）

#### 5.1 注册 Cloudinary

1. 打开 [Cloudinary](https://cloudinary.com)
2. 点击 **Sign Up** 免费注册
3. 注册后获得 **Cloud Name**

#### 5.2 创建 Upload Preset

1. 进入 [Cloudinary Console](https://console.cloudinary.com)
2. 左侧菜单 → **Settings** → **Upload**
3. 往下滚动到 **Upload presets**
4. 点击 **Add upload preset**
5. 配置：
   - **Preset name**：填写 `birthday_photos`
   - **Signing Mode**：选择 `Unsigned`
   - **Folder**：填写 `birthday-lq-photos`
   - 其他保持默认
6. 点击 **Save**

#### 5.3 配置 Cloudinary

打开 `js/app.js`，在配置区域：

```javascript
cloudinary: {
  cloudName: '你的cloud_name',     // ← 改成你的
  uploadPreset: 'birthday_photos',  // ← 改成你的 preset 名称
  folder: 'birthday-lq-photos',
},
```

### 第六步：添加上传视频和音乐

由于 GitHub 限制单文件 100MB，视频和音乐推荐使用 Git LFS：

```bash
# 安装 Git LFS（只需一次）
git lfs install

# 追踪大文件
git lfs track "*.mp4"
git lfs track "music/*.mp3"

# 添加并提交
git add .gitattributes
git add HBD.mp4 music/birthday.mp3
git commit -m "添加视频和音乐"
git push
```

或者直接把视频上传到 Cloudinary，在代码中使用链接。

---

## 修改文字内容

打开 `index.html`，搜索以下内容即可修改：

| 修改项 | 搜索关键词 |
|--------|-----------|
| 大标题 | `迎接李晴的22岁` |
| 副标题 | `愿22岁的你` |
| 视频标题 | `大家送给李晴的生日纪念` |
| 留言区标题 | `留下你的祝福` |
| 照片区标题 | `我们的回忆` |
| 底部文字 | `22岁的故事` |

---

## 更换主题颜色

打开 `css/style.css`，找到 `:root` 选择器：

```css
:root {
  --pink: #FF6B9D;
  --pink-light: #FF85B3;
  --pink-pale: #FFD1E0;
  --purple: #C9B1DB;
  --purple-light: #E8D5F5;
  --bg: #FFF5F0;
  --gold: #FFD700;
  --white: #FFFFFF;
  /* ... */
}
```

修改这些变量的值即可全局换色。

---

## 安全注意事项

⚠️ **GitHub Token 会被暴露！**

因为这是纯前端静态网站，token 写在 JS 代码中，任何查看网页源代码的人都能看到。

**缓解措施**：

1. 使用 Classic Token，只勾选 `public_repo`（仅能操作公开仓库）
2. 创建专用 GitHub 账号作为"留言机器人"
3. 定期轮换 token
4. 如果非常在意安全，可使用 Cloudflare Workers / Vercel Functions 做代理

---

## 技术栈

- 纯 HTML + CSS + JavaScript
- GitHub REST API（留言存储）
- Cloudinary Upload API（照片存储）
- Canvas API（粒子特效）
- Intersection Observer（滚动动画）

---

## 许可证

MIT — 祝你生日快乐 🎉
