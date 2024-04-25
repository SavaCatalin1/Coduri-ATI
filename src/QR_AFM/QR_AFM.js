import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './QR_AFM.css'
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';

const QRCodeForm = () => {
    const qrCodeRef = useRef(null);
    const qrCodeRef2 = useRef(null);
    const [isGenerateClicked, setIsGenerateClicked] = useState(false);
    // text mode
    const [mode, setMode] = useState(false);
    const [inputText, setInputText] = useState('');


    const [formData, setFormData] = useState({
        tipSolicitant: '',
        numarFactura: '',
        dataFactura: null, // Changed to null initially
        judet: '',
        comunaOras: '',
        sectorSat: '',
        numeStrada: '',
        nrStrada: '',
        numePrenume: '',
        cnpCif: '',
        putereInstalata: '',
        serieIdentificareInvertor: [],
        serieIdentificarePanou: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDataFacturaChange = (date) => {
        setFormData({ ...formData, dataFactura: date });
    };

    const handleAddSerieIdentificareInvertor = () => {
        setFormData({
            ...formData,
            serieIdentificareInvertor: [...formData.serieIdentificareInvertor, ''],
        });
    };

    const handleSerieIdentificareInvertorChange = (index, value) => {
        const updatedSerieIdentificareInvertor = [...formData.serieIdentificareInvertor];
        updatedSerieIdentificareInvertor[index] = value;
        setFormData({
            ...formData,
            serieIdentificareInvertor: updatedSerieIdentificareInvertor,
        });
    };

    const handleAddSerieIdentificarePanou = () => {
        setFormData({
            ...formData,
            serieIdentificarePanou: [...formData.serieIdentificarePanou, ''],
        });
    };

    const handleSerieIdentificarePanouChange = (index, value) => {
        const updatedSerieIdentificarePanou = [...formData.serieIdentificarePanou];
        updatedSerieIdentificarePanou[index] = value;
        setFormData({
            ...formData,
            serieIdentificarePanou: updatedSerieIdentificarePanou,
        });
    };


    const generateQRCodeText = () => {
        const {
            tipSolicitant,
            numarFactura,
            dataFactura,
            judet,
            comunaOras,
            sectorSat,
            numeStrada,
            nrStrada,
            numePrenume,
            cnpCif,
            putereInstalata,
            serieIdentificareInvertor,
            serieIdentificarePanou,
        } = formData;

        const updatedNumePrenume = numePrenume.replace(/\s/g, '-');
        const updatedPutereInstalata = putereInstalata.replace('.', ',');

        let qrCodeText = `${tipSolicitant}|${numarFactura}|${dataFactura?.toLocaleDateString('en-GB')}|${judet}|${comunaOras}|${sectorSat}|${numeStrada}|${nrStrada}|${updatedNumePrenume}|${cnpCif}|${updatedPutereInstalata}`;

        serieIdentificareInvertor.forEach((serie, index) => {
            qrCodeText += `|${serieIdentificareInvertor[index]}`;
        });

        qrCodeText += '|START_PANOU';

        serieIdentificarePanou.forEach((serie, index) => {
            qrCodeText += `|${serieIdentificarePanou[index]}`;
        });

        return qrCodeText;
    };


    const downloadQRCode = () => {
        html2canvas(qrCodeRef.current).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'QRCode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    const downloadQRCode2 = () => {
        html2canvas(qrCodeRef2.current).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'QRCode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <>
            <div onClick={() => setMode(prev => !prev)} className='mode-button'>{mode === true ? "Inputs" : "Text"}</div>
            {mode === false && <div className='form-wrapper'>
                <form className='form-container'>
                    <div className='form-part1'>
                        <label className='form-label'>Tip solicitant:</label>
                        <select name="tipSolicitant" onChange={handleChange} value={formData.tipSolicitant}>
                            <option value="" hidden></option>
                            <option value="1">Persoana fizica</option>
                            <option value="2">Unitate de cult</option>
                        </select>

                        <label className='form-label'>Numar factura</label>
                        <input type="text" name="numarFactura" onChange={handleChange} value={formData.numarFactura} />

                        <label className='form-label'>Data factura</label>
                        <DatePicker
                            selected={formData.dataFactura}
                            onChange={handleDataFacturaChange}
                            dateFormat="dd/MM/yyyy"
                        />

                        <label className='form-label'>{formData.tipSolicitant === '1' ? 'Nume + Prenume' : 'Denumire unitate'}</label>
                        <input type="text" name="numePrenume" onChange={handleChange} value={formData.numePrenume} />

                        <label className='form-label'>{formData.tipSolicitant === '1' ? 'CNP' : 'CIF'}</label>
                        <input type="text" name="cnpCif" onChange={handleChange} value={formData.cnpCif} />

                        <label className='form-label'>Putere instalata</label>
                        <input type="text" name="putereInstalata" onChange={handleChange} value={formData.putereInstalata} />


                    </div>
                    <div className='form-part2'>
                        <label className='form-label'>Judet</label>
                        <input type="text" name="judet" onChange={handleChange} value={formData.judet} />

                        <label className='form-label'>Comuna/Oras</label>
                        <input type="text" name="comunaOras" onChange={handleChange} value={formData.comunaOras} />

                        <label className='form-label'>Sector/Sat</label>
                        <input type="text" name="sectorSat" onChange={handleChange} value={formData.sectorSat} />

                        <label className='form-label'>Nume strada</label>
                        <input type="text" name="numeStrada" onChange={handleChange} value={formData.numeStrada} />

                        <label className='form-label'>Nr. strada</label>
                        <input type="text" name="nrStrada" onChange={handleChange} value={formData.nrStrada} />

                    </div>
                    <div className='form-part3'>
                        <div type="button" onClick={handleAddSerieIdentificareInvertor} className='button-form'>Invertor +</div>

                        {formData.serieIdentificareInvertor.map((serie, index) => (
                            <div key={index} className='panou-item'>
                                <label className='form-label'>Serie de identificare invertor {index + 1}</label>
                                <input
                                    type="text"
                                    value={formData.serieIdentificareInvertor[index]}
                                    onChange={(e) => handleSerieIdentificareInvertorChange(index, e.target.value)}
                                />
                            </div>
                        ))}

                        <div type="button" onClick={handleAddSerieIdentificarePanou} className='button-form'>Panou +</div>

                        {formData.serieIdentificarePanou.map((serie, index) => (
                            <div key={index} className='panou-item'>
                                <label className='form-label'>Serie de identificare panou fotovoltaic {index + 1}</label>
                                <input
                                    type="text"
                                    value={formData.serieIdentificarePanou[index]}
                                    onChange={(e) => handleSerieIdentificarePanouChange(index, e.target.value)}
                                />
                            </div>
                        ))}

                    </div>
                </form>
                <div onClick={() => {
                    generateQRCodeText()
                    setIsGenerateClicked(true)
                }} className='button-form'>Genereaza QR</div>
                {isGenerateClicked && <>
                    <div className="qr-code-container">
                        <div ref={qrCodeRef}><QRCode value={generateQRCodeText()} /></div>
                    </div>
                    <div onClick={downloadQRCode} className='download-qr'><DownloadIcon fontSize='large' />Download</div>
                </>}
            </div>}
            {mode === true &&
                <div className='form-wrapper'>
                    <textarea onChange={(e) => setInputText(e.target.value)} className='text-mode-input'></textarea>
                    <div className="qr-code-container">
                        <div ref={qrCodeRef2}><QRCode value={inputText} /></div>
                    </div>
                    <div onClick={downloadQRCode2} className='download-qr'><DownloadIcon fontSize='large' />Download</div>
                </div>}
        </>
    );
};

export default QRCodeForm;
