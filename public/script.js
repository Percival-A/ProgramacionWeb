
// Paso 3.0.1: Función para inserta.html

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

