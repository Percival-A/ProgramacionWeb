
// Función para inserta.html

function insertProduct() {
    // Recoge los valores de los campos del formulario
    let productId = document.getElementById("productId").value;
    let productName = document.getElementById("productName").value;
    let productDescription = document.getElementById("productDescription").value;
    let productPrice = parseFloat(document.getElementById("productPrice").value); // Convertir a número

    // Validaciones básicas (puedes añadir más según lo necesites)
    if(!productName || !productDescription || isNaN(productPrice)) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    // Crea el objeto del producto
    const product = {
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice
    };

    // Enviar el producto al servidor
    fetch('/addProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Producto agregado exitosamente!");
            // Limpiar los campos del formulario
            document.getElementById("productId").value = '';
            document.getElementById("productName").value = '';
            document.getElementById("productDescription").value = '';
            document.getElementById("productPrice").value = '';
        } else {
            alert("Hubo un error al agregar el producto.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Hubo un error al agregar el producto.");
    });
}

// Función para consulta.html

function fetchAndDisplayProducts() {
    // Obtiene la información de productos del servidor
    fetch('/getProducts')
    .then(response => response.json())
    .then(data => {
        // Verifica si se obtuvo algún dato
        if (data && data.length > 0) {
            let tableHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Descripcion</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
            `;

            data.forEach(product => {
                tableHTML += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price}</td>
                    </tr>
                `;
            });

            tableHTML += '</tbody>';

            // Inserta el contenido de la tabla en el HTML
            document.querySelector("#productTable").innerHTML = tableHTML;
        } else {
            document.querySelector("#productTable").innerHTML = '<p>No hay productos registrados</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.querySelector("#productTable").innerHTML = '<p>Hubo un error al cargar los productos.</p>';
    });
}

// se ejecuta esta función cuando la página se cargue
// window.onload = fetchAndDisplayProducts;

// Función para actualizar el producto
function updateProduct() {
    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;

    const productData = {
        id: productId,
        name: productName,
        description: productDescription,
        price: productPrice
    };

    fetch(`/update-product`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto actualizado exitosamente!');
        } else {
            alert('Error al actualizar el producto.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al actualizar el producto.');
    });
}

// Función para eliminar el producto
function deleteProduct() {
    const productId = document.getElementById('productID').value;

    fetch(`/delete-product/${productId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto eliminado exitosamente!');
        } else {
            alert('Error al eliminar el producto.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar el producto.');
    });
}

addProductButton.addEventListener('click', insertProduct);
saveProductButton.addEventListener('click', updateProduct);
deleteButton.addEventListener('click', deleteProduct);

