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

function loadEditingApplication () {
  const editingId = localStorage.getItem('editingApplicationId')

  if (!editingId) return

  const applications = JSON.parse(localStorage.getItem('applications')) || []

  const app = applications.find(a => String(a.id) === String(editingId))

  if (!app) return

  console.log('Editing application found:', app)

  window.editingApplication = app

  setTimeout(() => {
    if (app.formType === 'catheter') {
      preloadConesForm(app)
    }

    if (app.formType === 'catheter-sizes') {
      preloadCatheterSizesForm(app)
    }

    if (app.formType === 'enema') {
      preloadEnemaForm(app)
    }

    if (app.formType === 'oxybutynin') {
      preloadOxybutyninForm(app)
    }

    if (app.formType === 'shunt') {
      preloadShuntForm(app)
    }
  }, 100)
}

window.addEventListener('DOMContentLoaded', () => {
  loadEditingApplication()

  const initialHash = window.location.hash.replace('#', '')

  // If user explicitly opened the registry
  if (initialHash === 'all') {
    switchForm('all')
    return
  }

  // If editing an application, open its form
  if (window.editingApplication && window.editingApplication.formType) {
    switchForm(window.editingApplication.formType)
    return
  }

  // Default
  if (initialHash && document.getElementById('pane-' + initialHash)) {
    switchForm(initialHash)
  } else {
    switchForm('all')
  }
})

function saveApplication (application) {
  console.log('EDIT MODE:', window.editingApplication)
  console.log('EDIT ID:', localStorage.getItem('editingApplicationId'))

  let applications = JSON.parse(localStorage.getItem('applications')) || []

  const editingId = localStorage.getItem('editingApplicationId')

  if (editingId) {
    const index = applications.findIndex(
      a => String(a.id) === String(editingId)
    )

    if (index !== -1) {
      // keep original creation time
      application.createdAt = applications[index].createdAt

      // mark update time
      application.updatedAt = Date.now()

      // mark resubmission time
      application.resubmittedAt = Date.now()

      // replace existing application
      applications[index] = application
    }

    // exit edit mode
    localStorage.removeItem('editingApplicationId')
    localStorage.removeItem('editingApplication')

    window.editingApplication = null
  } else {
    // brand new application
    application.createdAt = Date.now()
    application.submittedAt = Date.now()
    applications.push(application)
  }

  // newest first
  applications.sort(
    (a, b) =>
      (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)
  )

  localStorage.setItem('applications', JSON.stringify(applications))

  alert('Application submitted!')

  window.location.href = '../personnel/personnel.html'
}

document.getElementById('conesForm').addEventListener('submit', function (e) {
  e.preventDefault()

  const application = {
    id: window.editingApplication
      ? window.editingApplication.id
      : 'APP-' + Date.now(),

    type: 'Cones',

    formType: 'catheter',

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

    pipelineStatus: window.editingApplication ? 'Resubmitted' : 'Submitted',

    submitted: new Date().toLocaleDateString()
  }

  saveApplication(application)
})

function preloadConesForm (app) {
  document.getElementById('projectName').value = app.applicant || ''
  document.getElementById('address').value = app.address || ''
  document.getElementById('country').value = app.country || ''

  document.getElementById('contactPerson').value = app.contact || ''
  document.getElementById('email').value = app.email || ''
  document.getElementById('phone').value = app.phone || ''

  document.getElementById('doctorName').value = app.doctor || ''
  document.getElementById('nurseName').value = app.nurse || ''

  document.getElementById('childrenSeen').value = app.childrenSeen || ''

  document.getElementById('conesRequested').value = app.quantity || ''
}

document
  .getElementById('catheterSizesForm')
  .addEventListener('submit', function (e) {
    e.preventDefault()

    const application = {
      id: window.editingApplication
        ? window.editingApplication.id
        : 'APP-' + Date.now(),

      type: 'Catheters',

      formType: 'catheter-sizes',

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

      pipelineStatus: window.editingApplication ? 'Resubmitted' : 'Submitted',

      submitted: new Date().toLocaleDateString()
    }

    saveApplication(application)
  })

