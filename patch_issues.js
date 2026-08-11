const fs = require('fs');
const path = require('path');

const indexFile = 'index.html';
const analyticsFile = 'analytics.html';

let indexHtml = fs.readFileSync(indexFile, 'utf8');
let analyticsHtml = fs.readFileSync(analyticsFile, 'utf8');

// ==========================================
// 1. Update index.html to save inputs
// ==========================================
let oldDailyLog = `let dailyLog = { score: 0, habits: {} };`;
let newDailyLog = `let dailyLog = { score: 0, habits: {}, inputs: {} };`;
indexHtml = indexHtml.replace(oldDailyLog, newDailyLog);

// yes-no
let oldYesNo = `if (val === 'yes') habitScore = 100;
                        else if (val === 'no') habitScore = 0;`;
let newYesNo = `dailyLog.inputs[id] = val;
                        if (val === 'yes') habitScore = 100;
                        else if (val === 'no') habitScore = 0;`;
indexHtml = indexHtml.replace(oldYesNo, newYesNo);

// duration
let oldDuration = `if (hrs > 0 || mins > 0) {
                        hasInput = true;
                        
                        let totalMins = (hrs * 60) + mins;`;
let newDuration = `if (hrs > 0 || mins > 0) {
                        hasInput = true;
                        dailyLog.inputs[id] = (hrs > 0 ? hrs + 'h ' : '') + (mins > 0 ? mins + 'm' : '').trim();
                        
                        let totalMins = (hrs * 60) + mins;`;
indexHtml = indexHtml.replace(oldDuration, newDuration);

// time
let oldTime = `if (val) {
                        hasInput = true;`;
let newTime = `if (val) {
                        hasInput = true;
                        dailyLog.inputs[id] = val;`;
indexHtml = indexHtml.replace(oldTime, newTime);

// count
let oldCount = `if (val !== '') {
                        hasInput = true;
                        let countVal = parseFloat(val);`;
let newCount = `if (val !== '') {
                        hasInput = true;
                        dailyLog.inputs[id] = val + ' ' + (habit.unit || '');
                        let countVal = parseFloat(val);`;
indexHtml = indexHtml.replace(oldCount, newCount);

// ==========================================
// 2. Update analytics.html Heatmap Logic
// ==========================================
// Remove startDate override in renderHeatmap
let hmOverrideRegex = /\/\/ Dynamic Start Date constraint[\s\S]*?startDate = new Date\(accDate\);\n\s*\}\n\s*\}/;
analyticsHtml = analyticsHtml.replace(hmOverrideRegex, '// Dynamic Start Date constraint removed to show full grid');

// Remove the Star
let starRegex = /if \(dateStr === earliestDateStr\) \{[\s\S]*?cell\.appendChild\(star\);\n\s*\}/;
analyticsHtml = analyticsHtml.replace(starRegex, '');

// ==========================================
// 3. Update analytics.html Modal Content
// ==========================================
let oldModalCardHtml = `let isSuccess = h.score >= 50; // Simple threshold
                let iconHtml = isSuccess ? 
                    \`<div class="mh-icon success" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>\` : 
                    \`<div class="mh-icon fail" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>\`;
                
                cardsHtml \+= \`
                    <div class="modal-habit-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
                        <div class="mh-top" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span class="mh-title" style="font-size: 15px; font-weight: 600; color: var(--text-primary);">\${hData.name}</span>
                            \${iconHtml}
                        </div>
                        <div class="mh-row" style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                            <span>Target: <span class="val" style="color: var(--text-primary); font-weight: 600;">\${targetDisplay}</span></span>
                        </div>
                        <div class="mh-row" style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary);">
                            <span>Score: <span class="val" style="color: var(--text-primary); font-weight: 600;">\${h.score}%</span></span>
                        </div>
                    </div>
                \`;`;

