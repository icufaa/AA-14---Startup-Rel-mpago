/**
 * ===================================
 * ECOMMERCE BÁSICO - SCRIPT.JS
 * Metodología SOHDM
 * ===================================
 */

// Estado de la aplicación
let cartCount = 0;

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initCart();
});

/**
 * ===================================
 * SISTEMA DE FILTROS
 * ===================================
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProducts(filter);
            updateActiveFilter(this);
        });
    });
}

/**
 * Filtra productos por categoría
 * @param {string} category - Categoría a filtrar
 */
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'flex';
            // Animación de entrada
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

/**
 * Actualiza el botón de filtro activo
 * @param {HTMLElement} activeButton - Botón que fue clickeado
 */
function updateActiveFilter(activeButton) {
    const allButtons = document.querySelectorAll('.filter-btn');
    
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    activeButton.classList.add('active');
}

/**
 * ===================================
 * SISTEMA DE CARRITO
 * ===================================
 */
function initCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.getElementById('cartIcon');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                const productName = this.dataset.product;
                addToCart(productName);
            }
        });
    });
    
    // Click en el ícono del carrito
    cartIcon.addEventListener('click', function() {
        showCartSummary();
    });
}

/**
 * Agrega un producto al carrito
 * @param {string} productName - Nombre del producto
 */
function addToCart(productName) {
    cartCount++;
    updateCartDisplay();
    animateCartIcon();
    showNotification(`"${productName}" agregado al carrito`);
}

/**
 * Actualiza la visualización del carrito
 */
function updateCartDisplay() {
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.textContent = `🛒 Carrito (${cartCount})`;
}

/**
 * Anima el ícono del carrito
 */
function animateCartIcon() {
    const cartIcon = document.getElementById('cartIcon');
    
    cartIcon.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Muestra un resumen del carrito
 */
function showCartSummary() {
    if (cartCount === 0) {
        alert('El carrito está vacío\n\n¡Agrega algunos productos!');
    } else {
        alert(`🛒 Resumen del Carrito\n\nProductos en el carrito: ${cartCount}\n\n✨ Funcionalidad de carrito completo próximamente...`);
    }
}

/**
 * ===================================
 * SISTEMA DE NOTIFICACIONES
 * ===================================
 */
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos inline (alternativamente se pueden agregar al CSS)
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * ===================================
 * UTILIDADES
 * ===================================
 */

/**
 * Formatea precio a formato de moneda
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

/**
 * Obtiene todos los productos visibles
 * @returns {Array} Array de elementos de producto
 */
function getVisibleProducts() {
    const products = document.querySelectorAll('.product-card');
    return Array.from(products).filter(product => {
        return product.style.display !== 'none';
    });
}

/**
 * Cuenta productos por categoría
 * @returns {Object} Objeto con conteo por categoría
 */
function countProductsByCategory() {
    const products = document.querySelectorAll('.product-card');
    const counts = {};
    
    products.forEach(product => {
        const category = product.dataset.category;
        counts[category] = (counts[category] || 0) + 1;
    });
    
    return counts;
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


console.log('🛍️ TechShop Ecommerce cargado correctamente');
console.log('📊 Productos por categoría:', countProductsByCategory());