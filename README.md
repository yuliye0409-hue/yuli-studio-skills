# Yuli Studio · V4

个人项目、Skills 与创作手记网站。内容保留「产品 / Skills / 文章 / 关于我 / 交流」五个入口，视觉按确认的 `DESIGN (2).md` 实现；完整规范保存在 `docs/design-spec.md`。

## 在线访问与跨设备编辑

- 网站：https://yuliye0409-hue.github.io/yuli-studio-skills/
- 源码：https://github.com/yuliye0409-hue/yuli-studio-skills
- 浏览器编辑器：https://github.dev/yuliye0409-hue/yuli-studio-skills

在其他设备登录同一个 GitHub 账号，打开浏览器编辑器，修改文件后在「源代码管理」中填写说明并选择 Commit & Push（提交并推送）。提交到 `master` 后，GitHub Actions 会自动测试并发布到 Pages；可在仓库 Actions 页查看进度。尚未提交的编辑只保存在当前浏览器，不会自动同步到其他设备。

常用修改位置：内容在 `data.js`，外部链接在 `public/site.config.js`，站名与品牌资源也集中维护。浏览器编辑器不运行本地服务器，可在部署完成后刷新在线网站验证。技能收藏仍属于各浏览器的本地数据，不会随 GitHub 源码同步。

这是独立的技能库仓库，不覆盖账号内已有的 `yuli-studio` 网站。

## 品牌

站名为 Yuli Studio，采用独立绘制的几何 Y 字标。页头、页脚和交流面板共用 `public/logo.svg`；浏览器标签图标为同款 `public/favicon.svg`。保留内部项目 ID 和本地收藏键，避免影响现有绑定与收藏。

## 这次的设计

- 使用 Vercel-inspired 的黑白灰体系，替换旧版奶油色、珊瑚色和衬线字体。
- 居中首屏，蓝青 / 紫粉 / 红金组成的大面积 CSS mesh 渐变只作为首屏氛围，不用于小图标。
- Geist / Geist Mono 字体，展示标题字重最高 600；按钮为黑色与白色的胶囊形，导航按钮采用紧凑圆角。
- 白色卡片、细灰边框和多层轻阴影；黑色工作台与邀请区域，白色四列页脚。
- 保持无人物形象，不加载原 IP 图片；品牌图标是独立的几何 Y 字标，不复制 Vercel 品牌标志。
- 首屏工作台可切换三个真实的示例技能，并打开详情与可复制提示词。
- 桌面三列、平板两列、手机单列；断点为 960px / 600px。小于 600px 的导航变成全屏菜单，内容页签允许横向滚动。

## 本地启动

需要 Node.js 20+，没有运行时 npm 依赖。

```sh
node server.mjs
```

默认地址：`http://127.0.0.1:4317/?v=4`。端口占用可设置 `PORT`。开发服务仅监听本机；公网版本由 GitHub Pages 提供。

## 内容与功能

| 入口 | 内容 |
|---|---|
| 产品 | 当前站点介绍、两个标明「示例展示位」的项目；详情与产品/配置预览切换 |
| Skills | 八个示例技能，分类、搜索、浏览器收藏、提示词复制与三个关联工作流 |
| 文章 | 三篇明确标记的示例草稿，提供完整阅读视图，不编造发布日期 |
| 关于我 | 无人物的创作理念卡，可替换的个人介绍；不编造经历 |
| 交流 | 联系方式的待补充状态、交流方向、可复制提纲；不会假装发送成功 |

支持 `#products`、`#skills`、`#articles`、`#about`、`#connect` 深链接和浏览器前进/后退。
按 `/` 或 `Ctrl/Cmd + K` 搜索技能。主内容页签支持方向键、Home、End；弹窗支持 Escape、关闭后恢复焦点。

收藏沿用 `skill-garden:saved` 本地存储键，不会因为本次改版丢失；浏览器禁用存储时，收藏仍在本次访问有效，并给出提示。无后端、账户或跨设备同步。

