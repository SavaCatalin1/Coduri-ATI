import React, { useState } from 'react'
import './Home.css'
import { db } from '../firebase'
import { addDoc, collection } from '@firebase/firestore'

const Home = ({ existingCodes, fetch }) => {
    const [category, setCategory] = useState("101");
    const [generatedCode, setGeneratedCode] = useState('');
    const [name, setName] = useState(null);

    const generateUniqueCode = async () => {
        const randomDigits = Math.floor(Math.random() * 10000000); // Generate 7 random digits
        const uniqueCode = `${category}${String(randomDigits).padStart(7, '0')}`;
        if (existingCodes) {
            if (!existingCodes.includes(uniqueCode)) {
                setGeneratedCode(uniqueCode);
                try {
                    const timestamp = Date.now();
                    await addDoc(collection(db, "produse"), { Denumire: name, Cod: uniqueCode, created: timestamp }).then(() => fetch())
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            } else {
                generateUniqueCode(); // Regenerate code if not unique
            }
        }
        else {
            alert("Nu exista coduri!")
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleGenerateCode = () => {
        if (category) {
            if (name)
                generateUniqueCode();
            else
                alert("Introduceti denumirea produsului!")
        } else {
            alert('Alegeti o categorie!');
        }
    };


    return (
        <div className='home-flex'>
            <div>
                <div className='group noselect'><b>Denumire produs</b></div>
                <input onChange={(e) => setName(e.target.value)} className='width'></input>
            </div>
            <div>
                <div className='group noselect'><b>Categorie</b></div>
                <select value={category} onChange={handleCategoryChange} className='categorie-select noselect width'>
                    <option value={"101"}>Panouri Fotovoltaice</option>
                    <option value={"102"}>Structura Panouri Fotovoltaice</option>
                    <option value={"103"}>Accesorii Structura Panouri</option>
                    <option value={"104"}>Invertoare</option>
                    <option value={"105"}>Baterii</option>
                    <option value={"106"}>Accesorii Panou Comanda</option>
                    <option value={"107"}>Tablouri Electrice</option>
                    <option value={"108"}>Echipamente si Accesorii Tablouri</option>
                    <option value={"109"}>Pat Cablu Metalic</option>
                    <option value={"110"}>Accesorii Pat Cablu Metalic</option>
                    <option value={"111"}>Pat Cablu Plastic</option>
                    <option value={"112"}>Accesorii Pat Cablu Plastic</option>
                    <option value={"113"}>Cablu Curent Continuu</option>
                    <option value={"114"}>Cablu Curent Alternativ</option>
                    <option value={"115"}>Accesorii Cablu</option>
                    <option value={"116"}>Tubulatura Protectie Cablu</option>
                    <option value={"117"}>Corpuri Iluminat Electric</option>
                    <option value={"118"}>Aparataj Electric</option>
                    <option value={"119"}>Material Marunt</option>
                    <option value={"121"}>Consumabile</option>
                    <option value={"122"}>Materiale Echipamente Protectie</option>
                    <option value={"123"}>Materiale Auto</option>
                    <option value={"124"}>Materiale Constructii</option>
                    <option value={"125"}>Materiale Instalatii Sanitare / Gaze</option>
                    <option value={"126"}>Materiale Impamantare</option>
                    <option value={"127"}>Alte Materiale</option>
                    <option value={"200"}>Scule</option>
                </select>
            </div>
            <button onClick={handleGenerateCode} className='noselect button'>Genereaza Cod</button>
            {generatedCode && (
                <div className='generated-flex'>
                    <span className='noselect'>Codul Generat:</span> <b>{generatedCode}</b>
                </div>
            )}
        </div>
    )
}

export default Home