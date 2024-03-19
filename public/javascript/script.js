(() => {
    'use strict';

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
})();

function togglePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var eyeToggle = document.getElementById('eye-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeToggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        eyeToggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
    }
}

// Get references to the buttons and the side panel
const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const sidePanel = document.getElementById("sidePanel");

// Function to open the side panel
function openSidePanel() {
  sidePanel.classList.add("open");
}

// Function to close the side panel
function closeSidePanel() {
  sidePanel.classList.remove("open");
}

// Add event listeners to the buttons
openBtn.addEventListener("click", openSidePanel);
closeBtn.addEventListener("click", closeSidePanel);

// Function to open the popup
function openPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
  }
  
  // Function to close the popup
  function closePopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
  }
  
  // Event listener to open the popup when the button is clicked
  document.getElementById("openButton").addEventListener("click", openPopup);
  

  