/**
 * 图片懒加载模块
 * 图片进入视口时才加载
 */
export class LazyLoad {
  /**
   * @param {string} selector - 懒加载图片选择器
   */
  constructor(selector = '[data-src]') {
    this.selector = selector;
    this.observer = null;
    
    this.init();
  }
  
  /**
   * 初始化懒加载
   */
  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
      
      this.observe();
    } else {
      this.loadAll();
    }
  }
  
  /**
   * 开始观察所有懒加载图片
   */
  observe() {
    const images = document.querySelectorAll(this.selector);
    
    images.forEach(image => {
      this.observer.observe(image);
    });
  }
  
  /**
   * 处理视口交叉
   * @param {IntersectionObserverEntry[]} entries - 观察条目
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  /**
   * 加载单个图片
   * @param {HTMLElement} image - 图片元素
   */
  loadImage(image) {
    const src = image.dataset.src;
    const srcset = image.dataset.srcset;
    
    if (src) {
      image.src = src;
    }
    
    if (srcset) {
      image.srcset = srcset;
    }
    
    image.classList.add('loaded');
    image.removeAttribute('data-src');
    image.removeAttribute('data-srcset');
  }
  
  /**
   * 加载所有图片（降级方案）
   */
  loadAll() {
    const images = document.querySelectorAll(this.selector);
    
    images.forEach(image => {
      this.loadImage(image);
    });
  }
  
  /**
   * 更新观察列表（动态添加图片时调用）
   */
  update() {
    if (this.observer) {
      this.observe();
    }
  }
}
