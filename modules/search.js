/**
 * 搜索模块
 * 处理搜索模态框和实时搜索功能
 */
export class Search {
  /**
   * @param {HTMLElement} searchBtn - 搜索按钮
   * @param {HTMLElement} modal - 搜索模态框
   * @param {Array} articles - 文章数据数组
   */
  constructor(searchBtn, modal, articles) {
    this.searchBtn = searchBtn;
    this.modal = modal;
    this.articles = articles;
    this.input = modal.querySelector('.search-modal__input');
    this.resultsContainer = modal.querySelector('.search-modal__results');
    this.closeBtn = modal.querySelector('.search-modal__close');
    this.debounceTimer = null;
    
    this.init();
  }
  
  /**
   * 初始化搜索
   */
  init() {
    this.bindEvents();
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => this.open());
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
    
    if (this.input) {
      this.input.addEventListener('input', (e) => this.handleInput(e));
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('search-modal--open')) {
        this.close();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
    });
  }
  
  /**
   * 打开搜索模态框
   */
  open() {
    this.modal.classList.add('search-modal--open');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      this.input.focus();
    }, 100);
  }
  
  /**
   * 关闭搜索模态框
   */
  close() {
    this.modal.classList.remove('search-modal--open');
    document.body.style.overflow = '';
    this.input.value = '';
    this.resultsContainer.innerHTML = '';
  }
  
  /**
   * 处理输入事件（防抖）
   * @param {InputEvent} e - 输入事件
   */
  handleInput(e) {
    const query = e.target.value.trim();
    
    clearTimeout(this.debounceTimer);
    
    this.debounceTimer = setTimeout(() => {
      this.search(query);
    }, 300);
  }
  
  /**
   * 执行搜索
   * @param {string} query - 搜索关键词
   */
  search(query) {
    if (!query) {
      this.resultsContainer.innerHTML = '';
      return;
    }
    
    const results = this.articles.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(query.toLowerCase());
      const excerptMatch = article.excerpt.toLowerCase().includes(query.toLowerCase());
      const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      return titleMatch || excerptMatch || tagMatch;
    });
    
    this.renderResults(results, query);
  }
  
  /**
   * 获取正确的文章URL路径
   * @param {string} url - 原始URL
   * @returns {string} 修正后的URL
   */
  getArticleUrl(url) {
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    if (isInPagesDirectory) {
      return url.replace('pages/', '');
    }
    return url;
  }

  /**
   * 渲染搜索结果
   * @param {Array} results - 搜索结果数组
   * @param {string} query - 搜索关键词
   */
  renderResults(results, query) {
    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="search-modal__empty">
          未找到与 "${query}" 相关的文章
        </div>
      `;
      return;
    }
    
    const html = results.map(article => `
      <a href="${this.getArticleUrl(article.url)}" class="search-modal__result">
        <div class="search-modal__result-title">${this.highlightText(article.title, query)}</div>
        <div class="search-modal__result-excerpt">${this.highlightText(article.excerpt, query)}</div>
      </a>
    `).join('');
    
    this.resultsContainer.innerHTML = html;
  }
  
  /**
   * 高亮显示匹配文本
   * @param {string} text - 原始文本
   * @param {string} query - 搜索关键词
   * @returns {string} 高亮后的文本
   */
  highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}
