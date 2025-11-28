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
          workingDaysPerWeek: 6,
          scheduleInMinutes: 9 * 60,
          scheduleOutMinutes: 18 * 60,
          runningDateKey: null,
          pin: null,
          days: {},
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

function updateAppTitle() {
  if (!appTitleEl) return
  const cal = getActiveCalendar()
  appTitleEl.textContent = cal ? cal.name : "Office Calendar"
}

// Backup / restore
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

function importBackup(file) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target.result
      const data = JSON.parse(text)

      if (!data || !Array.isArray(data.calendars)) {
        alert("Invalid backup file.")
        return
      }

      calendars = data.calendars
      activeCalendarId = data.activeCalendarId || (calendars[0]?.id ?? null)
      saveCalendars()
      renderCalendarList()
      renderCalendar()
      renderStats()
      updateAppTitle()
      alert("Backup restored successfully.")
    } catch (err) {
      alert("Could not read backup file.")
    }
  }
  reader.readAsText(file)
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

overlay.addEventListener("click", () => {
  if (drawer.classList.contains("open")) closeDrawer()
  if (dateModal.classList.contains("open")) closeModal()
  if (pinModal.classList.contains("open")) closePinModal()
  if (deleteModal.classList.contains("open")) closeDeleteModal()
  if (runningModal.classList.contains("open")) closeRunningModal()
  if (breakModal.classList.contains("open")) closeBreakModal()
  if (reportModal && reportModal.classList.contains("open")) closeReportModal()
})

// Drawer tabs
drawerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    drawerTabs.forEach((t) => t.classList.remove("active"))
    drawerPanels.forEach((p) => p.classList.remove("active"))
    tab.classList.add("active")
    const targetId = tab.dataset.tab + "Tab"
    const panel = document.getElementById(targetId)
    if (panel) panel.classList.add("active")
  })
})

// Calendar list rendering
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
        ? `Monthly: ₹${cal.salaryMonthly || 0} | Hourly: ₹${
            cal.salaryHourly || 0
          }`
        : "No salary set"
    meta.textContent =
      cal.pin && cal.pin.length
        ? `${salaryText} • PIN Protected`
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

function selectCalendar(id) {
  const cal = calendars.find((c) => c.id === id)
  if (!cal) return
  activeCalendarId = id

  saveCalendars()
  renderCalendarList()
  renderCalendar()
  renderStats()
  updateAppTitle()
  closeDrawer()
}

function editCalendar(id) {
  const cal = calendars.find((c) => c.id === id)
  if (!cal) return

  // Switch form into edit mode
  editingCalendarId = id

  // Pre-fill fields from existing calendar
  calendarNameInput.value = cal.name || ""
  calendarDescriptionInput.value = cal.description || ""
  salaryMonthlyInput.value = cal.salaryMonthly != null ? cal.salaryMonthly : ""
  salaryHourlyInput.value = cal.salaryHourly != null ? cal.salaryHourly : ""
  if (workingDaysPerWeekInput) {
    workingDaysPerWeekInput.value = cal.workingDaysPerWeek || 6
  }
  calendarPinInput.value = cal.pin || ""

  // Convert stored schedule minutes back to HH:MM for the time inputs
  if (cal.scheduleInMinutes != null) {
    const h = Math.floor(cal.scheduleInMinutes / 60)
    const m = cal.scheduleInMinutes % 60
    officeInTimeInput.value = `${pad(h)}:${pad(m)}`
  } else {
    officeInTimeInput.value = ""
  }

  if (cal.scheduleOutMinutes != null) {
    const h2 = Math.floor(cal.scheduleOutMinutes / 60)
    const m2 = cal.scheduleOutMinutes % 60
    officeOutTimeInput.value = `${pad(h2)}:${pad(m2)}`
  } else {
    officeOutTimeInput.value = ""
  }

  // Show form and adjust button label
  calendarForm.classList.add("visible")
  if (calendarSubmitBtn) {
    calendarSubmitBtn.textContent = "Save"
  }
}

function deleteCalendar(id) {
  if (calendars.length === 1) {
    alert("At least one calendar must exist.")
    return
  }
  const cal = calendars.find((c) => c.id === id)
  if (!cal) return

  calendars = calendars.filter((c) => c.id !== id)
  if (activeCalendarId === id) {
    activeCalendarId = calendars[0]?.id || null
  }
  // Clear any active session for deleted calendar
  activeSessionKey = null
  saveCalendars()
  renderCalendarList()
  renderCalendar()
  renderStats()
  updateAppTitle()
}

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

