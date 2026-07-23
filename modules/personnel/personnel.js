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

function toggleNotifMenu (e) {
  e.stopPropagation()
  document.getElementById('dropdownCard').classList.toggle('active')
  document.getElementById('profileDropdownCard').classList.remove('active')
}

function toggleProfileMenu (e) {
  e.stopPropagation()
  document.getElementById('profileDropdownCard').classList.toggle('active')
  document.getElementById('dropdownCard').classList.remove('active')
}

document.addEventListener('click', () => {
  document.getElementById('dropdownCard').classList.remove('active')
  document.getElementById('profileDropdownCard').classList.remove('active')
})

function asc (sectionId, el) {
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('on'))
  if (el) el.classList.add('on')

  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'))
  const target = document.getElementById('s-' + sectionId)
  if (target) target.classList.add('on')

  const title = document.getElementById('atitle')
  if (title && el) title.innerText = el.innerText
}

function getStatusBadgeClass (status) {
  switch (status) {
    case 'Available':
      return 'badge-approved'

    case 'Pending':
      return 'badge-pending'

    case 'Delivered':
      return 'badge-delivered'

    case 'Shipped':
      return 'badge-approved'

    default:
      return 'badge-pending'
  }
}

function formatStatus (status) {
  if (!status) return '-'

  switch (status) {
    case 'Available':
      return 'Available'

    case 'Pending':
      return 'Pending'

    case 'Delivered':
      return 'Delivered'

    case 'Shipped':
      return 'On the Way'

    default:
      return status
  }
}

/* ACTIONS AND FLOW LOGIC */
function handleOrderSubmission (event) {
  event.preventDefault()

  const item = document.getElementById('supplyItem').value
  const qty = document.getElementById('orderQty').value

  document.getElementById('simulated-row').cells[1].innerText = item
  document.getElementById('simulated-row').cells[2].innerText = qty

  document.getElementById('queue-dot').style.display = 'block'
  document.getElementById('dd-preview').style.display = 'block'
  document.getElementById('dd-empty').style.display = 'none'

  document.getElementById('table-status-badge').className =
    'badge badge-pending'
  document.getElementById('table-status-badge').innerText =
    'Waiting for approval'
  document.getElementById('table-fulfillment-text').innerText =
    'Sitting in Admin queue'
  document.getElementById('table-fulfillment-text').style.color =
    'var(--text-muted)'
  document.getElementById('table-fulfillment-text').style.fontStyle = 'italic'

  document.getElementById('stat-total').innerText = '3'
  document.getElementById('stat-pending').innerText = '1'
  document.getElementById('stat-approved').innerText = '1'

  alert('Success: Order sent over to the main office for approval.')
  document.getElementById('supplyOrderForm').reset()
  asc('order-tracking', document.querySelector("[onclick*='order-tracking']"))
}

function triggerAdminApprovalSimulation () {
  setTimeout(() => {
    document.getElementById('queue-dot').style.display = 'none'
    document.getElementById('dd-preview').style.display = 'none'
    document.getElementById('dd-empty').style.display = 'block'

    document.getElementById('table-status-badge').className =
      'badge badge-approved'
    document.getElementById('table-status-badge').innerText = 'Approved'

    document.getElementById('table-fulfillment-text').innerText = 'On the way'
    document.getElementById('table-fulfillment-text').style.color =
      'var(--status-approved)'
    document.getElementById('table-fulfillment-text').style.fontStyle = 'normal'

    document.getElementById('stat-pending').innerText = '0'
    document.getElementById('stat-approved').innerText = '2'

    alert(
      'Update: Admin just approved your order! The items are now on the way.'
    )

    // Phase 2: Simulate arrival after 3.5 seconds
    setTimeout(() => {
      document.getElementById('table-status-badge').className =
        'badge badge-delivered'
      document.getElementById('table-status-badge').innerText = 'Delivered'

      document.getElementById('table-fulfillment-text').innerText =
        'Arrived & Put Away'
      document.getElementById('table-fulfillment-text').style.color =
        'var(--status-delivered)'

      document.getElementById('stat-approved').innerText = '1'
      document.getElementById('stat-delivered').innerText = '2'

      alert('Logistics Update: The items have safely arrived at your ward.')
    }, 3500)
  }, 300)
}

