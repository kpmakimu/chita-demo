function loadFinanceInvoices () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const container = document.querySelector('.fake-list')
  if (!container) return

  container.innerHTML = ''

  orders.slice(0, 5).forEach(order => {
    const row = document.createElement('div')
    row.className = 'fake-row'

    row.innerHTML = `
      <span>${order.id}</span>
      <span>$${(order.quantity * 250).toLocaleString()}</span>
      <span class="badge ${getFinanceBadge(order.status)}">
        ${formatFinanceStatus(order.status)}
      </span>
    `

    container.appendChild(row)
  })
}

function getFinanceBadge (status = '') {
  const s = status.toLowerCase()

  if (s === 'available') return 'badge-waiting'
  if (s === 'assigned') return 'badge-pending'
  if (s === 'approved') return 'badge-success'
  if (s === 'denied') return 'badge-denied'

  return 'badge-waiting'
}

function formatFinanceStatus (status = '') {
  return status.replaceAll('_', ' ')
}

window.addEventListener('DOMContentLoaded', () => {
  loadFinanceInvoices()
})

window.addEventListener('ordersUpdated', loadFinanceInvoices)

function showFinanceSection (id, el) {
  document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'))

  const section = document.getElementById('s-' + id)
  if (section) section.classList.add('on')

  document.querySelectorAll('.sb-item').forEach(n => n.classList.remove('on'))
  if (el) el.classList.add('on')

  if (id === 'invoices') loadFinanceInvoices()
}
