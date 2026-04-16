/**
 * 主入口文件
 * 初始化所有模块
 */
import { Carousel } from '../modules/carousel.js';
import { Navigation } from '../modules/navigation.js';
import { Search } from '../modules/search.js';
import { Pagination } from '../modules/pagination.js';
import { TableOfContents } from '../modules/toc.js';
import { BackToTop } from '../modules/back-to-top.js';
import { ThemeToggle } from '../modules/theme.js';
import { LazyLoad } from '../modules/lazyload.js';
import { Skeleton } from '../modules/skeleton.js';
import { articles, getArticles, getArticleById, getRelatedArticles, categories, tags, recommendedArticles } from './data.js';
import { likeManager, createCardLikeHTML, createDetailLikeHTML, bindCardLikeEvents, bindDetailLikeEvents } from '../modules/like.js';
import { historyManager, renderHistory, recordArticleView } from '../modules/history.js';

const APP_STATE = {
  currentPage: 1,
  currentCategory: null,
  currentTag: null,
  searchKeyword: null,
  paginationInstance: null
};

/**
 * 初始化应用
 */
function initApp() {
  initTheme();
  initNavigation();
  initSearch();
  initBackToTop();
  initLazyLoad();
  
  const pageType = document.body.dataset.page;
  
  switch (pageType) {
    case 'home':
      initHomePage();
      break;
    case 'articles':
      initArticlesPage();
      break;
    case 'detail':
      initDetailPage();
      break;
    case 'about':
      initAboutPage();
      break;
  }
}

/**
 * 初始化主题切换
 */
function initTheme() {
  const themeToggleBtn = document.querySelector('.header__theme-toggle');
  if (themeToggleBtn) {
    new ThemeToggle(themeToggleBtn);
  }
}

/**
 * 初始化导航
 */
function initNavigation() {
  const header = document.querySelector('.header');
  if (header) {
    new Navigation(header);
  }
}

/**
 * 初始化搜索
 */
function initSearch() {
  const searchBtn = document.querySelector('.header__search-btn');
  const searchModal = document.querySelector('.search-modal');
  
  if (searchBtn && searchModal) {
    new Search(searchBtn, searchModal, articles);
  }
}

/**
 * 初始化返回顶部
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    new BackToTop(backToTopBtn);
  }
}

/**
 * 初始化懒加载
 */
function initLazyLoad() {
  new LazyLoad();
}

/**
 * 初始化首页
 */
function initHomePage() {
  initCarousel();
  renderLatestArticles();
}

/**
 * 初始化轮播图
 */
function initCarousel() {
  const carouselContainer = document.querySelector('.carousel');
  if (carouselContainer) {
    new Carousel(carouselContainer, {
      autoPlay: true,
      interval: 5000
    });
  }
}

/**
 * 渲染最新文章
 */
function renderLatestArticles() {
  const container = document.querySelector('.page-home__articles');
  if (!container) return;

  const latestArticles = articles.slice(0, 6);
  const html = latestArticles.map(article => createArticleCard(article)).join('');

  container.innerHTML = html;
  bindCardLikeEvents(container, likeManager);
  new LazyLoad();
}

/**
 * 初始化文章列表页
 */
function initArticlesPage() {
  renderSidebar();
  renderArticlesList();
  initFilters();
  initHistory();
}

/**
 * 渲染侧边栏
 */
function renderSidebar() {
  const categoriesContainer = document.querySelector('.sidebar__categories');
  const tagsContainer = document.querySelector('.sidebar__tags');
  const recommendedContainer = document.querySelector('.sidebar__recommended');
  
  if (categoriesContainer) {
    const html = categories.map(cat => `
      <a href="#" class="sidebar__category" data-category="${cat.name}">
        <span>${cat.name}</span>
        <span class="sidebar__count">${cat.count}</span>
      </a>
    `).join('');
    categoriesContainer.innerHTML = html;
  }
  
  if (tagsContainer) {
    const html = tags.map(tag => `
      <a href="#" class="sidebar__tag" data-tag="${tag}">${tag}</a>
    `).join('');
    tagsContainer.innerHTML = html;
  }
  
  if (recommendedContainer) {
    const html = recommendedArticles.map(article => `
      <div class="sidebar__recommended-item">
        <img src="${article.image}" alt="${article.title}" class="sidebar__recommended-image" loading="lazy">
        <div class="sidebar__recommended-content">
          <h4 class="sidebar__recommended-title">
            <a href="${getArticleUrl(article.url)}">${article.title}</a>
          </h4>
          <span class="sidebar__recommended-date">${article.date}</span>
        </div>
      </div>
    `).join('');
    recommendedContainer.innerHTML = html;
  }
}

