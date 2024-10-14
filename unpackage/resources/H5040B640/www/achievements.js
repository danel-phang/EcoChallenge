document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    const achievementsData = {
        completed: [
            { icon: 'droplet', name: '节水达人' },
            { icon: 'zap', name: '节能先锋' },
            { icon: 'trash-2', name: '垃圾分类王' }
        ],
        available: [
            { icon: 'leaf', name: '绿色生活' },
            { icon: 'wind', name: '空气卫士' },
            { icon: 'sun', name: '太阳能用户' }
        ]
    };



    // 加载已完成的成就
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsData.completed.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement completed';
        achievementElement.innerHTML = `
            <i data-feather="${achievement.icon}"></i>
            <p>${achievement.name}</p>
        `;
        achievementsGrid.appendChild(achievementElement);
    });
    

    const aiAssistantButton = document.getElementById('aiAssistant');
    aiAssistantButton.addEventListener('click', function() {
        window.location.href = 'ai-assistant.html';
    });

    

    // 加载可获取的成就
    const availableAchievementsGrid = document.getElementById('availableAchievementsGrid');
    achievementsData.available.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'available-achievement';
        achievementElement.innerHTML = `
            <i data-feather="${achievement.icon}"></i>
            <p>${achievement.name}</p>
        `;
        availableAchievementsGrid.appendChild(achievementElement);
    });

    // 设置导航栏的点击事件
    const navItems = document.querySelectorAll('nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            switch (this.id) {
                case 'navHome':
                    window.location.href = 'index.html';
                    break;
                case 'navImpact':
                    window.location.href = 'impact-tracking.html';
                    break;
                case 'navAchievements':
                    // 当前页面，无需跳转
                    break;
                case 'navKnowledge':
                    window.location.href = 'knowledge.html';
                    break;
                default:
                    break;
            }
            localStorage.setItem('activeNavItem', this.id);
        });
    });
	
	
	let firstBackPressTime = null;
	document.addEventListener('plusready', function() {
	    plus.key.addEventListener('backbutton', function() {

	            // 用户在首页按返回键
	        if (!firstBackPressTime || (new Date().getTime() - firstBackPressTime > 2000)) {
	            firstBackPressTime = new Date().getTime();
	            plus.nativeUI.toast('再按一次退出应用');
	        } else {
	            plus.runtime.quit();
	        }
	        
	    });
	});
	

    // 页面加载时，根据 localStorage 中的值设置活跃的导航项
    const activeNavItem = localStorage.getItem('activeNavItem');
    if (activeNavItem) {
        document.getElementById(activeNavItem).classList.add('active');
    }
	
});
