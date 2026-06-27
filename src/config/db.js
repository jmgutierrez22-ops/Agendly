const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Conectado con éxito a SQL Server (AgendlyDB)');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error al conectar a la Base de Datos: ', err);
    });

module.exports = { sql, poolPromise };