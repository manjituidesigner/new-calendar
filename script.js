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

// Modal elements
const dateModal = document.getElementById("dateModal")
const modalCloseBtn = document.getElementById("modalCloseBtn")
const modalDateLabel = document.getElementById("modalDateLabel")
const modalCalendarName = document.getElementById("modalCalendarName")
const inTimeCell = document.getElementById("inTimeCell") // now an <input type="time">
const outTimeCell = document.getElementById("outTimeCell") // now an <input type="time">
const saveTimeBtn = document.getElementById("saveTimeBtn")

// Report modal elements
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
const reportTableBody = document.getElementById("reportTableBody")
const reportDownloadBtn = document.getElementById("reportDownloadBtn")
const reportShareBtn = document.getElementById("reportShareBtn")

// Expenses stats & drawer elements
const officeStatsSection = document.getElementById("officeStatsSection")
const expensesStatsSection = document.getElementById("expensesStatsSection")
const expensesPayeeSection = document.getElementById("expensesPayeeSection")
const expTodayEl = document.getElementById("expToday")
const expTotalSpentEl = document.getElementById("expTotalSpent")
const expMonthlyBudgetEl = document.getElementById("expMonthlyBudget")
const expRemainingEl = document.getElementById("expRemaining")
const expOverBudgetEl = document.getElementById("expOverBudget")
const expWalletBalanceEl = document.getElementById("expWalletBalance")
const expensesPayeeTableBody = document.getElementById("expensesPayeeTableBody")
const expensesViewReportBtn = document.getElementById("expensesViewReportBtn")

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
      setTimeout(() => {
        if (expensesCalendarForm) {
          expensesCalendarForm.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 0)
    }
  })

  expensesCalendarForm.addEventListener("submit", (e) => {
    e.preventDefault()
  })
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

// Expenses monthly report modal
const expensesReportModal = document.getElementById("expensesReportModal")
const expensesReportCloseBtn = document.getElementById("expensesReportCloseBtn")
const expensesReportTitle = document.getElementById("expensesReportTitle")
const expensesReportSubtitle = document.getElementById("expensesReportSubtitle")
const expReportPayeeNameEl = document.getElementById("expReportPayeeName")
const expReportTotalEl = document.getElementById("expReportTotal")
const expReportPaidEl = document.getElementById("expReportPaid")
const expReportPendingEl = document.getElementById("expReportPending")
const expReportCarryLabelEl = document.getElementById("expReportCarryLabel")
const expReportCarryValueEl = document.getElementById("expReportCarryValue")
const expensesReportTableBody = document.getElementById("expensesReportTableBody")
const expensesReportDownloadBtn = document.getElementById(
  "expensesReportDownloadBtn"
)
const expensesReportShareBtn = document.getElementById("expensesReportShareBtn")

// Clear month elements
const clearMonthBtn = document.getElementById("clearMonthBtn")
const clearMonthModal = document.getElementById("clearMonthModal")
const clearMonthLabel = document.getElementById("clearMonthLabel")
const clearMonthCloseBtn = document.getElementById("clearMonthCloseBtn")
const clearMonthCancelBtn = document.getElementById("clearMonthCancelBtn")
const clearMonthConfirmBtn = document.getElementById("clearMonthConfirmBtn")

// PIN modal elements
const pinModal = document.getElementById("pinModal")
const pinModalCloseBtn = document.getElementById("pinModalCloseBtn")
const pinCalendarName = document.getElementById("pinCalendarName")
const pinInput = document.getElementById("pinInput")
const pinUnlockBtn = document.getElementById("pinUnlockBtn")
const pinCancelBtn = document.getElementById("pinCancelBtn")

// Delete calendar modal elements
const deleteModal = document.getElementById("deleteModal")
const deleteModalCloseBtn = document.getElementById("deleteModalCloseBtn")
const deleteCalendarName = document.getElementById("deleteCalendarName")
const deleteCancelBtn = document.getElementById("deleteCancelBtn")
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn")

// Running timer warning modal elements
const runningModal = document.getElementById("runningModal")
const runningModalCloseBtn = document.getElementById("runningModalCloseBtn")
const runningModalCalendarName = document.getElementById("runningModalCalendarName")
const runningOkBtn = document.getElementById("runningOkBtn")

