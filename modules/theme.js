/**
 * 主题切换模块
 * 支持明暗主题切换，记住用户偏好
 */
export class ThemeToggle {
  /**
   * @param {HTMLElement} toggleBtn - 主题切换按钮
   */
  constructor(toggleBtn) {
    this.toggleBtn = toggleBtn;
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    
    this.init();
  }
  
  /**
   * 初始化主题切换
   */
  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
    this.updateIcon();
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  /**
   * 切换主题
   */
  toggle() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    this.storeTheme(newTheme);
  }
  
  /**
   * 设置主题
   * @param {string} theme - 主题名称 ('light' | 'dark')
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.updateIcon();
  }
  
  /**
   * 更新切换按钮图标
   */
  updateIcon() {
    if (!this.toggleBtn) return;
    
    const sunIcon = this.toggleBtn.querySelector('.icon-sun');
    const moonIcon = this.toggleBtn.querySelector('.icon-moon');
    
    if (this.currentTheme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }
  
  /**
   * 获取存储的主题偏好
   * @returns {string|null} 存储的主题
   */
  getStoredTheme() {
    return localStorage.getItem('theme');
  }
  
  /**
   * 存储主题偏好
   * @param {string} theme - 主题名称
   */
  storeTheme(theme) {
    localStorage.setItem('theme', theme);
  }
  
  /**
   * 获取系统主题偏好
   * @returns {string} 系统主题
   */
  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
