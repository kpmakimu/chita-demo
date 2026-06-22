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

        function toggleNotifMenu(e) {
            e.stopPropagation();
            document.getElementById('dropdownCard').classList.toggle('active');
            document.getElementById('profileDropdownCard').classList.remove('active');
        }

        function toggleProfileMenu(e) {
            e.stopPropagation();
            document.getElementById('profileDropdownCard').classList.toggle('active');
            document.getElementById('dropdownCard').classList.remove('active');
        }

        document.addEventListener('click', () => {
            document.getElementById('dropdownCard').classList.remove('active');
            document.getElementById('profileDropdownCard').classList.remove('active');
        });

        function asc(sectionId, el) {
            document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('on'));
            if (el) el.classList.add('on');

            document.querySelectorAll('.sc').forEach(s => s.classList.remove('on'));
            const target = document.getElementById('s-' + sectionId);
            if (target) target.classList.add('on');

            const title = document.getElementById('atitle');
            if (title) title.innerText = el.innerText;
        }

        /* ACTIONS AND FLOW LOGIC */
        function handleOrderSubmission(event) {
            event.preventDefault();

            const item = document.getElementById('supplyItem').value;
            const qty = document.getElementById('orderQty').value;

            document.getElementById('simulated-row').cells[1].innerText = item;
            document.getElementById('simulated-row').cells[2].innerText = qty;

            document.getElementById('queue-dot').style.display = 'block';
            document.getElementById('dd-preview').style.display = 'block';
            document.getElementById('dd-empty').style.display = 'none';

            document.getElementById('table-status-badge').className = "badge badge-pending";
            document.getElementById('table-status-badge').innerText = "Waiting for approval";
            document.getElementById('table-fulfillment-text').innerText = "Sitting in Admin queue";
            document.getElementById('table-fulfillment-text').style.color = "var(--text-muted)";
            document.getElementById('table-fulfillment-text').style.fontStyle = "italic";

            document.getElementById('stat-total').innerText = '3';
            document.getElementById('stat-pending').innerText = '1';
            document.getElementById('stat-approved').innerText = '1';

            alert('Success: Order sent over to the main office for approval.');
            document.getElementById('supplyOrderForm').reset();
            asc('order-tracking', document.querySelector('[onclick*=\'order-tracking\']'));
        }

        function triggerAdminApprovalSimulation() {
            setTimeout(() => {
                document.getElementById('queue-dot').style.display = 'none';
                document.getElementById('dd-preview').style.display = 'none';
                document.getElementById('dd-empty').style.display = 'block';

                document.getElementById('table-status-badge').className = "badge badge-approved";
                document.getElementById('table-status-badge').innerText = "Approved";

                document.getElementById('table-fulfillment-text').innerText = "On the way";
                document.getElementById('table-fulfillment-text').style.color = "var(--status-approved)";
                document.getElementById('table-fulfillment-text').style.fontStyle = "normal";

                document.getElementById('stat-pending').innerText = '0';
                document.getElementById('stat-approved').innerText = '2';

                alert('Update: Admin just approved your order! The items are now on the way.');

                // Phase 2: Simulate arrival after 3.5 seconds
                setTimeout(() => {
                    document.getElementById('table-status-badge').className = "badge badge-delivered";
                    document.getElementById('table-status-badge').innerText = "Delivered";

                    document.getElementById('table-fulfillment-text').innerText = "Arrived & Put Away";
                    document.getElementById('table-fulfillment-text').style.color = "var(--status-delivered)";

                    document.getElementById('stat-approved').innerText = '1';
                    document.getElementById('stat-delivered').innerText = '2';

                    alert('Logistics Update: The items have safely arrived at your ward.');
                }, 3500);

            }, 300);
        }

        function closeDemoBanner(){

            document.getElementById("demoBanner").style.display = "none";

}

function loadApplications() {

    const applications =
        JSON.parse(localStorage.getItem("applications")) || [];

    const tbody =
        document.getElementById("applications-table-body");

    if (!tbody) return;

    tbody.innerHTML = "";

    applications.forEach(app => {

        tbody.innerHTML += `
            <tr>
                <td><strong>APP-${app.id}</strong></td>
                <td>${app.type}</td>
                <td>${app.applicant}</td>
                <td>
                    <span class="badge badge-pending">
                        ${app.status}
                    </span>
                </td>
                <td>${app.submitted}</td>
            </tr>
        `;
    });
}

window.addEventListener("DOMContentLoaded", () => {
    loadApplications();
});