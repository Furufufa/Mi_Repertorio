const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path'); 

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.listen(3000, () => console.log("Servidor On en http://localhost:3000"));

app.post('/canciones', (req, res) => {
    const nuevaCancion = req.body;

    fs.readFile('repertorio.json', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');

        const repertorio = JSON.parse(data);
        repertorio.push(nuevaCancion);

        fs.writeFile('repertorio.json', JSON.stringify(repertorio, null, 2), (err) => {
            if (err) return res.status(500).send('Error al guardar la canción');
            res.status(201).send('Canción agregada con éxito');
        });
    });
});


app.get('/canciones', (req, res) => {
    fs.readFile('repertorio.json', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');
        res.json(JSON.parse(data));
    });
});


app.put('/canciones/:id', (req, res) => {
    const { id } = req.params;
    const cancionActualizada = req.body;

    fs.readFile('repertorio.json', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');

        const repertorio = JSON.parse(data);
        const index = repertorio.findIndex(c => c.id == id);
        
        if (index === -1) return res.status(404).send('Canción no encontrada');

        repertorio[index] = { ...repertorio[index], ...cancionActualizada };

        fs.writeFile('repertorio.json', JSON.stringify(repertorio, null, 2), (err) => {
            if (err) return res.status(500).send('Error al actualizar la canción');
            res.send('Se actualiza canción');
        });
    });
});


app.delete('/canciones/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('repertorio.json', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo');

        let repertorio = JSON.parse(data);
        repertorio = repertorio.filter(c => c.id != id);

        fs.writeFile('repertorio.json', JSON.stringify(repertorio, null, 2), (err) => {
            if (err) return res.status(500).send('Error al eliminar la canción');
            res.send('Canción eliminada satisfactoriamente');
        });
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