function closeDemoBanner () {
  document.getElementById('demoBanner').style.display = 'none'
}

function startNewApplication () {
  localStorage.removeItem('editingApplicationId')
  localStorage.removeItem('editingApplication')

  window.editingApplication = null

  window.location.href = '../forms/forms.html#all'
}

function loadApplications () {
  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const tbody = document.getElementById('applications-table-body')

  if (!tbody) return

  tbody.innerHTML = ''

  applications.forEach(app => {
    tbody.innerHTML += `
            <tr onclick="viewPersonnelApplication('${app.id}')">
                <td><strong>APP-${app.id}</strong></td>
                <td>${app.type}</td>
                <td>${app.applicant}</td>
                <td>
                    <span class="badge badge-pending">
                        ${app.status}
                    </span>

                    ${
                      app.status === 'Denied' || app.status === 'Needs Revision'
                        ? `
                        <button 
                          class="btn btn-small"
                          onclick="event.stopPropagation(); editDeniedApplication('${app.id}')">
                          Fix & Resubmit
                        </button>
                        `
                        : ''
                    }
                                    </td>
                                                    <td>
                    ${app.submitted}

                    ${
                      app.orderId
                        ? `
                        <br>
                        <small>
                          Order:
                          <strong>${app.orderId}</strong>
                        </small>
                        `
                        : ''
                    }

                    </td>
                                                </tr>
                                            `
  })
}

function loadPersonnelOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const tbody = document.getElementById('personnel-orders-table-body')

  if (!tbody) return

  tbody.innerHTML = ''

  orders
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .forEach(order => {
      tbody.innerHTML += `
      <tr>

        <td>
          <strong>${order.id}</strong>
        </td>

        <td>
          ${order.type || '-'}
        </td>

        <td>
          ${order.quantity || '-'}
        </td>

        <td>
          <span class="badge ${getStatusBadgeClass(order.status)}">
            ${formatStatus(order.status)}
          </span>
        </td>

        <td>

  ${
    order.documents?.donationCertificate
      ? `
        <div>
          <button 
            class="btn btn-p"
            onclick="viewDonationCertificate('${order.id}')">
            View Certificate
          </button>
        </div>
      `
      : ''
  }


  ${
    order.documents?.goodsReceivedNote
      ? `
        <div style="margin-top:8px;">
          <button 
            class="doc-link"
            onclick="viewGoodsReceivedNote('${order.id}')">
            View Goods Received Note
          </button>
        </div>
      `
      : ''
  }


  ${
    !order.documents?.donationCertificate && !order.documents?.goodsReceivedNote
      ? '-'
      : ''
  }

</td>

<td>
  ${order.applicationId || '-'}
</td>

<td>
  ${(() => {
    const docs = []

    if (order.documents?.shippingDocuments) {
      docs.push(`
        <button 
          class="doc-link"
          onclick="openDocument('${order.id}', 'shippingDocuments')">
          Shipping Documents
        </button>
      `)
    }

    if (order.documents?.regulatoryCertificate) {
      docs.push(`
        <button 
          class="doc-link"
          onclick="openDocument('${order.id}', 'regulatoryCertificate')">
          Regulatory Certificate
        </button>
      `)
    }

    if (order.documents?.additionalDocuments?.length) {
      order.documents.additionalDocuments.forEach((doc, index) => {
        docs.push(`
          <button 
            class="doc-link"
            onclick="openAdditionalDocument('${order.id}', ${index})">
            ${doc.name}
          </button>
        `)
      })
    }

    return docs.length ? docs.join('<br><br>') : '-'
  })()}
</td>

<td>
  ${
    order.fulfilmentStatus
      ? `
        <div>
          <span class="badge ${getStatusBadgeClass(order.fulfilmentStatus)}">
            ${formatStatus(order.fulfilmentStatus)}
          </span>

          ${
            order.fulfilmentStatus === 'En Route'
              ? `
                <br><br>
                <button 
                  class="btn btn-p"
                  onclick="confirmGoodsReceived('${order.id}')">
                  Confirm Goods Received
                </button>
              `
              : ''
          }

        </div>
      `
      : '-'
  }
</td>

      </tr>
    `
    })
}

