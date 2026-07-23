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

  const availableOrders = orders.filter(
    o => o.status === 'Available' || o.status === 'Approved'
  )

  availableBody.innerHTML = ''
  previewBody.innerHTML = ''

  availableOrders.forEach(order => {
    const row = `
      <tr>
        <td>${order.id}</td>
        <td>${order.facility || '-'}</td>
        <td>${order.type || '-'}</td>
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
              : order.status === 'In Review'
              ? `<span style="color:var(--text-muted);font-size:12px;">Submitted</span>`
              : `<span style="color:var(--text-muted);font-size:12px;">Locked</span>`
          }
        </td>
      </tr>
    `

    availableBody.innerHTML += row
    previewBody.innerHTML += row
  })

  document.getElementById('stat-available').textContent = availableOrders.length

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
        <td>${order.facility || '-'}</td>
        <td>${order.type || '-'}</td>
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
        <td>${order.facility || '-'}</td>
        <td>${order.type || '-'}</td>
        <td>${order.quantity || '-'}</td>
        <td>
          <span class="badge badge-success">${order.status}</span>
        </td>
        <td>
  ${(() => {
    const docs = []

    // Phase 1 documents
    if (order.documents?.proformaInvoice) {
      docs.push({
        name: 'Proforma Invoice',
        value: order.documents.proformaInvoice
      })
    }

    if (order.documents?.packingList) {
      docs.push({
        name: 'Packing List',
        value: order.documents.packingList
      })
    }

    // Donation certificate
    if (order.documents?.donationCertificate) {
      docs.push({
        name: 'Donation Certificate',
        certificate: true
      })
    }

    // Phase 2 documents
    if (order.documents?.shippingDocuments) {
      docs.push({
        name: 'Shipping Documents',
        value: order.documents.shippingDocuments
      })
    }

    if (order.documents?.regulatoryCertificate) {
      docs.push({
        name: 'Regulatory Certificate',
        value: order.documents.regulatoryCertificate
      })
    }

    // Extra documents
    if (order.documents?.additionalDocuments?.length) {
      order.documents.additionalDocuments.forEach(doc => {
        docs.push({
          name: doc.name,
          value: doc.file
        })
      })
    }

    return docs.length
      ? docs
          .map(doc => {
            if (doc.certificate) {
              return `
                <div style="margin-bottom:6px;">
                  <button 
                    class="btn btn-ghost"
                    onclick="viewDonationCertificate('${order.id}')">
                    Donation Certificate
                  </button>
                </div>
              `
            }

            console.log(doc.name, doc.value)

            return `
  <div style="margin-bottom:6px;">
    <a
      href="#"
      class="doc-link"
      onclick="openDocument('${order.id}', '${doc.name}')">
      ${doc.name}
    </a>
  </div>
`
          })
          .join('')
      : '-'
  })()}
        </td>
        <td>
${
  order.status === 'Assigned' && !order.documents?.proformaInvoice
    ? `<button class="btn btn-p" onclick="openSupplierUploadModal('${order.id}')">
         Upload Initial Docs
       </button>`
    : order.status === 'Assigned' && order.documents?.proformaInvoice
    ? `<span style="color:var(--text-muted);font-size:12px;">
         Submitted
       </span>`
    : order.status === 'Approved' && !order.documents?.shippingDocuments
    ? `<button class="btn btn-p" onclick="openFulfilmentUploadModal('${order.id}')">
         Upload Fulfilment Docs
       </button>`
    : order.status === 'Approved' && order.documents?.shippingDocuments
    ? `<span style="color:var(--text-muted);font-size:12px;">
         Submitted
       </span>`
    : ''
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

  if (!order.documents) {
    order.documents = {}
  }

  order.documents.proformaInvoice = invoiceData
  order.documents.packingList = packingListData

  order.invoiceAmount = amount

  order.status = 'In Review'
  order.submittedAt = Date.now()

  localStorage.setItem('orders', JSON.stringify(orders))

  loadSupplierOrders()
  loadSupplierMyOrders()
}

