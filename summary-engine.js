import { doc, getDoc, setDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Derived calculation logic (Matches exactly the current index.html updateStatsUI)
export function calculateStreakAndAverages(logs) {
    let summary = {
        totalDays: 0,
        completedDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        habitTotals: {},
        habitObservationCounts: {},
        bestScore: -1,
        bestDate: null,
        lowestScore: 101,
        lowestDate: null,
        latestLogDate: null
    };
    
    let dates = Object.keys(logs).sort();
    if (dates.length === 0) return summary;
    
    summary.totalDays = dates.length;
    summary.latestLogDate = dates[dates.length - 1];
    
    dates.forEach(d => {
        let log = logs[d];
        if (!log) return;
        
        let percentageScore = log.score || 0;
        if (percentageScore > 0) {
            summary.completedDays++;
        }
        
        if (!summary.habitTotals['overall']) summary.habitTotals['overall'] = 0;
        if (!summary.habitObservationCounts['overall']) summary.habitObservationCounts['overall'] = 0;
        
        summary.habitTotals['overall'] += percentageScore;
        summary.habitObservationCounts['overall']++;
        
        if (log.habits) {
            Object.keys(log.habits).forEach(habitId => {
                let habitScore = log.habits[habitId];
                if (!summary.habitTotals[habitId]) summary.habitTotals[habitId] = 0;
                if (!summary.habitObservationCounts[habitId]) summary.habitObservationCounts[habitId] = 0;
                
                summary.habitTotals[habitId] += habitScore;
                summary.habitObservationCounts[habitId]++;
            });
        }
        
        if (percentageScore > summary.bestScore) { summary.bestScore = percentageScore; summary.bestDate = d; }
        if (percentageScore < summary.lowestScore) { summary.lowestScore = percentageScore; summary.lowestDate = d; }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const getPastDateStr = (daysAgo) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString().split('T')[0];
    };
    const yesterdayStr = getPastDateStr(1);
    
    let streak = 0;
    let checkDay = 0;
    
    if (logs[todayStr] && logs[todayStr].score > 0) {
        checkDay = 0;
    } else if (logs[yesterdayStr] && logs[yesterdayStr].score > 0) {
        checkDay = 1;
    } else {
        summary.currentStreak = 0;
        return summary;
    }
    
    while(true) {
        let dStr = getPastDateStr(checkDay);
        if (logs[dStr] && logs[dStr].score > 0) {
            streak++;
            checkDay++;
        } else {
            break;
        }
    }
    
    summary.currentStreak = streak;
    return summary;
}

export async function ensureSummaryBackfill(db, uid, logs) {
    const summaryRef = doc(db, "users", uid, "analytics", "summary");
    try {
        const snap = await getDoc(summaryRef);
        if (!snap.exists()) {
            console.log("No summary found. Running ONE-TIME backfill...");
            const summary = calculateStreakAndAverages(logs);
            summary.lastUpdated = new Date().toISOString();
            await setDoc(summaryRef, summary);
            localStorage.setItem('analyticsSummary', JSON.stringify(summary));
            return summary;
        }
        
        let summaryData = snap.data();
        localStorage.setItem('analyticsSummary', JSON.stringify(summaryData));
        return summaryData;
    } catch(e) {
        console.error("Failed to backfill summary", e);
        let fallback = calculateStreakAndAverages(logs);
        localStorage.setItem('analyticsSummary', JSON.stringify(fallback));
        return fallback; // graceful fallback
    }
}

export async function updateSummaryTransaction(db, uid, dateStr, oldLog, newLog, allLocalLogs) {
    const summaryRef = doc(db, "users", uid, "analytics", "summary");
    try {
        await runTransaction(db, async (transaction) => {
            const summarySnap = await transaction.get(summaryRef);
            if (!summarySnap.exists()) {
                throw "Summary document does not exist!";
            }
            
            let summary = summarySnap.data();
            
            let oldScore = oldLog && typeof oldLog.score !== 'undefined' ? oldLog.score : 0;
            let newScore = newLog && typeof newLog.score !== 'undefined' ? newLog.score : 0;
            
            let isNewDay = !oldLog;
            if (isNewDay) summary.totalDays++;
            
            if (newScore > 0 && oldScore === 0) summary.completedDays++;
            if (newScore === 0 && oldScore > 0) summary.completedDays--;
            
            if (!summary.habitTotals['overall']) summary.habitTotals['overall'] = 0;
            if (!summary.habitObservationCounts['overall']) summary.habitObservationCounts['overall'] = 0;
            
            if (isNewDay) summary.habitObservationCounts['overall']++;
            summary.habitTotals['overall'] += (newScore - oldScore);
            
            let combinedHabits = new Set([...Object.keys(oldLog?.habits || {}), ...Object.keys(newLog?.habits || {})]);
            combinedHabits.forEach(habitId => {
                let oldHScore = oldLog?.habits?.[habitId] || 0;
                let newHScore = newLog?.habits?.[habitId] || 0;
                
                if (!summary.habitTotals[habitId]) summary.habitTotals[habitId] = 0;
                if (!summary.habitObservationCounts[habitId]) summary.habitObservationCounts[habitId] = 0;
                
                summary.habitTotals[habitId] += (newHScore - oldHScore);
                
                if (isNewDay && typeof newLog?.habits?.[habitId] !== 'undefined') {
                    summary.habitObservationCounts[habitId]++;
                } else if (!oldLog?.habits?.[habitId] && typeof newLog?.habits?.[habitId] !== 'undefined') {
                    summary.habitObservationCounts[habitId]++;
                } else if (typeof oldLog?.habits?.[habitId] !== 'undefined' && typeof newLog?.habits?.[habitId] === 'undefined') {
                    summary.habitObservationCounts[habitId]--;
                }
            });
            
            let tempLogs = Object.assign({}, allLocalLogs);
            tempLogs[dateStr] = newLog;
            let recalculated = calculateStreakAndAverages(tempLogs);
            
            summary.currentStreak = recalculated.currentStreak;
            summary.latestLogDate = recalculated.latestLogDate;
            summary.lastUpdated = new Date().toISOString();
            
            transaction.update(summaryRef, summary);
            localStorage.setItem('analyticsSummary', JSON.stringify(summary));
        });
        console.log("Summary updated transactionally!");
    } catch(e) {
        console.error("Transaction failed:", e);
    }
}
