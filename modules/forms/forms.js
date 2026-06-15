        let currentFormId = 'all';

        function handleBackNavigation() {
            if (currentFormId === 'all') {
                window.location.href = 'admin.html';
            } else {
                switchForm('all');
            }
        }

        function switchForm(formId) {
            currentFormId = formId;

            document.querySelectorAll('.form-pane').forEach(pane => pane.classList.remove('active'));

            const targetPane = document.getElementById('pane-' + formId);
            if (targetPane) {
                targetPane.classList.add('active');
                window.location.hash = formId;
            }

            const titleEl = document.getElementById('mainRegistryTitle');
            const subEl = document.getElementById('mainRegistrySubtitle');
            const backBtn = document.getElementById('dynamicBackBtn');

            if (formId === 'all') {
                titleEl.innerText = "Forms Intake Registry";
                subEl.innerText = "Select an administrative or clinical operational template to begin data collection.";
                if (backBtn) backBtn.innerText = '← Return to Dashboard';
            } else {
                if (backBtn) backBtn.innerText = '← Return to Forms Registry';

                switch (formId) {
                    case 'catheter':
                        titleEl.innerText = "Application for Medical Materials (Cones)";
                        subEl.innerText = "Distribution pipeline processing template for non-sized cone catheters.";
                        break;
                    case 'catheter-sizes':
                        titleEl.innerText = "Application for Medical Materials (Catheters)";
                        subEl.innerText = "Sizing-specific clinical request configuration matrix by CH gauge and lengths.";
                        break;
                    case 'enema':
                        titleEl.innerText = "Application for Medical Materials (Enema Bags)";
                        subEl.innerText = "Bowel management administrative support allocation registry documentation form.";
                        break;
                    case 'oxybutynin':
                        titleEl.innerText = "Application for Medical Materials (Oxybutynin)";
                        subEl.innerText = "Pharmaceutical supply line ingestion configuration form for capsule items.";
                        break;
                    case 'shunt':
                        titleEl.innerText = "Application for Surgical Materials (Shunts)";
                        subEl.innerText = "Hydrocephalus shunt allocation template for valve profiles, EVD pathways, and reservoirs.";
                        break;
                }
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const initialHash = window.location.hash.replace('#', '');
            if (initialHash && document.getElementById('pane-' + initialHash)) {
                switchForm(initialHash);
            } else {
                switchForm('all');
            }
        });