/**
 * 分页模块
 * 处理文章列表分页功能
 */
export class Pagination {
  /**
   * @param {HTMLElement} container - 分页容器
   * @param {Object} options - 配置选项
   * @param {Function} onPageChange - 页码变化回调函数
   */
  constructor(container, options = {}, onPageChange) {
    this.container = container;
    this.options = {
      totalItems: 0,
      itemsPerPage: 10,
      currentPage: 1,
      maxPages: 5,
      ...options
    };
    this.onPageChange = onPageChange;
    
    this.init();
  }
  
  /**
   * 初始化分页
   */
  init() {
    this.render();
    this.bindEvents();
  }
  
  /**
   * 计算总页数
   * @returns {number} 总页数
   */
  getTotalPages() {
    return Math.ceil(this.options.totalItems / this.options.itemsPerPage);
  }
  
  /**
   * 渲染分页按钮
   */
  render() {
    const totalPages = this.getTotalPages();
    const { currentPage, maxPages } = this.options;
    
    if (totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }
    
    let pages = [];
    const halfMax = Math.floor(maxPages / 2);
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    const html = `
      <button class="pagination__btn ${currentPage === 1 ? 'pagination__btn--disabled' : ''}" 
              data-page="first" ${currentPage === 1 ? 'disabled' : ''}>
        首页
      </button>
      <button class="pagination__btn ${currentPage === 1 ? 'pagination__btn--disabled' : ''}" 
              data-page="prev" ${currentPage === 1 ? 'disabled' : ''}>
        上一页
      </button>
      ${startPage > 1 ? '<span class="pagination__ellipsis">...</span>' : ''}
      ${pages.map(page => `
        <button class="pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}" 
                data-page="${page}">
          ${page}
        </button>
      `).join('')}
      ${endPage < totalPages ? '<span class="pagination__ellipsis">...</span>' : ''}
      <button class="pagination__btn ${currentPage === totalPages ? 'pagination__btn--disabled' : ''}" 
              data-page="next" ${currentPage === totalPages ? 'disabled' : ''}>
        下一页
      </button>
      <button class="pagination__btn ${currentPage === totalPages ? 'pagination__btn--disabled' : ''}" 
              data-page="last" ${currentPage === totalPages ? 'disabled' : ''}>
        末页
      </button>
    `;
    
    this.container.innerHTML = html;
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.pagination__btn');
      if (!btn || btn.disabled) return;
      
      const page = btn.dataset.page;
      this.handlePageClick(page);
    });
  }
  
  /**
   * 处理页码点击
   * @param {string} page - 页码或操作
   */
  handlePageClick(page) {
    const totalPages = this.getTotalPages();
    let newPage;
    
    switch (page) {
      case 'first':
        newPage = 1;
        break;
      case 'prev':
        newPage = Math.max(1, this.options.currentPage - 1);
        break;
      case 'next':
        newPage = Math.min(totalPages, this.options.currentPage + 1);
        break;
      case 'last':
        newPage = totalPages;
        break;
      default:
        newPage = parseInt(page);
    }
    
    if (newPage !== this.options.currentPage) {
      this.options.currentPage = newPage;
      this.render();
      
      if (this.onPageChange) {
        this.onPageChange(newPage);
      }
    }
  }
  
  /**
   * 更新分页配置
   * @param {Object} options - 新的配置选项
   */
  update(options) {
    this.options = { ...this.options, ...options };
    this.render();
  }
}
