let productos = [];
let carrito = [];

async function cargarProductos() {
  try {
    const res = await fetch("../JSON/productos.json");
    productos = await res.json();
    renderizarProductos();
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

const contenedor = document.getElementById("contenedor-productos");
const carritoContenedor = document.getElementById("carrito");
const botonVaciar = document.getElementById("vaciar-carrito");
const contadorHeader = document.getElementById("contador-header");
const contadorMain = document.getElementById("contador-main");
const contadorFlotante = document.getElementById("contador-flotante");
const enlacesCategorias = document.querySelectorAll('.nav-categorias a');
const botonFlotante = document.getElementById("boton-carrito-flotante");

function renderizarProductos(filtroCategoria = "Todos") {
  contenedor.innerHTML = "";

  const productosFiltrados = filtroCategoria === "Todos"
    ? productos
    : productos.filter(p => p.categoria === filtroCategoria);

  productosFiltrados.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p><strong>Categoría:</strong> ${producto.categoria}</p>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Talles:</strong> ${producto.talleDisponible.join(", ")}</p>
        <p><strong>Stock:</strong> ${producto.stock}</p>
        <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  agregarEventosBotones();
}

function agregarEventosBotones() {
  const botones = document.querySelectorAll(".btn-agregar");
  botones.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const producto = productos.find(p => p.id === id);
      agregarAlCarrito(producto);
    });
  });
}

function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  renderizarCarrito();
  guardarCarrito();
  Swal.fire("Producto agregado al carrito");
}

function renderizarCarrito() {
  carritoContenedor.innerHTML = "";

  if (carrito.length === 0) {
    carritoContenedor.innerHTML = "<p>El carrito está vacío.</p>";
    actualizarContador();
    return;
  }

  carrito.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <p>${item.nombre} x ${item.cantidad}</p>
      <p>Subtotal: $${item.precio * item.cantidad}</p>
      <button class="btn-quitar" data-id="${item.id}">Quitar</button>
    `;
    carritoContenedor.appendChild(div);
  });

  document.querySelectorAll(".btn-quitar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      quitarDelCarrito(id);
    });
  });

  actualizarContador();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderizarCarrito();
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    renderizarCarrito();
  }
}

botonVaciar.addEventListener("click", () => {
  carrito = [];
  renderizarCarrito();
  guardarCarrito();
});

function actualizarContador() {
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  contadorHeader.textContent = total;
  contadorMain.textContent = total;
  contadorFlotante.textContent = total;
}

enlacesCategorias.forEach(enlace => {
  enlace.addEventListener("click", (e) => {
    e.preventDefault();
    const categoria = e.target.dataset.categoria;
    renderizarProductos(categoria);
  });
});

botonFlotante.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("El carrito está vacío");
    return;
  }

  const contenido = carrito.map(item =>
    `<p><strong>${item.nombre}</strong> x ${item.cantidad} = $${item.precio * item.cantidad}</p>`
  ).join("");

  Swal.fire({
    title: 'Tu Carrito',
    html: contenido,
    showCloseButton: true,
    confirmButtonText: 'Seguir comprando'
  });
});

cargarCarrito();
cargarProductos();