backupExportBtn.addEventListener("click", exportBackup)
backupImportBtn.addEventListener("click", () => backupFileInput.click())
backupFileInput.addEventListener("change", (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  importBackup(file)
  backupFileInput.value = ""
})

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
    const info = cal?.days?.[key]

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
  // holidays and approved leaves.
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

        plannedMinutes += perDay
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
    if (todayMinutes > 0) {
      statWorkingHours.textContent = `${pHours}h ${pMins}m / ${hours}h ${mins}m (Today ${tHours}h ${tMins}m)`
    } else {
      statWorkingHours.textContent = `${pHours}h ${pMins}m / ${hours}h ${mins}m`
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

// Month navigation
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1)
  renderCalendar()
})

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1)
  renderCalendar()
})

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
  modalCalendarName.textContent = cal.name

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
  inTimeCell.addEventListener("input", () => {
    if (saveTimeBtn) saveTimeBtn.style.display = "inline-block"
  })
}

if (outTimeCell) {
  outTimeCell.addEventListener("input", () => {
    if (saveTimeBtn) saveTimeBtn.style.display = "inline-block"
  })
}

function saveManualTimes() {
  const cal = getActiveCalendar()
  if (!cal || !selectedDate) return

  const key = dateKey(selectedDate)
  if (!cal.days[key]) cal.days[key] = {}
  const info = cal.days[key]

  let hasChanges = false

  // In time
  if (inTimeCell && inTimeCell.value) {
    const inDate = buildDateWithTime(selectedDate, inTimeCell.value)
    if (inDate) {
      info.inTime = inDate.getTime()
      hasChanges = true
    }
  }

  // Out time
  if (outTimeCell && outTimeCell.value) {
    const outDate = buildDateWithTime(selectedDate, outTimeCell.value)
    if (outDate) {
      info.outTime = outDate.getTime()
      hasChanges = true
    }
  }

  // If any time set and no status, mark present
  if ((info.inTime || info.outTime) && !info.status) {
    info.status = "present"
  }

  if (hasChanges) {
    saveCalendars()
    renderCalendar()
    renderStats()
  }

  if (saveTimeBtn) saveTimeBtn.style.display = "none"
  closeModal()
}

if (saveTimeBtn) {
  saveTimeBtn.addEventListener("click", saveManualTimes)
}

// PIN modal logic
function openPinModal(calendar, action) {
  pendingPinCalendarId = calendar.id
  pendingPinAction = action
  pinCalendarName.textContent = calendar.name || ""
  pinInput.value = ""
  pinModal.classList.add("open")
  overlay.classList.add("active")
}

function closePinModal() {
  pinModal.classList.remove("open")
  pendingPinCalendarId = null
  pendingPinAction = null
  overlay.classList.remove("active")
}

pinModalCloseBtn.addEventListener("click", closePinModal)
pinCancelBtn.addEventListener("click", closePinModal)

pinUnlockBtn.addEventListener("click", () => {
  const cal = calendars.find((c) => c.id === pendingPinCalendarId)
  if (!cal) {
    closePinModal()
    return
  }
  const entered = pinInput.value
  if (entered !== cal.pin) {
    alert("Incorrect PIN")
    return
  }

  const action = pendingPinAction
  closePinModal()

  if (action === "select") {
    selectCalendar(cal.id)
  } else if (action === "edit") {
    editCalendar(cal.id)
  } else if (action === "delete") {
    // For PIN-protected calendars, still go through delete modal
    openDeleteModal(cal)
  }
})

// Delete calendar modal logic
function openDeleteModal(calendar) {
  pendingDeleteCalendarId = calendar.id
  if (deleteCalendarName) {
    deleteCalendarName.textContent = calendar.name || ""
  }
  deleteModal.classList.add("open")
  overlay.classList.add("active")
}

function closeDeleteModal() {
  deleteModal.classList.remove("open")
  overlay.classList.remove("active")
  pendingDeleteCalendarId = null
}

if (deleteModalCloseBtn) {
  deleteModalCloseBtn.addEventListener("click", closeDeleteModal)
}

if (deleteCancelBtn) {
  deleteCancelBtn.addEventListener("click", closeDeleteModal)
}

if (deleteConfirmBtn) {
  deleteConfirmBtn.addEventListener("click", () => {
    if (!pendingDeleteCalendarId) {
      closeDeleteModal()
      return
    }
    deleteCalendar(pendingDeleteCalendarId)
    closeDeleteModal()
  })
}

// Break modal helpers
function openBreakModal(cal) {
  if (breakModalCalendarName) {
    breakModalCalendarName.textContent = cal.name || ""
  }
  if (breakReasonInput) breakReasonInput.value = ""
  breakModal.classList.add("open")
  overlay.classList.add("active")
}

function closeBreakModal() {
  breakModal.classList.remove("open")
  overlay.classList.remove("active")
}

if (breakModalCloseBtn) {
  breakModalCloseBtn.addEventListener("click", closeBreakModal)
}

if (breakCancelBtn) {
  breakCancelBtn.addEventListener("click", closeBreakModal)
}

