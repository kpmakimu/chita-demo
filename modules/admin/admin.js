let selectedAppFilter = null
let activeRowReference = null

let currentPage = 1
const ITEMS_PER_PAGE = 5

function asc (id, el) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'))
  document
    .querySelectorAll('.sb-item, .sb-sub-item')
    .forEach(n => n.classList.remove('on'))

  const subPanel = document.getElementById('s-' + id)
  if (subPanel) subPanel.classList.add('on')

  if (el) {
    el.classList.add('on')
  } else {
    const matchingSidebarElement = document.querySelector(
      `[onclick*="asc('${id}'"]`
    )
    if (matchingSidebarElement) matchingSidebarElement.classList.add('on')
  }

  document.getElementById('atitle').textContent = el
    ? el.innerText.split('\n')[0]
    : id.toUpperCase().replace('-', ' ')

  if (id === 'orders') {
    loadAdminOrders()
  }

  if (id === 'apps') {
    //exitApplicationDetail();

    document.getElementById('atitle').innerText = 'Applications'
    setTimeout(() => {
      const firstVisibleRow = document.querySelector(
        '#main-apps-table tbody tr'
      )
      if (firstVisibleRow) {
        launchApplicationDetail(firstVisibleRow)
      }
    }, 50)
  }

  toggleSidebar(false)
}

function tabShow (id, el) {
  document
    .querySelectorAll('.tab-pane')
    .forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.mini-tab').forEach(t => t.classList.remove('on'))

  const coreTab = document.getElementById(id)
  if (coreTab) coreTab.classList.add('active')

  if (el) {
    el.classList.add('on')
  } else {
    const associatedMiniTab = document.querySelector(
      `[onclick*='tabShow(\"${id}\"']`
    )
    if (associatedMiniTab) associatedMiniTab.classList.add('on')
  }
}

function toggleSubmenu (parentItem) {
  const container = parentItem.parentElement
  const isOpen = container.classList.contains('open')

  document.querySelectorAll('.sb-has-dropdown').forEach(item => {
    item.classList.remove('open')
  })

  if (!isOpen) {
    container.classList.add('open')
  }
}

function toggleNotifMenu (event) {
  event.stopPropagation()
  const profCard = document.getElementById('profileDropdownCard')
  if (profCard) profCard.classList.remove('active')

  const card = document.getElementById('dropdownCard')
  if (card) card.classList.toggle('active')
}

function toggleProfileMenu (event) {
  event.stopPropagation()
  const notifCard = document.getElementById('dropdownCard')
  if (notifCard && notifCard.classList.contains('active'))
    notifCard.classList.remove('active')

  const card = document.getElementById('profileDropdownCard')
  if (card) card.classList.toggle('active')
}

function openModal (modalId) {
  const modal = document.getElementById(modalId)
  if (modal) modal.classList.add('active')
  const profCard = document.getElementById('profileDropdownCard')
  if (profCard) profCard.classList.remove('active')
}

function closeModal (modalId) {
  const modal = document.getElementById(modalId)
  if (modal) modal.classList.remove('active')
}

window.addEventListener('click', function () {
  const notifCard = document.getElementById('dropdownCard')
  if (notifCard && notifCard.classList.contains('active'))
    notifCard.classList.remove('active')

  const profCard = document.getElementById('profileDropdownCard')
  if (profCard && profCard.classList.contains('active'))
    profCard.classList.remove('active')
})

function openAuthorizationsQueue () {
  asc('pending', null)
  const card = document.getElementById('dropdownCard')
  if (card) card.classList.remove('active')

  const clearanceSubItem = document.querySelector(
    '[onclick*="asc(\'pending\'"]'
  )
  if (clearanceSubItem) clearanceSubItem.classList.add('on')
}