function editDeniedApplication (id) {
  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const app = applications.find(a => String(a.id) === String(id))

  if (!app) return

  localStorage.setItem('editingApplicationId', app.id)
  localStorage.setItem('editingApplication', JSON.stringify(app))

  window.location.href = '../forms/forms.html'
}

function viewPersonnelApplication (id) {
  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const app = applications.find(a => a.id === id)

  if (!app) return

  console.log('PERSONNEL DETAIL:', app)

  const detailBox = document.getElementById('personnel-application-detail')

  const detailBody = document.getElementById(
    'personnel-application-detail-body'
  )

  detailBox.style.display = 'block'

  detailBody.innerHTML = `

    <div class="detail-section">
        <h4>Application Information</h4>

        <p><strong>Application ID:</strong> ${app.id}</p>
        <p><strong>Type:</strong> ${app.type}</p>
        <p><strong>Status:</strong> ${app.status}</p>
        <p><strong>Submitted:</strong> ${app.submitted}</p>

    </div>


    <div class="detail-section">
        <h4>Applicant Information</h4>

        <p><strong>Name:</strong> ${app.applicant || '-'}</p>
        <p><strong>Contact:</strong> ${app.contact || '-'}</p>
        <p><strong>Email:</strong> ${app.email || '-'}</p>
        <p><strong>Phone:</strong> ${app.phone || '-'}</p>
        <p><strong>Country:</strong> ${app.country || '-'}</p>

    </div>


    <div class="detail-section">
        <h4>Clinical Information</h4>

        <p><strong>Doctor:</strong> ${app.doctor || '-'}</p>
        <p><strong>Nurse:</strong> ${app.nurse || '-'}</p>
        <p><strong>Children Seen:</strong> ${app.childrenSeen || '-'}</p>

    </div>

    <div class="detail-section">
    <h4>Requested Supplies</h4>

    ${
      app.type === 'Cones'
        ? `
          <p><strong>Cones:</strong> ${app.quantity || '-'}</p>
        `
        : ''
    }


    ${
      app.type === 'Enema Bags'
        ? `
          <p><strong>Enema Bags:</strong> ${app.quantity || '-'}</p>
        `
        : ''
    }


    ${
      app.type === 'Oxybutynin' || app.type === 'Oxybutynin Caps'
        ? `
          <p><strong>Oxybutynin Caps:</strong> ${app.quantity || '-'}</p>
        `
        : ''
    }


    ${
      app.type === 'Catheters'
        ? `
          <p><strong>Catheter Details:</strong></p>

          ${Object.entries(app.catheters || {})
            .filter(([key, value]) => value && value !== '0')
            .map(([key, value]) => `<p>${key}: ${value}</p>`)
            .join('')}
        `
        : ''
    }

${
  app.type === 'Shunt' || app.type === 'Shunts'
    ? `

<div class="detail-section">
    <h4>Programme Contacts & Population</h4>

    <p><strong>Clinical Contact:</strong> ${app.clinicalContact || '-'}</p>
    <p><strong>Clearing Contact:</strong> ${app.clearingContact || '-'}</p>
    <p><strong>Admin Contact:</strong> ${app.adminContact || '-'}</p>
    <p><strong>Address:</strong> ${app.address || '-'}</p>
    <p><strong>Hydrocephalus Children:</strong> ${app.hydroChildren || '-'}</p>
    <p><strong>Spina Bifida Children:</strong> ${app.sbChildren || '-'}</p>

</div>


<div class="detail-section">
    <h4>Shunt Programme Information</h4>

    <p><strong>Requested Quantity:</strong> ${app.requestedQuantity || '-'}</p>
    <p><strong>Projected Annual Need:</strong> ${
      app.projectedAnnualNeed || '-'
    }</p>
    <p><strong>Future Plan:</strong> ${app.futurePlan || '-'}</p>
    <p><strong>Waiting List:</strong> ${app.waitingList || '-'}</p>
    <p><strong>Post Op Visits:</strong> ${app.postOpVisits || '-'}</p>

</div>


<div class="detail-section">
    <h4>Requested Shunt Materials</h4>

    ${
      app.requestedMaterials
        ? Object.entries(app.requestedMaterials)
            .filter(([key, value]) => value && value !== '0')
            .map(
              ([key, value]) => `
                <p>
                    <strong>${key}:</strong> ${value}
                </p>
            `
            )
            .join('')
        : '-'
    }

</div>


<div class="detail-section">
    <h4>Clinical & Surgical Information</h4>

    <p><strong>Surgeon:</strong> ${app.surgeonName || '-'}</p>
    <p><strong>Speciality:</strong> ${app.surgeonSpeciality || '-'}</p>

    <p><strong>Surgeon Types:</strong></p>

    ${
      app.surgeons
        ? Object.entries(app.surgeons)
            .filter(([key, value]) => value)
            .map(([key]) => `<p>${key}</p>`)
            .join('')
        : '-'
    }

</div>


<div class="detail-section">
    <h4>Supply Planning</h4>

    <p>
        <strong>Local Distributor Availability:</strong>
        ${app.localDistributorAvailability || '-'}
    </p>

    <p>
        <strong>Alternative Sources:</strong>
        ${app.alternativeSources || '-'}
    </p>

    <p>
        <strong>Other Supply Sources:</strong>
        ${app.otherSupplySources || '-'}
    </p>

    <p>
        <strong>Secondary Market Cost:</strong>
        ${
          app.secondaryMarketCost
            ? `${app.secondaryMarketCost.currency} ${app.secondaryMarketCost.amount}`
            : '-'
        }
    </p>

    <p><strong>Supply Sources:</strong></p>

    ${
      app.supplySources
        ? Object.entries(app.supplySources)
            .filter(([key, value]) => value)
            .map(([key]) => `<p>${key}</p>`)
            .join('')
        : '-'
    }

</div>


<div class="detail-section">
    <h4>Programme Assessment</h4>

    <p><strong>Need Factors:</strong></p>

    ${
      app.needFactors
        ? Object.entries(app.needFactors)
            .filter(([key, value]) => value)
            .map(([key]) => `<p>${key}</p>`)
            .join('')
        : '-'
    }


    <p><strong>Alternatives Considered:</strong></p>

    ${
      app.alternatives
        ? Object.entries(app.alternatives)
            .filter(([key, value]) => value)
            .map(([key]) => `<p>${key}</p>`)
            .join('')
        : '-'
    }

</div>


<div class="detail-section">
    <h4>Service & Follow-up Planning</h4>

    <p><strong>Home Visits:</strong></p>

    ${
      app.homeVisits
        ? Object.entries(app.homeVisits)
            .filter(([key, value]) => value)
            .map(([key]) => `<p>${key}</p>`)
            .join('')
        : '-'
    }


    <p><strong>Phone Follow-up:</strong></p>

    ${
      app.phoneFollowUp
        ? Object.entries(app.phoneFollowUp)
            .filter(([key, value]) => value)
            .map(([key]) => `<p>${key}</p>`)
            .join('')
        : '-'
    }

</div>


<div class="detail-section">
    <h4>Outcome Tracking</h4>

    <p><strong>Bad Outcome:</strong> ${app.dataSheet?.badOutcome || '-'}</p>
    <p><strong>Bad Outcome Total:</strong> ${
      app.dataSheet?.badOutcomeTotal || '-'
    }</p>
    <p><strong>Loss Follow-up:</strong> ${
      app.dataSheet?.lossFollowUp || '-'
    }</p>
    <p><strong>Loss Follow-up Total:</strong> ${
      app.dataSheet?.lossFollowUpTotal || '-'
    }</p>

    <p><strong>Bad Outcome Reasons:</strong></p>

    ${
      app.badOutcomeReasons
        ? Object.entries(app.badOutcomeReasons)
            .map(([key, value]) => `<p>${key}: ${value}</p>`)
            .join('')
        : '-'
    }

</div>


<div class="detail-section">
    <h4>Documentation</h4>

    <p>
        <strong>Shunt Protocol:</strong>
        ${
          app.shuntProtocol
            ? `<a href="${app.shuntProtocol}" target="_blank">View Document</a>`
            : '-'
        }
    </p>

    <p>
        <strong>Shunt Programme Data:</strong>
        ${
          app.shuntProgramData
            ? `<a href="${app.shuntProgramData}" target="_blank">View Document</a>`
            : '-'
        }
    </p>

    <p>
        <strong>MOH Communication:</strong>
        ${
          app.mohCommunication
            ? `<a href="${app.mohCommunication}" target="_blank">View Document</a>`
            : '-'
        }
    </p>

</div>

`
    : ''
}

    </div>
    `
}

