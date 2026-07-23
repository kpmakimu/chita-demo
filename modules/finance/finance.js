function loadFinanceOrders () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const container = document.getElementById('finance-orders-list')
  if (!container) return

  container.innerHTML = ''

  orders.forEach(order => {
    const row = document.createElement('tr')

    row.innerHTML = `
      <td>
        <strong>${order.id}</strong>
      </td>

      <td>
        ${order.applicant || '-'}
      </td>

      <td>
        ${order.type || '-'}
      </td>

      <td>
        ${order.quantity || '-'}
      </td>

      <td>
        <span class="badge ${getFinanceBadge(order.status)}">
          ${formatFinanceStatus(order.status)}
        </span>
      </td>

      <td>
        ${
          order.paymentStatus
            ? order.paymentStatus.replaceAll('_', ' ')
            : 'Not Ready'
        }
      </td>
    `

    container.appendChild(row)
  })
}

function loadFinanceInvoices () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const container = document.getElementById('finance-invoice-list')
  if (!container) return

  container.innerHTML = ''

  const invoiceOrders = orders.filter(order => order.invoiceAmount)

  invoiceOrders.forEach(order => {
    const row = document.createElement('tr')

    row.innerHTML = `
      <td>${order.id}</td>

      <td>${order.supplier || '-'}</td>

      <td>
        ${
          order.invoiceAmount
            ? `${order.invoiceAmount.currency} ${order.invoiceAmount.value}`
            : '-'
        }
      </td>

      <td>

  ${
    order.documents?.donationCertificate
      ? `
        <div>
          <button 
            class="btn btn-ghost"
            onclick="viewDonationCertificate('${order.id}')">
            View Certificate
          </button>
        </div>
      `
      : ''
  }


  ${
    order.documents?.shippingDocuments
      ? `
        <div style="margin-top:8px;">
          <button
            class="doc-link"
            onclick="openDocument('${order.id}', 'shippingDocuments')">
            Shipping Documents
          </button>
        </div>
      `
      : ''
  }


  ${
    order.documents?.regulatoryCertificate
      ? `
        <div style="margin-top:8px;">
          <button
            class="doc-link"
            onclick="openDocument('${order.id}', 'regulatoryCertificate')">
            Regulatory Certificate
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
            Goods Received Note
          </button>
        </div>
      `
      : ''
  }


  ${
    !order.documents?.donationCertificate &&
    !order.documents?.shippingDocuments &&
    !order.documents?.regulatoryCertificate &&
    !order.documents?.goodsReceivedNote
      ? '-'
      : ''
  }

</td>

      <td>

  <span class="badge ${getFinanceBadge(order.paymentStatus)}">
    ${order.paymentStatus || 'Not Paid'}
  </span>


  ${
    order.documents?.paymentReceipt
      ? `
        <br><br>

        <button
          class="doc-link"
          onclick="viewPaymentReceipt('${order.id}')">
          View Receipt
        </button>
      `
      : ''
  }


</td>

<td>

${
  order.paymentStatus === 'Paid'
    ? `
      <span style="font-style:italic;color:#666;">
        ✓ Payment Completed
      </span>
    `
    : `
      <button
        class="btn btn-p"
        onclick="openPaymentModal('${order.id}')">
        Pay
      </button>
    `
}

</td>

</td>
    `

    container.appendChild(row)
  })
}

function submitPayment () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === currentPaymentOrderId)

  if (!order) {
    alert('Order not found')
    return
  }

  const method = document.getElementById('paymentMethod').value

  const receiptInput = document.getElementById('paymentReceiptInput')

  const receiptFile = receiptInput ? receiptInput.files[0] : null

  if (!method) {
    alert('Please select a payment method')
    return
  }

  if (!receiptFile) {
    alert('Please upload payment receipt')
    return
  }

  const reader = new FileReader()

  reader.onload = function () {
    if (!order.documents) {
      order.documents = {}
    }

    order.documents.paymentReceipt = reader.result

    order.paymentMethod = method

    order.paymentStatus = 'Paid'

    order.financeStatus = 'Paid'

    order.status = 'Paid'

    order.paidAt = Date.now()

    localStorage.setItem('orders', JSON.stringify(orders))

    closePaymentModal()

    loadFinanceOrders()
    loadFinanceInvoices()

    window.dispatchEvent(new Event('ordersUpdated'))

    alert('Payment completed successfully')
  }

  reader.readAsDataURL(receiptFile)
}

function viewPaymentReceipt (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order?.documents?.paymentReceipt) {
    alert('Payment receipt not found')
    return
  }

  const blob = dataURLtoBlob(order.documents.paymentReceipt)

  if (!blob) {
    alert('Invalid receipt file')
    return
  }

  const url = URL.createObjectURL(blob)

  window.open(url, '_blank')
}

window.viewPaymentReceipt = viewPaymentReceipt

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

let currentPaymentOrderId = null

function openPaymentModal (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order) return

  currentPaymentOrderId = orderId

  document.getElementById('paymentOrderId').textContent = order.id

  document.getElementById(
    'paymentAmount'
  ).textContent = `${order.invoiceAmount.currency} ${order.invoiceAmount.value}`

  document.getElementById('paymentModal').classList.add('open')
}

function closePaymentModal () {
  document.getElementById('paymentModal').classList.remove('open')

  currentPaymentOrderId = null
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

function dataURLtoBlob (dataURL) {
  if (!dataURL || !dataURL.startsWith('data:')) {
    return null
  }

  const parts = dataURL.split(',')

  const mimeMatch = parts[0].match(/:(.*?);/)

  if (!mimeMatch) {
    return null
  }

  const mime = mimeMatch[1]

  const binary = atob(parts[1])

  const array = []

  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i))
  }

  return new Blob([new Uint8Array(array)], {
    type: mime
  })
}

function openDocument (orderId, docName) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order) return

  let file = ''

  if (docName === 'shippingDocuments') {
    file = order.documents?.shippingDocuments
  }

  if (docName === 'regulatoryCertificate') {
    file = order.documents?.regulatoryCertificate
  }

  if (!file) {
    alert('Document not found')
    return
  }

  const blob = dataURLtoBlob(file)

  if (!blob) {
    alert('This document is not stored as a viewable file')
    return
  }

  const url = URL.createObjectURL(blob)

  window.open(url, '_blank')
}

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

window.openDocument = openDocument
window.viewGoodsReceivedNote = viewGoodsReceivedNote
