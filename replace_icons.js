const fs = require('fs');
let html = fs.readFileSync('profile.html', 'utf8');

// The blocks to replace
const block1 = `<div class="gold-crown-icon" title="Premium Feature" style="width: 24px; height: 24px; border-width: 1px;">
                                <svg viewBox="0 0 24 24" fill="#F59E0B" style="width: 12px; height: 12px;">
                                    <path d="M2.5 19h19v2h-19v-2zm18.06-2H3.44l-1.45-8.7 5.46 3.27L12 3l4.55 8.57 5.46-3.27-1.45 8.7z"/>
                                </svg>
                            </div>`;

const block2 = `<div class="gold-crown-icon" title="Premium Feature">
                            <svg viewBox="0 0 24 24" fill="#F59E0B" style="width: 16px; height: 16px;">
                                <path d="M2.5 19h19v2h-19v-2zm18.06-2H3.44l-1.45-8.7 5.46 3.27L12 3l4.55 8.57 5.46-3.27-1.45 8.7z"/>
                            </svg>
                        </div>`;

const block3 = `<div class="gold-crown-icon mx-auto mb-4" style="margin: 0 auto 1rem auto; width: 64px; height: 64px; border-width: 3px;">
                <svg viewBox="0 0 24 24" fill="#F59E0B" style="width: 32px; height: 32px;"><path d="M2.5 19h19v2h-19v-2zm18.06-2H3.44l-1.45-8.7 5.46 3.27L12 3l4.55 8.57 5.46-3.27-1.45 8.7z"/></svg>
            </div>`;

html = html.replace(block1, `<span class="badge badge-premium">PRO</span>`);
html = html.replace(block2, `<span class="badge badge-premium">PRO</span>`);
html = html.replace(block3, `<span class="badge badge-premium" style="font-size: 1.5rem; padding: 0.5rem 1rem;">PRO</span>`);

fs.writeFileSync('profile.html', html);
console.log('Replaced');
