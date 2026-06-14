const API_URL = 'http://localhost:3000/profiles';


const tableBody = document.getElementById('adminTableBody');
const statsContainer = document.getElementById('statsContainer');
const editSection = document.getElementById('editSection');
const editForm = document.getElementById('editForm');


async function fetchAdminData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        renderAdminTable(data);
        calculateStats(data);
    } catch (error) {
        console.error('Error fetching admin data:', error);
    }
}

function calculateStats(profiles) {
    const total = profiles.length;
    
    
    const lossCount = profiles.filter(p => 
        parseFloat(p.currentWeight) > parseFloat(p.goalWeight)
    ).length;

    const gainCount = profiles.filter(p => 
        parseFloat(p.currentWeight) < parseFloat(p.goalWeight)
    ).length;

    
    statsContainer.innerHTML = `
        <div class="stat-box">
            <strong>Total Profiles</strong><br>
            <span style="font-size: 1.5rem;">${total}</span>
        </div>
        <div class="stat-box" style="border-bottom: 4px solid #e74c3c;">
            <strong>Weight Loss Goals</strong><br>
            <span style="font-size: 1.5rem;">${lossCount} Users</span>
        </div>
        <div class="stat-box" style="border-bottom: 4px solid #2ecc71;">
            <strong>Weight Gain Goals</strong><br>
            <span style="font-size: 1.5rem;">${gainCount} Users</span>
        </div>
    `;
}

function renderAdminTable(profiles) {
    tableBody.innerHTML = '';
    profiles.forEach(profile => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${profile.name}</td>
            <td>${profile.age}</td>
            <td>${profile.currentWeight} kg</td>
            <td>${profile.goalWeight} kg</td>
            <td>
                <button onclick="viewProfile('${profile.id}')" style="background:#3498db;">View</button>
                <button onclick="loadEditForm('${profile.id}')" style="background:#f39c12;">Edit</button>
                <button onclick="deleteProfile('${profile.id}')" style="background:#e74c3c;">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function viewProfile(id) {
    window.location.href = `plan.html?id=${id}`;
}


async function deleteProfile(id) {
    if (!confirm("Are you sure you want to delete this profile?")) return; 

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Delete failed');
        fetchAdminData(); 
    } catch (error) {
        console.error('Delete error:', error);
    }
}


async function loadEditForm(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const profile = await response.json();
        
        document.getElementById('editId').value = profile.id;
        document.getElementById('editName').value = profile.name;
        document.getElementById('editWeight').value = profile.currentWeight;
        
        editSection.style.display = 'block';
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error loading profile for edit:', error);
    }
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    
    
    const updates = {
        name: document.getElementById('editName').value,
        currentWeight: parseInt(document.getElementById('editWeight').value)
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        if (!response.ok) throw new Error('Update failed');
        
        editSection.style.display = 'none';
        fetchAdminData(); 
    } catch (error) {
        console.error('Update error:', error);
    }
});

function cancelEdit() {
    editSection.style.display = 'none';
}


fetchAdminData();