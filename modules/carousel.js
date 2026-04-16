/**
 * 轮播图模块
 * 支持自动轮播、手动切换和触摸滑动
 */
export class Carousel {
  /**
   * @param {HTMLElement} container - 轮播图容器元素
   * @param {Object} options - 配置选项
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      autoPlay: true,
      interval: 5000,
      ...options
    };
    
    this.track = container.querySelector('.carousel__track');
    this.slides = container.querySelectorAll('.carousel__slide');
    this.prevBtn = container.querySelector('.carousel__btn--prev');
    this.nextBtn = container.querySelector('.carousel__btn--next');
    this.indicators = container.querySelectorAll('.carousel__indicator');
    
    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoPlayTimer = null;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.translateX = 0;
    
    this.init();
  }
  
  /**
   * 初始化轮播图
   */
  init() {
    this.bindEvents();
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goTo(index));
    });
    
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => {
      if (this.options.autoPlay) {
        this.startAutoPlay();
      }
    });
    
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    this.track.addEventListener('touchend', () => this.handleTouchEnd());
    
    this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.track.addEventListener('mouseup', () => this.handleMouseUp());
    this.track.addEventListener('mouseleave', () => this.handleMouseUp());
  }
  
  /**
   * 处理触摸开始
   * @param {TouchEvent} e - 触摸事件
   */
  handleTouchStart(e) {
    this.isDragging = true;
    this.startX = e.touches[0].clientX;
    this.stopAutoPlay();
  }
  
  /**
   * 处理触摸移动
   * @param {TouchEvent} e - 触摸事件
   */
  handleTouchMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.touches[0].clientX;
    const diff = this.currentX - this.startX;
    this.translateX = diff;
  }
  
  /**
   * 处理触摸结束
   */
  handleTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const threshold = this.container.offsetWidth * 0.2;
    
    if (this.translateX > threshold) {
      this.prev();
    } else if (this.translateX < -threshold) {
      this.next();
    }
    
    this.translateX = 0;
    
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  /**
   * 处理鼠标按下
   * @param {MouseEvent} e - 鼠标事件
   */
  handleMouseDown(e) {
    this.isDragging = true;
    this.startX = e.clientX;
    this.stopAutoPlay();
    e.preventDefault();
  }
  
  /**
   * 处理鼠标移动
   * @param {MouseEvent} e - 鼠标事件
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
    const diff = this.currentX - this.startX;
    this.translateX = diff;
  }
  
  /**
   * 处理鼠标松开
   */
  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    
    const threshold = this.container.offsetWidth * 0.2;
    
    if (this.translateX > threshold) {
      this.prev();
    } else if (this.translateX < -threshold) {
      this.next();
    }
    
    this.translateX = 0;
    
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
  
  /**
   * 切换到下一张
   */
  next() {
    this.goTo((this.currentIndex + 1) % this.slideCount);
  }
  
  /**
   * 切换到上一张
   */
  prev() {
    this.goTo((this.currentIndex - 1 + this.slideCount) % this.slideCount);
  }
  
  /**
   * 切换到指定索引
   * @param {number} index - 目标索引
   */
  goTo(index) {
    this.currentIndex = index;
    this.updateTrack();
    this.updateIndicators();
  }
  
  /**
   * 更新轨道位置
   */
  updateTrack() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
  }
  
  /**
   * 更新指示器状态
   */
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('carousel__indicator--active', index === this.currentIndex);
    });
  }
  
  /**
   * 开始自动播放
   */
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.next();
    }, this.options.interval);
  }
  
  /**
   * 停止自动播放
   */
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  /**
   * 销毁轮播图实例
   */
  destroy() {
    this.stopAutoPlay();
  }
}