function preloadCatheterSizesForm (app) {
  document.getElementById('csProjectName').value = app.applicant || ''

  document.getElementById('csAddress').value = app.address || ''

  document.getElementById('csCountry').value = app.country || ''

  document.getElementById('csContactPerson').value = app.contact || ''

  document.getElementById('csEmail').value = app.email || ''

  document.getElementById('csPhone').value = app.phone || ''

  document.getElementById('csDoctorName').value = app.doctor || ''

  document.getElementById('csNurseName').value = app.nurse || ''

  document.getElementById('csChildrenSeen').value = app.childrenSeen || ''

  // catheter quantities

  document.getElementById('ch8Short').value = app.catheters?.ch8Short || ''

  document.getElementById('ch8Long').value = app.catheters?.ch8Long || ''

  document.getElementById('ch10Short').value = app.catheters?.ch10Short || ''

  document.getElementById('ch10Long').value = app.catheters?.ch10Long || ''

  document.getElementById('ch12Short').value = app.catheters?.ch12Short || ''

  document.getElementById('ch12Long').value = app.catheters?.ch12Long || ''

  document.getElementById('ch14Short').value = app.catheters?.ch14Short || ''

  document.getElementById('ch14Long').value = app.catheters?.ch14Long || ''
}

document.getElementById('enemaForm').addEventListener('submit', function (e) {
  e.preventDefault()

  const application = {
    id: window.editingApplication
      ? window.editingApplication.id
      : 'APP-' + Date.now(),

    type: 'Enema Bags',

    formType: 'enema',

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

    pipelineStatus: window.editingApplication ? 'Resubmitted' : 'Submitted',

    submitted: new Date().toLocaleDateString()
  }

  saveApplication(application)
})

function preloadEnemaForm (app) {
  document.getElementById('enemaProjectName').value = app.applicant || ''

  document.getElementById('enemaAddress').value = app.address || ''

  document.getElementById('enemaCountry').value = app.country || ''

  document.getElementById('enemaContactPerson').value = app.contact || ''

  document.getElementById('enemaEmail').value = app.email || ''

  document.getElementById('enemaPhone').value = app.phone || ''

  document.getElementById('enemaDoctorName').value = app.doctor || ''

  document.getElementById('enemaNurseName').value = app.nurse || ''

  document.getElementById('enemaChildrenSeen').value = app.childrenSeen || ''

  document.getElementById('enemaQuantity').value = app.quantity || ''
}

document
  .getElementById('oxybutyninForm')
  .addEventListener('submit', function (e) {
    e.preventDefault()

    const application = {
      id: window.editingApplication
        ? window.editingApplication.id
        : 'APP-' + Date.now(),

      type: 'Oxybutynin Caps',

      formType: 'oxybutynin',

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

      pipelineStatus: window.editingApplication ? 'Resubmitted' : 'Submitted',

      submitted: new Date().toLocaleDateString()
    }

    saveApplication(application)
  })

function preloadOxybutyninForm (app) {
  document.getElementById('oxyProjectName').value = app.applicant || ''

  document.getElementById('oxyAddress').value = app.address || ''

  document.getElementById('oxyCountry').value = app.country || ''

  document.getElementById('oxyContactPerson').value = app.contact || ''

  document.getElementById('oxyEmail').value = app.email || ''

  document.getElementById('oxyPhone').value = app.phone || ''

  document.getElementById('oxyDoctorName').value = app.doctor || ''

  document.getElementById('oxyNurseName').value = app.nurse || ''

  document.getElementById('oxyChildrenSeen').value = app.childrenSeen || ''

  document.getElementById('oxyQuantity').value = app.quantity || ''
}

document.getElementById('shuntForm').addEventListener('submit', function (e) {
  e.preventDefault()

  const application = {
    id: window.editingApplication
      ? window.editingApplication.id
      : 'APP-' + Date.now(),

    type: 'Shunt',

    formType: 'shunt',

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

    pipelineStatus: window.editingApplication ? 'Resubmitted' : 'Submitted',

    submitted: new Date().toLocaleDateString()
  }

  saveApplication(application)
})

