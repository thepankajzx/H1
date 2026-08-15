const fs = require('fs');

// Create app.js
const appJs = `window.toggleMobileMenu = function() {
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
`;

fs.writeFileSync('app.js', appJs);
console.log('Created app.js');

// Create style.css from index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const match = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
if(match) {
    const css = match[1];
    let endOfCore = css.indexOf('/* ==========================================================================\r\n           KPI STATS CARDS');
    if (endOfCore === -1) endOfCore = css.indexOf('/* ==========================================================================\n           KPI STATS CARDS');
    
    if (endOfCore !== -1) {
        const coreCss = css.substring(0, endOfCore).trim();
        fs.writeFileSync('style.css', coreCss);
        console.log('Created style.css (length ' + coreCss.length + ')');
        
        // Remove this exact string from index.html
        let newIndex = indexHtml.replace(coreCss, '');
        // We also need to add <link> and <script> to index.html
        if (!newIndex.includes('href="style.css"')) {
            newIndex = newIndex.replace('</head>', '    <link rel="stylesheet" href="style.css">\n    <script src="app.js" defer></script>\n</head>');
        }
        // Remove duplicate Firebase logic in index.html
        newIndex = newIndex.replace(/import\s*\{[^}]*\}\s*from\s*['"]https:\/\/www\.gstatic\.com\/firebasejs\/[^'"]+['"];\n?/g, '');
        // Remove inline window functions in index.html
        newIndex = newIndex.replace(/window\.toggleMobileMenu\s*=\s*function\(\)\s*\{[\s\S]*?\};\n?/g, '');
        newIndex = newIndex.replace(/\/\/ Theme Toggle Fix\s*window\.toggleTheme\s*=\s*function\(\)\s*\{[\s\S]*?\}\n?/g, '');
        newIndex = newIndex.replace(/const savedTheme = localStorage\.getItem\('theme'\) \|\| 'dark';\s*if\(savedTheme === 'light'\)\s*\{\s*document\.body\.classList\.add\('light-mode'\);\s*document\.documentElement\.setAttribute\('data-theme',\s*'light'\);\s*\}\n?/g, '');
        newIndex = newIndex.replace(/\/\/ Add event listeners to the original theme buttons just in case\s*document\.querySelectorAll\('#themeToggle, #mobileThemeToggle'\)\.forEach\(btn => \{\s*btn\.addEventListener\('click', window\.toggleTheme\);\s*\}\);\n?/g, '');
        newIndex = newIndex.replace(/window\.openAuthModal\s*=\s*\(\)\s*=>\s*document\.getElementById\('auth-modal'\)\.style\.display\s*=\s*'flex';\n?/g, '');
        newIndex = newIndex.replace(/window\.closeAuthModal\s*=\s*\(\)\s*=>\s*document\.getElementById\('auth-modal'\)\.style\.display\s*=\s*'none';\n?/g, '');
        
        fs.writeFileSync('index.html', newIndex);
        
        // Now do the same for the other files
        const files = ['analytics.html', 'setup-habits.html', 'profile.html', 'login.html', 'signup.html', 'subscription.html'];
        files.forEach(f => {
            if (!fs.existsSync(f)) return;
            let html = fs.readFileSync(f, 'utf8');
            
            // Remove the exact coreCss string
            html = html.replace(coreCss, '');
            
            // Insert link and script
            if (!html.includes('href="style.css"')) {
                html = html.replace('</head>', '    <link rel="stylesheet" href="style.css">\n    <script src="app.js" defer></script>\n</head>');
            }
            
            // Remove duplicate Firebase SDKs
            html = html.replace(/import\s*\{[^}]*\}\s*from\s*['"]https:\/\/www\.gstatic\.com\/firebasejs\/[^'"]+['"];\n?/g, '');
            
            // Remove the specific logic chunks if present
            html = html.replace(/window\.toggleMobileMenu\s*=\s*function\(\)\s*\{[\s\S]*?\};\n?/g, '');
            html = html.replace(/\/\/ Theme Toggle Fix\s*window\.toggleTheme\s*=\s*function\(\)\s*\{[\s\S]*?\}\n?/g, '');
            html = html.replace(/window\.toggleTheme\s*=\s*function\(\)\s*\{[\s\S]*?\}\n?/g, '');
            html = html.replace(/const savedTheme = localStorage\.getItem\('theme'\) \|\| 'dark';\s*if\(savedTheme === 'light'\)\s*\{\s*document\.body\.classList\.add\('light-mode'\);\s*document\.documentElement\.setAttribute\('data-theme',\s*'light'\);\s*\}\n?/g, '');
            
            fs.writeFileSync(f, html);
            console.log('Processed', f);
        });
    }
}
