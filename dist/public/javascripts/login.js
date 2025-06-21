document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessageElement = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();

        errorMessageElement.textContent = '';

        if (username === '' || password === '') {
            errorMessageElement.textContent = 'Por favor, ingresa usuario y contraseña.';
            return;
        }
    });
});