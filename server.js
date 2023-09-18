const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Inicializa express
const app = express();
// Definimos el puerto donde se ejecutará nuestro servidor.
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Configuración de la base de datos SQLite
const dbFile = './sqlite.db';
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        
        // Creación de la tabla products
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER NOT NULL PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            price REAL
        )`, (err) => {
            if (err) {
                // En caso de error al crear la tabla
                console.error("Error creating table: ", err.message);
            } else {
                // Mensaje de éxito
                console.log("Table 'products' is ready!");
                
                // Precarga de datos
                const query = `INSERT OR IGNORE INTO products (id, name, description, price) VALUES (?, ?, ?, ?)`;
                const autos = [
                    { id: 1, name: 'Nissan Versa', description: 'Sedán compacto con buen rendimiento de combustible y características modernas.', price: 250000 },
                    { id: 2, name: 'Volkswagen Golf', description: 'Hatchback versátil y divertido de conducir.', price: 350000 },
                    { id: 3, name: 'Ford Ranger', description: 'Camioneta pickup mediana, ideal para el trabajo y la aventura.', price: 450000 },
                    { id: 4, name: 'Toyota Corolla', description: 'Sedán confiable y eficiente en combustible.', price: 300000 },
                    { id: 5, name: 'Honda Civic', description: 'Sedán compacto con un diseño atractivo y tecnología avanzada.', price: 330000 },
                    { id: 6, name: 'Chevrolet Spark', description: 'Automóvil subcompacto, perfecto para la ciudad.', price: 200000 },
                    { id: 7, name: 'Hyundai Tucson', description: 'SUV compacto con estilo y comodidad.', price: 480000 },
                    { id: 8, name: 'Mazda CX-5', description: 'SUV elegante y deportivo con un interior de alta calidad.', price: 450000 },
                    { id: 9, name: 'Jeep Wrangler', description: 'Icono todoterreno con estilo retro.', price: 700000 },
                    { id: 10, name: 'Tesla Model 3', description: 'Automóvil eléctrico con tecnología de vanguardia.', price: 800000 }
                ];

                autos.forEach(auto => {
                    db.run(query, [auto.id, auto.name, auto.description, auto.price], function(err) {
                        if (err) {
                            console.error('Error inserting into products:', err.message);
                        }
                    });
                });
            }
        });
    }
});



//RUTAS

// Ruta para agregar un producto
app.post('/addProduct', (req, res) => {
    // Extraer datos del producto desde el cuerpo de la solicitud
    const { id, name, description, price } = req.body;
    
    // Preparar y ejecutar la consulta SQL para insertar un producto
    const stmt = db.prepare("INSERT INTO products (id, name, description, price) VALUES (?, ?, ?, ?)");
    stmt.run(id, name, description, price, (err) => {
        if (err) {
            res.status(500).send({ error: "Error al insertar el producto." });
            return;
        }
        res.send({ success: true });
    });
    stmt.finalize();
});

// Ruta para obtener todos los productos
app.get('/getProducts', (req, res) => {
    // Ejecutar consulta SQL para obtener todos los productos
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            res.status(500).send({ error: "Error al obtener los productos." });
            return;
        }
        res.send(rows);
    });
});

// Ruta para actualizar un producto
app.put('/update-product', (req, res) => {
    // Extraer datos del producto desde el cuerpo de la solicitud
    const { id, name, description, price } = req.body;

    // Si no se proporciona ID, no podemos continuar
    if (!id) {
        res.status(400).send({ error: "ID del producto es requerido." });
        return;
    }

    let fieldsToUpdate = [];
    let values = [];

    if (name) {
        fieldsToUpdate.push("name = ?");
        values.push(name);
    }

    if (description) {
        fieldsToUpdate.push("description = ?");
        values.push(description);
    }

    if (price) {
        fieldsToUpdate.push("price = ?");
        values.push(price);
    }

    // Añadir el ID al final de los valores para la cláusula WHERE
    values.push(id);

    // Si no hay campos para actualizar, no podemos continuar
    if (fieldsToUpdate.length === 0) {
        res.status(400).send({ error: "No se proporcionaron campos para actualizar." });
        return;
    }

    const sql = `UPDATE products SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    const stmt = db.prepare(sql);
    stmt.run(values, (err) => {
        if (err) {
            res.status(500).send({ error: "Error al actualizar el producto." });
            return;
        }
        res.send({ success: true });
    });
    stmt.finalize();
});


// Ruta para eliminar un producto
app.delete('/delete-product/:productId', (req, res) => {
    // Extraer el ID del producto desde los parámetros de la ruta
    const productId = req.params.productId;
    console.log('Attempting to delete product with id:', productId);  // <- Aquí conslo
    // Preparar y ejecutar la consulta SQL para eliminar un producto
    const stmt = db.prepare("DELETE FROM products WHERE id = ?");
    stmt.run(productId, (err) => {
        if (err) {
            console.error('Error:', err.message);  // <- Aquí también
            res.status(500).send({ error: "Error al eliminar el producto." });
            return;
        }
        res.send({ success: true });
    });
    stmt.finalize();
});

// Inicializa el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Manejo de cierre del servidor:
// Aseguramos que, al cerrar la aplicación, también se cierre la conexión a la base de datos.
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Cierre de la conexión a la base de datos.');
        process.exit(1);
    });
});