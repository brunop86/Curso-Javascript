class Item {
  constructor(nombre, precio, imagen) {
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
  }
}

const harina = new Item("Harina", 100, "harina.webp");
const yerba = new Item("Yerba", 150, "yerba.webp");
const mermelada = new Item("Mermelada", 140, "mermelada.webp");
const edulcorante = new Item("Edulcorante", 50, "edulcorante.webp");
const cafe = new Item("Cafe", 200, "cafe.webp");
const tonico = new Item("Tónico del Amor", 120, "tonico.webp");

const inventario = [];

let dinero = 500;

const elDinero = document.querySelector("#dinero span");
elDinero.innerText = dinero;
const elInventario = document.getElementById("inventario");

function comprar(itemDeCompra) {
  if (dinero - itemDeCompra.precio >= 0) {
    inventario.push(itemDeCompra);
    dinero -= itemDeCompra.precio;
    actualizarHTML();
  } else {
    alert(`No tenés dinero suficiente para comprar ${itemDeCompra.nombre}.`);
  }
}

function vender(nombreDelItem) {
  const itemEncontrado = inventario.find(
    (item) => item.nombre == nombreDelItem
  );

  if (itemEncontrado) {
    dinero += itemEncontrado.precio;
    const indice = inventario.indexOf(itemEncontrado);
    inventario.splice(indice, 1);
    actualizarHTML();
  }
}

function actualizarHTML() {
  elInventario.innerHTML = "";
  for (const itemDeCompra of inventario) {
    const li = `
      <li onclick="vender('${itemDeCompra.nombre}')">
        <img src="img/${itemDeCompra.imagen}" alt="${itemDeCompra.imagen}" />
      </li>
      `;

    elInventario.innerHTML += li;
  }

  elDinero.innerText = dinero;
}