// End-of-day reminder modal elements
const endReminderModal = document.getElementById("endReminderModal")
const endReminderCloseBtn = document.getElementById("endReminderCloseBtn")
const endReminderSubtitle = document.getElementById("endReminderSubtitle")
const endReminderStopBtn = document.getElementById("endReminderStopBtn")
const endReminderSnoozeButtons = document.querySelectorAll("#endReminderModal [data-snooze]")

// Break modal elements
const breakModal = document.getElementById("breakModal")
const breakModalCloseBtn = document.getElementById("breakModalCloseBtn")
const breakModalCalendarName = document.getElementById("breakModalCalendarName")
const breakReasonInput = document.getElementById("breakReasonInput")
const breakCancelBtn = document.getElementById("breakCancelBtn")
const breakDoneBtn = document.getElementById("breakDoneBtn")

let pendingPinCalendarId = null
let pendingPinAction = null // "select" | "edit" | "delete"
let pendingDeleteCalendarId = null
let sessionIntervalId = null
let activeSessionKey = null // date key that session bar is tracking
let holidayViewDate = null

// Utility
const pad = (n) => (n < 10 ? "0" + n : "" + n)

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
}

function monthKeyFromYearMonth(year, monthIndex) {
  // monthIndex is 0-based
  return `${year}-${pad(monthIndex + 1)}`
}

function ensureCalendarHolidays(cal) {
  if (!cal.holidays) cal.holidays = {}
}

function buildDateWithTime(baseDate, timeStr) {
  if (!timeStr) return null
  const [hStr, mStr] = timeStr.split(":")
  const h = Number(hStr)
  const m = Number(mStr)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  const d = new Date(baseDate.getTime())
  d.setHours(h, m, 0, 0)
  return d
}

