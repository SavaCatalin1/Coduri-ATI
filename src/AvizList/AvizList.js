import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";  // Adjust based on your Firebase config file path
import { Link } from "react-router-dom";
import "./AvizList.css";
import moment from "moment";

const AvizList = () => {
    const [avize, setAvize] = useState([]);

    useEffect(() => {
        const fetchAvize = async () => {
            const avizeCollection = collection(db, "avize");
            const avizeQuery = query(avizeCollection, orderBy("timestamp", "desc"));
            const avizeSnapshot = await getDocs(avizeQuery);
            const avizeList = avizeSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAvize(avizeList);
        };

        fetchAvize();
    }, []);

    return (
        <div className="aviz-list-container">
            <h1 className="aviz-list-title">Avize</h1>
            <ul className="aviz-list">
                {avize.map((aviz) => (
                    <li
                        key={aviz.id}
                        className={`aviz-item ${aviz.verified ? "verified" : "unverified"}`}
                    >
                        <Link to={`/avize/${aviz.id}`} className="aviz-link">
                            {aviz.title} ({moment(aviz.timestamp).format("D MMMM, YYYY [la] hh:mm A")})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvizList;
