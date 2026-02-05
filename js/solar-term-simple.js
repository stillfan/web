// 简洁版节气配置 - 使用本地图片
const SolarTermSimple = {
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
    
    // 一行节气描述
    descriptions: {
        '立春': '立春 · 万物起始，一切更生',
        '雨水': '雨水 · 降雨开始，万物萌动',
        '惊蛰': '惊蛰 · 春雷始鸣，惊醒蛰虫',
        '春分': '春分 · 昼夜平分，春暖花开',
        '清明': '清明 · 气清景明，万物皆显',
        '谷雨': '谷雨 · 雨生百谷，滋润万物',
        '立夏': '立夏 · 夏季开始，万物繁茂',
        '小满': '小满 · 小得盈满，麦类渐熟',
        '芒种': '芒种 · 有芒之种，可稼可穑',
        '夏至': '夏至 · 日长之至，日影短至',
        '小暑': '小暑 · 暑气渐盛，但未至极',
        '大暑': '大暑 · 炎热至极，一年最热',
        '立秋': '立秋 · 秋季开始，暑去凉来',
        '处暑': '处暑 · 暑气渐止，秋意渐浓',
        '白露': '白露 · 天气转凉，露凝而白',
        '秋分': '秋分 · 昼夜平分，秋高气爽',
        '寒露': '寒露 · 露水已寒，将欲凝结',
        '霜降': '霜降 · 天气渐冷，开始有霜',
        '立冬': '立冬 · 冬季开始，万物收藏',
        '小雪': '小雪 · 开始降雪，雪量不大',
        '大雪': '大雪 · 降雪增多，地面积雪',
        '冬至': '冬至 · 日短之至，日影长至',
        '小寒': '小寒 · 天气寒冷，但未至极',
        '大寒': '大寒 · 寒冷至极，一年最冷'
    },
    
    // 获取当前节气
    getCurrentTerm: function() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        
        // 简化的节气判断
        if (month === 1) return day < 20 ? '小寒' : '大寒';
        if (month === 2) return day < 4 ? '大寒' : (day < 19 ? '立春' : '雨水');
        if (month === 3) return day < 6 ? '雨水' : (day < 21 ? '惊蛰' : '春分');
        if (month === 4) return day < 5 ? '春分' : (day < 20 ? '清明' : '谷雨');
        if (month === 5) return day < 6 ? '谷雨' : (day < 21 ? '立夏' : '小满');
        if (month === 6) return day < 6 ? '小满' : (day < 22 ? '芒种' : '夏至');
        if (month === 7) return day < 7 ? '夏至' : (day < 23 ? '小暑' : '大暑');
        if (month === 8) return day < 8 ? '大暑' : (day < 23 ? '立秋' : '处暑');
        if (month === 9) return day < 8 ? '处暑' : (day < 23 ? '白露' : '秋分');
        if (month === 10) return day < 9 ? '秋分' : (day < 24 ? '寒露' : '霜降');
        if (month === 11) return day < 8 ? '霜降' : (day < 23 ? '立冬' : '小雪');
        if (month === 12) return day < 7 ? '小雪' : (day < 22 ? '大雪' : '冬至');
        
        return '立春';
    },
    
    // 获取当前节气信息
    getCurrentInfo: function() {
        const term = this.getCurrentTerm();
        const imagePath = this.backgrounds[term] || this.backgrounds['立春'];
        
        // 构建完整的图片URL（确保路径正确）
        const baseUrl = window.location.origin + window.location.pathname;
        const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
        const fullImageUrl = imagePath.startsWith('http') ? imagePath : basePath + imagePath;
        
        return {
            name: term,
            image: fullImageUrl,
            description: this.descriptions[term] || '节气描述'
        };
    },
    
    // 预加载所有图片
    preloadAllImages: function() {
        const allImages = Object.values(this.backgrounds);
        allImages.forEach(imagePath => {
            const img = new Image();
            img.src = imagePath.startsWith('http') ? imagePath : 
                     (window.location.origin + window.location.pathname).substring(0, 
                     (window.location.origin + window.location.pathname).lastIndexOf('/') + 1) + imagePath;
            img.onload = () => console.log(`✅ 预加载成功: ${imagePath}`);
            img.onerror = () => console.warn(`⚠️ 预加载失败: ${imagePath}`);
        });
    }
};