function formatMinutesToHM(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

// Format a timestamp (ms) or Date into HH:MM for UI labels
function formatTime(value) {
  const d = value instanceof Date ? value : new Date(value)
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${hh}:${mm}`
}

// Storage helpers
function loadCalendars() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      calendars = [
        {
          id: "default",
          name: "Default Office",
          description: "Primary work calendar",
          salaryMonthly: 0,
          salaryHourly: 0,
          workingDaysPerWeek: 6,
          scheduleInMinutes: 9 * 60,
          scheduleOutMinutes: 18 * 60,
          runningDateKey: null,
          pin: null,
          days: {},
          holidays: {},
        },
      ]

      activeCalendarId = "default"
      saveCalendars()
    } else {
      const parsed = JSON.parse(data)
      calendars = parsed.calendars || []
      activeCalendarId = parsed.activeCalendarId || (calendars[0]?.id ?? null)
    }
  } catch (e) {
    calendars = []
    activeCalendarId = null
  }
  updateAppTitle()
}

function saveCalendars() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ calendars, activeCalendarId })
  )
}

function getActiveCalendar() {
  return calendars.find((c) => c.id === activeCalendarId) || null
}

function getActiveExpensesCalendar() {
  return expensesCalendars.find((c) => c.id === activeExpensesCalendarId) || null
}

function updateAppTitle() {
  if (!appTitleEl) return
  if (activeMode === "office") {
    const cal = getActiveCalendar()
    appTitleEl.textContent = cal ? cal.name : "Office Calendar"
  } else {
    const expCal = getActiveExpensesCalendar()
    appTitleEl.textContent = expCal ? expCal.title : "Expenses Calendar"
  }
}

// Drawer + overlay
function openDrawer() {
  drawer.classList.add("open")
  overlay.classList.add("active")
}

function closeDrawer() {
  drawer.classList.remove("open")
  overlay.classList.remove("active")
}

menuBtn.addEventListener("click", openDrawer)
drawerCloseBtn.addEventListener("click", closeDrawer)

// ...

// Create calendar form
createCalendarToggle.addEventListener("click", () => {
  const willShow = !calendarForm.classList.contains("visible")
  calendarForm.classList.toggle("visible")

  // If opening the form via toggle, assume create mode
  if (willShow) {
    editingCalendarId = null
    calendarNameInput.value = ""
    calendarDescriptionInput.value = ""
    salaryMonthlyInput.value = ""
    salaryHourlyInput.value = ""
    if (workingDaysPerWeekInput) {
      workingDaysPerWeekInput.value = 6
    }
    calendarPinInput.value = ""
    officeInTimeInput.value = ""
    officeOutTimeInput.value = ""
    if (calendarSubmitBtn) {
      calendarSubmitBtn.textContent = "Add"
    }
  }
})

calendarForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const name = calendarNameInput.value.trim()
  if (!name) {
    alert("Please enter a calendar name.")
    return
  }
  const desc = calendarDescriptionInput.value.trim()
  const salaryMonthly = Number(salaryMonthlyInput.value) || 0
  const salaryHourly = Number(salaryHourlyInput.value) || 0
  const pin = calendarPinInput.value.trim() || null
  const workingDaysPerWeek = workingDaysPerWeekInput
    ? Number(workingDaysPerWeekInput.value) || 6
    : 6

  // Parse office schedule times (HH:MM -> minutes)
  const inStr = officeInTimeInput.value
  const outStr = officeOutTimeInput.value
  let scheduleInMinutes = null
  let scheduleOutMinutes = null
  if (inStr && outStr) {
    const [ih, im] = inStr.split(":").map(Number)
    const [oh, om] = outStr.split(":").map(Number)
    if (!Number.isNaN(ih) && !Number.isNaN(im)) {
      scheduleInMinutes = ih * 60 + im
    }
    if (!Number.isNaN(oh) && !Number.isNaN(om)) {
      scheduleOutMinutes = oh * 60 + om
    }
  }

  if (editingCalendarId) {
    // Update existing calendar
    const cal = calendars.find((c) => c.id === editingCalendarId)
    if (cal) {
      cal.name = name
      cal.description = desc
      cal.salaryMonthly = salaryMonthly
      cal.salaryHourly = salaryHourly
      cal.pin = pin
      cal.workingDaysPerWeek = workingDaysPerWeek
      cal.scheduleInMinutes = scheduleInMinutes
      cal.scheduleOutMinutes = scheduleOutMinutes
    }
  } else {
    // Create a new calendar
    const id = "cal_" + Date.now()
    calendars.push({
      id,
      name,
      description: desc,
      salaryMonthly,
      salaryHourly,
      workingDaysPerWeek,
      scheduleInMinutes,
      scheduleOutMinutes,
      pin,
      days: {},
      holidays: {},
    })
    activeCalendarId = id
  }

  saveCalendars()
  calendarNameInput.value = ""
  calendarDescriptionInput.value = ""
  salaryMonthlyInput.value = ""
  salaryHourlyInput.value = ""
  if (workingDaysPerWeekInput) {
    workingDaysPerWeekInput.value = 6
  }
  calendarPinInput.value = ""
  officeInTimeInput.value = ""
  officeOutTimeInput.value = ""

  calendarForm.classList.remove("visible")
  editingCalendarId = null
  if (calendarSubmitBtn) {
    calendarSubmitBtn.textContent = "Add"
  }
  renderCalendarList()
  renderCalendar()
  renderStats()
  updateAppTitle()
})

// Backup / restore for office calendars
function exportBackup() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    calendars,
    activeCalendarId,
  }

  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  const ts = new Date().toISOString().replace(/[:.]/g, "-")
  a.download = `work-calendar-backup-${ts}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

backupExportBtn.addEventListener("click", exportBackup)
backupImportBtn.addEventListener("click", () => backupFileInput.click())

backupFileInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  importBackup(file)
  backupFileInput.value = ""
})

// Calendar list rendering (office calendars)
function renderCalendarList() {
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
        ? `Monthly:  ${cal.salaryMonthly || 0} | Hourly:  ${
            cal.salaryHourly || 0
          }`
        : "No salary set"
    meta.textContent =
      cal.pin && cal.pin.length
        ? `${salaryText}   PIN Protected`
        : salaryText

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

    // Clicking anywhere on the row (except buttons) selects the calendar
    item.addEventListener("click", (e) => {
      if (e.target instanceof HTMLButtonElement) return
      if (cal.pin) {
        openPinModal(cal, "select")
      } else {
        selectCalendar(cal.id)
      }
    })

    calendarListEl.appendChild(item)

    if (cal.id === activeCalendarId) {
      item.style.outline = "2px solid rgba(0,122,255,0.7)"
    }
  })
}

