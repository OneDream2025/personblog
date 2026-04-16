/**
 * 文章点赞模块
 * 处理文章点赞逻辑和持久化存储
 */
const STORAGE_KEY = 'blog_likes';

class Like {
  constructor() {
    this.likes = this.loadLikes();
  }

  /**
   * 从 localStorage 加载点赞数据
   * @returns {Object} 点赞数据对象
   */
  loadLikes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('加载点赞数据失败:', e);
      return {};
    }
  }

  /**
   * 保存点赞数据到 localStorage
   */
  saveLikes() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.likes));
    } catch (e) {
      console.error('保存点赞数据失败:', e);
    }
  }

  /**
   * 获取文章点赞数
   * @param {number|string} articleId - 文章ID
   * @returns {number} 点赞数
   */
  getLikeCount(articleId) {
    return this.likes[articleId]?.count || 0;
  }

  /**
   * 检查当前用户是否已点赞该文章
   * @param {number|string} articleId - 文章ID
   * @returns {boolean} 是否已点赞
   */
  isLiked(articleId) {
    return this.likes[articleId]?.liked || false;
  }

  /**
   * 切换文章点赞状态
   * @param {number|string} articleId - 文章ID
   * @returns {Object} 新的点赞状态 { count: number, liked: boolean }
   */
  toggleLike(articleId) {
    if (!this.likes[articleId]) {
      this.likes[articleId] = {
        count: 0,
        liked: false
      };
    }

    const likeData = this.likes[articleId];

    if (likeData.liked) {
      likeData.count = Math.max(0, likeData.count - 1);
      likeData.liked = false;
    } else {
      likeData.count += 1;
      likeData.liked = true;
    }

    this.saveLikes();
    this.updateAllDisplays(articleId);

    return {
      count: likeData.count,
      liked: likeData.liked
    };
  }

  /**
   * 更新页面上所有该文章的点赞显示
   * @param {number|string} articleId - 文章ID
   */
  updateAllDisplays(articleId) {
    const displays = document.querySelectorAll(`[data-like-id="${articleId}"]`);
    displays.forEach(display => {
      this.updateDisplay(display);
    });
  }

  /**
   * 更新单个点赞显示元素
   * @param {HTMLElement} element - 点赞显示元素
   */
  updateDisplay(element) {
    const articleId = element.dataset.likeId;
    const count = this.getLikeCount(articleId);
    const liked = this.isLiked(articleId);

    const countElement = element.querySelector('.like__count');
    const heartElement = element.querySelector('.like__heart');

    if (countElement) {
      countElement.textContent = count;
    }

    if (heartElement) {
      heartElement.classList.toggle('like__heart--liked', liked);
    }
  }

  /**
   * 初始化页面上所有点赞按钮
   */
  initAllLikes() {
    const likeButtons = document.querySelectorAll('.like');
    likeButtons.forEach(button => {
      this.updateDisplay(button);
    });

    if (!Like._clickHandlerBound) {
      document.addEventListener('click', (e) => {
        const likeButton = e.target.closest('.like');
        if (likeButton) {
          e.preventDefault();
          const articleId = likeButton.dataset.likeId;
          this.toggleLike(articleId);
        }
      });
      Like._clickHandlerBound = true;
    }
  }
}

export { Like };
