import React, { useState } from 'react';
import './Produse.css';
import { ClockLoader } from "react-spinners"

const Produse = ({ produse }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddToLabels = (produs) => {
        setSelectedLabels([...selectedLabels, produs]);
    };

    const handleRemoveFromLabels = (index) => {
        const updatedLabels = [...selectedLabels];
        updatedLabels.splice(index, 1);
        setSelectedLabels(updatedLabels);
    };

    const handlePrintLabels = () => {
        window.print();
    };

    const filteredProduse = produse
        ?.filter(produs =>
            produs.Denumire.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className='margin'>
            <div className='sort'>
                <input
                    type="text"
                    placeholder="Cautati dupa Denumire..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className='input' />

            </div>
            <div className='produse-show'>
                <div>{filteredProduse && filteredProduse.map((produs, index) => (
                    <div className='item' key={produs.id}>
                        <div>
                            <div><b>Denumire:</b> {produs.Denumire}</div>
                            <div><b>Cod:</b> {produs.Cod}</div>
                            <div className='created'>{produs.created}</div>
                        </div>
                        <div>
                            <button onClick={() => handleAddToLabels(produs)}>
                                +
                            </button>
                        </div>
                    </div>
                ))}
                </div>
                {!filteredProduse && <ClockLoader color="#36d7b7" className='margin-loading' />}
                <div>
                    {filteredProduse && <div className="selected-labels">
                        <h2>Selected Labels:</h2>
                        {/* <button onClick={handlePrintLabels}>
                        Print
                    </button> */}
                        <div className="label-container">
                            {selectedLabels.map((label, index) => (
                                <div key={index} className="label">
                                    <div className="label-content">
                                        <span>{label.Denumire}</span>
                                        <span>{label.Cod}</span>
                                    </div>
                                    <button onClick={() => handleRemoveFromLabels(index)}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>

        </div>
    );
};

export default Produse;
