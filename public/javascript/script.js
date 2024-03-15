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

$(document).ready(function () {
    setTimeout(function () {
      $("#successAlert").alert('close');
    }, 5000);
  });
