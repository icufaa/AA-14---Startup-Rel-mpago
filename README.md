# 🛍️ TechShop - Ecommerce Básico con CSS Grid

## 📋 Descripción del Proyecto

Catálogo de productos implementado con **CSS Grid** y componentes reutilizables, desplegado en **GitHub Pages**. Incluye sistema de sincronización en tiempo real con algoritmos concurrentes.

---

## 🎯 Metodología SOHDM - Justificación

### ¿Qué es SOHDM?

SOHDM es un acrónimo que representa los principios fundamentales del desarrollo web moderno:

### **S - Semántico**
✅ **Implementación:**
- Uso de HTML5 semántico: `<header>`, `<nav>`, `<article>`, `<section>`, `<footer>`
- Estructura clara y accesible
- Data attributes para identificación (`data-category`, `data-id`, `data-filter`)

**Justificación:** El código semántico mejora la accesibilidad, el SEO y la mantenibilidad del proyecto.

### **O - Organizado**
✅ **Implementación:**
- Separación de responsabilidades: HTML, CSS y JS en archivos independientes
- CSS con variables custom (`:root`)
- Código comentado por secciones
- Nomenclatura consistente (BEM-like)

**Justificación:** La organización facilita el trabajo en equipo y la escalabilidad del proyecto.

### **H - Heurístico**
✅ **Implementación:**
- UX intuitiva con feedback visual inmediato
- Animaciones y transiciones suaves
- Estados visuales claros (hover, active, disabled)
- Notificaciones en tiempo real

**Justificación:** Una interfaz heurística reduce la curva de aprendizaje y mejora la satisfacción del usuario.

### **D - Documentado**
✅ **Implementación:**
- Comentarios JSDoc en funciones JavaScript
- README completo con instrucciones
- Código autodocumentado con nombres descriptivos
- Logs en consola para debugging

**Justificación:** La documentación es esencial para mantener y escalar el proyecto a largo plazo.

### **M - Mantenible**
✅ **Implementación:**
- Componentes reutilizables (Product Card, Team Member)
- Funciones modulares y de responsabilidad única
- Estado centralizado en `AppState`
- Sistema de sincronización desacoplado

**Justificación:** El código mantenible reduce costos de desarrollo futuro y facilita la corrección de bugs.

---

## 🔄 Algoritmos Concurrentes - Sincronización en Tiempo Real

### 1. **Cola de Prioridad (Priority Queue)**

```javascript
async addToQueue(operation, priority = 1) {
    // Inserción ordenada por prioridad
    // Mayor prioridad = se ejecuta primero
}
```

**Justificación:** 
- Permite gestionar múltiples operaciones simultáneas
- Las operaciones críticas (ej: actualización de equipo) tienen mayor prioridad que las decorativas
- Simula comportamiento de sistemas reales con múltiples usuarios

### 2. **Patrón Observer**

```javascript
subscribe(observer) {
    this.observers.push(observer);
}

notifyObservers(data) {
    this.observers.forEach(observer => observer(data));
}
```

**Justificación:**
- Permite la comunicación desacoplada entre componentes
- Facilita la actualización reactiva de la UI
- Implementa el principio de bajo acoplamiento

### 3. **Procesamiento Asíncrono**

```javascript
async processQueue() {
    while (this.queue.length > 0) {
        const task = this.queue.shift();
        await this.executeTask(task);
        await this.simulateNetworkDelay();
    }
}
```

**Justificación:**
- Simula latencia de red realista
- Permite visualizar el proceso de sincronización
- Evita bloqueo de la interfaz de usuario

### 4. **Sincronización Automática Periódica**

```javascript
startAutoSync(interval = 10000) {
    this.syncInterval = setInterval(() => {
        this.simulateStockUpdate();
    }, interval);
}
```

**Justificación:**
- Simula un sistema real con múltiples usuarios
- Actualiza stock de forma automática
- Demuestra capacidad de gestión de estados en tiempo real

---

## 🎨 Características Técnicas

### CSS Grid Responsivo

```css
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}
```

**Ventajas:**
- Adaptación automática al viewport
- No requiere media queries para el grid básico
- Distribución inteligente del espacio

### Componentes Reutilizables

#### Product Card
- Estructura modular
- Estados visuales: `featured`, `sale`, `new`, `out-of-stock`
- Reutilizable para cualquier producto

#### Team Member Card
- Datos editables en tiempo real
- Avatar generado automáticamente
- Información actualizable vía modal

---

## 👥 Sección de Datos del Equipo

### Características:
- ✏️ **Edición en tiempo real** mediante modal
- 🔄 **Sincronización automática** de cambios
- 📊 **Tracking de actualizaciones** con timestamp
- 💾 **Persistencia en memoria** durante la sesión

### Flujo de Actualización:
1. Usuario hace clic en "Editar Equipo"
2. Se abre modal con formulario
3. Cambios se agregan a la cola de sincronización
4. Sistema procesa cambios con prioridad alta
5. UI se actualiza reactivamente
6. Se registra el evento en el log

---

## 🚀 Uso Creativo de JavaScript

### 1. **Sistema de Estado Centralizado**
```javascript
const AppState = {
    cart: { items: [], count: 0 },
    team: [...],
    products: {},
    syncCount: 0
}
```

### 2. **Generación Dinámica de UI**
- Cards de productos y equipo generadas dinámicamente
- Modal construido programáticamente
- Logs en tiempo real

### 3. **Gestión Avanzada de Eventos**
- Event delegation para performance
- Listeners dinámicos
- Animaciones sincronizadas

### 4. **Algoritmos de Sincronización**
- Cola de prioridad personalizada
- Patrón Observer implementado desde cero
- Sistema de logging en tiempo real

---

## 📦 Estructura del Proyecto

```
ecommerce-basico/
├── index.html          # Estructura HTML con secciones actualizables
├── styles.css          # Estilos con CSS Grid y variables
├── script.js           # Lógica con algoritmos concurrentes
└── README.md           # Esta documentación
```

---

## 🌐 Despliegue en GitHub Pages

### Pasos:

1. **Crear repositorio en GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/icufaa/ecommerce-basico.git
   git push -u origin main
   ```

2. **Activar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from branch
   - Branch: main → / (root)
   - Save

3. **Acceder al sitio**
   - URL: `https://icufaa.github.io/AA-14---Startup-Rel-mpago`

---

## ✨ Funcionalidades Implementadas

### 🛒 Sistema de Carrito
- Agregar productos
- Contador en tiempo real
- Actualización de stock automática
- Notificaciones visuales

### 👥 Gestión de Equipo
- Visualización de miembros
- Edición mediante modal
- Avatar generado automáticamente
- Sincronización de cambios

### 🔄 Sincronización en Tiempo Real
- Cola de prioridad para operaciones
- Procesamiento asíncrono
- Log de eventos visible
- Contador de sinc
