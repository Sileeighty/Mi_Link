// Копирование email
function copyEmail() {
    navigator.clipboard.writeText('nasxnik@gmail.com').then(() => {
        document.getElementById('copyNotification').classList.add('show');
        setTimeout(() => document.getElementById('copyNotification').classList.remove('show'), 2500);
    }).catch(() => {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = 'nasxnik@gmail.com';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        document.getElementById('copyNotification').classList.add('show');
        setTimeout(() => document.getElementById('copyNotification').classList.remove('show'), 2500);
    });
}

// Настройки
function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('active');
    document.body.style.overflow = document.getElementById('settingsPanel').classList.contains('active') ? 'hidden' : '';
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
    } else {
        body.classList.remove('dark-theme');
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
        localStorage.setItem('theme', 'light');
    }
    
    updateSettingsButton();
}

function updateSettingsButton() {
    const settingsBtn = document.getElementById('settingsBtn');
    const isDark = document.body.classList.contains('dark-theme');
    
    if (isDark) {
        settingsBtn.style.background = 'rgba(30, 30, 30, 0.6)';
        settingsBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    } else {
        settingsBtn.style.background = 'rgba(255, 255, 255, 0.25)';
        settingsBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
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
            document.getElementById('bgPreview').style.backgroundImage = `url(${event.target.result})`;
            document.getElementById('bgPreview').style.backgroundSize = 'cover';
            document.getElementById('bgPreview').style.backgroundPosition = 'center';
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
        
        // Сброс кнопок темы
        document.getElementById('darkThemeBtn').classList.add('active');
        document.getElementById('lightThemeBtn').classList.remove('active');
        
        // Обновление кнопки настроек
        updateSettingsButton();
        
        location.reload();
    }
}

// Загрузка настроек при старте
window.onload = () => {
    const savedTheme = localStorage.getItem('theme');
    const savedBg = localStorage.getItem('background');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        updateSettingsButton();
    }
    
    if (savedBg) {
        document.body.style.backgroundImage = `url(${savedBg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.getElementById('bgPreview').style.backgroundImage = `url(${savedBg})`;
        document.getElementById('bgPreview').style.backgroundSize = 'cover';
        document.getElementById('bgPreview').style.backgroundPosition = 'center';
    }
    
    // Закрытие панели при клике вне её
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
};