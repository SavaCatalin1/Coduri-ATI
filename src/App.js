import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import Produse from "./Produse/Produse";
import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "./firebase";

function App() {
  const [existingCodes, setExistingCodes] = useState(null);
  const [produse, setProduse] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      await getDocs(collection(db, "produse"))
        .then((querySnapshot) => {
          const newData = querySnapshot.docs
            .map((doc) => ({ ...doc.data() }));
          setExistingCodes(newData.map((coduri) => coduri.Cod))
          setProduse(newData);
        })
    }
    fetch()
  }, [produse])

  return (
    <div>
      <BrowserRouter>
        <div className="page-flex">
          <Navbar />
          <Routes>
            <Route path='/' element={<Home existingCodes={existingCodes} />} />
            <Route path='/produse' element={<Produse produse={produse} />} />
            {/* <Route path='*' element={<Notfound />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
