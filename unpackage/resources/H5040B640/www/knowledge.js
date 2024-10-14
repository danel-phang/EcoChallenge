document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    const apiKey = '2f26b003b9448d1322a2723141f22ea4'; // 请替换为您的实际API密钥
    let currentPage = 1;

    // 数据
    const knowledgeData = [
        { title: "节约用水的小妙招", description: "洗菜水可以用来浇花，减少用水浪费。" },
        { title: "低碳出行", description: "多选择公共交通或骑行，有助于减少碳排放。" },
        { title: "垃圾分类", description: "正确的垃圾分类能够大幅减少环境污染。" }
    ];

    // 加载环保小知识
    const knowledgeList = document.getElementById('knowledgeList');
    let knowledgeItems = '';
    knowledgeData.forEach(item => {
        knowledgeItems += `
            <li class="knowledge-item">
                <div class="knowledge-title">${item.title}</div>
                <div class="knowledge-description">${item.description}</div>
            </li>
        `;
    });
    knowledgeList.innerHTML = knowledgeItems;

    // 页面加载时获取初始新闻数据
    fetchNews();

    // 导航和按钮事件
    setupNavigation();
    setupButtons();

    function fetchNews(page = 1) { 
        showLoading();
        const url = 'https://apis.tianapi.com/huanbao/index';
        const data = new URLSearchParams();
        data.append('key', apiKey);
        data.append('num', '3');
        data.append('page', page);

        fetch(url, {
            method: 'POST',
            body: data,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            if (data.code === 200) {
                renderNews(data.result.newslist);
                document.getElementById('currentPage').textContent = page;
            } else {
                throw new Error(data.msg || '获取新闻失败');
            }
        })
        .catch(error => { 
            hideLoading();
            console.error('获取新闻失败:', error);
            document.getElementById('newsList').innerHTML = `<li class="error-message">获取新闻失败：${error.message}</li>`;
        });
    }

    function renderNews(newsList) {
        const newsListElement = document.getElementById('newsList');
        newsListElement.innerHTML = '';
        
        newsList.forEach(news => {
            const li = document.createElement('li');
            li.className = 'news-card';
            
            li.innerHTML = `
                <a href="${news.url}" target="_blank" class="news-link">
                    <img class="news-image" src="${news.picUrl || 'placeholder.jpg'}" alt="${news.title}">
                    <div class="news-content">
                        <h2 class="news-title">${news.title}</h2>
                        <p class="news-description">${news.description}</p>
                        <div class="news-meta">
                            <span class="news-source">${news.source}</span>
                            <span class="news-time">${news.ctime}</span>
                        </div>
                    </div>
                </a>
            `;
            
            newsListElement.appendChild(li);
        });
    }

    function setupButtons() {
        document.getElementById('aiAssistant').addEventListener('click', () => {
            window.location.href = 'ai-assistant.html';
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchNews(currentPage);
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            currentPage++;
            fetchNews(currentPage);
        });
    }

    function setupNavigation() {
        const navItems = document.querySelectorAll('nav li');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                handleNavigation(this.id);
            });
        });

        const activeNavItem = localStorage.getItem('activeNavItem');
        if (activeNavItem) {
            document.getElementById(activeNavItem).classList.add('active');
        }
    }

    function handleNavigation(id) {
        const routes = {
            'navHome': 'index.html',
            'navImpact': 'impact-tracking.html',
            'navAchievements': 'achievements.html',
            'navKnowledge': null  // 当前页面，无需跳转
        };
        if (routes[id]) { 
            window.location.href = routes[id];
        }
        localStorage.setItem('activeNavItem', id);
    } 

    function showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // 添加这个函数来检查API密钥
    function checkApiKey() {
        if (!apiKey || apiKey === '2f26b003b9448d1322a2723141f22ea4') {
            console.error('请替换为有效的API密钥');
            document.getElementById('newsList').innerHTML = '<li class="error-message">请在代码中设置有效的API密钥</li>';
            return false;
        }
        return true;
    }

    // 修改页面加载事件
    document.addEventListener('DOMContentLoaded', function() {
        feather.replace();
        if (checkApiKey()) {
            fetchNews();
        }
        setupNavigation();
        setupButtons();
    });
	
	let firstBackPressTime = null;
	document.addEventListener('plusready', function() {
	    plus.key.addEventListener('backbutton', function() {
	        if (!firstBackPressTime || (new Date().getTime() - firstBackPressTime > 2000)) {
	            firstBackPressTime = new Date().getTime();
	            plus.nativeUI.toast('再按一次退出应用');
	        } else {
	            plus.runtime.quit();
	        }
	    });
	});
});
