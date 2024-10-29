import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DraftsIcon from '@mui/icons-material/Drafts';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <>
            {/* Desktop Sidebar Navbar */}
            <div className='navbar-container'>
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
                    <Link to={'/scan'} className='navbar-button'>
                        <div className='flex'>
                            <DocumentScannerIcon />
                            <span>Scan</span>
                        </div>
                    </Link>
                    <Link to={'/avize'} className='navbar-button'>
                        <div className='flex'>
                            <DraftsIcon />
                            <span>Avize</span>
                        </div>
                    </Link>
                </div>
                <img src={require('../ATI LOGO.png')} className='logo' />
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className='menu-icon' onClick={toggleMobileMenu}>
                {isMobileOpen ? <CloseIcon fontSize='large'/> : <MenuIcon fontSize='large'/>}
            </div>

            {/* Overlay Navbar for Mobile */}
            {isMobileOpen && <div className={`navbar-overlay ${isMobileOpen ? 'open' : ''}`}>
                <div className='buttons-container'>
                    {/* <Link to={'/'} className='navbar-button' onClick={() => setIsMobileOpen(false)}>
                        <div className='flex'>
                            <HomeIcon />
                            <span>Home</span>
                        </div>
                    </Link>
                    <Link to={'/produse'} className='navbar-button' onClick={() => setIsMobileOpen(false)}>
                        <div className='flex'>
                            <QrCodeIcon />
                            <span>Produse</span>
                        </div>
                    </Link>
                    <Link to={'/qrafm'} className='navbar-button' onClick={() => setIsMobileOpen(false)}>
                        <div className='flex'>
                            <QrCode2Icon />
                            <span>Cod QR</span>
                        </div>
                    </Link> */}
                    <Link to={'/scan'} className='navbar-button' onClick={() => setIsMobileOpen(false)}>
                        <div className='flex'>
                            <DocumentScannerIcon />
                            <span>Scan</span>
                        </div>
                    </Link>
                    <Link to={'/avize'} className='navbar-button' onClick={() => setIsMobileOpen(false)}>
                        <div className='flex'>
                            <DraftsIcon />
                            <span>Avize</span>
                        </div>
                    </Link>
                </div>
            </div>}
        </>
    );
};

export default Navbar;
