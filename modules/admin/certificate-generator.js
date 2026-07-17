function generateDonationCertificate (order) {
  const certificateHTML = `
    <html>
    <head>
      <title>Certificate of Donation</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 50px;
          text-align: center;
        }

        .certificate {
          border: 2px solid #333;
          padding: 40px;
          max-width: 700px;
          margin: auto;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 30px;
        }

        p {
          font-size: 16px;
          line-height: 1.6;
        }

        .signature {
          margin-top: 60px;
        }
      </style>

    </head>

    <body>

      <div class="certificate">

        <h1>
          CERTIFICATE OF DONATION
        </h1>

        <p>
          This certificate confirms the donation of medical supplies by:
        </p>

        <h2>
          ${order.supplier || 'Supplier'}
        </h2>

        <p>
          The following items have been donated:
        </p>

        <h3>
          ${order.quantity} x ${order.type}
        </h3>

        <p>
          Recipient Facility:
        </p>

        <h2>
          ${order.facility || '-'}
        </h2>

        <p>
          This donation is facilitated through CHITA.
        </p>


        <div class="signature">

          <p>
            Approved by CHITA Administration
          </p>

          <p>
            ${new Date().toLocaleDateString()}
          </p>

        </div>

      </div>

    </body>
    </html>
  `
  return certificateHTML
}

window.generateDonationCertificate = generateDonationCertificate

function viewDonationCertificate (orderId) {
  const orders = JSON.parse(localStorage.getItem('orders')) || []

  const order = orders.find(o => o.id === orderId)

  if (!order?.documents?.donationCertificate) return

  const newWindow = window.open('', '_blank')

  newWindow.document.write(order.documents.donationCertificate)

  newWindow.document.close()
}

window.viewDonationCertificate = viewDonationCertificate
