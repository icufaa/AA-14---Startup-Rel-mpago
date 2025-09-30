/**
 * ===================================
 * ECOMMERCE BÁSICO - SCRIPT.JS
 * Metodología SOHDM
 * Con Sincronización en Tiempo Real
 * ===================================
 */

// ===================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ===================================
const AppState = {
    cart: {
        items: [],
        count: 0
    },
    team: [
        { id: 1, name: "Sedoff Gaspar Sedoff", role: "Frontend Developer", email: "GasparSedoff@grupog.com", avatar: "SG" },
        { id: 2, name: "Escallier Alejandro", role: "Frontend Developer", email: "EscallierAlejandro@grupog.com", avatar: "EA" },
        { id: 3, name: "Vera Lautaro", role: "Backend Developer", email: "lautaroVera@grupog.com", avatar: "VL" },
        { id: 4, name: "Monzón Sebastían", role: "Backend Developer", email: "Msebastian@grupog.com", avatar: "MS" },
        { id: 5, name: "Barreyro Luciano", role: "Backend Developer", email: "Lucheti@grupog.com", avatar: "BL" },
        { id: 6, name: "Meyer Iván", role: "UI/UX Designer", email: "MeyerIvan@grupog.com", avatar: "MI" },
        { id: 7, name: "Viñales Facundo", role: "Project Manager", email: "vinalesFacundo@grupog.com", avatar: "VF" },
        
    ],
    products: {},
    syncCount: 0,
    lastUpdate: new Date()
};