function submitSupplierDocs () {
  const invoice = document.getElementById('invoiceInput').files[0]
  const packing = document.getElementById('packingInput').files[0]

  const amount = {
    currency: document.getElementById('currencySelect').value,
    value: document.getElementById('amountInput').value
  }

  if (!invoice || !packing) {
    alert('Please upload both invoice and packing list.')
    return
  }

  const invoiceReader = new FileReader()
  const packingReader = new FileReader()

  invoiceReader.onload = function () {
    packingReader.onload = function () {
      uploadProformaAndPacking(
        activeUploadOrderId,
        invoiceReader.result,
        packingReader.result,
        amount
      )

      closeUploadModal()
    }

    packingReader.readAsDataURL(packing)
  }

  invoiceReader.readAsDataURL(invoice)
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

let currentFulfilmentOrderId = null

function openFulfilmentUploadModal (orderId) {
  currentFulfilmentOrderId = orderId

  document.getElementById('fulfilmentUploadModal').style.display = 'flex'
}

function closeFulfilmentUploadModal () {
  currentFulfilmentOrderId = null

  document.getElementById('fulfilmentUploadModal').style.display = 'none'
}

function closeUploadModal () {
  activeUploadOrderId = null

  const modal = document.getElementById('uploadModal')
  if (modal) modal.style.display = 'none'
}

function syncOrdersUI () {
  loadAdminOrders?.()
  loadSupplierOrders?.()
  loadSupplierDashboardOrders?.()
  loadFinanceInvoices?.()
}

function submitFulfilmentDocs () {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === currentFulfilmentOrderId)

  if (!order) {
    alert('Order not found')
    return
  }

  const shippingFile = document.getElementById('shippingInput').files[0]
  const regulatoryFile = document.getElementById('regulatoryInput').files[0]

  const extraName = document.getElementById('extraDocumentName').value
  const extraFile = document.getElementById('extraDocumentFile').files[0]

  if (!order.documents) {
    order.documents = {}
  }

  const readFile = file => {
    return new Promise(resolve => {
      if (!file) {
        resolve(null)
        return
      }

      const reader = new FileReader()

      reader.onload = e => {
        resolve(e.target.result)
      }

      reader.readAsDataURL(file)
    })
  }

  Promise.all([
    readFile(shippingFile),
    readFile(regulatoryFile),
    readFile(extraFile)
  ]).then(([shippingData, regulatoryData, extraData]) => {
    // Append Phase 2 documents
    if (shippingData) {
      order.documents.shippingDocuments = shippingData
    }

    if (regulatoryData) {
      order.documents.regulatoryCertificate = regulatoryData
    }

    if (extraData && extraName) {
      if (!order.documents.additionalDocuments) {
        order.documents.additionalDocuments = []
      }

      order.documents.additionalDocuments.push({
        name: extraName,
        file: extraData
      })
    }

    order.fulfilmentStatus = 'En Route'
    order.shippedAt = Date.now()
    order.submittedAt = Date.now()

    localStorage.setItem('orders', JSON.stringify(orders))

    closeFulfilmentUploadModal()

    loadSupplierMyOrders()

    alert('DOcuments are submitted ans are now en route')
  })
}

function openDocument (orderId, docName) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order) return

  let file = ''

  if (docName === 'Proforma Invoice') {
    file = order.documents?.proformaInvoice
  }

  if (docName === 'Packing List') {
    file = order.documents?.packingList
  }

  if (docName === 'Shipping Documents') {
    file = order.documents?.shippingDocuments
  }

  if (docName === 'Regulatory Certificate') {
    file = order.documents?.regulatoryCertificate
  }

  if (order.documents?.additionalDocuments?.length) {
    const extraDoc = order.documents.additionalDocuments.find(
      doc => doc.name === docName
    )

    if (extraDoc) {
      file = extraDoc.file
    }
  }

  if (!file) return

  const blob = dataURLtoBlob(file)

  if (!blob) {
    alert('This document is not stored as a viewable file yet.')
    return
  }

  const url = URL.createObjectURL(blob)

  window.open(url, '_blank')
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

  return new Blob([new Uint8Array(array)], { type: mime })
}

window.openSupplierUploadModal = openSupplierUploadModal
window.closeUploadModal = closeUploadModal
