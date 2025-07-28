let isLogin = true;
const users = {};
const backToLoginBtn = document.getElementById("backToLoginBtn"); // Get the button element
const customAlert = document.getElementById("custom-alert");
const alertMessage = document.getElementById("alert-message");
const alertIcon = document.getElementById("alert-icon");

// Get the password input and the toggle icon elements
const passwordInput = document.getElementById("password");
const passwordToggleIcon = document.getElementById("password-toggle-icon");

// Add an event listener to the eye icon
passwordToggleIcon.addEventListener("click", function() {
    // Check the current type of the password input
    if (passwordInput.type === "password") {
        passwordInput.type = "text"; // Change to text to show password
        passwordToggleIcon.textContent = "visibility"; // Change icon to open eye (visible)
    } else {
        passwordInput.type = "password"; // Change back to password to hide
        passwordToggleIcon.textContent = "visibility_off"; // Change icon to crossed-out eye (not visible)
    }
});


// Initially hide the button when the script loads
backToLoginBtn.style.display = 'none';

function toggleForm() {
    const title = document.getElementById("form-title");
    const form = document.getElementById("auth-form");
    const switchText = document.getElementById("switch");

    isLogin = !isLogin;

    title.textContent = isLogin ? "Login" : "Register";
    form.querySelector("button").textContent = isLogin ? "Login" : "Register";
    switchText.innerHTML = isLogin
        ? `Don’t have an account? <a href="#" onclick="toggleForm()">Register</a>`
        : `Already have an account? <a href="#" onclick="toggleForm()">Login</a>`;

    // Ensure the button is hidden when switching between Login/Register forms
    backToLoginBtn.style.display = 'none';
}

// Function to show custom alert
function showCustomAlert(message, type = 'success') {
    alertMessage.textContent = message;
    customAlert.classList.remove('success', 'error'); // Remove previous types
    alertIcon.classList.remove('success', 'error'); // Remove previous icon types

    customAlert.classList.add(type);
    alertIcon.classList.add(type);

    customAlert.classList.add('show');

    // Hide the alert after 3 seconds
    setTimeout(() => {
        customAlert.classList.remove('show');
    }, 3000);
}


// New function to return to the login page
function returnToLoginPage() {
    const authBox = document.getElementById("auth-box");
    const welcomeMessageDiv = document.getElementById("welcome-message");
    const mainBgImg = document.getElementById("main-bg-img");

    authBox.classList.remove("hidden"); // Show the login form
    welcomeMessageDiv.classList.add("hidden"); // Hide the welcome message
    mainBgImg.style.filter = "brightness(0.4)"; // Revert background image filter to default
    welcomeMessageDiv.querySelector(".animated-text").innerHTML = ''; // Clear welcome message content

    // Hide the "Go Back to Login" button when returning to the login page
    backToLoginBtn.style.display = 'none';

    // Update history state to 'login'
    history.pushState({ page: 'login' }, 'Login', '#login');
}

document.getElementById("auth-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const authBox = document.getElementById("auth-box");
    const welcomeMessageDiv = document.getElementById("welcome-message");
    const mainBgImg = document.getElementById("main-bg-img");

    if (isLogin) {
        if (users[username] && users[username] === password) {
            showCustomAlert("Login Successful!", "success"); // Use custom alert
            authBox.classList.add("hidden"); // Hide the form
            welcomeMessageDiv.classList.remove("hidden"); // Show the welcome message
            mainBgImg.style.filter = "brightness(0.7)"; // Make the image brighter after login

            // Show the "Go Back to Login" button after successful login
            backToLoginBtn.style.display = 'block';

            // Animate individual letters
            const welcomeText = `Welcome, ${username}!`;
            const animatedTextElement = welcomeMessageDiv.querySelector(".animated-text");
            animatedTextElement.innerHTML = ''; // Clear previous content

            for (let i = 0; i < welcomeText.length; i++) {
                const span = document.createElement('span');
                span.textContent = welcomeText[i];
                span.style.animationDelay = `${i * 0.05}s`; // Stagger animation
                animatedTextElement.appendChild(span);
            }

            // Push a new state to the history object
            history.pushState({ page: 'welcome' }, 'Welcome', '#welcome');

        } else {
            showCustomAlert("Invalid credentials", "error"); // Use custom alert for errors
        }
    } else {
        if (users[username]) {
            showCustomAlert("User already exists!", "error"); // Use custom alert for errors
        } else {
            users[username] = password;
            showCustomAlert("Registration successful! Please log in.", "success"); // Use custom alert
            toggleForm();
            // The button remains hidden after registration and toggling to login form
        }
    }
});

// Listen for popstate event (e.g., when back button is pressed)
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page === 'login') {
        returnToLoginPage(); // Go back to login if the state is 'login'
    } else if (event.state && event.state.page === 'welcome') {
        // If we're navigating back to a 'welcome' state, ensure welcome is shown and button is visible
        const authBox = document.getElementById("auth-box");
        const welcomeMessageDiv = document.getElementById("welcome-message");
        const mainBgImg = document.getElementById("main-bg-img");

        authBox.classList.add("hidden");
        welcomeMessageDiv.classList.remove("hidden");
        mainBgImg.style.filter = "brightness(0.7)";
        backToLoginBtn.style.display = 'block'; // Ensure button is visible
    } else {
        // Default to login page if no specific state or unknown state
        returnToLoginPage();
    }
});

// Optionally, add an initial history state for the login page
// so the back button has somewhere to go before login.
history.replaceState({ page: 'login' }, 'Login', '#login');