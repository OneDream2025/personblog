/**
 * 导航模块
 * 处理响应式导航菜单和滚动效果
 */
export class Navigation {
  /**
   * @param {HTMLElement} header - 头部元素
   */
  constructor(header) {
    this.header = header;
    this.menuBtn = header.querySelector('.header__menu-btn');
    this.nav = header.querySelector('.header__nav');
    this.navLinks = header.querySelectorAll('.header__nav-link');
    this.lastScrollY = 0;
    
    this.init();
  }
  
  /**
   * 初始化导航
   */
  init() {
    this.bindEvents();
    this.setActiveLink();
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    if (this.menuBtn) {
      this.menuBtn.addEventListener('click', () => this.toggleMenu());
    }
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }
  
  /**
   * 切换菜单显示状态
   */
  toggleMenu() {
    this.menuBtn.classList.toggle('header__menu-btn--active');
    this.nav.classList.toggle('header__nav--open');
  }
  
  /**
   * 关闭菜单
   */
  closeMenu() {
    this.menuBtn.classList.remove('header__menu-btn--active');
    this.nav.classList.remove('header__nav--open');
  }
  
  /**
   * 处理滚动事件
   */
  handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      this.header.classList.add('header--scrolled');
    } else {
      this.header.classList.remove('header--scrolled');
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  /**
   * 设置当前页面的导航链接为激活状态
   */
  setActiveLink() {
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === 'index.html')) {
        link.classList.add('header__nav-link--active');
      }
    });
  }
}
