const fs = require('fs');

const CSS_PREFIX = `/* ==========================================================================
           DESIGN SYSTEM & VARIABLES
           ========================================================================== */`;
const CSS_END_MARKER = `/* ==========================================================================
           HABIT CARDS & LIST
           ========================================================================== */`;

// Generate style.css
const indexHtml = fs.readFileSync('index.html', 'utf8');
const indexStyleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
let coreCss = '';
if (indexStyleMatch) {
    const css = indexStyleMatch[1];
    const startIndex = css.indexOf(CSS_PREFIX);
    const endIndex = css.indexOf(CSS_END_MARKER);
    if (startIndex !== -1 && endIndex !== -1) {
        coreCss = css.substring(startIndex, endIndex);
        fs.writeFileSync('style.css', coreCss);
        console.log('Created style.css');
    } else {
        // Fallback: take first 400 lines
        coreCss = css.split('\n').slice(0, 400).join('\n');
        fs.writeFileSync('style.css', coreCss);
        console.log('Created style.css (fallback)');
    }
}

// Generate app.js
const appJsContent = `
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

// Setup listeners after DOM loads
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
fs.writeFileSync('app.js', appJsContent.trim());
console.log('Created app.js');

// Now process all HTML files
const files = ['index.html', 'analytics.html', 'setup-habits.html', 'profile.html', 'login.html', 'signup.html', 'subscription.html', 'new_ui.html'];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let html = fs.readFileSync(f, 'utf8');
    
    // 1. Remove duplicate Firebase SDK imports
    html = html.replace(/import\s*\{[^}]*\}\s*from\s*['"]https:\/\/www\.gstatic\.com\/firebasejs\/[^'"]+['"];/g, '');
    
    // 2. Add style.css link and app.js script
    if (!html.includes('href="style.css"')) {
        html = html.replace('</head>', '    <link rel="stylesheet" href="style.css">\n    <script src="app.js" defer></script>\n</head>');
    }
    
    // 3. Remove inline theme toggles and mobile menu toggles to prevent duplication
    html = html.replace(/window\.toggleMobileMenu\s*=\s*function\(\)\s*\{[\s\S]*?\};/g, '');
    html = html.replace(/window\.toggleTheme\s*=\s*function\(\)\s*\{[\s\S]*?\}/g, '');
    html = html.replace(/const savedTheme = localStorage\.getItem\('theme'\) \|\| 'dark';\s*if\(savedTheme === 'light'\)\s*\{\s*document\.body\.classList\.add\('light-mode'\);\s*document\.documentElement\.setAttribute\('data-theme',\s*'light'\);\s*\}/g, '');
    html = html.replace(/document\.querySelectorAll\('#themeToggle, #mobileThemeToggle'\)\.forEach\(btn => \{\s*btn\.addEventListener\('click', window\.toggleTheme\);\s*\}\);/g, '');
    html = html.replace(/window\.openAuthModal\s*=\s*\(\)\s*=>\s*document\.getElementById\('auth-modal'\)\.style\.display\s*=\s*'flex';/g, '');
    html = html.replace(/window\.closeAuthModal\s*=\s*\(\)\s*=>\s*document\.getElementById\('auth-modal'\)\.style\.display\s*=\s*'none';/g, '');

    // 4. Try to remove the core CSS from the inline <style> block
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        let css = styleMatch[1];
        // For index.html, we know exact markers
        if (f === 'index.html') {
            const start = css.indexOf(CSS_PREFIX);
            const end = css.indexOf(CSS_END_MARKER);
            if (start !== -1 && end !== -1) {
                const toRemove = css.substring(start, end);
                html = html.replace(toRemove, '');
            }
        } else {
            // For other files, it might be tricky to remove exact string because of slight modifications.
            // Let's just leave the <style> block as is for non-index files. The link to style.css will override/duplicate, which is functionally fine.
            // The user explicitly stated "keeping page-specific CSS (.habit-card, .chart-container, etc.) untouched in each file".
            // Since parsing out only duplicated CSS is difficult, leaving the file's inline CSS is safest to prevent breakage. 
            // Wait, we DO want to delete the duplicate. Let's do a basic string replacement if it exactly matches coreCss.
            if (css.includes(coreCss)) {
                html = html.replace(coreCss, '');
            } else {
                // If it doesn't perfectly match (e.g. analytics.html), we leave it. Or we can replace the first ~250 lines aggressively.
                // Let's replace the first 300 lines of analytics.html style block since we know it's boilerplate.
                if (f === 'analytics.html') {
                    // Find the line where chart specific css starts (e.g., .chart-container)
                    const chartIndex = css.indexOf('.chart-container');
                    if(chartIndex !== -1) {
                        const boilerplate = css.substring(0, chartIndex);
                        html = html.replace(boilerplate, '');
                    }
                }
                if (f === 'setup-habits.html') {
                    const stepIndex = css.indexOf('.step-container');
                    if(stepIndex !== -1) {
                        const boilerplate = css.substring(0, stepIndex);
                        html = html.replace(boilerplate, '');
                    }
                }
            }
        }
    }
    
    fs.writeFileSync(f, html);
    console.log(`Processed ${f}`);
});
