import { createContext, useState, useContext, useEffect } from 'react'

const MovieContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({ children }) => {

    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem("favorites")
        return savedFavorites ? JSON.parse(savedFavorites) : []
    })

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

    const addToFavorites = (movie) => {
        setFavorites(prev => [...prev, movie])
    }

    const removeFromFavorites = (movieID) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieID))
    }

    const isFavorite = (movieID) => {
        return favorites.some(movie => movie.id === movieID)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    )
}