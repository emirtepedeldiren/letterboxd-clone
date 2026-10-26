import './css/App.css'
import Favorite from './pages/Favorites'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import MoviePicker from './pages/MoviePicker'
import MovieDetails from './pages/MovieDetails'
import { Routes , Route } from 'react-router-dom'
import NavBar from './components/NavBar'



function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/random" element={<MoviePicker />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </>
  )
}

export default App
