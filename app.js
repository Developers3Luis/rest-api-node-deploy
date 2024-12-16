const http = require('http');
const express = require('express');
const crypto = require('node:crypto');
const moviesJSON = require('./movies/movies.json');
const cors = require('cors');
const { validateMovie, validatePartialMovie } = require('./schemas/movies');
const app = express();


app.use(express.json());
app.use(cors({
    origin:(origin,callback)=>{
        const ACCEPTED_ORIGINS = [
            'http://localhost:3000',
            'http://localhost:4200',
            'http://localhost:8080'
        ]

        if(ACCEPTED_ORIGINS.includes(origin,callback)){
            return callback(null,true)
        }

        return callback(new Error('No permitido'))
    }
}));
app.disable('x-powered-by');

app.get('/',(req,res)=>{
    res.json({message:"Hola"})
})

app.get('/movies',(req,res)=>{
    res.json(moviesJSON);
})
app.get('/movies/:id',(req,res)=>{
    const {id} = req.params;

    const movie = moviesJSON.find(movie => movie.id ===id);
    if(movie) return res.json(movie);
    res.status(404).json({message: "Movie not found "})

})

app.get('/movies/genero',(req,res)=>{
    const {genre} = req.params;
    const filteredMovies = moviesJSON.filter(movie => movie.genre === genre);
    if(filteredMovies) return res.json(filteredMovies)
    res.status(404).json({message: "Genere not found"})
})

app.post('/movies',(req,res)=>{
    const result = validateMovie(req.body)

    if(!result.success){ return res.status(400).json({error: JSON.parse(result.error.message)}) }

    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }
    moviesJSON.push(newMovie);
    
    res.status(201).json(newMovie);
})

app.patch('/movies/:id',(req,res)=>{
    const result = validatePartialMovie(req.body);

    if(!result.success){
         return res.status(400).json({error: JSON.parse(result.error.message)}) 
    }

    const {id} = req.params;
    const movieIndex = moviesJSON.findIndex(movie => movie.id === id);

    if(movieIndex   === -1 ){// -1 porque no existe
        res.status(404).json({message: 'Movie not found'});
    }
    
    const updateMovie = {
        ...moviesJSON[movieIndex],
        ...result.data
    }

    moviesJSON[movieIndex] = updateMovie;

    return res.json(updateMovie);

})



const PORT = process.env.PORT ?? 1234;


app.listen(PORT,()=>{
    console.log(`server listening on port http://loscalhost:${PORT}`);
})