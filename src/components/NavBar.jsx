import { Link, NavLink } from "react-router-dom"
import '../css/Navbar.css'

function NavBar(){
    const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`

    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/" className="brand-name">Letterboxd<span>Clone</span></Link>
        </div>
        <div className="navbar-links">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/random" className={linkClass}>Movie Picker</NavLink>
            <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
        </div>
    </nav>
}

export default NavBar