// ===================================
// SISTEMA DE SINCRONIZACIÓN CONCURRENTE
// Implementación de algoritmos para tiempo real
// ===================================
class SyncManager {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.observers = [];
        this.syncInterval = null;
    }

    /**
     * Algoritmo de Cola de Prioridad para operaciones concurrentes
     * Permite gestionar múltiples actualizaciones simultáneas
     */
    async addToQueue(operation, priority = 1) {
        const task = {
            id: Date.now() + Math.random(),
            operation,
            priority,
            timestamp: new Date()
        };

        // Insertar en la cola según prioridad (mayor prioridad primero)
        let inserted = false;
        for (let i = 0; i < this.queue.length; i++) {
            if (this.queue[i].priority < priority) {
                this.queue.splice(i, 0, task);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            this.queue.push(task);
        }

        this.logEvent('sync', `Operación agregada a cola (Prioridad: ${priority})`);
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    /**
     * Procesamiento concurrente de la cola
     * Simula procesamiento asíncrono de múltiples operaciones
     */
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        this.updateSyncStatus('syncing');

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            
            try {
                await this.executeTask(task);
                await this.simulateNetworkDelay();
            } catch (error) {
                console.error('Error procesando tarea:', error);
            }
        }

        this.isProcessing = false;
        this.updateSyncStatus('synced');
        AppState.syncCount++;
        this.updateSyncCounter();
    }

    /**
     * Ejecuta una tarea individual
     */
    async executeTask(task) {
        return new Promise((resolve) => {
            setTimeout(() => {
                task.operation();
                this.notifyObservers(task);
                resolve();
            }, 100);
        });
    }

    /**
     * Simula latencia de red para hacer visible el proceso
     */
    async simulateNetworkDelay() {
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    /**
     * Patrón Observer para notificar cambios
     */
    subscribe(observer) {
        this.observers.push(observer);
    }

    notifyObservers(data) {
        this.observers.forEach(observer => observer(data));
    }

    /**
     * Actualiza el estado visual de sincronización
     */
    updateSyncStatus(status) {
        const syncStatus = document.getElementById('syncStatus');
        const syncText = document.getElementById('syncText');
        
        if (status === 'syncing') {
            syncStatus.classList.remove('synced');
            syncStatus.classList.add('syncing');
            syncText.textContent = 'Sincronizando...';
        } else {
            syncStatus.classList.remove('syncing');
            syncStatus.classList.add('synced');
            syncText.textContent = 'Sincronizado';
        }
    }

    updateSyncCounter() {
        document.getElementById('syncCount').textContent = AppState.syncCount;
    }

    /**
     * Sistema de logging en tiempo real
     */
    logEvent(type, message) {
        const log = document.getElementById('realtimeLog');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}-update`;
        
        const time = new Date().toLocaleTimeString();
        entry.textContent = `[${time}] ${message}`;
        
        log.insertBefore(entry, log.firstChild);
        
        // Limitar a 10 entradas
        while (log.children.length > 10) {
            log.removeChild(log.lastChild);
        }
    }

    /**
     * Inicia sincronización automática periódica
     * Simula actualizaciones de stock en tiempo real
     */
    startAutoSync(interval = 10000) {
        this.syncInterval = setInterval(() => {
            this.simulateStockUpdate();
        }, interval);
    }

    /**
     * Simula actualización de stock de forma aleatoria
     */
    simulateStockUpdate() {
        const productCards = document.querySelectorAll('.product-card');
        const randomCard = productCards[Math.floor(Math.random() * productCards.length)];
        const stockElement = randomCard.querySelector('.stock-count');
        
        if (stockElement) {
            const currentStock = parseInt(stockElement.dataset.stock);
            const change = Math.floor(Math.random() * 5) - 2; // -2 a +2
            const newStock = Math.max(0, currentStock + change);
            
            this.addToQueue(() => {
                stockElement.dataset.stock = newStock;
                stockElement.textContent = newStock;
                
                const productName = randomCard.querySelector('.product-title').textContent;
                this.logEvent('stock', `${productName}: Stock actualizado a ${newStock} unidades`);
                
                // Actualizar estado del producto
                if (newStock === 0) {
                    randomCard.classList.add('out-of-stock');
                    const btn = randomCard.querySelector('.add-to-cart');
                    btn.disabled = true;
                    btn.textContent = 'Agotado';
                } else {
                    randomCard.classList.remove('out-of-stock');
                    const btn = randomCard.querySelector('.add-to-cart');
                    btn.disabled = false;
                    btn.textContent = 'Agregar';
                }
            }, 2);
        }
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }
}

// Instancia global del gestor de sincronización
const syncManager = new SyncManager();

// ===================================
// INICIALIZACIÓN
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    initFilters();
    initCart();
    initTeamSection();
    initStockTracking();
    
    // Iniciar sincronización automática
    syncManager.startAutoSync(15000); // Cada 15 segundos
    
    syncManager.logEvent('sync', 'Sistema inicializado correctamente');
});

function initApp() {
    renderTeam();
    updateLastUpdate();
    updateSyncCounter();
}

function updateLastUpdate() {
    const lastUpdateEl = document.getElementById('lastUpdate');
    const now = new Date();
    lastUpdateEl.textContent = now.toLocaleString('es-AR');
}

function updateSyncCounter() {
    document.getElementById('syncCount').textContent = AppState.syncCount;
}

// ===================================
// GESTIÓN DEL EQUIPO
// ===================================
function initTeamSection() {
    const editBtn = document.getElementById('editTeamBtn');
    const modal = document.getElementById('teamModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelEdit');
    const saveBtn = document.getElementById('saveTeam');

    editBtn.addEventListener('click', () => openTeamModal());
    closeBtn.addEventListener('click', () => closeTeamModal());
    cancelBtn.addEventListener('click', () => closeTeamModal());
    saveBtn.addEventListener('click', () => saveTeamChanges());
}

function renderTeam() {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';

    AppState.team.forEach(member => {
        const memberCard = createTeamMemberCard(member);
        teamGrid.appendChild(memberCard);
    });
}

function createTeamMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'team-member';
    card.dataset.id = member.id;
    
    card.innerHTML = `
        <div class="team-member-header">
            <div class="member-avatar">${member.avatar}</div>
            <div class="member-info">
                <h4>${member.name}</h4>
                <div class="member-role">${member.role}</div>
            </div>
        </div>
        <div class="member-email">${member.email}</div>
    `;
    
    return card;
}

function openTeamModal() {
    const modal = document.getElementById('teamModal');
    const form = document.getElementById('teamForm');
    
    form.innerHTML = '';
    
    AppState.team.forEach((member, index) => {
        form.innerHTML += `
            <div class="form-group">
                <label>Nombre del Miembro ${index + 1}</label>
                <input type="text" id="name-${member.id}" value="${member.name}" required>
            </div>
            <div class="form-group">
                <label>Rol</label>
                <input type="text" id="role-${member.id}" value="${member.role}" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="email-${member.id}" value="${member.email}" required>
            </div>
            <hr style="margin: 1.5rem 0; border: 1px solid var(--border);">
        `;
    });
    
    modal.classList.add('active');
}

function closeTeamModal() {
    const modal = document.getElementById('teamModal');
    modal.classList.remove('active');
}

function saveTeamChanges() {
    syncManager.addToQueue(() => {
        AppState.team.forEach(member => {
            const nameInput = document.getElementById(`name-${member.id}`);
            const roleInput = document.getElementById(`role-${member.id}`);
            const emailInput = document.getElementById(`email-${member.id}`);
            
            if (nameInput && roleInput && emailInput) {
                member.name = nameInput.value;
                member.role = roleInput.value;
                member.email = emailInput.value;
                
                // Actualizar avatar con iniciales
                const names = member.name.split(' ');
                member.avatar = names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
            }
        });
        
        renderTeam();
        AppState.lastUpdate = new Date();
        updateLastUpdate();
        closeTeamModal();
        
        syncManager.logEvent('team', 'Datos del equipo actualizados');
        showNotification('✅ Equipo actualizado correctamente');
    }, 3);
}

// ===================================
// SISTEMA DE FILTROS
// ===================================
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

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        
        if (category === 'all' || productCategory === category) {
            product.style.display = 'flex';
            product.style.animation = 'fadeIn 0.5s ease';
        } else {
            product.style.display = 'none';
        }
    });
}

function updateActiveFilter(activeButton) {
    const allButtons = document.querySelectorAll('.filter-btn');
    
    allButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    activeButton.classList.add('active');
}

// ===================================
// SISTEMA DE CARRITO
// ===================================
function initCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.getElementById('cartIcon');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                const productName = this.dataset.product;
                const productId = this.dataset.id;
                addToCart(productName, productId);
            }
        });
    });
    
    cartIcon.addEventListener('click', function() {
        showCartSummary();
    });
}

function addToCart(productName, productId) {
    syncManager.addToQueue(() => {
        AppState.cart.count++;
        AppState.cart.items.push({ name: productName, id: productId });
        
        updateCartDisplay();
        animateCartIcon();
        updateStockOnPurchase(productId);
        
        syncManager.logEvent('cart', `"${productName}" agregado al carrito`);
        showNotification(`"${productName}" agregado al carrito`);
    }, 2);
}

function updateStockOnPurchase(productId) {
    const product = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (product) {
        const stockElement = product.querySelector('.stock-count');
        const currentStock = parseInt(stockElement.dataset.stock);
        
        if (currentStock > 0) {
            const newStock = currentStock - 1;
            stockElement.dataset.stock = newStock;
            stockElement.textContent = newStock;
            
            if (newStock === 0) {
                product.classList.add('out-of-stock');
                const btn = product.querySelector('.add-to-cart');
                btn.disabled = true;
                btn.textContent = 'Agotado';
            }
        }
    }
}

function updateCartDisplay() {
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.textContent = `🛒 Carrito (${AppState.cart.count})`;
}

function animateCartIcon() {
    const cartIcon = document.getElementById('cartIcon');
    
    cartIcon.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

function showCartSummary() {
    if (AppState.cart.count === 0) {
        alert('El carrito está vacío\n\n¡Agrega algunos productos!');
    } else {
        const items = AppState.cart.items.map(item => `- ${item.name}`).join('\n');
        alert(`🛒 Resumen del Carrito\n\nProductos: ${AppState.cart.count}\n\n${items}\n\n✨ Funcionalidad de pago próximamente...`);
    }
}

// ===================================
// TRACKING DE STOCK
// ===================================
function initStockTracking() {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productId = product.dataset.id;
        const stockElement = product.querySelector('.stock-count');
        
        if (stockElement) {
            AppState.products[productId] = {
                stock: parseInt(stockElement.dataset.stock),
                name: product.querySelector('.product-title').textContent
            };
        }
    });
}

// ===================================
// SISTEMA DE NOTIFICACIONES
// ===================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===================================
// ANIMACIONES CSS DINÁMICAS
// ===================================
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

// ===================================
// DEBUGGING Y CONSOLE
// ===================================
console.log('%c🛍️ TechShop Ecommerce', 'font-size: 20px; color: #2563eb; font-weight: bold;');
console.log('%cSistema cargado correctamente', 'color: #10b981;');
console.log('📊 Estado inicial:', AppState);
console.log('🔄 Sistema de sincronización activo');
console.log('⚡ Algoritmos concurrentes implementados');