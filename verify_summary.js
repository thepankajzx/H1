export async function verifySummaryMetrics(db, uid, localLogs) {
    console.log("=== STARTING DUAL-RUN VERIFICATION ===");
    
    // 1. Calculate full-history metrics locally using the pure function
    const { calculateStreakAndAverages } = await import('./summary-engine.js');
    const fullHistoryMetrics = calculateStreakAndAverages(localLogs);
    
    // 2. Fetch the newly created Summary document from Firestore
    const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
    const summaryRef = doc(db, "users", uid, "analytics", "summary");
    const summarySnap = await getDoc(summaryRef);
    
    if (!summarySnap.exists()) {
        console.error("Summary document does not exist! Please ensure a backfill has run.");
        return;
    }
    
    const summaryData = summarySnap.data();
    
    console.log("Full History Metrics:", fullHistoryMetrics);
    console.log("Summary Doc Metrics:", summaryData);
    
    // 3. Compare Keys
    let isMatch = true;
    const keysToCompare = ['totalDays', 'completedDays', 'currentStreak'];
    
    for (let key of keysToCompare) {
        if (fullHistoryMetrics[key] !== summaryData[key]) {
            console.error(`❌ Mismatch in ${key}: FullHistory=${fullHistoryMetrics[key]} vs Summary=${summaryData[key]}`);
            isMatch = false;
        } else {
            console.log(`✅ ${key} matches: ${summaryData[key]}`);
        }
    }
    
    // Compare Habit Totals & Observations
    let overallTotal = fullHistoryMetrics.habitTotals['overall'];
    let summaryOverallTotal = summaryData.habitTotals['overall'];
    if (overallTotal !== summaryOverallTotal) {
        console.error(`❌ Mismatch in overall score totals: FullHistory=${overallTotal} vs Summary=${summaryOverallTotal}`);
        isMatch = false;
    } else {
        console.log(`✅ Overall Score Totals match: ${summaryOverallTotal}`);
    }
    
    if (isMatch) {
        console.log("🏆 Verification PASSED: The new summary engine perfectly aligns with the old full-history calculation.");
    } else {
        console.warn("⚠️ Verification FAILED: Some metrics drifted. Check the transaction logic.");
    }
}
