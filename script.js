 (function() {
            'use strict';

            // Configuration
            const CONFIG = {
                whatsappNumber: '628388451214',
                preloadDuration: 1500,
                particleCount: 50
            };

            // ===== SECURITY LAYER =====
            const SecurityManager = {
                init() {
                    // Advanced Console Protection
                    const disableConsole = () => {
                        const methods = ['log', 'debug', 'info', 'warn', 'error', 'trace', 'table'];
                        methods.forEach(method => {
                            window.console[method] = () => {};
                        });
                    };

                    // Detect DevTools
                    let devtools = {open: false, orientation: null};
                    const threshold = 160;
                    setInterval(() => {
                        if (window.outerHeight - window.innerHeight > threshold || 
                            window.outerWidth - window.innerWidth > threshold) {
                            if (!devtools.open) {
                                devtools.open = true;
                                document.body.style.display = 'none';
                                alert('Developer tools detected. Access denied.');
                            }
                        } else {
                            devtools.open = false;
                            document.body.style.display = '';
                        }
                    }, 500);

                    // Disable right-click contextually
                    document.addEventListener('contextmenu', (e) => {
                        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                            return false;
                        }
                    });

                    // Protect against text selection on sensitive elements
                    document.addEventListener('selectstart', (e) => {
                        if (e.target.classList.contains('protected')) {
                            e.preventDefault();
                            return false;
                        }
                    });

                    // Anti-iframe protection
                    if (window.top !== window.self) {
                        window.top.location.replace(window.self.location);
                    }

                    disableConsole();
                }
            };

            // ===== PARTICLE SYSTEM =====
            const ParticleSystem = {
                init() {
                    const container = document.getElementById('particles');
                    if (!container) return;

                    for (let i = 0; i < CONFIG.particleCount; i++) {
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.left = Math.random() * 100 + '%';
                        particle.style.animationDelay = Math.random() * 15 + 's';
                        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                        container.appendChild(particle);
                    }
                }
            };

            // ===== PRELOADER MANAGER =====
            const PreloaderManager = {
                init() {
                    const preloader = document.getElementById('preloader');
                    const preloaderBar = document.getElementById('preloaderBar');
                    
                    let progress = 0;
                    const increment = 100 / (CONFIG.preloadDuration / 20);
                    
                    const interval = setInterval(() => {
                        progress += increment;
                        if (progress >= 100) {
                            progress = 100;
                            clearInterval(interval);
                            this.hide();
                        }
                        preloaderBar.style.width = progress + '%';
                    }, 20);
                },

                hide() {
                    const preloader = document.getElementById('preloader');
                    preloader.classList.add('hide');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 600);
                }
            };

            // ===== SCROLL REVEAL ANIMATIONS =====
            const ScrollReveal = {
                init() {
                    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
                    
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('active');
                            }
                        });
                    }, {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                    });

                    reveals.forEach(element => observer.observe(element));
                }
            };

            // ===== ORDER MANAGEMENT =====
            window.orderPlan = function(plan) {
                const modal = document.getElementById('orderModal');
                const planName = document.getElementById('planName');
                const confirmBtn = document.getElementById('confirmOrder');
                
                planName.textContent = plan;
                modal.classList.add('show');

                confirmBtn.onclick = () => {
                    const message = `Halo, saya tertarik untuk order RZASENSIX ${plan} Plan. Mohon informasi lebih lanjut.`;
                    const waLink = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
                    
                    // Track conversion (optional analytics)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'conversion', {
                            'send_to': 'order',
                            'value': plan
                        });
                    }
                    
                    window.open(waLink, '_blank');
                    closeModal();
                };
            };

            window.closeModal = function() {
                const modal = document.getElementById('orderModal');
                modal.classList.remove('show');
            };

            // ===== SMOOTH SCROLL =====
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // ===== INITIALIZATION =====
            document.addEventListener('DOMContentLoaded', () => {
                SecurityManager.init();
                PreloaderManager.init();
                ParticleSystem.init();
                
                // Delay scroll animations slightly
                setTimeout(() => {
                    ScrollReveal.init();
                }, 500);
            });

            // ===== PERFORMANCE OPTIMIZATION =====
            // Lazy load images if any
            if ('loading' in HTMLImageElement.prototype) {
                const images = document.querySelectorAll('img[loading="lazy"]');
                images.forEach(img => {
                    img.src = img.dataset.src;
                });
            }

            // ===== ERROR HANDLING =====
            window.addEventListener('error', (e) => {
                console.error('Error caught:', e);
                // Could send to error tracking service
            });

            // ===== PAGE VISIBILITY =====
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Pause animations to save resources
                    document.querySelectorAll('.particle').forEach(p => {
                        p.style.animationPlayState = 'paused';
                    });
                } else {
                    // Resume animations
                    document.querySelectorAll('.particle').forEach(p => {
                        p.style.animationPlayState = 'running';
                    });
                }
            });

        })();