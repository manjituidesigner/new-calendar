// Basic in-memory + localStorage data model
const STORAGE_KEY = "mobileWorkCalendars_v1"
const EXPENSES_STORAGE_KEY = "mobileExpensesCalendars_v1"

let calendars = []
let activeCalendarId = null
let currentDate = new Date()
let selectedDate = null
let editingCalendarId = null

// Expenses data
let expensesCalendars = []
let activeExpensesCalendarId = null
let activeMode = "office" // "office" | "expenses"

// Elements
const monthLabel = document.getElementById("monthLabel")
const yearLabel = document.getElementById("yearLabel")
const daysGrid = document.getElementById("daysGrid")

const statDaysInMonth = document.getElementById("statDaysInMonth")
const statPresent = document.getElementById("statPresent")
const statLeave = document.getElementById("statLeave")
const statAbsent = document.getElementById("statAbsent")
const statHalfDay = document.getElementById("statHalfDay")
const statHoliday = document.getElementById("statHoliday")
const statExtraDays = document.getElementById("statExtraDays")
const statWorkingHours = document.getElementById("statWorkingHours")
const statSalary = document.getElementById("statSalary")
const statLate = document.getElementById("statLate")
const statExtra = document.getElementById("statExtra")

// Session bar elements
const sessionBar = document.getElementById("sessionBar")
const sessionStatusEl = document.getElementById("sessionStatus")
const sessionProductivityEl = document.getElementById("sessionProductivity")
const sessionStartTimeEl = document.getElementById("sessionStartTime")
const sessionWorkedEl = document.getElementById("sessionWorked")
const sessionBreakEl = document.getElementById("sessionBreak")
const sessionBreakBtn = document.getElementById("sessionBreakBtn")
const sessionBackBtn = document.getElementById("sessionBackBtn")
const sessionEndBtn = document.getElementById("sessionEndBtn")

const overlay = document.getElementById("overlay")
const drawer = document.getElementById("drawer")
const menuBtn = document.getElementById("menuBtn")
const drawerCloseBtn = document.getElementById("drawerCloseBtn")
const drawerSettingsBtn = document.getElementById("drawerSettingsBtn")
const reportBtn = document.getElementById("reportBtn")
const settingsPage = document.getElementById("settingsPage")
const settingsCloseBtn = document.getElementById("settingsCloseBtn")

const drawerTabs = document.querySelectorAll(".drawer-tab")
const drawerPanels = document.querySelectorAll(".drawer-panel")

drawerTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    drawerTabs.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    const target = btn.dataset.tab
    drawerPanels.forEach((p) => p.classList.remove("active"))
    const panel = document.getElementById(`${target}Tab`)
    if (panel) panel.classList.add("active")

    if (target === "expenses") {
      activeMode = "expenses"
      if (officeStatsSection) officeStatsSection.classList.add("hidden")
      if (expensesStatsSection) expensesStatsSection.classList.remove("hidden")
      if (expensesPayeeSection) expensesPayeeSection.classList.remove("hidden")
    } else {
      activeMode = "office"
      if (officeStatsSection) officeStatsSection.classList.remove("hidden")
      if (expensesStatsSection) expensesStatsSection.classList.add("hidden")
      if (expensesPayeeSection) expensesPayeeSection.classList.add("hidden")
    }

    updateAppTitle()
    renderCalendar()
  })
})

const calendarListEl = document.getElementById("calendarList")
const createCalendarToggle = document.getElementById("createCalendarToggle")
const calendarForm = document.getElementById("calendarForm")
const calendarSubmitBtn = calendarForm.querySelector('button[type="submit"]')

const backupExportBtn = document.getElementById("backupExportBtn")
const backupImportBtn = document.getElementById("backupImportBtn")
const backupFileInput = document.getElementById("backupFileInput")

const calendarNameInput = document.getElementById("calendarName")
const calendarDescriptionInput = document.getElementById("calendarDescription")
const salaryMonthlyInput = document.getElementById("salaryMonthly")
const salaryHourlyInput = document.getElementById("salaryHourly")
const workingDaysPerWeekInput = document.getElementById("workingDaysPerWeek")
const calendarPinInput = document.getElementById("calendarPin")
const officeInTimeInput = document.getElementById("officeInTime")
const officeOutTimeInput = document.getElementById("officeOutTime")

// Settings / holidays elements
const settingsHolidaysCard = document.getElementById("settingsHolidaysCard")
const holidaySettings = document.getElementById("holidaySettings")
const holidayMonthLabel = document.getElementById("holidayMonthLabel")
const holidayDayInput = document.getElementById("holidayDayInput")
const holidayNameInput = document.getElementById("holidayNameInput")
const holidayAddBtn = document.getElementById("holidayAddBtn")
const holidayList = document.getElementById("holidayList")
const holidayPrevMonthBtn = document.getElementById("holidayPrevMonthBtn")
const holidayNextMonthBtn = document.getElementById("holidayNextMonthBtn")

const prevMonthBtn = document.getElementById("prevMonthBtn")
const nextMonthBtn = document.getElementById("nextMonthBtn")

const appTitleEl = document.querySelector(".app-title")

let sessionIntervalId = null
let activeSessionKey = null
let pendingPinCalendarId = null
let pendingPinAction = null
let pendingDeleteCalendarId = null
let editingExpensesCalendarId = null
let editingExpenseEntryId = null

const pinModal = document.getElementById("pinModal")
const pinModalCloseBtn = document.getElementById("pinModalCloseBtn")
const pinCancelBtn = document.getElementById("pinCancelBtn")
const pinUnlockBtn = document.getElementById("pinUnlockBtn")
const pinCalendarName = document.getElementById("pinCalendarName")
const pinInput = document.getElementById("pinInput")

const deleteModal = document.getElementById("deleteModal")
const deleteModalCloseBtn = document.getElementById("deleteModalCloseBtn")
const deleteCancelBtn = document.getElementById("deleteCancelBtn")
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn")
const deleteCalendarName = document.getElementById("deleteCalendarName")
let pendingDeleteCalendarType = "office" // "office" | "expenses"

const clearMonthBtn = document.getElementById("clearMonthBtn")
const clearMonthModal = document.getElementById("clearMonthModal")
const clearMonthCloseBtn = document.getElementById("clearMonthCloseBtn")
const clearMonthCancelBtn = document.getElementById("clearMonthCancelBtn")
const clearMonthConfirmBtn = document.getElementById("clearMonthConfirmBtn")
const clearMonthLabel = document.getElementById("clearMonthLabel")

const endReminderModal = document.getElementById("endReminderModal")
const endReminderCloseBtn = document.getElementById("endReminderCloseBtn")
const endReminderStopBtn = document.getElementById("endReminderStopBtn")
const endReminderSubtitle = document.getElementById("endReminderSubtitle")

const runningModal = document.getElementById("runningModal")
const runningModalCloseBtn = document.getElementById("runningModalCloseBtn")
const runningOkBtn = document.getElementById("runningOkBtn")
const runningModalCalendarName = document.getElementById("runningModalCalendarName")

const breakModal = document.getElementById("breakModal")
const breakModalCloseBtn = document.getElementById("breakModalCloseBtn")
const breakCancelBtn = document.getElementById("breakCancelBtn")
const breakDoneBtn = document.getElementById("breakDoneBtn")
const breakModalCalendarName = document.getElementById("breakModalCalendarName")
const breakReasonInput = document.getElementById("breakReasonInput")

if (createCalendarToggle && calendarForm && calendarSubmitBtn) {
  createCalendarToggle.setAttribute("type", "button")

  createCalendarToggle.addEventListener("click", () => {
    const willShow = !calendarForm.classList.contains("visible")
    calendarForm.classList.toggle("visible")

    if (willShow) {
      if (calendarNameInput) calendarNameInput.value = ""
      if (calendarDescriptionInput) calendarDescriptionInput.value = ""
      if (salaryMonthlyInput) salaryMonthlyInput.value = ""
      if (salaryHourlyInput) salaryHourlyInput.value = ""
      if (workingDaysPerWeekInput) workingDaysPerWeekInput.value = "6"
      if (calendarPinInput) calendarPinInput.value = ""
      if (officeInTimeInput) officeInTimeInput.value = ""
      if (officeOutTimeInput) officeOutTimeInput.value = ""
      editingCalendarId = null
      setTimeout(() => {
        calendarForm.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 0)
    }
  })

  calendarForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!calendarNameInput) return

    const name = calendarNameInput.value.trim()
    if (!name) {
      alert("Please enter a calendar name.")
      return
    }

    const description = calendarDescriptionInput
      ? calendarDescriptionInput.value.trim()
      : ""
    const salaryMonthly = salaryMonthlyInput
      ? Number(salaryMonthlyInput.value) || 0
      : 0
    const salaryHourly = salaryHourlyInput
      ? Number(salaryHourlyInput.value) || 0
      : 0
    const workingDaysPerWeek = workingDaysPerWeekInput
      ? Number(workingDaysPerWeekInput.value) || 6
      : 6
    const pin = calendarPinInput ? calendarPinInput.value.trim() || null : null

    let scheduleInMinutes = null
    let scheduleOutMinutes = null
    if (officeInTimeInput && officeInTimeInput.value) {
      const dt = buildDateWithTime(new Date(), officeInTimeInput.value)
      if (dt) scheduleInMinutes = dt.getHours() * 60 + dt.getMinutes()
    }
    if (officeOutTimeInput && officeOutTimeInput.value) {
      const dt = buildDateWithTime(new Date(), officeOutTimeInput.value)
      if (dt) scheduleOutMinutes = dt.getHours() * 60 + dt.getMinutes()
    }

    if (editingCalendarId) {
      const existing = calendars.find((c) => c.id === editingCalendarId)
      if (existing) {
        existing.name = name
        existing.description = description
        existing.salaryMonthly = salaryMonthly
        existing.salaryHourly = salaryHourly
        existing.workingDaysPerWeek = workingDaysPerWeek
        existing.pin = pin
        existing.scheduleInMinutes = scheduleInMinutes
        existing.scheduleOutMinutes = scheduleOutMinutes
      }
    } else {
      const id = "cal_" + Date.now()
      calendars.push({
        id,
        name,
        description,
        salaryMonthly,
        salaryHourly,
        workingDaysPerWeek,
        pin,
        scheduleInMinutes,
        scheduleOutMinutes,
        days: {},
        holidays: {},
      })
      activeCalendarId = id
    }

    saveCalendars()
    renderCalendarList()
    renderCalendar()
    renderStats()
    updateSessionBar()

    editingCalendarId = null
    calendarForm.classList.remove("visible")
  })
}

function renderExpensesCategorySummary(cal) {
  if (!expensesCategorySection || !expCategoryList) return
  if (!cal) {
    expensesCategorySection.classList.add("hidden")
    expCategoryList.innerHTML = ""
    if (expCategoryTableBody) expCategoryTableBody.innerHTML = ""
    return
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  if (expCategoryMonthLabel) {
    const label = new Date(year, month, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    expCategoryMonthLabel.textContent = label
  }

  const totals = new Map()
  const comboTotals = new Map() // key: `${cat}||${sub}` -> { amount, count }
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d)
    const key = dateKey(dt)
    const day = cal.days && cal.days[key]
    if (!day || !Array.isArray(day.entries) || !day.entries.length) continue

    day.entries.forEach((entry) => {
      const cat = entry.category || "Uncategorized"
      const subRaw = entry.subCategory || ""
      const sub = subRaw || "-"
      const total = Number(entry.total) || 0
      if (!total) return

      const current = totals.get(cat) || 0
      totals.set(cat, current + total)

      const comboKey = `${cat}||${sub}`
      const prev = comboTotals.get(comboKey) || { amount: 0, count: 0 }
      prev.amount += total
      prev.count += 1
      comboTotals.set(comboKey, prev)
    })
  }

  expCategoryList.innerHTML = ""
  if (expCategoryTableBody) expCategoryTableBody.innerHTML = ""

  if (!totals.size) {
    const span = document.createElement("span")
    span.className = "placeholder-text"
    span.textContent = "No expenses recorded for this month."
    expCategoryList.appendChild(span)
    if (expCategoryTableBody) {
      expCategoryTableBody.innerHTML = ""
    }
    expensesCategorySection.classList.remove("hidden")
    return
  }

  const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1])
  const max = entries[0][1] || 1

  entries.forEach(([name, amount]) => {
    const row = document.createElement("div")
    row.className = "exp-category-row"

    const top = document.createElement("div")
    top.className = "exp-category-row-top"
    const nameEl = document.createElement("span")
    nameEl.className = "exp-category-name"
    nameEl.textContent = name
    const amtEl = document.createElement("span")
    amtEl.className = "exp-category-amount"
    amtEl.textContent = `₹${Math.round(amount)}`
    top.appendChild(nameEl)
    top.appendChild(amtEl)

    const bar = document.createElement("div")
    bar.className = "exp-category-bar"
    const fill = document.createElement("div")
    fill.className = "exp-category-bar-fill"
    const pct = Math.max(4, Math.round((amount / max) * 100))
    fill.style.width = pct + "%"
    bar.appendChild(fill)

    row.appendChild(top)
    row.appendChild(bar)
    expCategoryList.appendChild(row)
  })

  if (expCategoryTableBody) {
    const comboEntries = Array.from(comboTotals.entries()).sort((a, b) => b[1].amount - a[1].amount)
    comboEntries.forEach(([key, value]) => {
      const [cat, sub] = key.split("||")
      const tr = document.createElement("tr")
      const tdCat = document.createElement("td")
      const tdSub = document.createElement("td")
      const tdAmt = document.createElement("td")
      const tdCount = document.createElement("td")

      tdCat.textContent = cat
      tdSub.textContent = sub
      tdAmt.textContent = `₹${Math.round(value.amount)}`
      tdCount.textContent = String(value.count)

      tr.appendChild(tdCat)
      tr.appendChild(tdSub)
      tr.appendChild(tdAmt)
      tr.appendChild(tdCount)
      expCategoryTableBody.appendChild(tr)
    })
  }

  expensesCategorySection.classList.remove("hidden")
}

