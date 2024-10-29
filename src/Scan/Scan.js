import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Html5Qrcode } from "html5-qrcode";
import "./Scan.css";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const Scan = ({ produse }) => {
    const [scannedCodes, setScannedCodes] = useState([]);
    const [currentScan, setCurrentScan] = useState("");
    const [denumire, setDenumire] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isPromptQuantity, setIsPromptQuantity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [isTitleConfirmed, setIsTitleConfirmed] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [html5QrCode, setHtml5QrCode] = useState(null);
    const [buffer, setBuffer] = useState(""); // Initialize buffer state for handling key inputs


    useEffect(() => {
        if (!isTitleConfirmed) return;

        const handleKeyDown = (e) => {
            if (e.key >= "0" && e.key <= "9") {
                setBuffer((prev) => prev + e.key);
            } else if (e.key === "Enter") {
                processScan(buffer);
                setBuffer("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [buffer, isTitleConfirmed]);

    const processScan = (code) => {
        code = String(code).trim(); // Ensure `code` is always a string
        if (code.length !== 10) return;

        setIsLoading(true);
        const foundProduct = produse.find((product) => product.Cod === code);

        if (foundProduct) {
            setCurrentScan(code);
            setDenumire(foundProduct.Denumire);
            setIsPromptQuantity(true);
        } else {
            alert("Produsul nu a fost gasit");
            setDenumire("");
        }

        setIsLoading(false);
    };

    const startScanning = () => {
        // Initialize html5QrCode if it hasn't been initialized
        if (!html5QrCode) {
            const qrCodeScanner = new Html5Qrcode("reader");
            setHtml5QrCode(qrCodeScanner);

            // Start scanning after initialization
            qrCodeScanner
                .start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => handleCameraScan(decodedText),
                    (errorMessage) => setCameraError(errorMessage)
                )
                .catch((err) => setCameraError(`Eroare accesând camera: ${err}`));
        } else {
            // If already initialized, start directly
            html5QrCode
                .start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    (decodedText) => handleCameraScan(decodedText),
                    (errorMessage) => setCameraError(errorMessage)
                )
                .catch((err) => setCameraError(`Eroare accesând camera: ${err}`));
        }
    };

    const stopScanning = () => {
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                console.log("Camera stopped.");
            }).catch((err) => console.error("Failed to stop camera", err));
        }
    };

    const handleCameraScan = (code) => {
        if (code) {
            processScan(code);
            stopScanning(); // Stop the camera after a successful scan if desired
        }
    };

    const handleQuantitySubmit = () => {
        if (quantity && denumire) {
            const newEntry = { Cod: currentScan, Denumire: denumire, Quantity: quantity };
            setScannedCodes([...scannedCodes, newEntry]);

            setCurrentScan("");
            setDenumire("");
            setQuantity("");
            setIsPromptQuantity(false);
        } else {
            alert("Introduceti o cantitate valida.");
        }
    };

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
            const now = new Date();
            await addDoc(collection(db, "avize"), {
                title,
                scannedCodes,
                timestamp: now.toISOString(),
                verified: false,
            });

            alert(`Aviz salvat!`);
            setScannedCodes([]);
            setTitle("");
            setIsTitleConfirmed(false);
        } catch (e) {
            console.error("Error saving document: ", e);
            alert("Eroare la salvarea documentului");
        }
    };

    const confirmTitle = () => {
        if (title.trim()) {
            setIsTitleConfirmed(true);
        } else {
            alert("Introduceti un titlu valid.");
        }
    };

    return (
        <div className="scanner-container">
            <h1 className="scanner-title">Scanare Coduri</h1>

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
                    <div className="confirmed-title-container">
                        <span className="confirmed-title">
                            <strong>Titlu:</strong> {title}
                        </span>
                    </div>

                    <button onClick={() => {
                        if (cameraEnabled) {
                            stopScanning();
                        } else {
                            startScanning();
                        }
                        setCameraEnabled(!cameraEnabled);
                    }} className="toggle-camera-button">
                        {cameraEnabled ? <CameraAltIcon fontSize="large"/> : <DocumentScannerIcon fontSize="large"/>}
                    </button>

                    <div id="reader" style={{ width: "100%", margin: "auto" }}></div>

                    {/* {cameraError && <p className="camera-error">{cameraError}</p>} */}

                    {isLoading && <p className="loading-text">Cautare produs...</p>}

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

                    <button className="save-button" onClick={saveToFirestore}>
                        Salveaza Aviz
                    </button>
                </>
            )}
        </div>
    );
};

export default Scan;
