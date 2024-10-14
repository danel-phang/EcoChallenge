// script.js
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Feather图标
    feather.replace();

    // 获取元素
    const checkInButton = document.getElementById('checkInButton');
    const aiAssistant = document.getElementById('aiAssistant');

    // 添加打卡按钮点击事件
    checkInButton.addEventListener('click', function() {
        alert('恭喜你完成今日环保挑战！');
    });

    // 添加AI助手按钮点击事件
    const aiAssistantButton = document.getElementById('aiAssistant');
    aiAssistantButton.addEventListener('click', function() {
        window.location.href = 'ai-assistant.html';
    });

    // 设置导航栏的点击事件
    const navItems = document.querySelectorAll('nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的 active 类
            navItems.forEach(nav => nav.classList.remove('active'));
            // 为被点击的导航项添加 active 类
            this.classList.add('active');

            // 根据点击的导航项进行页面跳转
            switch(this.id) {
                case 'navHome':
                    window.location.href = 'index.html';
                    break;
                case 'navImpact':
                    window.location.href = 'impact-tracking.html';
                    break;
                case 'navAchievements':
                    window.location.href = 'achievements.html';
                    break;
                case 'navKnowledge':
                    window.location.href = 'knowledge.html';
                    break;
            }

            // 保存当前活跃的导航项到 localStorage
            localStorage.setItem('activeNavItem', this.id);
        });
    });

    // 页面加载时，根据 localStorage 中保存的值设置活跃的导航项
    const activeNavItem = localStorage.getItem('activeNavItem');
    if (activeNavItem) {
        const activeItem = document.getElementById(activeNavItem);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    // 添加对返回按钮的监听
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
