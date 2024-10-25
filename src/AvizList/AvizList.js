import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./AvizList.css";
import moment from "moment";

const AvizList = () => {
  const [avize, setAvize] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more documents are available

  const fetchAvize = async (loadMore = false) => {
    setLoading(true);

    try {
      const avizeCollection = collection(db, "avize");
      const avizeQuery = loadMore && lastVisible
        ? query(avizeCollection, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(10))
        : query(avizeCollection, orderBy("timestamp", "desc"), limit(10));

      const avizeSnapshot = await getDocs(avizeQuery);

      // If no new documents are loaded, we are at the end
      if (avizeSnapshot.empty) {
        setHasMore(false);
      } else {
        const newAvize = avizeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAvize((prevAvize) => (loadMore ? [...prevAvize, ...newAvize] : newAvize));
        setLastVisible(avizeSnapshot.docs[avizeSnapshot.docs.length - 1]); // Update lastVisible
      }
    } catch (error) {
      console.error("Error fetching avize:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvize();
  }, []);

  return (
    <div className="aviz-list-container">
      <h1 className="aviz-list-title">Avize</h1>
      <ul className="aviz-list">
        {avize.map((aviz) => (
          <li key={aviz.id} className={`aviz-item ${aviz.verified ? "verified" : "unverified"}`}>
            <Link to={`/avize/${aviz.id}`} className="aviz-link">
              {aviz.title} ({moment(aviz.timestamp).format("D MMMM, YYYY [la] hh:mm A")})
            </Link>
          </li>
        ))}
      </ul>
      {loading ? (
        <p>Se incarca...</p>
      ) : (
        hasMore && (
          <button className="load-more-button" onClick={() => fetchAvize(true)}>
            Mai multe
          </button>
        )
      )}
    </div>
  );
};

export default AvizList;
