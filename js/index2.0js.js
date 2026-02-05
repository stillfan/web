        // 移动端菜单切换
       document.getElementById('mobileMenuBtn').addEventListener('click', function() {
            const nav = document.getElementById('mainNav');
            nav.classList.toggle('active');
            
            // 添加一个小动画效果
            if (nav.classList.contains('active')) {
                nav.style.animation = 'fadeIn 0.3s ease';
            }
        });

        // 底部标签页切换
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // 初始加载时检查屏幕尺寸
        function checkScreenSize() {
            const nav = document.getElementById('mainNav');
            if (window.innerWidth >= 768) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        }

        // 窗口大小变化时调整布局
        window.addEventListener('resize', checkScreenSize);
        
        // 页面加载时执行
        window.addEventListener('load', checkScreenSize);
// 主题切换功能
document.getElementById('theme-toggle').addEventListener('click', function() {
    const themeStyle = document.getElementById('theme-style');
    const body = document.body;
    const themeIcon = this.querySelector('i');
    
    if (themeStyle.getAttribute('href') === 'css/index2.0css2.css') {
        themeStyle.setAttribute('href', 'css/index2.0css1.css');
        body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeStyle.setAttribute('href', 'css/index2.0css2.css');
        body.classList.remove('dark-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    // 保存用户偏好到本地存储
    localStorage.setItem('themePreference', themeStyle.getAttribute('href'));
});

// 检查本地存储中的主题偏好
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme) {
        const themeStyle = document.getElementById('theme-style');
        themeStyle.setAttribute('href', savedTheme);
        
        if (savedTheme === 'css/index2.0css2.css') {
            document.body.classList.add('dark-theme');
            const themeIcon = document.querySelector('#theme-toggle i');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
});