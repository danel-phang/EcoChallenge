document.addEventListener('DOMContentLoaded', function () {
    feather.replace();

    // 获取页面元素
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const backButton = document.getElementById('backButton');

    // 返回按钮点击事件：跳转到首页
    backButton.addEventListener('click', function () {
        window.location.href = 'index.html';
    });

    // 滚动到底部
    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // 格式化时间
    function formatTime(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    }

    // 添消息到聊天容器
    function addMessage(content, isUser = false, musicData = null, videoData = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user-message' : 'assistant-message');

        if (musicData) {
            create_music(musicData, messageDiv);
        } else if (videoData) {
            create_movie(videoData, messageDiv);
        } else {
            const contentSpan = document.createElement('span');
            contentSpan.textContent = content;
            messageDiv.appendChild(contentSpan);
        }

        const buttonTimeContainer = document.createElement('div');
        buttonTimeContainer.classList.add('message-buttons-time');

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('message-buttons');

        // 复制文本按钮
        var copyTextButton = createButton('', 'copy');
        copyTextButton.addEventListener('click', function() {
            copyTextToClipboard(content);
        });
        buttonContainer.appendChild(copyTextButton);

        // 复制代码按钮（只对助手消息显示）
        if (1) {
            var copyCodeButton = createButton('', 'code');
            copyCodeButton.addEventListener('click', function() {
                var codeBlock = messageDiv.querySelector('pre');
                if (codeBlock) {
                    copyTextToClipboard(codeBlock.textContent);
                }
            });
            buttonContainer.appendChild(copyCodeButton);
        }

        // 播放音频按钮（消息中包含音频）
        if (content.includes('audio')) {
            var playAudioButton = createButton('', 'play');
            playAudioButton.addEventListener('click', function() {
                var audioElement = messageDiv.querySelector('audio');
                if (audioElement) {
                    playAudio(audioElement);
                }
            });
            buttonContainer.appendChild(playAudioButton);
        }

        // 查看视频按钮（消息中包含视频）
        if (videoData) {
            var viewVideoButton = createButton('', 'video');
            viewVideoButton.addEventListener('click', function() {
                var videoElement = messageDiv.querySelector('.video_tag');
                if (videoElement) {
                    get_movie(videoElement);
                }
            });
            buttonContainer.appendChild(viewVideoButton);
        }

        // 添加时间
        var time = document.createElement('div');
        time.classList.add('message-time');
        time.textContent = formatTime(new Date());

        buttonTimeContainer.appendChild(buttonContainer);
        buttonTimeContainer.appendChild(time);
        messageDiv.appendChild(buttonTimeContainer);
        chatContainer.appendChild(messageDiv);
        scrollToBottom();

        feather.replace();
    }

    // 创建消息底部按钮的辅助函数, parameter: 按钮文字,按钮feather代号
    function createButton(text, icon) {
        var button = document.createElement('button');
        button.classList.add('message-button');
        var iconElement = document.createElement('i');
        iconElement.setAttribute('data-feather', icon);
        button.appendChild(iconElement);
        button.appendChild(document.createTextNode(text));
        return button;
    }

    // 复制文本到剪贴板的函数
    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            alert('文本已复制到剪贴板');
        }, function(err) {
            console.error('无法复制文本: ', err);
        });
    }

    // 播放音频的函数
    function playAudio(audioElement) {
        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    }

    // 添加 creat_image 函数
    function creat_image(prompt) {
        var messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'assistant-message');

        var imgContainer = document.createElement('div');
        imgContainer.classList.add('image-container');
        messageDiv.appendChild(imgContainer);

        // 创建加载中的图片
        var loadingImg = document.createElement('img');
        loadingImg.src = "/static/image/loading2.gif";
        imgContainer.appendChild(loadingImg);

        chatContainer.appendChild(messageDiv);
        scrollToBottom();

        // 发送图片生成请求
        $.ajax({
            type: 'post',
            url: window.vip_url + '/generate_image',
            data: JSON.stringify({
                data: prompt,
                size: '1024x1024', // 可以根据需要修改
                img_number: 1 // 生成一张图片
            }),
            contentType: "application/json",
            success: function (result) {
                loadingImg.style.display = 'none';
                if (result.img_urls && result.img_urls.length > 0) {
                    var imgTag = document.createElement('img');
                    imgTag.src = "/static/img.png";
                    imgTag.onerror = function () {
                        this.src = result.img_urls[0].url;
                        this.alt = "生成的图片";
                    };
                    imgContainer.appendChild(imgTag);
                } else {
                    var errorMsg = document.createElement('p');
                    errorMsg.textContent = "图片生成失败";
                    imgContainer.appendChild(errorMsg);
                }
                scrollToBottom();
            },
            error: function () {
                loadingImg.style.display = 'none';
                var errorMsg = document.createElement('p');
                errorMsg.textContent = "图片生成请求失败";
                imgContainer.appendChild(errorMsg);
                scrollToBottom();
            }
        });

        // 添加时间和按钮
        var buttonTimeContainer = document.createElement('div');
        buttonTimeContainer.classList.add('message-buttons-time');

        var buttonContainer = document.createElement('div');
        buttonContainer.classList.add('message-buttons');

        var time = document.createElement('div');
        time.classList.add('message-time');
        time.textContent = formatTime(new Date());

        buttonTimeContainer.appendChild(buttonContainer);
        buttonTimeContainer.appendChild(time);
        messageDiv.appendChild(buttonTimeContainer);

        feather.replace();
    }

    // 修改 sendMessage 函数以支持图片生成
    async function sendMessage() {
        var message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = ''; // 清空输入框
            

            if (message.toLowerCase().startsWith('生成图片:')) {
                // 如果消息以 "生成图片:" 开头，调用 creat_image 函数
                creat_image(message.slice(5).trim());
            }
            
            // 如果消息以 "播放音乐:" 开头，调用音乐搜索API
            else if (message.toLowerCase().startsWith('播放音乐:')) {
                try {
                    const response = await fetch('/api/search_music', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ query: message.slice(5).trim() })
                    });
                    const data = await response.json();
                    if (data.music && data.music.length > 0) {
                        addMessage('为您找到以下音乐：', false);
                        addMessage(null, false, data.music);
                    } else {
                        addMessage('抱歉，没有找到相关音乐。', false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    addMessage('抱歉，搜索音乐时发生错误。', false);
                }
            }

            // 如果消息以 "播放视频:" 开头，调用视频搜索API
            else if (message.toLowerCase().startsWith('播放视频:')) {
                try {
                    const response = await fetch('/api/search_video', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ query: message.slice(5).trim() })
                    });
                    const data = await response.json();
                    if (data.video) {
                        addMessage('为您找到以下视频：', false);
                        addMessage(null, false, null, data.video);
                    } else {
                        addMessage('抱歉，没有找到相关视频。', false);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    addMessage('抱歉，搜索视频时发生错误。', false);
                }
            }

            // 否则正常聊天
            else {
                try {
                    const response = await fetch('https://free.gpt.ge/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer sk-hGpY3p8gjsFhyhqL7348B2A9638f441b95C87aFfEb8cCe40'
                        },
                        body: JSON.stringify({
                            model: 'gpt-3.5-turbo',
                            messages: [{ role: 'user', content: message }]
                        })
                    });

                    const data = await response.json();
                    const reply = data.choices[0].message.content;
                    addMessage(reply); // 显示回复
                } catch (error) {
                    console.error('Error:', error);
                    addMessage('抱歉，发生了错误，请稍后再试。');
                }
            }
        }
    }

    // 绑定发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 监听输入框回车键
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 处理返回键事件
    let firstBackPressTime = null;
    document.addEventListener('plusready', function () {
        plus.key.addEventListener('backbutton', function () {
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

    // 初始化聊天窗口
    addMessage('您好！我是AI助手。有什么我可以帮您解答的问题吗 ？');

    scrollToBottom(); // 确保初始消息可见

    // 渲染 Feather 图标
    feather.replace();
});

// 添加 recover_music 函数（如果在其他地方未定义）
function recover_music(audioElement, src, tryTime = 0) {
    if (tryTime < 3) {
        setTimeout(() => {
                audioElement.src = src;
                audioElement.dataset.tryTime = tryTime + 1;
            }, 1000);
        } else {
            console.log("音频加载失败");
    }
}

// 添加 create_movie 函数
function create_movie(data, newp) {
    var video_div = document.createElement('div')
    video_div.className = "video_div"
    var h4 = document.createElement("h4")
    h4.innerHTML = data['title']
    video_div.appendChild(h4)
    video_div_play = document.createElement("div")
    video_div_play.className = "video_div_play"
    var video = document.createElement("video")
    video.className = "video_tag"
    video.id = data['m3u8']
    video.controls = "controls"
    video_div_play.appendChild(video)
    video_div.appendChild(video_div_play)
    newp.appendChild(video_div)
}

// 添加 get_movie 函数
function get_movie(video) {
    // 初始化 Hls.js
    if (Hls.isSupported()) {
        var hls = new Hls();
        var m3u8Url = video.id;  // 替换为你的视频资源路径
        hls.loadSource(m3u8Url);
        hls.attachMedia(video);
        console.log("加载视频！")
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    }
}