function preloadShuntForm (app) {
  // Applicant Information

  document.getElementById('shuntProjectName').value = app.applicant || ''
  document.getElementById('shuntAddress').value = app.address || ''
  document.getElementById('shuntCountry').value = app.country || ''
  document.getElementById('shuntContactPerson').value = app.contact || ''
  document.getElementById('shuntEmail').value = app.email || ''
  document.getElementById('shuntPhone').value = app.phone || ''

  // Programme Contacts

  document.getElementById('shuntAdminContact').value = app.adminContact || ''

  document.getElementById('shuntClearingContact').value =
    app.clearingContact || ''

  document.getElementById('shuntClinicalContact').value =
    app.clinicalContact || ''

  // Surgical Information

  document.getElementById('shuntSurgeonName').value = app.surgeonName || ''

  document.getElementById('shuntSurgeonSpeciality').value =
    app.surgeonSpeciality || ''

  document.getElementById('shuntNeurosurgeon').checked =
    app.surgeons?.neurosurgeon || false

  document.getElementById('shuntNeurosurgicalResidents').checked =
    app.surgeons?.neurosurgicalResidents || false

  document.getElementById('shuntPediatricSurgeon').checked =
    app.surgeons?.pediatricSurgeon || false

  document.getElementById('shuntGeneralSurgeon').checked =
    app.surgeons?.generalSurgeon || false

  document.getElementById('shuntOtherSurgeon').checked =
    app.surgeons?.otherSurgeon || false

  // Alternatives

  document.getElementById('shuntETVRigid').checked =
    app.alternatives?.etvRigid || false

  document.getElementById('shuntETVCPC').checked =
    app.alternatives?.etvCpc || false

  // Follow-up System

  document.getElementById('shuntPostOpVisits').value = app.postOpVisits || ''

  document.getElementById('shuntPhoneAppointmentReminder').checked =
    app.phoneFollowUp?.appointmentReminder || false

  document.getElementById('shuntPhoneMissedAppointment').checked =
    app.phoneFollowUp?.missedAppointment || false

  document.getElementById('shuntPhoneGeneralSupport').checked =
    app.phoneFollowUp?.generalSupport || false

  document.getElementById('shuntHomeVisitsSystematic').checked =
    app.homeVisits?.systematic || false

  document.getElementById('shuntHomeVisitsTargeted').checked =
    app.homeVisits?.targeted || false

  // Demonstration of Need

  document.getElementById('shuntProjectedAnnualNeed').value =
    app.projectedAnnualNeed || ''

  document.getElementById('shuntRequestedQuantity').value =
    app.requestedQuantity || ''

  // Supply Sources

  document.getElementById('shuntSupplyHospital').checked =
    app.supplySources?.hospital || false

  document.getElementById('shuntSupplyOrganizations').checked =
    app.supplySources?.organizations || false

  document.getElementById('shuntSupplyFamilies').checked =
    app.supplySources?.families || false

  document.getElementById('shuntOtherSupplySources').value =
    app.otherSupplySources || ''

  document.getElementById('shuntAlternativeSources').value =
    app.alternativeSources || ''

  document.getElementById('shuntLocalDistributorAvailability').value =
    app.localDistributorAvailability || ''

  // Need Factors

  document.getElementById('shuntNeedSupplierChanges').checked =
    app.needFactors?.supplierChanges || false

  document.getElementById('shuntNeedSupplyCost').checked =
    app.needFactors?.supplyCost || false

  document.getElementById('shuntNeedServiceCosts').checked =
    app.needFactors?.serviceCosts || false

  document.getElementById('shuntNeedETVUnavailable').checked =
    app.needFactors?.etvUnavailable || false

  document.getElementById('shuntNeedFundingChanges').checked =
    app.needFactors?.fundingChanges || false

  document.getElementById('shuntNeedPatientIncrease').checked =
    app.needFactors?.patientIncrease || false

  // Planning

  document.getElementById('shuntWaitingList').value = app.waitingList || ''

  document.getElementById('shuntSecondaryMarketCurrency').value =
    app.secondaryMarketCost?.currency || ''

  document.getElementById('shuntSecondaryMarketCost').value =
    app.secondaryMarketCost?.amount || ''

  document.getElementById('shuntFuturePlan').value = app.futurePlan || ''

  // Outcome Tracking

  document.getElementById('shuntLossFollowUp').value =
    app.dataSheet?.lossFollowUp || ''

  document.getElementById('shuntLossFollowUpTotal').value =
    app.dataSheet?.lossFollowUpTotal || ''

  document.getElementById('shuntBadOutcome').value =
    app.dataSheet?.badOutcome || ''

  document.getElementById('shuntBadOutcomeTotal').value =
    app.dataSheet?.badOutcomeTotal || ''

  document.getElementById('shuntInfections').value =
    app.badOutcomeReasons?.infections || ''

  document.getElementById('shuntBlocked').value =
    app.badOutcomeReasons?.blocked || ''

  document.getElementById('shuntOtherMalfunctions').value =
    app.badOutcomeReasons?.otherMalfunctions || ''

  // Patient Numbers

  document.getElementById('shuntHydroChildren').value = app.hydroChildren || ''

  document.getElementById('shuntSBChildren').value = app.sbChildren || ''

  // Requested Materials

  document.getElementById('shuntLow').value =
    app.requestedMaterials?.lowPressure || ''

  document.getElementById('shuntMedium').value =
    app.requestedMaterials?.mediumPressure || ''

  document.getElementById('shuntHigh').value =
    app.requestedMaterials?.highPressure || ''

  document.getElementById('shuntEVD').value = app.requestedMaterials?.evd || ''

  document.getElementById('shuntReservoir').value =
    app.requestedMaterials?.reservoir || ''
}