if (breakDoneBtn) {
  breakDoneBtn.addEventListener("click", () => {
    const cal = getActiveCalendar()
    if (!cal || !activeSessionKey) {
      closeBreakModal()
      return
    }
    const key = activeSessionKey
    if (!cal.days[key]) cal.days[key] = {}
    const info = cal.days[key]

    // Ensure break tracking fields
    if (!info.breaks) info.breaks = []
    const reason = breakReasonInput ? breakReasonInput.value.trim() : ""
    info.breaks.push({
      start: Date.now(),
      end: null,
      reason,
    })

    saveCalendars()
    closeBreakModal()
    updateSessionBar()
  })
}

// Chip actions
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    if (!selectedDate) return
    const action = chip.dataset.action
    handleDateAction(action)
  })
})

function formatTime(ms) {
  const d = new Date(ms)
  const h = d.getHours()
  const m = d.getMinutes()
  return `${pad(h)}:${pad(m)}`
}

function handleDateAction(action) {
  const cal = getActiveCalendar()
  if (!cal || !selectedDate) return

  const key = dateKey(selectedDate)
  if (!cal.days[key]) cal.days[key] = {}
  const info = cal.days[key]

  const now = Date.now()

  if (action === "workStart") {
    // If another day is already running, show warning and block
    if (cal.runningDateKey && cal.runningDateKey !== key) {
      openRunningModal(cal)
      return
    }
    info.status = info.status || "present"
    info.inTime = now
    cal.runningDateKey = key
  } else if (action === "workEnd") {
    info.outTime = now
    if (!info.status) info.status = "present"
    // Clear running flag if this is the running day
    if (cal.runningDateKey === key) {
      cal.runningDateKey = null
    }
    activeSessionKey = null
  } else if (action === "present") {
    info.status = "present"
  } else if (action === "absent") {
    info.status = "absent"
  } else if (action === "holiday") {
    info.status = "holiday"
  } else if (action === "halfDay") {
    info.status = "halfday"
  } else if (action === "leave") {
    info.status = "leave"
  }

  if (info.inTime && inTimeCell) inTimeCell.value = formatTime(info.inTime)
  if (info.outTime && outTimeCell) outTimeCell.value = formatTime(info.outTime)

  saveCalendars()
  renderCalendar()
  renderStats()

  // Start/stop session bar based on actions
  if (action === "workStart" || action === "present") {
    startSessionForDate(cal, key)
  } else if (action === "workEnd") {
    endSessionForDate(cal, key)
  }
}

// Running warning modal
function openRunningModal(calendar) {
  if (runningModalCalendarName) {
    runningModalCalendarName.textContent = calendar.name || ""
  }
  runningModal.classList.add("open")
  overlay.classList.add("active")
}

function closeRunningModal() {
  runningModal.classList.remove("open")
  overlay.classList.remove("active")
}

if (runningModalCloseBtn) {
  runningModalCloseBtn.addEventListener("click", closeRunningModal)
}

if (runningOkBtn) {
  runningOkBtn.addEventListener("click", closeRunningModal)
}

// Session bar logic
function startSessionForDate(cal, key) {
  if (!cal.days[key]) cal.days[key] = {}
  const info = cal.days[key]

  if (!info.inTime) {
    info.inTime = Date.now()
  }
  if (!info.sessionStart) {
    info.sessionStart = info.inTime
  }
  if (!info.breaks) info.breaks = []

  activeSessionKey = key

  saveCalendars()
  updateSessionBar()
}

function endSessionForDate(cal, key) {
  if (!cal.days[key]) cal.days[key] = {}
  const info = cal.days[key]
  if (!info.outTime) {
    info.outTime = Date.now()
  }

  // Close any open break
  if (info.breaks && info.breaks.length) {
    const last = info.breaks[info.breaks.length - 1]
    if (last.end == null) {
      last.end = Date.now()
    }
  }

  // Also clear running flag for this calendar
  if (cal.runningDateKey === key) {
    cal.runningDateKey = null
  }

  // Clear active session so bar hides after finishing
  activeSessionKey = null

  saveCalendars()
  renderCalendar()
  renderStats()
  updateSessionBar()
}

function computeBreakMinutes(info) {
  if (!info.breaks || !info.breaks.length) return 0
  let total = 0
  const now = Date.now()
  for (const b of info.breaks) {
    if (!b.start) continue
    const end = b.end != null ? b.end : now
    if (end > b.start) total += Math.floor((end - b.start) / 60000)
  }
  return total
}

function updateSessionBar() {
  if (!sessionBar) return

  const cal = getActiveCalendar()
  // If no explicit activeSessionKey, but calendar has a running day, use that
  if (cal && !activeSessionKey && cal.runningDateKey) {
    activeSessionKey = cal.runningDateKey
  }

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