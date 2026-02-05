// 日期显示
function updateDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    const dateString = `${year}年${month}月${day}日 ${weekday}`;
    document.getElementById('current-date').textContent = dateString;
}

// 高德天气API Key
const AMAP_KEY = '2c7f36c3d2328a0eda0da50f0f4c0179';

// 方法1: 使用CORS代理服务器
async function fetchWithCorsProxy(url) {
    // 可选的CORS代理服务器列表
    const corsProxies = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`
    ];
    
    for (const proxyUrl of corsProxies) {
        try {
            console.log('尝试代理:', proxyUrl);
            const response = await fetch(proxyUrl, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('代理请求成功');
                return data;
            }
        } catch (error) {
            console.warn('代理请求失败:', proxyUrl, error.message);
            continue;
        }
    }
    
    throw new Error('所有代理服务器都失败了');
}

// 方法2: 直接JSONP（备用方案）
function jsonpRequest(url, callbackName) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            if (window[callbackName]) delete window[callbackName];
            reject(new Error('JSONP请求超时'));
        }, 8000);
        
        window[callbackName] = function(data) {
            clearTimeout(timeout);
            delete window[callbackName];
            resolve(data);
        };
        
        const script = document.createElement('script');
        script.src = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
        script.onerror = () => {
            clearTimeout(timeout);
            if (window[callbackName]) delete window[callbackName];
            reject(new Error('JSONP加载失败'));
        };
        
        document.head.appendChild(script);
    });
}

// 获取天气的多种尝试方案
async function getWeatherWithMultipleAttempts() {
    const attempts = [];
    
    // 尝试1: 直接fetch（如果服务器支持CORS）
    attempts.push(async () => {
        try {
            console.log('尝试直接fetch...');
            const ipResponse = await fetch(`https://restapi.amap.com/v3/ip?key=${AMAP_KEY}`);
            if (!ipResponse.ok) throw new Error(`HTTP ${ipResponse.status}`);
            const ipData = await ipResponse.json();
            
            if (ipData.status === '1' && ipData.adcode) {
                const weatherResponse = await fetch(
                    `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${ipData.adcode}&extensions=base`
                );
                const weatherData = await weatherResponse.json();
                
                if (weatherData.status === '1' && weatherData.lives?.length > 0) {
                    return {
                        type: 'direct',
                        data: weatherData.lives[0]
                    };
                }
            }
        } catch (error) {
            console.log('直接fetch失败:', error.message);
            throw error;
        }
    });
    
    // 尝试2: CORS代理
    attempts.push(async () => {
        try {
            console.log('尝试CORS代理...');
            const ipData = await fetchWithCorsProxy(`https://restapi.amap.com/v3/ip?key=${AMAP_KEY}`);
            
            if (ipData.status === '1' && ipData.adcode) {
                const weatherData = await fetchWithCorsProxy(
                    `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${ipData.adcode}&extensions=base`
                );
                
                if (weatherData.status === '1' && weatherData.lives?.length > 0) {
                    return {
                        type: 'proxy',
                        data: weatherData.lives[0]
                    };
                }
            }
        } catch (error) {
            console.log('CORS代理失败:', error.message);
            throw error;
        }
    });
    
    // 尝试3: JSONP
    attempts.push(async () => {
        try {
            console.log('尝试JSONP...');
            const callback1 = 'amap_cb_' + Date.now() + '_1';
            const ipData = await jsonpRequest(
                `https://restapi.amap.com/v3/ip?key=${AMAP_KEY}`,
                callback1
            );
            
            if (ipData.status === '1' && ipData.adcode) {
                const callback2 = 'amap_cb_' + Date.now() + '_2';
                const weatherData = await jsonpRequest(
                    `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${ipData.adcode}&extensions=base`,
                    callback2
                );
                
                if (weatherData.status === '1' && weatherData.lives?.length > 0) {
                    return {
                        type: 'jsonp',
                        data: weatherData.lives[0]
                    };
                }
            }
        } catch (error) {
            console.log('JSONP失败:', error.message);
            throw error;
        }
    });
    
    // 尝试4: 使用默认城市（兰州）
    attempts.push(async () => {
        try {
            console.log('尝试默认城市(兰州)...');
            const response = await fetch(
                `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=620100&extensions=base`
            );
            
            if (response.ok) {
                const weatherData = await response.json();
                if (weatherData.status === '1' && weatherData.lives?.length > 0) {
                    return {
                        type: 'default_city',
                        data: weatherData.lives[0]
                    };
                }
            }
        } catch (error) {
            console.log('默认城市失败:', error.message);
            throw error;
        }
    });
    
    // 顺序尝试所有方法
    for (let i = 0; i < attempts.length; i++) {
        try {
            console.log(`正在尝试第 ${i + 1} 种方法...`);
            const result = await attempts[i]();
            console.log(`第 ${i + 1} 种方法成功:`, result.type);
            return result;
        } catch (error) {
            console.log(`第 ${i + 1} 种方法失败:`, error.message);
            if (i === attempts.length - 1) {
                throw new Error(`所有 ${attempts.length} 种方法都失败了`);
            }
        }
    }
}

