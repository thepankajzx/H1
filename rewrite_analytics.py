import re

with open('C:/Users/user/H1/analytics.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_addition = """
        /* ==========================================================================
           12. ANALYTICS LAYOUT (SIDEBAR + MAIN)
           ========================================================================== */
        .analytics-layout {
            display: flex;
            max-width: 1400px;
            margin: 0 auto;
            padding: 24px;
            gap: 32px;
        }
        .analytics-sidebar {
            flex: 0 0 280px;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }
        .analytics-main {
            flex: 1;
            min-width: 0;
            background: var(--bg-base);
        }
        .sidebar-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .sidebar-section-title {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding-left: 12px;
        }
        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .sidebar-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: all var(--transition-fast);
            cursor: pointer;
            border: none;
            background: transparent;
            text-align: left;
            width: 100%;
        }
        .sidebar-link:hover {
            background: var(--hover-bg);
            color: var(--text-primary);
        }
        .sidebar-link.active {
            background: var(--primary);
            color: var(--primary-invert);
            font-weight: 600;
        }
        .sidebar-link svg {
            width: 20px;
            height: 20px;
            opacity: 0.7;
        }
        .sidebar-link.active svg {
            opacity: 1;
        }
        
        .date-range-container {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 16px;
        }
        .date-range-container .form-label {
            display: block;
            margin-bottom: 12px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
        }
        
        /* Navbar specifically for analytics */
        .navbar {
            background: var(--card-bg);
            border-bottom: 1px solid var(--border);
            padding: 0 24px;
            height: 70px;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .nav-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            max-width: 1400px;
            margin: 0 auto;
        }
        .logo-section { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 18px; color: var(--text-primary); text-decoration: none; }
        .logo-icon { width: 32px; height: 32px; background: var(--primary); color: var(--primary-invert); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { text-decoration: none; color: var(--text-secondary); font-weight: 500; transition: color var(--transition-fast); }
        .nav-links a:hover, .nav-links a.active { color: var(--text-primary); }
        .nav-actions { display: flex; align-items: center; gap: 16px; }

        /* View Management */
        .analytics-view { display: none; }
        .analytics-view.active { display: block; animation: fadeIn 0.3s ease; }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Gap between months in heatmap */
        .month-block {
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 24px;
        }
        .month-block:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .desktop-only { display: flex; }
        .mobile-only { display: none; }

        @media (max-width: 1024px) {
            .analytics-layout { flex-direction: column; }
            .analytics-sidebar { flex: none; width: 100%; }
        }
        @media (max-width: 768px) {
            .desktop-only { display: none !important; }
            .mobile-only { display: flex; }
        }
"""
html = html.replace('</style>', css_addition + '\n</style>', 1)

new_body = """<body>

    <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
        <symbol id="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></symbol>
        <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></symbol>
        <symbol id="icon-menu" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></symbol>
    </svg>

    <!-- TOP NAVBAR -->
    <nav class="navbar">
        <div class="nav-content">
            <div class="logo-section">
                <div class="logo-icon">D</div>
                <span>HabitTracker</span>
            </div>
            
            <div class="nav-links desktop-only">
                <a href="index.html">Dashboard</a>
                <a href="analytics.html" class="active">Analytics</a>
            </div>
            
            <div class="nav-actions">
                <div class="desktop-only" style="display: flex; gap: 1rem; align-items: center;">
                    <button class="icon-btn" id="themeToggle" aria-label="Toggle Theme">
                        <svg id="moonIcon" viewBox="0 0 24 24"><use href="#icon-moon"></use></svg>
                        <svg id="sunIcon" viewBox="0 0 24 24" style="display:none;"><use href="#icon-sun"></use></svg>
                    </button>
                </div>
                
                <a href="profile.html" id="profile-avatar" style="text-decoration: none;">
                    <div class="avatar" title="Profile">PA</div>
                </a>
                
                <button class="icon-btn mobile-only" onclick="toggleMobileMenu()" aria-label="Menu">
                    <svg viewBox="0 0 24 24"><use href="#icon-menu"></use></svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- MOBILE MENU DROPDOWN -->
    <div id="mobileMenuDropdown" style="display: none; position: absolute; top: 70px; right: 1rem; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; box-shadow: var(--shadow-lg); z-index: 200; flex-direction: column; gap: 1rem; min-width: 160px;">
        <a href="index.html" style="text-decoration: none; color: var(--text-primary); font-weight: 500;">Dashboard</a>
        <a href="analytics.html" style="text-decoration: none; color: var(--primary); font-weight: 500;">Analytics</a>
        <hr style="border-color: var(--border); margin: 4px 0;">
        <button class="btn-outline" id="mobileThemeToggle" style="width: 100%; justify-content: center; display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><use href="#icon-moon"></use></svg>
            Night Mode
        </button>
    </div>

<div class="analytics-layout">
    
    <!-- LEFT SIDEBAR -->
    <aside class="analytics-sidebar">
        <div class="sidebar-section">
            <span class="sidebar-section-title">Views</span>
            <nav class="sidebar-nav">
                <button class="sidebar-link active" onclick="switchAnalyticsView('overview', this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Overview
                </button>
                <button class="sidebar-link" onclick="switchAnalyticsView('heatmap', this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Heatmap
                </button>
                <button class="sidebar-link" onclick="switchAnalyticsView('charts', this)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                    Charts
                </button>
            </nav>
        </div>
        
        <div class="sidebar-section">
            <span class="sidebar-section-title">Filters</span>
            <div class="date-range-container">
                <label class="form-label">Date Range</label>
                <select id="dateRangeSelect" class="premium-input form-field" style="width: 100%; margin-bottom: 12px;" onchange="handleDateRangeChange(this)">
                    <option value="all_time">All Time</option>
                    <option value="7">Last 7 Days</option>
                    <option value="15">Last 15 Days</option>
                    <option value="30" selected>Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="custom" class="premium-option">Custom (PRO)</option>
                </select>
                
                <div id="customDatePickers" style="display: none; flex-direction: column; gap: 8px;">
                    <input type="date" id="customStartDate" class="premium-select" style="padding: 6px 12px; width: 100%;">
                    <input type="date" id="customEndDate" class="premium-select" style="padding: 6px 12px; width: 100%;">
                </div>
            </div>
            
            <div class="filter-item" style="width: 100%; margin-top: 8px;">
                <span class="sidebar-section-title" style="padding-left:0; margin-bottom: 8px; display: block;">Select Habits</span>
                <div class="chip-group" id="dynamic-pills-container" style="display: flex; flex-wrap: wrap; gap: 8px;">
                    <button class="chip active" data-habit="overall" onclick="togglePill(this)">Overall Score</button>
                </div>
            </div>
            <button class="btn btn-primary" id="btn-generate-chart" onclick="window.updateAnalytics()" style="display: none; width: 100%; justify-content: center; font-size: 15px; padding: 10px; margin-top: 8px;">Apply Filters</button>
        </div>

        <div class="sidebar-section" style="margin-top: auto;">
            <span class="sidebar-section-title">Settings</span>
            <nav class="sidebar-nav">
                <a href="setup-habits.html" class="sidebar-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    My Habits
                </a>
            </nav>
        </div>
    </aside>
    
    <!-- MAIN CONTENT -->
    <main class="analytics-main">
        
        <!-- INSIGHTS SECTION (Always visible top stats) -->
        <section class="insights-section" style="margin-bottom: 32px;">
            <div class="insight-card premium-card card-1">
                <div class="insight-header">
                    <div class="insight-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
                    <div class="insight-value-group">
                        <span class="insight-title">Average Score</span>
                        <span class="insight-value" id="insight-avg-score">--%</span>
                    </div>
                </div>
                <div class="insight-trend up" id="insight-avg-trend-container">
                    <svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    <span id="insight-avg-trend">--</span>
                </div>
            </div>

            <div class="insight-card premium-card card-2">
                <div class="insight-header">
                    <div class="insight-icon"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
                    <div class="insight-value-group">
                        <span class="insight-title">Best Day</span>
                        <span class="insight-value" id="insight-best-score">--%</span>
                    </div>
                </div>
                <div class="insight-trend" style="color:var(--success);">
                    <span id="insight-best-date">--</span>
                </div>
            </div>

            <div class="insight-card premium-card card-3">
                <div class="insight-header">
                    <div class="insight-icon"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>
                    <div class="insight-value-group">
                        <span class="insight-title" id="insight-consistent-title">Top Habit</span>
                        <span class="insight-value" id="insight-consistent-score">--%</span>
                    </div>
                </div>
                <div class="insight-trend" style="color:var(--success);">
                    <span id="insight-consistent-name">--</span>
                </div>
            </div>

            <div class="insight-card premium-card card-4">
                <div class="insight-header">
                    <div class="insight-icon"><svg viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg></div>
                    <div class="insight-value-group">
                        <span class="insight-title">Lowest Day</span>
                        <span class="insight-value" id="insight-lowest-score">--%</span>
                    </div>
                </div>
                <div class="insight-trend" style="color:var(--danger);">
                    <span id="insight-lowest-date">--</span>
                </div>
            </div>

            <div class="insight-card premium-card card-5">
                <div class="insight-header">
                    <div class="insight-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></div>
                    <div class="insight-value-group">
                        <span class="insight-title">Total Tracked</span>
                        <span class="insight-value" id="insight-tracked-days">--</span>
                    </div>
                </div>
                <div class="insight-trend" style="color:var(--accent-1);">
                    <span id="insight-tracked-total">--</span>
                </div>
            </div>
        </section>

        <!-- VIEW 0: OVERVIEW -->
        <div id="view-overview" class="analytics-view active">
            <h2 style="margin-bottom: 24px; display:flex; align-items:center; gap:8px;">Performance Overview</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <div class="premium-card" style="cursor: pointer; transition: transform 0.2s;" onclick="switchAnalyticsView('heatmap', document.querySelectorAll('.sidebar-link')[1])">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                        <h3 style="font-size: 16px;">Activity Heatmap</h3>
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--text-muted)" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <p class="body-text" style="margin-bottom: 16px;">Visualize your daily consistency over time.</p>
                    <div style="height: 60px; display: flex; gap: 4px; align-items: flex-end;">
                        <!-- Mock heatmap preview -->
                        <div style="flex:1; height:40%; background:var(--hm-3); border-radius:4px;"></div>
                        <div style="flex:1; height:60%; background:var(--hm-6); border-radius:4px;"></div>
                        <div style="flex:1; height:90%; background:var(--hm-8); border-radius:4px;"></div>
                        <div style="flex:1; height:20%; background:var(--hm-1); border-radius:4px;"></div>
                        <div style="flex:1; height:80%; background:var(--hm-7); border-radius:4px;"></div>
                        <div style="flex:1; height:100%; background:var(--hm-9); border-radius:4px;"></div>
                        <div style="flex:1; height:50%; background:var(--hm-4); border-radius:4px;"></div>
                    </div>
                </div>

                <div class="premium-card" style="cursor: pointer; transition: transform 0.2s;" onclick="switchAnalyticsView('charts', document.querySelectorAll('.sidebar-link')[2])">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                        <h3 style="font-size: 16px;">Trend Charts</h3>
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--text-muted)" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <p class="body-text" style="margin-bottom: 16px;">Analyze progress with line and bar charts.</p>
                    <div style="height: 60px; display: flex; gap: 4px; align-items: flex-end;">
                        <!-- Mock chart preview -->
                        <div style="flex:1; height:40%; background:var(--accent-1); border-radius:4px 4px 0 0;"></div>
                        <div style="flex:1; height:30%; background:var(--accent-1); border-radius:4px 4px 0 0;"></div>
                        <div style="flex:1; height:70%; background:var(--accent-1); border-radius:4px 4px 0 0;"></div>
                        <div style="flex:1; height:60%; background:var(--accent-1); border-radius:4px 4px 0 0;"></div>
                        <div style="flex:1; height:90%; background:var(--accent-1); border-radius:4px 4px 0 0;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- VIEW 1: HEATMAP -->
        <div id="view-heatmap" class="analytics-view">
            <section class="premium-card">
                <div class="heatmap-header-top" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="display:flex; align-items:center; gap:8px;">
                        Performance Heatmap
                        <div class="info-icon-sm">i</div>
                    </h2>
                    <div style="display: flex; gap: 16px; align-items: center;">
                        <div id="heatmap-toggles" style="display: flex; align-items: center; gap: 12px;">
                            <span class="text-sm font-medium" style="color: var(--text-secondary);">Show %</span>
                            <label class="toggle-wrapper" style="margin-top:0; border:none; padding:0; background:transparent; height:auto;">
                                <input type="checkbox" id="showPctToggle" style="display:none;" onchange="window.togglePercentages()">
                                <div class="toggle-switch"></div>
                            </label>
                        </div>
                        <button class="btn-icon-sq" aria-label="Fullscreen" onclick="toggleFullscreen('heatmap')">
                            <svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        </button>
                    </div>
                </div>
                
                <!-- Averages Container for Heatmap -->
                <div id="heatmap-averages-container" style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom: 24px;"></div>

                <div class="months-container" id="heatmap-months-container">
                    <!-- JS will populate heatmap months here -->
                </div>
            </section>
        </div>

        <!-- VIEW 2: CHARTS -->
        <div id="view-charts" class="analytics-view">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2 style="display:flex; align-items:center; gap:8px;">Trend Analysis</h2>
                
                <div id="charts-toggles" style="display: flex; align-items: center; gap: 16px;">
                    <select class="premium-select" style="height:44px; min-width:auto; padding-right:32px;" id="globalChartTypeSelect">
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                    </select>
                    <div class="display-mode-toggle" style="background: var(--card-secondary); padding: 4px; border-radius: 8px;">
                        <button class="dm-btn active" onclick="setChartMode('combined', this)">Combined</button>
                        <button class="dm-btn" onclick="setChartMode('separate', this)">Separate</button>
                    </div>
                </div>
            </div>
            
            <!-- Averages Container for Charts -->
            <div id="charts-averages-container" style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom: 24px;"></div>
            <!-- DYNAMIC CHARTS CONTAINER -->
            <div id="dynamic-charts-container" style="display:flex; flex-direction:column; gap:24px;">
                <!-- JS will inject ECharts instances here -->
            </div>
        </div>

    </main>
</div>
"""

body_start = html.find('<body>')
modal_start = html.find('<!-- ==========================================================================\n     10. PREMIUM MODAL')

if body_start != -1 and modal_start != -1:
    html = html[:body_start] + new_body + "\n" + html[modal_start:]
    with open('C:/Users/user/H1/analytics.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("SUCCESS")
else:
    print("FAILED TO FIND TARGET BLOCKS")
