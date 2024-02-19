import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./Home/Home";
import Navbar from "./Navbar/Navbar";
import Produse from "./Produse/Produse";
import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "./firebase";
import Notfound from "./Notfound/Notfound";

function App() {
  const [existingCodes, setExistingCodes] = useState(null);
  const [produse, setProduse] = useState(null);

  const fetch = async () => {
    await getDocs(collection(db, "produse"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
          .map((doc) => ({ ...doc.data() }));
        setExistingCodes(newData.map((coduri) => coduri.Cod))
        setProduse(newData);
      })
  }

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
              <Route path='/' element={<Home existingCodes={existingCodes} fetch={fetch} />} />
              <Route path='/produse' element={<Produse produse={produse} />} />
              <Route path='*' element={<Notfound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
