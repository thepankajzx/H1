const fs = require('fs');

let oldHTML = fs.readFileSync('old_profile.html', 'utf16le');
let newHTML = fs.readFileSync('profile.html', 'utf8');

// Find sections in oldHTML
let startIdx = oldHTML.indexOf('<!-- ==============================\r\n             MY HABITS');
if(startIdx === -1) startIdx = oldHTML.indexOf('<!-- ==============================\n             MY HABITS');

let endIdx = oldHTML.indexOf('<!-- ==============================\r\n             ACCOUNT SETTINGS');
if(endIdx === -1) endIdx = oldHTML.indexOf('<!-- ==============================\n             ACCOUNT SETTINGS');

if(startIdx !== -1 && endIdx !== -1) {
    let missingContent = oldHTML.substring(startIdx, endIdx);
    
    // Convert any strange unicode characters back to utf8 properly just in case
    missingContent = Buffer.from(missingContent, 'utf8').toString('utf8');
    
    // Find where to insert in newHTML
    let insertMatch = newHTML.match(/<\/div>\s*<!-- ==============================\r?\n\s*ACCOUNT SETTINGS/);
    if(insertMatch) {
        let insertIdx = insertMatch.index + 6; // after </div>
        
        let finalHTML = newHTML.substring(0, insertIdx) + '\n\n' + missingContent + '\n\n' + newHTML.substring(insertIdx);
        fs.writeFileSync('profile.html', finalHTML, 'utf8');
        console.log('SUCCESS! Injected ' + missingContent.length + ' characters.');
    } else {
        console.log('Could not find insert point in newHTML');
    }
} else {
    console.log('Could not find start/end in oldHTML: ' + startIdx + ' ' + endIdx);
}
