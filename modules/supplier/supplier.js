//SUPPLIER.JS//

function asc (section, el) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'))
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('on'))

  document.getElementById('s-' + section).classList.add('on')
  el.classList.add('on')

  document.getElementById('atitle').textContent = el.textContent.trim()
}

function toggleSidebar (open) {
  document.getElementById('adminSidebar').classList.toggle('mobile-open', open)

  document.getElementById('sbOverlay').classList.toggle('visible', open)
}

function loadSupplierOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const availableBody = document.getElementById('available-orders-body')
  const previewBody = document.getElementById('home-orders-preview')

  const availableOrders = orders.filter(o => o.status === 'Available')

  availableBody.innerHTML = ''
  previewBody.innerHTML = ''

  availableOrders.forEach(order => {
    const row = `
      <tr>
        <td>${order.id}</td>
        <td>${order.department || '-'}</td>
        <td>${order.item || '-'}</td>
        <td>${order.quantity || '-'}</td>
        <td>
          <span class="badge badge-pending">
            ${order.status}
          </span>
        </td>
        <td>
          ${
            order.status === 'Available'
              ? `<button class="btn btn-p" onclick="acceptOrder('${order.id}')">Accept</button>`
              : order.status === 'Assigned'
              ? `<button class="btn btn-p" onclick="openSupplierUploadModal('${order.id}')">
                   Upload Docs
                 </button>`
              : order.status === 'IN REVIEW'
              ? `<span style="color:var(--text-muted);font-size:12px;">Submitted</span>`
              : `<span style="color:var(--text-muted);font-size:12px;">Locked</span>`
          }
        </td>
      </tr>
    `

    availableBody.innerHTML += row
    previewBody.innerHTML += row
  })

  document.getElementById('stat-available').textContent = orders.length

  document.getElementById('stat-my-orders').textContent = orders.filter(
    o => o.assignedTo === 'Supplier User'
  ).length
}

function acceptOrder (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)
  if (!order) return

  if (order.status !== 'Available') return

  order.assignedTo = 'Supplier User'
  order.status = 'Assigned'
  order.acceptedAt = Date.now()

  localStorage.setItem('orders', JSON.stringify(orders))

  loadSupplierOrders()
  loadSupplierMyOrders()
}

document.addEventListener('DOMContentLoaded', () => {
  loadSupplierOrders()
  loadSupplierDashboardOrders()
  loadSupplierMyOrders()
})

function loadSupplierDashboardOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const availableOrders = orders.filter(o => o.status === 'Available')

  const tbody = document.getElementById('home-orders-preview')

  tbody.innerHTML = ''

  availableOrders.forEach(order => {
    const row = `
      <tr>
        <td>${order.id}</td>
        <td>${order.department || '-'}</td>
        <td>${order.item || '-'}</td>
        <td>
          <span class="badge badge-pending">
            ${order.status}
          </span>
        </td>
      </tr>
    `
    tbody.innerHTML += row
  })
}

function loadSupplierMyOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const tbody = document.querySelector('#my-orders-body')
  if (!tbody) return

  tbody.innerHTML = ''

  orders
    .filter(o => o.assignedTo === 'Supplier User')
    .forEach(order => {
      tbody.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.department || '-'}</td>
        <td>${order.item || '-'}</td>
        <td>${order.quantity || '-'}</td>
        <td>
          <span class="badge badge-success">${order.status}</span>
        </td>
        <td>
          ${
            order.status === 'Assigned'
              ? `<button class="btn btn-p" onclick="openSupplierUploadModal('${order.id}')">
                   Upload Docs
                 </button>`
              : order.status === 'IN REVIEW'
              ? `<span style="color:var(--text-muted);font-size:12px;">Submitted</span>`
              : ``
          }
        </td>
      </tr>
    `
    })
}

function uploadProformaAndPacking (
  orderId,
  invoiceData,
  packingListData,
  amount
) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)
  if (!order) return

  if (order.status !== 'Assigned') return

  order.proformaInvoice = invoiceData
  order.packingList = packingListData
  order.amount = amount

  order.status = 'In Review'
  order.submittedAt = Date.now()

  localStorage.setItem('orders', JSON.stringify(orders))

  loadSupplierOrders()
  loadSupplierMyOrders()
}

function submitSupplierDocs () {
  const invoice = document.getElementById('invoiceInput').files[0]
  const packing = document.getElementById('packingInput').files[0]
  const amount = document.getElementById('amountInput').value

  uploadProformaAndPacking(
    activeUploadOrderId,
    invoice?.name || '',
    packing?.name || '',
    Number(amount)
  )

  closeUploadModal()
}

let activeUploadOrderId = null

function openSupplierUploadModal (orderId) {
  activeUploadOrderId = orderId

  const modal = document.getElementById('uploadModal')
  if (!modal) {
    console.error('uploadModal not found in HTML')
    return
  }

  modal.style.display = 'flex'
}

/**function openSupplierUploadModal (orderId) {
  alert('FUNCTION FIRED: ' + orderId)
}**/

function closeUploadModal () {
  activeUploadOrderId = null

  const modal = document.getElementById('uploadModal')
  if (modal) modal.style.display = 'none'
}

window.openSupplierUploadModal = openSupplierUploadModal
window.closeUploadModal = closeUploadModal
