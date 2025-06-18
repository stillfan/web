        // 修复后的移动端菜单切换
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