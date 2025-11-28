// Basic in-memory + localStorage data model
const STORAGE_KEY = "mobileWorkCalendars_v1"

let calendars = []
let activeCalendarId = null
let currentDate = new Date()
let selectedDate = null
let editingCalendarId = null

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
const reportBtn = document.getElementById("reportBtn")

const drawerTabs = document.querySelectorAll(".drawer-tab")
const drawerPanels = document.querySelectorAll(".drawer-panel")

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

// Utility
const pad = (n) => (n < 10 ? "0" + n : "" + n)

function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`
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