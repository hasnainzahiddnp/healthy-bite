const API_URL = 'http://localhost:3000/profiles';
const profileForm = document.getElementById('profileForm');
const errorIndicator = document.getElementById('profileForm'); 

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = ['name', 'age', 'height', 'currentWeight', 'goalWeight', 'cuisine'];
    let isValid = true;
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        const errorSpan = document.getElementById(`${field}Error`);
        if (!input.value.trim()) {
            errorSpan.style.display = 'block';
            isValid = false;
        } else {
            errorSpan.style.display = 'none';
        }
    });

    if (!isValid) return;

    
    const newProfile = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        height: parseFloat(document.getElementById('height').value),
        currentWeight: parseFloat(document.getElementById('currentWeight').value),
        goalWeight: parseFloat(document.getElementById('goalWeight').value),
        cuisine: document.getElementById('cuisine').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfile)
        });

        if (!response.ok) throw new Error('Failed to post data');

        profileForm.reset();
        
        
        window.location.href = 'plan.html'; 
    } catch (error) {
        console.error('Post error:', error);
    }
});