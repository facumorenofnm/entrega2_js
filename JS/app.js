const productos = [
    {
      id: 1,
      nombre: "Remera Basica",
      categoria: "Remeras",
      precio: 15000,
      talleDisponible: ["S", "M", "L", "XL"],
      imagen: "../IMAGENES/remera_basica.webp",
      stock: 15
    },
    {
      id: 2,
      nombre: "Remera Oversize",
      categoria: "Remeras",
      precio: 18000,
      talleDisponible: ["S", "M", "L", "XL"],
      imagen: "../IMAGENES/remera_oversize.webp",
      stock: 8
    },
    {
      id: 3,
      nombre: "Remera Manga Larga",
      categoria: "Remeras",
      precio: 18000,
      talleDisponible: ["S", "M", "L", "XL"],
      imagen: "../IMAGENES/remera_manga_larga.webp",
      stock: 5
    },
    {
      id: 4,
      nombre: "Buzo Cuello Redondo",
      categoria: "Buzos",
      precio: 34000,
      talleDisponible: ["S", "M", "L", "XL"],
      imagen: "../IMAGENES/buzo_redondo.webp",
      stock: 10
    },
    {
      id: 5,
      nombre: "Buzo Con Capucha",
      categoria: "Buzos",
      precio: 38000,
      talleDisponible: ["S", "M", "L", "XL"],
      imagen: "../IMAGENES/buzo_capucha.webp",
      stock: 12
    },
    {
      id: 6,
      nombre: "Jogging Recto",
      categoria: "Pantalones",
      precio: 30000,
      talleDisponible: ["S", "M", "L"],
      imagen: "../IMAGENES/jogging_recto.webp",
      stock: 9
    },
  ];
  
  const contenedor = document.getElementById("contenedor-productos");
  const carritoContenedor = document.getElementById("carrito");
  const botonVaciar = document.getElementById("vaciar-carrito");
  const contadorHeader = document.getElementById("contador-header");
  const contadorMain = document.getElementById("contador-main");
  const enlacesCategorias = document.querySelectorAll('.nav-categorias a');
  
  let carrito = [];
  
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
    alert("Producto agregado al carrito.");
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
  
    const botonesQuitar = document.querySelectorAll(".btn-quitar");
    botonesQuitar.forEach(btn => {
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
  }
  
  enlacesCategorias.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const categoria = e.target.dataset.categoria;
      renderizarProductos(categoria);
    });
  });
  
  // Iniciar app
  cargarCarrito();
  renderizarProductos();
  
  
