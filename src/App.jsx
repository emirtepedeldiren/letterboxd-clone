import './css/App.css'
import Favorite from './pages/Favorites'
import Home from './pages/Home'
import Login from './pages/Login'
import MoviePicker from './pages/MoviePicker'
import { Routes , Route } from 'react-router-dom'
import { MovieProvider } from './contexts/MovieContext'
import NavBar from './components/NavBar'



function App() {
  return (
    <MovieProvider>
      <NavBar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/random" element={<MoviePicker/>} />
      </Routes>
    </main>
    </MovieProvider>
  )
}

export default App