function evaluateMasterFilters () {
  const searchVal = document
    .getElementById('f-search')
    .value.toLowerCase()
    .trim()
  const typeVal = document.getElementById('f-type').value
  const deptElement = document.getElementById('f-dept')
  const deptVal = deptElement ? deptElement.value : ''
  const statusVal = document.getElementById('f-status').value

  const tableRows = document.querySelectorAll('#main-apps-table tbody tr')
  const titleElement = document.getElementById('app-table-title')

  let activeCriteriaDescriptions = []
  if (selectedAppFilter)
    activeCriteriaDescriptions.push(`Card: ${selectedAppFilter}`)
  if (searchVal) activeCriteriaDescriptions.push(`Search: "${searchVal}"`)
  if (typeVal) activeCriteriaDescriptions.push(`Type: ${typeVal}`)
  if (deptVal) activeCriteriaDescriptions.push(`Dept: ${deptVal}`)
  if (statusVal) activeCriteriaDescriptions.push(`Status: ${statusVal}`)

  if (activeCriteriaDescriptions.length > 0) {
    titleElement.innerHTML = `Applications Ledger &rarr; <span style="color:var(--c-accent); font-size:12px;">Active Filters (${activeCriteriaDescriptions.join(
      ' | '
    )})</span>`
  } else {
    titleElement.textContent = 'Facility Access & Procurement Applications'
  }

  tableRows.forEach(row => {
    const rowCategory = row.getAttribute('data-item-category')
    const rowDept = row.getAttribute('data-item-dept')
    const rowStatus = row.getAttribute('data-item-status')
    const applicantName = row.cells[1].textContent.toLowerCase()

    const matchesCard = !selectedAppFilter || rowCategory === selectedAppFilter
    const matchesSearch = !searchVal || applicantName.includes(searchVal)
    const matchesType = !typeVal || rowCategory === typeVal
    const matchesDept = !deptVal || rowDept === deptVal
    const matchesStatus =
      !statusVal || rowStatus.toLowerCase() === statusVal.toLowerCase()

    if (
      matchesCard &&
      matchesSearch &&
      matchesType &&
      matchesDept &&
      matchesStatus
    ) {
      row.classList.remove('hidden-row')
    } else {
      row.classList.add('hidden-row')
    }
  })
}

function filterAppTable (clickedCard) {
  const filterTarget = clickedCard.getAttribute('data-filter-type')
  const allBoxes = document.querySelectorAll('.app-stat-grid .stat-box')

  if (selectedAppFilter === filterTarget) {
    selectedAppFilter = null
    clickedCard.classList.remove('active')
  } else {
    allBoxes.forEach(box => box.classList.remove('active'))
    clickedCard.classList.add('active')
    selectedAppFilter = filterTarget

    document.getElementById('f-type').value = filterTarget
  }
  evaluateMasterFilters()
}

function resetPipelineFilters () {
  document.getElementById('f-search').value = ''
  document.getElementById('f-type').value = ''
  const deptElement = document.getElementById('f-dept')
  if (deptElement) deptElement.value = ''
  document.getElementById('f-status').value = ''

  document
    .querySelectorAll('.app-stat-grid .stat-box')
    .forEach(box => box.classList.remove('active'))
  selectedAppFilter = null

  evaluateMasterFilters()
}

