const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Inicializa express
const app = express();

// Configuración de la base de datos SQLite
const dbFile = './.data/sqlite.db';
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        
        // Creación de la tabla products
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
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
            }
        });
    }
});

// Si necesitas más configuración o rutas, será en los siguientes pasos...

// Inicializa el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
