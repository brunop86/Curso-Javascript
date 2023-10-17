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
    //
    this.categoriaSeleccionada = "MLA1323";
    this.limiteProductos = 12;
    this.cargarRegistrosPorCategoria();
  }

  async cargarRegistrosPorCategoria(categoria = this.categoriaSeleccionada) {
    mostrarLoader();
    this.categoriaSeleccionada = categoria;
    this.productos = [];
    const respuesta = await fetch(
      `https://api.mercadolibre.com/sites/MLA/search?category=${categoria}&limit=${this.limiteProductos}&offset=2`
    );
    const resultado = await respuesta.json();
    const productosML = resultado.results;
    for (const productoML of productosML) {
      const producto = new Producto(
        productoML.id,
        productoML.title,
        productoML.price,
        categoria,
        productoML.thumbnail_id
      );
      this.productos.push(producto);
    }
    cargarProductos(this.productos);
    Swal.close();
  }

  async cargarRegistrosPorNombre(palabra) {
    mostrarLoader();
    this.productos = [];
    const respuesta = await fetch(
      `https://api.mercadolibre.com/sites/MLA/search?category=${this.categoriaSeleccionada}&q=${palabra}&limit=${this.limiteProductos}&offset=0
      `
    );
    const resultado = await respuesta.json();
    const productosML = resultado.results;
    for (const productoML of productosML) {
      const producto = new Producto(
        productoML.id,
        productoML.title,
        productoML.price,
        this.categoriaSeleccionada,
        productoML.thumbnail_id
      );
      this.productos.push(producto);
    }
    cargarProductos(this.productos);
    Swal.close();
  }

  traerRegistros() {
    return this.productos;
  }

  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
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

  vaciar() {
    this.total = 0;
    this.cantidadProductos = 0;
    this.carrito = [];
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
          <p>Quantity: ${producto.cantidad}</p>
          <a href="#" class="btnQuitar" data-id="${producto.id}">Remove</a>
        </div>
      `;

      this.total += producto.precio * producto.cantidad;
      this.cantidadProductos += producto.cantidad;
    }
    if (this.cantidadProductos > 0) {
      botonComprar.style.display = "block";
    } else {
      botonComprar.style.display = "none";
    }

    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = boton.dataset.id;
        this.quitar(idProducto);
      });
    }

    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
  }
}

const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonComprar = document.querySelector("#botonComprar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");
const botonLogin = document.querySelector("#botonLogin");

const bd = new BaseDeDatos();

const carrito = new Carrito();

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;
    const botonSeleccionado = document.querySelector(".seleccionado");
    botonSeleccionado.classList.remove("seleccionado");
    boton.classList.add("seleccionado");
    bd.cargarRegistrosPorCategoria(categoria);
  });
});

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
  divProductos.innerHTML = "";
  for (const producto of productos) {
    divProductos.innerHTML += `
      <div class="producto">
        <h2>${producto.nombre}</h2>
        <p class="precio">$${producto.precio}</p>
        <div class="imagen">
          <img src="https://http2.mlstatic.com/D_604790-${producto.imagen}-V.webp" />
        </div>
        <a href="#" class="btnAgregar" data-id="${producto.id}">Add to Cart</a>
      </div>
    `;
  }

  const botonesAgregar = document.querySelectorAll(".btnAgregar");

  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const idProducto = boton.dataset.id;
      const producto = bd.registroPorId(idProducto);
      carrito.agregar(producto);

      Toastify({
        text: `Item added: ${producto.nombre}`,
        gravity: "bottom",
        position: "center",
        style: {
          background: "#244ced",
        },
      }).showToast();
    });
  }
}

function mostrarLoader() {
  Swal.fire({
    title: "Loading",
    html: "Please wait...",
    timer: 1000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  const palabra = inputBuscar.value;
  bd.cargarRegistrosPorNombre(palabra);
});

botonComprar.addEventListener("click", (event) => {
  event.preventDefault();

  Swal.fire({
    title: "Confirm Purchase?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, I'm sure",
    cancelButtonText: "No, cancel",
    confirmButtonColor: 'green',
    cancelButtonColor: 'red',
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.vaciar();
      Swal.fire({
        title: "Congratulations!",
        icon: "success",
        text: "Purchase Successful",
      });
    }
  });
});

botonLogin.addEventListener("click", (event) => {
  event.preventDefault();

Swal.fire({
  title: 'Submit your Username',
  input: 'text',
  inputAttributes: {
    autocapitalize: 'off'
  },
  showCancelButton: true,
  confirmButtonText: 'Look up',
  showLoaderOnConfirm: true,
  preConfirm: (login) => {
    return fetch(`//api.github.com/users/${login}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .catch(error => {
        Swal.showValidationMessage(
          `Request failed: ${error}`
        )
      })
  },
  allowOutsideClick: () => !Swal.isLoading()
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: `${result.value.login}'s avatar`,
      imageUrl: result.value.avatar_url
    })
  }
})
});