/**
 * 渲染文章列表
 */
function renderArticlesList() {
  const container = document.querySelector('.page-articles__list');
  const paginationContainer = document.querySelector('.pagination');
  const articleCount = document.getElementById('article-count');

  if (!container) return;

  const result = getArticles({
    page: APP_STATE.currentPage,
    pageSize: 10,
    category: APP_STATE.currentCategory,
    tag: APP_STATE.currentTag,
    keyword: APP_STATE.searchKeyword
  });

  const html = result.data.map(article => createArticleCardHorizontal(article)).join('');
  container.innerHTML = html;

  if (articleCount) {
    articleCount.textContent = result.total;
  }

  if (paginationContainer) {
    if (APP_STATE.paginationInstance) {
      APP_STATE.paginationInstance.update({
        totalItems: result.total,
        currentPage: APP_STATE.currentPage
      });
    } else {
      APP_STATE.paginationInstance = new Pagination(paginationContainer, {
        totalItems: result.total,
        itemsPerPage: 10,
        currentPage: APP_STATE.currentPage
      }, (page) => {
        APP_STATE.currentPage = page;
        renderArticlesList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  bindCardLikeEvents(container, likeManager);
  new LazyLoad();
}

/**
 * 初始化筛选功能
 */
function initFilters() {
  document.addEventListener('click', (e) => {
    const categoryLink = e.target.closest('.sidebar__category');
    const tagLink = e.target.closest('.sidebar__tag');
    
    if (categoryLink) {
      e.preventDefault();
      const category = categoryLink.dataset.category;
      
      document.querySelectorAll('.sidebar__category').forEach(el => {
        el.classList.toggle('sidebar__category--active', el === categoryLink);
      });
      
      APP_STATE.currentCategory = APP_STATE.currentCategory === category ? null : category;
      APP_STATE.currentPage = 1;
      renderArticlesList();
    }
    
    if (tagLink) {
      e.preventDefault();
      const tag = tagLink.dataset.tag;
      
      document.querySelectorAll('.sidebar__tag').forEach(el => {
        el.classList.toggle('sidebar__tag--active', el === tagLink);
      });
      
      APP_STATE.currentTag = APP_STATE.currentTag === tag ? null : tag;
      APP_STATE.currentPage = 1;
      renderArticlesList();
    }
  });
  
  const searchInput = document.querySelector('.page-articles__search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        APP_STATE.searchKeyword = e.target.value.trim() || null;
        APP_STATE.currentPage = 1;
        renderArticlesList();
      }, 300);
    });
  }
}

/**
 * 初始化文章详情页
 */
function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  if (!articleId) {
    window.location.href = '../index.html';
    return;
  }

  const article = getArticleById(articleId);

  if (!article) {
    window.location.href = '../index.html';
    return;
  }

  recordArticleView(historyManager, article);
  
  renderArticleDetail(article);
  initTableOfContents();
  renderRelatedArticles(article.id);
}

/**
 * 渲染文章详情
 * @param {Object} article - 文章数据
 */
function renderArticleDetail(article) {
  const container = document.querySelector('.article');
  if (!container) return;

  document.title = `${article.title} - 个人博客`;

  likeManager.initBaseCount(article.id, article.likes || 0);
  const likeCount = likeManager.getLikeCount(article.id);
  const hasLiked = likeManager.hasLiked(article.id);
  const likeHTML = createDetailLikeHTML(article.id, likeCount, hasLiked);

  container.innerHTML = `
    <header class="article__header">
      <span class="article__category">${article.category}</span>
      <h1 class="article__title">${article.title}</h1>
      <div class="article__meta">
        <span class="article__meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          ${article.author}
        </span>
        <span class="article__meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          ${article.date}
        </span>
        <span class="article__meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          ${article.views} 阅读
        </span>
        <span class="article__meta-item article__meta-like">
          ${likeHTML}
        </span>
      </div>
      <div class="article__tags">
        ${article.tags.map(tag => `<span class="article__tag">${tag}</span>`).join('')}
      </div>
    </header>
    <img src="${article.image}" alt="${article.title}" class="article__featured-image" loading="lazy">
    <div class="article__content">
      ${parseMarkdown(article.content)}
    </div>
    <section class="article__related">
      <h3 class="article__related-title">相关文章</h3>
      <div class="grid grid--3 article__related-list"></div>
    </section>
  `;

  const likeBtn = container.querySelector('.article__like');
  bindDetailLikeEvents(likeBtn, likeManager);

  new LazyLoad();
}

