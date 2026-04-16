# 响应式个人博客网站 Bug修复指令

## 项目背景

这是一个使用原生 HTML + CSS + JavaScript 构建的响应式个人博客网站，包含首页、文章列表页、文章详情页、关于我页面。项目采用 ES6 Module 模块化设计，CSS 使用 BEM 命名规范。

## 需要修复的Bug列表

请按照以下顺序修复所有Bug，每修复一个Bug后进行测试验证。
## Bug 1: 轮播图不会自动切换

### 问题描述
首页轮播图无法自动播放，即使设置了 `autoPlay: true` 和 5秒间隔。

### 问题位置
- 文件：`modules/carousel.js`
- 相关文件：`js/main.js` 中的 `initCarousel()` 函数
---

## Bug 2: 点击轮播图指示器（三个点）不能切换图片

### 问题描述
点击轮播图底部的圆形指示器无法切换到对应的幻灯片。

### 问题位置
- 文件：`css/components/carousel.css`
---

## Bug 3: 文章列表页不显示文章

### 问题描述
访问 `pages/articles.html` 页面时，文章列表区域为空，没有任何文章显示。

### 问题位置
- 文件：`js/main.js` 中的 `renderArticlesList()` 函数
- 文件：`js/data.js` 中的数据导出

---
## Bug 4: 搜索功能不工作

### 问题描述
点击搜索图标打开搜索模态框后，输入关键词无法搜索到结果，或搜索结果高亮不可见。

### 问题位置
- 文件：`modules/search.js`
- 文件：`css/components/search-modal.css`
---

## Bug 6: 分页组件重复初始化

### 问题描述
每次调用 `renderArticlesList()` 都会创建新的 Pagination 实例，导致事件监听器重复绑定。

### 问题位置
- 文件：`js/main.js` 中的 `renderArticlesList()` 函数
---

## 注意事项

1. **不要引入任何第三方库**，所有修复必须使用原生 JavaScript 和 CSS
2. **保持代码风格一致**，遵循 BEM 命名规范和 ES6+ 语法
3. **所有函数必须有 JSDoc 注释**
4. **不要添加内联样式**，所有样式必须放在 CSS 文件中
5. **修复后确保不影响其他功能**
