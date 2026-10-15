/**
 * RentFlow Pro - Core JavaScript Application Logic
 * Pure Client-Side Architecture for 100% Local Data & Tiiny.host Hosting
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Initial State & Storage Keys
  // ==========================================
  const STORAGE_KEY_TENANTS = 'rentflow_tenants_data';
  const STORAGE_KEY_ROOMS = 'rentflow_rooms_data';
  const STORAGE_KEY_PAYMENTS = 'rentflow_payments_data';
  const STORAGE_KEY_SETTINGS = 'rentflow_settings_data';
  const STORAGE_KEY_METER_HISTORY = 'rentflow_meter_history_data';
  const STORAGE_KEY_REAL_METER_BILLS = 'rentflow_real_meter_bills_data';

  const AppState = {
    currentTab: 'dashboard',
    previousTab: 'rooms',
    selectedMonth: getCurrentYearMonth(), // e.g. "2026-08"
    tenants: [],
    rooms: [],
    payments: [],
    meterHistory: [],
    realMeterBills: [],
    settings: {
      propertyName: 'RentFlow PG & Rooms',
      ownerName: 'Property Owner',
      ownerPhone: '9876543210',
      ownerUpi: '9876543210@paytm',
      receiptNote: 'Please pay monthly rent on time. Thank you!'
    },
    chartInstance: null
  };

  // ==========================================
  // 2. DOM Element Selectors
  // ==========================================
  const DOM = {
    // Navigation
    sidebar: document.getElementById('sidebar'),
    openSidebarBtn: document.getElementById('openSidebarBtn'),
    closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    navItems: document.querySelectorAll('.nav-item'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    pageHeaderTitle: document.getElementById('pageHeaderTitle'),
    pageHeaderSubtitle: document.getElementById('pageHeaderSubtitle'),
    brandPropertyName: document.getElementById('brandPropertyName'),
    globalMonthFilter: document.getElementById('globalMonthFilter'),
    navTenantCount: document.getElementById('navTenantCount'),
    navRoomCount: document.getElementById('navRoomCount'),

    // Dashboard KPIs
    dashTotalTenants: document.getElementById('dashTotalTenants'),
    dashRoomOccupancy: document.getElementById('dashRoomOccupancy'),
    occupancyProgressBar: document.getElementById('occupancyProgressBar'),
    dashRentCollected: document.getElementById('dashRentCollected'),
    dashExpectedRent: document.getElementById('dashExpectedRent'),
    collectionProgressBar: document.getElementById('collectionProgressBar'),
    dashTotalAdvance: document.getElementById('dashTotalAdvance'),
    dashAdvanceTenantsCount: document.getElementById('dashAdvanceTenantsCount'),
    advanceMonthsTag: document.getElementById('advanceMonthsTag'),
    dashTotalPending: document.getElementById('dashTotalPending'),
    dashPendingTenantsCount: document.getElementById('dashPendingTenantsCount'),
    dueAlertBanner: document.getElementById('dueAlertBanner'),
    dueAlertText: document.getElementById('dueAlertText'),
    viewDueTenantsBtn: document.getElementById('viewDueTenantsBtn'),
    openDueListBtn: document.getElementById('openDueListBtn'),
    chartYearTag: document.getElementById('chartYearTag'),
    rentTrendsChart: document.getElementById('rentTrendsChart'),
    dashRecentPaymentsList: document.getElementById('dashRecentPaymentsList'),
    dashTenantTableBody: document.getElementById('dashTenantTableBody'),
    dashTenantSearch: document.getElementById('dashTenantSearch'),

    // Quick Buttons
    btnQuickRecordPayment: document.getElementById('btnQuickRecordPayment'),
    btnQuickAddTenant: document.getElementById('btnQuickAddTenant'),
    quickExportBtn: document.getElementById('quickExportBtn'),

    // Tenants Tab
    tenantsCardsGrid: document.getElementById('tenantsCardsGrid'),
    tenantSearchInput: document.getElementById('tenantSearchInput'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    countFilterAll: document.getElementById('countFilterAll'),
    countFilterActive: document.getElementById('countFilterActive'),
    countFilterPending: document.getElementById('countFilterPending'),
    countFilterAdvance: document.getElementById('countFilterAdvance'),
    countFilterVacated: document.getElementById('countFilterVacated'),
    btnOpenAddTenantModal: document.getElementById('btnOpenAddTenantModal'),

    // Rooms Tab
    roomsCardsGrid: document.getElementById('roomsCardsGrid'),
    btnOpenAddRoomModal: document.getElementById('btnOpenAddRoomModal'),

    // Payments Tab
    paymentSearchInput: document.getElementById('paymentSearchInput'),
    paymentMonthFilter: document.getElementById('paymentMonthFilter'),
    filteredTotalPaymentAmount: document.getElementById('filteredTotalPaymentAmount'),
    filteredPaymentCount: document.getElementById('filteredPaymentCount'),
    paymentsTableBody: document.getElementById('paymentsTableBody'),
    btnOpenRecordPaymentModal: document.getElementById('btnOpenRecordPaymentModal'),
    btnExportPaymentsCSV: document.getElementById('btnExportPaymentsCSV'),

    // Reports Tab
    reportYearFilter: document.getElementById('reportYearFilter'),
    reportsSummaryCards: document.getElementById('reportsSummaryCards'),
    monthlyReportTableBody: document.getElementById('monthlyReportTableBody'),
    reportTableHeading: document.getElementById('reportTableHeading'),
    btnPrintReportBtn: document.getElementById('btnPrintReportBtn'),

    // Settings Tab
    propertySettingsForm: document.getElementById('propertySettingsForm'),
    settingPropName: document.getElementById('settingPropName'),
    settingOwnerName: document.getElementById('settingOwnerName'),
    settingOwnerPhone: document.getElementById('settingOwnerPhone'),
    settingDefaultUnitRate: document.getElementById('settingDefaultUnitRate'),
    settingOwnerUpi: document.getElementById('settingOwnerUpi'),
    settingReceiptNote: document.getElementById('settingReceiptNote'),
    btnExportFullBackup: document.getElementById('btnExportFullBackup'),
    btnExportFullBackupPDF: document.getElementById('btnExportFullBackupPDF'),
    importBackupInput: document.getElementById('importBackupInput'),
    btnLoadDemoData: document.getElementById('btnLoadDemoData'),
    btnClearAllData: document.getElementById('btnClearAllData'),

    // Cloud Sync Selectors
    cloudSyncPill: document.getElementById('cloudSyncPill'),
    cloudSyncDot: document.getElementById('cloudSyncDot'),
    cloudSyncText: document.getElementById('cloudSyncText'),
    cloudBadgeStatus: document.getElementById('cloudBadgeStatus'),
    settingCloudSyncKey: document.getElementById('settingCloudSyncKey'),
    btnSaveCloudKey: document.getElementById('btnSaveCloudKey'),
    btnPushToCloud: document.getElementById('btnPushToCloud'),
    btnSyncFromCloud: document.getElementById('btnSyncFromCloud'),
    btnOpenFirebaseConfig: document.getElementById('btnOpenFirebaseConfig'),
    firebaseModal: document.getElementById('firebaseModal'),
    firebaseConfigForm: document.getElementById('firebaseConfigForm'),
    fbDbUrl: document.getElementById('fbDbUrl'),
    fbApiKey: document.getElementById('fbApiKey'),
    fbSyncCode: document.getElementById('fbSyncCode'),

    // Modals
    tenantModal: document.getElementById('tenantModal'),
    tenantModalTitle: document.getElementById('tenantModalTitle'),
    tenantForm: document.getElementById('tenantForm'),
    tenantId: document.getElementById('tenantId'),
    tenantName: document.getElementById('tenantName'),
    tenantPhone: document.getElementById('tenantPhone'),
    tenantRoomSelect: document.getElementById('tenantRoomSelect'),
    tenantRentAmount: document.getElementById('tenantRentAmount'),
    tenantJoiningDate: document.getElementById('tenantJoiningDate'),
    tenantSecurityDeposit: document.getElementById('tenantSecurityDeposit'),
    tenantInitialAdvance: document.getElementById('tenantInitialAdvance'),
    tenantStatus: document.getElementById('tenantStatus'),
    tenantIdProof: document.getElementById('tenantIdProof'),
    tenantEmergencyPhone: document.getElementById('tenantEmergencyPhone'),
    tenantNotes: document.getElementById('tenantNotes'),

    roomModal: document.getElementById('roomModal'),
    roomModalTitle: document.getElementById('roomModalTitle'),
    roomForm: document.getElementById('roomForm'),
    roomId: document.getElementById('roomId'),
    roomNumber: document.getElementById('roomNumber'),
    roomDefaultRent: document.getElementById('roomDefaultRent'),
    roomMeterReading: document.getElementById('roomMeterReading'),

    paymentModal: document.getElementById('paymentModal'),
    paymentModalTitle: document.getElementById('paymentModalTitle'),
    paymentEditId: document.getElementById('paymentEditId'),
    paymentForm: document.getElementById('paymentForm'),
    paymentTenantSelect: document.getElementById('paymentTenantSelect'),
    tenantBalancePreview: document.getElementById('tenantBalancePreview'),
    prevRent: document.getElementById('prevRent'),
    prevStatus: document.getElementById('prevStatus'),
    prevDetailText: document.getElementById('prevDetailText'),
    paymentAmount: document.getElementById('paymentAmount'),
    paymentDate: document.getElementById('paymentDate'),
    paymentForMonth: document.getElementById('paymentForMonth'),
    paymentType: document.getElementById('paymentType'),
    paymentNotes: document.getElementById('paymentNotes'),

    receiptModal: document.getElementById('receiptModal'),
    recPropName: document.getElementById('recPropName'),
    recOwnerInfo: document.getElementById('recOwnerInfo'),
    recNumber: document.getElementById('recNumber'),
    recTenantName: document.getElementById('recTenantName'),
    recRoomNo: document.getElementById('recRoomNo'),
    recDate: document.getElementById('recDate'),
    recMonth: document.getElementById('recMonth'),
    recMonthlyRent: document.getElementById('recMonthlyRent'),
    recDescription: document.getElementById('recDescription'),
    recType: document.getElementById('recType'),
    recAmount: document.getElementById('recAmount'),
    recTotalAmount: document.getElementById('recTotalAmount'),
    recBalanceStatus: document.getElementById('recBalanceStatus'),
    recAdvanceDetails: document.getElementById('recAdvanceDetails'),
    recFooterNote: document.getElementById('recFooterNote'),
    btnShareWhatsApp: document.getElementById('btnShareWhatsApp'),
    btnPrintReceipt: document.getElementById('btnPrintReceipt'),

    // Tenant Profile Dedicated Page Elements
    btnBackFromProfile: document.getElementById('btnBackFromProfile'),
    backButtonText: document.getElementById('backButtonText'),
    detailBtnMeterBill: document.getElementById('detailBtnMeterBill'),
    detailAvatarBig: document.getElementById('detailAvatarBig'),
    detailFullName: document.getElementById('detailFullName'),
    detailWaLink: document.getElementById('detailWaLink'),
    detailPhone: document.getElementById('detailPhone'),
    detailRoomNumber: document.getElementById('detailRoomNumber'),
    detailJoiningDate: document.getElementById('detailJoiningDate'),
    detailStatusBadgeWrap: document.getElementById('detailStatusBadgeWrap'),
    detailTotalExpected: document.getElementById('detailTotalExpected'),
    detailMonthsCount: document.getElementById('detailMonthsCount'),
    detailTotalPaid: document.getElementById('detailTotalPaid'),
    detailMonthlyRate: document.getElementById('detailMonthlyRate'),
    detailBalanceKpiCard: document.getElementById('detailBalanceKpiCard'),
    detailBalanceLabel: document.getElementById('detailBalanceLabel'),
    detailNetBalance: document.getElementById('detailNetBalance'),
    detailAdvanceMonthsDetail: document.getElementById('detailAdvanceMonthsDetail'),
    detailMeterReading: document.getElementById('detailMeterReading'),
    detailMeterSubText: document.getElementById('detailMeterSubText'),
    detailMeterKpiCard: document.getElementById('detailMeterKpiCard'),
    detailIdProof: document.getElementById('detailIdProof'),
    detailEmergencyPhone: document.getElementById('detailEmergencyPhone'),
    detailNotes: document.getElementById('detailNotes'),
    detailPaymentHistoryBody: document.getElementById('detailPaymentHistoryBody'),
    detailMeterHistoryBody: document.getElementById('detailMeterHistoryBody'),
    detailBtnAddMeterReading: document.getElementById('detailBtnAddMeterReading'),
    detailBtnRecordPay: document.getElementById('detailBtnRecordPay'),
    detailBtnShareHisaab: document.getElementById('detailBtnShareHisaab'),
    detailBtnEditProfile: document.getElementById('detailBtnEditProfile'),
    detailBtnDeleteTenant: document.getElementById('detailBtnDeleteTenant'),

    // Meter Calculator Modal Elements
    btnOpenMeterCalcModal: document.getElementById('btnOpenMeterCalcModal'),
    meterModal: document.getElementById('meterModal'),
    meterForm: document.getElementById('meterForm'),
    meterRoomSelect: document.getElementById('meterRoomSelect'),
    meterForMonth: document.getElementById('meterForMonth'),
    meterPrevReading: document.getElementById('meterPrevReading'),
    meterCurrentReading: document.getElementById('meterCurrentReading'),
    meterUnitRate: document.getElementById('meterUnitRate'),
    meterReadingDate: document.getElementById('meterReadingDate'),
    calcUnitsConsumed: document.getElementById('calcUnitsConsumed'),
    calcTotalBill: document.getElementById('calcTotalBill'),
    calcOccupantsCount: document.getElementById('calcOccupantsCount'),
    calcPerPersonShare: document.getElementById('calcPerPersonShare'),
    btnShareMeterWhatsApp: document.getElementById('btnShareMeterWhatsApp'),
    btnAddMeterToKiraya: document.getElementById('btnAddMeterToKiraya'),
    btnSaveMeterReading: document.getElementById('btnSaveMeterReading'),

    // Real Main Electricity Meter Dashboard & Modal Selectors
    dashRealMeterHeading: document.getElementById('dashRealMeterHeading'),
    dashRealMeterSub: document.getElementById('dashRealMeterSub'),
    dashRealMeterHistoryCount: document.getElementById('dashRealMeterHistoryCount'),
    btnOpenRealMeterHistoryModal: document.getElementById('btnOpenRealMeterHistoryModal'),
    btnOpenRecordRealMeterModal: document.getElementById('btnOpenRecordRealMeterModal'),
    dashRealMeterMonthLabel: document.getElementById('dashRealMeterMonthLabel'),
    dashRealMeterMonthAmount: document.getElementById('dashRealMeterMonthAmount'),
    dashRealMeterStatusBadge: document.getElementById('dashRealMeterStatusBadge'),
    dashRealMeterMonthUnits: document.getElementById('dashRealMeterMonthUnits'),
    dashRealMeterTenantCollected: document.getElementById('dashRealMeterTenantCollected'),
    dashRealMeterRecoveryPercent: document.getElementById('dashRealMeterRecoveryPercent'),
    dashRealMeterBalanceDiff: document.getElementById('dashRealMeterBalanceDiff'),
    dashRealMeterAllTimeAmount: document.getElementById('dashRealMeterAllTimeAmount'),
    dashRealMeterAllTimeCount: document.getElementById('dashRealMeterAllTimeCount'),

    // Real Meter Bill Modal
    realMeterBillModal: document.getElementById('realMeterBillModal'),
    realMeterBillModalTitle: document.getElementById('realMeterBillModalTitle'),
    realMeterBillForm: document.getElementById('realMeterBillForm'),
    realMeterEditId: document.getElementById('realMeterEditId'),
    realMeterForMonth: document.getElementById('realMeterForMonth'),
    realMeterAmount: document.getElementById('realMeterAmount'),
    realMeterUnits: document.getElementById('realMeterUnits'),
    realMeterBillNumber: document.getElementById('realMeterBillNumber'),
    realMeterBillDate: document.getElementById('realMeterBillDate'),
    realMeterDueDate: document.getElementById('realMeterDueDate'),
    realMeterPaidStatus: document.getElementById('realMeterPaidStatus'),
    realMeterPaymentMode: document.getElementById('realMeterPaymentMode'),
    realMeterPaymentModeGroup: document.getElementById('realMeterPaymentModeGroup'),
    realMeterPaidDateRow: document.getElementById('realMeterPaidDateRow'),
    realMeterPaidDate: document.getElementById('realMeterPaidDate'),
    realMeterNotes: document.getElementById('realMeterNotes'),

    // Real Meter History Modal
    realMeterHistoryModal: document.getElementById('realMeterHistoryModal'),
    modalRealMeterTotalBilled: document.getElementById('modalRealMeterTotalBilled'),
    modalRealMeterTotalCount: document.getElementById('modalRealMeterTotalCount'),
    modalRealMeterTenantCollected: document.getElementById('modalRealMeterTenantCollected'),
    modalRealMeterCoverRatio: document.getElementById('modalRealMeterCoverRatio'),
    modalRealMeterNetDiff: document.getElementById('modalRealMeterNetDiff'),
    modalRealMeterDiffLabel: document.getElementById('modalRealMeterDiffLabel'),
    realMeterHistSearch: document.getElementById('realMeterHistSearch'),
    realMeterHistYearFilter: document.getElementById('realMeterHistYearFilter'),
    btnExportRealMeterCSV: document.getElementById('btnExportRealMeterCSV'),
    btnModalAddRealMeter: document.getElementById('btnModalAddRealMeter'),
    realMeterHistoryTableBody: document.getElementById('realMeterHistoryTableBody'),
    btnShareRealMeterHistoryWhatsApp: document.getElementById('btnShareRealMeterHistoryWhatsApp'),

    toastContainer: document.getElementById('toastContainer')
  };

  let currentReceiptData = null;
  let currentDetailTenant = null;
  let activeTenantFilter = 'all';

  // ==========================================
  // 3. Helper Functions
  // ==========================================
  function getCurrentYearMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatCurrency(amount) {
    const val = Number(amount) || 0;
    return '₹' + val.toLocaleString('en-IN');
  }

  function formatMonthName(yearMonthStr) {
    if (!yearMonthStr) return '';
    const [year, month] = yearMonthStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }

  function formatDateDisplay(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ==========================================
  // 4. Data Persistence & State Loading
  // ==========================================
  function loadStoredData() {
    try {
      const storedTenants = localStorage.getItem(STORAGE_KEY_TENANTS);
      const storedRooms = localStorage.getItem(STORAGE_KEY_ROOMS);
      const storedPayments = localStorage.getItem(STORAGE_KEY_PAYMENTS);
      const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      const storedMeterHistory = localStorage.getItem(STORAGE_KEY_METER_HISTORY);
      const storedRealMeterBills = localStorage.getItem(STORAGE_KEY_REAL_METER_BILLS);
      const CLEAN_DATA_VERSION = 'rentflow_clean_v1';
      const isCleanDataLoaded = localStorage.getItem(CLEAN_DATA_VERSION);

      if (!isCleanDataLoaded) {
        importUserRealData();
        localStorage.setItem(CLEAN_DATA_VERSION, 'true');
      } else {
        if (storedTenants) AppState.tenants = JSON.parse(storedTenants);
        if (storedPayments) AppState.payments = JSON.parse(storedPayments);
        if (storedRealMeterBills) AppState.realMeterBills = JSON.parse(storedRealMeterBills);
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          if (parsed.ownerName && (parsed.ownerName.includes('Makan Malik') || parsed.ownerName.includes('Owner)'))) {
            parsed.ownerName = 'Property Owner';
          }
          if (parsed.receiptNote && (parsed.receiptNote.includes('Kiraya') || parsed.receiptNote.includes('tareekh'))) {
            parsed.receiptNote = 'Please pay monthly rent on time. Thank you!';
          }
          AppState.settings = { ...AppState.settings, ...parsed };
          saveData('settings');
        }
        if (storedMeterHistory) AppState.meterHistory = JSON.parse(storedMeterHistory);

        // Ensure 8 fixed rooms are always present
        if (storedRooms && Array.isArray(JSON.parse(storedRooms)) && JSON.parse(storedRooms).length === 8) {
          AppState.rooms = JSON.parse(storedRooms);
        } else {
          AppState.rooms = [
            { id: 'room_1', number: '1', defaultRent: 2000 },
            { id: 'room_2', number: '2', defaultRent: 2000 },
            { id: 'room_3', number: '3', defaultRent: 2000 },
            { id: 'room_4', number: '4', defaultRent: 2000 },
            { id: 'room_5', number: '5', defaultRent: 2000 },
            { id: 'room_6', number: '6', defaultRent: 2000 },
            { id: 'room_7', number: '7', defaultRent: 2000 },
            { id: 'room_8', number: '8', defaultRent: 2500 }
          ];
          saveData('rooms');
        }
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
      showToast('Data load karne me problem aayi', 'error');
    }
  }

  function importUserRealData() {
    AppState.rooms = [
      { id: 'room_1', number: '1', defaultRent: 2000 },
      { id: 'room_2', number: '2', defaultRent: 2000 },
      { id: 'room_3', number: '3', defaultRent: 2000 },
      { id: 'room_4', number: '4', defaultRent: 2000 },
      { id: 'room_5', number: '5', defaultRent: 2000 },
      { id: 'room_6', number: '6', defaultRent: 2000 },
      { id: 'room_7', number: '7', defaultRent: 2000 },
      { id: 'room_8', number: '8', defaultRent: 2500 }
    ];

    AppState.tenants = [];
    AppState.payments = [];
    AppState.meterHistory = [];
    AppState.realMeterBills = [];

    saveData();
  }

  function saveData(type) {
    try {
      if (!type || type === 'tenants') localStorage.setItem(STORAGE_KEY_TENANTS, JSON.stringify(AppState.tenants));
      if (!type || type === 'rooms') localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(AppState.rooms));
      if (!type || type === 'payments') localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(AppState.payments));
      if (!type || type === 'meter') localStorage.setItem(STORAGE_KEY_METER_HISTORY, JSON.stringify(AppState.meterHistory));
      if (!type || type === 'realMeterBills') localStorage.setItem(STORAGE_KEY_REAL_METER_BILLS, JSON.stringify(AppState.realMeterBills));
      if (!type || type === 'settings') localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(AppState.settings));

      // Real-time Cloud Auto-Sync
      if (typeof FirebaseManager !== 'undefined' && FirebaseManager.isInitialized) {
        FirebaseManager.pushToCloud(true);
      }
    } catch (err) {
      console.error('Error saving data:', err);
      showToast('Data save karte waqt error aaya', 'error');
    }
  }

  // ==========================================
  // 5. Tenant Calculation & Rent Financial Math (Date-to-Date 30 Days Cycle)
  // ==========================================
  /**
   * Calculates financial health for a tenant up to a specific date/month
   * Follows Date-to-Date (29-30 days / Joining Date to Next Month Date) cycle:
   * E.g. Joined 20 Jul 2026 -> 1st month completes on 20 Aug 2026
   */
  function calculateTenantFinancials(tenant, targetMonth = AppState.selectedMonth) {
    const monthlyRent = Number(tenant.monthlyRent) || 0;
    const initialAdvance = Number(tenant.initialAdvance) || 0;

    if (!tenant.joiningDate || monthlyRent <= 0) {
      return {
        netBalance: 0,
        advanceMonths: 0,
        advanceRemaining: 0,
        pendingDue: 0,
        isAdvance: false,
        isDue: false,
        isClear: true,
        totalRentPaid: 0,
        totalExpectedRent: 0,
        monthsActive: 0,
        nextDueDate: '-',
        currentCycleLabel: '-'
      };
    }

    const [jYear, jMonth, jDay] = tenant.joiningDate.split('-').map(Number);
    const joinDate = new Date(jYear, jMonth - 1, jDay || 1);

    // Target evaluation date:
    const [tYear, tMonth] = targetMonth.split('-').map(Number);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === tYear && (today.getMonth() + 1) === tMonth;

    let evalDate;
    if (isCurrentMonth) {
      evalDate = today;
    } else {
      // Evaluate at the end of selected target month
      evalDate = new Date(tYear, tMonth, 0, 23, 59, 59);
    }

    let monthsActive = 0;
    let nextDueDateStr = '-';
    let currentCycleLabel = '-';

    if (evalDate < joinDate) {
      monthsActive = 0;
      nextDueDateStr = formatDateDisplay(tenant.joiningDate);
      currentCycleLabel = `Joining on ${formatDateDisplay(tenant.joiningDate)}`;
    } else {
      // Date-to-Date (29-30 days / joining day to next month joining day cycle)
      // Cycle 1: starts on joinDate (e.g. 20 Jul 2026 to 19 Aug 2026). Expected rent = 1 month.
      // Cycle 2: starts on nextCycleDate (20 Aug 2026 to 19 Sep 2026). Expected rent = 2 months.
      let cycles = 1;
      let nextCycleDate = new Date(jYear, jMonth - 1 + cycles, jDay || 1);

      while (evalDate >= nextCycleDate) {
        cycles++;
        nextCycleDate = new Date(jYear, jMonth - 1 + cycles, jDay || 1);
      }

      monthsActive = cycles;

      const prevCycleStart = new Date(jYear, jMonth - 1 + cycles - 1, jDay || 1);
      const prevCycleEnd = new Date(jYear, jMonth - 1 + cycles, (jDay || 1) - 1);
      
      const nextDueY = nextCycleDate.getFullYear();
      const nextDueM = String(nextCycleDate.getMonth() + 1).padStart(2, '0');
      const nextDueD = String(nextCycleDate.getDate()).padStart(2, '0');
      nextDueDateStr = formatDateDisplay(`${nextDueY}-${nextDueM}-${nextDueD}`);

      const startDStr = `${prevCycleStart.getFullYear()}-${String(prevCycleStart.getMonth() + 1).padStart(2, '0')}-${String(prevCycleStart.getDate()).padStart(2, '0')}`;
      const endDStr = `${prevCycleEnd.getFullYear()}-${String(prevCycleEnd.getMonth() + 1).padStart(2, '0')}-${String(prevCycleEnd.getDate()).padStart(2, '0')}`;
      currentCycleLabel = `${formatDateDisplay(startDStr)} se ${formatDateDisplay(endDStr)}`;
    }

    const totalExpectedRent = monthsActive * monthlyRent;

    // Sum all active payments made by this tenant
    const tenantPayments = AppState.payments.filter(p => p.tenantId === tenant.id && !p.isDeleted);
    const rentPaymentsSum = tenantPayments
      .filter(p => p.type === 'Rent' || p.type === 'Advance')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const totalPaidForRent = rentPaymentsSum + initialAdvance;
    const netBalance = totalPaidForRent - totalExpectedRent;

    let advanceMonths = 0;
    let advanceRemaining = 0;
    let pendingDue = 0;
    let isAdvance = false;
    let isDue = false;
    let isClear = false;

    if (netBalance > 0) {
      isAdvance = true;
      advanceMonths = Math.floor(netBalance / monthlyRent);
      advanceRemaining = netBalance % monthlyRent;
    } else if (netBalance < 0) {
      isDue = true;
      pendingDue = Math.abs(netBalance);
    } else {
      isClear = true;
    }

    return {
      netBalance,
      advanceMonths,
      advanceRemaining,
      pendingDue,
      isAdvance,
      isDue,
      isClear,
      totalRentPaid: totalPaidForRent,
      totalExpectedRent,
      monthsActive,
      nextDueDate: nextDueDateStr,
      currentCycleLabel
    };
  }

  /**
   * Calculates comprehensive room-centric metrics & financial summary
   */
  function calculateRoomFinancials(room, targetMonth = AppState.selectedMonth) {
    const roomNum = String(room.number || '').replace(/[^0-9]/g, '');
    const occupants = AppState.tenants.filter(t => {
      const tRoom = String(t.roomNumber || t.roomId || '').replace(/[^0-9]/g, '');
      return (tRoom === roomNum || t.roomId === room.id) && t.status === 'active';
    });
    const allOccupants = AppState.tenants.filter(t => {
      const tRoom = String(t.roomNumber || t.roomId || '').replace(/[^0-9]/g, '');
      return (tRoom === roomNum || t.roomId === room.id);
    });
    const allOccupantIds = allOccupants.map(t => t.id);

    // Sum all payments for this room
    const roomPayments = AppState.payments.filter(p => {
      const pRoom = String(p.roomNumber || '').replace(/[^0-9]/g, '');
      return (pRoom === roomNum || (p.tenantId && allOccupantIds.includes(p.tenantId))) && !p.isDeleted;
    });

    const totalCollected = roomPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Month specific collection
    const monthCollected = roomPayments
      .filter(p => p.forMonth === targetMonth)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Expected rent for active tenants in this room
    let totalExpectedRent = 0;
    let totalNetBalance = 0;
    let totalPendingDue = 0;
    let totalAdvance = 0;

    occupants.forEach(t => {
      const fin = calculateTenantFinancials(t, targetMonth);
      totalExpectedRent += fin.totalExpectedRent;
      totalNetBalance += fin.netBalance;
      if (fin.isDue) totalPendingDue += fin.pendingDue;
      if (fin.isAdvance) totalAdvance += fin.netBalance;
    });

    // Electricity Meter history for this room
    const meterReadings = AppState.meterHistory.filter(m => {
      const mRoom = String(m.roomNumber || m.roomId || '').replace(/[^0-9]/g, '');
      return (mRoom === roomNum || m.roomId === room.id) && !m.isDeleted;
    });

    const totalMeterBills = meterReadings.reduce((sum, m) => sum + (Number(m.totalBill) || 0), 0);
    const latestMeter = meterReadings.length > 0 ? meterReadings[0] : null;

    let status = 'clear';
    if (totalPendingDue > 0) status = 'due';
    else if (totalAdvance > 0) status = 'advance';

    return {
      occupants,
      allOccupants,
      roomPayments,
      totalCollected,
      monthCollected,
      totalExpectedRent,
      totalNetBalance,
      totalPendingDue,
      totalAdvance,
      status,
      meterReadings,
      totalMeterBills,
      latestMeter
    };
  }

  // ==========================================
  // 6. UI Render Functions
  // ==========================================

  function renderAll() {
    renderMonthDropdowns();
    renderBrandAndSettings();
    renderDashboard();
    renderTenantsList();
    renderRoomsList();
    renderPaymentsList();
    renderReports();
    updateNavigationCounts();
  }

  function renderBrandAndSettings() {
    if (DOM.brandPropertyName) DOM.brandPropertyName.textContent = AppState.settings.propertyName || 'RentFlow Pro';
    if (DOM.settingPropName) DOM.settingPropName.value = AppState.settings.propertyName || '';
    if (DOM.settingOwnerName) DOM.settingOwnerName.value = AppState.settings.ownerName || '';
    if (DOM.settingOwnerPhone) DOM.settingOwnerPhone.value = AppState.settings.ownerPhone || '';
    if (DOM.settingDefaultUnitRate) DOM.settingDefaultUnitRate.value = AppState.settings.defaultUnitRate || 8;
    if (DOM.settingOwnerUpi) DOM.settingOwnerUpi.value = AppState.settings.ownerUpi || '';
    if (DOM.settingReceiptNote) DOM.settingReceiptNote.value = AppState.settings.receiptNote || '';

    // Populate clear room dropdown in settings
    const clearRoomSelect = document.getElementById('settingClearRoomSelect');
    if (clearRoomSelect) {
      clearRoomSelect.innerHTML = '<option value="all_rooms">🧹 Clear All 8 Rooms Data</option>' + AppState.rooms.map(r => `
        <option value="${r.id}">Clear Room ${r.number} Data</option>
      `).join('');
    }
  }

  function renderMonthDropdowns() {
    const months = [];
    const now = new Date();
    // 6 months past, current, and 5 months future
    for (let i = -6; i <= 5; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        value: ym,
        label: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      });
    }

    // Global Month Filter
    DOM.globalMonthFilter.innerHTML = months.map(m => `
      <option value="${m.value}" ${m.value === AppState.selectedMonth ? 'selected' : ''}>
        ${m.label}
      </option>
    `).join('');

    // Payment Month Filter in payments tab
    DOM.paymentMonthFilter.innerHTML = `<option value="all">All Months</option>` + months.map(m => `
      <option value="${m.value}">${m.label}</option>
    `).join('');
  }

  function updateNavigationCounts() {
    const activeTenants = AppState.tenants.filter(t => t.status === 'active').length;
    DOM.navTenantCount.textContent = activeTenants;
    DOM.navRoomCount.textContent = AppState.rooms.length;
  }

  // ---------- DASHBOARD RENDERING ----------
  function renderDashboard() {
    const activeTenants = AppState.tenants.filter(t => t.status === 'active');
    const totalRooms = AppState.rooms.length || 8;

    // 1. Total Tenants & Occupancy
    DOM.dashTotalTenants.textContent = activeTenants.length;
    DOM.dashRoomOccupancy.textContent = `${activeTenants.length} Occupants / ${totalRooms} Rooms`;
    const occupancyPercent = totalRooms > 0 ? Math.min(100, Math.round((activeTenants.length / totalRooms) * 100)) : 0;
    DOM.occupancyProgressBar.style.width = `${occupancyPercent}%`;

    // 2. Expected vs Collected Rent for current month
    const expectedRent = activeTenants.reduce((sum, t) => sum + (Number(t.monthlyRent) || 0), 0);
    
    // Payments received for selected month (Active only)
    const monthPayments = AppState.payments.filter(p => p.forMonth === AppState.selectedMonth && !p.isDeleted);
    const collectedRent = monthPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    DOM.dashRentCollected.textContent = formatCurrency(collectedRent);
    DOM.dashExpectedRent.textContent = `Target: ${formatCurrency(expectedRent)}`;
    const collectionPercent = expectedRent > 0 ? Math.min(100, Math.round((collectedRent / expectedRent) * 100)) : (collectedRent > 0 ? 100 : 0);
    DOM.collectionProgressBar.style.width = `${collectionPercent}%`;

    // 3. Advance Totals & Pending Dues calculation
    let totalAdvance = 0;
    let advanceTenantsCount = 0;
    let totalPending = 0;
    let pendingTenantsCount = 0;
    const dueTenantsList = [];

    activeTenants.forEach(t => {
      const fin = calculateTenantFinancials(t, AppState.selectedMonth);
      if (fin.isAdvance) {
        totalAdvance += fin.netBalance;
        advanceTenantsCount++;
      } else if (fin.isDue) {
        totalPending += fin.pendingDue;
        pendingTenantsCount++;
        dueTenantsList.push({ tenant: t, due: fin.pendingDue });
      }
    });

    DOM.dashTotalAdvance.textContent = formatCurrency(totalAdvance);
    DOM.dashAdvanceTenantsCount.textContent = `${advanceTenantsCount} Tenants in advance`;

    DOM.dashTotalPending.textContent = formatCurrency(totalPending);
    DOM.dashPendingTenantsCount.textContent = `${pendingTenantsCount} Tenants with dues`;

    // Alert Banner
    if (pendingTenantsCount > 0) {
      DOM.dueAlertBanner.style.display = 'flex';
      DOM.dueAlertText.textContent = `${pendingTenantsCount} tenant(s) have total pending dues of ${formatCurrency(totalPending)}.`;
    } else {
      DOM.dueAlertBanner.style.display = 'none';
    }

    // 4. Render Real Main Electricity Meter Bill on Dashboard
    renderDashboardRealMeter();

    // 5. Render Recent Payments List on Dashboard
    renderDashboardRecentPayments();

    // 6. Render Tenant Breakdown Table on Dashboard
    renderDashboardTenantTable();

    // 7. Update Chart
    renderIncomeChart();
  }

  function renderDashboardRecentPayments() {
    const recent = [...AppState.payments].sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp)).slice(0, 5);
    if (recent.length === 0) {
      DOM.dashRecentPaymentsList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-dim);">
          <i class="fa-solid fa-receipt" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.5;"></i>
          <p>No payments recorded yet.</p>
        </div>
      `;
      return;
    }

    DOM.dashRecentPaymentsList.innerHTML = recent.map(p => `
      <div class="payment-row-item">
        <div class="pay-user-info">
          <div class="user-avatar-sm">${(p.tenantName || 'T').charAt(0).toUpperCase()}</div>
          <div class="pay-meta">
            <strong>${escapeHTML(p.tenantName)} <span class="text-muted">(Rm ${escapeHTML(p.roomNumber)})</span></strong>
            <span>${formatDateDisplay(p.date)} &bull; ${formatMonthName(p.forMonth)}</span>
          </div>
        </div>
        <div class="pay-amount-side">
          <div class="amount">+${formatCurrency(p.amount)}</div>
          <span class="badge badge-info">${escapeHTML(p.type || 'Rent')}</span>
        </div>
      </div>
    `).join('');
  }

  function renderDashboardTenantTable() {
    const query = (DOM.dashTenantSearch ? DOM.dashTenantSearch.value : '').toLowerCase().trim();
    const activeTenants = AppState.tenants.filter(t => t.status === 'active');
    const filtered = activeTenants.filter(t => 
      t.name.toLowerCase().includes(query) || 
      (t.roomNumber && t.roomNumber.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
      DOM.dashTenantTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-dim);">
            No active tenants found.
          </td>
        </tr>
      `;
      return;
    }

    DOM.dashTenantTableBody.innerHTML = filtered.map(t => {
      const fin = calculateTenantFinancials(t, AppState.selectedMonth);
      
      // Payments this specific month (Active only)
      const thisMonthPaid = AppState.payments
        .filter(p => p.tenantId === t.id && p.forMonth === AppState.selectedMonth && !p.isDeleted)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      let statusBadge = '';
      let balanceDisplay = '';

      if (fin.isAdvance) {
        statusBadge = `<span class="badge badge-purple"><i class="fa-solid fa-forward"></i> ${fin.advanceMonths} Mo Adv</span>`;
        balanceDisplay = `<strong class="text-purple">+${formatCurrency(fin.netBalance)}</strong>`;
      } else if (fin.isDue) {
        statusBadge = `<span class="badge badge-danger"><i class="fa-solid fa-clock"></i> Overdue</span>`;
        balanceDisplay = `<strong class="text-red">-${formatCurrency(fin.pendingDue)}</strong>`;
      } else {
        statusBadge = `<span class="badge badge-success"><i class="fa-solid fa-check"></i> Paid</span>`;
        balanceDisplay = `<span class="text-green">₹0 (Clear)</span>`;
      }

      return `
        <tr>
          <td>
            <strong>${escapeHTML(t.name)}</strong>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${escapeHTML(t.phone)}</div>
          </td>
          <td><span class="badge badge-info">Room ${escapeHTML(t.roomNumber || '-')}</span></td>
          <td>${formatCurrency(t.monthlyRent)}</td>
          <td><strong class="text-green">${formatCurrency(thisMonthPaid)}</strong></td>
          <td>${statusBadge}</td>
          <td>${balanceDisplay}</td>
          <td>
            <button class="btn btn-xs btn-primary btn-record-pay-for" data-id="${t.id}">
              <i class="fa-solid fa-plus"></i> Pay
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // ---------- CHART.JS TRENDS ----------
  function renderIncomeChart() {
    if (!DOM.rentTrendsChart) return;
    
    // Calculate last 6 months data
    const labels = [];
    const dataValues = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { month: 'short' });
      labels.push(label);

      const totalForMonth = AppState.payments
        .filter(p => p.forMonth === ym)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      dataValues.push(totalForMonth);
    }

    if (DOM.chartYearTag) DOM.chartYearTag.textContent = now.getFullYear();

    if (AppState.chartInstance) {
      AppState.chartInstance.destroy();
    }

    const ctx = DOM.rentTrendsChart.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.45)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    AppState.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Kiraya Collection (₹)',
          data: dataValues,
          borderColor: '#3B82F6',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#6366F1',
          pointBorderColor: '#fff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Kiraya: ₹${Number(ctx.raw).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#9CA3AF',
              callback: (val) => '₹' + val.toLocaleString('en-IN')
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' }
          }
        }
      }
    });
  }

  // ---------- TENANTS (BANDE) TAB ----------
  function renderTenantsList() {
    const query = (DOM.tenantSearchInput ? DOM.tenantSearchInput.value : '').toLowerCase().trim();

    // Counts for filter pills
    let countAll = AppState.tenants.length;
    let countActive = 0;
    let countPending = 0;
    let countAdvance = 0;
    let countVacated = 0;

    AppState.tenants.forEach(t => {
      if (t.status === 'vacated') {
        countVacated++;
      } else {
        countActive++;
        const fin = calculateTenantFinancials(t, AppState.selectedMonth);
        if (fin.isDue) countPending++;
        if (fin.isAdvance) countAdvance++;
      }
    });

    if (DOM.countFilterAll) DOM.countFilterAll.textContent = countAll;
    if (DOM.countFilterActive) DOM.countFilterActive.textContent = countActive;
    if (DOM.countFilterPending) DOM.countFilterPending.textContent = countPending;
    if (DOM.countFilterAdvance) DOM.countFilterAdvance.textContent = countAdvance;
    if (DOM.countFilterVacated) DOM.countFilterVacated.textContent = countVacated;

    // Filter logic
    const filtered = AppState.tenants.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(query) ||
        (t.phone && t.phone.toLowerCase().includes(query)) ||
        (t.roomNumber && t.roomNumber.toLowerCase().includes(query));

      if (!matchSearch) return false;

      if (activeTenantFilter === 'active') return t.status === 'active';
      if (activeTenantFilter === 'vacated') return t.status === 'vacated';
      if (activeTenantFilter === 'pending') {
        if (t.status !== 'active') return false;
        const fin = calculateTenantFinancials(t, AppState.selectedMonth);
        return fin.isDue;
      }
      if (activeTenantFilter === 'advance') {
        if (t.status !== 'active') return false;
        const fin = calculateTenantFinancials(t, AppState.selectedMonth);
        return fin.isAdvance;
      }
      return true; // 'all'
    });

    if (filtered.length === 0) {
      DOM.tenantsCardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-user-xmark" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 12px;"></i>
          <h3>No tenants found</h3>
          <p class="text-muted" style="margin-top: 4px;">Try a different search query or add a new tenant.</p>
          <button class="btn btn-primary mt-3" id="btnEmptyAddTenant">
            <i class="fa-solid fa-user-plus"></i> Add First Tenant
          </button>
        </div>
      `;
      const btnEmpty = document.getElementById('btnEmptyAddTenant');
      if (btnEmpty) btnEmpty.addEventListener('click', openAddTenantModal);
      return;
    }

    DOM.tenantsCardsGrid.innerHTML = filtered.map(t => {
      const fin = calculateTenantFinancials(t, AppState.selectedMonth);
      let advanceBannerHTML = '';

      if (t.status === 'vacated') {
        advanceBannerHTML = `
          <div class="tenant-advance-banner" style="background: rgba(107, 114, 128, 0.2); color: #9CA3AF;">
            <span><i class="fa-solid fa-door-closed"></i> Vacated (Moved Out)</span>
          </div>
        `;
      } else if (fin.isAdvance) {
        advanceBannerHTML = `
          <div class="tenant-advance-banner advance-mode">
            <span><i class="fa-solid fa-forward"></i> Advance: <strong>${fin.advanceMonths} Mo + ₹${fin.advanceRemaining}</strong></span>
            <strong>+${formatCurrency(fin.netBalance)}</strong>
          </div>
        `;
      } else if (fin.isDue) {
        advanceBannerHTML = `
          <div class="tenant-advance-banner due-mode">
            <span><i class="fa-solid fa-clock"></i> Rent Due (Overdue)</span>
            <strong>-${formatCurrency(fin.pendingDue)}</strong>
          </div>
        `;
      } else {
        advanceBannerHTML = `
          <div class="tenant-advance-banner clear-mode">
            <span><i class="fa-solid fa-check"></i> All Dues Clear</span>
            <strong>₹0 Due</strong>
          </div>
        `;
      }

      const room = AppState.rooms.find(r => r.id === t.roomId);
      const meterVal = room && room.meterReading ? room.meterReading : '-';

      return `
        <div class="tenant-card clickable-occupant" data-tenant-id="${t.id}" title="Click to view statement & profile of ${escapeHTML(t.name)}">
          <div class="tenant-card-header">
            <div class="tenant-main-profile">
              <div class="tenant-avatar">${t.name.charAt(0).toUpperCase()}</div>
              <div class="tenant-names">
                <h4>${escapeHTML(t.name)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; opacity: 0.6;"></i></h4>
                <span style="color: #25D366;"><i class="fa-brands fa-whatsapp"></i> ${escapeHTML(t.phone)}</span>
              </div>
            </div>
            <span class="badge ${t.status === 'active' ? 'badge-success' : 'badge-danger'}">
              ${t.status === 'active' ? 'Active' : 'Vacated'}
            </span>
          </div>

          <div class="tenant-stat-box">
            <div class="tenant-stat-col">
              <span>Room Number</span>
              <strong>Room ${escapeHTML(t.roomNumber || '-')}</strong>
            </div>
            <div class="tenant-stat-col">
              <span>Monthly Rent</span>
              <strong class="text-primary">${formatCurrency(t.monthlyRent)}</strong>
            </div>
            <div class="tenant-stat-col">
              <span>Joining Date</span>
              <strong>${formatDateDisplay(t.joiningDate)}</strong>
            </div>
            <div class="tenant-stat-col">
              <span>Meter Reading</span>
              <strong class="text-amber"><i class="fa-solid fa-bolt"></i> ${escapeHTML(meterVal)} Units</strong>
            </div>
          </div>

          <div>
            ${advanceBannerHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  // ---------- ROOMS TAB ----------
  function renderRoomsList() {
    if (AppState.rooms.length === 0) {
      DOM.roomsCardsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-lg);">
          <i class="fa-solid fa-door-open" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 12px;"></i>
          <h3>No rooms found</h3>
        </div>
      `;
      return;
    }

    DOM.roomsCardsGrid.innerHTML = AppState.rooms.map(room => {
      const fin = calculateRoomFinancials(room, AppState.selectedMonth);
      const occupants = fin.occupants;

      // Render occupants inside this room
      let occupantsHTML = '';
      if (occupants.length > 0) {
        occupantsHTML = occupants.map(tenant => {
          const tFin = calculateTenantFinancials(tenant, AppState.selectedMonth);
          let statusBadge = '';
          if (tFin.isAdvance) {
            statusBadge = `<span class="badge badge-purple" style="font-size: 0.72rem;"><i class="fa-solid fa-forward"></i> ${tFin.advanceMonths} Mo Adv (+${formatCurrency(tFin.netBalance)})</span>`;
          } else if (tFin.isDue) {
            statusBadge = `<span class="badge badge-danger" style="font-size: 0.72rem;"><i class="fa-solid fa-clock"></i> Due: -${formatCurrency(tFin.pendingDue)}</span>`;
          } else {
            statusBadge = `<span class="badge badge-success" style="font-size: 0.72rem;"><i class="fa-solid fa-check"></i> Paid</span>`;
          }

          return `
            <div class="room-occupant-card clickable-occupant" data-tenant-id="${tenant.id}" title="Click to view statement & profile of ${escapeHTML(tenant.name)}">
              <div class="occupant-main">
                <div class="occupant-info">
                  <div class="occupant-avatar">${tenant.name.charAt(0).toUpperCase()}</div>
                  <div class="occupant-details">
                    <strong>${escapeHTML(tenant.name)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem; opacity: 0.6;"></i></strong>
                    <span style="font-size: 0.78rem; color: #25D366;"><i class="fa-brands fa-whatsapp"></i> ${escapeHTML(tenant.phone)}</span>
                  </div>
                </div>
                ${statusBadge}
              </div>

              <div class="occupant-stats">
                <span>Rent: <strong class="text-primary">${formatCurrency(tenant.monthlyRent)}</strong>/mo</span>
                <span>Joining: <strong>${formatDateDisplay(tenant.joiningDate)}</strong></span>
              </div>
            </div>
          `;
        }).join('');
      } else {
        occupantsHTML = `
          <div class="room-empty-state">
            <i class="fa-solid fa-user-plus" style="font-size: 1.5rem; margin-bottom: 6px; opacity: 0.5;"></i>
            <p>This room is currently vacant.</p>
          </div>
        `;
      }

      // Add tenant button
      const addSeatBtnHTML = `
        <button class="room-add-seat-btn btn-add-tenant-to-room" data-room-id="${room.id}">
          <i class="fa-solid fa-user-plus"></i> + Add Tenant to Room ${escapeHTML(room.number)}
        </button>
      `;

      // Status pill for room
      let roomFinPill = '';
      if (fin.status === 'due') {
        roomFinPill = `<span class="badge badge-danger" style="font-size: 0.75rem;"><i class="fa-solid fa-clock"></i> Due: -${formatCurrency(fin.totalPendingDue)}</span>`;
      } else if (fin.status === 'advance') {
        roomFinPill = `<span class="badge badge-purple" style="font-size: 0.75rem;"><i class="fa-solid fa-forward"></i> Adv: +${formatCurrency(fin.totalAdvance)}</span>`;
      } else {
        roomFinPill = `<span class="badge badge-success" style="font-size: 0.75rem;"><i class="fa-solid fa-check"></i> Paid</span>`;
      }

      return `
        <div class="room-card">
          <div class="room-card-top">
            <div class="room-num-badge">
              <div class="room-icon-box">
                <i class="fa-solid fa-door-open"></i>
              </div>
              <div class="room-title-area">
                <h4>Room ${escapeHTML(room.number)}</h4>
                <div class="room-meta-pills">
                  <span><i class="fa-solid fa-tag"></i> Rent: <strong class="text-primary">${formatCurrency(room.defaultRent || 0)}</strong></span>
                  ${room.meterReading ? `<span>&bull; Meter: <strong>${escapeHTML(room.meterReading)}</strong> U</span>` : ''}
                </div>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
              <span class="badge ${occupants.length > 0 ? 'badge-success' : 'badge-secondary'}">
                ${occupants.length > 0 ? `${occupants.length} Occupant(s)` : 'Vacant'}
              </span>
              ${roomFinPill}
            </div>
          </div>

          <div class="room-tenants-section">
            <div class="room-tenants-section-header">
              <span><i class="fa-solid fa-users"></i> Room Occupants (${occupants.length}):</span>
            </div>
            ${occupantsHTML}
            ${addSeatBtnHTML}
          </div>

          <div class="room-actions" style="justify-content: flex-end;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-xs btn-amber btn-room-meter" data-room-id="${room.id}" title="⚡ Electricity Meter & Bill Calculator">
                <i class="fa-solid fa-bolt"></i> ⚡ Meter
              </button>
              <button class="btn btn-xs btn-outline btn-edit-room" data-id="${room.id}" title="Edit Room Details">
                <i class="fa-solid fa-pen"></i> Edit
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ---------- PAYMENTS & RENT TAB ----------
  function renderPaymentsList() {
    const query = (DOM.paymentSearchInput ? DOM.paymentSearchInput.value : '').toLowerCase().trim();
    const monthFilter = DOM.paymentMonthFilter ? DOM.paymentMonthFilter.value : 'all';

    // Active non-deleted payments only
    const activePayments = AppState.payments.filter(p => !p.isDeleted);

    const filtered = activePayments.filter(p => {
      const matchQuery = (p.receiptNo && p.receiptNo.toLowerCase().includes(query)) ||
        (p.tenantName && p.tenantName.toLowerCase().includes(query)) ||
        (p.roomNumber && p.roomNumber.toLowerCase().includes(query)) ||
        (p.notes && p.notes.toLowerCase().includes(query));

      if (!matchQuery) return false;
      if (monthFilter !== 'all' && p.forMonth !== monthFilter) return false;

      return true;
    }).sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));

    // Calculate sum of filtered
    const totalAmount = filtered.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    DOM.filteredTotalPaymentAmount.textContent = formatCurrency(totalAmount);
    DOM.filteredPaymentCount.textContent = filtered.length;

    if (filtered.length === 0) {
      DOM.paymentsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 32px; color: var(--text-dim);">
            No payment records found.
          </td>
        </tr>
      `;
      return;
    }

    DOM.paymentsTableBody.innerHTML = filtered.map(p => `
      <tr>
        <td><strong class="text-primary">${escapeHTML(p.receiptNo || '-')}</strong></td>
        <td>${formatDateDisplay(p.date)}</td>
        <td><strong>${escapeHTML(p.tenantName)}</strong></td>
        <td><span class="badge badge-info">Rm ${escapeHTML(p.roomNumber || '-')}</span></td>
        <td>${formatMonthName(p.forMonth)}</td>
        <td><strong class="text-green">${formatCurrency(p.amount)}</strong></td>
        <td>
          <span class="badge badge-purple" style="font-size: 0.72rem;">${escapeHTML(p.type || 'Rent')}</span>
          ${p.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${escapeHTML(p.notes)}</div>` : ''}
        </td>
        <td>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn btn-xs btn-outline btn-view-receipt" data-id="${p.id}" title="View & Print Receipt">
              <i class="fa-solid fa-receipt"></i> Receipt
            </button>
            <button class="btn btn-xs btn-outline btn-edit-payment" data-id="${p.id}" title="Edit Payment Record">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="btn btn-xs btn-outline text-red btn-delete-payment" data-id="${p.id}" title="Delete Entry">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ---------- MONTHLY REPORTS TAB ----------
  function renderReports() {
    const selectedYear = Number(DOM.reportYearFilter.value) || new Date().getFullYear();
    if (DOM.reportTableHeading) DOM.reportTableHeading.textContent = `${selectedYear} Month-Wise Rent Collection Report`;

    let totalYearCollected = 0;
    let totalYearExpected = 0;

    const rows = [];
    for (let m = 1; m <= 12; m++) {
      const ym = `${selectedYear}-${String(m).padStart(2, '0')}`;
      const monthName = new Date(selectedYear, m - 1, 1).toLocaleDateString('en-IN', { month: 'long' });

      // Active tenants in that month
      const activeTenants = AppState.tenants.filter(t => {
        if (!t.joiningDate) return false;
        const [jY, jM] = t.joiningDate.split('-').map(Number);
        const joinIdx = jY * 12 + jM;
        const currentIdx = selectedYear * 12 + m;
        return currentIdx >= joinIdx;
      });

      const expected = activeTenants.reduce((sum, t) => sum + (Number(t.monthlyRent) || 0), 0);
      const collected = AppState.payments
        .filter(p => p.forMonth === ym && !p.isDeleted)
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      totalYearCollected += collected;
      totalYearExpected += expected;

      const recoveryRate = expected > 0 ? Math.min(100, Math.round((collected / expected) * 100)) : (collected > 0 ? 100 : 0);

      // Pending and advance for that month snapshot
      let monthPending = Math.max(0, expected - collected);
      let monthAdvance = Math.max(0, collected - expected);

      rows.push(`
        <tr>
          <td><strong>${monthName}</strong></td>
          <td>${activeTenants.length}</td>
          <td>${formatCurrency(expected)}</td>
          <td><strong class="text-green">${formatCurrency(collected)}</strong></td>
          <td><span class="${monthPending > 0 ? 'text-red font-bold' : 'text-muted'}">${formatCurrency(monthPending)}</span></td>
          <td><span class="${monthAdvance > 0 ? 'text-purple font-bold' : 'text-muted'}">${formatCurrency(monthAdvance)}</span></td>
          <td>
            <span class="badge ${recoveryRate >= 90 ? 'badge-success' : recoveryRate >= 50 ? 'badge-warning' : 'badge-danger'}">
              ${recoveryRate}%
            </span>
          </td>
        </tr>
      `);
    }

    DOM.monthlyReportTableBody.innerHTML = rows.join('');

    // Summary cards at top of report
    DOM.reportsSummaryCards.innerHTML = `
      <div class="stat-card stat-card-green">
        <span class="stat-label">Total Collected in ${selectedYear}</span>
        <h3 class="stat-value text-green">${formatCurrency(totalYearCollected)}</h3>
      </div>
      <div class="stat-card stat-card-blue">
        <span class="stat-label">Total Expected in ${selectedYear}</span>
        <h3 class="stat-value">${formatCurrency(totalYearExpected)}</h3>
      </div>
      <div class="stat-card stat-card-purple">
        <span class="stat-label">Overall Annual Recovery</span>
        <h3 class="stat-value text-purple">${totalYearExpected > 0 ? Math.round((totalYearCollected / totalYearExpected) * 100) : 0}%</h3>
      </div>
    `;
  }

  // ==========================================
  // 7. Modal Handlers & Forms
  // ==========================================

  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('active');
  }

  function populateRoomSelectDropdown(selectedRoomId = '') {
    DOM.tenantRoomSelect.innerHTML = AppState.rooms.map(r => `
      <option value="${r.id}" ${r.id === selectedRoomId ? 'selected' : ''}>
        Room ${r.number} (Rent: ₹${r.defaultRent || 0})
      </option>
    `).join('');
  }

  function populateTenantSelectDropdown(selectedTenantId = '') {
    const activeTenants = AppState.tenants.filter(t => t.status === 'active');
    DOM.paymentTenantSelect.innerHTML = `<option value="">-- Choose Tenant --</option>` + activeTenants.map(t => `
      <option value="${t.id}" ${t.id === selectedTenantId ? 'selected' : ''}>
        ${t.name} (Room ${t.roomNumber} - Rent ₹${t.monthlyRent})
      </option>
    `).join('');
  }

  // Open Add Tenant (Strictly inside a room)
  function openAddTenantModal(preselectedRoomId = '') {
    if (!preselectedRoomId) {
      switchTab('rooms');
      showToast('Please click "+ Add Tenant to Room" inside the specific room.', 'info');
      return;
    }

    const room = AppState.rooms.find(r => r.id === preselectedRoomId);
    if (!room) return;

    DOM.tenantForm.reset();
    DOM.tenantId.value = '';
    DOM.tenantModalTitle.innerHTML = `<i class="fa-solid fa-user-plus text-accent"></i> Add Tenant to Room ${escapeHTML(room.number)}`;
    DOM.tenantJoiningDate.value = getTodayDate();
    populateRoomSelectDropdown(preselectedRoomId);
    DOM.tenantRentAmount.value = room.defaultRent || '';

    openModal(DOM.tenantModal);
  }

  // Open Edit Tenant
  function openEditTenantModal(tenantId) {
    const tenant = AppState.tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    DOM.tenantId.value = tenant.id;
    DOM.tenantName.value = tenant.name || '';
    DOM.tenantPhone.value = tenant.phone || '';
    DOM.tenantRentAmount.value = tenant.monthlyRent || '';
    DOM.tenantJoiningDate.value = tenant.joiningDate || '';
    DOM.tenantSecurityDeposit.value = tenant.securityDeposit || 0;
    DOM.tenantInitialAdvance.value = tenant.initialAdvance || 0;
    DOM.tenantStatus.value = tenant.status || 'active';
    DOM.tenantIdProof.value = tenant.idProof || '';
    DOM.tenantEmergencyPhone.value = tenant.emergencyPhone || '';
    DOM.tenantNotes.value = tenant.notes || '';

    populateRoomSelectDropdown(tenant.roomId);
    DOM.tenantModalTitle.innerHTML = `<i class="fa-solid fa-user-pen text-accent"></i> Edit Tenant Profile (${escapeHTML(tenant.name)})`;
    openModal(DOM.tenantModal);
  }

  // Save Tenant Form
  DOM.tenantForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = DOM.tenantId.value;
    const selectedRoomId = DOM.tenantRoomSelect.value;
    const selectedRoom = AppState.rooms.find(r => r.id === selectedRoomId);

    const tenantData = {
      id: id || generateId('tenant'),
      name: DOM.tenantName.value.trim(),
      phone: DOM.tenantPhone.value.trim(),
      roomId: selectedRoomId,
      roomNumber: selectedRoom ? selectedRoom.number : '',
      monthlyRent: Number(DOM.tenantRentAmount.value) || 0,
      joiningDate: DOM.tenantJoiningDate.value,
      securityDeposit: Number(DOM.tenantSecurityDeposit.value) || 0,
      initialAdvance: Number(DOM.tenantInitialAdvance.value) || 0,
      status: DOM.tenantStatus.value,
      idProof: DOM.tenantIdProof.value.trim(),
      emergencyPhone: DOM.tenantEmergencyPhone.value.trim(),
      notes: DOM.tenantNotes.value.trim()
    };

    if (id) {
      const idx = AppState.tenants.findIndex(t => t.id === id);
      if (idx !== -1) AppState.tenants[idx] = tenantData;
      showToast(`${tenantData.name}'s profile has been updated!`, 'success');
    } else {
      AppState.tenants.push(tenantData);
      showToast(`New tenant ${tenantData.name} has been added!`, 'success');
    }

    saveData('tenants');
    closeModal(DOM.tenantModal);
    renderAll();
  });

  // Open Add Room
  function openAddRoomModal() {
    DOM.roomForm.reset();
    DOM.roomId.value = '';
    DOM.roomModalTitle.innerHTML = `<i class="fa-solid fa-door-open text-accent"></i> Add New Room`;
    openModal(DOM.roomModal);
  }

  // Open Edit Room
  function openEditRoomModal(roomId) {
    const room = AppState.rooms.find(r => r.id === roomId);
    if (!room) return;

    DOM.roomId.value = room.id;
    DOM.roomNumber.value = room.number || '';
    DOM.roomDefaultRent.value = room.defaultRent || '';
    DOM.roomMeterReading.value = room.meterReading || '';

    DOM.roomModalTitle.innerHTML = `<i class="fa-solid fa-door-open text-accent"></i> Edit Room ${escapeHTML(room.number)}`;
    openModal(DOM.roomModal);
  }

  // Save Room Form
  DOM.roomForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = DOM.roomId.value;
    const roomData = {
      id: id || generateId('room'),
      number: DOM.roomNumber.value.trim(),
      defaultRent: Number(DOM.roomDefaultRent.value) || 0,
      meterReading: DOM.roomMeterReading.value.trim()
    };

    if (id) {
      const idx = AppState.rooms.findIndex(r => r.id === id);
      if (idx !== -1) AppState.rooms[idx] = roomData;
      showToast(`Room ${roomData.number} updated successfully!`, 'success');
    } else {
      AppState.rooms.push(roomData);
      showToast(`New Room ${roomData.number} created!`, 'success');
    }

    saveData('rooms');
    closeModal(DOM.roomModal);
    renderAll();
  });

  // Open Record Payment Modal
  function openRecordPaymentModal(preselectedTenantId = '') {
    DOM.paymentForm.reset();
    if (DOM.paymentEditId) DOM.paymentEditId.value = '';
    if (DOM.paymentModalTitle) {
      DOM.paymentModalTitle.innerHTML = `<i class="fa-solid fa-indian-rupee-sign text-accent"></i> Record Rent Payment`;
    }
    if (DOM.btnSavePayment) {
      DOM.btnSavePayment.innerHTML = `<i class="fa-solid fa-receipt"></i> Save Payment & Generate Receipt`;
    }
    DOM.paymentDate.value = getTodayDate();
    DOM.paymentForMonth.value = AppState.selectedMonth;
    populateTenantSelectDropdown(preselectedTenantId);

    if (preselectedTenantId) {
      updatePaymentBalancePreview(preselectedTenantId);
    } else {
      DOM.tenantBalancePreview.style.display = 'none';
    }

    openModal(DOM.paymentModal);
  }

  // Open Edit Payment Modal
  function openEditPaymentModal(paymentId) {
    const payment = AppState.payments.find(p => p.id === paymentId);
    if (!payment) {
      showToast('Payment record not found', 'error');
      return;
    }

    DOM.paymentForm.reset();
    if (DOM.paymentEditId) DOM.paymentEditId.value = payment.id;
    if (DOM.paymentModalTitle) {
      DOM.paymentModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square text-accent"></i> Edit Payment Record (${escapeHTML(payment.receiptNo || '')})`;
    }
    if (DOM.btnSavePayment) {
      DOM.btnSavePayment.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update Payment`;
    }

    populateTenantSelectDropdown(payment.tenantId);
    DOM.paymentAmount.value = payment.amount || '';
    DOM.paymentDate.value = payment.date || getTodayDate();
    DOM.paymentForMonth.value = payment.forMonth || AppState.selectedMonth;
    DOM.paymentType.value = payment.type || 'Rent';
    DOM.paymentNotes.value = payment.notes || '';

    updatePaymentBalancePreview(payment.tenantId);
    openModal(DOM.paymentModal);
  }

  // Update Live Balance Preview inside Payment Modal
  function updatePaymentBalancePreview(tenantId) {
    if (!tenantId) {
      DOM.tenantBalancePreview.style.display = 'none';
      return;
    }

    const tenant = AppState.tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    if (!DOM.paymentAmount.value) {
      DOM.paymentAmount.value = tenant.monthlyRent || '';
    }
    DOM.tenantBalancePreview.style.display = 'block';
    DOM.prevRent.textContent = formatCurrency(tenant.monthlyRent);

    const fin = calculateTenantFinancials(tenant, DOM.paymentForMonth.value || AppState.selectedMonth);

    if (fin.isAdvance) {
      DOM.prevStatus.className = 'badge badge-purple';
      DOM.prevStatus.textContent = `${fin.advanceMonths} Month Advance`;
      DOM.prevDetailText.textContent = `Tenant already has +₹${fin.netBalance.toLocaleString('en-IN')} advance balance safe.`;
    } else if (fin.isDue) {
      DOM.prevStatus.className = 'badge badge-danger';
      DOM.prevStatus.textContent = `Pending Due: ₹${fin.pendingDue.toLocaleString('en-IN')}`;
      DOM.prevDetailText.textContent = `Tenant currently has an overdue balance of ₹${fin.pendingDue.toLocaleString('en-IN')}.`;
    } else {
      DOM.prevStatus.className = 'badge badge-success';
      DOM.prevStatus.textContent = 'All Dues Clear';
      DOM.prevDetailText.textContent = `All previous rent dues are completely settled.`;
    }
  }

  DOM.paymentTenantSelect.addEventListener('change', function () {
    updatePaymentBalancePreview(this.value);
  });

  DOM.paymentForMonth.addEventListener('change', function () {
    if (DOM.paymentTenantSelect.value) {
      updatePaymentBalancePreview(DOM.paymentTenantSelect.value);
    }
  });

  // Save Payment Form
  DOM.paymentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const tenantId = DOM.paymentTenantSelect.value;
    const tenant = AppState.tenants.find(t => t.id === tenantId);

    if (!tenant) {
      showToast('Please select a tenant', 'error');
      return;
    }

    const editId = DOM.paymentEditId ? DOM.paymentEditId.value : '';
    const amount = Number(DOM.paymentAmount.value) || 0;

    if (editId) {
      const idx = AppState.payments.findIndex(p => p.id === editId);
      if (idx !== -1) {
        AppState.payments[idx].tenantId = tenant.id;
        AppState.payments[idx].tenantName = tenant.name;
        AppState.payments[idx].roomNumber = tenant.roomNumber;
        AppState.payments[idx].amount = amount;
        AppState.payments[idx].date = DOM.paymentDate.value;
        AppState.payments[idx].forMonth = DOM.paymentForMonth.value;
        AppState.payments[idx].type = DOM.paymentType.value;
        AppState.payments[idx].notes = DOM.paymentNotes.value.trim();
        AppState.payments[idx].timestamp = new Date().toISOString();

        saveData('payments');
        closeModal(DOM.paymentModal);
        showToast(`Payment ${AppState.payments[idx].receiptNo || ''} updated!`, 'success');
        renderAll();
        if (currentDetailTenant) {
          openTenantProfilePage(currentDetailTenant.id);
        }
      }
      return;
    }

    const receiptNo = `REC-${new Date().getFullYear()}-${String(AppState.payments.length + 1).padStart(4, '0')}`;

    const paymentData = {
      id: generateId('pay'),
      receiptNo,
      tenantId: tenant.id,
      tenantName: tenant.name,
      roomNumber: tenant.roomNumber,
      amount: amount,
      date: DOM.paymentDate.value,
      forMonth: DOM.paymentForMonth.value,
      type: DOM.paymentType.value,
      notes: DOM.paymentNotes.value.trim(),
      timestamp: new Date().toISOString()
    };

    AppState.payments.unshift(paymentData);
    saveData('payments');
    closeModal(DOM.paymentModal);

    // Confetti celebration!
    try {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {}

    showToast(`Rent payment of ₹${amount.toLocaleString('en-IN')} recorded!`, 'success');
    renderAll();
    if (currentDetailTenant) {
      openTenantProfilePage(currentDetailTenant.id);
    }

    // Show Digital Receipt
    showDigitalReceipt(paymentData);
  });

  // ---------- DIGITAL RECEIPT ----------
  function showDigitalReceipt(payment) {
    const tenant = AppState.tenants.find(t => t.id === payment.tenantId);
    currentReceiptData = { payment, tenant };

    DOM.recPropName.textContent = AppState.settings.propertyName || 'RentFlow PG & Rooms';
    DOM.recOwnerInfo.textContent = `Owner: ${AppState.settings.ownerName || '-'} | Mob: ${AppState.settings.ownerPhone || '-'}`;
    DOM.recNumber.textContent = `#${payment.receiptNo || 'REC-001'}`;
    DOM.recTenantName.textContent = payment.tenantName;
    DOM.recRoomNo.textContent = `Room ${payment.roomNumber || '-'}`;
    DOM.recDate.textContent = formatDateDisplay(payment.date);
    DOM.recMonth.textContent = formatMonthName(payment.forMonth);
    DOM.recMonthlyRent.textContent = tenant ? `${formatCurrency(tenant.monthlyRent)} / month` : '-';

    DOM.recDescription.textContent = `${payment.type || 'Room Rent'} for ${formatMonthName(payment.forMonth)}`;
    DOM.recType.textContent = payment.type || 'Room Rent';
    DOM.recAmount.textContent = formatCurrency(payment.amount);
    DOM.recTotalAmount.textContent = formatCurrency(payment.amount);
    DOM.recFooterNote.textContent = AppState.settings.receiptNote || 'Thank you for your timely payment!';

    // Balance status inside receipt
    if (tenant) {
      const fin = calculateTenantFinancials(tenant, payment.forMonth);
      if (fin.isAdvance) {
        DOM.recBalanceStatus.textContent = `Advance Balance Active`;
        DOM.recBalanceStatus.className = 'text-purple';
        DOM.recAdvanceDetails.textContent = `${fin.advanceMonths} Months Advance (+${formatCurrency(fin.netBalance)})`;
      } else if (fin.isDue) {
        DOM.recBalanceStatus.textContent = `Pending Due Remaining`;
        DOM.recBalanceStatus.className = 'text-red';
        DOM.recAdvanceDetails.textContent = `Due: -${formatCurrency(fin.pendingDue)}`;
      } else {
        DOM.recBalanceStatus.textContent = `All Dues Clear`;
        DOM.recBalanceStatus.className = 'text-green';
        DOM.recAdvanceDetails.textContent = `0 Due (Complete Clear)`;
      }
    }

    openModal(DOM.receiptModal);
  }

  // Print Receipt
  DOM.btnPrintReceipt.addEventListener('click', function () {
    window.print();
  });

  // Share on WhatsApp
  DOM.btnShareWhatsApp.addEventListener('click', function () {
    if (!currentReceiptData || !currentReceiptData.payment) return;
    const { payment, tenant } = currentReceiptData;
    const phone = tenant ? tenant.phone.replace(/[^0-9]/g, '') : '';

    const text = 
`*Digital Rent Receipt*
🏢 *${AppState.settings.propertyName || 'RentFlow PG'}*
Receipt No: #${payment.receiptNo}
----------------------------------
👤 *Tenant:* ${payment.tenantName}
🚪 *Room No:* ${payment.roomNumber}
💰 *Amount Paid:* ₹${Number(payment.amount).toLocaleString('en-IN')}
📅 *Date:* ${formatDateDisplay(payment.date)}
📆 *For Month:* ${formatMonthName(payment.forMonth)}
🏷️ *Payment Type:* ${payment.type || 'Room Rent'}
----------------------------------
${AppState.settings.receiptNote || 'Thank you for your timely payment!'}
*Owner:* ${AppState.settings.ownerName} (${AppState.settings.ownerPhone})`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = phone 
      ? `https://api.whatsapp.com/send?phone=${phone.length === 10 ? '91' + phone : phone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  });

  // ---------- TENANT DETAIL & STATEMENT FULL PAGE ----------
  function openTenantProfilePage(tenantId) {
    const tenant = AppState.tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    if (AppState.currentTab !== 'tenant-profile') {
      AppState.previousTab = AppState.currentTab || 'rooms';
    }

    currentDetailTenant = tenant;
    const fin = calculateTenantFinancials(tenant, AppState.selectedMonth);

    // Profile details
    const firstLetter = (tenant.name || 'T').charAt(0).toUpperCase();
    DOM.detailAvatarBig.textContent = firstLetter;
    DOM.detailFullName.textContent = tenant.name;
    DOM.detailPhone.textContent = tenant.phone || 'No Mobile';

    const rawPhone = tenant.phone ? tenant.phone.replace(/[^0-9]/g, '') : '';
    const waPhone = rawPhone.length === 10 ? '91' + rawPhone : rawPhone;
    DOM.detailWaLink.href = `https://wa.me/${waPhone}`;

    DOM.detailRoomNumber.textContent = `Room ${tenant.roomNumber || '-'}`;
    DOM.detailJoiningDate.textContent = formatDateDisplay(tenant.joiningDate);

    // Status Badge
    let badgeHTML = '';
    if (tenant.status === 'vacated') {
      badgeHTML = `<span class="badge badge-danger"><i class="fa-solid fa-door-closed"></i> Vacated</span>`;
    } else if (fin.isAdvance) {
      badgeHTML = `<span class="badge badge-purple"><i class="fa-solid fa-forward"></i> ${fin.advanceMonths} Month Advance (+${formatCurrency(fin.netBalance)})</span>`;
    } else if (fin.isDue) {
      badgeHTML = `<span class="badge badge-danger"><i class="fa-solid fa-clock"></i> Rent Due: -${formatCurrency(fin.pendingDue)}</span>`;
    } else {
      badgeHTML = `<span class="badge badge-success"><i class="fa-solid fa-check"></i> All Dues Clear</span>`;
    }
    DOM.detailStatusBadgeWrap.innerHTML = badgeHTML;

    // KPI Cards
    DOM.detailTotalExpected.textContent = formatCurrency(fin.totalExpectedRent);
    DOM.detailMonthsCount.textContent = `${fin.monthsActive} Months Statement`;
    DOM.detailTotalPaid.textContent = formatCurrency(fin.totalRentPaid);
    DOM.detailMonthlyRate.textContent = `Rent: ${formatCurrency(tenant.monthlyRent)}/mo`;

    if (fin.isAdvance) {
      DOM.detailBalanceKpiCard.className = 'detail-kpi-card kpi-purple';
      DOM.detailBalanceLabel.textContent = 'Advance Balance';
      DOM.detailNetBalance.textContent = `+${formatCurrency(fin.netBalance)}`;
      DOM.detailAdvanceMonthsDetail.textContent = `${fin.advanceMonths} Mo + ₹${fin.advanceRemaining} Advance Safe`;
    } else if (fin.isDue) {
      DOM.detailBalanceKpiCard.className = 'detail-kpi-card kpi-red';
      DOM.detailBalanceLabel.textContent = 'Pending Rent Due';
      DOM.detailNetBalance.textContent = `-${formatCurrency(fin.pendingDue)}`;
      DOM.detailAdvanceMonthsDetail.textContent = `Rent Overdue`;
    } else {
      DOM.detailBalanceKpiCard.className = 'detail-kpi-card kpi-green';
      DOM.detailBalanceLabel.textContent = 'Balance Status';
      DOM.detailNetBalance.textContent = '₹0 (Clear)';
      DOM.detailAdvanceMonthsDetail.textContent = 'All Rent Settled';
    }

    const room = AppState.rooms.find(r => r.id === tenant.roomId);
    const meterVal = room && room.meterReading ? room.meterReading : '0';
    if (DOM.detailMeterReading) DOM.detailMeterReading.textContent = `${meterVal} Units`;
    if (DOM.detailMeterSubText) DOM.detailMeterSubText.textContent = `Room ${tenant.roomNumber || ''} Meter (Click to calc)`;

    // Extra details
    DOM.detailIdProof.textContent = tenant.idProof || 'Not Provided';
    DOM.detailEmergencyPhone.textContent = tenant.emergencyPhone || 'Not Provided';
    DOM.detailNotes.textContent = tenant.notes || 'No notes recorded';

    // Payment History Table (Active only)
    const tenantPayments = AppState.payments
      .filter(p => p.tenantId === tenant.id && !p.isDeleted)
      .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));

    if (tenantPayments.length === 0) {
      DOM.detailPaymentHistoryBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: var(--text-dim);">
            <i class="fa-solid fa-receipt" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.5; display: block;"></i>
            No payment transactions found for this tenant.
          </td>
        </tr>
      `;
    } else {
      DOM.detailPaymentHistoryBody.innerHTML = tenantPayments.map(p => `
        <tr>
          <td><strong class="text-primary">${escapeHTML(p.receiptNo || '-')}</strong></td>
          <td>${formatDateDisplay(p.date)}</td>
          <td>${formatMonthName(p.forMonth)}</td>
          <td><strong class="text-green">${formatCurrency(p.amount)}</strong></td>
          <td>
            <span class="badge badge-purple" style="font-size: 0.72rem;">${escapeHTML(p.type || 'Rent')}</span>
            ${p.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${escapeHTML(p.notes)}</div>` : ''}
          </td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="btn btn-xs btn-outline btn-view-receipt" data-id="${p.id}" title="View Receipt">
                <i class="fa-solid fa-receipt"></i> Receipt
              </button>
              <button class="btn btn-xs btn-primary btn-edit-payment" data-id="${p.id}" title="Edit Payment Record">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>
              <button class="btn btn-xs btn-danger btn-delete-payment" data-id="${p.id}" title="Delete Payment Record">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Render Meter Reading History Table
    renderTenantMeterHistory(tenant.roomId);

    // Set Back Button Text
    const prevTabLabel = AppState.previousTab === 'rooms' ? 'Rooms' : AppState.previousTab === 'tenants' ? 'Tenants' : 'Dashboard';
    if (DOM.backButtonText) DOM.backButtonText.textContent = `Back (${prevTabLabel})`;

    // Switch to Profile Tab
    switchTab('tenant-profile');
    DOM.pageHeaderTitle.textContent = `${tenant.name} - Statement & Profile`;
    DOM.pageHeaderSubtitle.textContent = `Room ${tenant.roomNumber || '-'} • ${tenant.status === 'active' ? 'Active' : 'Vacated'}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Tenant Detail Actions
  DOM.detailBtnRecordPay.addEventListener('click', function () {
    if (currentDetailTenant) {
      openRecordPaymentModal(currentDetailTenant.id);
    }
  });

  DOM.detailBtnEditProfile.addEventListener('click', function () {
    if (currentDetailTenant) {
      openEditTenantModal(currentDetailTenant.id);
    }
  });

  if (DOM.detailBtnDeleteTenant) {
    DOM.detailBtnDeleteTenant.addEventListener('click', function () {
      if (!currentDetailTenant) return;
      if (confirm(`Are you sure you want to delete "${currentDetailTenant.name}"?`)) {
        AppState.tenants = AppState.tenants.filter(t => t.id !== currentDetailTenant.id);
        saveData('tenants');
        showToast('Tenant has been deleted.', 'info');
        switchTab(AppState.previousTab || 'rooms');
        renderAll();
      }
    });
  }

  if (DOM.btnBackFromProfile) {
    DOM.btnBackFromProfile.addEventListener('click', function () {
      switchTab(AppState.previousTab || 'rooms');
    });
  }

  DOM.detailBtnShareHisaab.addEventListener('click', function () {
    if (!currentDetailTenant) return;
    const tenant = currentDetailTenant;
    const fin = calculateTenantFinancials(tenant, AppState.selectedMonth);
    const tenantPayments = AppState.payments
      .filter(p => p.tenantId === tenant.id && !p.isDeleted)
      .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));

    let statusText = fin.isAdvance 
      ? `*Advance Balance:* +${formatCurrency(fin.netBalance)} (${fin.advanceMonths} Months Advance)`
      : fin.isDue 
      ? `*Pending Rent Due:* -${formatCurrency(fin.pendingDue)}`
      : `*Status:* All Dues Clear (₹0 Due)`;

    let paymentHistoryText = '';
    if (tenantPayments.length > 0) {
      paymentHistoryText = tenantPayments.slice(0, 5).map((p, idx) => 
        `${idx + 1}. ${formatDateDisplay(p.date)}: ₹${Number(p.amount).toLocaleString('en-IN')} (${p.type || 'Rent'} - ${formatMonthName(p.forMonth)})`
      ).join('\n');
    } else {
      paymentHistoryText = 'No payment transactions recorded yet.';
    }

    const text = 
`*Rent Statement & Financial Summary*
🏢 *${AppState.settings.propertyName || 'RentFlow PG'}*
----------------------------------
👤 *Tenant Name:* ${tenant.name}
🚪 *Room No:* ${tenant.roomNumber || '-'}
💰 *Monthly Rent:* ${formatCurrency(tenant.monthlyRent)}/mo
📅 *Joining Date:* ${formatDateDisplay(tenant.joiningDate)}
----------------------------------
📊 *Statement Breakdown:*
• Total Expected Rent (${fin.monthsActive} Mo): ${formatCurrency(fin.totalExpectedRent)}
• Total Rent Paid: ${formatCurrency(fin.totalRentPaid)}
• ${statusText}
• Security Deposit: ${formatCurrency(tenant.securityDeposit || 0)}
----------------------------------
🧾 *Recent Transactions:*
${paymentHistoryText}
----------------------------------
${AppState.settings.receiptNote || 'Thank you!'}
*Owner:* ${AppState.settings.ownerName} (${AppState.settings.ownerPhone})`;

    const phone = tenant.phone ? tenant.phone.replace(/[^0-9]/g, '') : '';
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = phone 
      ? `https://api.whatsapp.com/send?phone=${phone.length === 10 ? '91' + phone : phone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  });

  // Settings Form Submit
  if (DOM.propertySettingsForm) {
    DOM.propertySettingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (DOM.settingPropName) AppState.settings.propertyName = DOM.settingPropName.value.trim();
      if (DOM.settingOwnerName) AppState.settings.ownerName = DOM.settingOwnerName.value.trim();
      if (DOM.settingOwnerPhone) AppState.settings.ownerPhone = DOM.settingOwnerPhone.value.trim();
      if (DOM.settingDefaultUnitRate) {
        AppState.settings.defaultUnitRate = parseFloat(DOM.settingDefaultUnitRate.value) || 8;
      }
      if (DOM.settingOwnerUpi) AppState.settings.ownerUpi = DOM.settingOwnerUpi.value.trim();
      if (DOM.settingReceiptNote) AppState.settings.receiptNote = DOM.settingReceiptNote.value.trim();

      saveData('settings');
      renderBrandAndSettings();
      showToast('Settings saved successfully!', 'success');
    });
  }

  // ==========================================
  // 7.5. Electricity Meter & Bill Calculator
  // ==========================================
  function openMeterCalculatorModal(roomId, forMonth) {
    if (AppState.rooms.length === 0) {
      showToast('No rooms available!', 'warning');
      return;
    }

    // Populate Room Select
    DOM.meterRoomSelect.innerHTML = AppState.rooms.map(r => `
      <option value="${r.id}">Room ${escapeHTML(r.number)} (${AppState.tenants.filter(t => t.roomId === r.id && t.status === 'active').length} Active Occupants)</option>
    `).join('');

    if (roomId) {
      DOM.meterRoomSelect.value = roomId;
    }

    DOM.meterForMonth.value = forMonth || AppState.selectedMonth || getCurrentYearMonth();
    DOM.meterReadingDate.value = getTodayDate();
    DOM.meterUnitRate.value = AppState.settings.defaultUnitRate || 8;
    DOM.meterNotes.value = '';

    loadRoomMeterValues(DOM.meterRoomSelect.value);
    openModal(DOM.meterModal);
  }

  function loadRoomMeterValues(selectedRoomId) {
    const room = AppState.rooms.find(r => r.id === selectedRoomId);
    if (!room) return;

    // Determine baseline or previous reading
    let prev = 0;
    if (room.meterReading !== undefined && room.meterReading !== '') {
      const numMatch = String(room.meterReading).replace(/[^0-9.]/g, '');
      if (numMatch) prev = parseFloat(numMatch);
    }

    DOM.meterPrevReading.value = prev;
    DOM.meterCurrentReading.value = prev > 0 ? (prev + 50) : '';
    recalculateMeterBill();
  }

  function recalculateMeterBill() {
    const prev = parseFloat(DOM.meterPrevReading.value) || 0;
    const curr = parseFloat(DOM.meterCurrentReading.value) || 0;
    const rate = parseFloat(DOM.meterUnitRate.value) || 0;

    const units = Math.max(0, curr - prev);
    const totalBill = units * rate;

    const roomId = DOM.meterRoomSelect.value;
    const roomTenants = AppState.tenants.filter(t => t.roomId === roomId && t.status === 'active');
    const count = roomTenants.length > 0 ? roomTenants.length : 1;
    const perPerson = totalBill / count;

    DOM.calcUnitsConsumed.textContent = `${units.toLocaleString('en-IN')} Units (${curr} - ${prev})`;
    DOM.calcTotalBill.textContent = `₹${totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    if (roomTenants.length > 0) {
      DOM.calcOccupantsCount.textContent = `${roomTenants.length} Tenants (${roomTenants.map(t => t.name).join(', ')})`;
    } else {
      DOM.calcOccupantsCount.textContent = `0 Tenants (Room Vacant)`;
    }

    DOM.calcPerPersonShare.textContent = `₹${perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Tenant`;
  }

  // Live input changes for meter calculation
  DOM.meterRoomSelect.addEventListener('change', function () {
    loadRoomMeterValues(this.value);
  });
  DOM.meterPrevReading.addEventListener('input', recalculateMeterBill);
  DOM.meterCurrentReading.addEventListener('input', recalculateMeterBill);
  DOM.meterUnitRate.addEventListener('input', recalculateMeterBill);

  // Meter Form Save
  DOM.meterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const roomId = DOM.meterRoomSelect.value;
    const room = AppState.rooms.find(r => r.id === roomId);
    if (!room) return;

    const curr = parseFloat(DOM.meterCurrentReading.value) || 0;
    const prev = parseFloat(DOM.meterPrevReading.value) || 0;
    const rate = parseFloat(DOM.meterUnitRate.value) || 0;
    const units = Math.max(0, curr - prev);
    const totalBill = units * rate;

    // Save into Meter History Log
    const roomTenants = AppState.tenants.filter(t => t.roomId === roomId && t.status === 'active');
    const count = roomTenants.length > 0 ? roomTenants.length : 1;
    const perPerson = totalBill / count;

    const historyEntry = {
      id: generateId('meter_rec'),
      roomId: room.id,
      roomNumber: room.number,
      forMonth: DOM.meterForMonth.value,
      date: DOM.meterReadingDate.value || getTodayDate(),
      prevReading: prev,
      currentReading: curr,
      units: units,
      unitRate: rate,
      totalBill: totalBill,
      perPersonShare: perPerson,
      notes: DOM.meterNotes.value.trim(),
      timestamp: new Date().toISOString()
    };

    AppState.meterHistory.unshift(historyEntry);
    saveData('meter');

    // Update room reading
    room.meterReading = `${curr}`;
    saveData('rooms');

    closeModal(DOM.meterModal);
    renderRoomsList();
    if (currentDetailTenant && currentDetailTenant.roomId === roomId) {
      if (DOM.detailMeterReading) DOM.detailMeterReading.textContent = `${curr} Units`;
      renderTenantMeterHistory(roomId);
    }
    showToast(`Room ${room.number} meter reading (${curr} Units) and ₹${totalBill.toFixed(2)} bill saved to history!`, 'success');
  });

  // Render Meter Reading History for a Room (Active only)
  function renderTenantMeterHistory(roomId) {
    if (!DOM.detailMeterHistoryBody) return;
    const records = AppState.meterHistory
      .filter(m => m.roomId === roomId && !m.isDeleted)
      .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));

    if (records.length === 0) {
      DOM.detailMeterHistoryBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 28px; color: var(--text-dim);">
            <i class="fa-solid fa-bolt" style="font-size: 1.8rem; margin-bottom: 8px; opacity: 0.4; display: block;"></i>
            No meter reading records found for this room.
          </td>
        </tr>
      `;
      return;
    }

    DOM.detailMeterHistoryBody.innerHTML = records.map(m => `
      <tr>
        <td><strong class="text-primary">${formatMonthName(m.forMonth)}</strong></td>
        <td>${formatDateDisplay(m.date)}</td>
        <td>${m.prevReading}</td>
        <td><strong>${m.currentReading}</strong></td>
        <td><span class="badge badge-amber font-bold">${m.units} Units</span></td>
        <td>₹${m.unitRate}/u</td>
        <td><strong class="text-green">₹${Number(m.totalBill).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
        <td><strong class="text-accent">₹${Number(m.perPersonShare).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-xs btn-whatsapp btn-share-meter-row" data-id="${m.id}" title="Send Bill on WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
            <button class="btn btn-xs btn-outline text-red btn-delete-meter-row" data-id="${m.id}" title="Delete Reading">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // WhatsApp Meter Bill Share
  DOM.btnShareMeterWhatsApp.addEventListener('click', function () {
    const roomId = DOM.meterRoomSelect.value;
    const room = AppState.rooms.find(r => r.id === roomId);
    if (!room) return;

    const prev = parseFloat(DOM.meterPrevReading.value) || 0;
    const curr = parseFloat(DOM.meterCurrentReading.value) || 0;
    const rate = parseFloat(DOM.meterUnitRate.value) || 0;
    const units = Math.max(0, curr - prev);
    const totalBill = units * rate;

    const roomTenants = AppState.tenants.filter(t => t.roomId === roomId && t.status === 'active');
    const count = roomTenants.length > 0 ? roomTenants.length : 1;
    const perPerson = totalBill / count;

    const text =
`⚡ *Electricity Meter Bill Statement*
🏢 *${AppState.settings.propertyName || 'RentFlow PG'}* - Room ${room.number}
📅 *Date:* ${formatDateDisplay(DOM.meterReadingDate.value)}
📆 *For Month:* ${formatMonthName(DOM.meterForMonth.value)}
----------------------------------
• Previous Reading: ${prev}
• Current Reading: ${curr}
• ⚡ *Units Consumed:* ${units} Units
• Unit Rate: ₹${rate}/Unit
💰 *Total Room Bill:* ₹${totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
👥 *Occupants:* ${roomTenants.length}
👉 *Per Tenant Share:* ₹${perPerson.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Tenant
----------------------------------
Please submit this electricity bill amount alongside the monthly rent.
*Owner:* ${AppState.settings.ownerName} (${AppState.settings.ownerPhone})`;

    const encodedText = encodeURIComponent(text);
    const firstTenant = roomTenants[0];
    const phone = firstTenant && firstTenant.phone ? firstTenant.phone.replace(/[^0-9]/g, '') : '';
    const whatsappUrl = phone 
      ? `https://api.whatsapp.com/send?phone=${phone.length === 10 ? '91' + phone : phone}&text=${encodedText}`
      : `https://api.whatsapp.com/send?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  });

  // Add Meter Bill to Kiraya Entry
  DOM.btnAddMeterToKiraya.addEventListener('click', function () {
    const roomId = DOM.meterRoomSelect.value;
    const room = AppState.rooms.find(r => r.id === roomId);
    const roomTenants = AppState.tenants.filter(t => t.roomId === roomId && t.status === 'active');

    const prev = parseFloat(DOM.meterPrevReading.value) || 0;
    const curr = parseFloat(DOM.meterCurrentReading.value) || 0;
    const rate = parseFloat(DOM.meterUnitRate.value) || 0;
    const units = Math.max(0, curr - prev);
    const totalBill = units * rate;
    const count = roomTenants.length > 0 ? roomTenants.length : 1;
    const perPerson = Math.round(totalBill / count);

    closeModal(DOM.meterModal);

    // If active tenant in room, pre-fill payment modal with electricity bill
    const targetTenant = roomTenants[0] || (AppState.tenants.length > 0 ? AppState.tenants[0] : null);
    if (targetTenant) {
      openRecordPaymentModal(targetTenant.id);
      DOM.paymentAmount.value = perPerson;
      DOM.paymentType.value = 'Electricity';
      DOM.paymentForMonth.value = DOM.meterForMonth.value;
      DOM.paymentNotes.value = `Electricity Bill: ${units} Units (${prev} to ${curr}) @ ₹${rate}/unit`;
    }
  });

  // ==========================================
  // 7.8. Real Main Electricity Meter Bills (DISCOM / Govt Bill)
  // ==========================================

  function renderDashboardRealMeter() {
    const selectedMonth = AppState.selectedMonth;
    const monthName = formatMonthName(selectedMonth);

    if (DOM.dashRealMeterMonthLabel) {
      DOM.dashRealMeterMonthLabel.textContent = `${monthName} Real Bill`;
    }

    // Find real meter bill for this month
    const realBill = AppState.realMeterBills.find(b => b.forMonth === selectedMonth && !b.isDeleted);

    if (realBill) {
      if (DOM.dashRealMeterMonthAmount) DOM.dashRealMeterMonthAmount.textContent = formatCurrency(realBill.amount);
      if (DOM.dashRealMeterStatusBadge) {
        if (realBill.paidStatus === 'Paid') {
          DOM.dashRealMeterStatusBadge.className = 'badge badge-success font-bold';
          DOM.dashRealMeterStatusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Paid`;
        } else {
          DOM.dashRealMeterStatusBadge.className = 'badge badge-danger font-bold';
          DOM.dashRealMeterStatusBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Unpaid / Due`;
        }
      }
      if (DOM.dashRealMeterMonthUnits) {
        DOM.dashRealMeterMonthUnits.textContent = `${realBill.units ? Number(realBill.units).toLocaleString('en-IN') + ' Units' : 'Units not recorded'}${realBill.billNumber ? ' • Bill No: ' + escapeHTML(realBill.billNumber) : ''}`;
      }
    } else {
      if (DOM.dashRealMeterMonthAmount) DOM.dashRealMeterMonthAmount.textContent = '₹0';
      if (DOM.dashRealMeterStatusBadge) {
        DOM.dashRealMeterStatusBadge.className = 'badge badge-warning';
        DOM.dashRealMeterStatusBadge.innerHTML = `<i class="fa-solid fa-circle-question"></i> Not Recorded`;
      }
      if (DOM.dashRealMeterMonthUnits) {
        DOM.dashRealMeterMonthUnits.textContent = `No bill recorded for ${monthName}`;
      }
    }

    // Tenant Electricity Collection for this month
    const tenantElectricityCollected = AppState.payments
      .filter(p => p.type === 'Electricity' && p.forMonth === selectedMonth && !p.isDeleted)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    if (DOM.dashRealMeterTenantCollected) {
      DOM.dashRealMeterTenantCollected.textContent = formatCurrency(tenantElectricityCollected);
    }

    // Difference & Recovery %
    const realBillAmount = realBill ? Number(realBill.amount) || 0 : 0;
    if (DOM.dashRealMeterRecoveryPercent) {
      if (realBillAmount > 0) {
        const coverPct = Math.round((tenantElectricityCollected / realBillAmount) * 100);
        DOM.dashRealMeterRecoveryPercent.textContent = `${coverPct}% Covered`;
        DOM.dashRealMeterRecoveryPercent.className = coverPct >= 100 ? 'badge badge-success' : (coverPct >= 60 ? 'badge badge-warning' : 'badge badge-danger');
      } else {
        DOM.dashRealMeterRecoveryPercent.textContent = tenantElectricityCollected > 0 ? 'Surplus' : '0% Covered';
        DOM.dashRealMeterRecoveryPercent.className = 'badge badge-info';
      }
    }

    if (DOM.dashRealMeterBalanceDiff) {
      if (realBillAmount > 0) {
        const diff = tenantElectricityCollected - realBillAmount;
        if (diff >= 0) {
          DOM.dashRealMeterBalanceDiff.innerHTML = `<span class="text-green font-bold">+${formatCurrency(diff)} Surplus</span> vs Real Bill`;
        } else {
          DOM.dashRealMeterBalanceDiff.innerHTML = `<span class="text-red font-bold">-${formatCurrency(Math.abs(diff))} Shortfall</span> (Owner bear)`;
        }
      } else {
        DOM.dashRealMeterBalanceDiff.textContent = `Tenant Collected: ${formatCurrency(tenantElectricityCollected)}`;
      }
    }

    // All-Time / Total Real Bills
    const activeRealBills = AppState.realMeterBills.filter(b => !b.isDeleted);
    const totalAllTimeRealAmount = activeRealBills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    if (DOM.dashRealMeterAllTimeAmount) DOM.dashRealMeterAllTimeAmount.textContent = formatCurrency(totalAllTimeRealAmount);
    if (DOM.dashRealMeterAllTimeCount) DOM.dashRealMeterAllTimeCount.textContent = `${activeRealBills.length} Recorded Months`;
    if (DOM.dashRealMeterHistoryCount) DOM.dashRealMeterHistoryCount.textContent = activeRealBills.length;
  }

  function openRecordRealMeterModal(editId = null, defaultMonth = AppState.selectedMonth) {
    if (!DOM.realMeterBillForm) return;

    if (editId) {
      const bill = AppState.realMeterBills.find(b => b.id === editId);
      if (!bill) {
        showToast('Real Bill record not found', 'error');
        return;
      }
      if (DOM.realMeterBillModalTitle) DOM.realMeterBillModalTitle.innerHTML = `<i class="fa-solid fa-bolt-lightning text-amber"></i> Edit Real Main Electricity Bill`;
      if (DOM.realMeterEditId) DOM.realMeterEditId.value = bill.id;
      if (DOM.realMeterForMonth) DOM.realMeterForMonth.value = bill.forMonth || defaultMonth;
      if (DOM.realMeterAmount) DOM.realMeterAmount.value = bill.amount || '';
      if (DOM.realMeterUnits) DOM.realMeterUnits.value = bill.units || '';
      if (DOM.realMeterBillNumber) DOM.realMeterBillNumber.value = bill.billNumber || '';
      if (DOM.realMeterBillDate) DOM.realMeterBillDate.value = bill.billDate || getTodayDate();
      if (DOM.realMeterDueDate) DOM.realMeterDueDate.value = bill.dueDate || '';
      if (DOM.realMeterPaidStatus) DOM.realMeterPaidStatus.value = bill.paidStatus || 'Paid';
      if (DOM.realMeterPaymentMode) DOM.realMeterPaymentMode.value = bill.paymentMode || 'Online / UPI';
      if (DOM.realMeterPaidDate) DOM.realMeterPaidDate.value = bill.paidDate || getTodayDate();
      if (DOM.realMeterNotes) DOM.realMeterNotes.value = bill.notes || '';
    } else {
      if (DOM.realMeterBillModalTitle) DOM.realMeterBillModalTitle.innerHTML = `<i class="fa-solid fa-bolt-lightning text-amber"></i> Record Real Main Electricity Bill`;
      if (DOM.realMeterEditId) DOM.realMeterEditId.value = '';
      if (DOM.realMeterForMonth) DOM.realMeterForMonth.value = defaultMonth || getCurrentYearMonth();
      if (DOM.realMeterAmount) DOM.realMeterAmount.value = '';
      if (DOM.realMeterUnits) DOM.realMeterUnits.value = '';
      if (DOM.realMeterBillNumber) DOM.realMeterBillNumber.value = '';
      if (DOM.realMeterBillDate) DOM.realMeterBillDate.value = getTodayDate();
      if (DOM.realMeterDueDate) DOM.realMeterDueDate.value = '';
      if (DOM.realMeterPaidStatus) DOM.realMeterPaidStatus.value = 'Paid';
      if (DOM.realMeterPaymentMode) DOM.realMeterPaymentMode.value = 'Online / UPI';
      if (DOM.realMeterPaidDate) DOM.realMeterPaidDate.value = getTodayDate();
      if (DOM.realMeterNotes) DOM.realMeterNotes.value = '';
    }

    updateRealMeterPaidFieldVisibility();
    openModal(DOM.realMeterBillModal);
  }

  function updateRealMeterPaidFieldVisibility() {
    if (!DOM.realMeterPaidStatus) return;
    const isPaid = DOM.realMeterPaidStatus.value === 'Paid';
    if (DOM.realMeterPaymentModeGroup) DOM.realMeterPaymentModeGroup.style.display = isPaid ? 'block' : 'none';
    if (DOM.realMeterPaidDateRow) DOM.realMeterPaidDateRow.style.display = isPaid ? 'flex' : 'none';
  }

  function saveRealMeterBill(e) {
    if (e) e.preventDefault();

    const editId = DOM.realMeterEditId ? DOM.realMeterEditId.value.trim() : '';
    const forMonth = DOM.realMeterForMonth.value;
    const amount = parseFloat(DOM.realMeterAmount.value) || 0;
    const units = parseFloat(DOM.realMeterUnits.value) || 0;
    const billNumber = DOM.realMeterBillNumber.value.trim();
    const billDate = DOM.realMeterBillDate.value || getTodayDate();
    const dueDate = DOM.realMeterDueDate.value;
    const paidStatus = DOM.realMeterPaidStatus.value || 'Paid';
    const paymentMode = paidStatus === 'Paid' ? DOM.realMeterPaymentMode.value : '-';
    const paidDate = paidStatus === 'Paid' ? (DOM.realMeterPaidDate.value || billDate) : '';
    const notes = DOM.realMeterNotes.value.trim();

    if (!forMonth || amount <= 0) {
      showToast('Please enter a valid bill amount and month', 'warning');
      return;
    }

    if (editId) {
      const idx = AppState.realMeterBills.findIndex(b => b.id === editId);
      if (idx !== -1) {
        AppState.realMeterBills[idx] = {
          ...AppState.realMeterBills[idx],
          forMonth,
          amount,
          units,
          billNumber,
          billDate,
          dueDate,
          paidStatus,
          paymentMode,
          paidDate,
          notes,
          timestamp: new Date().toISOString()
        };
      }
    } else {
      // Check if already exists for month
      const existing = AppState.realMeterBills.find(b => b.forMonth === forMonth && !b.isDeleted);
      if (existing) {
        if (!confirm(`A real meter bill record for ${formatMonthName(forMonth)} (₹${existing.amount}) already exists.\nDo you want to update it?`)) {
          return;
        }
        existing.amount = amount;
        existing.units = units;
        existing.billNumber = billNumber;
        existing.billDate = billDate;
        existing.dueDate = dueDate;
        existing.paidStatus = paidStatus;
        existing.paymentMode = paymentMode;
        existing.paidDate = paidDate;
        existing.notes = notes;
        existing.timestamp = new Date().toISOString();
      } else {
        const newBill = {
          id: `rmb_${forMonth.replace('-', '_')}_${Date.now()}`,
          forMonth,
          amount,
          units,
          billNumber,
          billDate,
          dueDate,
          paidStatus,
          paymentMode,
          paidDate,
          notes,
          timestamp: new Date().toISOString()
        };
        AppState.realMeterBills.unshift(newBill);
      }
    }

    saveData('realMeterBills');
    closeModal(DOM.realMeterBillModal);
    renderDashboardRealMeter();
    if (DOM.realMeterHistoryModal && DOM.realMeterHistoryModal.classList.contains('active')) {
      renderRealMeterHistoryTable();
    }
    showToast(`Real Electricity Bill of ${formatCurrency(amount)} for ${formatMonthName(forMonth)} saved!`, 'success');
  }

  function deleteRealMeterBill(id) {
    const bill = AppState.realMeterBills.find(b => b.id === id);
    if (!bill) return;

    if (!confirm(`⚠️ DELETE REAL BILL:\nAre you sure you want to delete the Real Meter Bill for ${formatMonthName(bill.forMonth)} (₹${bill.amount})?`)) return;

    AppState.realMeterBills = AppState.realMeterBills.filter(b => b.id !== id);
    saveData('realMeterBills');
    renderDashboardRealMeter();
    renderRealMeterHistoryTable();
    showToast('Real Bill record deleted successfully!', 'info');
  }

  function openRealMeterHistoryModal() {
    renderRealMeterHistoryTable();
    openModal(DOM.realMeterHistoryModal);
  }

  function renderRealMeterHistoryTable() {
    if (!DOM.realMeterHistoryTableBody) return;

    const query = (DOM.realMeterHistSearch ? DOM.realMeterHistSearch.value : '').toLowerCase().trim();
    const yearFilter = DOM.realMeterHistYearFilter ? DOM.realMeterHistYearFilter.value : 'all';

    const activeBills = AppState.realMeterBills
      .filter(b => !b.isDeleted)
      .sort((a, b) => (b.forMonth || '').localeCompare(a.forMonth || ''));

    const filtered = activeBills.filter(b => {
      const matchQuery = (b.forMonth && b.forMonth.toLowerCase().includes(query)) ||
        (b.billNumber && b.billNumber.toLowerCase().includes(query)) ||
        (b.notes && b.notes.toLowerCase().includes(query)) ||
        (b.paymentMode && b.paymentMode.toLowerCase().includes(query));

      if (!matchQuery) return false;
      if (yearFilter !== 'all' && b.forMonth && !b.forMonth.startsWith(yearFilter)) return false;
      return true;
    });

    // Update KPI strip in history modal
    const totalBilled = filtered.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    // Sum tenant sub-meter collections for filtered months
    const filteredMonths = new Set(filtered.map(b => b.forMonth));
    const totalTenantCollected = AppState.payments
      .filter(p => p.type === 'Electricity' && filteredMonths.has(p.forMonth) && !p.isDeleted)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    if (DOM.modalRealMeterTotalBilled) DOM.modalRealMeterTotalBilled.textContent = formatCurrency(totalBilled);
    if (DOM.modalRealMeterTotalCount) DOM.modalRealMeterTotalCount.textContent = `${filtered.length} Monthly Bills Recorded`;
    if (DOM.modalRealMeterTenantCollected) DOM.modalRealMeterTenantCollected.textContent = formatCurrency(totalTenantCollected);

    if (DOM.modalRealMeterCoverRatio) {
      const ratio = totalBilled > 0 ? Math.round((totalTenantCollected / totalBilled) * 100) : 0;
      DOM.modalRealMeterCoverRatio.textContent = `${ratio}% Recovery from Tenants`;
    }

    if (DOM.modalRealMeterNetDiff) {
      const diff = totalTenantCollected - totalBilled;
      if (diff >= 0) {
        DOM.modalRealMeterNetDiff.textContent = `+${formatCurrency(diff)}`;
        DOM.modalRealMeterNetDiff.className = 'text-green font-bold';
        if (DOM.modalRealMeterDiffLabel) DOM.modalRealMeterDiffLabel.textContent = 'Surplus recovered from tenants';
      } else {
        DOM.modalRealMeterNetDiff.textContent = `-${formatCurrency(Math.abs(diff))}`;
        DOM.modalRealMeterNetDiff.className = 'text-red font-bold';
        if (DOM.modalRealMeterDiffLabel) DOM.modalRealMeterDiffLabel.textContent = 'Shortfall bear by Owner';
      }
    }

    if (filtered.length === 0) {
      DOM.realMeterHistoryTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-dim);">
            <i class="fa-solid fa-file-invoice-dollar" style="font-size: 2rem; margin-bottom: 8px; opacity: 0.4; display: block;"></i>
            No real electricity bill records found for the selected filter.
          </td>
        </tr>
      `;
      return;
    }

    DOM.realMeterHistoryTableBody.innerHTML = filtered.map(b => {
      const isPaid = b.paidStatus === 'Paid';
      return `
        <tr>
          <td><strong class="text-primary">${formatMonthName(b.forMonth)}</strong></td>
          <td>${formatDateDisplay(b.billDate)}</td>
          <td>${b.billNumber ? `<span class="badge badge-info">${escapeHTML(b.billNumber)}</span>` : '<span class="text-muted">-</span>'}</td>
          <td>${b.units ? `<strong>${Number(b.units).toLocaleString('en-IN')} U</strong>` : '<span class="text-muted">-</span>'}</td>
          <td><strong class="text-amber" style="font-size: 1.05rem;">${formatCurrency(b.amount)}</strong></td>
          <td>
            <span class="badge ${isPaid ? 'badge-success' : 'badge-danger'}">
              ${isPaid ? '<i class="fa-solid fa-circle-check"></i> Paid' : '<i class="fa-solid fa-clock"></i> Unpaid'}
            </span>
          </td>
          <td>
            <div style="font-size: 0.82rem;">
              <strong>${escapeHTML(b.paymentMode || '-')}</strong>
              ${b.paidDate ? `<div class="text-muted">${formatDateDisplay(b.paidDate)}</div>` : ''}
            </div>
          </td>
          <td><span style="font-size: 0.78rem; color: var(--text-muted);">${escapeHTML(b.notes || '-')}</span></td>
          <td>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="btn btn-xs btn-whatsapp btn-share-real-meter-row" data-id="${b.id}" title="Share on WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
              <button class="btn btn-xs btn-outline btn-edit-real-meter" data-id="${b.id}" title="Edit Record">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-xs btn-outline text-red btn-delete-real-meter" data-id="${b.id}" title="Delete Record">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function exportRealMeterBillsCSV() {
    const activeBills = AppState.realMeterBills.filter(b => !b.isDeleted);
    if (activeBills.length === 0) {
      showToast('No real meter bill records to export', 'warning');
      return;
    }

    const headers = ['Bill Month', 'Bill Date', 'Bill / CA No', 'Units Consumed', 'Bill Amount (Rs)', 'Status', 'Payment Mode', 'Paid Date', 'Due Date', 'Notes'];
    const rows = activeBills.map(b => [
      `"${b.forMonth || ''}"`,
      `"${b.billDate || ''}"`,
      `"${b.billNumber || ''}"`,
      b.units || 0,
      b.amount || 0,
      `"${b.paidStatus || 'Paid'}"`,
      `"${b.paymentMode || ''}"`,
      `"${b.paidDate || ''}"`,
      `"${b.dueDate || ''}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Real_Electricity_Bills_${getTodayDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Real Electricity Bills CSV exported!', 'success');
  }

  function shareRealMeterBillWhatsApp(billId) {
    const bill = AppState.realMeterBills.find(b => b.id === billId);
    if (!bill) return;

    let msg = `⚡ *REAL MAIN ELECTRICITY BILL STATEMENT*\n`;
    msg += `🏢 *${AppState.settings.propertyName || 'RentFlow PG'}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📆 *Bill Month:* ${formatMonthName(bill.forMonth)}\n`;
    msg += `💰 *Main Bill Amount:* ${formatCurrency(bill.amount)}\n`;
    if (bill.units) msg += `⚡ *Main Meter Units:* ${bill.units} Units\n`;
    if (bill.billNumber) msg += `📄 *Consumer / Bill No:* ${bill.billNumber}\n`;
    msg += `📅 *Bill Date:* ${formatDateDisplay(bill.billDate)}\n`;
    if (bill.dueDate) msg += `⏳ *Due Date:* ${formatDateDisplay(bill.dueDate)}\n`;
    msg += `✅ *Status:* ${bill.paidStatus || 'Paid'}\n`;
    if (bill.paidStatus === 'Paid' && bill.paidDate) msg += `💳 *Paid On:* ${formatDateDisplay(bill.paidDate)} (${bill.paymentMode || 'Online'})\n`;
    if (bill.notes) msg += `📝 *Notes:* ${bill.notes}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Generated by RentFlow Pro Property Manager_`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  function shareRealMeterHistoryWhatsApp() {
    const activeBills = AppState.realMeterBills.filter(b => !b.isDeleted);
    const totalBilled = activeBills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    let msg = `⚡ *REAL MAIN ELECTRICITY BILLS SUMMARY*\n`;
    msg += `🏢 *${AppState.settings.propertyName || 'RentFlow PG'}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📊 Total Recorded Bills: *${activeBills.length} Months*\n`;
    msg += `💰 Total Main Bill Amount Paid: *${formatCurrency(totalBilled)}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📜 *RECENT MONTHLY BILLS:*\n`;

    activeBills.slice(0, 6).forEach(b => {
      msg += `• ${formatMonthName(b.forMonth)}: ${formatCurrency(b.amount)} (${b.paidStatus || 'Paid'})\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Generated by RentFlow Pro Property Manager_`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  }

  // ==========================================
  // 8. Backup & Restore (JSON / CSV Export)
  // ==========================================

  // Full PDF Backup Export
  function exportFullBackupPDF() {
    showToast('Preparing PDF Backup document...', 'info');

    // Financial totals calculation
    let totalExpected = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let totalAdvance = 0;

    AppState.tenants.forEach(t => {
      const fin = calculateTenantFinancials(t, AppState.selectedMonth);
      totalExpected += fin.totalExpectedRent;
      totalPaid += fin.totalRentPaid;
      if (fin.isDue) totalDue += fin.pendingDue;
      if (fin.isAdvance) totalAdvance += fin.netBalance;
    });

    const activeTenants = AppState.tenants.filter(t => t.status === 'active');

    // Create printable container
    const pdfWrap = document.createElement('div');
    pdfWrap.id = 'pdfBackupContainer';
    pdfWrap.style.fontFamily = "'Plus Jakarta Sans', Arial, sans-serif";
    pdfWrap.style.color = '#1f2937';
    pdfWrap.style.backgroundColor = '#ffffff';
    pdfWrap.style.padding = '20px';
    pdfWrap.style.lineHeight = '1.4';

    // Rooms list HTML
    const roomsRows = AppState.rooms.map(r => {
      const occupants = AppState.tenants.filter(t => t.roomId === r.id && t.status === 'active');
      const occupantNames = occupants.map(t => t.name).join(', ') || 'Vacant';
      return `
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">Room ${escapeHTML(r.number)}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${occupants.length} (${escapeHTML(occupantNames || 'Vacant')})</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca;">₹${Number(r.defaultRent || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #d97706; font-weight: bold;">${r.meterReading || '0'} Units</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${occupants.length > 0 ? '<span style="color: #16a34a; font-weight: bold;">Occupied</span>' : '<span style="color: #6b7280;">Vacant</span>'}</td>
        </tr>
      `;
    }).join('');

    // Tenants list HTML
    const tenantsRows = AppState.tenants.map(t => {
      const fin = calculateTenantFinancials(t, AppState.selectedMonth);
      let statusBadge = fin.isAdvance 
        ? `<span style="color: #7c3aed; font-weight: bold;">Advance: +₹${fin.netBalance.toLocaleString('en-IN')}</span>` 
        : fin.isDue 
        ? `<span style="color: #dc2626; font-weight: bold;">Due: -₹${fin.pendingDue.toLocaleString('en-IN')}</span>` 
        : `<span style="color: #16a34a; font-weight: bold;">Clear (₹0 Due)</span>`;

      return `
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">${escapeHTML(t.name)}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">Room ${escapeHTML(t.roomNumber || '-')}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${escapeHTML(t.phone || '-')}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${formatDateDisplay(t.joiningDate)}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">₹${Number(t.monthlyRent || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: bold;">₹${Number(fin.totalRentPaid || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${statusBadge}</td>
        </tr>
      `;
    }).join('');

    // Meter History Rows (Active only)
    const activeMeterHistory = AppState.meterHistory.filter(m => !m.isDeleted);
    const meterRows = activeMeterHistory.map(m => `
      <tr>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">Room ${escapeHTML(m.roomNumber || '-')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${formatMonthName(m.forMonth)}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${formatDateDisplay(m.date)}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${m.prevReading}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">${m.currentReading}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #d97706; font-weight: bold;">${m.units} U</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">₹${m.unitRate}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: bold;">₹${Number(m.totalBill || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #4338ca; font-weight: bold;">₹${Number(m.perPersonShare || 0).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    // Payments Rows (Active only)
    const sortedPayments = AppState.payments
      .filter(p => !p.isDeleted)
      .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));
    const paymentsRows = sortedPayments.map(p => `
      <tr>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #4338ca;">${escapeHTML(p.receiptNo || '-')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${formatDateDisplay(p.date)}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: bold;">${escapeHTML(p.tenantName || '-')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">Room ${escapeHTML(p.roomNumber || '-')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${formatMonthName(p.forMonth)}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: bold;">₹${Number(p.amount || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${escapeHTML(p.type || 'Rent')}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-size: 11px; color: #6b7280;">${escapeHTML(p.notes || '-')}</td>
      </tr>
    `).join('');

    pdfWrap.innerHTML = `
      <div style="border-bottom: 2px solid #4338ca; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h1 style="margin: 0 0 4px 0; color: #1e1b4b; font-size: 22px;">🏢 ${escapeHTML(AppState.settings.propertyName || 'RentFlow PG')}</h1>
          <p style="margin: 0; color: #4b5563; font-size: 13px;">Official Complete Data Backup & Financial Statement Report</p>
        </div>
        <div style="text-align: right; font-size: 12px; color: #4b5563;">
          <p style="margin: 0; font-weight: bold;">Owner: ${escapeHTML(AppState.settings.ownerName)} (${escapeHTML(AppState.settings.ownerPhone)})</p>
          <p style="margin: 2px 0 0 0;">Date: <strong>${formatDateDisplay(getTodayDate())}</strong></p>
        </div>
      </div>

      <!-- Financial KPI Summary Box -->
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 18px;">
        <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #334155; text-transform: uppercase;">📊 Financial Overview Summary</h3>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font-size: 12px;">
          <div>Total Rooms: <strong>${AppState.rooms.length} Rooms</strong></div>
          <div>Active Tenants: <strong>${activeTenants.length} Tenants</strong></div>
          <div>Total Expected Rent: <strong style="color: #4338ca;">₹${totalExpected.toLocaleString('en-IN')}</strong></div>
          <div>Total Rent Collected: <strong style="color: #16a34a;">₹${totalPaid.toLocaleString('en-IN')}</strong></div>
          <div>Total Pending Dues: <strong style="color: #dc2626;">₹${totalDue.toLocaleString('en-IN')}</strong></div>
          <div>Total Advance Balance: <strong style="color: #7c3aed;">+₹${totalAdvance.toLocaleString('en-IN')}</strong></div>
        </div>
      </div>

      <!-- Section 1: Rooms Overview -->
      <h3 style="margin: 14px 0 6px 0; font-size: 14px; color: #1e1b4b; border-left: 3px solid #4338ca; padding-left: 6px;">🚪 1. Rooms Directory (8 Fixed Rooms)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Room No</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Occupants</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Monthly Rent</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Current Meter</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${roomsRows}
        </tbody>
      </table>

      <!-- Section 2: Tenants & Balances -->
      <h3 style="margin: 14px 0 6px 0; font-size: 14px; color: #1e1b4b; border-left: 3px solid #16a34a; padding-left: 6px;">👥 2. Tenants & Balance Directory</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Tenant Name</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Room</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Phone</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Joining Date</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Rent/Month</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Total Paid</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Balance Status</th>
          </tr>
        </thead>
        <tbody>
          ${tenantsRows}
        </tbody>
      </table>

      <!-- Section 3: Meter Readings -->
      <h3 style="margin: 14px 0 6px 0; font-size: 14px; color: #1e1b4b; border-left: 3px solid #d97706; padding-left: 6px;">⚡ 3. Electricity Meter Readings & History</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Room</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Month</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Date</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Prev Reading</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Current Reading</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Units</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Rate</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Total Bill</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Per Tenant</th>
          </tr>
        </thead>
        <tbody>
          ${meterRows}
        </tbody>
      </table>

      <!-- Section 4: Payment Transactions -->
      <h3 style="margin: 14px 0 6px 0; font-size: 14px; color: #1e1b4b; border-left: 3px solid #7c3aed; padding-left: 6px;">🧾 4. Payment Transactions Record</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f1f5f9; text-align: left;">
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Receipt No</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Date</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Tenant</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Room</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Month</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Amount (₹)</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Type</th>
            <th style="padding: 6px 8px; border: 1px solid #cbd5e1;">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${paymentsRows}
        </tbody>
      </table>

      <!-- Footer Note -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 20px; font-size: 11px; color: #9ca3af; text-align: center;">
        This report was digitally generated by <strong>${escapeHTML(AppState.settings.propertyName || 'RentFlow PG')}</strong> management system. • Generated: ${new Date().toLocaleString('en-US')}
      </div>
    `;

    document.body.appendChild(pdfWrap);

    if (window.html2pdf) {
      const opt = {
        margin: [6, 6, 6, 6],
        filename: `RentFlow_Full_Backup_${getTodayDate()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(pdfWrap).save().then(() => {
        pdfWrap.remove();
        showToast('Full PDF Backup downloaded successfully!', 'success');
      }).catch(err => {
        console.error('PDF error:', err);
        pdfWrap.remove();
        showToast('Opening print dialog...', 'info');
        window.print();
      });
    } else {
      pdfWrap.remove();
      window.print();
    }
  }

  // Full JSON Backup Export
  function exportFullBackup() {
    const backupData = {
      appName: 'RentFlow Pro',
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      tenants: AppState.tenants,
      rooms: AppState.rooms,
      payments: AppState.payments,
      meterHistory: AppState.meterHistory,
      settings: AppState.settings
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const fileName = `RentFlow_Backup_${getTodayDate()}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('JSON Backup file downloaded successfully!', 'success');
  }

  // Restore JSON Backup
  DOM.importBackupInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.tenants && Array.isArray(imported.tenants)) AppState.tenants = imported.tenants;
        if (imported.rooms && Array.isArray(imported.rooms)) AppState.rooms = imported.rooms;
        if (imported.payments && Array.isArray(imported.payments)) AppState.payments = imported.payments;
        if (imported.meterHistory && Array.isArray(imported.meterHistory)) AppState.meterHistory = imported.meterHistory;
        if (imported.settings) AppState.settings = imported.settings;

        saveData();
        renderAll();
        showToast('JSON Backup restored successfully!', 'success');
      } catch (err) {
        showToast('Invalid backup file format!', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Export CSV of Payments (Active only)
  function exportPaymentsCSV() {
    const activePayments = AppState.payments.filter(p => !p.isDeleted);
    if (activePayments.length === 0) {
      showToast('No payment records to export', 'info');
      return;
    }

    const headers = ['Receipt No', 'Date', 'Tenant Name', 'Room No', 'For Month', 'Amount', 'Type', 'Notes'];
    const rows = activePayments.map(p => [
      `"${p.receiptNo || ''}"`,
      `"${p.date || ''}"`,
      `"${p.tenantName || ''}"`,
      `"${p.roomNumber || ''}"`,
      `"${p.forMonth || ''}"`,
      p.amount || 0,
      `"${p.type || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rent_Transactions_${getTodayDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Payments CSV exported successfully!', 'success');
  }

  // Load Sample / Real Data
  function loadDemoData() {
    if (!confirm('Reloading sample data will refresh the records for Rooms 1 to 8. Do you wish to proceed?')) return;
    importUserRealData();
    renderAll();
    showToast('Sample data refreshed & loaded!', 'success');
  }

  // Clear All Data (Keep 8 Rooms, Empty contents)
  async function clearAllData() {
    if (!confirm('⚠️ DATA CLEAR WARNING:\nAre you sure you want to clear all data (Tenants, Payments, Meter Readings) across all 8 Rooms?\n\n(Rooms 1 to 8 will remain intact, only tenant and billing data will be reset to empty/0).')) return;

    AppState.tenants = [];
    AppState.payments = [];
    AppState.meterHistory = [];
    AppState.realMeterBills = [];
    AppState.rooms = [
      { id: 'room_1', number: '1', defaultRent: 2000 },
      { id: 'room_2', number: '2', defaultRent: 2000 },
      { id: 'room_3', number: '3', defaultRent: 2000 },
      { id: 'room_4', number: '4', defaultRent: 2000 },
      { id: 'room_5', number: '5', defaultRent: 2000 },
      { id: 'room_6', number: '6', defaultRent: 2000 },
      { id: 'room_7', number: '7', defaultRent: 2000 },
      { id: 'room_8', number: '8', defaultRent: 2500 }
    ];

    saveData();
    if (typeof FirebaseManager !== 'undefined') {
      try {
        await FirebaseManager.pushToCloud(false);
      } catch (err) {
        console.warn('Cloud hard wipe sync notice:', err);
      }
    }
    renderAll();
    showToast('All 8 rooms data has been cleared (Rooms 1 to 8 are safe)!', 'success');
  }

  // ==========================================
  // 8.5. Firebase Cloud Auto-Sync Module
  // ==========================================
  const OFFICIAL_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDNSpvTOd1JQBSAqx2Ejz3bfcEAlQNFgOk",
    authDomain: "rent-8705c.firebaseapp.com",
    databaseURL: "https://rent-8705c-default-rtdb.firebaseio.com",
    projectId: "rent-8705c",
    storageBucket: "rent-8705c.firebasestorage.app",
    messagingSenderId: "713022987155",
    appId: "1:713022987155:web:d59e5848281e8e7d36e666",
    measurementId: "G-B5V3PE1F6R"
  };

  const FirebaseManager = {
    isInitialized: true,
    db: null,
    syncKey: 'rentflow_property_2025',
    databaseURL: OFFICIAL_FIREBASE_CONFIG.databaseURL,
    config: OFFICIAL_FIREBASE_CONFIG,

    getEndpointUrl() {
      let baseUrl = (this.databaseURL || OFFICIAL_FIREBASE_CONFIG.databaseURL).replace(/\/+$/, '');
      if (baseUrl.includes('console.firebase.google.com')) {
        const match = baseUrl.match(/project\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) baseUrl = `https://${match[1]}-default-rtdb.firebaseio.com`;
      }
      return `${baseUrl}/rentflow/${encodeURIComponent(this.syncKey)}.json`;
    },

    init() {
      const storedKey = localStorage.getItem('rentflow_cloud_sync_key');
      if (storedKey) this.syncKey = storedKey;
      if (DOM.settingCloudSyncKey) DOM.settingCloudSyncKey.value = this.syncKey;

      const storedConfig = localStorage.getItem('rentflow_firebase_config');
      if (storedConfig) {
        try {
          const parsed = JSON.parse(storedConfig);
          this.config = { ...OFFICIAL_FIREBASE_CONFIG, ...parsed };
          if (this.config.databaseURL) this.databaseURL = this.config.databaseURL;
        } catch (e) {
          console.warn('Firebase config parse notice', e);
          this.config = OFFICIAL_FIREBASE_CONFIG;
        }
      } else {
        this.config = OFFICIAL_FIREBASE_CONFIG;
      }

      // Initialize Firebase SDK with official config
      if (window.firebase && this.config) {
        try {
          if (!firebase.apps.length) {
            firebase.initializeApp(this.config);
          }
          this.db = firebase.database();
          this.setupRealtimeListener();
          console.log('Firebase Realtime Database initialized successfully with rent-8705c.');
        } catch (err) {
          console.warn('Firebase SDK init notice (REST mode active):', err);
        }
      }

      this.isInitialized = true;
      this.updateStatus(true, 'Cloud Auto-Sync Active');
    },

    updateStatus(online, label) {
      if (DOM.cloudSyncText) DOM.cloudSyncText.textContent = label;
      if (DOM.cloudSyncDot) {
        DOM.cloudSyncDot.className = online ? 'sync-dot pulse-green' : 'sync-dot';
        DOM.cloudSyncDot.style.backgroundColor = online ? '#10b981' : '#f59e0b';
      }
      if (DOM.cloudBadgeStatus) {
        DOM.cloudBadgeStatus.className = online ? 'badge badge-success' : 'badge badge-warning';
        DOM.cloudBadgeStatus.innerHTML = online 
          ? `<i class="fa-solid fa-circle-check"></i> Connected` 
          : `<i class="fa-solid fa-circle-pause"></i> Local Only`;
      }
    },

    // Helper to normalize data from Firebase (handles both Objects and Arrays)
    normalizeList(val) {
      if (!val) return [];
      if (Array.isArray(val)) return val.filter(Boolean);
      if (typeof val === 'object') return Object.values(val).filter(Boolean);
      return [];
    },

    setupRealtimeListener() {
      if (!this.db) return;
      try {
        const ref = this.db.ref('rentflow/' + this.syncKey);
        ref.on('value', snapshot => {
          const cloudData = snapshot.val();
          if (cloudData && cloudData.lastUpdated) {
            const localTimestamp = localStorage.getItem('rentflow_last_local_update') || '0';
            const cloudTimestamp = cloudData.lastUpdated;

            if (new Date(cloudTimestamp) > new Date(localTimestamp)) {
              this.applyCloudPayload(cloudData);
              localStorage.setItem('rentflow_last_local_update', cloudTimestamp);
              saveData();
              renderAll();
              this.updateStatus(true, 'Cloud Live Updated');
            }
          }
        });
      } catch (err) {
        console.warn('Firebase listener notice:', err);
      }
    },

    // Extracts and normalizes both root-level and room-nested collections
    applyCloudPayload(cloudData) {
      if (!cloudData) return;

      const extractedRooms = [];
      const extractedPayments = [];
      const extractedTenants = [];
      const extractedMeter = [];

      if (cloudData.rooms) {
        if (typeof cloudData.rooms === 'object' && !Array.isArray(cloudData.rooms)) {
          Object.keys(cloudData.rooms).forEach(k => {
            const r = cloudData.rooms[k];
            const parsedNum = k.replace(/[^0-9]/g, '') || (r.id ? r.id.replace(/[^0-9]/g, '') : '1');
            if (r.payments) extractedPayments.push(...this.normalizeList(r.payments));
            if (r.tenants) extractedTenants.push(...this.normalizeList(r.tenants));
            if (r.meterHistory) extractedMeter.push(...this.normalizeList(r.meterHistory));

            extractedRooms.push({
              id: r.id || `room_${parsedNum}`,
              number: String(r.number || parsedNum),
              defaultRent: Number(r.defaultRent) || 0,
              meterReading: String(r.meterReading || '0')
            });
          });
        } else {
          const rawRooms = this.normalizeList(cloudData.rooms);
          rawRooms.forEach((r, idx) => {
            const parsedNum = (r.id ? r.id.replace(/[^0-9]/g, '') : '') || String(idx + 1);
            if (r.payments) extractedPayments.push(...this.normalizeList(r.payments));
            if (r.tenants) extractedTenants.push(...this.normalizeList(r.tenants));
            if (r.meterHistory) extractedMeter.push(...this.normalizeList(r.meterHistory));

            extractedRooms.push({
              id: r.id || `room_${parsedNum}`,
              number: String(r.number || parsedNum),
              defaultRent: Number(r.defaultRent) || 0,
              meterReading: String(r.meterReading || '0')
            });
          });
        }
        if (extractedRooms.length > 0) AppState.rooms = extractedRooms;
      }

      // Merge and deduplicate payments
      const allPayments = [...(cloudData.payments ? this.normalizeList(cloudData.payments) : []), ...extractedPayments];
      if (allPayments.length > 0) {
        const uniquePayments = [];
        const seenPayIds = new Set();
        allPayments.forEach(p => {
          const key = p.id || p.receiptNo;
          if (key && !seenPayIds.has(key)) {
            seenPayIds.add(key);
            uniquePayments.push(p);
          }
        });
        AppState.payments = uniquePayments;
      }

      // Merge and deduplicate tenants
      const allTenants = [...(cloudData.tenants ? this.normalizeList(cloudData.tenants) : []), ...extractedTenants];
      if (allTenants.length > 0) {
        const uniqueTenants = [];
        const seenTenantIds = new Set();
        allTenants.forEach(t => {
          const key = t.id || `${t.name}_${t.phone}`;
          if (key && !seenTenantIds.has(key)) {
            seenTenantIds.add(key);
            uniqueTenants.push(t);
          }
        });
        AppState.tenants = uniqueTenants;
      }

      // Merge and deduplicate meter history
      const allMeter = [...(cloudData.meterHistory ? this.normalizeList(cloudData.meterHistory) : []), ...extractedMeter];
      if (allMeter.length > 0) {
        const uniqueMeter = [];
        const seenMeterIds = new Set();
        allMeter.forEach(m => {
          const key = m.id || `${m.roomId}_${m.forMonth}`;
          if (key && !seenMeterIds.has(key)) {
            seenMeterIds.add(key);
            uniqueMeter.push(m);
          }
        });
        AppState.meterHistory = uniqueMeter;
      }

      // Merge and deduplicate real main meter bills
      if (cloudData.realMeterBills) {
        const cloudBills = this.normalizeList(cloudData.realMeterBills);
        if (cloudBills.length > 0) {
          const uniqueBills = [];
          const seenBillIds = new Set();
          cloudBills.forEach(b => {
            const key = b.id || b.forMonth;
            if (key && !seenBillIds.has(key)) {
              seenBillIds.add(key);
              uniqueBills.push(b);
            }
          });
          AppState.realMeterBills = uniqueBills;
        }
      }

      if (cloudData.settings) {
        const s = cloudData.settings;
        if (s.ownerName && (s.ownerName.includes('Makan Malik') || s.ownerName.includes('Owner)'))) {
          s.ownerName = 'Property Owner';
        }
        if (s.receiptNote && (s.receiptNote.includes('Kiraya') || s.receiptNote.includes('tareekh'))) {
          s.receiptNote = 'Please pay monthly rent on time. Thank you!';
        }
        AppState.settings = { ...AppState.settings, ...s };
      }
    },

    async pushToCloud(silent = false) {
      const now = new Date().toISOString();
      localStorage.setItem('rentflow_last_local_update', now);
      this.updateStatus(true, 'Syncing...');

      // Transform arrays to named clean keys for Firebase tree design (No 0, 1, 2 indices)
      // And nest payments, tenants, and meter history directly inside each Room_X
      const keyedRooms = {};
      AppState.rooms.forEach(r => {
        const roomNum = String(r.number || '').replace(/[^0-9]/g, '') || String(r.id || '').replace(/[^0-9]/g, '');
        const k = `Room_${roomNum}`;

        const roomTenantsList = AppState.tenants.filter(t => {
          const tRoom = String(t.roomNumber || t.roomId || '').replace(/[^0-9]/g, '');
          return (tRoom === roomNum || t.roomId === r.id) && t.status !== 'vacated';
        });
        const roomTenantIds = roomTenantsList.map(t => t.id);

        const firstTenant = roomTenantsList[0];
        const tenantName = firstTenant ? (firstTenant.name || '') : '';
        const tenantPhone = firstTenant ? (firstTenant.phone || '') : '';

        const roomPaymentsObj = {};
        AppState.payments
          .filter(p => {
            const pRoom = String(p.roomNumber || '').replace(/[^0-9]/g, '');
            return (pRoom === roomNum || (p.tenantId && roomTenantIds.includes(p.tenantId))) && !p.isDeleted;
          })
          .forEach((p, i) => {
            const pKey = (p.receiptNo || p.id || `Pay_${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
            roomPaymentsObj[pKey] = p;
          });

        const roomTenantsObj = {};
        roomTenantsList.forEach((t, i) => {
          const tKey = (t.id || `Tenant_${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
          roomTenantsObj[tKey] = t;
        });

        const roomTotalCollected = AppState.payments
          .filter(p => {
            const pRoom = String(p.roomNumber || '').replace(/[^0-9]/g, '');
            return (pRoom === roomNum || (p.tenantId && roomTenantIds.includes(p.tenantId))) && !p.isDeleted;
          })
          .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        keyedRooms[k] = {
          id: r.id || `room_${roomNum}`,
          defaultRent: Number(r.defaultRent) || 0,
          name: tenantName || 'Vacant',
          number: tenantPhone || '-',
          totalCollected: roomTotalCollected,
          payments: roomPaymentsObj,
          tenants: roomTenantsObj
        };
      });

      const keyedTenants = {};
      AppState.tenants.forEach((t, i) => {
        const k = t.id || `Tenant_${i + 1}`;
        keyedTenants[k] = t;
      });

      const keyedPayments = {};
      AppState.payments.forEach((p, i) => {
        const k = (p.receiptNo || p.id || `Pay_${i + 1}`).replace(/[^a-zA-Z0-9_-]/g, '_');
        keyedPayments[k] = p;
      });

      const keyedMeter = {};
      AppState.meterHistory.forEach((m, i) => {
        const k = m.id || `Meter_${m.roomNumber || i + 1}_${m.forMonth || ''}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        keyedMeter[k] = m;
      });

      const keyedRealBills = {};
      AppState.realMeterBills.forEach((b, i) => {
        const k = (b.id || `RealBill_${b.forMonth || (i + 1)}`).replace(/[^a-zA-Z0-9_-]/g, '_');
        keyedRealBills[k] = b;
      });

      const payload = {
        rooms: keyedRooms,
        tenants: keyedTenants,
        payments: keyedPayments,
        meterHistory: keyedMeter,
        realMeterBills: keyedRealBills,
        settings: AppState.settings,
        lastUpdated: now
      };

      const baseUrl = (this.databaseURL || OFFICIAL_FIREBASE_CONFIG.databaseURL).replace(/\/+$/, '');
      const archiveUrl = `${baseUrl}/rentflow/${encodeURIComponent(this.syncKey)}_permanent_backup.json`;

      // 1. Primary: Direct REST API (Ultra reliable)
      try {
        const res = await fetch(this.getEndpointUrl(), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // Also update permanent archive table (Merges & never deletes anything)
        fetch(archiveUrl, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rooms: keyedRooms,
            payments: keyedPayments,
            tenants: keyedTenants,
            meterHistory: keyedMeter,
            realMeterBills: keyedRealBills,
            settings: AppState.settings,
            lastPermanentArchive: now
          })
        }).catch(err => console.warn('Permanent archive notice:', err));

        if (res.ok) {
          this.updateStatus(true, 'Cloud Auto-Synced');
          if (!silent) showToast('Data 100% saved to Firebase Cloud & Permanent Backup!', 'success');
          return;
        }
      } catch (restErr) {
        console.warn('REST push notice, trying SDK:', restErr);
      }

      // 2. Fallback: Firebase SDK
      if (this.db) {
        try {
          await this.db.ref('rentflow/' + this.syncKey).set(payload);

          // Permanent archive update via SDK
          this.db.ref('rentflow/' + this.syncKey + '_permanent_backup/payments').update(keyedPayments);
          this.db.ref('rentflow/' + this.syncKey + '_permanent_backup/tenants').update(keyedTenants);
          this.db.ref('rentflow/' + this.syncKey + '_permanent_backup/meterHistory').update(keyedMeter);
          this.db.ref('rentflow/' + this.syncKey + '_permanent_backup/realMeterBills').update(keyedRealBills);
          this.db.ref('rentflow/' + this.syncKey + '_permanent_backup/rooms').update(keyedRooms);

          this.updateStatus(true, 'Cloud Auto-Synced');
          if (!silent) showToast('Data 100% saved to Firebase Cloud & Permanent Backup!', 'success');
          return;
        } catch (sdkErr) {
          console.warn('SDK push error:', sdkErr);
        }
      }

      this.updateStatus(true, 'Local & Cloud Ready');
      if (!silent) showToast('Data safely stored in LocalStorage.', 'info');
    },

    async syncFromCloud() {
      showToast('Downloading data from Firebase Cloud...', 'info');

      // 1. Primary: Direct REST API
      try {
        const res = await fetch(this.getEndpointUrl());
        if (res.ok) {
          const data = await res.json();
          if (data && (data.tenants || data.payments || data.rooms)) {
            this.applyCloudPayload(data);
            saveData();
            renderAll();
            showToast('Latest data synced from Cloud successfully!', 'success');
            this.updateStatus(true, 'Cloud Connected');
            return;
          }
        }
      } catch (err) {
        console.warn('REST get error, trying SDK:', err);
      }

      // 2. Fallback: Firebase SDK
      if (this.db) {
        try {
          const snapshot = await this.db.ref('rentflow/' + this.syncKey).once('value');
          const data = snapshot.val();
          if (data) {
            this.applyCloudPayload(data);
            saveData();
            renderAll();
            showToast('Latest data synced from Cloud successfully!', 'success');
            this.updateStatus(true, 'Cloud Connected');
            return;
          }
        } catch (sdkErr) {
          console.warn('SDK fetch error:', sdkErr);
        }
      }

      showToast('Cloud data sync check complete.', 'info');
    },

    async deleteRoomFromCloud(roomNumber, roomId) {
      const key = `Room_${roomNumber || roomId}`;
      const baseUrl = (this.databaseURL || OFFICIAL_FIREBASE_CONFIG.databaseURL).replace(/\/+$/, '');
      const url = `${baseUrl}/rentflow/${encodeURIComponent(this.syncKey)}/rooms/${encodeURIComponent(key)}.json`;
      try {
        await fetch(url, { method: 'DELETE' });
      } catch (e) {
        console.warn('REST room delete notice:', e);
      }
      if (this.db) {
        try {
          await this.db.ref('rentflow/' + this.syncKey + '/rooms/' + key).remove();
        } catch (e) {
          console.warn('SDK room delete notice:', e);
        }
      }
    },

    async deleteTenantFromCloud(tenantId) {
      const baseUrl = (this.databaseURL || OFFICIAL_FIREBASE_CONFIG.databaseURL).replace(/\/+$/, '');
      const url = `${baseUrl}/rentflow/${encodeURIComponent(this.syncKey)}/tenants/${encodeURIComponent(tenantId)}.json`;
      try {
        await fetch(url, { method: 'DELETE' });
      } catch (e) {
        console.warn('REST tenant delete notice:', e);
      }
      if (this.db) {
        try {
          await this.db.ref('rentflow/' + this.syncKey + '/tenants/' + tenantId).remove();
        } catch (e) {
          console.warn('SDK tenant delete notice:', e);
        }
      }
    }
  };

  // ==========================================
  // 9. Event Listeners & Delegation
  // ==========================================

  // Tab Navigation
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  DOM.navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const tabTarget = this.getAttribute('data-tab');
      switchTab(tabTarget);
      if (window.innerWidth <= 768) {
        DOM.sidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
      }
    });
  });

  function switchTab(tabId) {
    AppState.currentTab = tabId;
    DOM.navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) item.classList.add('active');
      else item.classList.remove('active');
    });

    DOM.tabPanes.forEach(pane => {
      if (pane.id === `tab-${tabId}`) pane.classList.add('active');
      else pane.classList.remove('active');
    });

    // Update Header titles
    const titles = {
      dashboard: { title: 'Dashboard', sub: 'Rent and tenant management overview' },
      tenants: { title: 'Tenants Directory', sub: 'Active occupants and financial balances' },
      rooms: { title: 'Room Management', sub: 'Live occupancy and room details' },
      payments: { title: 'Payments & Transactions', sub: 'Rent collection records and digital receipts' },
      reports: { title: 'Monthly Financial Reports', sub: 'Annual and monthly income breakdown' },
      settings: { title: 'Settings & Backup', sub: 'Property configuration and cloud backup' },
      'tenant-profile': { title: 'Tenant Profile & Statement', sub: 'Detailed rent statement and payment history' }
    };

    if (titles[tabId]) {
      DOM.pageHeaderTitle.textContent = titles[tabId].title;
      DOM.pageHeaderSubtitle.textContent = titles[tabId].sub;
    }
  }

  // Mobile Menu Toggles
  if (DOM.openSidebarBtn) {
    DOM.openSidebarBtn.addEventListener('click', () => {
      DOM.sidebar.classList.add('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    });
  }
  if (DOM.closeSidebarBtn) {
    DOM.closeSidebarBtn.addEventListener('click', () => {
      DOM.sidebar.classList.remove('open');
      if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    });
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      DOM.sidebar.classList.remove('open');
      sidebarBackdrop.classList.remove('active');
    });
  }

  // Global Month Filter Change
  DOM.globalMonthFilter.addEventListener('change', function () {
    AppState.selectedMonth = this.value;
    renderDashboard();
    renderTenantsList();
  });

  // Quick Action Buttons
  DOM.btnQuickRecordPayment.addEventListener('click', () => openRecordPaymentModal());
  if (DOM.btnQuickAddTenant) DOM.btnQuickAddTenant.addEventListener('click', () => openAddTenantModal());
  DOM.quickExportBtn.addEventListener('click', exportFullBackupPDF);
  if (DOM.btnExportFullBackupPDF) DOM.btnExportFullBackupPDF.addEventListener('click', exportFullBackupPDF);
  DOM.btnExportFullBackup.addEventListener('click', exportFullBackup);
  DOM.btnExportPaymentsCSV.addEventListener('click', exportPaymentsCSV);
  DOM.btnLoadDemoData.addEventListener('click', loadDemoData);
  if (DOM.btnClearAllData) DOM.btnClearAllData.addEventListener('click', clearAllData);

  // Setting: Clear / Empty Room Data (Keep Room, Wipe Contents)
  const btnSettingClearRoomData = document.getElementById('btnSettingClearRoomData');
  if (btnSettingClearRoomData) {
    btnSettingClearRoomData.addEventListener('click', function () {
      const select = document.getElementById('settingClearRoomSelect');
      const target = select ? select.value : 'all_rooms';

      if (target === 'all_rooms') {
        if (!confirm('⚠️ DATA CLEAR WARNING:\nAre you sure you want to clear all data (Tenants, Payments, Meter Readings) across all 8 rooms?\n\n(Rooms 1 to 8 will remain safe and intact, only occupants and billing records will be emptied).')) return;

        AppState.tenants = [];
        AppState.payments = [];
        AppState.meterHistory = [];
        AppState.rooms.forEach(r => {
          r.meterReading = '0';
        });

        saveData();
        renderAll();
        showToast('All 8 rooms data has been cleared (Rooms 1 to 8 are safe)!', 'success');
      } else {
        const room = AppState.rooms.find(r => r.id === target);
        if (!room) return;

        if (!confirm(`⚠️ DATA CLEAR WARNING:\nAre you sure you want to clear all data (tenants, payments, meter readings) for Room ${room.number}?\n\n(Room ${room.number} will remain safe, only its occupants and billing records will be cleared).`)) return;

        const roomTenantIds = AppState.tenants.filter(t => t.roomId === target).map(t => t.id);

        AppState.tenants = AppState.tenants.filter(t => t.roomId !== target);
        AppState.payments = AppState.payments.filter(p => !roomTenantIds.includes(p.tenantId) && p.roomNumber !== room.number);
        AppState.meterHistory = AppState.meterHistory.filter(m => m.roomId !== target);
        room.meterReading = '0';

        if (typeof FirebaseManager !== 'undefined') {
          roomTenantIds.forEach(tId => FirebaseManager.deleteTenantFromCloud(tId));
        }

        saveData();
        renderAll();
        showToast(`All data for Room ${room.number} has been cleared!`, 'success');
      }
    });
  }

  DOM.btnPrintReportBtn.addEventListener('click', () => window.print());

  if (DOM.btnOpenAddTenantModal) DOM.btnOpenAddTenantModal.addEventListener('click', () => openAddTenantModal());
  if (DOM.btnOpenAddRoomModal) DOM.btnOpenAddRoomModal.addEventListener('click', openAddRoomModal);
  DOM.btnOpenRecordPaymentModal.addEventListener('click', () => openRecordPaymentModal());

  // Meter Calculator Buttons
  if (DOM.btnOpenMeterCalcModal) {
    DOM.btnOpenMeterCalcModal.addEventListener('click', () => openMeterCalculatorModal());
  }
  if (DOM.detailMeterKpiCard) {
    DOM.detailMeterKpiCard.addEventListener('click', function () {
      if (currentDetailTenant) {
        openMeterCalculatorModal(currentDetailTenant.roomId);
      } else {
        openMeterCalculatorModal();
      }
    });
  }

  if (DOM.detailBtnAddMeterReading) {
    DOM.detailBtnAddMeterReading.addEventListener('click', function () {
      if (currentDetailTenant) {
        openMeterCalculatorModal(currentDetailTenant.roomId);
      } else {
        openMeterCalculatorModal();
      }
    });
  }

  if (DOM.detailBtnMeterBill) {
    DOM.detailBtnMeterBill.addEventListener('click', function () {
      if (currentDetailTenant) {
        openMeterCalculatorModal(currentDetailTenant.roomId);
      } else {
        openMeterCalculatorModal();
      }
    });
  }

  // Search & Filter Events
  if (DOM.tenantSearchInput) DOM.tenantSearchInput.addEventListener('input', renderTenantsList);
  if (DOM.dashTenantSearch) DOM.dashTenantSearch.addEventListener('input', renderDashboardTenantTable);
  if (DOM.paymentSearchInput) DOM.paymentSearchInput.addEventListener('input', renderPaymentsList);
  if (DOM.paymentMonthFilter) DOM.paymentMonthFilter.addEventListener('change', renderPaymentsList);
  if (DOM.reportYearFilter) DOM.reportYearFilter.addEventListener('change', renderReports);

  // Real Main Electricity Meter Events
  if (DOM.btnOpenRealMeterHistoryModal) DOM.btnOpenRealMeterHistoryModal.addEventListener('click', openRealMeterHistoryModal);
  if (DOM.btnOpenRecordRealMeterModal) DOM.btnOpenRecordRealMeterModal.addEventListener('click', () => openRecordRealMeterModal(null, AppState.selectedMonth));
  if (DOM.btnModalAddRealMeter) DOM.btnModalAddRealMeter.addEventListener('click', () => openRecordRealMeterModal(null, AppState.selectedMonth));
  if (DOM.realMeterBillForm) DOM.realMeterBillForm.addEventListener('submit', saveRealMeterBill);
  if (DOM.realMeterPaidStatus) DOM.realMeterPaidStatus.addEventListener('change', updateRealMeterPaidFieldVisibility);
  if (DOM.realMeterHistSearch) DOM.realMeterHistSearch.addEventListener('input', renderRealMeterHistoryTable);
  if (DOM.realMeterHistYearFilter) DOM.realMeterHistYearFilter.addEventListener('change', renderRealMeterHistoryTable);
  if (DOM.btnExportRealMeterCSV) DOM.btnExportRealMeterCSV.addEventListener('click', exportRealMeterBillsCSV);
  if (DOM.btnShareRealMeterHistoryWhatsApp) DOM.btnShareRealMeterHistoryWhatsApp.addEventListener('click', shareRealMeterHistoryWhatsApp);

  // Tenant Filter Tabs
  DOM.filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      DOM.filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeTenantFilter = this.getAttribute('data-filter');
      renderTenantsList();
    });
  });

  // View Due Tenants from Dashboard Alert
  if (DOM.viewDueTenantsBtn) {
    DOM.viewDueTenantsBtn.addEventListener('click', () => {
      switchTab('tenants');
      const pendingBtn = document.querySelector('[data-filter="pending"]');
      if (pendingBtn) pendingBtn.click();
    });
  }
  if (DOM.openDueListBtn) {
    DOM.openDueListBtn.addEventListener('click', () => {
      switchTab('tenants');
      const pendingBtn = document.querySelector('[data-filter="pending"]');
      if (pendingBtn) pendingBtn.click();
    });
  }

  // Modal Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', function () {
      const modalId = this.getAttribute('data-close');
      const modalEl = document.getElementById(modalId);
      closeModal(modalEl);
    });
  });

  // Close modal when clicking on overlay background
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal(this);
    });
  });

  // Global Delegated Click Handlers
  document.addEventListener('click', function (e) {
    // If clicked on direct link like whatsapp link, let it open normally
    if (e.target.closest('a')) return;

    // Real Meter Action Buttons
    const btnEditRealMeter = e.target.closest('.btn-edit-real-meter');
    if (btnEditRealMeter) {
      const billId = btnEditRealMeter.getAttribute('data-id');
      openRecordRealMeterModal(billId);
      return;
    }

    const btnDeleteRealMeter = e.target.closest('.btn-delete-real-meter');
    if (btnDeleteRealMeter) {
      const billId = btnDeleteRealMeter.getAttribute('data-id');
      deleteRealMeterBill(billId);
      return;
    }

    const btnShareRealMeter = e.target.closest('.btn-share-real-meter-row');
    if (btnShareRealMeter) {
      const billId = btnShareRealMeter.getAttribute('data-id');
      shareRealMeterBillWhatsApp(billId);
      return;
    }

    // 1. Record payment for specific tenant
    const btnPayFor = e.target.closest('.btn-record-pay-for');
    if (btnPayFor) {
      const tenantId = btnPayFor.getAttribute('data-id');
      openRecordPaymentModal(tenantId);
      return;
    }

    // 2. Edit Tenant
    const btnEditTenant = e.target.closest('.btn-edit-tenant');
    if (btnEditTenant) {
      const tenantId = btnEditTenant.getAttribute('data-id');
      openEditTenantModal(tenantId);
      return;
    }

    // 3. Delete Tenant (Hard Delete tenant + payments + Cloud)
    const btnDeleteTenant = e.target.closest('.btn-delete-tenant');
    if (btnDeleteTenant) {
      const tenantId = btnDeleteTenant.getAttribute('data-id');
      const tenant = AppState.tenants.find(t => t.id === tenantId);
      if (tenant && confirm(`⚠️ DELETE TENANT:\nAre you sure you want to delete "${tenant.name}"?\nThis tenant will be removed from both Firebase Cloud and local records!`)) {
        AppState.tenants = AppState.tenants.filter(t => t.id !== tenantId);
        AppState.payments = AppState.payments.filter(p => p.tenantId !== tenantId);

        if (typeof FirebaseManager !== 'undefined') {
          FirebaseManager.deleteTenantFromCloud(tenant.id);
        }

        saveData();
        renderAll();
        showToast(`Tenant "${tenant.name}" deleted successfully!`, 'info');
      }
      return;
    }

    // 4. Add tenant directly to a specific room
    const btnAddTenantToRoom = e.target.closest('.btn-add-tenant-to-room');
    if (btnAddTenantToRoom) {
      const roomId = btnAddTenantToRoom.getAttribute('data-room-id');
      openAddTenantModal(roomId);
      return;
    }

    // 4.5. Open Electricity Meter Calculator for specific room
    const btnRoomMeter = e.target.closest('.btn-room-meter');
    if (btnRoomMeter) {
      const roomId = btnRoomMeter.getAttribute('data-room-id');
      openMeterCalculatorModal(roomId);
      return;
    }

    // 5. Open Tenant Detail Page on Hisaab button or card click
    const btnViewTenantDetail = e.target.closest('.btn-view-tenant-detail');
    if (btnViewTenantDetail) {
      const tenantId = btnViewTenantDetail.getAttribute('data-id');
      if (tenantId) {
        openTenantProfilePage(tenantId);
        return;
      }
    }

    const clickableOccupant = e.target.closest('.clickable-occupant');
    if (clickableOccupant) {
      const tenantId = clickableOccupant.getAttribute('data-tenant-id');
      if (tenantId) {
        openTenantProfilePage(tenantId);
        return;
      }
    }

    // Edit Room
    const btnEditRoom = e.target.closest('.btn-edit-room');
    if (btnEditRoom) {
      const roomId = btnEditRoom.getAttribute('data-id');
      openEditRoomModal(roomId);
      return;
    }

    // Clear Room Contents
    const btnClearRoomContents = e.target.closest('.btn-clear-room-contents');
    if (btnClearRoomContents) {
      const roomId = btnClearRoomContents.getAttribute('data-id');
      const room = AppState.rooms.find(r => r.id === roomId);
      if (room && confirm(`⚠️ DATA CLEAR WARNING:\nAre you sure you want to clear all data (tenants, payments and meter readings) for Room ${room.number}?\n\n(Room ${room.number} will remain safe, only its data will be cleared).`)) {
        const roomTenantIds = AppState.tenants.filter(t => t.roomId === roomId).map(t => t.id);

        AppState.tenants = AppState.tenants.filter(t => t.roomId !== roomId);
        AppState.payments = AppState.payments.filter(p => !roomTenantIds.includes(p.tenantId) && p.roomNumber !== room.number);
        AppState.meterHistory = AppState.meterHistory.filter(m => m.roomId !== roomId);
        room.meterReading = '0';

        if (typeof FirebaseManager !== 'undefined') {
          roomTenantIds.forEach(tId => FirebaseManager.deleteTenantFromCloud(tId));
        }

        saveData();
        renderAll();
        showToast(`All data for Room ${room.number} has been cleared!`, 'success');
      }
      return;
    }

    // View Receipt
    const btnViewRec = e.target.closest('.btn-view-receipt');
    if (btnViewRec) {
      const payId = btnViewRec.getAttribute('data-id');
      const payment = AppState.payments.find(p => p.id === payId);
      if (payment) showDigitalReceipt(payment);
      return;
    }

    // Edit Payment
    const btnEditPay = e.target.closest('.btn-edit-payment');
    if (btnEditPay) {
      const payId = btnEditPay.getAttribute('data-id');
      openEditPaymentModal(payId);
      return;
    }

    // Soft-Delete Payment
    const btnDeletePay = e.target.closest('.btn-delete-payment');
    if (btnDeletePay) {
      const payId = btnDeletePay.getAttribute('data-id');
      const pay = AppState.payments.find(p => p.id === payId);
      if (confirm(`Are you sure you want to delete payment entry ${pay ? pay.receiptNo + ' (₹' + pay.amount + ')' : ''}?`)) {
        if (pay) {
          pay.isDeleted = true;
          pay.deletedAt = new Date().toISOString();
          pay.deletedBy = 'Owner';
        }
        saveData('payments');
        renderAll();
        if (currentDetailTenant) {
          openTenantProfilePage(currentDetailTenant.id);
        }
        showToast('Payment record has been deleted.', 'info');
      }
      return;
    }

    // Share Meter History Row on WhatsApp
    const btnShareMeterRow = e.target.closest('.btn-share-meter-row');
    if (btnShareMeterRow) {
      const recId = btnShareMeterRow.getAttribute('data-id');
      const rec = AppState.meterHistory.find(m => m.id === recId && !m.isDeleted);
      if (rec) {
        const room = AppState.rooms.find(r => r.id === rec.roomId);
        const roomTenants = AppState.tenants.filter(t => t.roomId === rec.roomId && t.status === 'active');
        const text =
`⚡ *Electricity Meter Bill Breakdown*
🏢 *${AppState.settings.propertyName || 'RentFlow PG'}* - Room ${rec.roomNumber || (room ? room.number : '')}
📅 *Date:* ${formatDateDisplay(rec.date)}
📆 *For Month:* ${formatMonthName(rec.forMonth)}
----------------------------------
• Previous Reading: ${rec.prevReading}
• Current Reading: ${rec.currentReading}
• ⚡ *Units Consumed:* ${rec.units} Units
• Unit Rate: ₹${rec.unitRate}/Unit
💰 *Total Room Bill:* ₹${Number(rec.totalBill).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
👥 *Occupants:* ${roomTenants.length > 0 ? roomTenants.length : 1}
👉 *Per Tenant Share:* ₹${Number(rec.perPersonShare).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
----------------------------------
*Owner:* ${AppState.settings.ownerName} (${AppState.settings.ownerPhone})`;

        const encoded = encodeURIComponent(text);
        let phone = '';
        if (currentDetailTenant && currentDetailTenant.phone) {
          phone = currentDetailTenant.phone.replace(/[^0-9]/g, '');
        }
        const waUrl = phone 
          ? `https://api.whatsapp.com/send?phone=${phone.length === 10 ? '91' + phone : phone}&text=${encoded}`
          : `https://api.whatsapp.com/send?text=${encoded}`;
        window.open(waUrl, '_blank');
      }
      return;
    }

    // Soft-Delete Meter History Row
    const btnDeleteMeterRow = e.target.closest('.btn-delete-meter-row');
    if (btnDeleteMeterRow) {
      const recId = btnDeleteMeterRow.getAttribute('data-id');
      const rec = AppState.meterHistory.find(m => m.id === recId);
      if (confirm('Are you sure you want to delete this meter reading entry?')) {
        if (rec) {
          rec.isDeleted = true;
          rec.deletedAt = new Date().toISOString();
          rec.deletedBy = 'Owner';

          // Update room's current reading to the latest remaining active reading
          const remainingActive = AppState.meterHistory
            .filter(m => m.roomId === rec.roomId && !m.isDeleted)
            .sort((a, b) => new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp));
          const room = AppState.rooms.find(r => r.id === rec.roomId);
          if (room) {
            room.meterReading = remainingActive.length > 0 ? `${remainingActive[0].currentReading}` : '0';
            saveData('rooms');
            if (DOM.detailMeterReading && currentDetailTenant && currentDetailTenant.roomId === room.id) {
              DOM.detailMeterReading.textContent = `${room.meterReading} Units`;
            }
          }
        }
        saveData('meter');
        if (currentDetailTenant) {
          renderTenantMeterHistory(currentDetailTenant.roomId);
        }
        renderRoomsList();
        showToast('Meter reading record has been deleted.', 'info');
      }
      return;
    }
  });

  // Utility to escape HTML to prevent XSS
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Cloud Sync Event Listeners
  if (DOM.btnSaveCloudKey) {
    DOM.btnSaveCloudKey.addEventListener('click', function () {
      const key = DOM.settingCloudSyncKey.value.trim();
      if (!key) {
        showToast('Please enter a valid Sync Code.', 'warning');
        return;
      }
      FirebaseManager.syncKey = key;
      localStorage.setItem('rentflow_cloud_sync_key', key);
      showToast(`Property Cloud Sync Code saved: "${key}"`, 'success');
      FirebaseManager.pushToCloud(false);
    });
  }

  if (DOM.btnPushToCloud) {
    DOM.btnPushToCloud.addEventListener('click', () => FirebaseManager.pushToCloud(false));
  }

  if (DOM.btnSyncFromCloud) {
    DOM.btnSyncFromCloud.addEventListener('click', () => FirebaseManager.syncFromCloud());
  }

  if (DOM.cloudSyncPill) {
    DOM.cloudSyncPill.addEventListener('click', () => {
      switchTab('settings');
      showToast('Cloud Auto-Sync settings opened.', 'info');
    });
  }

  if (DOM.btnOpenFirebaseConfig) {
    DOM.btnOpenFirebaseConfig.addEventListener('click', () => {
      if (DOM.fbDbUrl) DOM.fbDbUrl.value = (FirebaseManager.config && FirebaseManager.config.databaseURL) ? FirebaseManager.config.databaseURL : 'https://rent-8705c-default-rtdb.firebaseio.com';
      if (DOM.fbApiKey) DOM.fbApiKey.value = (FirebaseManager.config && FirebaseManager.config.apiKey) ? FirebaseManager.config.apiKey : '';
      if (DOM.fbSyncCode) DOM.fbSyncCode.value = FirebaseManager.syncKey;
      openModal(DOM.firebaseModal);
    });
  }

  if (DOM.firebaseConfigForm) {
    DOM.firebaseConfigForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let dbUrl = DOM.fbDbUrl.value.trim();
      const apiKey = DOM.fbApiKey.value.trim();
      const syncCode = DOM.fbSyncCode.value.trim() || 'rentflow_prop_2026';

      // Auto-correct if user pasted Firebase Console URL
      if (dbUrl.includes('console.firebase.google.com')) {
        const match = dbUrl.match(/project\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          dbUrl = `https://${match[1]}-default-rtdb.firebaseio.com`;
          DOM.fbDbUrl.value = dbUrl;
        }
      }

      // Remove trailing slash
      dbUrl = dbUrl.replace(/\/+$/, '');

      const config = { databaseURL: dbUrl };
      if (apiKey) config.apiKey = apiKey;

      localStorage.setItem('rentflow_firebase_config', JSON.stringify(config));
      localStorage.setItem('rentflow_cloud_sync_key', syncCode);

      FirebaseManager.config = config;
      FirebaseManager.syncKey = syncCode;
      if (DOM.settingCloudSyncKey) DOM.settingCloudSyncKey.value = syncCode;

      closeModal(DOM.firebaseModal);
      showToast('Firebase Cloud settings saved! Reconnecting...', 'success');
      FirebaseManager.init();
      FirebaseManager.pushToCloud(false);
    });
  }

  // ==========================================
  // 10. Application Bootstrap
  // ==========================================
  function init() {
    loadStoredData();
    renderAll();
    FirebaseManager.init();
    // Proactively push data on boot to ensure rooms, payment history & tenants are live in Firebase
    setTimeout(() => {
      if (FirebaseManager && FirebaseManager.isInitialized) {
        FirebaseManager.pushToCloud(true);
      }
    }, 600);
    console.log('RentFlow Pro initialized with Firebase Cloud Auto-Sync.');
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

