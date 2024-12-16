const z = require('zod');



const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1900).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5.5),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy','Horror','Thriller','Sci-Fi','Crime']),
        {
            required_error: 'Movie genre must be a required.',
            invalid_type_error: 'Movie genre must be an array of enum genre.'
        }
    )
})

function validateMovie(input){
    return movieSchema.safeParse(input)
}

//valida si existe el parametro, si no existe no pasa nada, solo lo ignora y sigue su flujo
function validatePartialMovie(input){
    return movieSchema.partial( ).safeParse(input);
}

module.exports = { validateMovie , validatePartialMovie };