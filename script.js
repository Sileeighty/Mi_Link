// Определение мобильного устройства
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Копирование email
function copyEmail() {
    const email = 'nasxnik@gmail.com';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showCopyNotification();
        }).catch(() => {
            fallbackCopyEmail(email);
        });
    } else {
        fallbackCopyEmail(email);
    }
}

function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showCopyNotification();
    } catch (err) {
        console.error('Не удалось скопировать email');
    }
    document.body.removeChild(textArea);
}

function showCopyNotification() {
    const notification = document.getElementById('copyNotification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

// Настройки
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('active');
    document.body.style.overflow = panel.classList.contains('active') ? 'hidden' : '';
}

function setTheme(theme) {
    const body = document.body;
    const darkBtn = document.getElementById('darkThemeBtn');
    const lightBtn = document.getElementById('lightThemeBtn');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
        localStorage.setItem('theme', 'dark');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0a0a0a');
    } else {
        body.classList.remove('dark-theme');
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
        localStorage.setItem('theme', 'light');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#87CEEB');
    }
}

function changeBackground(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой. Максимальный размер: 5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            document.body.style.backgroundImage = `url(${event.target.result})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            
            const bgPreview = document.getElementById('bgPreview');
            bgPreview.style.backgroundImage = `url(${event.target.result})`;
            bgPreview.style.backgroundSize = 'cover';
            bgPreview.style.backgroundPosition = 'center';
            
            localStorage.setItem('background', event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function resetSettings() {
    if (confirm('Сбросить все настройки?')) {
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.classList.remove('dark-theme');
        localStorage.clear();
        
        document.getElementById('darkThemeBtn').classList.add('active');
        document.getElementById('lightThemeBtn').classList.remove('active');
        document.getElementById('bgPreview').style.backgroundImage = '';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#87CEEB');
        
        location.reload();
    }
}

// Закрытие панели при клике вне
document.addEventListener('click', (e) => {
    const panel = document.getElementById('settingsPanel');
    const btn = document.querySelector('.settings-btn');
    if (panel.classList.contains('active') && 
        !panel.contains(e.target) && 
        !btn.contains(e.target)) {
        toggleSettings();
    }
});

// Закрытие на Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const panel = document.getElementById('settingsPanel');
        if (panel.classList.contains('active')) {
            toggleSettings();
        }
    }
});

// Загрузка настроек
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    const savedBg = localStorage.getItem('background');
    
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    if (savedBg) {
        document.body.style.backgroundImage = `url(${savedBg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        const bgPreview = document.getElementById('bgPreview');
        bgPreview.style.backgroundImage = `url(${savedBg})`;
        bgPreview.style.backgroundSize = 'cover';
        bgPreview.style.backgroundPosition = 'center';
    }
    
    // Предотвращение зума на iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
};

// Поддержка клавиатуры для карточек
document.querySelectorAll('.link-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});