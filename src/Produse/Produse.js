import React, { useState, useEffect, useRef, useId } from 'react';
import './Produse.css';
import { ClockLoader } from "react-spinners"
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { v1 as uuidv1 } from 'uuid';
// import Import from "./Import/Import"

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
    const [twoColumnLayout, setTwoColumnLayout] = useState(false);
    const [ITEMS_PER_PAGE, setITEMS_PER_PAGE] = useState(48);


    useEffect(() => {
        const emptyLabelsCount = ITEMS_PER_PAGE - (selectedLabels.length % ITEMS_PER_PAGE);
        const emptyLabels = Array.from({ length: emptyLabelsCount }).map((_, index) => ({
            id: `empty_${index}`
        }));
        setSelectedEmptyLabels(emptyLabels);
        console.log(emptyLabelsCount)
    }, [selectedLabels, ITEMS_PER_PAGE]); // Re-calculate empty labels when selectedLabels change

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
    const handleAddSkipLabel = () => {
        const id = uuidv1();
        setSelectedLabels([...selectedLabels, {
            id: `empty_${id}`
        }]);
    }

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const handleNextPage = () => {
        if (endIndex < produse.length)
            setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage != 1)
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
        const dateA = new Date(Number(a.Created)).getTime();
        const dateB = new Date(Number(b.Created)).getTime();
        return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
    });

    const filteredProduse = sortedProduse
        ?.filter(produs =>
            produs.Denumire.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    console.log(startIndex)

    return (
        <div className='margin'>
            {/* <Import/> */}
            <div className='sort'>
                <div className='filters'>
                    <div className='left-filters'>
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
                    {produse.length > ITEMS_PER_PAGE && (
                        <div className="pagination">
                            <div onClick={handlePrevPage} className={currentPage === 1 ? 'arrow-disabled' : 'page-arrow'}><ArrowLeftIcon fontSize='large' /></div>
                            <div onClick={handleNextPage} disabled={endIndex >= produse.length} className={endIndex >= produse.length ? 'arrow-disabled' : 'page-arrow'}><ArrowRightIcon fontSize='large' /></div>
                        </div>
                    )}
                </div>
                <div>
                </div>

            </div>
            <div className='produse-show'>
                <div className='prod-list'>
                    {filteredProduse && filteredProduse.slice(startIndex, endIndex).map((produs, index) => (
                        <div className='item' key={index}>
                            <div>
                                <div><b>Denumire: </b> {produs.Denumire}</div>
                                <div><b>Pret vanzare: </b>{produs.Pret}</div>
                                <div><b>Cod: </b> {produs.Cod}</div>     
                                <div className='created'>{new Date(Number(produs.Created)).toLocaleString()}</div>
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
                            <div className='print-cont'><ReactToPrint
                                trigger={() => <PrintIcon className='print-btn' />}
                                content={() => componentRef.current}
                            />
                            </div>
                            <div className='page-sizes-container'>
                                <div className={twoColumnLayout === false ? 'page-size-selected' : 'page-size'} onClick={() => {
                                    setTwoColumnLayout(false)
                                    setITEMS_PER_PAGE(48)
                                }}>20x4</div>
                                <div className={twoColumnLayout === true ? 'page-size-selected' : 'page-size'} onClick={() => {
                                    setTwoColumnLayout(true)
                                    setITEMS_PER_PAGE(10)
                                }}>5x2</div>
                            </div>
                            <div onClick={() => handleAddSkipLabel()} className='add-blank'><AddIcon /> Blank</div>
                        </div>
                        <div className={`label-container ${twoColumnLayout ? 'two-column-layout' : ''}`} ref={componentRef}>
                            {/* Render selected labels */}
                            {selectedLabels.map((label, index) => (
                                <div key={index} className="label">
                                    <div className="label-content">
                                        <span className='barcode'>{label.Cod !== "" ? (label.Cod) : ""}</span>
                                        <span className='label-title'>{label.Denumire}</span>
                                    </div>
                                    <div onClick={() => handleRemoveFromLabels(label.id)} className='delete-label'><DeleteIcon /></div>
                                </div>
                            ))}
                            {/* Render empty labels to fill the page */}
                            {selectedEmptyLabels.map((label, index) => (
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