function pad(n) {
  return String(n).padStart(2, "0")
}
function dateKey(dt) {
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`
}
function monthKeyFromYearMonth(year, month) {
  return `${year}-${pad(month + 1)}`
}
function formatTime(ts) {
  if (!ts) return "--:--"
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
function formatMinutesToHM(mins) {
  const h = Math.floor((mins || 0) / 60)
  const m = Math.max(0, (mins || 0) % 60)
  return `${h}h ${m}m`
}
function buildDateWithTime(date, hhmm) {
  if (!date || !hhmm) return null
  const parts = String(hhmm).split(":")
  if (parts.length < 2) return null
  const h = Number(parts[0])
  const m = Number(parts[1])
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0, 0)
}
function ensureCalendarHolidays(cal) {
  if (!cal.holidays) cal.holidays = {}
}
function getActiveCalendar() {
  if (!activeCalendarId) return null
  return calendars.find((c) => c.id === activeCalendarId) || null
}
function loadCalendars() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      calendars = []
      activeCalendarId = null
    } else {
      const parsed = JSON.parse(data)
      calendars = parsed.calendars || []
      activeCalendarId = parsed.activeCalendarId || (calendars[0]?.id ?? null)
    }
  } catch (e) {
    calendars = []
    activeCalendarId = null
  }
  calendars.forEach((c) => {
    if (!c.days) c.days = {}
    if (!c.holidays) c.holidays = {}
  })
  updateAppTitle()
}
function saveCalendars() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ calendars, activeCalendarId })
  )
}
function selectCalendar(id) {
  activeCalendarId = id
  saveCalendars()
  renderCalendarList()
  renderCalendar()
  renderStats()
  updateSessionBar()
  closeDrawer()
}
function editCalendar(id) {
  const cal = calendars.find((c) => c.id === id)
  if (!cal || !calendarForm) return
  if (calendarNameInput) calendarNameInput.value = cal.name || ""
  if (calendarDescriptionInput) calendarDescriptionInput.value = cal.description || ""
  if (salaryMonthlyInput) salaryMonthlyInput.value = cal.salaryMonthly || ""
  if (salaryHourlyInput) salaryHourlyInput.value = cal.salaryHourly || ""
  if (workingDaysPerWeekInput) workingDaysPerWeekInput.value = String(cal.workingDaysPerWeek || 6)
  if (calendarPinInput) calendarPinInput.value = cal.pin || ""
  if (cal.scheduleInMinutes != null && officeInTimeInput)
    officeInTimeInput.value = `${pad(Math.floor(cal.scheduleInMinutes / 60))}:${pad(cal.scheduleInMinutes % 60)}`
  if (cal.scheduleOutMinutes != null && officeOutTimeInput)
    officeOutTimeInput.value = `${pad(Math.floor(cal.scheduleOutMinutes / 60))}:${pad(cal.scheduleOutMinutes % 60)}`
  editingCalendarId = id
  calendarForm.classList.add("visible")
  setTimeout(() => {
    calendarForm.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 0)
}
function deleteCalendar(id) {
  calendars = calendars.filter((c) => c.id !== id)
  if (activeCalendarId === id) {
    activeCalendarId = calendars[0]?.id ?? null
  }
  saveCalendars()
  renderCalendarList()
  renderCalendar()
  renderStats()
  updateSessionBar()
}
function updateAppTitle() {
  if (!appTitleEl) return
  if (activeMode === "expenses") {
    const ec = getActiveExpensesCalendar()
    appTitleEl.textContent = ec ? ec.title : "Expenses Calendar"
  } else {
    const oc = getActiveCalendar()
    appTitleEl.textContent = oc ? oc.name : "Office Calendar"
  }
}
function openDrawer() {
  if (drawer) drawer.classList.add("open")
  if (overlay) overlay.classList.add("active")
  document.body.style.overflow = "hidden"
}
function closeDrawer() {
  if (drawer) drawer.classList.remove("open")
  if (overlay) overlay.classList.remove("active")
  document.body.style.overflow = ""
}
if (menuBtn) menuBtn.addEventListener("click", openDrawer)
if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer)
if (overlay) {
  overlay.addEventListener("click", () => {
    if (drawer && drawer.classList.contains("open")) closeDrawer()
    if (expensesModal && expensesModal.classList.contains("open")) closeExpensesModal()
  })
}
if (drawerSettingsBtn && settingsPage) {
  drawerSettingsBtn.addEventListener("click", () => {
    settingsPage.classList.add("open")
    overlay.classList.add("active")
  })
}
if (settingsCloseBtn && settingsPage) {
  settingsCloseBtn.addEventListener("click", () => {
    settingsPage.classList.remove("open")
    overlay.classList.remove("active")
  })
}
function endSessionForDate(cal, key) {
  if (!cal || !key) return
  const info = cal.days[key]
  if (info && info.inTime && !info.outTime) {
    info.outTime = Date.now()
    if (cal.runningDateKey === key) cal.runningDateKey = null
    saveCalendars()
    renderCalendar()
    renderStats()
    updateSessionBar()
  }
}

// Modal elements
const dateModal = document.getElementById("dateModal")
const modalCloseBtn = document.getElementById("modalCloseBtn")
const modalDateLabel = document.getElementById("modalDateLabel")
const modalCalendarName = document.getElementById("modalCalendarName")
const inTimeCell = document.getElementById("inTimeCell") // now an <input type="time">
const outTimeCell = document.getElementById("outTimeCell") // now an <input type="time">
const saveTimeBtn = document.getElementById("saveTimeBtn")

// Report modal elements (office)
const reportModal = document.getElementById("reportModal")
const reportCloseBtn = document.getElementById("reportCloseBtn")
const reportMonthTitle = document.getElementById("reportMonthTitle")
const reportMonthSubtitle = document.getElementById("reportMonthSubtitle")
const repTotalDays = document.getElementById("repTotalDays")
const repLeaves = document.getElementById("repLeaves")
const repHalfDays = document.getElementById("repHalfDays")
const repHolidays = document.getElementById("repHolidays")
const repWeekendDays = document.getElementById("repWeekendDays")
const repExtraDays = document.getElementById("repExtraDays")
const repLateMinutes = document.getElementById("repLateMinutes")
const repEarlyMinutes = document.getElementById("repEarlyMinutes")
const repShortHours = document.getElementById("repShortHours")
const repExtraMinutes = document.getElementById("repExtraMinutes")
const repTotalSalary = document.getElementById("repTotalSalary")
const repSalaryDeduction = document.getElementById("repSalaryDeduction")
const repFinalSalary = document.getElementById("repFinalSalary")
const repProductivity = document.getElementById("repProductivity")
const reportDownloadBtn = document.getElementById("reportDownloadBtn")
const reportShareBtn = document.getElementById("reportShareBtn")

// Expenses combined monthly report modal elements
const expWalletBalanceEl = document.getElementById("expWalletBalance")
const expensesPayeeTableBody = document.getElementById("expensesPayeeTableBody")
const expensesViewReportBtn = document.getElementById("expensesViewReportBtn")
const expensesCategorySection = document.getElementById("expensesCategorySection")
const expCategoryMonthLabel = document.getElementById("expCategoryMonthLabel")
const expCategoryList = document.getElementById("expCategoryList")
const expCategoryTableBody = document.getElementById("expCategoryTableBody")
const expReportPaid = document.getElementById("expReportPaid")
const expReportPending = document.getElementById("expReportPending")
const expReportCarryLabel = document.getElementById("expReportCarryLabel")
const expReportCarryValue = document.getElementById("expReportCarryValue")
const expensesReportTableBody = document.getElementById("expensesReportTableBody")
const expensesReportDownloadBtn = document.getElementById("expensesReportDownloadBtn")
const expensesReportShareBtn = document.getElementById("expensesReportShareBtn")
const endReminderSnoozeButtons = document.querySelectorAll('#endReminderModal [data-snooze]')

// Expenses stats & drawer elements
const officeStatsSection = document.getElementById("officeStatsSection")
const expensesStatsSection = document.getElementById("expensesStatsSection")
const expensesPayeeSection = document.getElementById("expensesPayeeSection")
const expTodayEl = document.getElementById("expToday")
const expTotalSpentEl = document.getElementById("expTotalSpent")
const expMonthlyBudgetEl = document.getElementById("expMonthlyBudget")
const expRemainingEl = document.getElementById("expRemaining")
const expOverBudgetEl = document.getElementById("expOverBudget")
// Payee report modal elements
const payeeReportModal = document.getElementById("payeeReportModal")
const payeeReportCloseBtn = document.getElementById("payeeReportCloseBtn")
const payeeReportTitle = document.getElementById("payeeReportTitle")
const payeeReportSubtitle = document.getElementById("payeeReportSubtitle")
const payeeReportPayeeName = document.getElementById("payeeReportPayeeName")
const payeeReportMonthTotal = document.getElementById("payeeReportMonthTotal")
const payeeReportPending = document.getElementById("payeeReportPending")
const payeeReportLastPending = document.getElementById("payeeReportLastPending")
const payeeReportTotalPaid = document.getElementById("payeeReportTotalPaid")
const payeeReportLastPaymentInfo = document.getElementById("payeeReportLastPaymentInfo")
const payeeReportTableBody = document.getElementById("payeeReportTableBody")
const payeeReportDownloadBtn = document.getElementById("payeeReportDownloadBtn")
const payeeReportShareBtn = document.getElementById("payeeReportShareBtn")
const payeePaymentTypeSelect = document.getElementById("payeePaymentType")
const payeePaymentAmountInput = document.getElementById("payeePaymentAmount")
const payeePaymentFileInput = document.getElementById("payeePaymentFile")
const payeePaymentSubmitBtn = document.getElementById("payeePaymentSubmitBtn")
const payeePaymentTableBody = document.getElementById("payeePaymentTableBody")

const expensesCalendarListEl = document.getElementById("expensesCalendarList")
const createExpensesCalendarToggle = document.getElementById(
  "createExpensesCalendarToggle"
)
const expensesCalendarForm = document.getElementById("expensesCalendarForm")
const expensesTitleInput = document.getElementById("expensesTitle")
const expensesDescriptionInput = document.getElementById("expensesDescription")
const expensesBudgetAmountInput = document.getElementById("expensesBudgetAmount")
const expensesWalletAmountInput = document.getElementById("expensesWalletAmount")
const expensesPinInput = document.getElementById("expensesPin")

if (createExpensesCalendarToggle && expensesCalendarForm) {
  createExpensesCalendarToggle.setAttribute("type", "button")

  createExpensesCalendarToggle.addEventListener("click", () => {
    const willShow = !expensesCalendarForm.classList.contains("visible")
    expensesCalendarForm.classList.toggle("visible")

    if (willShow) {
      if (expensesTitleInput) expensesTitleInput.value = ""
      if (expensesDescriptionInput) expensesDescriptionInput.value = ""
      if (expensesBudgetAmountInput) expensesBudgetAmountInput.value = ""
      if (expensesWalletAmountInput) expensesWalletAmountInput.value = ""
      if (expensesPinInput) expensesPinInput.value = ""
      editingExpensesCalendarId = null
      setTimeout(() => {
        if (expensesCalendarForm) {
          expensesCalendarForm.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 0)
    }
  })

  expensesCalendarForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (!expensesTitleInput) return

    const title = expensesTitleInput.value.trim()
    if (!title) {
      alert("Please enter a title.")
      return
    }

    const description = expensesDescriptionInput
      ? expensesDescriptionInput.value.trim()
      : ""
    const budgetAmount = expensesBudgetAmountInput
      ? Number(expensesBudgetAmountInput.value) || 0
      : 0
    const walletAmount = expensesWalletAmountInput
      ? Number(expensesWalletAmountInput.value) || 0
      : 0
    const pin = expensesPinInput ? expensesPinInput.value.trim() || null : null

    if (editingExpensesCalendarId) {
      const existing = expensesCalendars.find((c) => c.id === editingExpensesCalendarId)
      if (existing) {
        existing.title = title
        existing.description = description
        existing.budgetAmount = budgetAmount
        existing.walletAmount = walletAmount
        existing.pin = pin
      }
    } else {
      const id = "exp_" + Date.now()
      expensesCalendars.push({
        id,
        title,
        description,
        budgetAmount,
        walletAmount,
        pin,
        days: {},
      })
      activeExpensesCalendarId = id
    }
    saveExpensesCalendars()

    expensesTitleInput.value = ""
    if (expensesDescriptionInput) expensesDescriptionInput.value = ""
    if (expensesBudgetAmountInput) expensesBudgetAmountInput.value = ""
    if (expensesWalletAmountInput) expensesWalletAmountInput.value = ""
    if (expensesPinInput) expensesPinInput.value = ""

    expensesCalendarForm.classList.remove("visible")
    editingExpensesCalendarId = null
    renderExpensesCalendarList()
    updateAppTitle()
  })
}

function editExpensesCalendar(id) {
  const cal = expensesCalendars.find((c) => c.id === id)
  if (!cal || !expensesCalendarForm) return

  if (expensesTitleInput) expensesTitleInput.value = cal.title || ""
  if (expensesDescriptionInput) expensesDescriptionInput.value = cal.description || ""
  if (expensesBudgetAmountInput) expensesBudgetAmountInput.value = cal.budgetAmount || ""
  if (expensesWalletAmountInput) expensesWalletAmountInput.value = cal.walletAmount || ""
  if (expensesPinInput) expensesPinInput.value = cal.pin || ""

  editingExpensesCalendarId = id
  expensesCalendarForm.classList.add("visible")
  setTimeout(() => {
    expensesCalendarForm.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 0)
}

function deleteExpensesCalendar(id) {
  expensesCalendars = expensesCalendars.filter((c) => c.id !== id)
  if (activeExpensesCalendarId === id) {
    activeExpensesCalendarId = expensesCalendars[0]?.id ?? null
  }
  saveExpensesCalendars()
  renderExpensesCalendarList()
  renderCalendar()
  renderExpensesSummary()
}

// Expenses date modal elements
const expensesModal = document.getElementById("expensesModal")
const expensesModalCloseBtn = document.getElementById("expensesModalCloseBtn")
const expensesModalDateLabel = document.getElementById("expensesModalDateLabel")
const expensesModalCalendarName = document.getElementById(
  "expensesModalCalendarName"
)
const expPayeeNameInput = document.getElementById("expPayeeName")
const expRecurringInput = document.getElementById("expRecurring")
const expCategorySelect = document.getElementById("expCategory")
const expSubCategorySelect = document.getElementById("expSubCategory")
const expPaymentStatusSelect = document.getElementById("expPaymentStatus")
const expPaymentModeGroup = document.getElementById("expPaymentModeGroup")
const expDateDisplay = document.getElementById("expDateDisplay")
const expTimeDisplay = document.getElementById("expTimeDisplay")
const expensesItemsList = document.getElementById("expensesItemsList")
const expAddItemRowBtn = document.getElementById("expAddItemRowBtn")
const expTotalForDateEl = document.getElementById("expTotalForDate")
const expSaveEntryBtn = document.getElementById("expSaveEntryBtn")

// Expenses preset categories and subcategories
const expensesCategories = [
  /* 1. GROCERY */
  {
    category: "Grocery",
    subcategories: [
      /* GRAINS & FLOURS */
      "Wheat",
      "Atta",
      "Besan",
      "Maida",
      "Suji / Rava",
      "Poha",
      "Dalia",
      "Oats",
      "Corn Flour",
      "Rice Flour",
      "Ragi Flour",

      /* RICE VARIETIES */
      "Basmati Rice",
      "Kolam Rice",
      "Sona Masoori Rice",
      "Brown Rice",
      "Parboiled Rice",
      "Idli Rice",
      "Raw Rice",

      /* DAL & PULSES */
      "Toor Dal",
      "Moong Dal",
      "Chana Dal",
      "Masoor Dal",
      "Urad Dal",
      "Rajma (Red)",
      "Rajma (Chitra)",
      "Kabuli Chana",
      "Kala Chana",
      "Green Moong",
      "Lobia",
      "Horse Gram",

      /* OILS */
      "Sunflower Oil",
      "Mustard Oil",
      "Groundnut Oil",
      "Rice Bran Oil",
      "Olive Oil",
      "Coconut Oil",
      "Sesame Oil",
      "Soybean Oil",
      "Palm Oil",

      /* GHEE / BUTTER */
      "Ghee",
      "Butter",
      "White Butter",

      /* SPICES (INDIAN MASALA) */
      "Turmeric Powder",
      "Red Chilli Powder",
      "Coriander Powder",
      "Cumin Powder",
      "Garam Masala",
      "Black Pepper",
      "Green Cardamom",
      "Black Cardamom",
      "Cloves",
      "Cinnamon",
      "Jeera",
      "Ajwain",
      "Methi Seeds",
      "Kasuri Methi",
      "Bay Leaf",
      "Mustard Seeds",
      "Fennel Seeds",
      "Dry Coconut",
      "Poppy Seeds",
      "Star Anise",
      "Nutmeg",
      "Mace",

      /* SPICE MIXES */
      "Chole Masala",
      "Pav Bhaji Masala",
      "Biryani Masala",
      "Chicken Masala",
      "Meat Masala",
      "Sabzi Masala",
      "Sambar Powder",
      "Rasam Powder",

      /* SALT & SWEET */
      "Salt",
      "Rock Salt",
      "Jaggery",
      "Sugar",
      "Brown Sugar",
      "Honey",

      /* TEA & COFFEE */
      "Tea Powder",
      "Green Tea",
      "Coffee Powder",
      "Instant Coffee",

      /* BREAD ITEMS */
      "Bread",
      "Buns",
      "Rusk",
      "Khari",

      /* SNACKS */
      "Namkeen",
      "Chips",
      "Bhujia",
      "Peanuts Roasted",
      "Popcorn",
      "Cookies",
      "Biscuits All Types",
      "Chocolates",
      "Ice Cream",

      /* DAIRY */
      "Milk",
      "Curd",
      "Paneer",
      "Cheese",
      "Buttermilk",
      "Cream",

      /* VEGETABLES (COMMON) */
      "Potato",
      "Onion",
      "Tomato",
      "Carrot",
      "Cucumber",
      "Beans",
      "Peas",
      "Cabbage",
      "Cauliflower",
      "Spinach",
      "Coriander",
      "Mint",
      "Garlic",
      "Ginger",
      "Green Chillies",

      /* FRUITS */
      "Apple",
      "Banana",
      "Orange",
      "Papaya",
      "Mango",
      "Grapes",
      "Pomegranate",
      "Watermelon",
      "Strawberry",
      "Avocado",

      /* DRY FRUITS */
      "Almonds",
      "Cashews",
      "Raisins",
      "Pistachios",
      "Walnuts",
      "Dates",
      "Anjeer",

      /* PACKAGED FOODS */
      "Noodles",
      "Pasta",
      "Macaroni",
      "Soups",
      "Vermicelli",
      "Pickles",
      "Ketchup",
      "Mayonnaise",
      "Sauces",
      "Instant Mixes",
      "Cereals",

      /* CLEANING ITEMS */
      "Detergent Powder",
      "Detergent Liquid",
      "Dishwash Liquid",
      "Dishwash Bar",
      "Toilet Cleaner",
      "Phenyl",
      "Floor Cleaner",
      "Room Freshener",
      "Garbage Bags",

      /* PERSONAL HYGIENE */
      "Bath Soap",
      "Shampoo",
      "Toothpaste",
      "Toothbrush",
      "Face Wash",
      "Hand Wash",
      "Shaving Cream",
      "Deodorant",
      "Sanitary Pads",

      /* KITCHEN BASICS */
      "Aluminum Foil",
      "Tissue Paper",
      "Zip Lock Bags",
      "Matchbox",
      "Lighter",
      "Plastic Bags",
      "Cling Film",

      /* OTHER */
      "Eggs",
      "Instant Tea",
      "Instant Coffee",
      "Ready to Eat Items",
      "Frozen Food",
      "Butter Paper",
      "Vinegar",
      "Lemon Juice",
      "Soda",
      "Soft Drinks",
      "Energy Drinks",
      "Mineral Water",

      /* EXTRA ITEMS */
      "Moong Whole",
      "Urad Whole",
      "Kidney Beans Small",
      "Pumpkin Seeds",
      "Chia Seeds",
      "Sunflower Seeds",
      "Flax Seeds",
      "Dry Ginger",
      "Tamarind",
      "Rice Cakes",
      "Couscous",
      "Quinoa",
      "Wheat Rava",
      "Idli Rava",
      "Jowar Atta",
      "Bajra Atta",
      "Multigrain Atta",
      "Bread Crumbs",
      "Yeast",
      "Baking Soda",
      "Baking Powder",
      "Cocoa Powder",
      "Custard Powder",
      "Cornflakes",
      "Muesli",
      "Peanut Butter",
      "Jam",
      "Syrups",
      "Chutney Bottles",
      "Gravy Masala Packs",
      "Frozen Vegetables",
      "Paneer Cubes",
      "Sweet Corn",
      "Herbal Tea",
      "Protein Powder",
      "Health Drinks",
      "Khakhra",
      "Laddu",
      "Barfi",
      "Samosa Ready Mix",
      "Kheer Mix",
      "Idli & Dosa Batter",
    ],
  },

  /* 2. TRAVEL */
  {
    category: "Travel",
    subcategories: [
      "Bus",
      "Train",
      "Cab / Taxi",
      "Auto",
      "Bike",
      "Car",
      "Flight",
      "Metro",
      "Fuel (Petrol)",
      "Fuel (Diesel)",
      "Toll",
      "Parking",
      "Hotel",
      "Resort",
      "Local Transport",
    ],
  },

  /* 3. MEDICAL */
  {
    category: "Medical",
    subcategories: [
      "Medicines",
      "Doctor Consultation",
      "Lab Tests",
      "Hospital Bills",
      "Surgery",
      "Dental",
      "Eye Care",
      "Health Insurance",
      "Baby Medicine",
    ],
  },

  /* 4. SHOPPING */
  {
    category: "Shopping",
    subcategories: [
      "Clothes",
      "Footwear",
      "Electronics",
      "Home Items",
      "Kitchen Items",
      "Beauty Products",
      "Furniture",
      "Accessories",
      "Mobile & Gadgets",
    ],
  },

  /* 5. ENTERTAINMENT */
  {
    category: "Entertainment",
    subcategories: [
      "Movies",
      "OTT Subscriptions",
      "Shows & Events",
      "Games",
      "Sports",
      "Music",
      "Books",
    ],
  },

  /* 6. PARTY / OCCASIONS */
  {
    category: "Party",
    subcategories: [
      "Birthday",
      "Anniversary",
      "Drinks",
      "Food",
      "Decorations",
      "Gifts",
    ],
  },

  /* 7. HOLIDAYS */
  {
    category: "Holidays",
    subcategories: [
      "Flight Tickets",
      "Hotels",
      "Resorts",
      "Travel Packages",
      "Food",
      "Local Transport",
      "Activities",
    ],
  },

  /* 8. BILLS */
  {
    category: "Bills",
    subcategories: [
      "Electricity",
      "Water",
      "Gas",
      "Mobile Recharge",
      "Internet",
      "DTH",
      "Rent",
      "Maintenance",
    ],
  },

  /* 9. SERVICE */
  {
    category: "Service",
    subcategories: [
      "Electrician",
      "Plumber",
      "Carpenter",
      "AC Repair",
      "Home Cleaning",
      "Pest Control",
      "Mobile Repair",
      "Software Services",
      "Internet Services",
    ],
  },

  /* 10. PERSONAL CARE */
  {
    category: "Personal Care",
    subcategories: [
      "Salon",
      "Spa",
      "Gym",
      "Cosmetics",
      "Skincare",
      "Hair Care",
      "Fitness Items",
    ],
  },

  /* 11. HOME */
  {
    category: "Home",
    subcategories: [
      "Repair",
      "Cleaning Items",
      "Furniture",
      "Decor",
      "Bedding",
      "Curtains",
      "Lights",
      "Tools",
    ],
  },

  /* 12. FAMILY & KIDS */
  {
    category: "Family & Kids",
    subcategories: [
      "School Fees",
      "Kids Clothes",
      "Baby Care",
      "Toys",
      "Medical",
      "Snacks",
    ],
  },

  /* 13. EDUCATION */
  {
    category: "Education",
    subcategories: [
      "School Fees",
      "College Fees",
      "Books",
      "Courses",
      "Online Learning",
      "Coaching",
    ],
  },

  /* 14. INVESTMENT */
  {
    category: "Investment",
    subcategories: [
      "Mutual Funds",
      "Stocks",
      "Gold",
      "FD",
      "RD",
      "Crypto",
      "Insurance Premium",
    ],
  },

  /* 15. OTHER */
  {
    category: "Other",
    subcategories: [
      "Donations",
      "Charity",
      "Unexpected Expense",
      "Fine / Penalty",
      "Miscellaneous",
    ],
  },
]

function initExpensesCategoryDropdowns() {
  if (!expCategorySelect || !expSubCategorySelect) return

  // Helper to remember a current value if present
  const currentCategory = expCategorySelect.value || ""

  // Rebuild category options with leading "No value"
  expCategorySelect.innerHTML = ""
  const noneOpt = document.createElement("option")
  noneOpt.value = ""
  noneOpt.textContent = "No value"
  expCategorySelect.appendChild(noneOpt)

  expensesCategories.forEach((c) => {
    const opt = document.createElement("option")
    opt.value = c.category
    opt.textContent = c.category
    expCategorySelect.appendChild(opt)
  })

  // Restore selection if it still exists, otherwise keep "No value"
  if (currentCategory && Array.from(expCategorySelect.options).some((o) => o.value === currentCategory)) {
    expCategorySelect.value = currentCategory
  } else {
    expCategorySelect.value = ""
  }

  // Always refresh subcategories based on current category
  populateSubCategories(expCategorySelect.value, expSubCategorySelect.value || "")
}

function populateSubCategories(categoryValue, currentSubValue) {
  if (!expSubCategorySelect) return

  expSubCategorySelect.innerHTML = ""
  const noneOpt = document.createElement("option")
  noneOpt.value = ""
  noneOpt.textContent = "No value"
  expSubCategorySelect.appendChild(noneOpt)

  const cat = expensesCategories.find((c) => c.category === categoryValue)
  if (cat && Array.isArray(cat.subcategories)) {
    cat.subcategories.forEach((name) => {
      const opt = document.createElement("option")
      opt.value = name
      opt.textContent = name
      expSubCategorySelect.appendChild(opt)
    })
  }

  if (
    currentSubValue &&
    Array.from(expSubCategorySelect.options).some((o) => o.value === currentSubValue)
  ) {
    expSubCategorySelect.value = currentSubValue
  } else {
    expSubCategorySelect.value = ""
  }
}

if (expCategorySelect) {
  initExpensesCategoryDropdowns()
  expCategorySelect.addEventListener("change", () => {
    const catVal = expCategorySelect.value || ""
    populateSubCategories(catVal, "")
  })
}

function updateExpPaymentModeAvailability() {
  if (!expPaymentStatusSelect || !expPaymentModeGroup) return
  const status = expPaymentStatusSelect.value
  const radios = expPaymentModeGroup.querySelectorAll('input[name="expPaymentMode"]')
  if (!radios.length) return

  if (status === "pending") {
    radios.forEach((r) => {
      r.checked = false
      r.disabled = true
    })
  } else {
    let anyChecked = false
    radios.forEach((r) => {
      r.disabled = false
      if (r.checked) anyChecked = true
    })
    if (!anyChecked) {
      radios.forEach((r) => {
        if (r.value === "online") r.checked = true
      })
    }
  }
}

if (expPaymentStatusSelect) {
  expPaymentStatusSelect.addEventListener("change", updateExpPaymentModeAvailability)
}

function openExpensesModal(date, options) {
  const cal = getActiveExpensesCalendar()
  if (!cal || !expensesModal) return

  selectedDate = date

  const key = dateKey(date)
  const day = normalizeExpensesDay(cal, key)

  // If explicitly editing, load existing entry; otherwise treat as new entry
  const isEdit = options && options.edit === true
  const entryId = options && options.entryId
  let info = {}
  editingExpenseEntryId = null
  if (isEdit && entryId && Array.isArray(day.entries)) {
    const found = day.entries.find((e) => e.id === entryId)
    if (found) {
      info = found
      editingExpenseEntryId = found.id
    }
  }

  if (expensesModalDateLabel) {
    expensesModalDateLabel.textContent = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (expensesModalCalendarName) {
    expensesModalCalendarName.textContent = cal.title || ""
  }

  if (expDateDisplay) {
    expDateDisplay.value = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (expTimeDisplay) {
    const t = info.createdAt ? new Date(info.createdAt) : new Date()
    const hh = pad(t.getHours())
    const mm = pad(t.getMinutes())
    expTimeDisplay.value = `${hh}:${mm}`
  }

  if (expPayeeNameInput) expPayeeNameInput.value = info.payeeName || ""
  if (expRecurringInput) expRecurringInput.checked = !!info.recurring

  if (expCategorySelect) expCategorySelect.value = info.category || ""
  if (expSubCategorySelect) expSubCategorySelect.value = info.subCategory || ""
  if (expPaymentStatusSelect) expPaymentStatusSelect.value = info.paymentStatus || "paid"

  if (expPaymentModeGroup) {
    const mode = info.paymentMode || "online"
    const radios = expPaymentModeGroup.querySelectorAll(
      'input[name="expPaymentMode"]'
    )
    radios.forEach((r) => {
      r.checked = r.value === mode
    })
  }

  if (expensesItemsList) {
    expensesItemsList.innerHTML = ""

    if (Array.isArray(info.items) && info.items.length) {
      // Edit mode with existing items
      info.items.forEach((it) => addExpItemRow(it))
    } else {
      // New entry: start with a single empty row
      addExpItemRow()
    }
  }

  // Always recompute total from current DOM rows and update label
  expRecomputeTotal()

  expensesModal.classList.add("open")
  overlay.classList.add("active")
  document.body.style.overflow = "hidden"

  updateExpPaymentModeAvailability()
}

function closeExpensesModal() {
  if (!expensesModal) return
  expensesModal.classList.remove("open")
  overlay.classList.remove("active")
  document.body.style.overflow = ""
  selectedDate = null
   editingExpenseEntryId = null
}

if (expensesModalCloseBtn) {
  expensesModalCloseBtn.addEventListener("click", closeExpensesModal)
}

function addExpItemRow(prefill) {
  if (!expensesItemsList) return
  const row = document.createElement("div")
  row.className = "expenses-item-row"
  const name = document.createElement("input")
  name.type = "text"
  name.placeholder = "Item"
  name.value = prefill && prefill.name ? prefill.name : ""
  name.addEventListener("input", expRecomputeTotal)
  const qty = document.createElement("input")
  qty.type = "number"
  qty.min = "0"
  qty.step = "1"
  qty.placeholder = "Qty"
  qty.value = prefill && prefill.qty != null ? String(prefill.qty) : ""
  qty.addEventListener("input", expRecomputeTotal)
  const price = document.createElement("input")
  price.type = "number"
  price.min = "0"
  price.step = "0.01"
  price.placeholder = "Price"
  price.value = prefill && prefill.price != null ? String(prefill.price) : ""
  price.addEventListener("input", expRecomputeTotal)
  const remove = document.createElement("button")
  remove.className = "expenses-item-remove-btn"
  remove.textContent = "✕"
  remove.addEventListener("click", () => {
    row.remove()
    expRecomputeTotal()
  })
  row.appendChild(name)
  row.appendChild(qty)
  row.appendChild(price)
  row.appendChild(remove)
  expensesItemsList.appendChild(row)
}

function getExpItemsFromDOM() {
  const items = []
  if (!expensesItemsList) return items
  const rows = expensesItemsList.querySelectorAll(".expenses-item-row")
  rows.forEach((row) => {
    const inputs = row.querySelectorAll("input")
    const n = inputs[0] ? inputs[0].value.trim() : ""
    let q = 0
    if (inputs[1]) {
      const raw = inputs[1].value.trim()
      q = raw === "" ? 1 : Number(raw) || 1
    }
    const p = inputs[2] ? Number(inputs[2].value) || 0 : 0
    if (n || q || p) items.push({ name: n, qty: q, price: p })
  })
  return items
}

function expRecomputeTotal() {
  if (!expTotalForDateEl) return
  const items = getExpItemsFromDOM()
  let total = 0
  for (const it of items) {
    total += (Number(it.qty) || 0) * (Number(it.price) || 0)
  }
  const rounded = Math.round(total)
  expTotalForDateEl.textContent = `₹${Number.isFinite(rounded) ? rounded : 0}`
}

if (expAddItemRowBtn) {
  expAddItemRowBtn.addEventListener("click", () => addExpItemRow())
}

if (expSaveEntryBtn) {
  expSaveEntryBtn.addEventListener("click", () => {
    const cal = getActiveExpensesCalendar()
    if (!cal || !selectedDate) return
    const key = dateKey(selectedDate)
    const day = normalizeExpensesDay(cal, key)

    const items = getExpItemsFromDOM(true)
    if (items === null) {
      alert("Please enter item name or choose a sub category for each item.")
      return
    }
    let total = 0
    for (const it of items) total += (Number(it.qty) || 0) * (Number(it.price) || 0)
    const roundedTotal = Math.round(total)

    let paymentStatus = expPaymentStatusSelect
      ? expPaymentStatusSelect.value
      : "paid"
    let mode = "online"
    if (expPaymentModeGroup && (!expPaymentStatusSelect || paymentStatus !== "pending")) {
      const picked = expPaymentModeGroup.querySelector('input[name="expPaymentMode"]:checked')
      if (picked) mode = picked.value
    } else if (paymentStatus === "pending") {
      mode = "none"
    }

    const baseEntry = {
      id: editingExpenseEntryId || `exp_${Date.now()}`,
      payeeName: expPayeeNameInput ? expPayeeNameInput.value.trim() : "",
      recurring: expRecurringInput ? !!expRecurringInput.checked : false,
      category: expCategorySelect ? expCategorySelect.value || "" : "",
      subCategory: expSubCategorySelect ? expSubCategorySelect.value || "" : "",
      paymentStatus,
      paymentMode: mode,
      items,
      total: roundedTotal,
      createdAt: Date.now(),
    }

    // Insert or replace entry in this day's list
    if (!Array.isArray(day.entries)) day.entries = []
    const idx = editingExpenseEntryId
      ? day.entries.findIndex((e) => e.id === editingExpenseEntryId)
      : -1
    if (idx >= 0) {
      day.entries[idx] = baseEntry
    } else {
      day.entries.push(baseEntry)
    }

    // Recompute per-day aggregate total and a synthetic status used by old code
    let dayTotal = 0
    let anyPending = false
    day.entries.forEach((e) => {
      const t = Number(e.total) || 0
      dayTotal += t
      if (e.paymentStatus === "pending") anyPending = true
    })
    day.total = dayTotal
    // Keep a top-level paymentStatus for backward compatibility (used in some views)
    day.paymentStatus = anyPending ? "pending" : "paid"

    saveExpensesCalendars()
    closeExpensesModal()
    renderCalendar()
  })
}

function renderExpensesSummary() {
  if (!expTodayEl || !expTotalSpentEl || !expMonthlyBudgetEl || !expRemainingEl || !expOverBudgetEl || !expWalletBalanceEl) {
    return
  }

  const cal = getActiveExpensesCalendar()
  if (!cal) {
    expTodayEl.textContent = "₹0"
    expTotalSpentEl.textContent = "₹0"
    expMonthlyBudgetEl.textContent = "₹0"
    expRemainingEl.textContent = "₹0"
    expOverBudgetEl.textContent = "₹0"
    expWalletBalanceEl.textContent = "₹0"
    if (expensesPayeeTableBody) expensesPayeeTableBody.innerHTML = ""
    return
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()
  const todayKey = dateKey(today)

  let todayTotal = 0
  let totalSpent = 0
  let paidTotal = 0
  let pendingTotal = 0

  // For table: group by payee, then date-wise rows within each payee, using
  // all entries stored for that date.
  const payeeRowsMap = new Map()

  if (cal.days) {
    Object.entries(cal.days).forEach(([key]) => {
      const [yStr, mStr, dStr] = key.split("-")
      const y = Number(yStr)
      const m = Number(mStr) - 1
      const d = Number(dStr)
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return

      if (y !== year || m !== month) return

      const day = normalizeExpensesDay(cal, key)
      if (!Array.isArray(day.entries) || !day.entries.length) return

      const dateLabel = new Date(y, m, d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })

      day.entries.forEach((entry) => {
        const entryTotal = Number(entry.total) || 0
        if (!entryTotal) return

        // Monthly aggregates
        totalSpent += entryTotal
        if (key === todayKey) {
          todayTotal += entryTotal
        }
        if (entry.paymentStatus === "paid") {
          paidTotal += entryTotal
        } else if (entry.paymentStatus === "pending") {
          pendingTotal += entryTotal
        }

        const payeeName = (entry.payeeName || "Unknown").trim() || "Unknown"
        const status = entry.paymentStatus || "paid"

        let list = payeeRowsMap.get(payeeName)
        if (!list) {
          list = []
          payeeRowsMap.set(payeeName, list)
        }

        list.push({
          key,
          entryId: entry.id,
          dateLabel,
          total: entryTotal,
          status,
        })
      })
    })
  }

  const budget = Number(cal.budgetAmount) || 0
  const walletBase = Number(cal.walletAmount) || 0
  const remaining = budget - totalSpent
  const over = remaining < 0 ? -remaining : 0
  const remainingDisplay = remaining > 0 ? remaining : 0
  const walletBalance = walletBase - paidTotal

  expTodayEl.textContent = `₹${todayTotal}`
  expTotalSpentEl.textContent = `₹${totalSpent}`
  expMonthlyBudgetEl.textContent = `₹${budget}`
  expRemainingEl.textContent = `₹${remainingDisplay}`
  expOverBudgetEl.textContent = `₹${over}`
  expWalletBalanceEl.textContent = `₹${walletBalance}`

  if (expensesPayeeTableBody) {
    expensesPayeeTableBody.innerHTML = ""

    // Sort payees alphabetically, then each payee's rows by date key
    const payeeNames = Array.from(payeeRowsMap.keys()).sort((a, b) =>
      a.localeCompare(b)
    )

    payeeNames.forEach((payeeName) => {
      const list = payeeRowsMap.get(payeeName) || []
      list.sort((a, b) => {
        if (a.key < b.key) return -1
        if (a.key > b.key) return 1
        return 0
      })

      // Group header row for this payee with a single View button
      const headerTr = document.createElement("tr")
      headerTr.className = "payee-group-header"
      const headerTd = document.createElement("td")
      headerTd.colSpan = 6

      // Inner flex container so View button can sit at far right
      const headerContainer = document.createElement("div")
      headerContainer.style.display = "flex"
      headerContainer.style.alignItems = "center"
      headerContainer.style.width = "100%"

      const headerLabel = document.createElement("span")
      headerLabel.textContent = payeeName

      const headerViewBtn = document.createElement("button")
      headerViewBtn.textContent = "View"
      headerViewBtn.className = "small-btn"
      headerViewBtn.style.marginLeft = "auto"
      headerViewBtn.addEventListener("click", () => {
        openPayeeReport(payeeName)
      })

      headerContainer.appendChild(headerLabel)
      headerContainer.appendChild(headerViewBtn)
      headerTd.appendChild(headerContainer)
      headerTr.appendChild(headerTd)
      expensesPayeeTableBody.appendChild(headerTr)

      // Date-wise item rows under this payee
      list.forEach((row) => {
        const tr = document.createElement("tr")
        const dateTd = document.createElement("td")
        const nameTd = document.createElement("td")
        const statusTd = document.createElement("td")
        const amtTd = document.createElement("td")
        const editTd = document.createElement("td")
        const viewTd = document.createElement("td")
        const editBtn = document.createElement("button")

        dateTd.textContent = row.dateLabel
        nameTd.textContent = "" // payee name shown in group header

        let statusLabel = "Paid"
        if (row.status === "pending") {
          statusLabel = "Pending"
        }
        statusTd.textContent = statusLabel

        amtTd.textContent = `₹${row.total}`

        // Edit button: open this exact date+entry in edit mode
        editBtn.textContent = "Edit"
        editBtn.className = "small-btn"
        editBtn.addEventListener("click", () => {
          openExpensesModalForKey(row.key, row.entryId)
        })
        editTd.appendChild(editBtn)

        tr.appendChild(dateTd)
        tr.appendChild(nameTd)
        tr.appendChild(statusTd)
        tr.appendChild(amtTd)
        tr.appendChild(editTd)
        tr.appendChild(viewTd) // empty: group header holds the View button
        expensesPayeeTableBody.appendChild(tr)
      })
    })
  }
}

function openExpensesModalForKey(key, entryId) {
  if (!key) return
  const parts = String(key).split("-")
  if (parts.length !== 3) return
  const y = Number(parts[0])
  const m = Number(parts[1]) - 1
  const d = Number(parts[2])
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return
  const date = new Date(y, m, d)
  // When entryId is provided, open that specific entry for editing.
  // Fallback: edit mode without a specific entry still works for legacy data.
  if (entryId) {
    openExpensesModal(date, { edit: true, entryId })
  } else {
    openExpensesModal(date, { edit: true })
  }
}

function buildPayeeMonthlyData(cal, payeeName) {
  if (!cal || !payeeName) return null

  const nowYear = currentDate.getFullYear()
  const nowMonth = currentDate.getMonth()

  let monthTotal = 0
  let monthPaid = 0
  let monthPending = 0
  const pendingByMonth = {}
  const rows = []

  if (cal.days) {
    Object.entries(cal.days).forEach(([key]) => {
      const [yStr, mStr, dStr] = key.split("-")
      const y = Number(yStr)
      const m = Number(mStr) - 1
      const d = Number(dStr)
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return

      const day = normalizeExpensesDay(cal, key)
      if (!Array.isArray(day.entries) || !day.entries.length) return

      day.entries.forEach((entry) => {
        const entryTotal = Number(entry.total) || 0
        if (!entryTotal) return

        const name = (entry.payeeName || "Unknown").trim() || "Unknown"
        if (name !== payeeName) return

        const isCurrentMonth = y === nowYear && m === nowMonth

        if (isCurrentMonth) {
          monthTotal += entryTotal
          if (entry.paymentStatus === "paid") monthPaid += entryTotal
          if (entry.paymentStatus === "pending") monthPending += entryTotal

          const createdAt = entry.createdAt
            ? new Date(entry.createdAt)
            : new Date(y, m, d)
          const dateLabel = createdAt.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          const timeLabel = createdAt.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })

          if (Array.isArray(entry.items) && entry.items.length) {
            entry.items.forEach((it) => {
              const qty = Number(it.qty) || 0
              const price = Number(it.price) || 0
              const lineTotal = qty * price
              rows.push({
                dateLabel,
                timeLabel,
                itemName: it.name || "-",
                qty,
                price,
                lineTotal,
                status: entry.paymentStatus || "-",
                mode: entry.paymentMode || "-",
              })
            })
          } else {
            rows.push({
              dateLabel,
              timeLabel,
              itemName: "-",
              qty: 0,
              price: 0,
              lineTotal: entryTotal,
              status: entry.paymentStatus || "-",
              mode: entry.paymentMode || "-",
            })
          }
        } else {
          if (entry.paymentStatus === "pending") {
            const mKey = monthKeyFromYearMonth(y, m)
            const prev = pendingByMonth[mKey] || 0
            pendingByMonth[mKey] = prev + entryTotal
          }
        }
      })
    })
  }

  let previousMonthsPendingTotal = 0
  Object.values(pendingByMonth).forEach((amt) => {
    previousMonthsPendingTotal += Number(amt) || 0
  })

  return {
    monthTotal,
    monthPaid,
    monthPending,
    pendingByMonth,
    totalPending: monthPending + previousMonthsPendingTotal,
    rows,
  }
}

function getPayeePaymentsForCalendar(cal, payeeName) {
  if (!cal || !payeeName) return { totalPaid: 0, payments: [] }
  const store = cal.payeePayments || {}
  const list = Array.isArray(store[payeeName]) ? store[payeeName] : []
  let totalPaid = 0
  list.forEach((p) => {
    totalPaid += Number(p.amount) || 0
  })
  return { totalPaid, payments: list.slice() }
}

function openPayeeReport(payeeName) {
  const cal = getActiveExpensesCalendar()
  if (!cal || !payeeReportModal) return

  const data = buildPayeeMonthlyData(cal, payeeName)
  if (!data) return

  const { totalPaid, payments } = getPayeePaymentsForCalendar(cal, payeeName)
  const remainingPendingAll = Math.max(0, (Number(data.totalPending) || 0) - totalPaid)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthStart = new Date(year, month, 1)
  const thisMonthLabel = monthStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  if (payeeReportTitle) {
    payeeReportTitle.textContent = "Payee Report"
  }
  if (payeeReportSubtitle) {
    payeeReportSubtitle.textContent = monthStart.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }
  if (payeeReportPayeeName) {
    payeeReportPayeeName.textContent = payeeName
  }
  if (payeeReportMonthTotal) {
    payeeReportMonthTotal.textContent = `₹${data.monthTotal}`
  }
  if (payeeReportPending) {
    if (!remainingPendingAll) {
      payeeReportPending.textContent = "All payment cleared"
    } else {
      payeeReportPending.textContent = `${thisMonthLabel}: ₹${remainingPendingAll}`
    }
  }
  if (payeeReportLastPending) {
    const map = data.pendingByMonth || {}
    const entries = Object.entries(map).filter(([, amount]) => Number(amount) > 0)

    if (!entries.length) {
      payeeReportLastPending.textContent = "No previous pending"
    } else {
      let totalPrev = 0
      entries.sort((a, b) => {
        return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
      })

      let html = '<table class="pill-mini-table"><tbody>'
      entries.forEach(([mKey, amount]) => {
        const [yStr, mmStr] = mKey.split("-")
        const yy = Number(yStr)
        const mm = Number(mmStr) - 1
        const label = new Date(yy, mm, 1).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
        const amt = Number(amount) || 0
        totalPrev += amt
        html += `<tr><td>${label}</td><td style="text-align:right;">₹${amt}</td></tr>`
      })
      html += `<tr class="pill-mini-total"><td><strong>Total</strong></td><td style="text-align:right;"><strong>₹${totalPrev}</strong></td></tr>`
      html += "</tbody></table>"
      payeeReportLastPending.innerHTML = html
    }
  }
  if (payeeReportTotalPaid) {
    payeeReportTotalPaid.textContent = `₹${totalPaid}`
  }

  if (payeeReportLastPaymentInfo) {
    if (!payments.length) {
      payeeReportLastPaymentInfo.textContent = "No payments recorded yet"
    } else {
      const last = payments[payments.length - 1]
      const ts = last.timestamp ? new Date(last.timestamp) : new Date()
      const dateLabel = ts.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      const labelType = last.type === "full" ? "Full payment" : "Part payment"
      const amt = Number(last.amount) || 0
      payeeReportLastPaymentInfo.textContent = `${labelType} on ${dateLabel}: ₹${amt}`
    }
  }

  if (payeeReportTableBody) {
    payeeReportTableBody.innerHTML = ""
    data.rows.forEach((row) => {
      const tr = document.createElement("tr")
      const dateTd = document.createElement("td")
      const timeTd = document.createElement("td")
      const itemTd = document.createElement("td")
      const qtyTd = document.createElement("td")
      const priceTd = document.createElement("td")
      const totalTd = document.createElement("td")
      const statusTd = document.createElement("td")
      const modeTd = document.createElement("td")

      dateTd.textContent = row.dateLabel
      timeTd.textContent = row.timeLabel
      itemTd.textContent = row.itemName
      qtyTd.textContent = row.qty ? String(row.qty) : "0"
      priceTd.textContent = row.price ? `₹${row.price}` : "₹0"
      totalTd.textContent = `₹${row.lineTotal}`
      statusTd.textContent = row.status
      modeTd.textContent = row.mode

      tr.appendChild(dateTd)
      tr.appendChild(timeTd)
      tr.appendChild(itemTd)
      tr.appendChild(qtyTd)
      tr.appendChild(priceTd)
      tr.appendChild(totalTd)
      tr.appendChild(statusTd)
      tr.appendChild(modeTd)
      payeeReportTableBody.appendChild(tr)
    })
  }

  if (payeePaymentTableBody) {
    payeePaymentTableBody.innerHTML = ""
    const sorted = payments.slice().sort((a, b) => {
      return (a.timestamp || 0) - (b.timestamp || 0)
    })
    sorted.forEach((p) => {
      const tr = document.createElement("tr")
      const dateTd = document.createElement("td")
      const typeTd = document.createElement("td")
      const amountTd = document.createElement("td")
      const slipTd = document.createElement("td")

      const ts = p.timestamp ? new Date(p.timestamp) : new Date()
      dateTd.textContent = ts.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      typeTd.textContent = p.type === "full" ? "Full" : "Part"
      amountTd.textContent = `₹${Number(p.amount) || 0}`
      if (p.slipDataUrl) {
        const link = document.createElement("a")
        link.href = p.slipDataUrl
        link.download = p.slipName || "payment-slip"
        const img = document.createElement("img")
        img.src = p.slipDataUrl
        img.alt = p.slipName || "Slip"
        img.className = "payment-slip-thumb"
        link.appendChild(img)
        slipTd.appendChild(link)
      } else {
        slipTd.textContent = p.slipName || "-"
      }

      tr.appendChild(dateTd)
      tr.appendChild(typeTd)
      tr.appendChild(amountTd)
      tr.appendChild(slipTd)
      payeePaymentTableBody.appendChild(tr)
    })
  }

  payeeReportModal.classList.add("open")
  overlay.classList.add("active")
}

if (payeePaymentSubmitBtn) {
  payeePaymentSubmitBtn.addEventListener("click", () => {
    const cal = getActiveExpensesCalendar()
    if (!cal || !payeeReportPayeeName || !payeePaymentAmountInput) return

    const payeeName = (payeeReportPayeeName.textContent || "").trim()
    if (!payeeName) return

    const amount = Number(payeePaymentAmountInput.value) || 0
    if (!amount) return

    const type = payeePaymentTypeSelect ? payeePaymentTypeSelect.value || "part" : "part"

    const finalizeSave = (slipName, slipDataUrl) => {
      const entry = {
        id: `pay_${Date.now()}`,
        timestamp: Date.now(),
        type,
        amount,
        slipName,
        slipDataUrl: slipDataUrl || null,
      }

      if (!cal.payeePayments) cal.payeePayments = {}
      if (!Array.isArray(cal.payeePayments[payeeName])) cal.payeePayments[payeeName] = []
      cal.payeePayments[payeeName].push(entry)

      saveExpensesCalendars()

      payeePaymentAmountInput.value = ""
      if (payeePaymentFileInput) {
        payeePaymentFileInput.value = ""
      }

      openPayeeReport(payeeName)
    }

    if (payeePaymentFileInput && payeePaymentFileInput.files && payeePaymentFileInput.files[0]) {
      const file = payeePaymentFileInput.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = typeof e.target?.result === "string" ? e.target.result : null
        finalizeSave(file.name, dataUrl)
      }
      reader.readAsDataURL(file)
    } else {
      finalizeSave("", null)
    }
  })
}

function closePayeeReport() {
  if (!payeeReportModal) return
  payeeReportModal.classList.remove("open")
  overlay.classList.remove("active")
}

if (payeeReportCloseBtn) {
  payeeReportCloseBtn.addEventListener("click", closePayeeReport)
}

if (payeeReportDownloadBtn) {
  payeeReportDownloadBtn.addEventListener("click", () => {
    // Use browser print; user can choose "Save as PDF" to download
    window.print()
  })
}

if (payeeReportShareBtn) {
  payeeReportShareBtn.addEventListener("click", () => {
    const payeeName = payeeReportPayeeName ? payeeReportPayeeName.textContent || "" : ""
    const monthTotal = payeeReportMonthTotal ? payeeReportMonthTotal.textContent || "" : ""
    const pending = payeeReportPending ? payeeReportPending.textContent || "" : ""
    const lastPending = payeeReportLastPending ? payeeReportLastPending.textContent || "" : ""
    const totalPaid = payeeReportTotalPaid ? payeeReportTotalPaid.textContent || "" : ""

    const lines = []
    lines.push(`Payee Expenses Report - ${payeeName}`)
    if (payeeReportSubtitle && payeeReportSubtitle.textContent) {
      lines.push(payeeReportSubtitle.textContent)
    }
    lines.push("")
    lines.push(`Month Expenses Payment: ${monthTotal}`)
    lines.push(`Pending Payment: ${pending}`)
    lines.push(`Last Month Pending: ${lastPending}`)
    lines.push(`Total Payment: ${totalPaid}`)
    lines.push("")
    lines.push("Date | Time | Item | Qty | Price | Total | Status | Mode")

    if (payeeReportTableBody) {
      const rows = payeeReportTableBody.querySelectorAll("tr")
      rows.forEach((tr) => {
        const tds = tr.querySelectorAll("td")
        if (tds.length >= 8) {
          const parts = Array.from(tds).map((td) => td.textContent || "")
          lines.push(parts.join(" | "))
        }
      })
    }

    const text = lines.join("\n")
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  })
}

function applyStatusClass(el, status) {
  el.classList.remove(
    "status-present",
    "status-absent",
    "status-holiday",
    "status-halfday",
    "status-leave"
  )
  if (status === "present") el.classList.add("status-present")
  if (status === "absent") el.classList.add("status-absent")
  if (status === "holiday") el.classList.add("status-holiday")
  if (status === "halfday") el.classList.add("status-halfday")
  if (status === "leave") el.classList.add("status-leave")
}

function renderStats() {
  const cal = getActiveCalendar()
  if (!cal) return

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  let present = 0
  let leave = 0
  let absent = 0
  let halfDay = 0
  let holiday = 0
  let extraDaysWorked = 0

  // totalMinutes: used for salary and analytics (can include schedule-inferred time)
  let totalMinutes = 0
  let lateMinutes = 0
  let extraMinutes = 0

  // actualMinutes: only time where a timer actually ran (has in/out or running)
  let actualMinutes = 0

  // todayMinutes: today portion of actualMinutes (computed separately later)
  let todayMinutes = 0

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d)
    const key = dateKey(dt)
    const info = cal.days[key]
    if (!info || !info.status) continue

    if (info.status === "present") present++
    if (info.status === "leave") leave++
    if (info.status === "absent") absent++
    if (info.status === "halfday") halfDay++
    if (info.status === "holiday") holiday++

    // Extra working days on weekend based on workingDaysPerWeek
    const workingDays = cal.workingDaysPerWeek || 6
    const dow = dt.getDay()
    const isWeekend =
      workingDays === 5 ? dow === 0 || dow === 6 : dow === 0
    const isWorkingStatus =
      info.status === "present" || info.status === "halfday"
    if (isWeekend && isWorkingStatus) {
      extraDaysWorked += info.status === "halfday" ? 0.5 : 1
    }

    // For time-based totals, only count days with working statuses
    if (!isWorkingStatus) {
      continue
    }

    // Determine worked minutes for this day (for salary/stats)
    let workedMinutes = 0

    // Determine "actual" minutes based only on real timer
    let actualWorked = 0

    if (info.inTime && info.outTime) {
      const diffMs = info.outTime - info.inTime
      if (diffMs > 0) {
        workedMinutes = Math.floor(diffMs / 60000)
        actualWorked = Math.floor(diffMs / 60000)
      }

      // Late / extra vs schedule only if we have actual times
      if (cal.scheduleInMinutes != null || cal.scheduleOutMinutes != null) {
        const inDate = new Date(info.inTime)
        const outDate = new Date(info.outTime)
        const actualIn = inDate.getHours() * 60 + inDate.getMinutes()
        const actualOut = outDate.getHours() * 60 + outDate.getMinutes()

        if (
          cal.scheduleInMinutes != null &&
          actualIn > cal.scheduleInMinutes
        ) {
          lateMinutes += actualIn - cal.scheduleInMinutes
        }

        if (
          cal.scheduleOutMinutes != null &&
          actualOut > cal.scheduleOutMinutes
        ) {
          extraMinutes += actualOut - cal.scheduleOutMinutes
        }
      }
    } else if (
      // No explicit times, but we have a schedule and a status
      cal.scheduleInMinutes != null &&
      cal.scheduleOutMinutes != null &&
      (info.status === "present" || info.status === "halfday")
    ) {
      const scheduledMinutes = cal.scheduleOutMinutes - cal.scheduleInMinutes
      if (scheduledMinutes > 0) {
        workedMinutes =
          info.status === "halfday"
            ? Math.floor(scheduledMinutes / 2)
            : scheduledMinutes
      }
    }

    // If this is the currently running day with no outTime,
    // recompute minutes live using now and subtracting breaks.
    if (cal.runningDateKey === key && !info.outTime && info.inTime) {
      const liveMs = Date.now() - info.inTime
      if (liveMs > 0) {
        const liveMinutes = Math.floor(liveMs / 60000) - computeBreakMinutes(info)
        // For salary/stats we also prefer live time over static
        if (liveMinutes > workedMinutes) {
          workedMinutes = liveMinutes
        }
        // For actual worked, running session always uses live minutes
        actualWorked = liveMinutes
      }
    }

    totalMinutes += workedMinutes

    // Cap actual (spent) minutes to planned quota per day
    let cappedActual = actualWorked
    if (
      cappedActual > 0 &&
      cal.scheduleInMinutes != null &&
      cal.scheduleOutMinutes != null
    ) {
      const perDay = cal.scheduleOutMinutes - cal.scheduleInMinutes
      if (perDay > 0) {
        const dayCap =
          info.status === "halfday" ? Math.floor(perDay / 2) : perDay
        if (dayCap > 0 && cappedActual > dayCap) {
          cappedActual = dayCap
        }
      }
    }

    actualMinutes += cappedActual
  }

  // Planned monthly minutes from schedule and working days, reducing for
  // holidays and approved leaves, and counting half-days as half.
  let plannedMinutes = 0
  if (cal.scheduleInMinutes != null && cal.scheduleOutMinutes != null) {
    const perDay = cal.scheduleOutMinutes - cal.scheduleInMinutes
    if (perDay > 0) {
      const workingDaysPerWeek = cal.workingDaysPerWeek || 6
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d)
        const dow = dt.getDay()
        const isWorkingDay =
          workingDaysPerWeek === 5 ? (dow >= 1 && dow <= 5) : (dow >= 1 && dow <= 6)
        if (!isWorkingDay) continue

        const key = dateKey(dt)
        const info = cal.days[key]
        const status = info?.status

        // Do not count planned hours for holidays or allowed leaves
        if (status === "holiday" || status === "leave") continue

        // Half-day counts as half of a planned working day
        if (status === "halfday") {
          plannedMinutes += Math.floor(perDay / 2)
        } else {
          plannedMinutes += perDay
        }
      }
    }
  }

  // Compute today's worked minutes independently of the visible month
  const today = new Date()
  const todayKey = dateKey(today)
  const todayInfo = cal.days[todayKey]
  if (todayInfo && (todayInfo.status === "present" || todayInfo.status === "halfday")) {
    let tWorked = 0
    let tActual = 0

    if (todayInfo.inTime && todayInfo.outTime) {
      const diffMs = todayInfo.outTime - todayInfo.inTime
      if (diffMs > 0) {
        tWorked = Math.floor(diffMs / 60000)
        tActual = tWorked
      }
    } else if (cal.scheduleInMinutes != null && cal.scheduleOutMinutes != null) {
      const scheduledMinutes = cal.scheduleOutMinutes - cal.scheduleInMinutes
      if (scheduledMinutes > 0) {
        tWorked = todayInfo.status === "halfday"
          ? Math.floor(scheduledMinutes / 2)
          : scheduledMinutes
      }
    }

    // Running today without outTime
    if (cal.runningDateKey === todayKey && !todayInfo.outTime && todayInfo.inTime) {
      const liveMs = Date.now() - todayInfo.inTime
      if (liveMs > 0) {
        const liveMinutes = Math.floor(liveMs / 60000) - computeBreakMinutes(todayInfo)
        if (liveMinutes > tWorked) tWorked = liveMinutes
        tActual = liveMinutes
      }
    }

    // Cap to daily quota for today as well
    let cappedToday = tActual
    if (cal.scheduleInMinutes != null && cal.scheduleOutMinutes != null) {
      const perDay = cal.scheduleOutMinutes - cal.scheduleInMinutes
      if (perDay > 0) {
        const dayCap =
          todayInfo.status === "halfday" ? Math.floor(perDay / 2) : perDay
        if (dayCap > 0 && cappedToday > dayCap) cappedToday = dayCap
      }
    }

    todayMinutes = cappedToday
  }

  statPresent.textContent = present
  statLeave.textContent = leave
  statAbsent.textContent = absent
  statHalfDay.textContent = halfDay
  statHoliday.textContent = holiday
  if (statExtraDays) statExtraDays.textContent = extraDaysWorked

  const hours = Math.floor(actualMinutes / 60)
  const mins = actualMinutes % 60
  const tHours = Math.floor(todayMinutes / 60)
  const tMins = todayMinutes % 60

  if (plannedMinutes > 0) {
    const pHours = Math.floor(plannedMinutes / 60)
    const pMins = plannedMinutes % 60
    const pendingMinutes = Math.max(0, plannedMinutes - actualMinutes)
    const pendHours = Math.floor(pendingMinutes / 60)
    const pendMins = pendingMinutes % 60

    let text = ""
    if (todayMinutes > 0) {
      text = `${pHours}h ${pMins}m / ${hours}h ${mins}m (Today ${tHours}h ${tMins}m)`
    } else {
      text = `${pHours}h ${pMins}m / ${hours}h ${mins}m`
    }

    if (pendingMinutes > 0) {
      // Append pending hours information, styled via span
      text += ` (Pending <span class="pending-hours">${pendHours}h ${pendMins}m</span>)`
      statWorkingHours.innerHTML = text
    } else {
      statWorkingHours.textContent = text
    }
  } else {
    // Fallback when no schedule defined
    if (todayMinutes > 0) {
      statWorkingHours.textContent = `${hours}h ${mins}m (Today ${tHours}h ${tMins}m)`
    } else {
      statWorkingHours.textContent = `${hours}h ${mins}m`
    }
  }

  statLate.textContent = `${lateMinutes}m`
  statExtra.textContent = `${extraMinutes}m`

  // Salary calculation
  let salary = 0
  if (cal.salaryHourly) {
    salary = (totalMinutes / 60) * cal.salaryHourly
  } else if (cal.salaryMonthly) {
    const workingEquiv = present + halfDay * 0.5
    const perDay = cal.salaryMonthly / daysInMonth
    salary = workingEquiv * perDay
  }
  statSalary.textContent = "₹" + Math.round(salary)
}

function getActiveExpensesCalendar() {
  if (!activeExpensesCalendarId) return null
  return expensesCalendars.find((c) => c.id === activeExpensesCalendarId) || null
}

// Ensure a day's expenses are stored in the normalized multi-entry shape:
// { entries: [ { id, payeeName, items, paymentStatus, paymentMode, total, createdAt, ... } ], total }
function normalizeExpensesDay(cal, key) {
  if (!cal.days) cal.days = {}
  let day = cal.days[key]

  // If already normalized
  if (day && Array.isArray(day.entries)) {
    return day
  }

  // Legacy single-entry shape: wrap into entries[0]
  if (day && (!day.entries || !Array.isArray(day.entries))) {
    const legacy = day
    const entryId = legacy.id || `exp_${Date.now()}`
    const entry = {
      id: entryId,
      payeeName: legacy.payeeName || "",
      recurring: !!legacy.recurring,
      category: legacy.category || "",
      subCategory: legacy.subCategory || "",
      paymentStatus: legacy.paymentStatus || "paid",
      paymentMode: legacy.paymentMode || "online",
      items: Array.isArray(legacy.items) ? legacy.items : [],
      total: Number(legacy.total) || 0,
      createdAt: legacy.createdAt || Date.now(),
    }
    day = {
      entries: [entry],
      total: entry.total,
    }
    cal.days[key] = day
    return day
  }

  // No data yet for this date
  day = { entries: [], total: 0 }
  cal.days[key] = day
  return day
}

function renderCalendarList() {
  if (!calendarListEl) return
  calendarListEl.innerHTML = ""
  if (!calendars.length) return

  calendars.forEach((cal) => {
    const item = document.createElement("div")
    item.className = "calendar-list-item"

    const main = document.createElement("div")
    main.className = "calendar-list-main"

    const name = document.createElement("div")
    name.className = "calendar-list-name"
    name.textContent = cal.name

    const desc = document.createElement("div")
    desc.className = "calendar-list-desc"
    desc.textContent = cal.description || "No description"

    const meta = document.createElement("div")
    meta.className = "calendar-list-meta"
    const salaryText =
      cal.salaryMonthly || cal.salaryHourly
        ? `Monthly: ${cal.salaryMonthly || 0} | Hourly: ${cal.salaryHourly || 0}`
        : "No salary set"
    meta.textContent = cal.pin ? `${salaryText} · PIN protected` : salaryText

    main.appendChild(name)
    main.appendChild(desc)
    main.appendChild(meta)

    const actions = document.createElement("div")
    actions.className = "calendar-list-actions"

    const editBtn = document.createElement("button")
    editBtn.className = "small-btn"
    editBtn.textContent = "Edit"
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (cal.pin) {
        openPinModal(cal, "edit")
      } else {
        editCalendar(cal.id)
      }
    })

    const delBtn = document.createElement("button")
    delBtn.className = "small-btn"
    delBtn.textContent = "Del"
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      if (cal.pin) {
        openPinModal(cal, "delete")
      } else {
        openDeleteModal(cal)
      }
    })

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)

    item.appendChild(main)
    item.appendChild(actions)

    item.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) return
      if (cal.pin) {
        openPinModal(cal, "select")
      } else {
        selectCalendar(cal.id)
      }
    })

    if (cal.id === activeCalendarId) {
      item.classList.add("active")
    }

    calendarListEl.appendChild(item)
  })
}

function renderExpensesCalendarList() {
  if (!expensesCalendarListEl) return
  expensesCalendarListEl.innerHTML = ""
  if (!expensesCalendars.length) return

  expensesCalendars.forEach((cal) => {
    const item = document.createElement("div")
    item.className = "calendar-list-item"

    const main = document.createElement("div")
    main.className = "calendar-list-main"

    const name = document.createElement("div")
    name.className = "calendar-list-name"
    name.textContent = cal.title

    const desc = document.createElement("div")
    desc.className = "calendar-list-desc"
    desc.textContent = cal.description || "No description"

    const meta = document.createElement("div")
    meta.className = "calendar-list-meta"
    const budgetText = `Budget: ${cal.budgetAmount || 0} · Wallet: ${
      cal.walletAmount || 0
    }`
    meta.textContent = cal.pin ? `${budgetText} · PIN protected` : budgetText

    main.appendChild(name)
    main.appendChild(desc)
    main.appendChild(meta)

    const actions = document.createElement("div")
    actions.className = "calendar-list-actions"

    const editBtn = document.createElement("button")
    editBtn.className = "small-btn"
    editBtn.textContent = "Edit"
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      editExpensesCalendar(cal.id)
    })

    const delBtn = document.createElement("button")
    delBtn.className = "small-btn"
    delBtn.textContent = "Del"
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      openDeleteModal(cal, "expenses")
    })

    actions.appendChild(editBtn)
    actions.appendChild(delBtn)

    item.appendChild(main)
    item.appendChild(actions)

    item.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) return
      activeExpensesCalendarId = cal.id
      saveExpensesCalendars()
      renderExpensesCalendarList()
      updateAppTitle()
      renderCalendar()
      closeDrawer()
    })

    if (cal.id === activeExpensesCalendarId) {
      item.classList.add("active")
    }

    expensesCalendarListEl.appendChild(item)
  })
}

function renderCalendar() {
  const isExpensesMode = activeMode === "expenses"
  const cal = isExpensesMode ? getActiveExpensesCalendar() : getActiveCalendar()

  updateAppTitle()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  if (monthLabel) {
    monthLabel.textContent = currentDate.toLocaleString("default", {
      month: "long",
    })
  }
  if (yearLabel) {
    yearLabel.textContent = String(year)
  }

  const firstDayOfMonth = new Date(year, month, 1)
  const startingWeekday = firstDayOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  if (statDaysInMonth) statDaysInMonth.textContent = daysInMonth

  if (!daysGrid) return
  daysGrid.innerHTML = ""

  const today = new Date()

  let dayNum = 1
  for (let cell = 0; cell < 42; cell++) {
    const cellDiv = document.createElement("div")
    cellDiv.className = "day-cell"

    if (cell < startingWeekday || dayNum > daysInMonth) {
      cellDiv.classList.add("disabled")
      daysGrid.appendChild(cellDiv)
      continue
    }

    cellDiv.textContent = dayNum

    const cellDate = new Date(year, month, dayNum)
    const key = dateKey(cellDate)

    let info = cal && cal.days ? cal.days[key] : null

    // Offices: apply holiday/status styling
    if (!isExpensesMode && cal) {
      ensureCalendarHolidays(cal)
      const mKey = monthKeyFromYearMonth(year, month)
      const holMonth = cal.holidays && cal.holidays[mKey]
      const holConfig = holMonth && holMonth[dayNum]
      if (holConfig) {
        if (!cal.days[key]) cal.days[key] = {}
        cal.days[key].status = "holiday"
        cal.days[key].holidayName = holConfig.name || null
        info = cal.days[key]
      }
    }

    const dow = cellDate.getDay()
    if (dow === 0 || dow === 6) {
      cellDiv.classList.add("weekend")
    }

    if (
      cellDate.getFullYear() === today.getFullYear() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getDate() === today.getDate()
    ) {
      cellDiv.classList.add("today")
    }

    if (!isExpensesMode && info && info.status) {
      applyStatusClass(cellDiv, info.status)
    }

    if (!isExpensesMode && cal && cal.runningDateKey === key) {
      cellDiv.classList.add("running")
    }

    // Expenses mode: color dates by aggregated payment status across all entries
    if (isExpensesMode && info) {
      const day = normalizeExpensesDay(cal, key)
      if (Array.isArray(day.entries) && day.entries.length) {
        let anyPending = false
        let anyPaid = false
        day.entries.forEach((e) => {
          const t = Number(e.total) || 0
          if (!t) return
          if (e.paymentStatus === "pending") anyPending = true
          if (e.paymentStatus === "paid") anyPaid = true
        })
        if (anyPending) {
          cellDiv.classList.add("status-absent")
        } else if (anyPaid) {
          cellDiv.classList.add("status-present")
        }
      }
    }

    cellDiv.addEventListener("click", () => {
      if (isExpensesMode) {
        // Always treat date click in expenses mode as creating a new entry
        openExpensesModal(cellDate)
      } else {
        openModal(cellDate)
      }
    })

    daysGrid.appendChild(cellDiv)
    dayNum++
  }

  if (!isExpensesMode) {
    renderStats()
    updateSessionBar()
    if (expensesCategorySection) expensesCategorySection.classList.add("hidden")
  } else {
    renderExpensesSummary()
    renderExpensesCategorySummary(cal)
  }
}

// Month navigation
if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1)
    renderCalendar()
  })
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1)
    renderCalendar()
  })
}

// ===== Monthly report logic =====

function openReportModal() {
  const cal = getActiveCalendar()
  if (!cal || !reportModal) return

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthStart = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Header labels
  if (reportMonthTitle) {
    reportMonthTitle.textContent = cal.name
  }
  if (reportMonthSubtitle) {
    reportMonthSubtitle.textContent = monthStart.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  // Aggregates
  let totalDays = daysInMonth
  let present = 0
  let halfDays = 0
  let holidays = 0
  let leaves = 0
  let absents = 0
  let extraDays = 0
  let weekendDays = 0

  let lateMinutes = 0
  let earlyMinutes = 0
  let shortMinutes = 0
  let extraMinutes = 0

  let workedMinutesActual = 0
  let plannedMinutes = 0

  const workingDaysPerWeek = cal.workingDaysPerWeek || 6
  const perDaySchedule =
    cal.scheduleInMinutes != null && cal.scheduleOutMinutes != null
      ? cal.scheduleOutMinutes - cal.scheduleInMinutes
      : 0

  // Clear table
  if (reportTableBody) reportTableBody.innerHTML = ""

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month, d)
    const key = dateKey(dt)
    const info = cal.days[key] || {}

    const dow = dt.getDay()
    const isWorkingDay =
      workingDaysPerWeek === 5 ? dow >= 1 && dow <= 5 : dow >= 1 && dow <= 6
    if (!isWorkingDay) {
      weekendDays++
    }

    const status = info.status || null
    if (status === "present") present++
    if (status === "halfday") halfDays++
    if (status === "holiday") holidays++
    if (status === "leave") leaves++
    if (status === "absent") absents++

    const isWorkingStatus = status === "present" || status === "halfday"
    if (!isWorkingDay && isWorkingStatus) {
      extraDays += status === "halfday" ? 0.5 : 1
    }

    // Planned minutes (skip holidays and leaves)
    if (perDaySchedule > 0 && isWorkingDay && status !== "holiday" && status !== "leave") {
      plannedMinutes += status === "halfday" ? Math.floor(perDaySchedule / 2) : perDaySchedule
    }

    // Worked minutes and time metrics
    let workedMinutes = 0
    let dayLate = 0
    let dayEarly = 0
    let dayShort = 0
    let dayExtra = 0

    if (info.inTime && info.outTime) {
      const inDate = new Date(info.inTime)
      const outDate = new Date(info.outTime)
      const diffMs = info.outTime - info.inTime
      if (diffMs > 0) {
        workedMinutes = Math.floor(diffMs / 60000) - computeBreakMinutes(info)
      }

      if (perDaySchedule > 0) {
        const actualIn = inDate.getHours() * 60 + inDate.getMinutes()
        const actualOut = outDate.getHours() * 60 + outDate.getMinutes()

        if (cal.scheduleInMinutes != null && actualIn > cal.scheduleInMinutes) {
          dayLate = actualIn - cal.scheduleInMinutes
        }

        if (cal.scheduleOutMinutes != null) {
          if (actualOut > cal.scheduleOutMinutes) {
            dayExtra = actualOut - cal.scheduleOutMinutes
          } else if (actualOut < cal.scheduleOutMinutes) {
            dayEarly = cal.scheduleOutMinutes - actualOut
          }
        }

        const plannedForDay =
          status === "halfday" ? Math.floor(perDaySchedule / 2) : perDaySchedule
        if (plannedForDay > 0 && workedMinutes < plannedForDay) {
          dayShort = plannedForDay - workedMinutes
        }
      }
    }

    workedMinutesActual += Math.max(0, workedMinutes)
    lateMinutes += dayLate
    earlyMinutes += dayEarly
    shortMinutes += dayShort
    extraMinutes += dayExtra

    // Build table row
    if (reportTableBody) {
      const tr = document.createElement("tr")
      const dateCell = document.createElement("td")
      const dayCell = document.createElement("td")
      const statusCell = document.createElement("td")
      const inCell = document.createElement("td")
      const outCell = document.createElement("td")
      const breakCell = document.createElement("td")
      const workedCell = document.createElement("td")
      const lateCell = document.createElement("td")
      const earlyCell = document.createElement("td")
      const shortCell = document.createElement("td")

      dateCell.textContent = dt.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      dayCell.textContent = dt.toLocaleDateString("en-US", { weekday: "short" })
      statusCell.textContent = status || "-"
      inCell.textContent = info.inTime ? formatTime(info.inTime) : "-"
      outCell.textContent = info.outTime ? formatTime(info.outTime) : "-"

      const breakMins = computeBreakMinutes(info)
      if (breakMins > 0) {
        const reason =
          info.breaks && info.breaks.length
            ? info.breaks
                .map((b) => b.reason)
                .filter(Boolean)
                .join(", ") || "Breaks"
            : "Breaks"
        breakCell.textContent = `${formatMinutesToHM(breakMins)} (${reason})`
      } else {
        breakCell.textContent = "-"
      }

      workedCell.textContent = workedMinutes > 0 ? formatMinutesToHM(workedMinutes) : "-"
      lateCell.textContent = dayLate ? `${dayLate}m` : "-"
      earlyCell.textContent = dayEarly ? `${dayEarly}m` : "-"
      shortCell.textContent = dayShort ? formatMinutesToHM(dayShort) : "-"

      tr.appendChild(dateCell)
      tr.appendChild(dayCell)
      tr.appendChild(statusCell)
      tr.appendChild(inCell)
      tr.appendChild(outCell)
      tr.appendChild(breakCell)
      tr.appendChild(workedCell)
      tr.appendChild(lateCell)
      tr.appendChild(earlyCell)
      tr.appendChild(shortCell)
      reportTableBody.appendChild(tr)
    }
  }

  // Fill summary pills
  if (repTotalDays) repTotalDays.textContent = String(totalDays)
  if (repLeaves) repLeaves.textContent = String(leaves)
  if (repHalfDays) repHalfDays.textContent = String(halfDays)
  if (repHolidays) repHolidays.textContent = String(holidays)
  if (repWeekendDays) repWeekendDays.textContent = String(weekendDays)
  if (repExtraDays) repExtraDays.textContent = String(extraDays)
  if (repLateMinutes) repLateMinutes.textContent = `${lateMinutes}m`
  if (repEarlyMinutes) repEarlyMinutes.textContent = `${earlyMinutes}m`
  if (repShortHours) repShortHours.textContent = formatMinutesToHM(shortMinutes)
  if (repExtraMinutes) repExtraMinutes.textContent = `${extraMinutes}m`

  // Salary + productivity
  let totalSalary = 0
  let deduction = 0
  if (cal.salaryHourly) {
    totalSalary = (workedMinutesActual / 60) * cal.salaryHourly
    deduction = (shortMinutes / 60) * cal.salaryHourly
  } else if (cal.salaryMonthly) {
    totalSalary = cal.salaryMonthly
    if (plannedMinutes > 0 && shortMinutes > 0) {
      deduction = (shortMinutes / plannedMinutes) * cal.salaryMonthly
    }
  }
  const finalSalary = Math.max(0, Math.round(totalSalary - deduction))

  if (repTotalSalary) repTotalSalary.textContent = `₹${Math.round(totalSalary)}`
  if (repSalaryDeduction) repSalaryDeduction.textContent = `₹${Math.round(deduction)}`
  if (repFinalSalary) repFinalSalary.textContent = `₹${finalSalary}`

  const productivity =
    plannedMinutes > 0 ? Math.round((workedMinutesActual / plannedMinutes) * 100) : 0
  if (repProductivity) repProductivity.textContent = `${productivity}%`

  // Show modal
  reportModal.classList.add("open")
  overlay.classList.add("active")
}

function closeReportModal() {
  if (!reportModal) return
  reportModal.classList.remove("open")
  overlay.classList.remove("active")
}

// ===== Combined monthly expenses report (expenses mode) =====

function openExpensesReport() {
  const cal = getActiveExpensesCalendar()
  if (!cal || !expensesReportModal) return

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthStart = new Date(year, month, 1)

  if (expensesReportTitle) {
    expensesReportTitle.textContent = "Expenses Report"
  }
  if (expensesReportSubtitle) {
    expensesReportSubtitle.textContent = monthStart.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }
  if (expReportPayeeName) {
    expReportPayeeName.textContent = "All Payees"
  }

  let grandTotal = 0
  let totalPaid = 0
  let totalPending = 0
  let carryForwardPending = 0
  const payeeTotals = {}
  const rows = []

  if (cal.days) {
    Object.entries(cal.days).forEach(([key]) => {
      const [yStr, mStr, dStr] = key.split("-")
      const y = Number(yStr)
      const m = Number(mStr) - 1
      const d = Number(dStr)
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return

      const day = normalizeExpensesDay(cal, key)
      if (!Array.isArray(day.entries) || !day.entries.length) return

      const isCurrentMonth = y === year && m === month

      day.entries.forEach((entry) => {
        const entryTotal = Number(entry.total) || 0
        if (!entryTotal) return

        const payeeName = (entry.payeeName || "Unknown").trim() || "Unknown"

        if (isCurrentMonth) {
          grandTotal += entryTotal
          if (entry.paymentStatus === "paid") totalPaid += entryTotal
          if (entry.paymentStatus === "pending") totalPending += entryTotal

          const prev = payeeTotals[payeeName] || 0
          payeeTotals[payeeName] = prev + entryTotal

          const createdAt = entry.createdAt
            ? new Date(entry.createdAt)
            : new Date(y, m, d)
          const dateLabel = createdAt.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })
          const timeLabel = createdAt.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })

          if (Array.isArray(entry.items) && entry.items.length) {
            entry.items.forEach((it) => {
              const qty = Number(it.qty) || 0
              const price = Number(it.price) || 0
              const lineTotal = qty * price
              rows.push({
                payeeName,
                dateLabel,
                timeLabel,
                itemName: it.name || "-",
                qty,
                price,
                lineTotal,
                status: entry.paymentStatus || "-",
                mode: entry.paymentMode || "-",
                category: entry.category || "-",
                subCategory: entry.subCategory || "-",
              })
            })
          } else {
            rows.push({
              payeeName,
              dateLabel,
              timeLabel,
              itemName: "-",
              qty: 0,
              price: 0,
              lineTotal: entryTotal,
              status: entry.paymentStatus || "-",
              mode: entry.paymentMode || "-",
              category: entry.category || "-",
              subCategory: entry.subCategory || "-",
            })
          }
        } else if (entry.paymentStatus === "pending") {
          carryForwardPending += entryTotal
        }
      })
    })
  }

  if (expReportTotal) expReportTotal.textContent = `₹${grandTotal}`
  if (expReportPaid) expReportPaid.textContent = `₹${totalPaid}`
  if (expReportPending) expReportPending.textContent = `₹${totalPending}`
  if (expReportCarryLabel) {
    expReportCarryLabel.textContent = "Carry forward pending amount"
  }
  if (expReportCarryValue) {
    expReportCarryValue.textContent = `₹${carryForwardPending}`
  }

  if (expensesReportTableBody) {
    expensesReportTableBody.innerHTML = ""

    rows.sort((a, b) => {
      if (a.payeeName < b.payeeName) return -1
      if (a.payeeName > b.payeeName) return 1
      if (a.dateLabel < b.dateLabel) return -1
      if (a.dateLabel > b.dateLabel) return 1
      if (a.timeLabel < b.timeLabel) return -1
      if (a.timeLabel > b.timeLabel) return 1
      return 0
    })

    let lastPayee = null
    rows.forEach((row) => {
      if (row.payeeName !== lastPayee) {
        lastPayee = row.payeeName
        const headerTr = document.createElement("tr")
        const headerTd = document.createElement("td")
        headerTd.colSpan = 11
        const totalForPayee = payeeTotals[lastPayee] || 0
        headerTd.innerHTML = `<strong>${lastPayee} - Total: ₹${totalForPayee}</strong>`
        headerTr.appendChild(headerTd)
        expensesReportTableBody.appendChild(headerTr)
      }

      const tr = document.createElement("tr")
      const dateTd = document.createElement("td")
      const timeTd = document.createElement("td")
      const payeeTd = document.createElement("td")
      const itemTd = document.createElement("td")
      const qtyTd = document.createElement("td")
      const priceTd = document.createElement("td")
      const totalTd = document.createElement("td")
      const statusTd = document.createElement("td")
      const modeTd = document.createElement("td")
      const catTd = document.createElement("td")
      const subCatTd = document.createElement("td")

      dateTd.textContent = row.dateLabel
      timeTd.textContent = row.timeLabel
      payeeTd.textContent = row.payeeName
      itemTd.textContent = row.itemName
      qtyTd.textContent = row.qty ? String(row.qty) : "0"
      priceTd.textContent = row.price ? `₹${row.price}` : "₹0"
      totalTd.textContent = `₹${row.lineTotal}`
      statusTd.textContent = row.status
      modeTd.textContent = row.mode
      catTd.textContent = row.category
      subCatTd.textContent = row.subCategory

      tr.appendChild(dateTd)
      tr.appendChild(timeTd)
      tr.appendChild(payeeTd)
      tr.appendChild(itemTd)
      tr.appendChild(qtyTd)
      tr.appendChild(priceTd)
      tr.appendChild(totalTd)
      tr.appendChild(statusTd)
      tr.appendChild(modeTd)
      tr.appendChild(catTd)
      tr.appendChild(subCatTd)
      expensesReportTableBody.appendChild(tr)
    })
  }

  expensesReportModal.classList.add("open")
  overlay.classList.add("active")
}

function closeExpensesReport() {
  if (!expensesReportModal) return
  expensesReportModal.classList.remove("open")
  overlay.classList.remove("active")
}

if (reportBtn) {
  reportBtn.addEventListener("click", () => {
    if (activeMode === "expenses") {
      openExpensesReport()
    } else {
      openReportModal()
    }
  })
}

if (reportCloseBtn) {
  reportCloseBtn.addEventListener("click", closeReportModal)
}

if (expensesReportCloseBtn) {
  expensesReportCloseBtn.addEventListener("click", closeExpensesReport)
}

// Download PDF: rely on browser print dialog (user can save as PDF)
if (reportDownloadBtn) {
  reportDownloadBtn.addEventListener("click", () => {
    window.print()
  })
}

if (expensesReportDownloadBtn) {
  expensesReportDownloadBtn.addEventListener("click", () => {
    window.print()
  })
}

// Share on Whatsapp: build a plain-text summary and open wa.me link
if (reportShareBtn) {
  reportShareBtn.addEventListener("click", () => {
    const cal = getActiveCalendar()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })

    const summaryLines = []
    summaryLines.push(`Work Report - ${cal ? cal.name : "Calendar"}`)
    summaryLines.push(monthLabel)
    summaryLines.push("")
    summaryLines.push(`Total Days: ${repTotalDays ? repTotalDays.textContent : ""}`)
    summaryLines.push(`Leaves: ${repLeaves ? repLeaves.textContent : ""}`)
    summaryLines.push(`Half Days: ${repHalfDays ? repHalfDays.textContent : ""}`)
    summaryLines.push(`Holidays: ${repHolidays ? repHolidays.textContent : ""}`)
    summaryLines.push(`Weekend Days: ${repWeekendDays ? repWeekendDays.textContent : ""}`)
    summaryLines.push(`Extra Days: ${repExtraDays ? repExtraDays.textContent : ""}`)
    summaryLines.push(`Late Minutes: ${repLateMinutes ? repLateMinutes.textContent : ""}`)
    summaryLines.push(`Early Minutes: ${repEarlyMinutes ? repEarlyMinutes.textContent : ""}`)
    summaryLines.push(`Short Hours: ${repShortHours ? repShortHours.textContent : ""}`)
    summaryLines.push(`Extra Minutes: ${repExtraMinutes ? repExtraMinutes.textContent : ""}`)
    summaryLines.push(`Total Salary: ${repTotalSalary ? repTotalSalary.textContent : ""}`)
    summaryLines.push(`Deduction: ${repSalaryDeduction ? repSalaryDeduction.textContent : ""}`)
    summaryLines.push(`Final Salary: ${repFinalSalary ? repFinalSalary.textContent : ""}`)
    summaryLines.push(`Productivity: ${repProductivity ? repProductivity.textContent : ""}`)

    const text = summaryLines.join("\n")
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  })
}

if (expensesReportShareBtn) {
  expensesReportShareBtn.addEventListener("click", () => {
    const cal = getActiveExpensesCalendar()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })

    const lines = []
    lines.push(`Expenses Report - ${cal ? cal.title : "Expenses Calendar"}`)
    lines.push(monthLabel)
    lines.push("")
    lines.push(`Total Expenses: ${expReportTotal ? expReportTotal.textContent : ""}`)
    lines.push(`Paid Payment: ${expReportPaid ? expReportPaid.textContent : ""}`)
    lines.push(`Pending Payment: ${expReportPending ? expReportPending.textContent : ""}`)
    lines.push(`Carry forward pending: ${expReportCarryValue ? expReportCarryValue.textContent : ""}`)
    lines.push("")
    lines.push("Date | Time | Payee | Item | Qty | Price | Total | Status | Mode | Category | Sub Category")

    if (expensesReportTableBody) {
      const trs = expensesReportTableBody.querySelectorAll("tr")
      trs.forEach((tr) => {
        const tds = tr.querySelectorAll("td")
        if (!tds.length) return
        if (tds.length === 1) {
          lines.push("")
          lines.push(tds[0].textContent || "")
        } else if (tds.length >= 11) {
          const parts = Array.from(tds).map((td) => td.textContent || "")
          lines.push(parts.join(" | "))
        }
      })
    }

    const text = lines.join("\n")
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  })
}

// Modal logic
function openModal(date) {
  selectedDate = date
  const cal = getActiveCalendar()
  if (!cal) return

  const key = dateKey(date)
  const info = cal.days[key] || {}

  // Update modal title with day and date
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  modalDateLabel.textContent = date.toLocaleDateString('en-US', options)

  // If this date is a configured holiday, show its name in subtitle
  let holidayLabel = info.holidayName || null
  if (!holidayLabel && cal.holidays) {
    const mKey = monthKeyFromYearMonth(date.getFullYear(), date.getMonth())
    const holMonth = cal.holidays[mKey]
    const holConfig = holMonth && holMonth[date.getDate()]
    if (holConfig && holConfig.name) {
      holidayLabel = holConfig.name
    }
  }

  if (holidayLabel) {
    modalCalendarName.innerHTML = `${cal.name} · <span class="holiday-highlight">Today is ${holidayLabel} holiday</span>`
  } else {
    modalCalendarName.textContent = cal.name
  }

  // Update time inputs
  if (info.inTime && inTimeCell) inTimeCell.value = formatTime(info.inTime)
  if (info.outTime && outTimeCell) outTimeCell.value = formatTime(info.outTime)

  // Reset save button state
  if (saveTimeBtn) saveTimeBtn.style.display = 'none'

  // Show modal with overlay
  dateModal.classList.add("open")
  overlay.classList.add("active")
  document.body.style.overflow = "hidden"

  // Also sync session bar to this date
  updateSessionBar()
}

function closeModal() {
  dateModal.classList.remove("open")
  overlay.classList.remove("active")
  document.body.style.overflow = ""
  selectedDate = null
}

modalCloseBtn.addEventListener("click", closeModal)

// Manual time editing via inputs: just show Save button, do not auto-save
if (inTimeCell) {
  inTimeCell.addEventListener('input', () => {
    if (saveTimeBtn) saveTimeBtn.style.display = 'inline-block'
  })
}

if (outTimeCell) {
  outTimeCell.addEventListener('input', () => {
    if (saveTimeBtn) saveTimeBtn.style.display = 'inline-block'
  })
}

if (saveTimeBtn) {
  saveTimeBtn.addEventListener('click', () => {
    const cal = getActiveCalendar()
    if (!cal || !selectedDate) return

    const key = dateKey(selectedDate)
    if (!cal.days[key]) cal.days[key] = {}
    const info = cal.days[key]

    const inVal = inTimeCell.value
    const outVal = outTimeCell.value

    info.inTime = buildDateWithTime(selectedDate, inVal)?.getTime() || null
    info.outTime = buildDateWithTime(selectedDate, outVal)?.getTime() || null

    saveCalendars()
    renderCalendar()
    renderStats()
    updateSessionBar()

    if (saveTimeBtn) saveTimeBtn.style.display = 'none'
  })
}

// Date modal chips: working with statuses and timers
dateModal.addEventListener("click", (e) => {
  const target = e.target
  if (!(target instanceof HTMLButtonElement)) return
  const action = target.dataset.action
  if (!action) return

  const cal = getActiveCalendar()
  if (!cal || !selectedDate) return

  const key = dateKey(selectedDate)
  const info = cal.days[key] || {}

  if (action === "present") {
    info.status = "present"
  } else if (action === "absent") {
    info.status = "absent"
    info.inTime = null
    info.outTime = null
    if (cal.runningDateKey === key) {
      cal.runningDateKey = null
    }
  } else if (action === "holiday") {
    info.status = "holiday"
    info.inTime = null
    info.outTime = null
    if (cal.runningDateKey === key) {
      cal.runningDateKey = null
    }
  } else if (action === "halfDay") {
    info.status = "halfday"
  } else if (action === "leave") {
    info.status = "leave"
    info.inTime = null
    info.outTime = null
    if (cal.runningDateKey === key) {
      cal.runningDateKey = null
    }
  } else if (action === "workStart") {
    // If this same date is already running, treat Work Start as a toggle to stop.
    if (cal.runningDateKey === key && info.inTime && !info.outTime) {
      info.outTime = Date.now()
      cal.runningDateKey = null
      // Update out-time field in the modal
      if (outTimeCell) {
        outTimeCell.value = formatTime(info.outTime)
      }
    } else {
      // Start work timer for selected date.
      // If another date is running (different calendar or date), show warning.
      const existingRunning = findCalendarWithRunningSession()
      if (existingRunning && existingRunning.calendar.id !== cal.id) {
        openRunningModal(existingRunning.calendar)
        return
      }

      if (cal.runningDateKey && cal.runningDateKey !== key) {
        openRunningModal(cal)
        return
      }

      // Auto-mark day as present and pick current time as inTime
      info.status = "present"
      info.inTime = Date.now()
      info.outTime = null
      info.breaks = []
      cal.runningDateKey = key

      // Update in-time field in the modal
      if (inTimeCell) {
        inTimeCell.value = formatTime(info.inTime)
      }
      // Clear any previous out time in UI
      if (outTimeCell) {
        outTimeCell.value = ""
      }
    }
  } else if (action === "workEnd") {
    if (cal.runningDateKey === key && info.inTime) {
      info.outTime = Date.now()
      cal.runningDateKey = null
      // Update out-time field in the modal
      if (outTimeCell) {
        outTimeCell.value = formatTime(info.outTime)
      }
    }
  }

  cal.days[key] = info
  saveCalendars()
  renderCalendar()
  renderStats()
  updateSessionBar()
})

// Helper to find any calendar that currently has runningDateKey
function findCalendarWithRunningSession() {
  for (const cal of calendars) {
    if (cal.runningDateKey) {
      return {
        calendar: cal,
        dateKey: cal.runningDateKey,
      }
    }
  }
  return null
}

// PIN modal logic
function openPinModal(calendar, action) {
  pendingPinCalendarId = calendar.id
  pendingPinAction = action // "select" | "edit" | "delete"
  pinCalendarName.textContent = calendar.name
  pinInput.value = ""
  pinModal.classList.add("open")
  overlay.classList.add("active")
}

function closePinModal() {
  pinModal.classList.remove("open")
  overlay.classList.remove("active")
  pinInput.value = ""
  pendingPinCalendarId = null
  pendingPinAction = null
}

pinModalCloseBtn.addEventListener("click", closePinModal)
pinCancelBtn.addEventListener("click", closePinModal)

pinUnlockBtn.addEventListener("click", () => {
  const cal = calendars.find((c) => c.id === pendingPinCalendarId)
  if (!cal) {
    closePinModal()
    return
  }

  const enteredPin = pinInput.value.trim()
  if (!enteredPin || enteredPin !== cal.pin) {
    alert("Incorrect PIN")
    return
  }

  const action = pendingPinAction
  const id = cal.id
  closePinModal()

  if (action === "select") {
    selectCalendar(id)
  } else if (action === "edit") {
    editCalendar(id)
  } else if (action === "delete") {
    openDeleteModal(cal)
  }
})

// Delete calendar modal
function openDeleteModal(calendar, type = "office") {
  pendingDeleteCalendarId = calendar.id
  pendingDeleteCalendarType = type === "expenses" ? "expenses" : "office"

  const displayName =
    type === "expenses"
      ? calendar.title || calendar.name || "Expenses Calendar"
      : calendar.name || calendar.title || "Calendar"
  deleteCalendarName.textContent = displayName

  const warning = document.getElementById("deleteWarningText")
  if (warning) {
    if (calendar.days && Object.keys(calendar.days).length > 0) {
      warning.textContent =
        "This calendar has attendance data. Deleting will remove all records permanently."
    } else {
      warning.textContent =
        "Are you sure you want to delete this calendar? This action cannot be undone."
    }
  }

  deleteModal.classList.add("open")
  overlay.classList.add("active")
}

function closeDeleteModal() {
  deleteModal.classList.remove("open")
  overlay.classList.remove("active")
  pendingDeleteCalendarId = null
  pendingDeleteCalendarType = "office"
}

deleteModalCloseBtn.addEventListener("click", closeDeleteModal)
deleteCancelBtn.addEventListener("click", closeDeleteModal)

deleteConfirmBtn.addEventListener("click", () => {
  if (!pendingDeleteCalendarId) {
    closeDeleteModal()
    return
  }

  if (pendingDeleteCalendarType === "expenses") {
    deleteExpensesCalendar(pendingDeleteCalendarId)
  } else {
    deleteCalendar(pendingDeleteCalendarId)
  }
  closeDeleteModal()
})

function openClearMonthModal() {
  const isExpensesMode = activeMode === "expenses"
  const cal = isExpensesMode ? getActiveExpensesCalendar() : getActiveCalendar()
  if (!cal) return
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const label = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
  if (clearMonthLabel) clearMonthLabel.textContent = label
  if (clearMonthModal) clearMonthModal.classList.add("open")
  overlay.classList.add("active")
}

function closeClearMonthModal() {
  if (clearMonthModal) clearMonthModal.classList.remove("open")
  overlay.classList.remove("active")
}

if (clearMonthBtn) {
  clearMonthBtn.addEventListener("click", openClearMonthModal)
}

if (clearMonthCloseBtn) {
  clearMonthCloseBtn.addEventListener("click", closeClearMonthModal)
}

if (clearMonthCancelBtn) {
  clearMonthCancelBtn.addEventListener("click", closeClearMonthModal)
}

if (clearMonthConfirmBtn) {
  clearMonthConfirmBtn.addEventListener("click", () => {
    const isExpensesMode = activeMode === "expenses"
    const cal = isExpensesMode ? getActiveExpensesCalendar() : getActiveCalendar()
    if (!cal) {
      closeClearMonthModal()
      return
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(year, month, d)
      const key = dateKey(dt)
      if (cal.days && cal.days[key]) {
        delete cal.days[key]
      }
      if (!isExpensesMode && cal.runningDateKey === key) {
        cal.runningDateKey = null
      }
    }

    if (isExpensesMode) {
      saveExpensesCalendars()
      renderCalendar()
      renderExpensesSummary()
    } else {
      saveCalendars()
      renderCalendar()
      renderStats()
      updateSessionBar()
    }

    closeClearMonthModal()
  })
}

// Running timer warning modal
function openRunningModal(calendar) {
  let label = calendar.name

  // If we know which date is running, append a nicely formatted date + time icon
  if (calendar.runningDateKey) {
    const [y, m, d] = calendar.runningDateKey.split("-").map(Number)
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
      const dt = new Date(y, m - 1, d)
      const formatted = dt.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      label = `${calendar.name}  ${formatted} `
    }
  }

  runningModalCalendarName.textContent = label
  runningModal.classList.add("open")
  overlay.classList.add("active")
}

function closeRunningModal() {
  runningModal.classList.remove("open")
  overlay.classList.remove("active")
}

runningModalCloseBtn.addEventListener("click", closeRunningModal)
runningOkBtn.addEventListener("click", closeRunningModal)

// End-of-day reminder modal logic
let activeEndReminderKey = null

function openEndReminderModal(calendar, dateKeyValue) {
  if (!endReminderModal) return
  activeEndReminderKey = dateKeyValue

  if (endReminderSubtitle && calendar.scheduleOutMinutes != null) {
    const minutes = calendar.scheduleOutMinutes
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    const timeLabel = `${pad(h)}:${pad(m)}`
    endReminderSubtitle.textContent = `${calendar.name} · Scheduled end ${timeLabel}`
  } else if (endReminderSubtitle) {
    endReminderSubtitle.textContent = calendar.name
  }

  endReminderModal.classList.add("open")
  overlay.classList.add("active")
}

function closeEndReminderModal() {
  if (!endReminderModal) return
  endReminderModal.classList.remove("open")
  overlay.classList.remove("active")
}

if (endReminderCloseBtn) {
  endReminderCloseBtn.addEventListener("click", closeEndReminderModal)
}

if (endReminderStopBtn) {
  endReminderStopBtn.addEventListener("click", () => {
    const cal = getActiveCalendar()
    if (!cal || !activeEndReminderKey) {
      closeEndReminderModal()
      return
    }

    const key = activeEndReminderKey
    const info = cal.days[key]
    if (!info || !info.inTime) {
      closeEndReminderModal()
      return
    }

    info.outTime = Date.now()
    if (cal.runningDateKey === key) {
      cal.runningDateKey = null
    }
    saveCalendars()
    closeEndReminderModal()
    renderCalendar()
    renderStats()
    updateSessionBar()
  })
}

if (endReminderSnoozeButtons && endReminderSnoozeButtons.length) {
  endReminderSnoozeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cal = getActiveCalendar()
      if (!cal) {
        closeEndReminderModal()
        return
      }

      const minutes = Number(btn.dataset.snooze) || 0
      if (minutes <= 0) {
        closeEndReminderModal()
        return
      }

      const now = Date.now()
      cal.endReminderSnoozeUntil = now + minutes * 60000
      saveCalendars()
      closeEndReminderModal()
    })
  })
}

// Break modal logic
function openBreakModal(calendar) {
  breakModalCalendarName.textContent = calendar.name
  breakReasonInput.value = ""
  breakModal.classList.add("open")
  overlay.classList.add("active")
}

function closeBreakModal() {
  breakModal.classList.remove("open")
  overlay.classList.remove("active")
}

breakModalCloseBtn.addEventListener("click", closeBreakModal)
breakCancelBtn.addEventListener("click", closeBreakModal)

breakDoneBtn.addEventListener("click", () => {
  const cal = getActiveCalendar()
  if (!cal || !activeSessionKey) {
    closeBreakModal()
    return
  }
  const key = activeSessionKey
  if (!cal.days[key]) cal.days[key] = {}
  const info = cal.days[key]

  if (!info.breaks) info.breaks = []
  const reason = breakReasonInput.value.trim() || null
  info.breaks.push({
    start: Date.now(),
    end: null,
    reason,
  })

  saveCalendars()
  closeBreakModal()
  updateSessionBar()
})

// Helper to compute total break minutes from stored break sessions
function computeBreakMinutes(info) {
  if (!info.breaks || !info.breaks.length) return 0
  let total = 0
  const now = Date.now()
  for (const b of info.breaks) {
    if (!b.start) continue
    const end = b.end != null ? b.end : now
    if (end > b.start) {
      total += Math.floor((end - b.start) / 60000)
    }
  }
  return total
}

// Update session bar each time something changes in the active calendar or selection
function updateSessionBar() {
  const cal = getActiveCalendar()

  // Choose fallback date key:
  // 1) If calendar has runningDateKey, use that.
  // 2) Otherwise, if selectedDate exists and has inTime, use that.
  // 3) Otherwise, hide the bar.
  activeSessionKey = cal?.runningDateKey || null

  // As a fallback, if a date is selected and has inTime, treat it as session
  if (cal && !activeSessionKey && selectedDate) {
    const keyFromSelected = dateKey(selectedDate)
    const infoSel = cal.days[keyFromSelected]
    if (infoSel && infoSel.inTime) {
      activeSessionKey = keyFromSelected
    }
  }

  if (!cal || !activeSessionKey) {
    sessionBar.classList.add("hidden")
    if (sessionIntervalId) {
      clearInterval(sessionIntervalId)
      sessionIntervalId = null
    }
    return
  }

  sessionBar.classList.remove("hidden")

  // Clear previous interval
  if (sessionIntervalId) {
    clearInterval(sessionIntervalId)
    sessionIntervalId = null
  }

  const startMs = cal.days[activeSessionKey].inTime
  const endMs = cal.days[activeSessionKey].outTime || Date.now()

  function refresh() {
    const now = Date.now()
    const effectiveEnd = cal.days[activeSessionKey].outTime || now
    const totalMs = Math.max(0, effectiveEnd - startMs)

    // Compute break duration in seconds for live feeling
    let breakSeconds = 0
    if (cal.days[activeSessionKey].breaks && cal.days[activeSessionKey].breaks.length) {
      for (const b of cal.days[activeSessionKey].breaks) {
        if (!b.start) continue
        const end = b.end != null ? b.end : now
        if (end > b.start) {
          breakSeconds += Math.floor((end - b.start) / 1000)
        }
      }
    }

    const totalSeconds = Math.floor(totalMs / 1000)
    const workSeconds = Math.max(0, totalSeconds - breakSeconds)

    if (sessionStartTimeEl) {
      sessionStartTimeEl.textContent = `Start: ${formatTime(startMs)}`
    }
    if (sessionWorkedEl) {
      const h = Math.floor(workSeconds / 3600)
      const m = Math.floor((workSeconds % 3600) / 60)
      const s = workSeconds % 60
      sessionWorkedEl.textContent = `Worked: ${h}h ${m}m ${s}s`
    }
    if (sessionBreakEl) {
      const bh = Math.floor(breakSeconds / 3600)
      const bm = Math.floor((breakSeconds % 3600) / 60)
      const bs = breakSeconds % 60
      sessionBreakEl.textContent = `Break: ${bh}h ${bm}m ${bs}s`
    }

    const productivity = totalSeconds > 0 ? Math.round((workSeconds / totalSeconds) * 100) : 0

    if (sessionProductivityEl) {
      sessionProductivityEl.textContent = `${productivity}% productive`
    }

    if (sessionStatusEl) {
      sessionStatusEl.textContent = cal.days[activeSessionKey].outTime ? "Finished" : "Working"
    }

    // Auto end-of-day reminder once scheduled out time is reached
    if (
      cal &&
      cal.scheduleOutMinutes != null &&
      cal.runningDateKey === activeSessionKey &&
      !cal.days[activeSessionKey].outTime
    ) {
      const [yStr, mStr, dStr] = activeSessionKey.split("-")
      const y = Number(yStr)
      const m = Number(mStr)
      const d = Number(dStr)
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        const scheduled = new Date(y, m - 1, d)
        const totalMinutes = cal.scheduleOutMinutes
        const sh = Math.floor(totalMinutes / 60)
        const sm = totalMinutes % 60
        scheduled.setHours(sh, sm, 0, 0)

        const snoozeUntil = cal.endReminderSnoozeUntil || null
        const snoozed = snoozeUntil && now < snoozeUntil

        if (now >= scheduled.getTime() && !snoozed) {
          if (!endReminderModal || !endReminderModal.classList.contains("open")) {
            openEndReminderModal(cal, activeSessionKey)
          }
        }
      }
    }

    // Also refresh stats so monthly Working Hours and Today Worked
    // reflect the live session progress.
    renderStats()
  }

  refresh()

  if (!cal.days[activeSessionKey].outTime) {
    sessionIntervalId = setInterval(refresh, 1000)
  }

  // Update buttons visibility
  if (sessionBreakBtn && sessionBackBtn) {
    const onBreak = cal.days[activeSessionKey].breaks && cal.days[activeSessionKey].breaks.length && cal.days[activeSessionKey].breaks[cal.days[activeSessionKey].breaks.length - 1].end == null
    if (onBreak) {
      sessionBreakBtn.style.display = "none"
      sessionBackBtn.style.display = "inline-block"
    } else {
      sessionBreakBtn.style.display = "inline-block"
      sessionBackBtn.style.display = "none"
    }
  }
}

// Session bar buttons
if (sessionBreakBtn) {
  sessionBreakBtn.addEventListener("click", () => {
    const cal = getActiveCalendar()
    if (!cal || !activeSessionKey) return
    const key = activeSessionKey
    if (!cal.days[key]) cal.days[key] = {}
    const info = cal.days[key]

    // If already on break, ignore
    if (info.breaks && info.breaks.length && info.breaks[info.breaks.length - 1].end == null) {
      return
    }

    openBreakModal(cal)
  })
}

if (sessionBackBtn) {
  sessionBackBtn.addEventListener("click", () => {
    const cal = getActiveCalendar()
    if (!cal || !activeSessionKey) return
    const key = activeSessionKey
    if (!cal.days[key]) cal.days[key] = {}
    const info = cal.days[key]
    if (!info.breaks || !info.breaks.length) return
    const last = info.breaks[info.breaks.length - 1]
    if (last.end == null) {
      last.end = Date.now()
    }
    saveCalendars()
    updateSessionBar()
  })
}

if (sessionEndBtn) {
  sessionEndBtn.addEventListener("click", () => {
    const cal = getActiveCalendar()
    if (!cal || !activeSessionKey) return
    const key = activeSessionKey
    endSessionForDate(cal, key)
  })
}

// Expenses storage helpers
function loadExpensesCalendars() {
  try {
    const data = localStorage.getItem(EXPENSES_STORAGE_KEY)
    if (!data) {
      expensesCalendars = []
      activeExpensesCalendarId = null
    } else {
      const parsed = JSON.parse(data)
      expensesCalendars = parsed.expensesCalendars || []
      activeExpensesCalendarId =
        parsed.activeExpensesCalendarId || (expensesCalendars[0]?.id ?? null)
    }
  } catch (e) {
    expensesCalendars = []
    activeExpensesCalendarId = null
  }
  updateAppTitle()
  renderExpensesSummary()
}

function saveExpensesCalendars() {
  localStorage.setItem(
    EXPENSES_STORAGE_KEY,
    JSON.stringify({ expensesCalendars, activeExpensesCalendarId })
  )
}

// Init
loadCalendars()
loadExpensesCalendars()
renderCalendarList()
renderExpensesCalendarList()
renderCalendar()
