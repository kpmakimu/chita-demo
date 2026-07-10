function loadFinanceOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const container = document.getElementById('finance-orders-list')
  if (!container) return

  container.innerHTML = ''

  orders.forEach(order => {
    const row = document.createElement('div')
    row.className = 'fake-row'

    row.innerHTML = `
      <span>${order.id}</span>
      <span>${order.item || '-'}</span>
      <span>${order.quantity || '-'}</span>
      <span class="badge ${getFinanceBadge(order.status)}">
        ${formatFinanceStatus(order.status)}
      </span>
    `

    container.appendChild(row)
  })
}

function loadFinanceInvoices () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const container = document.getElementById('finance-invoice-list')
  if (!container) return

  container.innerHTML = ''

  const invoiceOrders = orders.filter(order => order.status === 'Approved')

  invoiceOrders.forEach(order => {
    const row = document.createElement('div')
    row.className = 'fake-row'

    row.innerHTML = `
      <span>${order.id}</span>
      <span>${order.item || '-'}</span>
      <span>$${(order.quantity * 250).toLocaleString()}</span>
      <span class="badge ${getFinanceBadge(order.status)}">
        ${formatFinanceStatus(order.status)}
      </span>

      <button 
        class="btn btn-p"
        onclick="markOrderPaid('${order.id}')">
        Pay
      </button>
          `

    container.appendChild(row)
  })
}

function getFinanceBadge (status = '') {
  const s = status.toLowerCase()

  if (s === 'available') return 'badge-waiting'

  if (s === 'assigned') return 'badge-pending'

  if (s === 'in review') return 'badge-pending'

  if (s === 'approved') return 'badge-success'

  if (s === 'paid') return 'badge-success'

  if (s === 'denied') return 'badge-denied'

  return 'badge-waiting'
}

function markOrderPaid (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order) return

  order.status = 'Paid'
  order.paidAt = Date.now()

  localStorage.setItem('orders', JSON.stringify(orders))

  loadFinanceOrders()
  loadFinanceInvoices()
}

function formatFinanceStatus (status = '') {
  return status.replaceAll('_', ' ')
}

window.addEventListener('DOMContentLoaded', () => {
  loadFinanceOrders()
  loadFinanceInvoices()

  showFinanceSection('home', document.querySelector('.sb-item.on'))
})

window.addEventListener('ordersUpdated', loadFinanceInvoices)

function showFinanceSection (id, el) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'))

  const section = document.getElementById('s-' + id)
  if (section) section.classList.add('on')

  document.querySelectorAll('.sb-item').forEach(n => n.classList.remove('on'))

  if (el) {
    el.classList.add('on')
    el.style.color = 'var(--c-accent)' // makes active orange pop
  }

  if (id === 'orders') loadFinanceOrders()

  if (id === 'invoices') loadFinanceInvoices()
}
