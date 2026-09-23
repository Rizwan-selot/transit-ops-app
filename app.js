// Transit Ops Interactive Application Logic & Search Engine

document.addEventListener('DOMContentLoaded', () => {
  // Navigation State
  const screenHistory = ['login-screen'];
  let currentScreen = 'login-screen';

  // Live Clock for Phone Status Bar
  function updateStatusBarTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    document.querySelectorAll('.js-status-time').forEach(el => {
      el.textContent = timeString;
    });
  }
  updateStatusBarTime();
  setInterval(updateStatusBarTime, 30000);

  // Toast Notification System
  window.showToast = function(message, icon = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-body-sm font-medium transition-all transform translate-y-2 opacity-0 z-50';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px]">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Screen Switching Function
  window.navigateTo = function(screenId, pushHistory = true) {
    const targetScreen = document.getElementById(screenId);
    if (!targetScreen) return;

    // Deactivate all screens
    document.querySelectorAll('.app-screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Activate target screen
    targetScreen.classList.add('active');

    if (pushHistory && currentScreen !== screenId) {
      screenHistory.push(screenId);
    }
    currentScreen = screenId;

    // Scroll inner viewport to top
    const viewport = document.getElementById('device-viewport');
    if (viewport) {
      viewport.scrollTop = 0;
    }

    // Toggle Bottom Nav Bar visibility (Hidden on Login screen, visible on app screens)
    const bottomNav = document.getElementById('app-bottom-nav');
    if (bottomNav) {
      if (screenId === 'login-screen') {
        bottomNav.style.display = 'none';
      } else {
        bottomNav.style.display = 'flex';
      }
    }

    // Update Bottom Nav Active States across screens
    updateBottomNavState(screenId);
  };

  window.goBack = function() {
    if (screenHistory.length > 1) {
      screenHistory.pop();
      const previousScreen = screenHistory[screenHistory.length - 1];
      window.navigateTo(previousScreen, false);
    } else {
      window.navigateTo('login-screen', false);
    }
  };

  function updateBottomNavState(screenId) {
    const navItems = document.querySelectorAll('.js-bottom-nav a');
    navItems.forEach(item => {
      const target = item.getAttribute('data-target');
      if (target === screenId) {
        item.classList.add('text-primary', 'font-semibold');
        item.classList.remove('text-secondary', 'font-normal');
      } else {
        item.classList.remove('text-primary', 'font-semibold');
        item.classList.add('text-secondary', 'font-normal');
      }
    });
  }

  // Initialize screen state
  window.navigateTo('login-screen', false);

  // 1. LOGIN SCREEN INTERACTIONS WITH SECURE AUTHENTICATION (Uffizio / Design1212)
  const loginForm = document.getElementById('login-form');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const loginErrorText = document.getElementById('login-error-text');
  const fleetIdInput = document.getElementById('fleet-id');
  const passwordInput = document.getElementById('password-input');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = fleetIdInput ? fleetIdInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (username === 'Uffizio' && password === 'Design1212') {
        if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
        if (fleetIdInput) fleetIdInput.classList.remove('border-red-500');
        if (passwordInput) passwordInput.classList.remove('border-red-500');
        
        window.showToast('Authentication successful. Welcome, Uffizio!', 'check_circle');
        setTimeout(() => {
          window.navigateTo('dashboard-screen');
        }, 500);
      } else {
        if (loginErrorMsg && loginErrorText) {
          loginErrorMsg.classList.remove('hidden');
          loginErrorText.textContent = 'Invalid username or password. Please try again.';
        }
        if (fleetIdInput) fleetIdInput.classList.add('border-red-500');
        if (passwordInput) passwordInput.classList.add('border-red-500');
        window.showToast('Invalid credentials!', 'error');
      }
    });
  }

  const faceIdBtn = document.getElementById('face-id-btn');
  if (faceIdBtn) {
    faceIdBtn.addEventListener('click', () => {
      window.showToast('Face ID Verified: Fleet Manager', 'fingerprint');
      setTimeout(() => {
        window.navigateTo('dashboard-screen');
      }, 600);
    });
  }

  const togglePwd = document.getElementById('toggle-pwd');
  const pwdInput = document.getElementById('password-input');
  const eyeIcon = document.getElementById('eye-icon');

  if (togglePwd && pwdInput && eyeIcon) {
    togglePwd.addEventListener('click', () => {
      const isPassword = pwdInput.getAttribute('type') === 'password';
      if (isPassword) {
        pwdInput.setAttribute('type', 'text');
        eyeIcon.textContent = 'visibility';
      } else {
        pwdInput.setAttribute('type', 'password');
        eyeIcon.textContent = 'visibility_off';
      }
    });
  }

  // 2. FLEET STATUS SEARCH AND CHIP FILTERS
  const vehicleSearchInput = document.getElementById('vehicle-search-input');
  const filterChips = document.querySelectorAll('.js-filter-chip');
  const vehicleCards = document.querySelectorAll('.js-vehicle-card');
  const noVehiclesMsg = document.getElementById('no-vehicles-msg');
  let currentFilter = 'all';

  function filterVehicles() {
    const searchTerm = vehicleSearchInput ? vehicleSearchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    vehicleCards.forEach(card => {
      const status = card.getAttribute('data-status');
      const text = card.textContent.toLowerCase();

      const matchesFilter = (currentFilter === 'all' || status === currentFilter);
      const matchesSearch = !searchTerm || text.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noVehiclesMsg) {
      if (visibleCount === 0) {
        noVehiclesMsg.classList.remove('hidden');
      } else {
        noVehiclesMsg.classList.add('hidden');
      }
    }
  }

  if (vehicleSearchInput) {
    vehicleSearchInput.addEventListener('input', filterVehicles);
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('bg-primary', 'text-on-primary');
        c.classList.add('bg-surface-container-lowest', 'text-on-surface');
      });
      chip.classList.remove('bg-surface-container-lowest', 'text-on-surface');
      chip.classList.add('bg-primary', 'text-on-primary');

      currentFilter = chip.getAttribute('data-filter') || 'all';
      filterVehicles();
    });
  });

  // 3. REPORTS SCREEN REAL-TIME SEARCH
  const reportsSearchInput = document.getElementById('reports-search-input');
  const reportsSearchContainer = document.getElementById('reports-search-container');
  const reportCards = document.querySelectorAll('.js-report-card');
  const noReportsMsg = document.getElementById('no-reports-msg');

  window.toggleReportsSearch = function() {
    if (reportsSearchContainer) {
      const isHidden = reportsSearchContainer.classList.contains('hidden');
      if (isHidden) {
        reportsSearchContainer.classList.remove('hidden');
        if (reportsSearchInput) reportsSearchInput.focus();
      } else {
        window.clearReportsSearch();
        reportsSearchContainer.classList.add('hidden');
      }
    }
  };

  window.clearReportsSearch = function() {
    if (reportsSearchInput) {
      reportsSearchInput.value = '';
      filterReports();
    }
  };

  function filterReports() {
    const query = reportsSearchInput ? reportsSearchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    reportCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noReportsMsg) {
      if (visibleCount === 0) {
        noReportsMsg.classList.remove('hidden');
      } else {
        noReportsMsg.classList.add('hidden');
      }
    }
  }

  if (reportsSearchInput) {
    reportsSearchInput.addEventListener('input', filterReports);
  }

  // 4. GLOBAL SEARCH MODAL
  const globalSearchModal = document.getElementById('global-search-modal');
  const globalSearchInput = document.getElementById('global-search-input');
  const globalSearchResults = document.getElementById('global-search-results');

  const searchableItems = [
    { type: 'vehicle', title: 'Bus #4082', sub: 'Line 104 • Driver Marcus Vance', icon: 'directions_bus', target: 'vehicle-detail-screen', badge: 'RUNNING' },
    { type: 'vehicle', title: 'Bus #3019', sub: 'Line 22 • Driver Elena Rostova', icon: 'directions_bus', target: 'status-screen', badge: 'STOPPED' },
    { type: 'vehicle', title: 'Bus #5104', sub: 'Line 701 • Driver David Kim', icon: 'directions_bus', target: 'status-screen', badge: 'IDLE' },
    { type: 'vehicle', title: 'Bus #2240', sub: 'Maintenance Bay 3', icon: 'build', target: 'status-screen', badge: 'OFFLINE' },
    { type: 'report', title: 'SYS-01 Activity Report', sub: 'Trips, Idle, Inactive', icon: 'monitoring', target: 'reports-screen' },
    { type: 'report', title: 'SYS-02 Geofence Report', sub: 'Boundary & Yard Entry', icon: 'track_changes', target: 'reports-screen' },
    { type: 'report', title: 'SYS-03 Alert Report', sub: 'Faults & Safety Triggers', icon: 'notifications', target: 'reports-screen' },
    { type: 'report', title: 'SYS-07 Driver Behaviour', sub: 'Braking, Speeding, Shifts', icon: 'badge', target: 'reports-screen' },
    { type: 'report', title: 'SYS-09 Fuel & Energy', sub: 'SOC %, Liters, Consumption', icon: 'local_gas_station', target: 'reports-screen' },
    { type: 'report', title: 'SYS-15 GTFS Trip Data', sub: 'GTFS-RT Trip & Stop Sync', icon: 'schedule', target: 'reports-screen' },
    { type: 'driver', title: 'Marcus Vance (Driver)', sub: 'Badge #DV-9912 • Rating 4.96', icon: 'person', target: 'vehicle-detail-screen' },
    { type: 'driver', title: 'Elena Rostova (Driver)', sub: 'Badge #DV-4102 • Rating 4.91', icon: 'person', target: 'status-screen' },
    { type: 'route', title: 'Line 104 — Downtown Express', sub: 'Assigned 4 Vehicles', icon: 'alt_route', target: 'status-screen' },
    { type: 'route', title: 'Line 22 — Bay Shore Cross', sub: 'Assigned 2 Vehicles', icon: 'alt_route', target: 'status-screen' }
  ];

  window.openGlobalSearch = function() {
    if (globalSearchModal) {
      globalSearchModal.classList.remove('hidden');
      if (globalSearchInput) {
        globalSearchInput.value = '';
        globalSearchInput.focus();
        renderGlobalSearchResults('');
      }
    }
  };

  window.closeGlobalSearch = function() {
    if (globalSearchModal) {
      globalSearchModal.classList.add('hidden');
    }
  };

  function renderGlobalSearchResults(query) {
    if (!globalSearchResults) return;
    const q = query.toLowerCase().trim();

    const filtered = searchableItems.filter(item => {
      return !q || item.title.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      globalSearchResults.innerHTML = `
        <div class="text-center py-6 text-secondary">
          <span class="material-symbols-outlined text-[28px] text-outline mb-1 block">search_off</span>
          <p class="text-body-sm font-medium">No results found matching "${query}"</p>
          <span class="text-[11px]">Try searching for 'Bus', 'Geofence', 'Line 104', or 'Marcus'</span>
        </div>
      `;
      return;
    }

    globalSearchResults.innerHTML = filtered.map(item => `
      <div onclick="closeGlobalSearch(); navigateTo('${item.target}')" class="p-2.5 rounded-xl hover:bg-surface-container flex items-center justify-between cursor-pointer border border-transparent hover:border-outline-variant transition">
        <div class="flex items-center space-x-2.5">
          <div class="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-primary shrink-0">
            <span class="material-symbols-outlined text-[16px]">${item.icon}</span>
          </div>
          <div>
            <span class="font-bold text-body-sm block text-primary leading-tight">${item.title}</span>
            <span class="text-[11px] text-secondary block">${item.sub}</span>
          </div>
        </div>
        ${item.badge ? `<span class="text-[10px] font-semibold bg-primary text-on-primary px-2 py-0.5 rounded-full shrink-0">${item.badge}</span>` : `<span class="material-symbols-outlined text-[16px] text-secondary shrink-0">chevron_right</span>`}
      </div>
    `).join('');
  }

  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
      renderGlobalSearchResults(e.target.value);
    });
  }

  // 5. HARDWARE NODE STREAM SIMULATION
  const logStreamContainer = document.getElementById('log-stream-container');
  if (logStreamContainer) {
    const sampleLogs = [
      { code: 'CAN_ENGINE_RPM', val: '1420 RPM (STABLE)' },
      { code: 'BATTERY_THERMAL_SENS', val: '32.4°C (NOMINAL)' },
      { code: 'TELEM_PING_GATEWAY', val: 'LATENCY 14ms • OK' },
      { code: 'GPS_ACCURACY_CHECK', val: 'RTK FIXED • 0.4m' }
    ];

    setInterval(() => {
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];
      const log = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];

      const logRow = document.createElement('div');
      logRow.className = 'flex justify-between animate-fade-in';
      logRow.innerHTML = `
        <span>[${timestamp}] ${log.code}</span>
        <span class="text-primary font-semibold">${log.val}</span>
      `;

      if (logStreamContainer.children.length > 4) {
        logStreamContainer.removeChild(logStreamContainer.lastChild);
      }
      logStreamContainer.insertBefore(logRow, logStreamContainer.firstChild);
    }, 4000);
  }

  // 6. OVERRIDE & DRIVER MODAL ACTIONS
  window.openOverrideModal = function() {
    const modal = document.getElementById('override-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeOverrideModal = function() {
    const modal = document.getElementById('override-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.confirmOverride = function(command) {
    window.closeOverrideModal();
    window.showToast(`Override Execution: ${command} sent to #4082`, 'terminal');
  };

  window.openContactModal = function() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeContactModal = function() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.add('hidden');
  };

  // =========================================================================
  // SEARCHABLE DROPDOWNS CONTROLLER (Filter Operations Bottom Sheet)
  // =========================================================================
  const FILTER_OPTIONS = {
    'company': [
      'MTA Transportation Services',
      'NYC Transit Authority',
      'Regional Metro Fleet',
      'Transit Express Corp',
      'Suburban Transit Lines',
      'Global Logistics Transit'
    ],
    'branch': [
      'Central North Depot',
      'East Bay Ops',
      'South Hub Depot',
      'Westside Terminal',
      'Downtown Central Hub',
      'Metro Airport Shuttle'
    ],
    'depot': [
      'All Depots',
      'Depot 01 - Main',
      'Depot 02 - North',
      'Depot 03 - West',
      'Depot 04 - Harbor',
      'Depot 05 - Midtown',
      'Depot 06 - Uptown'
    ],
    'vehicle-type': [
      'All Vehicle Types',
      'Electric Transit Bus',
      'Diesel Hybrid',
      'Articulated 60ft Bus',
      'Double Decker Bus',
      'Compressed Natural Gas (CNG)',
      'Hydrogen Fuel Cell Bus',
      'Mini Shuttle Bus'
    ],
    'vehicle-group': [
      'All Vehicle Groups',
      'Express Commute',
      'Local Rapid Transit',
      'Night Owl Service',
      'Airport Direct Express',
      'School District Rapid',
      'Intercity Connector'
    ]
  };

  const currentFilterValues = {
    'company': 'MTA Transportation Services',
    'branch': 'Central North Depot',
    'depot': 'All Depots',
    'vehicle-type': 'All Vehicle Types',
    'vehicle-group': 'All Vehicle Groups'
  };

  window.toggleSearchableDropdown = function(dropdownId) {
    Object.keys(FILTER_OPTIONS).forEach(id => {
      if (id !== dropdownId) {
        closeSearchableDropdown(id);
      }
    });

    const panel = document.getElementById(`dropdown-panel-${dropdownId}`);
    const arrow = document.getElementById(`filter-${dropdownId}-arrow`);

    if (panel) {
      const isHidden = panel.classList.contains('hidden');
      if (isHidden) {
        panel.classList.remove('hidden');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        renderDropdownOptions(dropdownId, '');
        
        const searchInput = document.getElementById(`dropdown-search-${dropdownId}`);
        if (searchInput) {
          searchInput.value = '';
          const clearBtn = document.getElementById(`dropdown-clear-${dropdownId}`);
          if (clearBtn) clearBtn.classList.add('hidden');
          setTimeout(() => searchInput.focus(), 50);
        }
      } else {
        closeSearchableDropdown(dropdownId);
      }
    }
  };

  function closeSearchableDropdown(dropdownId) {
    const panel = document.getElementById(`dropdown-panel-${dropdownId}`);
    const arrow = document.getElementById(`filter-${dropdownId}-arrow`);
    if (panel) panel.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }

  window.closeAllSearchableDropdowns = function() {
    Object.keys(FILTER_OPTIONS).forEach(id => closeSearchableDropdown(id));
  };

  window.renderDropdownOptions = function(dropdownId, query = '') {
    const optionsContainer = document.getElementById(`dropdown-options-${dropdownId}`);
    if (!optionsContainer) return;

    const allOptions = FILTER_OPTIONS[dropdownId] || [];
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery 
      ? allOptions.filter(opt => opt.toLowerCase().includes(normalizedQuery))
      : allOptions;

    const selectedValue = currentFilterValues[dropdownId];

    if (filtered.length === 0) {
      optionsContainer.innerHTML = `
        <div class="py-3 text-center text-xs font-medium text-slate-400">
          No results found
        </div>
      `;
      return;
    }

    optionsContainer.innerHTML = filtered.map(opt => {
      const isSelected = opt === selectedValue;
      const escapedOpt = opt.replace(/'/g, "\\'");
      return `
        <div onclick="selectDropdownOption('${dropdownId}', '${escapedOpt}')" class="px-3 py-2 rounded-xl text-body-sm font-medium transition flex items-center justify-between cursor-pointer ${
          isSelected 
            ? 'bg-slate-100 text-primary font-bold' 
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }">
          <span class="truncate">${opt}</span>
          ${isSelected ? '<span class="material-symbols-outlined text-[16px] text-primary shrink-0 ml-2">check</span>' : ''}
        </div>
      `;
    }).join('');
  };

  window.filterDropdownOptions = function(dropdownId, query) {
    const clearBtn = document.getElementById(`dropdown-clear-${dropdownId}`);
    if (clearBtn) {
      if (query && query.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
    renderDropdownOptions(dropdownId, query);
  };

  window.clearDropdownSearch = function(dropdownId) {
    const input = document.getElementById(`dropdown-search-${dropdownId}`);
    if (input) {
      input.value = '';
      filterDropdownOptions(dropdownId, '');
      input.focus();
    }
  };

  window.selectDropdownOption = function(dropdownId, val) {
    currentFilterValues[dropdownId] = val;

    const hiddenInput = document.getElementById(`filter-${dropdownId}`);
    if (hiddenInput) hiddenInput.value = val;

    const displayLabel = document.getElementById(`filter-${dropdownId}-display`);
    if (displayLabel) displayLabel.textContent = val;

    closeSearchableDropdown(dropdownId);
  };

  // Close searchable dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const isDropdownClick = e.target.closest('.searchable-dropdown');
    if (!isDropdownClick) {
      window.closeAllSearchableDropdowns();
    }
  });

  // 7. FILTER OPERATIONS BOTTOM SHEET MODAL ACTIONS
  window.openFilterModal = function() {
    window.closeAllSearchableDropdowns();
    const modal = document.getElementById('filter-modal');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeFilterModal = function() {
    window.closeAllSearchableDropdowns();
    const modal = document.getElementById('filter-modal');
    if (modal) modal.classList.add('hidden');
  };

  window.applyFilterModal = function() {
    window.closeAllSearchableDropdowns();
    const company = currentFilterValues['company'] || 'MTA Transportation Services';
    const branch = currentFilterValues['branch'] || 'Central North Depot';
    
    let compText = company.includes('MTA') ? 'MTA Transportation' : company;
    let branchText = branch.replace(' Depot', '').replace(' Ops', '');

    const activeLabel = document.getElementById('active-filter-label');
    if (activeLabel) {
      activeLabel.textContent = `${compText} • ${branchText}`;
    }

    window.closeFilterModal();
    window.showToast(`Applied: ${compText} • ${branchText}`, 'tune');
  };

  window.resetFilterModal = function() {
    window.closeAllSearchableDropdowns();
    
    const defaults = {
      'company': 'MTA Transportation Services',
      'branch': 'Central North Depot',
      'depot': 'All Depots',
      'vehicle-type': 'All Vehicle Types',
      'vehicle-group': 'All Vehicle Groups'
    };

    Object.keys(defaults).forEach(id => {
      window.selectDropdownOption(id, defaults[id]);
    });

    const activeLabel = document.getElementById('active-filter-label');
    if (activeLabel) {
      activeLabel.textContent = 'MTA Transportation • Central North';
    }

    window.closeFilterModal();
    window.showToast('Filter preferences reset', 'refresh');
  };

  // SUB-REPORTS MAPPING (Matching User Table Spec media_1790137587929.png)
  const subReportsMap = {
    'Activity': [
      { title: 'Travel Report', desc: 'Fleet movement, active transit & trip duration logs', icon: 'directions_bus' },
      { title: 'Trip Report', desc: 'Detailed trip completion stats & schedule sync', icon: 'route' },
      { title: 'Stoppage Report', desc: 'Station dwell times, layover & unexpected stops', icon: 'hail' },
      { title: 'Idle Report', desc: 'Engine idling, fuel waste & terminal dwell times', icon: 'timer' },
      { title: 'Inactive Report', desc: 'Yard inactive status & unassigned vehicle log', icon: 'power_off' },
      { title: 'Vehicle Status Report', desc: 'Realtime telemetry operational availability', icon: 'analytics' },
      { title: 'Daywise Distance Report', desc: 'Daily odometer km mileage tracking per vehicle', icon: 'straighten' }
    ],
    'Alert': [
      { title: 'Vehicle Alert Report', desc: 'Critical engine faults, diagnostic DTCs & warnings', icon: 'warning' },
      { title: 'Driver Alert Report', desc: 'Driver safety triggers, fatigue & cabin warnings', icon: 'notifications_active' }
    ],
    'Sensor': [
      { title: 'Ignition Report', desc: 'Key-on ignition cycles, engine run hours log', icon: 'key' },
      { title: 'Analog Data Report', desc: 'Analog sensor inputs, temperature & pressure matrix', icon: 'sensors' },
      { title: 'RFID Data Report', desc: 'Driver & passenger RFID card scans & badge logs', icon: 'badge' },
      { title: 'Digital Port Report', desc: 'Digital I/O port status & hardware sensor feeds', icon: 'settings_input_component' },
      { title: 'Immobilize Report', desc: 'Remote starter cut & vehicle security lock status', icon: 'lock' }
    ],
    'Logs': [
      { title: 'System Log Report', desc: 'Hardware node stream, gateway ping & latency logs', icon: 'description' },
      { title: 'Send Command Report', desc: 'CAN-BUS dispatch overrides & remote command history', icon: 'terminal' }
    ],
    'Routes': [
      { title: 'Distance Report', desc: 'Route distance calculations & total km traversed', icon: 'alt_route' },
      { title: 'Route Action Report', desc: 'Waypoints reached, line stops & depot check-ins', icon: 'location_on' },
      { title: 'Scheduled vs Actual Distance', desc: 'Timetable mileage vs actual GPS route distance', icon: 'compare' },
      { title: 'Route Deviation Report', desc: 'Off-route alerts, detour logs & boundary breaches', icon: 'wrong_location' },
      { title: 'Route Compliance Report', desc: 'Schedule adherence %, punctuality & headways', icon: 'verified' }
    ],
    'Stops': [
      { title: 'Stop Wise Report', desc: 'Passenger boardings, stop dwell time & arrival sync', icon: 'pin_drop' },
      { title: 'Stop Vehicle Data Report', desc: 'Door opening status, passenger counter & stop logs', icon: 'departure_board' }
    ],
    'GTFS Trip Data': [
      { title: 'GTFS Trip Data Report', desc: 'GTFS-Realtime trip updates, vehicle positions & feed status', icon: 'schedule' }
    ],
    'Geofence': [
      { title: 'Boundary Entry/Exit Report', desc: 'Terminal & depot geofence crossing logs', icon: 'track_changes' },
      { title: 'Yard Dwell Duration Report', desc: 'Time spent inside depot maintenance yards', icon: 'crop_square' },
      { title: 'Forbidden Zone Breach Report', desc: 'Unauthorized area entry & perimeter alerts', icon: 'report_problem' },
      { title: 'Speed Limit Geofence Report', desc: 'Zone-based automatic speed restriction logs', icon: 'speed' }
    ],
    'Driver Behaviour': [
      { title: 'Braking Event Report', desc: 'Harsh braking, sudden deceleration & safety scores', icon: 'car_crash' },
      { title: 'Speeding Violations Report', desc: 'Over-speed instances, threshold breaches & alerts', icon: 'speed' },
      { title: 'Shift Duration Report', desc: 'Driver duty hours, shift handovers & rest breaks', icon: 'badge' },
      { title: 'Harsh Acceleration Report', desc: 'Aggressive acceleration & throttle telemetry', icon: 'play_arrow' }
    ],
    'Tire': [
      { title: 'Tire PSI Pressure Report', desc: 'Realtime TPMS tire pressure monitoring matrix', icon: 'tire_repair' },
      { title: 'Tire Temperature Matrix', desc: 'Wheel thermal sensors & overheating warnings', icon: 'thermostat' },
      { title: 'Tire Wear Status Report', desc: 'Estimated tread wear & mileage replacement logs', icon: 'build' }
    ],
    'Fuel & Energy': [
      { title: 'SOC % Charge Level Report', desc: 'EV battery State-of-Charge & range estimation', icon: 'battery_charging_full' },
      { title: 'Fuel Consumption Report', desc: 'Liters consumed per 100km & engine efficiency', icon: 'local_gas_station' },
      { title: 'Liters Refuel Log Report', desc: 'Depot fueling timestamps & tank volume changes', icon: 'opacity' },
      { title: 'EV Battery Thermal Report', desc: 'Battery pack cell temperatures & cooling status', icon: 'ac_unit' }
    ],
    'RPM & Engine': [
      { title: 'CAN-BUS Engine RPM Report', desc: 'Engine RPM distributions & over-revving logs', icon: 'speed' },
      { title: 'Torque & Load Strain Report', desc: 'Engine load %, transmission strain & climbing torque', icon: 'fitness_center' },
      { title: 'Engine Fault Codes Report', desc: 'J1939 ECU fault codes & check engine triggers', icon: 'build_circle' }
    ],
    'Reminder': [
      { title: 'Scheduled Service Report', desc: 'Periodic oil, filter & brake service schedules', icon: 'event_repeat' },
      { title: 'Inspection Due Report', desc: 'Mandatory transit safety inspection reminders', icon: 'fact_check' },
      { title: 'License Renewal Report', desc: 'Driver license & vehicle registration expiry alerts', icon: 'badge' }
    ],
    'Video Telematics': [
      { title: 'Cabin Cam Feed Report', desc: 'Driver cabin AI monitoring & fatigue video clips', icon: 'videocam' },
      { title: 'Dash Cam Event Clips Report', desc: 'Road incident auto-captured video clip logs', icon: 'camera_roll' },
      { title: 'ADAS Safety Warnings Report', desc: 'Lane departure & forward collision warning feeds', icon: 'warning' }
    ],
    'OBD Diagnostic': [
      { title: 'J1939 Telemetry Report', desc: 'Commercial heavy-vehicle CAN bus telemetry stream', icon: 'memory' },
      { title: 'DTC Fault Codes Report', desc: 'Diagnostic Trouble Codes & engine severity levels', icon: 'error' },
      { title: 'MIL Indicator Log Report', desc: 'Malfunction Indicator Lamp triggers & reset logs', icon: 'flourescent' }
    ]
  };

  window.openSubReportsList = function(categoryName) {
    const titleEl = document.getElementById('sub-reports-category-title');
    const subtitleEl = document.getElementById('sub-reports-category-subtitle');
    const container = document.getElementById('sub-reports-list-container');

    const subReports = subReportsMap[categoryName] || [
      { title: `${categoryName} Main Report`, desc: `Detailed operational metrics for ${categoryName}`, icon: 'analytics' }
    ];

    if (titleEl) titleEl.textContent = `${categoryName} Sub-Reports`;
    if (subtitleEl) subtitleEl.textContent = `${subReports.length} available report modules`;

    if (container) {
      container.innerHTML = subReports.map(item => `
        <div onclick="openReportDetail('${item.title}')" class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 flex items-center justify-between hover:border-primary transition cursor-pointer shadow-xs active:bg-surface-container-low">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
            </div>
            <div class="truncate">
              <h4 class="font-headline-sm font-bold text-primary text-body-md leading-tight">${item.title}</h4>
              <p class="text-body-sm text-secondary text-[11px] truncate mt-0.5">${item.desc}</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-secondary text-[18px] shrink-0 ml-2">chevron_right</span>
        </div>
      `).join('');
    }

    window.navigateTo('sub-reports-screen');
  };

  window.openReportDetail = function(reportTitle) {
    currentReportTitle = reportTitle || 'Activity';
    const headerTitle = document.getElementById('report-detail-header-title');
    if (headerTitle) {
      headerTitle.textContent = `${currentReportTitle} Report Detail`;
    }
    window.navigateTo('report-detail-screen');
  };

  window.selectDatePreset = function(preset) {
    activeDatePreset = preset;
    
    // Update button active styles
    const presetButtons = document.querySelectorAll('.js-date-preset');
    presetButtons.forEach(btn => {
      btn.classList.remove('bg-primary', 'text-on-primary');
      btn.classList.add('bg-surface-container-lowest', 'border', 'border-outline-variant', 'text-secondary');
    });

    const activeBtn = document.getElementById(`preset-${preset}`);
    if (activeBtn) {
      activeBtn.classList.remove('bg-surface-container-lowest', 'border', 'border-outline-variant', 'text-secondary');
      activeBtn.classList.add('bg-primary', 'text-on-primary');
    }

    // Update Date Range Text
    const dateText = document.getElementById('selected-date-range-text');
    if (dateText) {
      if (preset === '7-days') {
        activeDateRangeString = 'Oct 12, 2026 - Oct 18, 2026';
      } else if (preset === '30-days') {
        activeDateRangeString = 'Sep 18, 2026 - Oct 18, 2026';
      } else if (preset === 'this-month') {
        activeDateRangeString = 'Oct 01, 2026 - Oct 31, 2026';
      }
      dateText.textContent = activeDateRangeString;
    }
  };

  window.updateFleetScopeText = function() {
    const select = document.getElementById('report-fleet-select');
    const scopeDesc = document.getElementById('scope-description-text');
    const scopePct = document.getElementById('scope-percentage-text');
    if (!select || !scopeDesc || !scopePct) return;

    const val = select.value;
    if (val.includes('All Fleets')) {
      scopeDesc.textContent = 'Scope includes electric and hybrid line divisions';
      scopePct.textContent = '100% Units';
    } else if (val.includes('Mercedes')) {
      scopeDesc.textContent = 'Scope includes Mercedes Citaro E-Cell fleet';
      scopePct.textContent = '45.6% Units';
    } else if (val.includes('Volvo')) {
      scopeDesc.textContent = 'Scope includes Volvo 7900 Hybrid fleet';
      scopePct.textContent = '28.0% Units';
    } else if (val.includes('BYD')) {
      scopeDesc.textContent = 'Scope includes BYD K9 Electric fleet';
      scopePct.textContent = '18.0% Units';
    } else {
      scopeDesc.textContent = 'Scope includes New Flyer Xcelsior fleet';
      scopePct.textContent = '11.9% Units';
    }
  };

  window.generateReport = function() {
    const fleetSelect = document.getElementById('report-fleet-select');
    const selectedFleet = fleetSelect ? fleetSelect.value : 'All Fleets (428 Units)';

    // Update Results Screen Headers & Scope Banner
    const resTitle = document.getElementById('result-report-title');
    const resDate = document.getElementById('active-result-date');
    const resFleet = document.getElementById('active-result-fleet');

    if (resTitle) resTitle.textContent = `${currentReportTitle} Report`;
    if (resDate) resDate.textContent = activeDateRangeString;
    if (resFleet) resFleet.textContent = `Vehicle Group: ${selectedFleet}`;

    // Navigate to Results Screen
    window.navigateTo('report-results-screen');
    window.showToast(`${currentReportTitle} Report generated!`, 'analytics');
  };

  window.toggleReportView = function(viewType) {
    const chartView = document.getElementById('report-view-chart');
    const tableView = document.getElementById('report-view-table');
    const chartBtn = document.getElementById('view-btn-chart');
    const tableBtn = document.getElementById('view-btn-table');

    if (viewType === 'chart') {
      if (chartView) chartView.classList.remove('hidden');
      if (tableView) tableView.classList.add('hidden');

      if (chartBtn) {
        chartBtn.className = 'px-3 py-1 rounded-lg text-[11px] font-bold transition bg-primary text-on-primary shadow-xs flex items-center space-x-1';
      }
      if (tableBtn) {
        tableBtn.className = 'px-3 py-1 rounded-lg text-[11px] font-medium transition text-secondary hover:text-primary flex items-center space-x-1';
      }
    } else {
      if (chartView) chartView.classList.add('hidden');
      if (tableView) tableView.classList.remove('hidden');

      if (tableBtn) {
        tableBtn.className = 'px-3 py-1 rounded-lg text-[11px] font-bold transition bg-primary text-on-primary shadow-xs flex items-center space-x-1';
      }
      if (chartBtn) {
        chartBtn.className = 'px-3 py-1 rounded-lg text-[11px] font-medium transition text-secondary hover:text-primary flex items-center space-x-1';
      }
    }
  };

  window.editReportParameters = function() {
    window.navigateTo('report-detail-screen');
  };

  // USER PROFILE ACTIONS
  window.toggleProfileNotification = function(btn) {
    const isChecked = btn.classList.contains('bg-primary');
    const knob = btn.querySelector('div');

    if (isChecked) {
      btn.classList.remove('bg-primary');
      btn.classList.add('bg-outline-variant');
      if (knob) {
        knob.style.transform = 'translateX(-24px)';
      }
      window.showToast('Push notifications disabled', 'notifications_off');
    } else {
      btn.classList.remove('bg-outline-variant');
      btn.classList.add('bg-primary');
      if (knob) {
        knob.style.transform = 'translateX(0px)';
      }
      window.showToast('Push notifications enabled', 'notifications');
    }
  };

  window.handleLogout = function() {
    if (fleetIdInput) fleetIdInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    window.navigateTo('login-screen');
    window.showToast('Logged out successfully', 'logout');
  };

  // =========================================================================
  // DASHBOARD WIDGET CUSTOMIZATION LOGIC
  // =========================================================================
  const WIDGET_KEYS = [
    'fleet-status',
    'object-brand',
    'immobilize',
    'depot-status',
    'schedule-mgmt',
    'route-mgmt',
    'stop-mgmt',
    'driver-analytics'
  ];

  window.openDashboardCustomizeModal = function() {
    const modal = document.getElementById('dashboard-customize-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  };

  window.closeDashboardCustomizeModal = function() {
    const modal = document.getElementById('dashboard-customize-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  };

  window.toggleWidgetVisibility = function(widgetKey, isVisible) {
    const widgetEl = document.getElementById(`widget-${widgetKey}`);
    if (widgetEl) {
      if (isVisible) {
        widgetEl.classList.remove('hidden');
      } else {
        widgetEl.classList.add('hidden');
      }
    }

    const toggleEl = document.getElementById(`toggle-${widgetKey}`);
    if (toggleEl && toggleEl.checked !== isVisible) {
      toggleEl.checked = isVisible;
    }

    try {
      const saved = JSON.parse(localStorage.getItem('transit_dashboard_widgets') || '{}');
      saved[widgetKey] = isVisible;
      localStorage.setItem('transit_dashboard_widgets', JSON.stringify(saved));
    } catch (e) {
      console.error('Failed to save widget settings:', e);
    }
  };

  window.resetDashboardWidgets = function() {
    WIDGET_KEYS.forEach(key => {
      window.toggleWidgetVisibility(key, true);
    });
    if (window.showToast) {
      window.showToast('Dashboard reset to default', 'restart_alt');
    }
  };

  function loadDashboardWidgetPreferences() {
    try {
      const saved = JSON.parse(localStorage.getItem('transit_dashboard_widgets') || '{}');
      WIDGET_KEYS.forEach(key => {
        if (saved.hasOwnProperty(key)) {
          window.toggleWidgetVisibility(key, saved[key]);
        } else {
          window.toggleWidgetVisibility(key, true);
        }
      });
    } catch (e) {
      console.error('Failed to load widget preferences:', e);
    }
  }

  loadDashboardWidgetPreferences();
});
