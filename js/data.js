/**
 * 模拟文章数据
 */
export const articles = [
  {
    id: 1,
    title: '深入理解 JavaScript 异步编程',
    excerpt: '本文将深入探讨 JavaScript 中的异步编程机制，包括回调函数、Promise、async/await 等核心概念，帮助你更好地理解和运用异步编程。',
    content: `
## 什么是异步编程

JavaScript 是一门单线程语言，这意味着它一次只能执行一个任务。然而，在现代 Web 开发中，我们需要处理大量的异步操作，如网络请求、文件读取、定时器等。异步编程让我们能够在等待这些操作完成的同时，继续执行其他代码。

## 回调函数

回调函数是最基本的异步处理方式。它将一个函数作为参数传递给另一个函数，在异步操作完成后调用。

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('数据已获取');
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
\`\`\`

然而，回调函数存在"回调地狱"的问题，当代码嵌套层级过深时，可读性和维护性都会大大降低。

## Promise

Promise 是 ES6 引入的异步编程解决方案，它代表一个异步操作的最终完成或失败。

\`\`\`javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('数据已获取');
    }, 1000);
  });
}

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

## async/await

async/await 是 ES2017 引入的语法糖，让异步代码看起来像同步代码一样清晰。

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
\`\`\`

## 总结

异步编程是 JavaScript 开发中不可或缺的一部分。从回调函数到 Promise，再到 async/await，每种方式都有其适用场景。在现代开发中，推荐优先使用 async/await，它能让代码更加清晰易读。
    `,
    category: '前端开发',
    tags: ['JavaScript', '异步编程', 'Promise'],
    author: '张三',
    date: '2026-04-10',
    views: 1256,
    image: 'https://picsum.photos/800/450?random=1',
    url: 'pages/detail.html?id=1'
  },
  {
    id: 2,
    title: 'CSS Grid 布局完全指南',
    excerpt: 'CSS Grid 是现代网页布局的强大工具，本文将全面介绍 Grid 布局的核心概念、属性和实际应用场景。',
    content: `
## CSS Grid 简介

CSS Grid 是一种二维布局系统，可以同时处理行和列。相比传统的布局方式，Grid 提供了更强大、更灵活的布局能力。

## 基本概念

### 网格容器

将元素的 display 属性设置为 grid 或 inline-grid，它就变成了网格容器。

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 200px;
  gap: 20px;
}
\`\`\`

### 网格项目

网格容器的直接子元素自动成为网格项目。

## 常用属性

- grid-template-columns: 定义列
- grid-template-rows: 定义行
- gap: 网格间距
- grid-area: 指定项目位置
- justify-items: 水平对齐
- align-items: 垂直对齐

## 实际应用

Grid 布局非常适合创建复杂的页面布局，如圣杯布局、卡片网格等。
    `,
    category: '前端开发',
    tags: ['CSS', 'Grid', '布局'],
    author: '张三',
    date: '2026-04-08',
    views: 892,
    image: 'https://picsum.photos/800/450?random=2',
    url: 'pages/detail.html?id=2'
  },
  {
    id: 3,
    title: '响应式设计最佳实践',
    excerpt: '随着移动设备的普及，响应式设计已成为现代网页开发的标配。本文分享响应式设计的核心原则和实用技巧。',
    content: `
## 移动优先策略

采用移动优先的设计策略，从小屏幕开始设计，然后逐步增强到大屏幕。这样可以确保核心内容在所有设备上都能正常展示。

## 媒体查询

媒体查询是响应式设计的核心技术。

\`\`\`css
/* 移动优先 */
.container {
  width: 100%;
  padding: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
\`\`\`

## 弹性单位

使用相对单位如 rem、em、vw、vh 等，让布局更具弹性。

## 图片适配

确保图片在各种屏幕尺寸下都能正确显示。

\`\`\`css
img {
  max-width: 100%;
  height: auto;
}
\`\`\`
    `,
    category: '前端开发',
    tags: ['响应式设计', 'CSS', '移动端'],
    author: '张三',
    date: '2026-04-05',
    views: 1567,
    image: 'https://picsum.photos/800/450?random=3',
    url: 'pages/detail.html?id=3'
  },
  {
    id: 4,
    title: 'Web 性能优化技巧',
    excerpt: '网站性能直接影响用户体验和 SEO 排名。本文介绍多种实用的性能优化技巧，帮助你打造更快的网站。',
    content: `
## 为什么性能很重要

研究表明，页面加载时间每增加 1 秒，转化率就会下降 7%。性能优化不仅能提升用户体验，还能改善 SEO 排名。

## 关键优化策略

### 1. 资源压缩

压缩 HTML、CSS、JavaScript 文件，减少文件体积。

### 2. 图片优化

- 使用现代图片格式（WebP、AVIF）
- 实现图片懒加载
- 使用响应式图片

### 3. 缓存策略

合理设置 HTTP 缓存头，减少重复请求。

### 4. 代码分割

将代码按需加载，减少首屏加载时间。

\`\`\`javascript
const module = await import('./heavy-module.js');
\`\`\`

### 5. CDN 加速

使用 CDN 分发静态资源，减少网络延迟。
    `,
    category: '性能优化',
    tags: ['性能', '优化', 'Web'],
    author: '张三',
    date: '2026-04-02',
    views: 2341,
    image: 'https://picsum.photos/800/450?random=4',
    url: 'pages/detail.html?id=4'
  },
  {
    id: 5,
    title: 'ES6+ 新特性详解',
    excerpt: 'ES6 及后续版本带来了许多强大的新特性。本文详细介绍这些新特性的用法和最佳实践。',
    content: `
## let 和 const

ES6 引入了块级作用域的变量声明方式。

\`\`\`javascript
let name = 'John';
const PI = 3.14159;
\`\`\`

## 箭头函数

箭头函数提供了更简洁的函数语法，并且自动绑定 this。

\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

## 解构赋值

可以从数组或对象中提取值并赋给变量。

\`\`\`javascript
const { name, age } = person;
const [first, second] = array;
\`\`\`

## 模板字符串

使用反引号创建包含变量和表达式的字符串。

\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

## 扩展运算符

用于展开数组或对象。

\`\`\`javascript
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProp: value };
\`\`\`
    `,
    category: '前端开发',
    tags: ['JavaScript', 'ES6', '新特性'],
    author: '张三',
    date: '2026-03-28',
    views: 1876,
    image: 'https://picsum.photos/800/450?random=5',
    url: 'pages/detail.html?id=5'
  },
  {
    id: 6,
    title: 'Git 工作流程最佳实践',
    excerpt: 'Git 是现代开发必备的版本控制工具。本文分享 Git 工作流程的最佳实践，提高团队协作效率。',
    content: `
## Git 分支策略

### Git Flow

Git Flow 是一种经典的分支策略，包含以下分支：

- master: 生产环境代码
- develop: 开发分支
- feature: 功能分支
- release: 发布分支
- hotfix: 热修复分支

### GitHub Flow

更简单的分支策略，适合持续部署：

1. 从 master 创建分支
2. 提交更改
3. 创建 Pull Request
4. 代码审查
5. 合并到 master

## 提交信息规范

使用规范的提交信息格式：

\`\`\`
feat: 添加用户登录功能
fix: 修复登录页面样式问题
docs: 更新 API 文档
style: 格式化代码
refactor: 重构用户模块
\`\`\`

## 常用命令

\`\`\`bash
git checkout -b feature/new-feature
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature
\`\`\`
    `,
    category: '开发工具',
    tags: ['Git', '版本控制', '协作'],
    author: '张三',
    date: '2026-03-25',
    views: 1432,
    image: 'https://picsum.photos/800/450?random=6',
    url: 'pages/detail.html?id=6'
  },
  {
    id: 7,
    title: '前端安全防护指南',
    excerpt: 'Web 安全是前端开发不可忽视的重要话题。本文介绍常见的安全威胁和防护措施。',
    content: `
## XSS 攻击

跨站脚本攻击（XSS）是最常见的 Web 安全威胁之一。

### 防护措施

- 对用户输入进行转义
- 使用 Content Security Policy (CSP)
- 避免使用 innerHTML

\`\`\`javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
\`\`\`

## CSRF 攻击

跨站请求伪造（CSRF）攻击者诱导用户执行非预期操作。

### 防护措施

- 使用 CSRF Token
- 验证 Referer 头
- SameSite Cookie 属性

## 点击劫持

攻击者将恶意页面嵌入 iframe 中，诱导用户点击。

### 防护措施

\`\`\`html
<meta http-equiv="X-Frame-Options" content="DENY">
\`\`\`
    `,
    category: '安全',
    tags: ['安全', 'XSS', 'CSRF'],
    author: '张三',
    date: '2026-03-20',
    views: 987,
    image: 'https://picsum.photos/800/450?random=7',
    url: 'pages/detail.html?id=7'
  },
  {
    id: 8,
    title: 'TypeScript 入门到精通',
    excerpt: 'TypeScript 为 JavaScript 添加了静态类型检查，让代码更加健壮。本文带你从入门到精通 TypeScript。',
    content: `
## 为什么选择 TypeScript

TypeScript 提供了静态类型检查，可以在编译阶段发现潜在错误，提高代码质量和开发效率。

## 基础类型

\`\`\`typescript
let name: string = 'John';
let age: number = 25;
let isActive: boolean = true;
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ['hello', 10];
\`\`\`

## 接口

接口用于定义对象的形状。

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

function greet(user: User) {
  console.log(\`Hello, \${user.name}\`);
}
\`\`\`

## 泛型

泛型让代码更加灵活和可复用。

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>('hello');
\`\`\`

## 类型断言

\`\`\`typescript
const value = someValue as string;
\`\`\`
    `,
    category: '前端开发',
    tags: ['TypeScript', '类型', 'JavaScript'],
    author: '张三',
    date: '2026-03-15',
    views: 2156,
    image: 'https://picsum.photos/800/450?random=8',
    url: 'pages/detail.html?id=8'
  },
  {
    id: 9,
    title: 'RESTful API 设计规范',
    excerpt: '良好的 API 设计是后端开发的重要基础。本文介绍 RESTful API 的设计原则和最佳实践。',
    content: `
## REST 架构风格

REST（Representational State Transfer）是一种软件架构风格，强调资源的表述和状态转移。

## 设计原则

### 使用名词表示资源

\`\`\`
GET /users          # 获取用户列表
GET /users/1        # 获取单个用户
POST /users         # 创建用户
PUT /users/1        # 更新用户
DELETE /users/1     # 删除用户
\`\`\`

### 使用正确的 HTTP 方法

- GET: 获取资源
- POST: 创建资源
- PUT: 更新资源（完整）
- PATCH: 更新资源（部分）
- DELETE: 删除资源

### 状态码规范

- 200: 成功
- 201: 创建成功
- 400: 请求错误
- 401: 未授权
- 404: 资源不存在
- 500: 服务器错误

### 响应格式

\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "John"
  }
}
\`\`\`
    `,
    category: '后端开发',
    tags: ['API', 'REST', '后端'],
    author: '张三',
    date: '2026-03-10',
    views: 1678,
    image: 'https://picsum.photos/800/450?random=9',
    url: 'pages/detail.html?id=9'
  },
  {
    id: 10,
    title: '前端工程化实践',
    excerpt: '前端工程化是提升开发效率的关键。本文分享前端工程化的实践经验，包括构建工具、代码规范等。',
    content: `
## 什么是前端工程化

前端工程化是指将软件工程的方法和思想应用于前端开发，提高开发效率和代码质量。

## 构建工具

### Webpack

功能强大的模块打包工具。

\`\`\`javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
};
\`\`\`

### Vite

新一代前端构建工具，开发体验极佳。

## 代码规范

### ESLint

JavaScript 代码检查工具。

### Prettier

代码格式化工具。

### Husky

Git hooks 工具，在提交前自动检查代码。

## 目录结构

\`\`\`
src/
├── components/
├── pages/
├── utils/
├── api/
├── assets/
└── styles/
\`\`\`
    `,
    category: '前端开发',
    tags: ['工程化', 'Webpack', 'Vite'],
    author: '张三',
    date: '2026-03-05',
    views: 1923,
    image: 'https://picsum.photos/800/450?random=10',
    url: 'pages/detail.html?id=10'
  },
  {
    id: 11,
    title: 'Node.js 后端开发入门',
    excerpt: 'Node.js 让 JavaScript 可以运行在服务端。本文介绍 Node.js 后端开发的基础知识和实践。',
    content: `
## Node.js 简介

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，让 JavaScript 可以脱离浏览器运行。

## 核心模块

### http 模块

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000);
\`\`\`

### fs 模块

\`\`\`javascript
const fs = require('fs').promises;

async function readFile() {
  const data = await fs.readFile('file.txt', 'utf8');
  console.log(data);
}
\`\`\`

## Express 框架

Express 是最流行的 Node.js Web 框架。

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000);
\`\`\`
    `,
    category: '后端开发',
    tags: ['Node.js', 'Express', '后端'],
    author: '张三',
    date: '2026-02-28',
    views: 1543,
    image: 'https://picsum.photos/800/450?random=11',
    url: 'pages/detail.html?id=11'
  },
  {
    id: 12,
    title: 'CSS 动画技巧大全',
    excerpt: '动画能为网页增添活力。本文介绍各种 CSS 动画技巧，让你的网页更加生动有趣。',
    content: `
## 过渡动画

transition 用于元素状态变化时的平滑过渡。

\`\`\`css
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}
\`\`\`

## 关帧动画

使用 @keyframes 定义复杂的动画序列。

\`\`\`css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeIn 0.5s ease forwards;
}
\`\`\`

## 变换属性

transform 属性可以实现旋转、缩放、倾斜等效果。

\`\`\`css
.rotate { transform: rotate(45deg); }
.scale { transform: scale(1.5); }
.skew { transform: skew(10deg); }
\`\`\`

## 性能优化

- 使用 transform 和 opacity（GPU 加速）
- 避免动画布局属性
- 使用 will-change 提示浏览器
    `,
    category: '前端开发',
    tags: ['CSS', '动画', '效果'],
    author: '张三',
    date: '2026-02-20',
    views: 1876,
    image: 'https://picsum.photos/800/450?random=12',
    url: 'pages/detail.html?id=12'
  }
];

