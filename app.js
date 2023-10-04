class Producto {
  constructor(id, nombre, precio, categoria, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}

class BaseDeDatos {
  constructor() {
    this.productos = [];
    this.agregarRegistro(1, "Shirt Nike Winter Rafa", 34.99, "Indumentaria", "remera-rafa.webp");
    this.agregarRegistro(2, "Short Nike Winter Rafa", 79.99, "Indumentaria", "short-rafa.webp");
    this.agregarRegistro(3, "Dress Adidas Fall Slam Pro Set", 99.99, "Indumentaria", "vestido-adidas.webp");
    this.agregarRegistro(4, "Dress Nike Fall Night Slam", 109.99, "Indumentaria", "vestido-nike.webp");
    this.agregarRegistro(5, "Nike Zoom Vapor 9.5 Tour", 169.99, "Calzado", "zapas-nike.webp");
    this.agregarRegistro(6, "Adidas Barricade Royal", 149.99, "Calzado", "zapas-adidas.webp");
    this.agregarRegistro(7, "Babolat Pure Aero 98", 279.99, "Raquetas", "pure-aero.webp");
    this.agregarRegistro(8, "Yonex VCORE Tour 95", 259.99, "Raquetas", "yonex-vcore.webp");
  }

  agregarRegistro(id, nombre, precio, categoria, imagen) {
    const producto = new Producto(id, nombre, precio, categoria, imagen);
    this.productos.push(producto);
  }

  traerRegistros() {
    return this.productos;
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }

  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(palabra.toLowerCase())
    );
  }
}

class Carrito {
  constructor() {
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.cantidadProductos = 0;
    this.listar();
  }

  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (!productoEnCarrito) {
      this.carrito.push({ ...producto, cantidad: 1 });
    } else {
      productoEnCarrito.cantidad++;
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
      this.carrito.splice(indice, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  listar() {
    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";
    for (const producto of this.carrito) {
      divCarrito.innerHTML += `
        <div class="productoCarrito">
          <h2>${producto.nombre}</h2>
          <p>$${producto.precio}</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar" data-id="${producto.id}">Remove</a>
        </div>
      `;
      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }

    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
      });
    }

    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

const bd = new BaseDeDatos();

const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");

const carrito = new Carrito();

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="img/${producto.imagen}" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Add to Cart</a>
      </div>
    `;
  }

  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = Number(boton.dataset.id);
      const producto = bd.registroPorId(idProducto);
      carrito.agregar(producto);
    });
  }
}

inputBuscar.addEventListener("input", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  const productos = bd.registrosPorNombre(palabra);
  cargarProductos(productos);
});

botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});