const fs = require('fs');

let newHtml = fs.readFileSync('new_ui.html', 'utf8');
let oldHtml = fs.readFileSync('profile.html', 'utf8');

// Copy delete modal CSS
const modalCssStart = oldHtml.indexOf('/* Delete Account Popup */');
const modalCssEnd = oldHtml.indexOf('</style>', modalCssStart);
let deleteCss = '';
if(modalCssStart !== -1 && modalCssEnd !== -1) {
    deleteCss = oldHtml.substring(modalCssStart, modalCssEnd);
}

// Copy delete modal HTML
const modalHtmlStart = oldHtml.indexOf('<div id="delete-account-modal"');
const modalHtmlEnd = oldHtml.indexOf('<!-- Custom Habit Modal -->');
let deleteHtml = '';
if(modalHtmlStart !== -1 && modalHtmlEnd !== -1) {
    deleteHtml = oldHtml.substring(modalHtmlStart, modalHtmlEnd);
}

// Copy Firebase JS
const fbScriptStart = oldHtml.indexOf('<script type="module">');
const fbScriptEnd = oldHtml.indexOf('</body>');
let fbScript = '';
if(fbScriptStart !== -1 && fbScriptEnd !== -1) {
    fbScript = oldHtml.substring(fbScriptStart, fbScriptEnd);
}

// We need to modify fbScript saveProfile logic to match the new UI's fields
let newSaveProfile = `
        window.saveProfile = async function(event) {
            event.preventDefault(); // Prevent form submission reload
            
            // Get values from inputs
            const name = document.getElementById('input-name').value;
            const dob = document.getElementById('input-dob').value;
            const email = document.getElementById('input-email').value;
            const phone = document.getElementById('input-phone').value;
            const country = document.getElementById('input-country').value;
            const gender = document.getElementById('input-gender').value;
            const occ = document.getElementById('input-occ').value;
            const bio = document.getElementById('input-bio').value;
            
            // Format Date safely
            let formattedDate = dob;
            if(dob) {
                const dateObj = new Date(dob);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                formattedDate = dateObj.toLocaleDateString('en-US', options);
                if (formattedDate === "Invalid Date") formattedDate = dob;
            }

            // Update UI elements
            document.getElementById('val-name').innerHTML = name;
            document.getElementById('val-dob').innerHTML = formattedDate;
            document.getElementById('val-email').innerHTML = email;
            
            // Avatar
            const avatarEl = document.getElementById('display-avatar');
            avatarEl.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=240&background=2563EB&color=fff&rounded=true';
            
            if(window.currentUser) {
                try {
                    const { setDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
                    await setDoc(doc(window.firebaseDb, "users", window.currentUser.uid), {
                        name: name,
                        dob: dob,
                        phone: phone,
                        country: country,
                        gender: gender,
                        occupation: occ,
                        bio: bio
                    }, { merge: true });
                    
                    // Update cache
                    const cached = JSON.parse(localStorage.getItem('cachedProfile') || '{}');
                    cached.name = name;
                    localStorage.setItem('cachedProfile', JSON.stringify(cached));
                } catch(e) {
                    console.error('Error saving profile:', e);
                }
            }

            // Close edit mode
            toggleEditMode();
            
            // Subtle flash effect to show success
            const profileCard = document.getElementById('profile-view');
            profileCard.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.3)';
            setTimeout(() => {
                profileCard.style.boxShadow = '';
            }, 1000);
        };
`;

fbScript = fbScript.replace(/window\.saveProfile = async function[\s\S]*?};[\s\n]*\/\//, newSaveProfile + '\n        //');

let patchedHtml = newHtml
    .replace('id="theme-toggle"', 'id="themeToggle" onclick="toggleTheme()"')
    .replace('id="icon-moon"', 'id="moonIcon"')
    .replace('id="icon-sun"', 'id="sunIcon"');

if(deleteCss) {
    patchedHtml = patchedHtml.replace('</style>', deleteCss + '\n    </style>');
}

if(deleteHtml) {
    patchedHtml = patchedHtml.replace('</main>', '</main>\n' + deleteHtml);
}

if(fbScript) {
    patchedHtml = patchedHtml + '\n' + fbScript + '</body>\n</html>';
}

patchedHtml = patchedHtml.replace(/document.getElementById\('val-joined'\)/g, "document.getElementById('val-dob')");
patchedHtml = patchedHtml.replace(
    /if\(data\.dob\) \{[\s\S]*?\}/, 
    `if(data.dob) {
        document.getElementById('input-dob').value = data.dob;
        let fd = data.dob;
        const dObj = new Date(data.dob);
        if(!isNaN(dObj)) fd = dObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('val-dob').textContent = fd;
    }`
);

fs.writeFileSync('profile.html', patchedHtml);
console.log('Merge complete!');
