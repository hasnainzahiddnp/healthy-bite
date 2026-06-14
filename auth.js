const USERS_API = "http://localhost:3000/users";


const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    let isValid = true;
    if (!name) {
      document.getElementById("nameError").style.display = "block";
      isValid = false;
    } else {
      document.getElementById("nameError").style.display = "none";
    }

    if (!email || !email.includes("@")) {
      document.getElementById("emailError").style.display = "block";
      isValid = false;
    } else {
      document.getElementById("emailError").style.display = "none";
    }

    if (password.length < 6) {
      document.getElementById("passwordError").style.display = "block";
      isValid = false;
    } else {
      document.getElementById("passwordError").style.display = "none";
    }

    if (!isValid) return;

    try {
      
      const checkRes = await fetch(`${USERS_API}?email=${email}`);
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        alert("User with this email already exists!");
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: "user", 
      };

      const response = await fetch(USERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert("Account created successfully! Please login.");
        window.location.href = "login.html";
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  });
}


const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(
        `${USERS_API}?email=${email}&password=${password}`,
      );
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem("currentUser", JSON.stringify(user));

        alert(`Welcome back, ${user.name}!`);

        if (user.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "index.html";
        }
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  });
}


function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const nav = document.querySelector("nav");

  if (currentUser) {
    
    const authLinks = nav.querySelectorAll(
      'a[href="login.html"], a[href="signup.html"]',
    );
    authLinks.forEach((link) => link.remove());

    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.id = "logoutBtn";
    logoutBtn.textContent = `Logout (${currentUser.name})`;
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "login.html";
    };
    nav.appendChild(logoutBtn);

    
    if (
      window.location.pathname.includes("admin.html") &&
      currentUser.role !== "admin"
    ) {
      alert("Access denied. Admin only.");
      window.location.href = "index.html";
    }
  } else {
    
    if (
      window.location.pathname.includes("admin.html") ||
      window.location.pathname.includes("plan.html") ||
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/")
    ) {
      alert("Please login to access this page.");
      window.location.href = "login.html";
    }
  }
}


document.addEventListener("DOMContentLoaded", checkAuth);
