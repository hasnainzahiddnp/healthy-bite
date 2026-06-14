const API_URL = 'http://localhost:3000/profiles';

const mealDatabase = {
    pakistani: {
        loss: {
            breakfast: "Oatmeal with almonds and low-fat milk",
            lunch: "Grilled Chicken Tikka with fresh salad and raita",
            dinner: "Daal (lentils) with one small whole-wheat roti",
            snacks: "Green tea and one apple"
        },
        gain: {
            breakfast: "Scrambled eggs with paratha and yogurt",
            lunch: "Chicken Biryani with raita",
            dinner: "Chicken Karahi with two rotis",
            snacks: "Handful of almonds and walnuts"
        }
    },
    continental: {
        loss: {
            breakfast: "Greek yogurt with berries",
            lunch: "Grilled fish with steamed vegetables",
            dinner: "Vegetable soup and grilled chicken breast",
            snacks: "Carrot sticks with hummus"
        },
        gain: {
            breakfast: "Pancakes with honey and banana",
            lunch: "Pasta with creamy white sauce and chicken",
            dinner: "Steak with mashed potatoes and peas",
            snacks: "Peanut butter on toast"
        }
    },
    asian: {
        loss: {
            breakfast: "Clear vegetable broth with tofu",
            lunch: "Steamed bok choy with brown rice and grilled chicken",
            dinner: "Stir-fry vegetables with minimal oil",
            snacks: "Slice of dragon fruit"
        },
        gain: {
            breakfast: "Fried rice with egg and chicken",
            lunch: "Beef stir-fry with noodles",
            dinner: "Tempura chicken with steamed rice",
            snacks: "Edamame or peanuts"
        }
    }
};

function generateMealPlan(profile) {
    const cuisinePlan = mealDatabase[profile.cuisine] || mealDatabase.pakistani;
    const planType = (parseFloat(profile.currentWeight) > parseFloat(profile.goalWeight)) ? "loss" : "gain";
    return cuisinePlan[planType];
}


const profileList = document.getElementById('profileList');
const loadingIndicator = document.getElementById('loading');
const errorIndicator = document.getElementById('error');
const planTitle = document.getElementById('planTitle');

async function fetchProfiles() {
    try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        loadingIndicator.style.display = 'block';
        errorIndicator.style.display = 'none';
        profileList.innerHTML = '';

        
        const urlParams = new URLSearchParams(window.location.search);
        const profileId = urlParams.get('id');

        let url = API_URL;
        if (profileId && currentUser.role === 'admin') {
            url = `${API_URL}/${profileId}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        
        let data = await response.json();

        
        if (!Array.isArray(data)) {
            data = [data]; 
        }

        
        if (currentUser.role !== 'admin') {
            data = data.filter(profile => profile.name.toLowerCase() === currentUser.name.toLowerCase());
            planTitle.textContent = "Your Personal Meal Plan";
        } else if (profileId) {
            planTitle.textContent = `Viewing ${data[0].name}'s Plan`;
        } else {
            planTitle.textContent = "All User Meal Plans (Admin View)";
        }

        renderList(data);
    } catch (error) {
        console.error('Fetch error:', error);
        errorIndicator.style.display = 'block';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function renderList(profiles) {
    profileList.innerHTML = ''; 
    
    if (profiles.length === 0) {
        profileList.innerHTML = '<p>No matching user plans found.</p>';
        return;
    }

    profiles.forEach(profile => {
        const plan = generateMealPlan(profile); 
        
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h4>${profile.name}'s Daily Plan</h4>
            <p><strong>Target Goal:</strong> Change from ${profile.currentWeight} kg to ${profile.goalWeight} kg</p>
            <p><strong>Cuisine Style:</strong> ${profile.cuisine.toUpperCase()}</p>
            <ul>
                <li><strong>Breakfast:</strong> ${plan.breakfast}</li>
                <li><strong>Lunch:</strong> ${plan.lunch}</li>
                <li><strong>Dinner:</strong> ${plan.dinner}</li>
                <li><strong>Snacks:</strong> ${plan.snacks}</li>
            </ul>
        `;
        profileList.appendChild(div);
    });
}


fetchProfiles();