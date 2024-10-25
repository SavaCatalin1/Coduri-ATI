import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase";  // Adjust based on your Firebase config file path
import "./Scan.css"

const Scan = ({ produse }) => {
    const [scannedCodes, setScannedCodes] = useState([]);
    const [currentScan, setCurrentScan] = useState("");
    const [denumire, setDenumire] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isPromptQuantity, setIsPromptQuantity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [buffer, setBuffer] = useState(""); // To buffer the input from scanner
    const [title, setTitle] = useState(""); // To store the title of the document
    const [isTitleConfirmed, setIsTitleConfirmed] = useState(false); // To track if title is confirmed

    useEffect(() => {
        if (!isTitleConfirmed) return; // Only add key listener if title is confirmed

        const handleKeyDown = (e) => {
            // Check if input is a number or Enter key
            if (e.key >= "0" && e.key <= "9") {
                setBuffer((prev) => prev + e.key); // Append digit to the buffer
            } else if (e.key === "Enter") {
                processScan(buffer); // Process barcode when Enter is pressed
                setBuffer(""); // Clear buffer after processing
            }
        };

        // Add event listener for keydown
        window.addEventListener("keydown", handleKeyDown);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [buffer, isTitleConfirmed]); // Re-run effect if buffer or isTitleConfirmed changes

    const processScan = (code) => {
        if (code.trim().length !== 10) {
            return;
        }

        setIsLoading(true); // Start loading

        // Search for the product in the produse array
        const foundProduct = produse.find((product) => product.Cod === code);

        if (foundProduct) {
            setCurrentScan(code);
            setDenumire(foundProduct.Denumire);
            setIsPromptQuantity(true); // Prompt for quantity input
        } else {
            alert("Product not found");
            setDenumire("");
        }

        setIsLoading(false); // End loading after product search
    };

    // Function to handle the quantity input and save the scanned product
    const handleQuantitySubmit = () => {
        if (quantity && denumire) {
            const newEntry = { Cod: currentScan, Denumire: denumire, Quantity: quantity };
            setScannedCodes([...scannedCodes, newEntry]);

            // Reset for the next scan
            setCurrentScan("");
            setDenumire("");
            setQuantity("");
            setIsPromptQuantity(false);
        } else {
            alert("Introduceti o cantitate valida.");
        }
    };

    // Function to save the scanned codes and quantities in Firestore collection "avize"
    const saveToFirestore = async () => {
        if (scannedCodes.length === 0) {
            alert("Nu s-au scanat produse.");
            return;
        }

        if (!title.trim()) {
            alert("Adaugati un titlu.");
            return;
        }

        try {
            const now = new Date(); // Get the current date and time
            const docRef = await addDoc(collection(db, "avize"), {
                title,
                scannedCodes,
                timestamp: now.toISOString(),
                verified: false
            });

            alert(`Aviz salvat!`);

            // Reset the form after saving
            setScannedCodes([]);
            setTitle(""); // Clear title after saving
            setIsTitleConfirmed(false); // Reset title confirmation
        } catch (e) {
            console.error("Error saving document: ", e);
            alert("Error saving document");
        }
    };

    // Function to confirm the title and enable scanning
    const confirmTitle = () => {
        if (title.trim()) {
            setIsTitleConfirmed(true); // Allow scanning when title is confirmed
        } else {
            alert("Introduceti un titlu valid.");
        }
    };

    return (
        <div className="scanner-container">
            <h1 className="scanner-title">Scanare Coduri</h1>

            {/* Title input section */}
            {!isTitleConfirmed ? (
                <div className="title-input-container">
                    <input
                        type="text"
                        className="title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Introduceti titlul documentului"
                    />
                    <button className="confirm-title-button" onClick={confirmTitle}>
                        OK
                    </button>
                </div>
            ) : (
                <>
                    {/* Display the confirmed title */}
                    <div className="confirmed-title-container">
                        <span className="confirmed-title">
                            <strong>Titlu:</strong> {title}
                        </span>
                    </div>

                    {/* Display loading state */}
                    {isLoading && <p className="loading-text">Cautare produs...</p>}

                    {/* Display scanned product name and prompt for quantity */}
                    {denumire && isPromptQuantity && (
                        <div className="quantity-input-container">
                            <h2 className="product-name">Produs: {denumire}</h2>
                            <input
                                type="number"
                                className="quantity-input"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Cantitate:"
                            />
                            <button className="submit-quantity-button" onClick={handleQuantitySubmit}>
                                Adauga
                            </button>
                        </div>
                    )}

                    {/* Display scanned codes */}
                    <div className="scanned-products-container">
                        <h3 className="scanned-products-title">Produse scanate:</h3>
                        <ul className="scanned-products-list">
                            {scannedCodes.map((item, index) => (
                                <li className="scanned-product-item" key={index}>
                                    <div>{item.Denumire} (Cod: {item.Cod})</div>
                                    <div><b>Cantitate:</b> {item.Quantity}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Save scanned codes */}
                    <button className="save-button" onClick={saveToFirestore}>
                        Salveaza Aviz
                    </button>
                </>
            )}
        </div>
    );
};

export default Scan;