// 主要天气获取函数
async function getGaodeWeather() {
    const weatherContainer = document.getElementById('weather-info');
    
    // 显示加载状态
    weatherContainer.innerHTML = `
        <div class="weather-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>正在获取天气...</span>
        </div>
    `;
    
    try {
        console.log('开始天气获取流程...');
        const result = await getWeatherWithMultipleAttempts();
        
        console.log('天气数据获取成功:', result);
        updateWeatherDisplay(result.data, result.type);
        
    } catch (error) {
        console.error('最终天气获取失败:', error);
        
        // 显示最终错误，但提供刷新按钮
        weatherContainer.innerHTML = `
            <div class="weather-final-error">
                <i class="fas fa-cloud-slash"></i>
                <div class="error-content">
                    <div class="error-title">天气服务异常</div>
                    <div class="error-detail">${error.message}</div>
                    <button onclick="retryWeather()" class="retry-btn">
                        <i class="fas fa-redo"></i> 重新获取
                    </button>
                    <div class="error-tip">
                        可能原因：网络问题、API限制、跨域限制
                    </div>
                </div>
            </div>
        `;
    }
}

// 重新获取天气
function retryWeather() {
    console.log('用户手动重新获取天气...');
    getGaodeWeather();
}

// 更新天气显示
function updateWeatherDisplay(weatherData, sourceType) {
    const icon = getWeatherIcon(weatherData.weather);
    const sourceText = sourceType === 'default_city' ? '' : '';
    
    const weatherHTML = `
        <div class="weather-content">
            <div class="weather-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="weather-details">
                <div class="weather-temp">${weatherData.temperature}°C</div>
                <div class="weather-info">
                    <span class="weather-text">${sourceText}${weatherData.weather}</span>
                    <span class="weather-city">${weatherData.city || weatherData.province || ''}</span>
                </div>
                <div class="weather-source">
                    <small>${getSourceText(sourceType)}</small>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('weather-info').innerHTML = weatherHTML;
}

// 获取来源文本
function getSourceText(sourceType) {
    const texts = {
        'direct': '直接API',
        'proxy': '代理访问',
        'jsonp': 'JSONP请求',
        'default_city': '示例数据(兰州)'
    };
    return texts[sourceType] || 'API数据';
}

// 根据天气描述获取图标
function getWeatherIcon(weatherText) {
    if (!weatherText) return 'question-circle';
    
    const iconMap = {
        '晴': 'sun', '多云': 'cloud-sun', '阴': 'cloud',
        '雾': 'smog', '雨': 'cloud-rain', '小雨': 'cloud-rain',
        '中雨': 'cloud-showers-heavy', '大雨': 'cloud-showers-heavy',
        '暴雨': 'cloud-showers-water', '雷阵雨': 'bolt',
        '雪': 'snowflake', '小雪': 'snowflake', '中雪': 'snowflake',
        '大雪': 'snowflake', '暴雪': 'ice-cream', '雨夹雪': 'cloud-meatball',
        '冰雹': 'poo-storm', '沙尘': 'wind', '沙尘暴': 'wind',
        '雾霾': 'smog', '扬沙': 'wind'
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
        if (weatherText.includes(key)) return icon;
    }
    
    return 'question-circle';
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    
    // 延迟获取天气
    setTimeout(() => {
        getGaodeWeather();
    }, 1000);
    
    // 每分钟更新日期
    setInterval(updateDate, 60000);
    
    // 每30分钟更新天气
    setInterval(getGaodeWeather, 1800000);
});

// 添加CSS样式
const weatherStyle = document.createElement('style');
weatherStyle.textContent = `
    .weather-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60px;
        min-width: 160px;
        padding: 5px 0;
    }
    
    .weather-content {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }
    
    .weather-icon {
        font-size: 26px;
        color: #3498db;
        min-width: 35px;
        text-align: center;
    }
    
    .weather-details {
        flex: 1;
        min-width: 0;
    }
    
    .weather-temp {
        font-weight: bold;
        font-size: 16px;
        color: #2c3e50;
        line-height: 1.3;
    }
    
    .weather-info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin: 3px 0;
    }
    
    .weather-text {
        font-size: 13px;
        color: #7f8c8d;
    }
    
    .weather-city {
        font-size: 12px;
        color: #95a5a6;
        background: #f5f7fa;
        padding: 2px 6px;
        border-radius: 3px;
    }
    
    .weather-source {
        font-size: 10px;
        color: #bdc3c7;
        margin-top: 2px;
    }
    
    .weather-loading {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #3498db;
        font-size: 13px;
        padding: 8px;
    }
    
    .weather-final-error {
        display: flex;
        align-items: center;
        gap: 12px;
        color: #e74c3c;
        padding: 10px;
        background: #fdf2f2;
        border-radius: 6px;
        border: 1px solid #fadbd8;
        max-width: 250px;
    }
    
    .fa-cloud-slash {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .error-content {
        flex: 1;
    }
    
    .error-title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .error-detail {
        font-size: 12px;
        color: #c0392b;
        margin-bottom: 8px;
        word-break: break-word;
    }
    
    .error-tip {
        font-size: 11px;
        color: #95a5a6;
        margin-top: 6px;
        font-style: italic;
    }
    
    .retry-btn {
        background: #3498db;
        color: white;
        border: none;
        padding: 5px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        transition: background 0.3s;
    }
    
    .retry-btn:hover {
        background: #2980b9;
    }
    
    .fa-spinner {
        animation: fa-spin 1.5s linear infinite;
    }
    
    @keyframes fa-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .date-info {
        font-size: 14px;
        color: #2c3e50;
        font-weight: 500;
        text-align: center;
        line-height: 1.3;
        white-space: nowrap;
    }
    
    @media (max-width: 768px) {
        .weather-container {
            min-width: 140px;
        }
        
        .weather-icon {
            font-size: 22px;
        }
        
        .weather-temp {
            font-size: 15px;
        }
        
        .weather-text {
            font-size: 12px;
        }
        
        .date-info {
            font-size: 13px;
        }
    }
`;

if (!document.querySelector('#weather-styles')) {
    weatherStyle.id = 'weather-styles';
    document.head.appendChild(weatherStyle);
}

// 控制台帮助信息
console.log(`
%c天气服务已初始化%c
高德Key: ${AMAP_KEY}
将尝试多种获取方式...
1. 直接API (需要CORS)
2. CORS代理
3. JSONP
4. 默认城市(兰州)
`, 'color: #2ecc71; font-weight: bold; font-size: 14px;', 'color: #7f8c8d;');