function confirmGoodsReceived (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order) {
    alert('Order not found')
    return
  }

  // Only allow receiving shipped orders
  if (order.fulfilmentStatus !== 'En Route') {
    alert('This shipment is not currently en route')
    return
  }

  order.fulfilmentStatus = 'Delivered'

  order.deliveredAt = Date.now()

  if (!order.documents) {
    order.documents = {}
  }

  order.documents.goodsReceivedNote = generateGoodsReceivedNote(order)

  localStorage.setItem('orders', JSON.stringify(orders))

  loadPersonnelOrders()

  window.dispatchEvent(new Event('ordersUpdated'))

  alert('Goods received and delivery note generated')
}

window.confirmGoodsReceived = confirmGoodsReceived

function generateGoodsReceivedNote (order) {
  return `
    <html>
    <head>
      <title>Goods Received Note</title>

      <style>
        body {
          font-family: Arial;
          padding: 40px;
          text-align:center;
        }

        .note {
          border:2px solid #333;
          padding:30px;
          max-width:700px;
          margin:auto;
        }
      </style>

    </head>

    <body>

      <div class="note">

        <h1>
          GOODS RECEIVED NOTE
        </h1>

        <p>
          This confirms receipt of the following goods:
        </p>

        <h2>
          ${order.quantity} x ${order.type}
        </h2>

        <p>
          Facility:
        </p>

        <h3>
          ${order.facility || '-'}
        </h3>


        <p>
          Delivered on:
          ${new Date().toLocaleDateString()}
        </p>


        <p>
          Received and confirmed by Personnel
        </p>

      </div>

    </body>
    </html>
  `
}

window.generateGoodsReceivedNote = generateGoodsReceivedNote

function viewGoodsReceivedNote (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order?.documents?.goodsReceivedNote) {
    alert('Goods Received Note not found')
    return
  }

  const newWindow = window.open('', '_blank')

  newWindow.document.write(order.documents.goodsReceivedNote)

  newWindow.document.close()
}

window.viewGoodsReceivedNote = viewGoodsReceivedNote

window.addEventListener('DOMContentLoaded', () => {
  loadApplications()
  loadPersonnelOrders()
})
