
    // 简化的滚动处理，避免复杂的状态切换
    let lastScrollTop = 0;
    let ticking = false;
    let lastClickedIndex = 0;
    
    // 主滚动处理函数
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const topHeader = document.getElementById('topHeader');
                const searchSection = document.getElementById('searchSection');
                const headerSearch = document.querySelector('.header-search');
                const backToTop = document.getElementById('backToTop');
                
                // 显示/隐藏返回顶部按钮
                if (scrollTop > 100) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
                
                // 滚动超过100px时切换搜索框
                if (scrollTop > 100) {
                    // 隐藏主搜索框
                    searchSection.classList.add('hidden');
                    // 显示顶部搜索框
                    headerSearch.classList.add('visible');
                } else {
                    // 显示主搜索框
                    searchSection.classList.remove('hidden');
                    // 隐藏顶部搜索框
                    headerSearch.classList.remove('visible');
                }
                
                // 快速向下滚动时隐藏顶部栏（只在手机端）
                if (window.innerWidth <= 768) {
                    if (scrollTop > lastScrollTop && scrollTop > 80) {
                        // 向下滚动
                        topHeader.style.transform = 'translateY(-100%)';
                    } else {
                        // 向上滚动或回到顶部
                        topHeader.style.transform = 'translateY(0)';
                    }
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
                
                // 更新左侧导航激活状态
                updateActiveNavLink();
            });
            ticking = true;
        }
    }
    
    // 下滑显示顶部搜索框代码
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50);
    });
    
    // 左侧导航点击平滑滚动
    document.querySelectorAll('.nav-links a').forEach((link, index) => {
        link.addEventListener('click', function(e) {
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if(targetSection) {
                    // 更新导航激活状态
                    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 记录当前点击的索引
                    lastClickedIndex = index;
                    
                    // 计算目标位置
                    const headerHeight = document.querySelector('.top-header').offsetHeight;
                    const viewportHeight = window.innerHeight;
                    
                    // 获取目标section的位置
                    const targetRect = targetSection.getBoundingClientRect();
                    const targetTop = targetRect.top + window.pageYOffset;
                    
                    // 计算要滚动到的位置：目标section顶部 - 顶部栏高度
                    let scrollToPosition = targetTop - headerHeight;
                    
                    // 确保不会滚动到负值
                    scrollToPosition = Math.max(0, scrollToPosition);
                    
                    // 如果是最后一个section，确保它完全可见
                    const sections = document.querySelectorAll('.link-section');
                    const isLastSection = targetId === sections[sections.length - 1].id;
                    
                    if (isLastSection) {
                        const targetBottom = targetTop + targetRect.height;
                        const viewportBottom = scrollToPosition + viewportHeight;
                        
                        // 如果section底部在视窗之外，调整滚动位置使其可见
                        if (targetBottom > viewportBottom) {
                            // 计算需要额外滚动的距离
                            const extraScroll = targetBottom - viewportBottom + 50; // 加50px边距
                            scrollToPosition += extraScroll;
                        }
                    }
                    
                    // 平滑滚动到目标位置
                    window.scrollTo({
                        top: scrollToPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 更新左侧导航激活状态
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.link-section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // 增加偏移量以提前激活
        
        // 优先检查当前滚动位置所在的section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // 如果没有找到当前区域，则根据滚动位置决定激活哪个section
        if (!currentSectionId) {
            if (scrollPosition < sections[0].offsetTop) {
                currentSectionId = 'quick';
            } else {
                // 找到最后一个section的ID
                const lastSection = sections[sections.length - 1];
                currentSectionId = lastSection.getAttribute('id');
            }
        }
        
        // 更新导航激活状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
      
    // 返回顶部功能
    document.getElementById('backToTop').addEventListener('click', function() {
        // 滚动页面到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 同时滚动左侧导航栏到顶部
        const navSidebar = document.getElementById('navSidebar');
        if (navSidebar) {
            navSidebar.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
      
    // 窗口大小变化时重新计算
    window.addEventListener('resize', function() {
        // 重置顶部栏位置（针对手机端的隐藏/显示）
        const topHeader = document.getElementById('topHeader');
        topHeader.style.transform = 'translateY(0)';
        
        updateActiveNavLink();
    });

// 主题切换功能
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// 检查本地存储的主题设置
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggle.checked = false;
    }
}

// 切换主题
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// 在页面加载时初始化主题
window.addEventListener('load', function() {
    // 原有的代码...
    setCurrentDate();
    initTheme(); // 添加主题初始化
    updateActiveNavLink();
});