/**
 * 阅读历史记录模块
 * 自动记录用户浏览轨迹，支持 localStorage 持久化存储
 * @module History
 */

/**
 * localStorage 存储键名
 * @constant {string}
 */
const STORAGE_KEY = 'blog_reading_history';

/**
 * 最大历史记录数量
 * @constant {number}
 */
const MAX_HISTORY_ITEMS = 10;

/**
 * 阅读历史管理类
 * @class HistoryManager
 */
export class HistoryManager {
  /**
   * 创建阅读历史管理器实例
   */
  constructor() {
    this.history = this.loadFromStorage();
  }

  /**
   * 从 localStorage 加载历史记录
   * @returns {Array} 历史记录数组
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('加载阅读历史失败:', error);
      return [];
    }
  }

  /**
   * 保存历史记录到 localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error('保存阅读历史失败:', error);
    }
  }

  /**
   * 添加文章到阅读历史
   * @param {Object} article - 文章对象
   * @param {string|number} article.id - 文章ID
   * @param {string} article.title - 文章标题
   * @param {string} article.image - 文章图片URL
   * @param {string} [article.url] - 文章链接
   */
  addArticle(article) {
    if (!article || !article.id) return;

    const historyItem = {
      id: String(article.id),
      title: article.title,
      image: article.image,
      url: article.url || `detail.html?id=${article.id}`,
      timestamp: Date.now()
    };

    const existingIndex = this.history.findIndex(item => item.id === historyItem.id);

    if (existingIndex !== -1) {
      this.history.splice(existingIndex, 1);
    }

    this.history.unshift(historyItem);

    if (this.history.length > MAX_HISTORY_ITEMS) {
      this.history = this.history.slice(0, MAX_HISTORY_ITEMS);
    }

    this.saveToStorage();
  }

  /**
   * 获取所有历史记录
   * @returns {Array} 历史记录数组
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * 清空所有历史记录
   */
  clearHistory() {
    this.history = [];
    this.saveToStorage();
  }

  /**
   * 获取历史记录数量
   * @returns {number} 历史记录数量
   */
  getCount() {
    return this.history.length;
  }
}

/**
 * 格式化相对时间
 * @param {number} timestamp - 时间戳
 * @returns {string} 格式化后的相对时间字符串
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}分钟前`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}小时前`;
  } else if (diff < 7 * day) {
    const days = Math.floor(diff / day);
    return `${days}天前`;
  } else {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
}

/**
 * 创建历史记录列表的 HTML
 * @param {Array} history - 历史记录数组
 * @returns {string} HTML 字符串
 */
export function createHistoryListHTML(history) {
  if (!history || history.length === 0) {
    return `
      <div class="history__empty">
        <svg class="history__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p class="history__empty-text">暂无阅读记录</p>
      </div>
    `;
  }

  const itemsHTML = history.map(item => `
    <a href="${item.url}" class="history__item" data-article-id="${item.id}">
      <img src="${item.image}" alt="${item.title}" class="history__item-image" loading="lazy">
      <div class="history__item-content">
        <h4 class="history__item-title">${item.title}</h4>
        <span class="history__item-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${formatRelativeTime(item.timestamp)}
        </span>
      </div>
    </a>
  `).join('');

  return `<div class="history__list">${itemsHTML}</div>`;
}

/**
 * 创建历史记录组件的完整 HTML
 * @param {Array} history - 历史记录数组
 * @returns {string} HTML 字符串
 */
export function createHistoryHTML(history) {
  const hasHistory = history && history.length > 0;

  return `
    <div class="history">
      <div class="history__header">
        <h3 class="history__title">最近阅读</h3>
        ${hasHistory ? `
          <button class="history__clear-btn" aria-label="清空历史记录">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            清空历史
          </button>
        ` : ''}
      </div>
      ${createHistoryListHTML(history)}
    </div>
  `;
}

/**
 * 渲染历史记录到指定容器
 * @param {HTMLElement} container - 容器元素
 * @param {HistoryManager} historyManager - 历史记录管理器实例
 * @param {Function} onClear - 清空历史回调函数
 */
export function renderHistory(container, historyManager, onClear) {
  if (!container) return;

  const history = historyManager.getHistory();
  container.innerHTML = createHistoryHTML(history);

  const clearBtn = container.querySelector('.history__clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      historyManager.clearHistory();
      renderHistory(container, historyManager, onClear);
      if (typeof onClear === 'function') {
        onClear();
      }
    });
  }
}

/**
 * 记录当前页面文章到历史
 * @param {HistoryManager} historyManager - 历史记录管理器实例
 * @param {Object} article - 文章数据
 */
export function recordArticleView(historyManager, article) {
  if (!historyManager || !article) return;
  historyManager.addArticle(article);
}

/**
 * 创建全局唯一的历史记录管理器实例
 * @type {HistoryManager}
 */
export const historyManager = new HistoryManager();
