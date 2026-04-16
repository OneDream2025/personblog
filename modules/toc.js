/**
 * 目录模块
 * 自动提取文章标题生成目录导航
 */
export class TableOfContents {
  /**
   * @param {HTMLElement} container - 目录容器
   * @param {HTMLElement} content - 文章内容容器
   */
  constructor(container, content) {
    this.container = container;
    this.content = content;
    this.headings = [];
    this.activeId = null;
    
    this.init();
  }
  
  /**
   * 初始化目录
   */
  init() {
    this.extractHeadings();
    this.render();
    this.bindEvents();
  }
  
  /**
   * 提取文章标题
   */
  extractHeadings() {
    const headingElements = this.content.querySelectorAll('h2, h3, h4');
    
    this.headings = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      
      return {
        id,
        text: heading.textContent,
        level: parseInt(heading.tagName.charAt(1))
      };
    });
  }
  
  /**
   * 渲染目录
   */
  render() {
    if (this.headings.length === 0) {
      this.container.innerHTML = '';
      return;
    }
    
    const html = `
      <h3 class="toc__title">目录</h3>
      <ul class="toc__list">
        ${this.headings.map(heading => `
          <li class="toc__item toc__item--h${heading.level}">
            <a href="#${heading.id}" class="toc__link" data-id="${heading.id}">
              ${heading.text}
            </a>
          </li>
        `).join('')}
      </ul>
    `;
    
    this.container.innerHTML = html;
  }
  
  /**
   * 绑定事件监听器
   */
  bindEvents() {
    const links = this.container.querySelectorAll('.toc__link');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.dataset.id;
        const heading = document.getElementById(id);
        
        if (heading) {
          const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
          const top = heading.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top,
            behavior: 'smooth'
          });
        }
      });
    });
    
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
  }
  
  /**
   * 处理滚动事件，更新当前激活的目录项
   */
  handleScroll() {
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
    const scrollY = window.scrollY + headerHeight + 50;
    
    let currentId = null;
    
    for (const heading of this.headings) {
      const element = document.getElementById(heading.id);
      if (element && element.offsetTop <= scrollY) {
        currentId = heading.id;
      }
    }
    
    if (currentId !== this.activeId) {
      this.activeId = currentId;
      this.updateActiveLink();
    }
  }
  
  /**
   * 更新激活的目录链接样式
   */
  updateActiveLink() {
    const links = this.container.querySelectorAll('.toc__link');
    
    links.forEach(link => {
      link.classList.toggle('toc__link--active', link.dataset.id === this.activeId);
    });
  }
}
