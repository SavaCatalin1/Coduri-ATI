import React, { useState, useEffect, useRef } from 'react';
import './Produse.css';
import { ClockLoader } from "react-spinners"
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';

const Produse = ({ produse }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [selectedEmptyLabels, setSelectedEmptyLabels] = useState([]);
    const componentRef = useRef(); // Ref for the component to be printed

    useEffect(() => {
        const emptyLabelsCount = 48 - selectedLabels.length; // 12 rows x 4 labels
        const emptyLabels = Array.from({ length: emptyLabelsCount }).map((_, index) => ({
            id: `empty_${index}`
        }));
        setSelectedEmptyLabels(emptyLabels);
    }, [selectedLabels]); // Re-calculate empty labels when selectedLabels change

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
                <SearchIcon fontSize='large' sx={{ color: "#000080" }} />
            </div>
            <div className='produse-show'>
                <div className='prod-list'>
                    {filteredProduse && filteredProduse.map((produs, index) => (
                        <div className='item' key={index}>
                            <div>
                                <div><b>Denumire:</b> {produs.Denumire}</div>
                                <div><b>Cod:</b> {produs.Cod}</div>
                                <div className='created'>{produs.created}</div>
                            </div>
                            <div>
                                <button onClick={() => handleAddToLabels(produs)} className='add-label'>
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!filteredProduse && <ClockLoader color="#000080" className='margin-loading' />}
                <div>
                    {filteredProduse && <div className="selected-labels">
                        <ReactToPrint
                            trigger={() => <PrintIcon className='print-btn'/>}
                            content={() => componentRef.current}
                        />
                        <div className="label-container" ref={componentRef}>
                            {/* Render selected labels */}
                            {selectedLabels.map((label, index) => (
                                <div key={index} className="label">
                                    <div className="label-content">
                                        <span className='barcode'>{label.Cod}</span>
                                        {/* <Barcode value={label.Cod} width={4} height={100} margin={0} textMargin={0}/> */}
                                        <span className='label-title'>{label.Denumire}</span>
                                    </div>
                                    <div onClick={() => handleRemoveFromLabels(index)} className='delete-label'><DeleteIcon /></div>
                                </div>
                            ))}
                            {/* Render empty labels to fill the page */}
                            {selectedEmptyLabels?.map((label, index) => (
                                <div key={label.id} className="label" >
                                    <div className="label-content">
                                        <span></span>
                                        <span></span>
                                    </div>
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
