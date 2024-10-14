document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const backButton = document.getElementById('backButton');

    backButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'assistant-message');
        
        const contentSpan = document.createElement('span');
        contentSpan.textContent = content;
        messageDiv.appendChild(contentSpan);
        
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';

            try {
                const response = await fetch('https://free.gpt.ge/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer sk-hGpY3p8gjsFhyhqL7348B2A9638f441b95C87aFfEb8cCe40'
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [{role: 'user', content: message}]
                    })
                });

                const data = await response.json();
                const reply = data.choices[0].message.content;
                addMessage(reply);
            } catch (error) {
                console.error('Error:', error);
                addMessage('抱歉，发生了错误，请稍后再试。');
            }
        }
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
	
	
	let firstBackPressTime = null;
	document.addEventListener('plusready', function() {
	    plus.key.addEventListener('backbutton', function() {
	        if (window.location.pathname.endsWith('index.html')) {
	            // 用户在首页按返回键
	            if (!firstBackPressTime || (new Date().getTime() - firstBackPressTime > 2000)) {
	                firstBackPressTime = new Date().getTime();
	                plus.nativeUI.toast('再按一次退出应用');
	            } else {
	                plus.runtime.quit();
	            }
	        } else {
	            // 用户在非首页按返回键
	            history.back();
	        }
	    });
	});
	

    addMessage('您好！我是AI环保助手。有什么环保相关的问题我可以帮您解答吗？');
    scrollToBottom(); // 确保初始消息可见
});