// METATOPIA (MTP) 官网主要JavaScript文件
// 实现交互功能和动画效果

(function() {
    'use strict';

    // DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        initializeAnimations();
        initializeCounters();
        initializeScrollEffects();
        initializeNavigation();
        initializeParticles();
        initializeTypingEffect();
        initializeSmoothScroll();
    });

    // 初始化动画效果
    function initializeAnimations() {
        // 观察器配置
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        // 创建观察器
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.fade-in-up, .feature-card, .stat-card, .team-member, .roadmap-item');
        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
    }

    // 初始化数字计数器动画
    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    // 数字计数动画
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target') || element.textContent.replace(/[^0-9]/g, ''));
        const duration = 2000; // 2秒
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // 格式化数字显示
            let displayValue = Math.floor(current);
            if (target >= 1000000) {
                displayValue = (displayValue / 1000000).toFixed(1) + 'M';
            } else if (target >= 1000) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            }
            
            element.textContent = displayValue;
        }, 16);
    }

    // 初始化滚动效果
    function initializeScrollEffects() {
        let ticking = false;

        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            // 视差效果
            const parallaxElements = document.querySelectorAll('.parallax');
            parallaxElements.forEach(function(element) {
                element.style.transform = `translateY(${rate}px)`;
            });

            // 导航栏背景透明度
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (scrolled > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    // 初始化导航功能
    function initializeNavigation() {
        // 移动端菜单切换
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                navbarCollapse.classList.toggle('show');
            });

            // 点击菜单项后关闭移动端菜单
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(function(link) {
                link.addEventListener('click', function() {
                    if (window.innerWidth < 992) {
                        navbarCollapse.classList.remove('show');
                    }
                });
            });
        }

        // 活动页面高亮
        highlightActiveNavItem();
    }

    // 高亮当前页面的导航项
    function highlightActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 初始化粒子效果（简化版）
    function initializeParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        // 创建粒子容器
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;
        
        heroSection.style.position = 'relative';
        heroSection.appendChild(particlesContainer);

        // 创建粒子
        for (let i = 0; i < 50; i++) {
            createParticle(particlesContainer);
        }
    }

    // 创建单个粒子
    function createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 215, 0, 0.6);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s infinite linear;
        `;
        
        container.appendChild(particle);
        
        // 粒子动画
        particle.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 0 },
            { transform: 'translateY(-20px) rotate(180deg)', opacity: 1 },
            { transform: 'translateY(-40px) rotate(360deg)', opacity: 0 }
        ], {
            duration: duration * 1000,
            iterations: Infinity
        });
    }

    // 初始化打字机效果
    function initializeTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-effect');
        
        typingElements.forEach(function(element) {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid #ffd700';
            
            let i = 0;
            const timer = setInterval(function() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    // 移除光标
                    setTimeout(function() {
                        element.style.borderRight = 'none';
                    }, 1000);
                }
            }, 100);
        });
    }

    // 初始化平滑滚动
    function initializeSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 工具函数：防抖
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 工具函数：节流
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // 响应式处理
    window.addEventListener('resize', debounce(function() {
        // 重新计算动画和布局
        highlightActiveNavItem();
    }, 250));

    // 页面加载完成后的额外初始化
    window.addEventListener('load', function() {
        // 隐藏加载动画（如果有的话）
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }

        // 添加页面加载完成的类
        document.body.classList.add('loaded');
        
        // 初始化浮动按钮
        initializeFloatingButtons();
        
        // 初始化页面进度和快速导航
        initPageProgress();
        initQuickNavigation();
    });

    // 初始化浮动操作按钮
    function initializeFloatingButtons() {
        // 返回顶部按钮
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            // 监听滚动事件
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            // 点击返回顶部
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // 分享按钮
        const shareBtn = document.getElementById('shareBtn');
        const shareModal = document.getElementById('shareModal');
        if (shareBtn && shareModal) {
            shareBtn.addEventListener('click', function() {
                shareModal.classList.add('show');
            });

            // 点击背景关闭弹窗
            shareModal.addEventListener('click', function(e) {
                if (e.target === shareModal) {
                    shareModal.classList.remove('show');
                }
            });
        }

        // 在线客服按钮
        const chatBtn = document.getElementById('chatBtn');
        if (chatBtn) {
            chatBtn.addEventListener('click', function() {
                // 模拟客服功能
                alert('客服功能即将上线，请通过联系我们页面获取帮助！');
            });
        }

        // 主操作按钮
        const fabMain = document.getElementById('fabMain');
        if (fabMain) {
            let isExpanded = false;
            const fabButtons = document.querySelectorAll('.fab-btn:not(.fab-main)');
            
            fabMain.addEventListener('click', function() {
                isExpanded = !isExpanded;
                
                if (isExpanded) {
                    fabMain.querySelector('i').className = 'fas fa-times';
                    fabButtons.forEach((btn, index) => {
                        setTimeout(() => {
                            btn.style.transform = 'scale(1)';
                            btn.style.opacity = '1';
                        }, index * 100);
                    });
                } else {
                    fabMain.querySelector('i').className = 'fas fa-plus';
                    fabButtons.forEach((btn, index) => {
                        setTimeout(() => {
                            btn.style.transform = 'scale(0)';
                            btn.style.opacity = '0';
                        }, index * 50);
                    });
                }
            });

            // 初始隐藏其他按钮
            fabButtons.forEach(btn => {
                btn.style.transform = 'scale(0)';
                btn.style.opacity = '0';
                btn.style.transition = 'all 0.3s ease';
            });
        }
    }

    // 分享功能
    window.shareToWeChat = function() {
        // 微信分享（实际项目中需要接入微信SDK）
        alert('请使用微信扫一扫分享此页面');
        closeShareModal();
    };

    window.shareToWeibo = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('METATOPIA (MTP) - 元宇宙生态代币');
        const shareUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
        window.open(shareUrl, '_blank');
        closeShareModal();
    };

    window.shareToQQ = function() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('METATOPIA (MTP) - 元宇宙生态代币');
        const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`;
        window.open(shareUrl, '_blank');
        closeShareModal();
    };

    window.copyLink = function() {
        navigator.clipboard.writeText(window.location.href).then(function() {
            alert('链接已复制到剪贴板！');
        }).catch(function() {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('链接已复制到剪贴板！');
        });
        closeShareModal();
    };

    window.closeShareModal = function() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.classList.remove('show');
        }
    }

    // 页面进度指示器
    function initPageProgress() {
        const progressBar = document.getElementById('progressBar');
        
        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
        }
        
        window.addEventListener('scroll', updateProgress);
        updateProgress();
    }

    // 快速导航
    function initQuickNavigation() {
        const quickNav = document.getElementById('quickNav');
        const quickNavItems = document.querySelectorAll('.quick-nav-item');
        
        // 显示/隐藏快速导航
        function toggleQuickNav() {
            const scrollTop = window.pageYOffset;
            if (scrollTop > 300) {
                quickNav.classList.add('show');
            } else {
                quickNav.classList.remove('show');
            }
        }
        
        // 更新活动状态
        function updateActiveNav() {
            const sections = ['hero', 'features', 'stats', 'news'];
            let current = '';
            
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        current = sectionId;
                    }
                }
            });
            
            quickNavItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.target === current) {
                    item.classList.add('active');
                }
            });
        }
        
        // 点击导航项
        quickNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.dataset.target;
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        window.addEventListener('scroll', () => {
            toggleQuickNav();
            updateActiveNav();
        });
        
        // 初始化
        toggleQuickNav();
        updateActiveNav();
    }

    // 表单验证增强
    function enhanceFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(function(form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            });
        });
    }

    // 字段验证
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // 必填验证
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = '此字段为必填项';
        }
        // 邮箱验证
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = '请输入有效的邮箱地址';
            }
        }
        // 电话验证
        else if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = '请输入有效的电话号码';
            }
        }

        // 更新UI
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }

        // 显示错误消息
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback && !isValid) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        if (feedback) {
            feedback.textContent = message;
        }

        return isValid;
    }

    // 初始化表单验证
    enhanceFormValidation();

    // 添加一些CSS动画类
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .navbar.scrolled {
            background-color: rgba(13, 27, 42, 0.95) !important;
            backdrop-filter: blur(10px);
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .particles-container {
            z-index: 1;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
    `;
    document.head.appendChild(style);

})();

// 全局函数：复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showToast('已复制到剪贴板');
        });
    } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('已复制到剪贴板');
    }
}

// 全局函数：显示提示消息
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(function() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(function() {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}