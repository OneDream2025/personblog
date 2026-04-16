/**
 * 点赞模块
 * 提供文章点赞功能，支持 localStorage 持久化存储
 * @module Like
 */

/**
 * localStorage 存储键名
 * @constant {string}
 */
const STORAGE_KEY = 'blog_article_likes';

/**
 * 点赞管理类
 * @class LikeManager
 */
export class LikeManager {
  /**
   * 创建点赞管理器实例
   */
  constructor() {
    this.likesData = this.loadFromStorage();
  }

  /**
   * 从 localStorage 加载点赞数据
   * @returns {Object} 点赞数据对象，键为文章ID，值为点赞数
   */
  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('加载点赞数据失败:', error);
      return {};
    }
  }

  /**
   * 保存点赞数据到 localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.likesData));
    } catch (error) {
      console.error('保存点赞数据失败:', error);
    }
  }

  /**
   * 获取文章的点赞数
   * @param {string|number} articleId - 文章ID
   * @returns {number} 点赞数
   */
  getLikeCount(articleId) {
    const id = String(articleId);
    return this.likesData[id]?.count || 0;
  }

  /**
   * 检查用户是否已点赞某文章
   * @param {string|number} articleId - 文章ID
   * @returns {boolean} 是否已点赞
   */
  hasLiked(articleId) {
    const id = String(articleId);
    return this.likesData[id]?.userLiked || false;
  }

  /**
   * 切换点赞状态
   * @param {string|number} articleId - 文章ID
   * @returns {Object} 包含新状态和点赞数的对象 { liked: boolean, count: number }
   */
  toggleLike(articleId) {
    const id = String(articleId);

    if (!this.likesData[id]) {
      this.likesData[id] = { count: 0, userLiked: false };
    }

    const articleLikes = this.likesData[id];

    if (articleLikes.userLiked) {
      articleLikes.count = Math.max(0, articleLikes.count - 1);
      articleLikes.userLiked = false;
    } else {
      articleLikes.count += 1;
      articleLikes.userLiked = true;
    }

    this.saveToStorage();

    return {
      liked: articleLikes.userLiked,
      count: articleLikes.count
    };
  }

  /**
   * 初始化文章的基础点赞数（从文章数据）
   * @param {string|number} articleId - 文章ID
   * @param {number} baseCount - 基础点赞数
   */
  initBaseCount(articleId, baseCount) {
    const id = String(articleId);

    if (!this.likesData[id]) {
      this.likesData[id] = { count: baseCount || 0, userLiked: false };
      this.saveToStorage();
    }
  }

  /**
   * 获取所有文章的点赞数据
   * @returns {Object} 所有点赞数据
   */
  getAllLikes() {
    return { ...this.likesData };
  }
}

/**
 * 创建文章卡片点赞按钮的 HTML
 * @param {string|number} articleId - 文章ID
 * @param {number} likeCount - 点赞数
 * @param {boolean} hasLiked - 是否已点赞
 * @returns {string} HTML 字符串
 */
export function createCardLikeHTML(articleId, likeCount, hasLiked) {
  const activeClass = hasLiked ? 'card__like--active' : '';
  const fillAttr = hasLiked ? 'fill="currentColor"' : '';

  return `
    <span class="card__like ${activeClass}" data-article-id="${articleId}" aria-label="点赞">
      <svg class="card__like-icon" viewBox="0 0 24 24" ${fillAttr}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span class="card__like-count">${likeCount}</span>
    </span>
  `;
}

/**
 * 创建文章详情页点赞按钮的 HTML
 * @param {string|number} articleId - 文章ID
 * @param {number} likeCount - 点赞数
 * @param {boolean} hasLiked - 是否已点赞
 * @returns {string} HTML 字符串
 */
export function createDetailLikeHTML(articleId, likeCount, hasLiked) {
  const activeClass = hasLiked ? 'article__like--active' : '';
  const fillAttr = hasLiked ? 'fill="currentColor"' : '';
  const likeText = hasLiked ? '已点赞' : '点赞';

  return `
    <div class="article__like ${activeClass}" data-article-id="${articleId}" role="button" tabindex="0" aria-label="${likeText}">
      <svg class="article__like-icon" viewBox="0 0 24 24" ${fillAttr}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span class="article__like-count">${likeCount}</span>
      <span class="article__like-text">${likeText}</span>
    </div>
  `;
}

/**
 * 绑定卡片点赞事件
 * @param {HTMLElement} container - 容器元素
 * @param {LikeManager} likeManager - 点赞管理器实例
 * @param {Function} onLikeToggle - 点赞切换回调函数
 */
export function bindCardLikeEvents(container, likeManager, onLikeToggle) {
  if (!container) return;

  container.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.card__like');
    if (!likeBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const articleId = likeBtn.dataset.articleId;
    if (!articleId) return;

    const result = likeManager.toggleLike(articleId);

    likeBtn.classList.toggle('card__like--active', result.liked);
    likeBtn.classList.add('card__like--animating');

    const icon = likeBtn.querySelector('.card__like-icon');
    const count = likeBtn.querySelector('.card__like-count');

    if (icon) {
      icon.setAttribute('fill', result.liked ? 'currentColor' : 'none');
    }
    if (count) {
      count.textContent = result.count;
    }

    setTimeout(() => {
      likeBtn.classList.remove('card__like--animating');
    }, 400);

    if (typeof onLikeToggle === 'function') {
      onLikeToggle(articleId, result);
    }
  });
}

/**
 * 绑定详情页点赞事件
 * @param {HTMLElement} likeBtn - 点赞按钮元素
 * @param {LikeManager} likeManager - 点赞管理器实例
 * @param {Function} onLikeToggle - 点赞切换回调函数
 */
export function bindDetailLikeEvents(likeBtn, likeManager, onLikeToggle) {
  if (!likeBtn) return;

  const handleLike = (e) => {
    e.preventDefault();

    const articleId = likeBtn.dataset.articleId;
    if (!articleId) return;

    const result = likeManager.toggleLike(articleId);

    likeBtn.classList.toggle('article__like--active', result.liked);
    likeBtn.classList.add('article__like--animating');

    const icon = likeBtn.querySelector('.article__like-icon');
    const count = likeBtn.querySelector('.article__like-count');
    const text = likeBtn.querySelector('.article__like-text');

    if (icon) {
      icon.setAttribute('fill', result.liked ? 'currentColor' : 'none');
    }
    if (count) {
      count.textContent = result.count;
    }
    if (text) {
      text.textContent = result.liked ? '已点赞' : '点赞';
    }

    likeBtn.setAttribute('aria-label', result.liked ? '已点赞' : '点赞');

    setTimeout(() => {
      likeBtn.classList.remove('article__like--animating');
    }, 500);

    if (typeof onLikeToggle === 'function') {
      onLikeToggle(articleId, result);
    }
  };

  likeBtn.addEventListener('click', handleLike);

  likeBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLike(e);
    }
  });
}

/**
 * 创建全局唯一的点赞管理器实例
 * @type {LikeManager}
 */
export const likeManager = new LikeManager();
