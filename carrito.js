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
      //
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
            <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
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