/**
 * 阅读历史记录模块
 * 处理用户阅读历史的记录和展示
 */
const STORAGE_KEY = 'blog_reading_history';
const MAX_HISTORY = 10;

class History {
  constructor() {
    this.history = this.loadHistory();
  }

  /**
   * 从 localStorage 加载历史记录
   * @returns {Array} 历史记录数组
   */
  loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('加载历史记录失败:', e);
      return [];
    }
  }

  /**
   * 保存历史记录到 localStorage
   */
  saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  }

  /**
   * 添加阅读记录
   * @param {number|string} articleId - 文章ID
   * @param {string} articleTitle - 文章标题
   * @param {string} articleUrl - 文章URL
   */
  addRecord(articleId, articleTitle, articleUrl) {
    const now = Date.now();

    this.history = this.history.filter(item => item.id !== articleId);

    this.history.unshift({
      id: articleId,
      title: articleTitle,
      url: articleUrl,
      timestamp: now
    });

    if (this.history.length > MAX_HISTORY) {
      this.history = this.history.slice(0, MAX_HISTORY);
    }

    this.saveHistory();
  }

  /**
   * 清空所有历史记录
   */
  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  /**
   * 获取所有历史记录
   * @returns {Array} 历史记录数组
   */
  getHistory() {
    return this.history;
  }

  /**
   * 格式化相对时间
   * @param {number} timestamp - 时间戳
   * @returns {string} 格式化后的相对时间
   */
  formatRelativeTime(timestamp) {
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
    } else {
      const days = Math.floor(diff / day);
      return `${days}天前`;
    }
  }

  /**
   * 渲染历史记录列表
   * @param {HTMLElement} container - 容器元素
   */
  renderHistory(container) {
    if (!container) return;

    if (this.history.length === 0) {
      container.innerHTML = '<p class="history__empty">暂无阅读记录</p>';
      return;
    }

    const html = this.history.map(item => `
      <a href="${item.url}" class="history__item">
        <div class="history__item-content">
          <h4 class="history__item-title">${item.title}</h4>
          <span class="history__item-time">${this.formatRelativeTime(item.timestamp)}</span>
        </div>
      </a>
    `).join('');

    container.innerHTML = html;
  }
}

export { History };
