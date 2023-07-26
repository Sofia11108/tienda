const cards = document.querySelector('#cards')
const items = document.querySelector('#items')
const footer = document.querySelector('#footer')
const templateCard = document.querySelector('#template-card').content;
const templateFooter = document.querySelector('#template-footer').content
const templateCarrito = document.querySelector('#template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        console.log(JSON.parse(localStorage.getItem('carrito')));
        pintarCarrito()
    }
})

const fetchData = async () => {
    try {
        const data = await (await fetch('../js/api.json')).json()
        // const data = await res.json()
        pintarCards(data)

    } catch (error) {
        console.log(error);
    }
}

items.addEventListener('click', e => {
    btnAccion(e)
})

const pintarCards = data => { //para pintar los productos

    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone) //para evitar el reflow
        console.log(producto);
    });

    cards.appendChild(fragment)
} 


cards.addEventListener('click', e => {
    addCarrito(e);
})

const addCarrito = e => {
    // console.log(e.target);
    // console.log(e.target.classList.contains('btn-dark'));

    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation()
}

const setCarrito = padre => { //asignar al carrito
    // console.log(padre);
    const producto = {
        id: padre.querySelector('.btn-dark').dataset.id,
        title: padre.querySelector('h5').textContent,
        precio: padre.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1 //se accede a la propiedad del objeto
    }

    carrito[producto.id] = {...producto} //o sea crea sino existe la propiedad

    pintarCarrito()
}

const pintarCarrito = () => { //pintar el carrito
    items.innerHTML = '' //limpiar el html de la info anterior

    Object.values(carrito).forEach(producto => { //obtener los valores de un objeto y guardarlos en un arreglo
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.precio
        templateCarrito.querySelectorAll('span')[1].textContent = producto.cantidad * producto.precio
 
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + (cantidad * precio), 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelectorAll('span')[1].textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const botonVaciar = document.querySelector('#vaciar-carrito')

    botonVaciar.addEventListener('click', () => {
    carrito = {}
    pintarCarrito()
    // pintarFooter()
})

}

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        // console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}

        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
}