/**
 * 分类数据
 */
export const categories = [
  { name: '前端开发', count: 8 },
  { name: '后端开发', count: 2 },
  { name: '性能优化', count: 1 },
  { name: '安全', count: 1 },
  { name: '开发工具', count: 1 }
];

/**
 * 标签数据
 */
export const tags = [
  'JavaScript', 'CSS', 'HTML', 'TypeScript', 'React', 'Vue',
  'Node.js', '性能', '安全', 'Git', 'Webpack', 'API'
];

/**
 * 推荐阅读数据
 */
export const recommendedArticles = articles.slice(0, 5);

/**
 * 获取文章列表
 * @param {Object} options - 查询选项
 * @returns {Object} 分页结果
 */
export function getArticles(options = {}) {
  const {
    page = 1,
    pageSize = 10,
    category = null,
    tag = null,
    keyword = null
  } = options;
  
  let filtered = [...articles];
  
  if (category) {
    filtered = filtered.filter(article => article.category === category);
  }
  
  if (tag) {
    filtered = filtered.filter(article => article.tags.includes(tag));
  }
  
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(lowerKeyword) ||
      article.excerpt.toLowerCase().includes(lowerKeyword)
    );
  }
  
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);
  
  return {
    data,
    total,
    page,
    pageSize,
    totalPages
  };
}

/**
 * 根据ID获取文章详情
 * @param {number} id - 文章ID
 * @returns {Object|null} 文章详情
 */
export function getArticleById(id) {
  return articles.find(article => article.id === parseInt(id)) || null;
}

/**
 * 获取相关文章
 * @param {number} articleId - 当前文章ID
 * @param {number} limit - 返回数量
 * @returns {Array} 相关文章列表
 */
export function getRelatedArticles(articleId, limit = 3) {
  const article = getArticleById(articleId);
  if (!article) return [];
  
  return articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, limit);
}
