const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorContainer = document.getElementById('error-message');

  // Redirigir si ya existe token activo
  if (localStorage.getItem('token')) {
    window.location.href = 'catalog.html';
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Resetear visualización de errores
    errorContainer.classList.add('hidden');
    errorContainer.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al autenticar.');
      }

      // Almacenar credenciales en el almacenamiento local
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('username', data.user.username);

      // Redirigir al panel principal
      window.location.href = 'catalog.html';

    } catch (error) {
      errorContainer.textContent = error.message;
      errorContainer.classList.remove('hidden');
    }
  });
});