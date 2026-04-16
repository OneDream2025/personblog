/**
 * 阅读历史模块
 * 自动记录用户浏览轨迹，支持 localStorage 持久化
 */

const HISTORY_STORAGE_KEY = 'blog_read_history';
const MAX_HISTORY_COUNT = 10;

/**
 * History 类 - 管理阅读历史
 */
export class History {
  /**
   * 创建阅读历史实例
   * @param {HTMLElement} container - 历史记录容器元素
   */
  constructor(container) {
    this.container = container;
    this.histories = this.getHistories();
    this.init();
  }

  /**
   * 初始化历史记录组件
   */
  init() {
    this.render();
    this.bindEvents();
  }

  /**
   * 渲染历史记录列表
   */
  render() {
    if (this.histories.length === 0) {
      this.container.innerHTML = `
        <section class="history">
          <div class="history__header">
            <h3 class="history__title">最近阅读</h3>
          </div>
          <div class="history__empty">
            暂无阅读记录
          </div>
        </section>
      `;
      return;
    }

    const historyItems = this.histories.map(item => `
      <div class="history__item">
        <img src="${item.image}" alt="${item.title}" class="history__item-image" loading="lazy">
        <div class="history__item-content">
          <h4 class="history__item-title">
            <a href="${this.getArticleUrl(item.url)}">${item.title}</a>
          </h4>
          <span class="history__item-time">${this.formatTime(item.timestamp)}</span>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <section class="history">
        <div class="history__header">
          <h3 class="history__title">最近阅读</h3>
          <button class="history__clear" aria-label="清空历史">清空历史</button>
        </div>
        <div class="history__list">
          ${historyItems}
        </div>
      </section>
    `;
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    const clearBtn = this.container.querySelector('.history__clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearHistory();
      });
    }
  }

  /**
   * 清空历史记录
   */
  clearHistory() {
    this.histories = [];
    this.saveHistories();
    this.render();
  }

  /**
   * 格式化时间为相对时间
   * @param {number} timestamp - 时间戳
   * @returns {string} 格式化后的时间字符串
   */
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;

    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return `${minutes}分钟前`;
    } else if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours}小时前`;
    } else if (diff < week) {
      const days = Math.floor(diff / day);
      return `${days}天前`;
    } else if (diff < month) {
      const weeks = Math.floor(diff / week);
      return `${weeks}周前`;
    } else {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  }

  /**
   * 获取正确的文章URL路径
   * @param {string} url - 原始URL
   * @returns {string} 修正后的URL
   */
  getArticleUrl(url) {
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    if (isInPagesDirectory) {
      return url.replace('pages/', '');
    }
    return url;
  }

  /**
   * 获取历史记录
   * @returns {Array} 历史记录数组
   */
  getHistories() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 保存历史记录到 localStorage
   */
  saveHistories() {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.histories));
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  }

  /**
   * 静态方法：添加阅读记录
   * @param {Object} article - 文章数据
   */
  static addHistory(article) {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      let histories = data ? JSON.parse(data) : [];

      const existingIndex = histories.findIndex(item => item.id === article.id);
      if (existingIndex !== -1) {
        histories.splice(existingIndex, 1);
      }

      const historyItem = {
        id: article.id,
        title: article.title,
        image: article.image,
        url: article.url,
        timestamp: Date.now()
      };

      histories.unshift(historyItem);

      if (histories.length > MAX_HISTORY_COUNT) {
        histories = histories.slice(0, MAX_HISTORY_COUNT);
      }

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(histories));
    } catch (e) {
      console.error('添加阅读记录失败:', e);
    }
  }

  /**
   * 静态方法：获取历史记录
   * @returns {Array} 历史记录数组
   */
  static getHistories() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 静态方法：清空历史记录
   */
  static clearAllHistory() {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error('清空历史记录失败:', e);
    }
  }
}
