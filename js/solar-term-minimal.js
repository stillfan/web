/**
 * 简洁节气显示 - 一行描述，透明背景（修复版）
 */

(function() {
    'use strict';
    
    // 修复函数：确保图片路径正确
    function getFullImageUrl(relativePath) {
        if (!relativePath) return '';
        
        // 如果是完整URL，直接返回
        if (relativePath.startsWith('http') || relativePath.startsWith('//')) {
            return relativePath;
        }
        
        // 如果是绝对路径（以/开头）
        if (relativePath.startsWith('/')) {
            return window.location.origin + relativePath;
        }
        
        // 如果是相对路径
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        return window.location.origin + basePath + relativePath;
    }
    
    // 等待DOM加载完成
    function init() {
        console.log('简洁节气系统初始化...');
        
        const searchSection = document.getElementById('searchSection');
        if (!searchSection) {
            console.error('❌ 找不到 #searchSection 元素');
            console.log('当前页面结构:', document.body.innerHTML.substring(0, 500));
            return;
        }
        
        console.log('✅ 找到 searchSection');
        
        // 检查CSS是否已加载
        const styles = window.getComputedStyle(searchSection, '::before');
        console.log('当前 ::before 背景:', styles.backgroundImage);
        
        // 获取当前节气信息
        const termInfo = SolarTermSimple.getCurrentInfo();
        const fullImageUrl = getFullImageUrl(SolarTermSimple.backgrounds[termInfo.name]);
        
        console.log('节气信息:', {
            name: termInfo.name,
            description: termInfo.description,
            relativePath: SolarTermSimple.backgrounds[termInfo.name],
            fullImageUrl: fullImageUrl
        });
        
        // 创建节气描述元素
        createDescription(termInfo, searchSection);
        
        // 设置背景图片
        setBackground(fullImageUrl);
        
        // 启动定时检查
        startAutoCheck();
        
        // 预加载测试
        testImageLoad(fullImageUrl);
    }
    
    // 测试图片加载
    function testImageLoad(url) {
        const testImg = new Image();
        testImg.onload = () => console.log(`✅ 图片加载成功: ${url}`);
        testImg.onerror = () => console.error(`❌ 图片加载失败: ${url}`);
        testImg.src = url;
    }
    
    // 创建一行描述文字
    function createDescription(termInfo, container) {
        // 移除已存在的描述
        const oldDesc = document.getElementById('solar-term-line');
        if (oldDesc) oldDesc.remove();
        
        // 创建描述元素
        const descElement = document.createElement('div');
        descElement.id = 'solar-term-line';
        descElement.className = 'solar-term-line';
        
        // 设置内容
        descElement.innerHTML = `
            <span class="term-name">${termInfo.name}</span>
            <span class="term-desc">${termInfo.description}</span>
            <span class="term-icon">🌱</span>
        `;
        
        // 插入到搜索框上方
        const searchContainer = container.querySelector('.search-container');
        if (searchContainer) {
            container.insertBefore(descElement, searchContainer);
            console.log('✅ 描述文字已插入到 search-container 前');
        } else {
            container.appendChild(descElement);
            console.log('✅ 描述文字已添加到 search-section 末尾');
        }
        
        // 立即显示
        setTimeout(() => {
            descElement.style.opacity = '1';
            descElement.style.transform = 'translateY(0)';
            console.log('✅ 描述文字动画已触发');
        }, 100);
    }
    
    // 设置背景图片（强制覆盖所有样式）
    function setBackground(imageUrl) {
        console.log('设置背景图片:', imageUrl);
        
        // 创建高优先级样式
        const styleId = 'solar-bg-force';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        // 使用最高优先级
        styleElement.innerHTML = `
            #searchSection {
                position: relative !important;
                overflow: hidden !important;
            }
            
            #searchSection::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                background-image: url('${imageUrl}') !important;
                background-size: cover !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                opacity: 0.8 !important;
                z-index: 1 !important;
                transition: background-image 1.2s ease-in-out !important;
            }
        `;
    }
    
    // 启动自动检查
    function startAutoCheck() {
        let currentTerm = SolarTermSimple.getCurrentTerm();
        console.log(`开始自动检查，当前节气: ${currentTerm}`);
        
        // 每小时检查一次
        setInterval(() => {
            const newTerm = SolarTermSimple.getCurrentTerm();
            if (newTerm !== currentTerm) {
                console.log(`🔄 节气切换: ${currentTerm} -> ${newTerm}`);
                currentTerm = newTerm;
                
                const termInfo = SolarTermSimple.getCurrentInfo();
                const searchSection = document.getElementById('searchSection');
                const fullImageUrl = getFullImageUrl(SolarTermSimple.backgrounds[newTerm]);
                
                if (searchSection) {
                    createDescription(termInfo, searchSection);
                    setBackground(fullImageUrl);
                }
            }
        }, 60 * 60 * 1000);
    }
    
    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 300);
        });
    } else {
        setTimeout(init, 300);
    }
    
})();