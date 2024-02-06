import React, {useState, useRef,useEffect } from "react";
import '../sources/css/modal.css';
import QRCode from 'qrcode';

export default function Modal_QRViewer({  onCancel, onSendLocationQRValue}){
    const [qrcodeValue, setQrcodeValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const qrRef = useRef(null);

    useEffect(() => {
        setQrcodeValue(onSendLocationQRValue);
        console.log("qrcodeValue : " + qrcodeValue);
        generateQrCode();
    }, [onSendLocationQRValue,qrcodeValue]);


    const generateQrCode = async () => {
        try {
            const options = {
                width: 500,  
                height: 500, 
            };
    
            const response = await QRCode.toDataURL(qrcodeValue, options);
            setImageUrl(response);
        } catch (error) {
            console.log(error);
        }
    };

    const downloadQrCode = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = qrcodeValue+'.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    return(
        <div className="modal-container">
            <div className="w-3/12 bg-white">
                <div style={{margin:"30px", textAlign:"center", fontSize:"20px"}}>SSGTARBUCKS</div>
                <div style={{border:"1px solid black",borderRadius:"3px", width:"fit-content", margin:"0px auto"}}>
                    <img src={imageUrl} alt="png" style={{width:"400px", height:"400px", margin:"0px auto"}} />
                </div>
                <div style={{padding:"5%"}}>

                    <div style={{display:"flex",alignItems:"center", justifyContent:"center"}}>
                    
                        <button style={{fontSize:"18px", width:"30%", margin:"0px 20px", height:"50px", boxShadow:"0px 5px 5px #ccc",  borderRadius:"3px",borderRadius:"10px"}}
                            onClick={downloadQrCode}
                            className="border hover:bg-gray-100">
                            다운로드
                        </button>
                        <button style={{fontSize:"18px", width:"30%", margin:"0px 20px", height:"50px", boxShadow:"0px 5px 5px #ccc", borderRadius:"3px",borderRadius:"10px"}}
                            onClick={()=> onCancel()}
                            className="border hover:bg-gray-100"
                            >취소
                        </button>

                    </div>

                </div>
            </div>
        </div>
    )
}