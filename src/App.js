import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import Produse from "./Produse/Produse";
import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "./firebase";
import Notfound from "./Notfound/Notfound";
import QR_AFM from "./QR_AFM/QR_AFM";
import Scan from "./Scan/Scan";
import AvizList from "./AvizList/AvizList";
import AvizDetails from "./AvizList/AvizDetails/AvizDetails";

const CACHE_KEY = "produseData";
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

function App() {
  const [existingCodes, setExistingCodes] = useState(null);
  const [produse, setProduse] = useState([]);

  const fetch = async () => {
    try {
      // Check localStorage for cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = Date.now();

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);

        // Use cached data if it's still fresh
        if (now - timestamp < CACHE_EXPIRATION) {
          setExistingCodes(data.map((coduri) => coduri.Cod));
          setProduse(data);
          return;
        }
      }

      // Fetch from Firestore if no cache or cache is expired
      const querySnapshot = await getDocs(collection(db, "produse"));
      const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setExistingCodes(newData.map((coduri) => coduri.Cod));
      setProduse(newData);

      // Save to localStorage with a timestamp
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: newData, timestamp: now }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetch()
  }, [])

  return (
    <div>
      <BrowserRouter>
        <div >
          <Navbar />
          <div className="page-flex">
            <Routes>
              <Route path='/' element={<Home existingCodes={existingCodes} fetch={fetch} setExistingCodes={setExistingCodes} setProduse={setProduse}/>} />
              <Route path='/produse' element={<Produse produse={produse} setProduse={setProduse}/>} />
              <Route path='/qrafm' element={<QR_AFM />} />
              <Route path='/scan' element={<Scan produse={produse} setProduse={setProduse}/>} />
              <Route path='/avize' element={<AvizList />} />
              <Route path="/avize/:id" element={<AvizDetails />} />
              <Route path='*' element={<Notfound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
