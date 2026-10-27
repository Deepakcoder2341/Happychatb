document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = passwordInput.value;

        if (username && password) {
            
            window.location.href = 'index.html';
        } else {
            alert('enter the password again');
        }
    });
});