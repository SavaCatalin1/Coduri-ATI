import React from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className='navbar-container noselect'>
            <div className='buttons-container'>
                <Link to={'/'} className='navbar-button'><div>Home</div></Link>
                <Link to={'/produse'} className='navbar-button'><div>Produse</div></Link>
            </div>
            <img src={require('../ATI LOGO.png')} className='logo' />
        </div>
    )
}

export default Navbar