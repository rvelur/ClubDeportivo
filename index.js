import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';

const app = express();
const PORT = 3005;
const __dirname = path.resolve();
const Public = path.join(__dirname, 'public');


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use(cors());

app.get('/', (req, res) => {
    try {
        const indexHTML = path.join(Public, 'index.html');
        res.sendFile(indexHTML);
    } catch (error) {
        console.log(error);
    }
})

app.get('/deportes', async (req, res) => {
    try {
        const data = path.join(Public, 'deportes.json')
        res.sendFile(data);
    } catch (error) {
        console.log(error);
    }
})

app.get('/agregar', async (req, res) => {
    try {
        const {nombre, precio} = req.query
        const data = path.join(Public, 'deportes.json');
        const deportesJSON = await fs.readFile(data, 'utf8');
        const {deportes} = JSON.parse(deportesJSON)
        deportes.push({nombre, precio})

        await fs.writeFile(data, JSON.stringify({deportes}));
        res.send('Agregado exitosamente')
    } catch (error) {
        console.log(error)
    }
})

app.get('/eliminar', async (req, res) => {
    try {
        const {nombre} = req.query;
        const data = path.join(Public, 'deportes.json');
        const deportesJSON = await fs.readFile(data, 'utf8');
        let {deportes} = JSON.parse(deportesJSON);
        deportes = deportes.filter((item) => item.nombre !== nombre)
        await fs.writeFile(data, JSON.stringify({deportes}))

        res.send('Eliminado exitosamente')
    }catch (error){
        console.log(error)
    }
})

app.get('/editar', async (req, res) => {
    try {
        const {nombre, precio} = req.query;
        const data = path.join(Public, 'deportes.json');
        const deportesJSON = await fs.readFile(data, 'utf8');
        let {deportes} = JSON.parse(deportesJSON);
        deportes = deportes.map((item) => {
            if(item.nombre === nombre) {
                item.precio = precio
            }
            return item
        })
        await fs.writeFile(data, JSON.stringify({deportes}))

        res.send('Editado exitosamente')
    }catch (error){
        console.log(error)
    }
})