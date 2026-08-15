window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenuDropdown');
    if(menu) {
        if (menu.style.display === 'none' || menu.style.display === '') {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    }
};

window.toggleTheme = function() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
};

const savedTheme = localStorage.getItem('theme') || 'dark';
if(savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.documentElement.setAttribute('data-theme', 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#themeToggle, #mobileThemeToggle').forEach(btn => {
        btn.addEventListener('click', window.toggleTheme);
    });
});

window.openAuthModal = () => {
    const m = document.getElementById('auth-modal');
    if(m) m.style.display = 'flex';
};
window.closeAuthModal = () => {
    const m = document.getElementById('auth-modal');
    if(m) m.style.display = 'none';
};
