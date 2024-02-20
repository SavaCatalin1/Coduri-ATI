import React, { useState, useEffect, useRef } from 'react';
import './Produse.css';
import { ClockLoader } from "react-spinners"
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';

const ITEMS_PER_PAGE = 48; // Number of labels per page

const Produse = ({ produse }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [selectedEmptyLabels, setSelectedEmptyLabels] = useState([]);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectAll, setSelectAll] = useState(false);
    const [bulkMode, setBulkMode] = useState(false); // Flag to activate bulk functionality
    const componentRef = useRef(); // Ref for the component to be printed
    const [bool, setBool] = useState(false)

    useEffect(() => {
        const emptyLabelsCount = ITEMS_PER_PAGE - (selectedLabels.length % ITEMS_PER_PAGE);
        const emptyLabels = Array.from({ length: emptyLabelsCount }).map((_, index) => ({
            id: `empty_${index}`
        }));
        setSelectedEmptyLabels(emptyLabels);
    }, [selectedLabels]); // Re-calculate empty labels when selectedLabels change

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddToLabels = (produs) => {
        if (bulkMode) {
            const isSelected = selectedLabels.some(label => label.id === produs.id);
            if (isSelected) {
                const updatedLabels = selectedLabels.filter(label => label.id !== produs.id);
                setSelectedLabels(updatedLabels);
            } else {
                setSelectedLabels([...selectedLabels, produs]);
            }
        } else {
            setSelectedLabels([...selectedLabels, produs]);
        }
    };

    const handleRemoveFromLabels = (id) => {
        const updatedLabels = selectedLabels.filter(label => label.id !== id);
        setSelectedLabels(updatedLabels);
    };
    const handleAddSkipLabel = (id) => {
        setSelectedLabels([...selectedLabels, {
            id: `empty_${id}`
        }]);
    }

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedLabels(selectAll ? [] : filteredProduse);
    };

    const handleToggleBulkMode = () => {
        setBulkMode(!bulkMode);
    };

    const sortedProduse = [...produse].sort((a, b) => {
        const dateA = new Date(a.Created).getTime();
        const dateB = new Date(b.Created).getTime();
        return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
    });

    const filteredProduse = sortedProduse
        ?.filter(produs =>
            produs.Denumire.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return (
        <div className='margin'>
            <div className='sort'>
                <div className='filters'>
                    <div className='bulk-mode-toggle'>
                        <div onClick={handleToggleBulkMode} className='bulk-toggle'>Bulk</div>
                        {bulkMode && (
                            <div onClick={handleSelectAll} className='select-all'>All</div>
                        )}
                    </div>
                    <div className='flex-arrow'>
                        {bool ? <ArrowUpwardIcon sx={{ color: "#000080" }} fontSize='large' className='date-sort' onClick={() => {
                            handleSort('ascending')
                            setBool(!bool)
                        }} />
                            :
                            <ArrowDownwardIcon sx={{ color: "#000080" }} fontSize='large' className='date-sort' onClick={() => {
                                handleSort('descending')
                                setBool(!bool)
                            }} />}
                        <b>Data</b>
                    </div>
                </div>
                <div className='search-bar'>
                    <input
                        type="text"
                        placeholder="Cautati dupa Denumire..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='input' />
                    <SearchIcon fontSize='large' sx={{ color: "#000080" }} />
                </div>
                <div></div>

            </div>
            <div className='produse-show'>
                <div className='prod-list'>
                    {filteredProduse && filteredProduse.slice(startIndex, endIndex).map((produs, index) => (
                        <div className='item' key={index}>
                            <div>
                                <div><b>Denumire:</b> {produs.Denumire}</div>
                                <div><b>Cod:</b> {produs.Cod}</div>
                                <div className='created'>{new Date(produs.Created).toLocaleString()}</div>
                            </div>
                            <div>
                                {bulkMode ? (
                                    <input
                                        type="checkbox"
                                        onChange={() => handleAddToLabels(produs)}
                                        checked={selectedLabels.some(label => label.id === produs.id)}
                                    />
                                ) : (
                                    <button onClick={() => handleAddToLabels(produs)} className='add-label'>
                                        +
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {!filteredProduse && <ClockLoader color="#000080" className='margin-loading' />}
                <div>
                    {filteredProduse && <div className="selected-labels">
                        <div className='options-page'>
                            <ReactToPrint
                                trigger={() => <PrintIcon className='print-btn' />}
                                content={() => componentRef.current}
                            />
                            {selectedLabels.length > ITEMS_PER_PAGE && (
                                <div className="pagination">
                                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                                    <button onClick={handleNextPage} disabled={endIndex >= selectedLabels.length}>Next</button>
                                </div>
                            )}
                            <div onClick={() => handleAddSkipLabel()} className='add-blank'><AddIcon /> Blank</div>
                        </div>
                        <div className="label-container" ref={componentRef}>
                            {/* Render selected labels */}
                            {selectedLabels.map((label, index) => (
                                <div key={index} className="label">
                                    <div className="label-content">
                                        <span className='barcode'>{label.Cod}</span>
                                        {/* <Barcode value={label.Cod} width={4} height={100} margin={0} textMargin={0}/> */}
                                        <span className='label-title'>{label.Denumire}</span>
                                    </div>
                                    <div onClick={() => handleRemoveFromLabels(label.id)} className='delete-label'><DeleteIcon /></div>
                                </div>
                            ))}
                            {/* Render empty labels to fill the page */}
                            {selectedEmptyLabels.slice(startIndex, endIndex).map((label, index) => (
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
