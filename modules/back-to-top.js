/**
 * 返回顶部模块
 * 滚动超过指定距离时显示返回顶部按钮
 */
export class BackToTop {
  /**
   * @param {HTMLElement} button - 返回顶部按钮
   * @param {number} threshold - 显示阈值（像素）
   */
  constructor(button, threshold = 300) {
    this.button = button;
    this.threshold = threshold;
    
    this.init();
  }
  
  /**
   * 初始化返回顶部功能
   */
  init() {
    this.bindEvents();
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    this.button.addEventListener('click', () => this.scrollToTop());
  }
  
  /**
   * 处理滚动事件
   */
  handleScroll() {
    if (window.scrollY > this.threshold) {
      this.button.classList.add('back-to-top--visible');
    } else {
      this.button.classList.remove('back-to-top--visible');
    }
  }
  
  /**
   * 滚动到页面顶部
   */
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
