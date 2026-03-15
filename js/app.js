/**
 * 整合优化版JS - 医往无际导航网站
 * 包含功能：节气显示、天气获取、日期更新、搜索引擎切换、导航滚动等
 */

(function() {
    'use strict';

    // ========================================
    // 节气配置数据
    // ========================================
    const SolarTermData = {
        // 本地节气背景图片路径
        backgrounds: {
            '立春': 'searchbg/lichun.jpg',
            '雨水': 'searchbg/yushui.jpg',
            '惊蛰': 'searchbg/jingzhe.jpg',
            '春分': 'searchbg/chunfen.jpg',
            '清明': 'searchbg/qingming.jpg',
            '谷雨': 'searchbg/guyu.jpg',
            '立夏': 'searchbg/lixia.jpg',
            '小满': 'searchbg/xiaoman.jpg',
            '芒种': 'searchbg/mangzhong.jpg',
            '夏至': 'searchbg/xiazhi.jpg',
            '小暑': 'searchbg/xiaoshu.jpg',
            '大暑': 'searchbg/dashu.jpg',
            '立秋': 'searchbg/liqiu.jpg',
            '处暑': 'searchbg/chushu.jpg',
            '白露': 'searchbg/bailu.jpg',
            '秋分': 'searchbg/qiufen.jpg',
            '寒露': 'searchbg/hanlu.jpg',
            '霜降': 'searchbg/shuangjiang.jpg',
            '立冬': 'searchbg/lidong.jpg',
            '小雪': 'searchbg/xiaoxue.jpg',
            '大雪': 'searchbg/daxue.jpg',
            '冬至': 'searchbg/dongzhi.jpg',
            '小寒': 'searchbg/xiaohan.jpg',
            '大寒': 'searchbg/dahan.jpg'
        },
        
        // 节气描述（分两行）
        descriptions: {
            '立春': ['万物起始', '一切更生'],
            '雨水': ['降雨开始', '万物萌动'],
            '惊蛰': ['春雷始鸣', '惊醒蛰虫'],
            '春分': ['昼夜平分', '春暖花开'],
            '清明': ['气清景明', '万物皆显'],
            '谷雨': ['雨生百谷', '滋润万物'],
            '立夏': ['夏季开始', '万物繁茂'],
            '小满': ['小得盈满', '麦类渐熟'],
            '芒种': ['有芒之种', '可稼可穑'],
            '夏至': ['日长之至', '日影短至'],
            '小暑': ['暑气渐盛', '但未至极'],
            '大暑': ['炎热至极', '一年最热'],
            '立秋': ['秋季开始', '暑去凉来'],
            '处暑': ['暑气渐止', '秋意渐浓'],
            '白露': ['天气转凉', '露凝而白'],
            '秋分': ['昼夜平分', '秋高气爽'],
            '寒露': ['露水已寒', '将欲凝结'],
            '霜降': ['天气渐冷', '开始有霜'],
            '立冬': ['冬季开始', '万物收藏'],
            '小雪': ['开始降雪', '雪量不大'],
            '大雪': ['降雪增多', '地面积雪'],
            '冬至': ['日短之至', '日影长至'],
            '小寒': ['天气寒冷', '但未至极'],
            '大寒': ['寒冷至极', '一年最冷']
        },

        // 获取当前节气
        getCurrentTerm: function() {
            const now = new Date();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            
            if (month === 1) return day < 20 ? '小寒' : '大寒';
            if (month === 2) return day < 4 ? '大寒' : (day <= 19 ? '立春' : '雨水');
            if (month === 3) return day < 6 ? '雨水' : (day <= 21 ? '惊蛰' : '春分');
            if (month === 4) return day < 5 ? '春分' : (day <= 20 ? '清明' : '谷雨');
            if (month === 5) return day < 6 ? '谷雨' : (day <= 21 ? '立夏' : '小满');
            if (month === 6) return day < 6 ? '小满' : (day <= 22 ? '芒种' : '夏至');
            if (month === 7) return day < 7 ? '夏至' : (day <= 23 ? '小暑' : '大暑');
            if (month === 8) return day < 8 ? '大暑' : (day <= 23 ? '立秋' : '处暑');
            if (month === 9) return day < 8 ? '处暑' : (day <= 23 ? '白露' : '秋分');
            if (month === 10) return day < 9 ? '秋分' : (day <= 24 ? '寒露' : '霜降');
            if (month === 11) return day < 8 ? '霜降' : (day <= 23 ? '立冬' : '小雪');
            if (month === 12) return day < 7 ? '小雪' : (day <= 22 ? '大雪' : '冬至');
            
            return '立春';
        },

        // 获取节气信息
        getCurrentInfo: function() {
            const term = this.getCurrentTerm();
            const desc = this.descriptions[term] || ['节气描述', ''];
            return {
                name: term,
                desc: desc,
                image: this.backgrounds[term] || this.backgrounds['立春']
            };
        }
    };

    // ========================================
    // 节气显示功能
    // ========================================
    function initSolarTerm() {
        const termNameEl = document.getElementById('solarTermName');
        const termDescEl = document.getElementById('solarTermDesc');
        const searchSection = document.getElementById('searchSection');
        
        if (!termNameEl || !termDescEl) return;

        const info = SolarTermData.getCurrentInfo();
        
        // 显示节气名称
        termNameEl.textContent = info.name;
        
        // 显示节气描述（两行）
        termDescEl.innerHTML = `${info.desc[0]}<br>${info.desc[1]}`;
        
        // 设置背景图片
        if (searchSection) {
            const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            const imageUrl = basePath + info.image;
            
            const styleId = 'solar-bg-style';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            
            styleEl.innerHTML = `
                #searchSection::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: url('${imageUrl}');
                    background-size: cover;
                    background-position: center;
                    opacity: 0.8;
                    z-index: 0;
                    transition: opacity 0.8s ease;
                }
            `;
        }
    }

    // ========================================
    // 日期显示功能
    // ========================================
    function updateDate() {
        const dateEl = document.getElementById('current-date');
        if (!dateEl) return;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[now.getDay()];
        
        dateEl.textContent = `${month}月${day}日 ${weekday}`;
    }

    // ========================================
    // 天气功能 - 使用 Open-Meteo 免费API
    // ========================================
    const WeatherService = {
        // 城市坐标数据（中国主要城市）
        cityCoords: {
            '北京': { lat: 39.9042, lon: 116.4074 },
            '上海': { lat: 31.2304, lon: 121.4737 },
            '广州': { lat: 23.1291, lon: 113.2644 },
            '深圳': { lat: 22.5431, lon: 114.0579 },
            '杭州': { lat: 30.2741, lon: 120.1551 },
            '南京': { lat: 32.0603, lon: 118.7969 },
            '成都': { lat: 30.5728, lon: 104.0668 },
            '武汉': { lat: 30.5928, lon: 114.3055 },
            '西安': { lat: 34.3416, lon: 108.9398 },
            '重庆': { lat: 29.5630, lon: 106.5516 },
            '天津': { lat: 39.0842, lon: 117.2009 },
            '苏州': { lat: 31.2989, lon: 120.5853 },
            '郑州': { lat: 34.7466, lon: 113.6253 },
            '长沙': { lat: 28.2280, lon: 112.9388 },
            '沈阳': { lat: 41.8057, lon: 123.4315 },
            '青岛': { lat: 36.0671, lon: 120.3826 },
            '宁波': { lat: 29.8683, lon: 121.5440 },
            '东莞': { lat: 23.0489, lon: 113.7447 },
            '佛山': { lat: 23.0218, lon: 113.1219 },
            '合肥': { lat: 31.8206, lon: 117.2272 },
            '厦门': { lat: 24.4798, lon: 118.0894 },
            '福州': { lat: 26.0745, lon: 119.2965 },
            '哈尔滨': { lat: 45.8038, lon: 126.5350 },
            '济南': { lat: 36.6512, lon: 117.1201 },
            '长春': { lat: 43.8171, lon: 125.3235 },
            '昆明': { lat: 25.0389, lon: 102.7183 },
            '大连': { lat: 38.9140, lon: 121.6147 },
            '石家庄': { lat: 38.0428, lon: 114.5149 },
            '太原': { lat: 37.8706, lon: 112.5489 },
            '兰州': { lat: 36.0611, lon: 103.8343 },
            '南昌': { lat: 28.6820, lon: 115.8579 },
            '贵阳': { lat: 26.6470, lon: 106.6302 },
            '南宁': { lat: 22.8170, lon: 108.3665 },
            '海口': { lat: 20.0440, lon: 110.1999 },
            '乌鲁木齐': { lat: 43.8256, lon: 87.6168 },
            '拉萨': { lat: 29.6500, lon: 91.1000 },
            '银川': { lat: 38.4872, lon: 106.2309 },
            '西宁': { lat: 36.6171, lon: 101.7782 },
            '呼和浩特': { lat: 40.8414, lon: 111.7519 },
  '南宁市': { "lat": 22.8170, "lon": 108.3665 },
  '柳州市': { "lat": 24.3257, "lon": 109.4155 },
  '桂林市': { "lat": 25.2736, "lon": 110.2900 },
  '北海市': { "lat": 21.4813, "lon": 109.1202 },
  '防城港市': { "lat": 21.6867, "lon": 108.3547 },
  '钦州市': { "lat": 21.9809, "lon": 108.6541 },
 '嘉峪关市': { "lat": 39.7731, "lon": 98.2892 },
  '金昌市': { "lat": 38.5201, "lon": 102.1876 },
  '白银市': { "lat": 36.5447, "lon": 104.1377 },
  '天水市': { "lat": 34.5809, "lon": 105.7249 },
  '武威市': { "lat": 37.9283, "lon": 102.6380 },
  '张掖市': { "lat": 38.9259, "lon": 100.4498 },
  '平凉市': { "lat": 35.5431, "lon": 106.6652 },
  '酒泉市': { "lat": 39.7324, "lon": 98.4943 },
  '庆阳市': { "lat": 35.7091, "lon": 107.6436 },
  '定西市': { "lat": 35.5811, "lon": 104.6263 },
  '陇南市': { "lat": 33.401, "lon": 104.9214 },
  '临夏回族自治州': { "lat": 35.601, "lon": 103.2105 },
  '甘南藏族自治州': { "lat": 34.9834, "lon": 102.911 }
        },
        
        // 天气代码映射到中文描述
        weatherCodeMap: {
            0: '晴',
            1: '多云',
            2: '多云',
            3: '阴',
            45: '雾',
            48: '雾凇',
            51: '毛毛雨',
            53: '小雨',
            55: '中雨',
            56: '冻雨',
            57: '冻雨',
            61: '小雨',
            63: '中雨',
            65: '大雨',
            66: '冻雨',
            67: '冻雨',
            71: '小雪',
            73: '中雪',
            75: '大雪',
            77: '雪粒',
            80: '阵雨',
            81: '阵雨',
            82: '暴雨',
            85: '阵雪',
            86: '阵雪',
            95: '雷阵雨',
            96: '雷阵雨伴冰雹',
            99: '雷阵雨伴冰雹'
        },
        
        // 天气图标映射
        iconMap: {
            '晴': 'sun',
            '多云': 'cloud-sun',
            '阴': 'cloud',
            '雾': 'smog',
            '雾凇': 'smog',
            '毛毛雨': 'cloud-rain',
            '小雨': 'cloud-rain',
            '中雨': 'cloud-showers-heavy',
            '大雨': 'cloud-showers-heavy',
            '暴雨': 'cloud-showers-water',
            '阵雨': 'cloud-rain',
            '冻雨': 'cloud-meatball',
            '小雪': 'snowflake',
            '中雪': 'snowflake',
            '大雪': 'snowflake',
            '雪粒': 'snowflake',
            '阵雪': 'snowflake',
            '雷阵雨': 'bolt',
            '雷阵雨伴冰雹': 'poo-storm'
        },

        getIcon: function(weather) {
            if (!weather) return 'cloud-sun';
            return this.iconMap[weather] || 'cloud-sun';
        },

        getWeatherDesc: function(code) {
            return this.weatherCodeMap[code] || '多云';
        },

        // 获取最近的城市
        getNearestCity: function(lat, lon) {
            let nearestCity = '北京';
            let minDistance = Infinity;
            
            for (const [city, coords] of Object.entries(this.cityCoords)) {
                const distance = Math.sqrt(
                    Math.pow(coords.lat - lat, 2) + Math.pow(coords.lon - lon, 2)
                );
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCity = city;
                }
            }
            
            return nearestCity;
        },

        // 获取天气数据 - 使用 Open-Meteo 免费API
        getWeather: async function() {
            const tempEl = document.getElementById('weatherTemp');
            const cityEl = document.getElementById('weatherCity');
            const textEl = document.getElementById('weatherText');
            const iconEl = document.getElementById('weatherIcon');
            
            if (!tempEl || !cityEl) return;

            // 显示加载状态
            tempEl.textContent = '--°C';
            cityEl.textContent = '定位中...';
            
            try {
                // 首先尝试获取用户地理位置
                let lat, lon, cityName;
                
                if (navigator.geolocation) {
                    try {
                        const position = await new Promise((resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(resolve, reject, {
                                timeout: 5000,
                                enableHighAccuracy: false
                            });
                        });
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;
                        cityName = this.getNearestCity(lat, lon);
                    } catch (geoError) {
                        console.log('无法获取精确位置，使用默认位置');
                        // 使用兰州作为默认位置
                        lat = 36.0611;
                        lon = 103.8343;
                        cityName = '兰州';
                    }
                } else {
                    // 浏览器不支持地理定位，使用默认位置
                    lat = 36.0611;
                    lon = 103.8343;
                    cityName = '兰州';
                }
                
                // 使用 Open-Meteo API 获取天气
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
                );
                
                if (!response.ok) {
                    throw new Error('天气API请求失败');
                }
                
                const data = await response.json();
                
                if (data.current) {
                    const weatherCode = data.current.weather_code;
                    const weatherDesc = this.getWeatherDesc(weatherCode);
                    
                    this.updateDisplay({
                        temperature: Math.round(data.current.temperature_2m),
                        weather: weatherDesc,
                        city: cityName
                    });
                } else {
                    throw new Error('天气数据格式错误');
                }
            } catch (error) {
                console.log('天气获取失败，使用默认数据:', error);
                // 使用默认数据
                this.updateDisplay({
                    temperature: ' ',
                    weather: ' ',
                    city: '兰州'
                });
            }
        },

        updateDisplay: function(data) {
            const tempEl = document.getElementById('weatherTemp');
            const cityEl = document.getElementById('weatherCity');
            const textEl = document.getElementById('weatherText');
            const iconEl = document.getElementById('weatherIcon');
            
            if (tempEl) tempEl.textContent = data.temperature + '°C';
            if (cityEl) cityEl.textContent = data.city || '本地';
            if (textEl) textEl.textContent = data.weather || '多云';
            
            if (iconEl) {
                const iconClass = this.getIcon(data.weather);
                iconEl.innerHTML = `<i class="fas fa-${iconClass}"></i>`;
            }
        }
    };

    // ========================================
    // 搜索引擎切换功能
    // ========================================
    function initSearchEngines() {
        const engineBtns = document.querySelectorAll('.search-engines button');
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');
        
        if (!engineBtns.length || !searchForm || !searchInput) return;

        const engines = {
            'baidu': { action: 'https://www.baidu.com/s', name: 'word' },
            'bing': { action: 'https://www.bing.com/search', name: 'q' },
            'google': { action: 'https://www.google.com/search', name: 'q' },
            'sogou': { action: 'https://www.sogou.com/web', name: 'query' }
        };

        engineBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const engineKey = this.dataset.engine;
                const engine = engines[engineKey];
                
                if (engine) {
                    searchForm.action = engine.action;
                    searchInput.name = engine.name;
                    
                    engineBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    // ========================================
    // 邮箱下拉菜单
    // ========================================
    function initEmailDropdown() {
        const emailBtn = document.getElementById('emailBtn');
        const emailDropdown = document.getElementById('emailDropdown');
        
        if (!emailBtn || !emailDropdown) return;

        emailBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            emailDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function() {
            emailDropdown.classList.remove('show');
        });

        emailDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ========================================
    // 滚动处理功能
    // ========================================
    function initScrollHandler() {
        let lastScrollTop = 0;
        let ticking = false;
        
        function handleScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const topHeader = document.getElementById('topHeader');
                    const searchSection = document.getElementById('searchSection');
                    const headerSearch = document.querySelector('.header-search');
                    const backToTop = document.getElementById('backToTop');
                    
                    // 显示/隐藏返回顶部按钮
                    if (backToTop) {
                        if (scrollTop > 100) {
                            backToTop.classList.add('show');
                        } else {
                            backToTop.classList.remove('show');
                        }
                    }
                    
                    // 滚动超过100px时切换搜索框
                    if (headerSearch && searchSection) {
                        if (scrollTop > 100) {
                            searchSection.classList.add('hidden');
                            headerSearch.classList.add('visible');
                        } else {
                            searchSection.classList.remove('hidden');
                            headerSearch.classList.remove('visible');
                        }
                    }
                    
                    // 快速向下滚动时隐藏顶部栏（只在手机端）
                    if (topHeader && window.innerWidth <= 768) {
                        if (scrollTop > lastScrollTop && scrollTop > 80) {
                            topHeader.style.transform = 'translateY(-100%)';
                        } else {
                            topHeader.style.transform = 'translateY(0)';
                        }
                    }
                    
                    lastScrollTop = scrollTop;
                    ticking = false;
                    
                    updateActiveNavLink();
                });
                ticking = true;
            }
        }
        
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 50);
        });
    }

    // ========================================
    // 左侧导航功能
    // ========================================
    function initNavSidebar() {
        const navLinks = document.querySelectorAll('.nav-links a');
        let lastClickedIndex = 0;
        
        navLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        navLinks.forEach(a => a.classList.remove('active'));
                        this.classList.add('active');
                        lastClickedIndex = index;
                        
                        const headerHeight = document.querySelector('.top-header')?.offsetHeight || 65;
                        const targetRect = targetSection.getBoundingClientRect();
                        const targetTop = targetRect.top + window.pageYOffset;
                        let scrollToPosition = targetTop - headerHeight - 20;
                        scrollToPosition = Math.max(0, scrollToPosition);
                        
                        window.scrollTo({
                            top: scrollToPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // 更新导航激活状态
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.link-section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        if (!sections.length || !navLinks.length) return;
        
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (!currentSectionId) {
            if (scrollPosition < sections[0].offsetTop) {
                currentSectionId = 'quick';
            } else {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // 返回顶部功能
    // ========================================
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            const navSidebar = document.getElementById('navSidebar');
            if (navSidebar) {
                navSidebar.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ========================================
    // 窗口大小变化处理
    // ========================================
    function initResizeHandler() {
        window.addEventListener('resize', function() {
            const topHeader = document.getElementById('topHeader');
            if (topHeader) {
                topHeader.style.transform = 'translateY(0)';
            }
            updateActiveNavLink();
        });
    }

    // ========================================
    // 初始化所有功能
    // ========================================
    function init() {
        // 初始化节气显示
        initSolarTerm();
        
        // 初始化日期
        updateDate();
        setInterval(updateDate, 60000);
        
        // 初始化天气（延迟加载）
        setTimeout(() => {
            WeatherService.getWeather();
        }, 500);
        setInterval(() => WeatherService.getWeather(), 1800000);
        
        // 初始化搜索引擎切换
        initSearchEngines();
        
        // 初始化邮箱下拉
        initEmailDropdown();
        
        // 初始化滚动处理
        initScrollHandler();
        
        // 初始化左侧导航
        initNavSidebar();
        
        // 初始化返回顶部
        initBackToTop();
        
        // 初始化窗口大小处理
        initResizeHandler();
        
        console.log('🚀 医往无际导航网站已初始化完成');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

    // ========================================
    // 禁止键盘快捷键（如F12、Ctrl+U、Ctrl+S）检测开发者工具
    // ========================================
document.addEventListener('keydown', function(e) {
    // 禁止F12
    if(e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    
    // 禁止Ctrl+U（查看源码）
    if(e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    
    // 禁止Ctrl+S（保存网页）
    if(e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
    }
    
    // 禁止Ctrl+Shift+I（开发者工具）
    if(e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
});
// 检测开发者工具
setInterval(function() {
    const startTime = performance.now();
    debugger;
    const endTime = performance.now();
    
    if(endTime - startTime > 100) {
        // 开发者工具可能已打开
        document.body.innerHTML = '<h1>禁止使用开发者工具</h1>';
        window.location.reload();
    }
}, 1000);