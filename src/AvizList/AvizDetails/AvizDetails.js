import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom"; // Assuming you're using react-router for dynamic routing
import { db } from "../../firebase";  // Adjust based on your Firebase config file path
import "./AvizDetails.css"
import moment from "moment/moment";

const AvizDetails = () => {
    const { id } = useParams(); // Get the aviz ID from the URL params
    const [aviz, setAviz] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAviz = async () => {
            const avizDoc = doc(db, "avize", id);
            const avizSnapshot = await getDoc(avizDoc);

            if (avizSnapshot.exists()) {
                setAviz({ id: avizSnapshot.id, ...avizSnapshot.data() });
                setLoading(false);
            } else {
                console.error("No such document!");
            }
        };

        fetchAviz();
    }, [id]);

    const handleVerify = async () => {
        if (aviz && !aviz.verified) {
            const avizDoc = doc(db, "avize", aviz.id);
            await updateDoc(avizDoc, { verified: true });
            setAviz((prevAviz) => ({ ...prevAviz, verified: true }));
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="aviz-details-container">
            <h1 className="aviz-details-title">{aviz.title}</h1>
            <p className="aviz-details-date"><strong>Data:</strong> {moment(aviz.timestamp).format("D MMMM, YYYY [la] hh:mm A")}</p>
            <ul className="aviz-products-list">
                {aviz.scannedCodes.map((product, index) => (
                    <li key={index} className="aviz-product-item">
                        {product.Denumire} ({product.Cod}) <br /><b>Cantitate:</b> {product.Quantity}
                    </li>
                ))}
            </ul>
            <button
                className={`verify-button ${aviz.verified ? "verified" : "unverified"}`}
                onClick={handleVerify}
                disabled={aviz.verified}
            >
                {aviz.verified ? "Verificat" : "Verifica"}
            </button>
        </div>
    );
};

export default AvizDetails;