let newModalCardHtml = `
                let actDisplay = (log.inputs && typeof log.inputs[h.id] !== 'undefined') ? log.inputs[h.id] : 'No Input';
                if(hData.habit_type === 'yes-no') {
                     actDisplay = (log.inputs && typeof log.inputs[h.id] !== 'undefined') ? (log.inputs[h.id] === 'yes' ? 'Yes' : 'No') : 'No Input';
                }
                
                let isSuccess = h.score >= 50; // Simple threshold
                let iconHtml = isSuccess ? 
                    \`<div class="mh-icon success" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></div>\` : 
                    \`<div class="mh-icon fail" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div>\`;
                
                cardsHtml += \`
                    <div class="modal-habit-card" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px;">
                        <div class="mh-top" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span class="mh-title" style="font-size: 15px; font-weight: 600; color: var(--text-primary);">\${hData.name}</span>
                            \${iconHtml}
                        </div>
                        <div class="mh-row" style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                            <span>Target: <span class="val" style="color: var(--text-primary); font-weight: 600;">\${targetDisplay}</span></span>
                            <span>Act: <span class="val" style="color: var(--text-primary); font-weight: 600;">\${actDisplay}</span></span>
                        </div>
                        <div class="mh-row" style="display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary);">
                            <span>Score: <span class="val" style="color: var(--text-primary); font-weight: 600;">\${h.score}%</span></span>
                        </div>
                    </div>
                \`;`;
analyticsHtml = analyticsHtml.replace(oldModalCardHtml, newModalCardHtml);


// ==========================================
// 4. Update analytics.html Charts Logic
// ==========================================
// Add the select to charts-toggles
let oldToggles = `<div id="charts-toggles" style="display:none; align-items:center; gap:16px;">
                    <div class="display-mode-toggle" style="background: var(--card-secondary); padding: 4px; border-radius: 8px;">`;
let newToggles = `<div id="charts-toggles" style="display:none; align-items:center; gap:16px;">
                    <select class="premium-select" style="height:44px; min-width:auto; padding-right:32px;" id="globalChartTypeSelect" onchange="window.updateAnalytics()">
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                    </select>
                    <div class="display-mode-toggle" style="background: var(--card-secondary); padding: 4px; border-radius: 8px;">`;
analyticsHtml = analyticsHtml.replace(oldToggles, newToggles);

// Remove the old select from Combined HTML
let oldSelectCombined = `<select class="premium-select" style="height:36px; min-width:auto; padding-right:32px;" id="chartTypeSelect" onchange="window.updateAnalytics()">
                                <option value="line" \${chartType === 'line' ? 'selected' : ''}>Line Chart</option>
                                <option value="bar" \${chartType === 'bar' ? 'selected' : ''}>Bar Chart</option>
                            </select>`;
analyticsHtml = analyticsHtml.replace(oldSelectCombined, '');

// Update chartType reading
let oldChartTypeRead = `let chartType = document.getElementById('chartTypeSelect') ? document.getElementById('chartTypeSelect').value : 'line';`;
let newChartTypeRead = `let chartType = document.getElementById('globalChartTypeSelect') ? document.getElementById('globalChartTypeSelect').value : 'line';`;
analyticsHtml = analyticsHtml.replace(oldChartTypeRead, newChartTypeRead);

// Update seriesObj to include barWidth
let oldSeriesObj = `let seriesObj = {
                name: name,
                type: chartType,
                smooth: true,
                data: scores,
                itemStyle: { color: color },
                lineStyle: { width: 3 }
            };`;
let newSeriesObj = `let seriesObj = {
                name: name,
                type: chartType,
                smooth: true,
                data: scores,
                itemStyle: { color: color },
                lineStyle: { width: 3 },
                barMaxWidth: 16,
                barMinWidth: 4
            };`;
analyticsHtml = analyticsHtml.replace(oldSeriesObj, newSeriesObj);

// Fix Separate Mode forcing 'line'
let oldSeparateLine = `chart.setOption(createChartOption([series], 'line')); // Separate mode forces line for better look`;
let newSeparateLine = `chart.setOption(createChartOption([series], chartType));`;
analyticsHtml = analyticsHtml.replace(oldSeparateLine, newSeparateLine);


fs.writeFileSync(indexFile, indexHtml);
fs.writeFileSync(analyticsFile, analyticsHtml);
console.log('Patch completed successfully');
