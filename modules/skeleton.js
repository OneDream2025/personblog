/**
 * 骨架屏模块
 * 页面加载时显示骨架屏动画
 */
export class Skeleton {
  /**
   * @param {HTMLElement} container - 骨架屏容器
   */
  constructor(container) {
    this.container = container;
  }
  
  /**
   * 显示骨架屏
   */
  show() {
    this.container.style.display = 'block';
  }
  
  /**
   * 隐藏骨架屏
   */
  hide() {
    this.container.style.display = 'none';
  }
  
  /**
   * 生成文章卡片骨架屏
   * @param {number} count - 数量
   * @returns {string} HTML字符串
   */
  static generateCardSkeleton(count = 6) {
    let html = '';
    
    for (let i = 0; i < count; i++) {
      html += `
        <div class="card">
          <div class="card__image-wrapper">
            <div class="skeleton skeleton--image"></div>
          </div>
          <div class="card__body">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--title"></div>
            <div class="skeleton skeleton--text"></div>
            <div class="skeleton skeleton--text" style="width: 80%;"></div>
            <div class="flex flex--between" style="margin-top: var(--spacing-md);">
              <div class="skeleton skeleton--text" style="width: 20%;"></div>
              <div class="skeleton skeleton--text" style="width: 15%;"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    return html;
  }
  
  /**
   * 生成文章列表骨架屏
   * @param {number} count - 数量
   * @returns {string} HTML字符串
   */
  static generateListSkeleton(count = 10) {
    let html = '';
    
    for (let i = 0; i < count; i++) {
      html += `
        <div class="card card--horizontal">
          <div class="card__image-wrapper">
            <div class="skeleton skeleton--image"></div>
          </div>
          <div class="card__body">
            <div class="skeleton skeleton--text" style="width: 30%;"></div>
            <div class="skeleton skeleton--title"></div>
            <div class="skeleton skeleton--text"></div>
            <div class="skeleton skeleton--text" style="width: 80%;"></div>
            <div class="flex flex--between" style="margin-top: var(--spacing-md);">
              <div class="skeleton skeleton--text" style="width: 20%;"></div>
              <div class="skeleton skeleton--text" style="width: 15%;"></div>
            </div>
          </div>
        </div>
      `;
    }
    
    return html;
  }
  
  /**
   * 生成侧边栏骨架屏
   * @returns {string} HTML字符串
   */
  static generateSidebarSkeleton() {
    return `
      <div class="sidebar__section">
        <div class="skeleton skeleton--title" style="width: 40%;"></div>
        <div class="skeleton skeleton--text" style="margin-top: var(--spacing-md);"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text"></div>
        <div class="skeleton skeleton--text" style="width: 80%;"></div>
      </div>
      <div class="sidebar__section">
        <div class="skeleton skeleton--title" style="width: 40%;"></div>
        <div class="flex flex--wrap" style="gap: var(--spacing-sm); margin-top: var(--spacing-md);">
          <div class="skeleton" style="width: 60px; height: 24px;"></div>
          <div class="skeleton" style="width: 80px; height: 24px;"></div>
          <div class="skeleton" style="width: 50px; height: 24px;"></div>
          <div class="skeleton" style="width: 70px; height: 24px;"></div>
        </div>
      </div>
    `;
  }
}
