let currentFormId = 'all'

function handleBackNavigation () {
  if (currentFormId === 'all') {
    window.location.href = 'admin.html'
  } else {
    switchForm('all')
  }
}

function switchForm (formId) {
  currentFormId = formId

  document
    .querySelectorAll('.form-pane')
    .forEach(pane => pane.classList.remove('active'))

  const targetPane = document.getElementById('pane-' + formId)
  if (targetPane) {
    targetPane.classList.add('active')
    window.location.hash = formId
  }

  const titleEl = document.getElementById('mainRegistryTitle')
  const subEl = document.getElementById('mainRegistrySubtitle')
  const backBtn = document.getElementById('dynamicBackBtn')

  if (formId === 'all') {
    titleEl.innerText = 'Supplies Application Center'
    subEl.innerText =
      'Select the type of medical supply Request you would like to submit.'
    if (backBtn) backBtn.innerText = '← Return to Dashboard'
  } else {
    if (backBtn) backBtn.innerText = '← Return to Application Center'

    switch (formId) {
      case 'catheter':
        titleEl.innerText = 'Application for Medical Materials (Cones)'
        subEl.innerText =
          'Distribution pipeline processing template for non-sized cone catheters.'
        break
      case 'catheter-sizes':
        titleEl.innerText = 'Application for Medical Materials (Catheters)'
        subEl.innerText =
          'Sizing-specific clinical request configuration matrix by CH gauge and lengths.'
        break
      case 'enema':
        titleEl.innerText = 'Application for Medical Materials (Enema Bags)'
        subEl.innerText =
          'Bowel management administrative support allocation registry documentation form.'
        break
      case 'oxybutynin':
        titleEl.innerText = 'Application for Medical Materials (Oxybutynin)'
        subEl.innerText =
          'Pharmaceutical supply line ingestion configuration form for capsule items.'
        break
      case 'shunt':
        titleEl.innerText = 'Application for Surgical Materials (Shunts)'
        subEl.innerText =
          'Hydrocephalus shunt allocation template for valve profiles, EVD pathways, and reservoirs.'
        break
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const initialHash = window.location.hash.replace('#', '')
  if (initialHash && document.getElementById('pane-' + initialHash)) {
    switchForm(initialHash)
  } else {
    switchForm('all')
  }
})

function saveApplication (application) {
  let applications = JSON.parse(localStorage.getItem('applications')) || []

  applications.push(application)

  localStorage.setItem('applications', JSON.stringify(applications))

  alert('Application submitted!')

  window.location.href = '../personnel/personnel.html'
}

document.getElementById('conesForm').addEventListener('submit', function (e) {
  e.preventDefault()

  const application = {
    id: 'APP-' + Date.now(),

    type: 'Cones',

    applicant: document.getElementById('projectName').value,

    address: document.getElementById('address').value,

    country: document.getElementById('country').value,

    contact: document.getElementById('contactPerson').value,

    email: document.getElementById('email').value,

    phone: document.getElementById('phone').value,

    doctor: document.getElementById('doctorName').value,

    nurse: document.getElementById('nurseName').value,

    childrenSeen: document.getElementById('childrenSeen').value,

    quantity: document.getElementById('conesRequested').value,

    status: 'Pending',
    pipelineStatus: 'Submitted',

    submitted: new Date().toLocaleDateString()
  }

  saveApplication(application)
})

document
  .getElementById('catheterSizesForm')
  .addEventListener('submit', function (e) {
    e.preventDefault()

    const application = {
      id: 'APP-' + Date.now(),

      type: 'Catheters',

      applicant: document.getElementById('csProjectName').value,

      address: document.getElementById('csAddress').value,

      country: document.getElementById('csCountry').value,

      contact: document.getElementById('csContactPerson').value,

      email: document.getElementById('csEmail').value,

      phone: document.getElementById('csPhone').value,

      doctor: document.getElementById('csDoctorName').value,

      nurse: document.getElementById('csNurseName').value,

      childrenSeen: document.getElementById('csChildrenSeen').value,

      catheters: {
        ch8Short: document.getElementById('ch8Short').value,
        ch8Long: document.getElementById('ch8Long').value,

        ch10Short: document.getElementById('ch10Short').value,
        ch10Long: document.getElementById('ch10Long').value,

        ch12Short: document.getElementById('ch12Short').value,
        ch12Long: document.getElementById('ch12Long').value,

        ch14Short: document.getElementById('ch14Short').value,
        ch14Long: document.getElementById('ch14Long').value
      },

      quantity:
        Number(document.getElementById('ch8Short').value || 0) +
        Number(document.getElementById('ch8Long').value || 0) +
        Number(document.getElementById('ch10Short').value || 0) +
        Number(document.getElementById('ch10Long').value || 0) +
        Number(document.getElementById('ch12Short').value || 0) +
        Number(document.getElementById('ch12Long').value || 0) +
        Number(document.getElementById('ch14Short').value || 0) +
        Number(document.getElementById('ch14Long').value || 0),

      status: 'Pending',
      pipelineStatus: 'Submitted',

      submitted: new Date().toLocaleDateString()
    }

    saveApplication(application)
  })

document.getElementById('enemaForm').addEventListener('submit', function (e) {
  e.preventDefault()

  const application = {
    id: 'APP-' + Date.now(),

    type: 'Enema Bags',

    applicant: document.getElementById('enemaProjectName').value,

    address: document.getElementById('enemaAddress').value,

    country: document.getElementById('enemaCountry').value,

    contact: document.getElementById('enemaContactPerson').value,

    email: document.getElementById('enemaEmail').value,

    phone: document.getElementById('enemaPhone').value,

    doctor: document.getElementById('enemaDoctorName').value,

    nurse: document.getElementById('enemaNurseName').value,

    childrenSeen: document.getElementById('enemaChildrenSeen').value,

    quantity: document.getElementById('enemaQuantity').value,

    status: 'Pending',
    pipelineStatus: 'Submitted',

    submitted: new Date().toLocaleDateString()
  }

  saveApplication(application)
})

document
  .getElementById('oxybutyninForm')
  .addEventListener('submit', function (e) {
    e.preventDefault()

    const application = {
      id: 'APP-' + Date.now(),

      type: 'Oxybutynin Caps',

      applicant: document.getElementById('oxyProjectName').value,

      address: document.getElementById('oxyAddress').value,

      country: document.getElementById('oxyCountry').value,

      contact: document.getElementById('oxyContactPerson').value,

      email: document.getElementById('oxyEmail').value,

      phone: document.getElementById('oxyPhone').value,

      doctor: document.getElementById('oxyDoctorName').value,

      nurse: document.getElementById('oxyNurseName').value,

      childrenSeen: document.getElementById('oxyChildrenSeen').value,

      quantity: document.getElementById('oxyQuantity').value,

      status: 'Pending',
      pipelineStatus: 'Submitted',

      submitted: new Date().toLocaleDateString()
    }

    saveApplication(application)
  })

document.getElementById('shuntForm').addEventListener('submit', function (e) {
  e.preventDefault()

  const application = {
    id: 'APP-' + Date.now(),

    type: 'Shunt',

    // A(i) Applicant Information
    applicant: document.getElementById('shuntProjectName').value,

    address: document.getElementById('shuntAddress').value,

    country: document.getElementById('shuntCountry').value,

    contact: document.getElementById('shuntContactPerson').value,

    email: document.getElementById('shuntEmail').value,

    phone: document.getElementById('shuntPhone').value,

    // A(ii) Contacts
    adminContact: document.getElementById('shuntAdminContact').value,

    clearingContact: document.getElementById('shuntClearingContact').value,

    clinicalContact: document.getElementById('shuntClinicalContact').value,

    // B(1) Surgical and Clinical

    shuntProtocol: document.getElementById('shuntProtocol').files[0]
      ? document.getElementById('shuntProtocol').files[0].name
      : '',

    surgeonName: document.getElementById('shuntSurgeonName').value,

    surgeonSpeciality: document.getElementById('shuntSurgeonSpeciality').value,

    surgeons: {
      neurosurgeon: document.getElementById('shuntNeurosurgeon').checked,

      neurosurgicalResidents: document.getElementById(
        'shuntNeurosurgicalResidents'
      ).checked,

      pediatricSurgeon: document.getElementById('shuntPediatricSurgeon')
        .checked,

      generalSurgeon: document.getElementById('shuntGeneralSurgeon').checked,

      otherSurgeon: document.getElementById('shuntOtherSurgeon').checked
    },

    shuntProgramData: document.getElementById('shuntProgramData').files[0]
      ? document.getElementById('shuntProgramData').files[0].name
      : '',

    alternatives: {
      etvRigid: document.getElementById('shuntETVRigid').checked,

      etvCpc: document.getElementById('shuntETVCPC').checked
    },

    // Follow-up System

    postOpVisits: document.getElementById('shuntPostOpVisits').value,

    phoneFollowUp: {
      appointmentReminder: document.getElementById(
        'shuntPhoneAppointmentReminder'
      ).checked,

      missedAppointment: document.getElementById('shuntPhoneMissedAppointment')
        .checked,

      generalSupport: document.getElementById('shuntPhoneGeneralSupport')
        .checked
    },

    homeVisits: {
      systematic: document.getElementById('shuntHomeVisitsSystematic').checked,

      targeted: document.getElementById('shuntHomeVisitsTargeted').checked
    },

    // B(2) Demonstration of Need

    projectedAnnualNeed: document.getElementById('shuntProjectedAnnualNeed')
      .value,

    requestedQuantity: document.getElementById('shuntRequestedQuantity').value,

    supplySources: {
      hospital: document.getElementById('shuntSupplyHospital').checked,

      organizations: document.getElementById('shuntSupplyOrganizations')
        .checked,

      families: document.getElementById('shuntSupplyFamilies').checked
    },

    otherSupplySources: document.getElementById('shuntOtherSupplySources')
      .value,

    alternativeSources: document.getElementById('shuntAlternativeSources')
      .value,

    localDistributorAvailability: document.getElementById(
      'shuntLocalDistributorAvailability'
    ).value,

    needFactors: {
      supplierChanges: document.getElementById('shuntNeedSupplierChanges')
        .checked,

      supplyCost: document.getElementById('shuntNeedSupplyCost').checked,

      serviceCosts: document.getElementById('shuntNeedServiceCosts').checked,

      etvUnavailable: document.getElementById('shuntNeedETVUnavailable')
        .checked,

      fundingChanges: document.getElementById('shuntNeedFundingChanges')
        .checked,

      patientIncrease: document.getElementById('shuntNeedPatientIncrease')
        .checked
    },

    waitingList: document.getElementById('shuntWaitingList').value,

    secondaryMarketCost: {
      currency: document.getElementById('shuntSecondaryMarketCurrency').value,
      amount: document.getElementById('shuntSecondaryMarketCost').value
    },

    futurePlan: document.getElementById('shuntFuturePlan').value,

    // Documents

    mohCommunication: document.getElementById('shuntMohCommunication').files[0]
      ? document.getElementById('shuntMohCommunication').files[0].name
      : '',

    // Data Sheet

    dataSheet: {
      lossFollowUp: document.getElementById('shuntLossFollowUp').value,

      lossFollowUpTotal: document.getElementById('shuntLossFollowUpTotal')
        .value,

      badOutcome: document.getElementById('shuntBadOutcome').value,

      badOutcomeTotal: document.getElementById('shuntBadOutcomeTotal').value
    },

    badOutcomeReasons: {
      infections: document.getElementById('shuntInfections').value,

      blocked: document.getElementById('shuntBlocked').value,

      otherMalfunctions: document.getElementById('shuntOtherMalfunctions').value
    },

    // Patient Numbers

    hydroChildren: document.getElementById('shuntHydroChildren').value,

    sbChildren: document.getElementById('shuntSBChildren').value,

    // Requested Materials

    requestedMaterials: {
      lowPressure: document.getElementById('shuntLow').value,

      mediumPressure: document.getElementById('shuntMedium').value,

      highPressure: document.getElementById('shuntHigh').value,

      evd: document.getElementById('shuntEVD').value,

      reservoir: document.getElementById('shuntReservoir').value
    },

    status: 'Pending',

    pipelineStatus: 'Submitted',

    submitted: new Date().toLocaleDateString()
  }

  saveApplication(application)
})
