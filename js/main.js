document.addEventListener('DOMContentLoaded', () => {
    const productos = [
        { id: 1, nombre: 'Laptop Gamer Razer', precio: 2500, categoria: 'laptops', stock: 8 },
        { id: 2, nombre: 'MacBook Pro M2', precio: 2999, categoria: 'laptops', stock: 5 },
        { id: 3, nombre: 'Dell XPS 15', precio: 1899, categoria: 'laptops', stock: 7 },
        { id: 4, nombre: 'ASUS ROG Zephyrus', precio: 2100, categoria: 'laptops', stock: 6 },
        { id: 5, nombre: 'HP Spectre x360', precio: 1450, categoria: 'laptops', stock: 10 },
        { id: 6, nombre: 'iPhone 15 Pro', precio: 1299, categoria: 'smartphones', stock: 15 },
        { id: 7, nombre: 'Samsung Galaxy S25 Ultra', precio: 1199, categoria: 'smartphones', stock: 12 },
        { id: 8, nombre: 'Google Pixel 8 Pro', precio: 999, categoria: 'smartphones', stock: 9 },
        { id: 9, nombre: 'Xiaomi Redmi Note 12', precio: 299, categoria: 'smartphones', stock: 20 },
        { id: 10, nombre: 'OnePlus 11 5G', precio: 699, categoria: 'smartphones', stock: 8 },
        { id: 11, nombre: 'Teclado Mecánico RGB', precio: 150, categoria: 'accesorios', stock: 25 },
        { id: 12, nombre: 'Mouse Logitech', precio: 80, categoria: 'accesorios', stock: 30 },
        { id: 13, nombre: 'Monitor 32" 4K', precio: 450, categoria: 'accesorios', stock: 10 },
        { id: 14, nombre: 'Disco SSD 1TB', precio: 120, categoria: 'accesorios', stock: 18 },
        { id: 15, nombre: 'Webcam 4K', precio: 200, categoria: 'accesorios', stock: 15 }
    ];

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const elementosDOM = {
        productList: document.getElementById('productList'),
        cartItems: document.getElementById('cartItems'),
        searchInput: document.getElementById('searchInput'),
        categoryFilter: document.getElementById('categoryFilter'),
        totalAmount: document.getElementById('totalAmount'),
        statusMessage: document.getElementById('statusMessage')
    };

    // Eventos
    elementosDOM.searchInput.addEventListener('input', filtrarProductos);
    elementosDOM.categoryFilter.addEventListener('change', filtrarProductos);
    document.getElementById('checkoutButton').addEventListener('click', finalizarCompra);
    document.getElementById('clearCart').addEventListener('click', vaciarCarrito);

    // Inicialización
    mostrarProductos(productos);
    actualizarCarrito();

    function mostrarProductos(productosMostrar) {
        elementosDOM.productList.innerHTML = '';
        productosMostrar.forEach(producto => {
            const cardHTML = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio.toFixed(2)}</p>
                            <p class="text-muted small">Stock: ${producto.stock}</p>
                            <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-primary">
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            elementosDOM.productList.innerHTML += cardHTML;
        });
    }

    window.agregarAlCarrito = (productoId) => {
        const producto = productos.find(p => p.id === productoId);
        const itemExistente = carrito.find(item => item.id === productoId);

        if (itemExistente) {
            if (itemExistente.cantidad < producto.stock) {
                itemExistente.cantidad++;
            } else {
                mostrarMensaje(`Stock insuficiente de ${producto.nombre}`, 'danger');
                return;
            }
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        actualizarCarrito();
        mostrarMensaje(`${producto.nombre} agregado al carrito`, 'success');
    };

    function actualizarCarrito() {
        elementosDOM.cartItems.innerHTML = '';
        let total = 0;

        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;

            const itemHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <span class="fw-bold">${item.nombre}</span>
                        <span class="text-muted">(x${item.cantidad})</span>
                    </div>
                    <div>
                        <span class="me-3">$${subtotal.toFixed(2)}</span>
                        <button onclick="eliminarDelCarrito(${index})" class="btn btn-sm btn-outline-danger">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
            elementosDOM.cartItems.innerHTML += itemHTML;
        });

        elementosDOM.totalAmount.textContent = total.toFixed(2);
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        actualizarCarrito();
        mostrarMensaje('Producto eliminado', 'warning');
    };

    function filtrarProductos() {
        const busqueda = elementosDOM.searchInput.value.toLowerCase();
        const categoria = elementosDOM.categoryFilter.value;

        const filtrados = productos.filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
            const coincideCategoria = categoria === 'all' || producto.categoria === categoria;
            return coincideNombre && coincideCategoria;
        });

        mostrarProductos(filtrados);
    }

    function finalizarCompra() {
        if (carrito.length === 0) {
            mostrarMensaje('Carrito vacío', 'danger');
            return;
        }

        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            producto.stock -= item.cantidad;
        });

        mostrarMensaje('¡Compra exitosa! Stock actualizado', 'success');
        carrito = [];
        actualizarCarrito();
    }

    function vaciarCarrito() {
        carrito = [];
        actualizarCarrito();
        mostrarMensaje('Carrito vaciado', 'info');
    }

    function mostrarMensaje(texto, tipo) {
        elementosDOM.statusMessage.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${texto}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
});