function launchApplicationDetail (rowElement) {
  document.querySelectorAll('.application-card').forEach(card => {
    card.classList.remove('active')
  })

  rowElement.classList.add('active')
  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const rowId = rowElement.getAttribute('data-item-id')

  const app = applications.find(
    a => String(a.id) === String(rowId).replace('#APP-', '')
  )

  if (!app) {
    console.error('Application not found:', rowId)
    return
  }

  console.log('ROW ID:', rowElement.getAttribute('data-item-id'))

  console.log('FOUND APP:', app)

  const detailView = document.getElementById('app-instance-detail-view')
  detailView.style.display = 'block'

  activeRowReference = rowElement

  const appId = rowElement.getAttribute('data-item-id')
  const category = rowElement.getAttribute('data-item-category')
  const dept = rowElement.getAttribute('data-item-dept')
  const currentStatus = rowElement.getAttribute('data-item-status')
  const applicant = app.applicant
  const dateStr = app.submitted

  document.getElementById(
    'det-breadcrumb'
  ).textContent = `Requests List > Details for Request ${appId}`
  document.getElementById('det-badge-slot').innerHTML = `
<span class="
${
  app.status === 'Approved'
    ? 'badge badge-success'
    : app.status === 'Denied'
    ? 'badge badge-denied'
    : 'badge badge-waiting'
}
">
${app.status}
</span>
`
  document.getElementById('det-applicant').textContent = applicant
  document.getElementById(
    'det-sub-text'
  ).textContent = `${app.contact} • ${app.email}`
  document.getElementById('det-component').textContent = app.type
  document.getElementById('det-dept').textContent = app.contact
  document.getElementById('det-date').textContent = app.email
  document.getElementById('det-token').textContent = app.phone

  document.getElementById('det-country').textContent = app.country || '-'
  document.getElementById('det-doctor').textContent = app.doctor || '-'
  document.getElementById('det-nurse').textContent = app.nurse || '-'
  document.getElementById('det-children').textContent =
    app.childrenSeen || app.hydroChildren || '-'

  let detailsHTML = ''

  if (app.type === 'Cones') {
    detailsHTML = `
        <table class="ui-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="width:120px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Cones</td>
                    <td>${app.quantity || 0}</td>
                </tr>
            </tbody>
        </table>
    `
  } else if (app.type === 'Catheters') {
    const requested = Object.entries(app.catheters).filter(
      ([key, value]) => value && value !== '0'
    )

    const catheterLabels = {
      ch8Short: 'CH8 Short',
      ch8Long: 'CH8 Long',
      ch10Short: 'CH10 Short',
      ch10Long: 'CH10 Long',
      ch12Short: 'CH12 Short',
      ch12Long: 'CH12 Long',
      ch14Short: 'CH14 Short',
      ch14Long: 'CH14 Long'
    }

    detailsHTML = `
        <table class="ui-table">
            <thead>
                <tr>
                    <th>Catheter Type</th>
<th style="width:120px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${requested
                  .map(
                    ([key, value]) => `
                    <tr>
                        <td>${catheterLabels[key] || key}</td>
                        <td>${value}</td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    `
  } else if (app.type === 'Enema Bags') {
    detailsHTML = `
        <table class="ui-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="width:120px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Enema Bags</td>
                    <td>${app.quantity || 0}</td>
                </tr>
            </tbody>
        </table>
    `
  } else if (app.type === 'Oxybutynin') {
    detailsHTML = `
        <table class="ui-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="width:120px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Oxybutynin Caps</td>
                    <td>${app.quantity || 0}</td>
                </tr>
            </tbody>
        </table>
    `
  } else if (app.type === 'Shunts') {
    const materialLabels = {
      lowPressure: 'Low Pressure Shunt',
      mediumPressure: 'Medium Pressure Shunt',
      highPressure: 'High Pressure Shunt',
      evd: 'EVD Kit',
      reservoir: 'Reservoir'
    }

    const requested = Object.entries(app.requestedMaterials).filter(
      ([key, value]) => value && value !== '0'
    )

    detailsHTML = `
        <table class="ui-table">
            <thead>
                <tr>
                    <th>Requested Material</th>
                    <th style="width:120px;">Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${requested
                  .map(
                    ([key, value]) => `
                    <tr>
                        <td>${materialLabels[key] || key}</td>
                        <td>${value}</td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    `
  }

  document.getElementById('det-request-details').innerHTML = detailsHTML

  // If it's already denied or approved, hide the action buttons to stay consistent
  const actionsCard = document.getElementById('det-admin-actions-card')
  if (currentStatus === 'Denied') {
    actionsCard.style.display = 'none'
  } else {
    actionsCard.style.display = 'block'
  }

  document.getElementById('app-ledger-view').style.display = 'block'
  document.getElementById('app-instance-detail-view').style.display = 'block'
}

function exitApplicationDetail () {
  return
}

function approveAndConvertApplicationToOrder () {
  if (!activeRowReference) return

  const appId = activeRowReference.getAttribute('data-item-id')

  console.log(appId)

  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const cleanId = String(appId).replace('#APP-', '')

  const appIndex = applications.findIndex(a => String(a.id) === cleanId)

  if (appIndex !== -1) {
    applications[appIndex].status = 'Approved'

    const orders = JSON.parse(localStorage.getItem('orders')) || []

    const orderId = 'ORD-' + Date.now()

    const exists = orders.find(o => o.applicationId === appId)

    if (!exists) {
      orders.push({
        id: orderId,
        applicationId: appId,
        department: activeRowReference.getAttribute('data-item-dept'),
        item: applications[appIndex].type,
        quantity: applications[appIndex].quantity || 1,
        status: 'Available',
        assignedTo: null
      })

      localStorage.setItem('orders', JSON.stringify(orders))
    }

    localStorage.setItem('applications', JSON.stringify(applications))
  }

  const category = activeRowReference.getAttribute('data-item-category')
  const dept = activeRowReference.getAttribute('data-item-dept')
  const orderId = appId.replace('APP', 'ORD')

  const ordersTableBody = document.querySelector('#main-orders-table tbody')
  const newRow = document.createElement('tr')
  newRow.style.borderBottom = '1px solid rgba(223, 224, 226, 0.5)'

  newRow.innerHTML = `
                <td><strong>${orderId}</strong></td>
                <td>${category} Supply Parcel</td>
                <td>${dept}</td>
                <td>$1,250.00</td>
                <td><span class="badge badge-pending">Vendor Pending</span></td>
            `

  ordersTableBody.insertBefore(newRow, ordersTableBody.firstChild)
  decrementUpperHomeCounters()
  recalculateUpperStatBoxCounters(category)
  loadAdminApplications()

  alert(
    `Mockup Action Success:\nApplication ${appId} has been verified and converted into Active Logistics Procurement Order ${orderId}!`
  )
  exitApplicationDetail()
}

/* INLINE APPLICATION DENIAL STRATEGY - UPDATED TO KEEP ROW BUT CHANGE STATE */
function denyApplicationInline () {
  if (!activeRowReference) return
  const appId = activeRowReference.getAttribute('data-item-id')

  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const appIndex = applications.findIndex(a => a.id === appId)

  if (appIndex !== -1) {
    applications[appIndex].status = 'Denied'

    localStorage.setItem('applications', JSON.stringify(applications))
  }

  const category = activeRowReference.getAttribute('data-item-category')

  // Update row attributes and visual cells instead of destroying it
  loadAdminApplications()

  // Push it down to the bottom of the table log visually
  const tableBody = document.querySelector('#main-apps-table tbody')
  tableBody.appendChild(activeRowReference)

  decrementUpperHomeCounters()
  recalculateUpperStatBoxCounters(category)

  alert(
    `Mockup Action:\nApplication ${appId} has been formally Denied. Row retained in database history.`
  )
  exitApplicationDetail()
}

function decrementUpperHomeCounters () {
  const appStatText = document.getElementById('home-stat-apps-count')
  if (appStatText) {
    let currentTotal = parseInt(appStatText.innerText) || 0
    if (currentTotal > 0) appStatText.innerText = currentTotal - 1
  }
}

function recalculateUpperStatBoxCounters (category) {
  let targetCardId = ''
  if (category === 'Cones') targetCardId = 'cnt-cones'
  if (category === 'Catheters') targetCardId = 'cnt-catheters'
  if (category === 'Enema Bags') targetCardId = 'cnt-enema'
  if (category === 'Oxybutynin Caps') targetCardId = 'cnt-oxy'
  if (category === 'Shunt') targetCardId = 'cnt-shunt'

  const itemCounterElement = document.getElementById(targetCardId)
  if (itemCounterElement) {
    let currentItemCount = parseInt(itemCounterElement.innerText) || 0
    if (currentItemCount > 0)
      itemCounterElement.innerText = currentItemCount - 1
  }
}

function handleAction (elementId, outcome) {
  const targetElement = document.getElementById(elementId)
  if (targetElement) {
    targetElement.style.opacity = '0'
    targetElement.style.transform = 'translateY(10px)'

    setTimeout(() => {
      targetElement.style.display = 'none'
      document.getElementById('emptyQueue').style.display = 'block'

      const dot = document.getElementById('queue-dot')
      if (dot) dot.style.display = 'none'

      if (document.getElementById('dd-preview'))
        document.getElementById('dd-preview').style.display = 'none'
      if (document.getElementById('dd-empty'))
        document.getElementById('dd-empty').style.display = 'block'

      if (document.getElementById('stat-urgent-count'))
        document.getElementById('stat-urgent-count').innerText = '0'

      const cellStatus = document.getElementById('table-user-status')
      if (cellStatus) {
        cellStatus.innerText = outcome === 'Authorized' ? 'Active' : 'Declined'
        cellStatus.style.color =
          outcome === 'Authorized' ? 'var(--c-primary)' : 'var(--text-muted)'
      }

      const mgmtStatusBadge = document.getElementById('mgmt-user-status')
      if (mgmtStatusBadge) {
        mgmtStatusBadge.innerText =
          outcome === 'Authorized'
            ? 'Root Admin Access Level 3'
            : 'Access Request Denied'
        mgmtStatusBadge.className =
          outcome === 'Authorized'
            ? 'badge badge-success'
            : 'badge badge-urgent'
      }

      alert(`System Record: Personnel request successfully ${outcome}.`)
    }, 300)
  }
}

function toggleSidebar (shouldOpen) {
  const sidebar = document.getElementById('adminSidebar')
  const overlay = document.getElementById('sbOverlay')

  if (shouldOpen) {
    sidebar.classList.add('open')
    overlay.classList.add('visible')
  } else {
    sidebar.classList.remove('open')
    overlay.classList.remove('visible')
  }
}

function loadAdminApplications () {
  const applications = JSON.parse(localStorage.getItem('applications')) || []

  document.getElementById('cnt-cones').innerText = applications.filter(
    a => a.type === 'Cones'
  ).length

  document.getElementById('cnt-catheters').innerText = applications.filter(
    a => a.type === 'Catheters'
  ).length

  document.getElementById('cnt-enema').innerText = applications.filter(
    a => a.type === 'Enema Bags'
  ).length

  document.getElementById('cnt-oxy').innerText = applications.filter(
    a => a.type === 'Oxybutynin'
  ).length

  document.getElementById('cnt-shunt').innerText = applications.filter(
    a => a.type === 'Shunts'
  ).length

  const tbody = document.getElementById('admin-applications-body')

  if (!tbody) return

  tbody.innerHTML = ''

  applications.sort((a, b) => {
    if (a.submitted !== b.submitted) {
      const [da, ma, ya] = a.submitted.split('/')
      const [db, mb, yb] = b.submitted.split('/')

      return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da)
    }

    return Number(b.id) - Number(a.id)
  })

  const start = (currentPage - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  const pagedApps = applications.slice(start, end)

  pagedApps.forEach(app => {
    tbody.innerHTML += `
<div
    class="application-card"
    data-item-id="${app.id}"
    data-item-category="${app.type}"
    data-item-dept="${app.address}"
    data-item-status="${app.status}"
    onclick="launchApplicationDetail(this)"
>

    <div style="display:flex;justify-content:space-between;align-items:start;">
        <div class="app-id">APP-${app.id}</div>

        <span class="
        ${
          app.status === 'Approved'
            ? 'badge badge-success'
            : app.status === 'Denied'
            ? 'badge badge-denied'
            : 'badge badge-waiting'
        }
        ">
            ${app.status}
        </span>
    </div>

    <div class="app-name">
        ${app.applicant}
    </div>

    <div class="app-meta">
        ${app.type}
    </div>

    <div class="app-meta">
        ${app.submitted}
    </div>

</div>
`
  })

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE)

  document.getElementById('applications-pagination').innerHTML = `
<div style="
display:flex;
justify-content:center;
align-items:center;
gap:12px;
padding:16px;
border-top:1px solid var(--c-border);
">

<button
class="btn btn-ghost"
${currentPage === 1 ? 'disabled' : ''}
onclick="
currentPage--;
loadAdminApplications();
">
Prev
</button>

<span style="font-size:12px;font-weight:700;">
${currentPage} / ${totalPages}
</span>

<button
class="btn btn-ghost"
${currentPage === totalPages ? 'disabled' : ''}
onclick="
currentPage++;
loadAdminApplications();
">
Next
</button>

</div>
`

  const firstCard = document.querySelector('.application-card')

  if (firstCard) {
    launchApplicationDetail(firstCard)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadAdminApplications()
})

function loadAdminOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const tbody = document.querySelector('#main-orders-table tbody')
  if (!tbody) return

  tbody.innerHTML = ''

  orders
    .sort((a, b) => {
      const aTime = Number(a.id.replace('ORD-', ''))
      const bTime = Number(b.id.replace('ORD-', ''))
      return bTime - aTime
    })

    .forEach(order => {
      tbody.innerHTML += `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>${order.item}</td>
                <td>${order.department}</td>
                <td>${order.quantity}</td>
                <td>
                    <span class="badge ${
                      order.status === 'Assigned'
                        ? 'badge-success'
                        : 'badge-waiting'
                    }">
                        ${order.status}
                    </span>
                </td>
            </tr>
        `
    })
}