// Calendar rendering
function renderCalendar() {
  const cal = getActiveCalendar()
  const today = new Date()

  updateAppTitle()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  monthLabel.textContent = currentDate.toLocaleString("default", {
    month: "long",
  })
  yearLabel.textContent = String(year)

  const firstDayOfMonth = new Date(year, month, 1)
  const startingWeekday = firstDayOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  statDaysInMonth.textContent = daysInMonth

  daysGrid.innerHTML = ""

  // 6 rows x 7 cols (42 cells)
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
    let info = cal?.days?.[key]

    // Apply configured holidays from settings (per month/day)
    if (cal) {
      ensureCalendarHolidays(cal)
      const mKey = monthKeyFromYearMonth(year, month)
      const holMonth = cal.holidays[mKey]
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

    if (info?.status) {
      applyStatusClass(cellDiv, info.status)
    }

    // Running timer indicator
    if (cal && cal.runningDateKey === key) {
      cellDiv.classList.add("running")
    }

    cellDiv.addEventListener("click", () => {
      openModal(cellDate)
    })

    daysGrid.appendChild(cellDiv)
    dayNum++
  }

  renderStats()

  // Update session bar based on current active calendar and selectedDate
  updateSessionBar()
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
        const dayCap = todayInfo.status === "halfday" ? Math.floor(perDay / 2) : perDay
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
  statSalary.textContent = "" + Math.round(salary)
}

// Month navigation
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1)
  renderCalendar()
})

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1)
  renderCalendar()
})

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

if (reportBtn) {
  reportBtn.addEventListener("click", openReportModal)
}

if (reportCloseBtn) {
  reportCloseBtn.addEventListener("click", closeReportModal)
}

// Download PDF: rely on browser print dialog (user can save as PDF)
if (reportDownloadBtn) {
  reportDownloadBtn.addEventListener("click", () => {
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
  if (!cal.days[key]) cal.days[key] = {}
  const info = cal.days[key]

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
function openDeleteModal(calendar) {
  pendingDeleteCalendarId = calendar.id
  deleteCalendarName.textContent = calendar.name

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
}

deleteModalCloseBtn.addEventListener("click", closeDeleteModal)
deleteCancelBtn.addEventListener("click", closeDeleteModal)

deleteConfirmBtn.addEventListener("click", () => {
  if (!pendingDeleteCalendarId) {
    closeDeleteModal()
    return
  }

  deleteCalendar(pendingDeleteCalendarId)
  closeDeleteModal()
})

function openClearMonthModal() {
  const cal = getActiveCalendar()
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
    const cal = getActiveCalendar()
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
      if (cal.runningDateKey === key) {
        cal.runningDateKey = null
      }
    }

    saveCalendars()
    renderCalendar()
    renderStats()
    updateSessionBar()
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

  const key = activeSessionKey
  const info = cal.days[key]

  if (!info || !info.inTime) {
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

  const startMs = info.inTime
  const endMs = info.outTime || Date.now()

  function refresh() {
    const now = Date.now()
    const effectiveEnd = info.outTime || now
    const totalMs = Math.max(0, effectiveEnd - startMs)

    // Compute break duration in seconds for live feeling
    let breakSeconds = 0
    if (info.breaks && info.breaks.length) {
      for (const b of info.breaks) {
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
      sessionStatusEl.textContent = info.outTime ? "Finished" : "Working"
    }

    // Auto end-of-day reminder once scheduled out time is reached
    if (
      cal &&
      cal.scheduleOutMinutes != null &&
      cal.runningDateKey === key &&
      !info.outTime
    ) {
      const [yStr, mStr, dStr] = key.split("-")
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
            openEndReminderModal(cal, key)
          }
        }
      }
    }

    // Also refresh stats so monthly Working Hours and Today Worked
    // reflect the live session progress.
    renderStats()
  }

  refresh()

  if (!info.outTime) {
    sessionIntervalId = setInterval(refresh, 1000)
  }

  // Update buttons visibility
  if (sessionBreakBtn && sessionBackBtn) {
    const onBreak = info.breaks && info.breaks.length && info.breaks[info.breaks.length - 1].end == null
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

// Init
loadCalendars()
renderCalendarList()
renderCalendar()