## GitHub 与其他链接

**所有外部地址在 `public/site.config.js` 维护，无需改布局。**

```js
profile: {
  github: 'https://github.com/yuliye0409-hue',
  email: null,         // 真实邮箱，不带 mailto:
  bilibili: null,
  xiaohongshu: null,
},
projects: {
  'skill-garden': {
    repository: 'https://github.com/yuliye0409-hue/yuli-studio-skills',
    demo: 'https://yuliye0409-hue.github.io/yuli-studio-skills/',
  },
  'creative-workbench': { repository: null, demo: null },
  'automation-kit': { repository: null, demo: null },
},
skills: {
  'prompt-architect': null, // 每个技能都有独立仓库位置
  // ...
},
```

- `repository` 只接受 HTTPS GitHub 仓库根路径；`demo` 单独绑定 HTTPS 演示地址。
- 未提供时保持 `null`，显示「GitHub 待绑定」，不创建虚构的跳转。
- 外部地址拒绝危险协议、凭据和异常端口；新窗口带 `noopener noreferrer`。
- 后续提供「项目名称 + 仓库地址 + 在线演示（可选）」即可接入。
- 真实项目和示例不同时，一并替换 `data.js` 中对应项目名称、简介、标签。

## 文件分工

| 文件 | 用途 |
|---|---|
| `docs/design-spec.md` | 本次确认的 DESIGN (2).md 原文，仅作为视觉参考 |
| `public/design-tokens.css` | 颜色、字体、圆角、间距和分层阴影 |
| `public/site.config.js` | 站点名称、版本、联系方式、项目和技能仓库 |
| `styles.css` | 本次重写的组件样式、渐变和响应式布局，不叠加旧主题覆盖 |
| `index.html` | 居中首屏、工作台布局、五个内容面板与页脚 |
| `app.js` | 详情、页面切换、搜索、收藏、复制、技能预览 |
| `data.js` | 项目、示例技能、工作流、文章内容 |
| `public/links.js` | 外部链接验证 |
| `server.mjs` | 本地静态服务，不公开备份和文档目录 |
| `scripts/build-site.mjs` | 仅复制公开网站文件到 `_site/` |
| `.github/workflows/pages.yml` | 提交后自动测试、构建和发布 |

网页字体通过 Google Fonts 加载，包含中文后备字体。字体联网失败时，系统无衬线与等宽字体仍可使用。页面不需要下载远程图片或登录。

## 验证

```sh
node --check app.js
node --check data.js
node --test tests/*.test.mjs
```

浏览器回归脚本：`scripts/browser-qa.mjs`，需要 Playwright 和 Chromium 浏览器。
可用 `PLAYWRIGHT_MODULE` 指向外部安装的 Playwright，`BROWSER_CHANNEL=msedge` 复用已安装 Edge。

覆盖首屏预览、五个面板、搜索、收藏、复制、文章阅读、工作流、键盘、历史导航、无人物请求，以及 320 / 390 / 600 / 768 / 960 / 1024 / 1440px 布局和导航断点。
通过网络拦截模拟未来绑定，不修改真实配置、不访问示例仓库。截图输出到 `artifacts/yuli-studio/`，该目录被 Git 忽略。

## 构建与发布

V1 / V2 / V3 的源码分别保留在 `.history/` 下，V3 位于 `.history/v3-2026-10-30/`，可回看或恢复。这些目录不被本地服务公开，也不加入 Git。

运行 `node scripts/build-site.mjs`，生成 `_site/` 静态目录。构建采用明确白名单，只发布 `index.html`、`styles.css`、`app.js`、`data.js` 与 `public/`；不发布源码备份、文档、测试、开发服务器或截图。

资源使用相对路径，兼容 GitHub Pages 的 `/yuli-studio-skills/` 仓库子目录。工作流使用 GitHub 托管的 Pages 凭据，无需在源码中放置密钥。仓库为公开仓库，任何人可以查看已提交的源代码；不要提交密码、令牌或私人资料。
