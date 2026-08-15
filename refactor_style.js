const fs = require('fs');
const files = ['index.html', 'analytics.html', 'setup-habits.html', 'profile.html', 'login.html', 'signup.html', 'subscription.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // First, let's make sure we have all unique styles in style.css. 
    // Actually, I will just append all <style> blocks to style.css to ensure nothing is lost.
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    if (styleMatch) {
        fs.appendFileSync('style.css', `\n/* From ${f} */\n` + styleMatch[1]);
        let newContent = content.replace(/<style>([\s\S]*?)<\/style>/, '<link rel="stylesheet" href="style.css">');
        fs.writeFileSync(f, newContent);
        console.log(`Updated ${f}`);
    }
  }
});
