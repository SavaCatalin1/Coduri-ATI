import React from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeIcon from '@mui/icons-material/QrCode';

const Navbar = () => {
    const navigate = useNavigate()

    return (
        <div className='navbar-container noselect'>
            <div className='buttons-container'>
                <Link to={'/'} className='navbar-button'>
                    <div className='flex'>
                        <HomeIcon />
                        <span>Home</span>
                    </div>
                </Link>
                <Link to={'/produse'} className='navbar-button'>
                    <div className='flex'>
                        <QrCodeIcon />
                        <span>Produse</span>
                    </div>
                </Link>
                <Link to={'/qrafm'} className='navbar-button'>
                    <div className='flex'>
                        <QrCode2Icon />
                        <span>Cod QR</span>
                    </div>
                </Link>
            </div>
            <img src={require('../ATI LOGO.png')} className='logo' />
        </div>
    )
}

export default Navbar