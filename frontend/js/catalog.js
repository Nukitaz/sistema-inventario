const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 1. Verificación de autenticación
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Elementos DOM
  const mainContainer = document.getElementById('main-content');
  const addProductSection = document.getElementById('add-product-section');
  const addProductForm = document.getElementById('add-product-form');
  const productsList = document.getElementById('products-list');
  const logoutBtn = document.getElementById('logout-btn');
  const roleBadge = document.getElementById('user-role-badge');
  const formAlert = document.getElementById('form-alert');

  // Mostrar el rol actual en la UI
  roleBadge.textContent = role || 'Usuario';

  // 2. Control RBAC en Frontend
  if (role === 'root' || role === 'admin') {
    addProductSection.classList.remove('hidden');
    mainContainer.classList.add('has-form');
  }

  // 3. Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        // Token inválido o expirado
        handleLogout();
        return;
      }

      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      productsList.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--danger);">Error al cargar los productos.</td></tr>`;
    }
  };

  // Renderizado dinámico de tabla
  const renderProducts = (products) => {
    productsList.innerHTML = '';

    if (!Array.isArray(products) || products.length === 0) {
      productsList.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay productos disponibles.</td></tr>`;
      return;
    }

    products.forEach((product) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product.id}</td>
        <td><strong>${escapeHTML(product.name)}</strong></td>
        <td>$${Number(product.price).toFixed(2)}</td>
        <td>${product.stock}</td>
      `;
      productsList.appendChild(tr);
    });
  };

  // 4. Lógica para Agregar Producto (Roles 'root' y 'admin')
  if (role === 'root' || role === 'admin') {
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const name = document.getElementById('product-name').value.trim();
      const price = parseFloat(document.getElementById('product-price').value);
      const stock = parseInt(document.getElementById('product-stock').value, 10);

      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, price, stock }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al guardar el producto.');
        }

        showAlert('Producto guardado exitosamente.', 'success');
        addProductForm.reset();
        fetchProducts(); // Recargar la lista de productos
      } catch (error) {
        showAlert(error.message, 'danger');
      }
    });
  }

  // 5. Cierre de Sesión
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = 'index.html';
  };

  logoutBtn.addEventListener('click', handleLogout);

  // Auxiliares
  const showAlert = (message, type) => {
    formAlert.textContent = message;
    formAlert.className = `alert alert-${type}`;
  };

  const hideAlert = () => {
    formAlert.className = 'alert hidden';
    formAlert.textContent = '';
  };

  const escapeHTML = (str) => {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  // Ejecución Inicial
  fetchProducts();
});