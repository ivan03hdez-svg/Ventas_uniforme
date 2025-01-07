console.log("Archivo JS cargado correctamente");

document.addEventListener('DOMContentLoaded', () => {
    const servidor = {
        users: JSON.parse(localStorage.getItem('users') || '[]'), // Recupera los usuarios de localStorage

        //Metodo Registro de usuarios
        register: function (name, age, email, password) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                    if (storedUsers.some(user => user.name === name)) {
                        reject({ success: false, message: 'Usuario ya registrado' });
                        console.log(JSON.parse(localStorage.getItem('users')));
                    } else {
                        const newUser = { name, age, email, password };
                        storedUsers.push(newUser);
                        localStorage.setItem('users', JSON.stringify(storedUsers)); // Guarda en localStorage
                        resolve({ success: true, message: 'Usuario registrado' });
                        console.log(JSON.parse(localStorage.getItem('users')));
                    }
                }, 1000);
            });
        },

        //Metodo Login
        login: function (email, password) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Recupera usuarios desde localStorage
                    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

                    if (storedUsers.length === 0) {
                        reject({ success: false, message: 'No existen usuarios registrados' });
                    } else {
                        // Busca el usuario que coincida con el email y password
                        const user = storedUsers.find(u => u.email === email && u.password === password);
                        if (user) {
                            resolve({ success: true, message: 'Bienvenido', user });
                        } else {
                            resolve({ success: false, message: 'Usuario y/o contraseña incorrectos' });
                        }
                    }
                }, 1000);
            });
        },

        //Metodo Calcular el total
        calculadoraPrecio: function(productos, iva = 0.16){
            return new Promise((resolve) => {
                setTimeout(() =>{
                    const subtotal = productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
                    const tax = subtotal * iva;
                    const total = subtotal + tax;

                    resolve({success: true, subtotal: subtotal.toFixed(2), tax: tax.toFixed(2), total: total.toFixed(2)});
                }, 1000);
            });
        }
    }

    // Manejar el formulario de inicio de sesión
    document.getElementById('authForm')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const isRegistering = document.getElementById('auth-btn').textContent === 'Registrar';
        const isLoging = document.getElementById('auth-btn').textContent === 'Ingresar';

        if (isRegistering) { //Espacio para el registro
            console.log('Se seleccionó: Registrar');
            //Guardar la informacion
            const name = document.getElementById('name')?.value.trim();
            const age = document.getElementById('age')?.value.trim();
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('pass').value.trim();

            if (!name || !age || !email || !pass) {
                alert('Complete todos los campos para el registro');
                return;
            }
            servidor.register(name, age, email, pass);
            console.log('Usuario registrado');
        } else if (isLoging) { //Espacio para el Logeo
            console.log('Se seleccionó: Ingresar');

            //Guardar emial y contraseña
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('pass').value.trim();

            if(!email || !pass){
                alert('Complete los campos');
                return; //Detener ejecucion
            }
            servidor.login(email, pass).then(response =>{
                console.log(response.message);
                alert(response.message);
                console.log('Informacion del ususario: ',response.email);
                window.location.href = "inicio.html";
            }).catch(error =>{
                console.error(error.message);
                alert(error.message);
            });
        }
    });

    // REFERENCIAS A BOTONES INICIO Y REGISTRO
    const openOverlay = document.getElementById('open-overlay'); //Boton para activar el overlay
    const overlay = document.getElementById('overlay'); //Mostrar el cuadro de inicio de sesion
    if(overlay){
        // Mostrar el modal al hacer clic en el enlace 
        openOverlay?.addEventListener('click', (event) => {
            event.preventDefault();
            overlay.style.display = 'flex'; // Muestra el modal
        });
    }
    const closeBtn = document.getElementById('close-btn'); //Cerrar el cuadro
    if(closeBtn){
        //Cerrar el modal
        closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
    }
    
    //Evento Registro
    document.getElementById('switch-to-register').addEventListener('click', function (e){
        e.preventDefault();
        //Cambiar texto
        document.getElementById('modal-title').textContent = 'Crea una cuenta';
        document.getElementById('auth-btn').textContent = 'Registrar';
        document.getElementById('extra-content').innerHTML = `
            <div class="input-box">
                <input type="text" placeholder="Nombre" id="name" class="input-control">
            </div>
            <div class="input-box">
                <input type="text" placeholder="Edad" id="age" class="input-control">
            </div>
        `;
        document.getElementById('auth-switch-text').innerHTML = `
            ¿Ya tienes una cuenta? 
            <a href="#" class="gradient-text" id="switch-to-login">Inicia Sesión</a>
        `;

        // Cambiar evento al enlace de "Inicia Sesión"
        document.getElementById('switch-to-login').addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('modal-title').textContent = 'Inicia Sesión';
            document.getElementById('auth-btn').textContent = 'Ingresar';
            document.getElementById('extra-content').innerHTML = `
                <div class="input-link">
                    <a href="RecuperarCuenta.html" class="gradient-text">¿Has olvidado tu contraseña?</a>
                </div>`;
            document.getElementById('auth-switch-text').innerHTML = `
                ¿No tienes una cuenta? 
                <a href="#" class="gradient-text" id="switch-to-register">Crea una cuenta</a>
            `;
        });
    });

    //Logica para cerrar sesión
    const closeSesionButton = document.getElementById('close-sesion');
    if (closeSesionButton) {
        closeSesionButton.addEventListener('click', function (event) {
            event.preventDefault();
            //localStorage.removeItem('currentUser'); // Elimina el usuario autenticado
            alert('Has cerrado sesión correctamente.');
            window.location.href = 'login.html'; // Redirige al usuario al login
        });
    } else {
        console.warn('El botón "Cerrar Sesión" no se encontró en el DOM.');
    }

    const productos = [
        {
        id: 1,
        name: "Uniforme Escolar",
        description: "Uniforme Escuela Torres Bodet",
        image: "Images/uniform1.png",
        price: "$100.00",
        category: "Uniforme Escolar"
    },
    {
        id: 2,
        name: "Producto 2 - Electrónicos",
        description: "Descripción del Producto 2",
        image: "Images/uniform1.png",
        price: "$200.00",
        category: "Uniforme Escolar"
    },
    {
        id: 3,
        name: "Producto 1 - Ropa",
        description: "Descripción del Producto 1",
        image: "Images/uniformDeport1.png",
        price: "$50.00",
        category: "Ropa"
    },
    {
        id: 4,
        name: "Producto 2 - Ropa",
        description: "Descripción del Producto 2",
        image: "Images/uniform1.png",
        price: "$70.00",
        category: "Ropa"
    },
    {
        id: 5,
        name: "Producto 1 - Accesorios",
        description: "Descripción del Producto 1",
        image: "Images/uniform1.png",
        price: "$30.00",
        category: "Accesorios"
    },
    //UNIFORME DEPORTIVO
    {
        id: 6,
        name: "Producto 2 - Accesorios",
        description: "Descripción del Producto 2",
        image: "Images/uniformDeport1.png",
        price: "$40.00",
        category: "Uniforme Deportivo"
    },
    {
        id: 6,
        name: "Producto 2 - Accesorios",
        description: "Descripción del Producto 2",
        image: "Images/uniformDeport1.png",
        price: "$40.00",
        category: "Uniforme Deportivo"
    },
    {
        id: 6,
        name: "Producto 2 - Accesorios",
        description: "Descripción del Producto 2",
        image: "Images/uniformDeport1.png",
        price: "$40.00",
        category: "Uniforme Deportivo"
    },
    {
        id: 6,
        name: "Producto 2 - Accesorios",
        description: "Descripción del Producto 2",
        image: "Images/uniformDeport1.png",
        price: "$40.00",
        category: "Uniforme Deportivo"
    },
    {
        id: 6,
        name: "Producto 2 - Accesorios",
        description: "Descripción del Producto 2",
        image: "Images/uniformDeport1.png",
        price: "$40.00",
        category: "Uniforme Deportivo"
    }
    ];

    function displayAllProducts() {
        const productContainer = document.getElementById('escolar');
        productContainer.innerHTML = "";  // Limpiamos el contenedor antes de mostrar los productos
        productos.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <button class="open-overlay-btn">Comprar</button>
            `;

            // Agregar evento click al botón "Comprar"
            productCard.querySelector('.open-overlay-btn').addEventListener('click', (event) => {
                event.preventDefault(); // Evita el comportamiento predeterminado del enlace
                overlay.style.display = 'flex'; // Muestra el modal
            });

            productContainer.appendChild(productCard);
        });

        // Ocultar el mensaje de "No hay productos" si se están mostrando productos
        document.getElementById('no-products-message').style.display = 'none';
    }


    function displayProductsByCategory(category) {
    const productContainer = document.getElementById('escolar');
    const noProductsMessage = document.getElementById('no-products-message');

    productContainer.innerHTML = ""; // Limpia productos existentes
    const filteredProducts = productos.filter(product => product.category === category);

    if (filteredProducts.length === 0) {
        noProductsMessage.style.display = 'block';
    } else {
        noProductsMessage.style.display = 'none';
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <button class="open-overlay-btn">Comprar</button>
            `;
            productContainer.appendChild(productCard);
        });
    }
}


// Invocamos la función para mostrar los productos
displayAllProducts();
displayProductsByCategory('Uniforme Escolar');


});