/**
 * 简单的 Markdown 解析
 * @param {string} markdown - Markdown 文本
 * @returns {string} HTML 字符串
 */
function parseMarkdown(markdown) {
  let html = markdown;
  
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/## (.*)/g, '<h2>$1</h2>');
  html = html.replace(/### (.*)/g, '<h3>$1</h3>');
  html = html.replace(/#### (.*)/g, '<h4>$1</h4>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[234]>)/g, '$1');
  html = html.replace(/(<\/h[234]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  
  return html;
}

/**
 * 初始化目录
 */
function initTableOfContents() {
  const tocContainer = document.querySelector('.toc');
  const articleContent = document.querySelector('.article__content');
  
  if (tocContainer && articleContent) {
    new TableOfContents(tocContainer, articleContent);
  }
}

/**
 * 渲染相关文章
 * @param {number} articleId - 当前文章ID
 */
function renderRelatedArticles(articleId) {
  const container = document.querySelector('.article__related-list');
  if (!container) return;

  const relatedArticles = getRelatedArticles(articleId, 3);
  const html = relatedArticles.map(article => createArticleCard(article)).join('');

  container.innerHTML = html;
  bindCardLikeEvents(container, likeManager);
  new LazyLoad();
}

/**
 * 初始化关于我页面
 */
function initAboutPage() {
  animateSkillBars();
}

/**
 * 初始化阅读历史记录
 */
function initHistory() {
  const historyContainer = document.querySelector('.sidebar__history');
  if (historyContainer) {
    renderHistory(historyContainer, historyManager);
  }
}

/**
 * 动画显示技能进度条
 */
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill__progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target.dataset.progress;
        entry.target.style.width = progress + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => {
    observer.observe(bar);
  });
}

/**
 * 获取正确的文章URL路径
 * @param {string} url - 原始URL
 * @returns {string} 修正后的URL
 */
function getArticleUrl(url) {
  const isInPagesDirectory = window.location.pathname.includes('/pages/');
  if (isInPagesDirectory) {
    return url.replace('pages/', '');
  }
  return url;
}

/**
 * 创建文章卡片 HTML
 * @param {Object} article - 文章数据
 * @returns {string} HTML 字符串
 */
function createArticleCard(article) {
  const likeCount = likeManager.getLikeCount(article.id);
  const hasLiked = likeManager.hasLiked(article.id);
  const likeHTML = createCardLikeHTML(article.id, likeCount, hasLiked);

  return `
    <article class="card">
      <div class="card__image-wrapper">
        <img src="${article.image}" alt="${article.title}" class="card__image" loading="lazy">
      </div>
      <div class="card__body">
        <span class="card__category">${article.category}</span>
        <h3 class="card__title">
          <a href="${getArticleUrl(article.url)}">${article.title}</a>
        </h3>
        <p class="card__excerpt">${article.excerpt}</p>
        <div class="card__meta">
          <div class="card__meta-left">
            <span class="card__date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${article.date}
            </span>
            <span class="card__views">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              ${article.views}
            </span>
          </div>
          <div class="card__meta-right">
            ${likeHTML}
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * 创建水平文章卡片 HTML
 * @param {Object} article - 文章数据
 * @returns {string} HTML 字符串
 */
function createArticleCardHorizontal(article) {
  const likeCount = likeManager.getLikeCount(article.id);
  const hasLiked = likeManager.hasLiked(article.id);
  const likeHTML = createCardLikeHTML(article.id, likeCount, hasLiked);

  return `
    <article class="card card--horizontal">
      <div class="card__image-wrapper">
        <img src="${article.image}" alt="${article.title}" class="card__image" loading="lazy">
      </div>
      <div class="card__body">
        <span class="card__category">${article.category}</span>
        <h3 class="card__title">
          <a href="${getArticleUrl(article.url)}">${article.title}</a>
        </h3>
        <p class="card__excerpt">${article.excerpt}</p>
        <div class="card__meta">
          <div class="card__meta-left">
            <span class="card__date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${article.date}
            </span>
            <span class="card__views">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              ${article.views}
            </span>
          </div>
          <div class="card__meta-right">
            ${likeHTML}
          </div>
        </div>
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', initApp);
