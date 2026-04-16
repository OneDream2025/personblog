/**
 * 点赞模块
 * 实现文章点赞功能，支持 localStorage 持久化
 */

const STORAGE_KEY = 'blog_likes';
const USER_LIKES_KEY = 'blog_user_likes';

/**
 * Like 类 - 管理点赞功能
 */
export class Like {
  /**
   * 创建点赞实例
   * @param {HTMLElement} container - 点赞容器元素
   * @param {number} articleId - 文章ID
   */
  constructor(container, articleId) {
    this.container = container;
    this.articleId = articleId;
    this.likes = this.getLikes();
    this.isLiked = this.checkUserLiked();
    this.init();
  }

  /**
   * 初始化点赞组件
   */
  init() {
    this.render();
    this.bindEvents();
  }

  /**
   * 渲染点赞按钮
   */
  render() {
    this.container.innerHTML = `
      <div class="like ${this.isLiked ? 'like--active' : ''}" data-article-id="${this.articleId}">
        <span class="like__icon">${this.isLiked ? '❤️' : '🤍'}</span>
        <span class="like__count">${this.likes}</span>
      </div>
    `;
    this.likeElement = this.container.querySelector('.like');
  }

  /**
   * 绑定点击事件
   */
  bindEvents() {
    this.likeElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });
  }

  /**
   * 切换点赞状态
   */
  toggle() {
    if (this.isLiked) {
      this.unlike();
    } else {
      this.like();
    }
  }

  /**
   * 点赞
   */
  like() {
    this.likes++;
    this.isLiked = true;
    this.saveLikes();
    this.saveUserLike(true);
    this.updateUI();
    this.animate();
  }

  /**
   * 取消点赞
   */
  unlike() {
    if (this.likes > 0) {
      this.likes--;
    }
    this.isLiked = false;
    this.saveLikes();
    this.saveUserLike(false);
    this.updateUI();
  }

  /**
   * 更新UI显示
   */
  updateUI() {
    const icon = this.likeElement.querySelector('.like__icon');
    const count = this.likeElement.querySelector('.like__count');

    icon.textContent = this.isLiked ? '❤️' : '🤍';
    count.textContent = this.likes;

    this.likeElement.classList.toggle('like--active', this.isLiked);

    Like.updateAllInstances(this.articleId, this.likes, this.isLiked);
  }

  /**
   * 播放动画
   */
  animate() {
    this.likeElement.classList.add('like--animating');
    setTimeout(() => {
      this.likeElement.classList.remove('like--animating');
    }, 400);
  }

  /**
   * 获取文章点赞数
   * @returns {number} 点赞数
   */
  getLikes() {
    const allLikes = this.getAllLikes();
    return allLikes[this.articleId] || 0;
  }

  /**
   * 保存点赞数到 localStorage
   */
  saveLikes() {
    const allLikes = this.getAllLikes();
    allLikes[this.articleId] = this.likes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allLikes));
  }

  /**
   * 获取所有点赞数据
   * @returns {Object} 点赞数据对象
   */
  getAllLikes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * 检查用户是否已点赞
   * @returns {boolean} 是否已点赞
   */
  checkUserLiked() {
    const userLikes = this.getUserLikes();
    return userLikes.includes(this.articleId);
  }

  /**
   * 保存用户点赞状态
   * @param {boolean} liked - 是否点赞
   */
  saveUserLike(liked) {
    const userLikes = this.getUserLikes();
    const index = userLikes.indexOf(this.articleId);

    if (liked && index === -1) {
      userLikes.push(this.articleId);
    } else if (!liked && index !== -1) {
      userLikes.splice(index, 1);
    }

    localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
  }

  /**
   * 获取用户点赞列表
   * @returns {Array} 用户点赞的文章ID数组
   */
  getUserLikes() {
    try {
      const data = localStorage.getItem(USER_LIKES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 更新页面上所有相同文章的点赞实例
   * @param {number} articleId - 文章ID
   * @param {number} count - 点赞数
   * @param {boolean} isLiked - 是否已点赞
   */
  static updateAllInstances(articleId, count, isLiked) {
    const allLikeElements = document.querySelectorAll(`.like[data-article-id="${articleId}"]`);
    allLikeElements.forEach(el => {
      const icon = el.querySelector('.like__icon');
      const countEl = el.querySelector('.like__count');

      if (icon) icon.textContent = isLiked ? '❤️' : '🤍';
      if (countEl) countEl.textContent = count;

      el.classList.toggle('like--active', isLiked);
    });
  }

  /**
   * 静态方法：获取文章点赞数
   * @param {number} articleId - 文章ID
   * @returns {number} 点赞数
   */
  static getLikeCount(articleId) {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const allLikes = data ? JSON.parse(data) : {};
      return allLikes[articleId] || 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 静态方法：检查用户是否已点赞
   * @param {number} articleId - 文章ID
   * @returns {boolean} 是否已点赞
   */
  static isUserLiked(articleId) {
    try {
      const data = localStorage.getItem(USER_LIKES_KEY);
      const userLikes = data ? JSON.parse(data) : [];
      return userLikes.includes(articleId);
    } catch (e) {
      return false;
    }
  }

  /**
   * 静态方法：保存点赞数
   * @param {number} articleId - 文章ID
   * @param {number} count - 点赞数
   */
  static saveLikeCount(articleId, count) {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const allLikes = data ? JSON.parse(data) : {};
      allLikes[articleId] = count;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allLikes));
    } catch (e) {
      console.error('保存点赞数失败:', e);
    }
  }

  /**
   * 静态方法：更新用户点赞状态
   * @param {number} articleId - 文章ID
   * @param {boolean} liked - 是否点赞
   */
  static updateUserLikeStatus(articleId, liked) {
    try {
      const data = localStorage.getItem(USER_LIKES_KEY);
      const userLikes = data ? JSON.parse(data) : [];
      const index = userLikes.indexOf(articleId);

      if (liked && index === -1) {
        userLikes.push(articleId);
      } else if (!liked && index !== -1) {
        userLikes.splice(index, 1);
      }

      localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
    } catch (e) {
      console.error('更新用户点赞状态失败:', e);
    }
  }
}
