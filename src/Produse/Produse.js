import React, { useState } from 'react';
import './Produse.css';
import { ClockLoader } from "react-spinners"

// import Import from './Import/Import';

const Produse = ({ produse }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredProduse = produse?.filter(produs =>
        produs.Denumire.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='margin'>
            <input
                type="text"
                placeholder="Cautati dupa Denumire..."
                value={searchQuery}
                onChange={handleSearchChange}
                className='input' />
            <div className='produse-show'>
                {filteredProduse ? filteredProduse.map(produs => (
                    <div className='item' key={produs.id}>
                        <div><b>Denumire:</b> {produs.Denumire}</div>
                        <div><b>Cod:</b> {produs.Cod}</div>
                    </div>
                )) : <ClockLoader color="#36d7b7" className='margin-loading' />}
            </div>
        </div>
    );
};

export default Produse;
