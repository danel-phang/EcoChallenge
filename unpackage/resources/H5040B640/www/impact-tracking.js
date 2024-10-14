// impact-tracking.js
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Feather图标
    feather.replace();

    // 模拟数据 - 实际应用中，这些数据应该从服务器获取
    const userData = {
        totalWaterSaved: 1200,
        totalCarbonReduced: 45,
        totalEnergySaved: 320,
        waterGoalProgress: 60,
        carbonGoalProgress: 45,
        energyGoalProgress: 80,
        achievements: [
            { icon: 'droplet', name: '节水达人' },
            { icon: 'zap', name: '节能先锋' },
            { icon: 'trash-2', name: '垃圾分类王' }
        ],
        recentTasks: [
            { name: '节约用水', date: '2024-09-20', points: 50 },
            { name: '使用可重复购物袋', date: '2024-09-19', points: 30 },
            { name: '减少食物浪费', date: '2024-09-18', points: 40 }
        ]
    };

    // 更新总体环保影响
    document.getElementById('totalWaterSaved').textContent = userData.totalWaterSaved + 'L';
    document.getElementById('totalCarbonReduced').textContent = userData.totalCarbonReduced + 'kg';
    document.getElementById('totalEnergySaved').textContent = userData.totalEnergySaved + 'kWh';

    // 更新进度条
    updateProgressBar('waterProgress', 'waterPercentage', userData.waterGoalProgress);
    updateProgressBar('carbonProgress', 'carbonPercentage', userData.carbonGoalProgress);
    updateProgressBar('energyProgress', 'energyPercentage', userData.energyGoalProgress);

    // 添加成就
    const achievementsGrid = document.getElementById('achievementsGrid');
    const achievementElements = userData.achievements.map(achievement => `
        <div class="achievement">
            <i data-feather="${achievement.icon}"></i>
            <p>${achievement.name}</p>
        </div>
    `).join('');
    achievementsGrid.innerHTML = achievementElements;
    feather.replace();  // 只在最后调用一次
	
	
	const aiAssistantButton = document.getElementById('aiAssistant');
	aiAssistantButton.addEventListener('click', function() {
	    window.location.href = 'ai-assistant.html';
	});
	
	
    // 添加最近完成的任务
    const taskList = document.getElementById('taskList');
    const taskElements = userData.recentTasks.map(task => `
        <li class="task-item">
            <div class="task-name">${task.name}</div>
            <div class="task-date">${task.date}</div>
            <div class="task-points">+${task.points} 生态点</div>
        </li>
    `).join('');
    taskList.innerHTML = taskElements;

    // 添加导航点击事件
    handleNavigation();

    // 懒加载趋势图表
    const trendChartCanvas = document.getElementById('trendChart');
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            createTrendChart();
            observer.disconnect(); // 只加载一次
        }
    });
    observer.observe(trendChartCanvas);
});

function updateProgressBar(progressId, percentageId, value) {
    const progressElement = document.getElementById(progressId);
    const percentageElement = document.getElementById(percentageId);
    progressElement.style.width = value + '%';
    percentageElement.textContent = value + '%';
}

function createTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '每日生态点',
                data: [50, 80, 60, 120, 90, 100, 75],
                borderColor: '#4caf50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function handleNavigation() {
    const navItems = document.querySelectorAll('nav li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            switch(this.id) {
                case 'navHome':
                    window.location.href = 'index.html';
                    break;
                case 'navAchievements':
                    window.location.href = 'achievements.html';
                    break;
                case 'navKnowledge':
                    window.location.href = 'knowledge.html';
                    break;
            }
            localStorage.setItem('activeNavItem', this.id);
        });
    });
}
