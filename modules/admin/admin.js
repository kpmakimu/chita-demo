let selectedAppFilter = null;
        let activeRowReference = null;

        function asc(id, el) {
            document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'));
            document.querySelectorAll('.sb-item, .sb-sub-item').forEach(n => n.classList.remove('on'));

            const subPanel = document.getElementById('s-' + id);
            if (subPanel) subPanel.classList.add('on');

            if (el) {
                el.classList.add('on');
            } else {
                const matchingSidebarElement = document.querySelector(`[onclick*="asc('${id}'"]`);
                if (matchingSidebarElement) matchingSidebarElement.classList.add('on');
            }

            document.getElementById('atitle').textContent = el ? el.innerText.split('\n')[0] : id.toUpperCase().replace('-', ' ');

            if (id === 'apps') {
                //exitApplicationDetail();

                document.getElementById('atitle').innerText = 'Applications';
                setTimeout(() => {
                    const firstVisibleRow = document.querySelector('#main-apps-table tbody tr');
                    if (firstVisibleRow) {
                        launchApplicationDetail(firstVisibleRow);
                    }
                }, 50);
            }

            toggleSidebar(false);
        }

        function tabShow(id, el) {
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.mini-tab').forEach(t => t.classList.remove('on'));

            const coreTab = document.getElementById(id);
            if (coreTab) coreTab.classList.add('active');

            if (el) {
                el.classList.add('on');
            } else {
                const associatedMiniTab = document.querySelector(`[onclick*='tabShow(\"${id}\"']`);
                if (associatedMiniTab) associatedMiniTab.classList.add('on');
            }
        }

        function toggleSubmenu(parentItem) {
            const container = parentItem.parentElement;
            const isOpen = container.classList.contains('open');

            document.querySelectorAll('.sb-has-dropdown').forEach(item => {
                item.classList.remove('open');
            });

            if (!isOpen) {
                container.classList.add('open');
            }
        }

        function toggleNotifMenu(event) {
            event.stopPropagation();
            const profCard = document.getElementById('profileDropdownCard');
            if (profCard) profCard.classList.remove('active');

            const card = document.getElementById('dropdownCard');
            if (card) card.classList.toggle('active');
        }

        function toggleProfileMenu(event) {
            event.stopPropagation();
            const notifCard = document.getElementById('dropdownCard');
            if (notifCard && notifCard.classList.contains('active')) notifCard.classList.remove('active');

            const card = document.getElementById('profileDropdownCard');
            if (card) card.classList.toggle('active');
        }

        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('active');
            const profCard = document.getElementById('profileDropdownCard');
            if (profCard) profCard.classList.remove('active');
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('active');
        }

        window.addEventListener('click', function () {
            const notifCard = document.getElementById('dropdownCard');
            if (notifCard && notifCard.classList.contains('active')) notifCard.classList.remove('active');

            const profCard = document.getElementById('profileDropdownCard');
            if (profCard && profCard.classList.contains('active')) profCard.classList.remove('active');
        });

        function openAuthorizationsQueue() {
            asc('pending', null);
            const card = document.getElementById('dropdownCard');
            if (card) card.classList.remove('active');

            const clearanceSubItem = document.querySelector('[onclick*="asc(\'pending\'"]');
            if (clearanceSubItem) clearanceSubItem.classList.add('on');
        }

        function evaluateMasterFilters() {
            const searchVal = document.getElementById('f-search').value.toLowerCase().trim();
            const typeVal = document.getElementById('f-type').value;
            const deptVal = document.getElementById('f-dept').value;
            const statusVal = document.getElementById('f-status').value;

            const tableRows = document.querySelectorAll('#main-apps-table tbody tr');
            const titleElement = document.getElementById('app-table-title');

            let activeCriteriaDescriptions = [];
            if (selectedAppFilter) activeCriteriaDescriptions.push(`Card: ${selectedAppFilter}`);
            if (searchVal) activeCriteriaDescriptions.push(`Search: "${searchVal}"`);
            if (typeVal) activeCriteriaDescriptions.push(`Type: ${typeVal}`);
            if (deptVal) activeCriteriaDescriptions.push(`Dept: ${deptVal}`);
            if (statusVal) activeCriteriaDescriptions.push(`Status: ${statusVal}`);

            if (activeCriteriaDescriptions.length > 0) {
                titleElement.innerHTML = `Applications Ledger &rarr; <span style="color:var(--c-accent); font-size:12px;">Active Filters (${activeCriteriaDescriptions.join(' | ')})</span>`;
            } else {
                titleElement.textContent = "Facility Access & Procurement Applications";
            }

            tableRows.forEach(row => {
                const rowCategory = row.getAttribute('data-item-category');
                const rowDept = row.getAttribute('data-item-dept');
                const rowStatus = row.getAttribute('data-item-status');
                const applicantName = row.cells[1].textContent.toLowerCase();

                const matchesCard = !selectedAppFilter || rowCategory === selectedAppFilter;
                const matchesSearch = !searchVal || applicantName.includes(searchVal);
                const matchesType = !typeVal || rowCategory === typeVal;
                const matchesDept = !deptVal || rowDept === deptVal;
                const matchesStatus = !statusVal || rowStatus.toLowerCase() === statusVal.toLowerCase();

                if (matchesCard && matchesSearch && matchesType && matchesDept && matchesStatus) {
                    row.classList.remove('hidden-row');
                } else {
                    row.classList.add('hidden-row');
                }
            });
        }

        function filterAppTable(clickedCard) {
            const filterTarget = clickedCard.getAttribute('data-filter-type');
            const allBoxes = document.querySelectorAll('.app-stat-grid .stat-box');

            if (selectedAppFilter === filterTarget) {
                selectedAppFilter = null;
                clickedCard.classList.remove('active');
            } else {
                allBoxes.forEach(box => box.classList.remove('active'));
                clickedCard.classList.add('active');
                selectedAppFilter = filterTarget;

                document.getElementById('f-type').value = filterTarget;
            }
            evaluateMasterFilters();
        }

        function resetPipelineFilters() {
            document.getElementById('f-search').value = '';
            document.getElementById('f-type').value = '';
            document.getElementById('f-dept').value = '';
            document.getElementById('f-status').value = '';

            document.querySelectorAll('.app-stat-grid .stat-box').forEach(box => box.classList.remove('active'));
            selectedAppFilter = null;

            evaluateMasterFilters();
        }

        function launchApplicationDetail(rowElement) {

            const detailView = document.getElementById('app-instance-detail-view');
            detailView.style.display = 'block';

            activeRowReference = rowElement;
            const appId = rowElement.getAttribute('data-item-id');
            const category = rowElement.getAttribute('data-item-category');
            const dept = rowElement.getAttribute('data-item-dept');
            const currentStatus = rowElement.getAttribute('data-item-status');
            const applicant = rowElement.cells[1].textContent;
            const dateStr = rowElement.cells[4].textContent;
            const statusBadgeHTML = rowElement.cells[5].innerHTML;

            document.getElementById('det-breadcrumb').textContent = `Requests List > Details for Request ${appId}`;
            document.getElementById('det-badge-slot').innerHTML = statusBadgeHTML;
            document.getElementById('det-applicant').textContent = applicant;
            document.getElementById('det-sub-text').textContent = `Tracking Reference Log Number: ${appId}`;
            document.getElementById('det-component').textContent = category;
            document.getElementById('det-dept').textContent = dept;
            document.getElementById('det-date').textContent = dateStr;
            document.getElementById('det-token').textContent = `${appId.replace('#', '')}-MBU`;

            // If it's already denied or approved, hide the action buttons to stay consistent
            const actionsCard = document.getElementById('det-admin-actions-card');
            if (currentStatus === 'Denied') {
                actionsCard.style.display = 'none';
            } else {
                actionsCard.style.display = 'block';
            }

            document.getElementById('app-ledger-view').style.display = 'none';
            document.getElementById('app-instance-detail-view').style.display = 'block';
        }

        function exitApplicationDetail() {
            //document.getElementById('app-instance-detail-view').style.display = 'none';
            //document.getElementById('app-ledger-view').style.display = 'block';
            //activeRowReference = null;

            // Instead of hiding the panel completely, we select the first row to keep the split active
            const firstVisibleRow = document.querySelector('#main-apps-table tbody tr:not(.hidden-row)');
            if (firstVisibleRow && activeRowReference !== firstVisibleRow) {
                launchApplicationDetail(firstVisibleRow);
            } else {
                // Fallback fallback if no rows are present
                const detailPanel = document.getElementById('app-instance-detail-view');
                if (detailPanel) detailPanel.style.display = 'none';
                if (activeRowReference) activeRowReference.style.backgroundColor = '';
                activeRowReference = null;
            }
        }


        function approveAndConvertApplicationToOrder() {
            if (!activeRowReference) return;

            const appId = activeRowReference.getAttribute('data-item-id');
            const category = activeRowReference.getAttribute('data-item-category');
            const dept = activeRowReference.getAttribute('data-item-dept');
            const orderId = appId.replace('APP', 'ORD');

            const ordersTableBody = document.querySelector('#main-orders-table tbody');
            const newRow = document.createElement('tr');
            newRow.style.borderBottom = "1px solid rgba(223, 224, 226, 0.5)";

            newRow.innerHTML = `
                <td><strong>${orderId}</strong></td>
                <td>${category} Supply Parcel</td>
                <td>${dept}</td>
                <td>$1,250.00</td>
                <td><span class="badge badge-pending">Vendor Pending</span></td>
            `;

            ordersTableBody.insertBefore(newRow, ordersTableBody.firstChild);
            decrementUpperHomeCounters();
            recalculateUpperStatBoxCounters(category);
            activeRowReference.remove();

            alert(`Mockup Action Success:\nApplication ${appId} has been verified and converted into Active Logistics Procurement Order ${orderId}!`);
            exitApplicationDetail();
        }

        /* INLINE APPLICATION DENIAL STRATEGY - UPDATED TO KEEP ROW BUT CHANGE STATE */
        function denyApplicationInline() {
            if (!activeRowReference) return;
            const appId = activeRowReference.getAttribute('data-item-id');
            const category = activeRowReference.getAttribute('data-item-category');

            // Update row attributes and visual cells instead of destroying it
            activeRowReference.setAttribute('data-item-status', 'Denied');
            activeRowReference.cells[5].innerHTML = '<span class="badge badge-denied">Denied</span>';

            // Push it down to the bottom of the table log visually
            const tableBody = document.querySelector('#main-apps-table tbody');
            tableBody.appendChild(activeRowReference);

            decrementUpperHomeCounters();
            recalculateUpperStatBoxCounters(category);

            alert(`Mockup Action:\nApplication ${appId} has been formally Denied. Row retained in database history.`);
            exitApplicationDetail();
        }

        function decrementUpperHomeCounters() {
            const appStatText = document.getElementById('home-stat-apps-count');
            if (appStatText) {
                let currentTotal = parseInt(appStatText.innerText) || 0;
                if (currentTotal > 0) appStatText.innerText = currentTotal - 1;
            }
        }

        function recalculateUpperStatBoxCounters(category) {
            let targetCardId = '';
            if (category === 'Cones') targetCardId = 'cnt-cones';
            if (category === 'Catheters') targetCardId = 'cnt-catheters';
            if (category === 'Enema Bags') targetCardId = 'cnt-enema';
            if (category === 'Oxybutynin Caps') targetCardId = 'cnt-oxy';
            if (category === 'Shunt') targetCardId = 'cnt-shunt';

            const itemCounterElement = document.getElementById(targetCardId);
            if (itemCounterElement) {
                let currentItemCount = parseInt(itemCounterElement.innerText) || 0;
                if (currentItemCount > 0) itemCounterElement.innerText = currentItemCount - 1;
            }
        }

        function handleAction(elementId, outcome) {
            const targetElement = document.getElementById(elementId);
            if (targetElement) {
                targetElement.style.opacity = '0';
                targetElement.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    targetElement.style.display = 'none';
                    document.getElementById('emptyQueue').style.display = 'block';

                    const dot = document.getElementById('queue-dot');
                    if (dot) dot.style.display = 'none';

                    if (document.getElementById('dd-preview')) document.getElementById('dd-preview').style.display = 'none';
                    if (document.getElementById('dd-empty')) document.getElementById('dd-empty').style.display = 'block';

                    if (document.getElementById('stat-urgent-count')) document.getElementById('stat-urgent-count').innerText = '0';

                    const cellStatus = document.getElementById('table-user-status');
                    if (cellStatus) {
                        cellStatus.innerText = outcome === 'Authorized' ? 'Active' : 'Declined';
                        cellStatus.style.color = outcome === 'Authorized' ? 'var(--c-primary)' : 'var(--text-muted)';
                    }

                    const mgmtStatusBadge = document.getElementById('mgmt-user-status');
                    if (mgmtStatusBadge) {
                        mgmtStatusBadge.innerText = outcome === 'Authorized' ? 'Root Admin Access Level 3' : 'Access Request Denied';
                        mgmtStatusBadge.className = outcome === 'Authorized' ? 'badge badge-success' : 'badge badge-urgent';
                    }

                    alert(`System Record: Personnel request successfully ${outcome}.`);
                }, 300);
            }
        }

        function toggleSidebar(shouldOpen) {
            const sidebar = document.getElementById('adminSidebar');
            const overlay = document.getElementById('sbOverlay');

            if (shouldOpen) {
                sidebar.classList.add('open');
                overlay.classList.add('visible');
            } else {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
            }
        }