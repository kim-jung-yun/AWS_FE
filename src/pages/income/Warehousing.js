import React, { useEffect, useState } from "react";
import "../../sources/css/scanner.css"
import axios from "axios";
import { json, useNavigate } from "react-router";
import { getAuthToken } from "../../util/auth";
import Modal_search from "../../commons/Modal_search";
import PopUp from "../../commons/PopUp.js";  

export default function Warehousing({scanner}) {
    const [scanResult, setScanResult] = useState('');
    const [datas, setDatas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const branch_id = localStorage.getItem("branch_id");
     //////////////////////////////////////////////////////////////////////
    /*팝업창*/
    const [comment, setComment] = useState('');
    const [popupType, setPopupType] = useState('');
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const openPopUp = (type,comment) => {
        setPopUpOpen(true);
        setComment(comment);
        setPopupType(type);
    };
    const closePopUp = () => {
        setPopUpOpen(false);
        navigate('/branch/income/list');
    };
    //////////////////////////////////////////////////////////////////////

    useEffect(() => {
        setModalOpen(true);
    }, [scanner]);


    const handleModalOpen = () => {
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        navigate('/branch/income/list');
    };

    const handleScanWebCam = (result) => {
        setScanResult(result);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!scanResult) {
                return;
            }

            
            /* QR 유효성 검사 */
            console.log("입고내역서 스캔값 : ", scanResult,"branch_id",branch_id);
            // QR이 매장내역서인 경우 (매장 branch_id와 @가 있고 -가 없으면 , TODO 우리 지점 상품이 맞으면
            if (!scanResult.startsWith(branch_id) || !scanResult.includes('@') || scanResult.includes('-')) {
                console.log("!scanResult.startsWith(branch_id) : ",!scanResult.startsWith(branch_id));
                console.log("!scanResult.includes('@') : ",!scanResult.includes('@'));
                console.log("scanResult.includes('-') : ",scanResult.includes('-'));
                openPopUp("check", "입고내역서 QR코드를 스캔해주세요.");
                return;
            } 

            try {
                console.log("스캔결과값----------------->", scanResult);
                const token = getAuthToken();
                const response = await axios.get(
                    `/ssgtarbucks_BE/api/v1/income/inspection/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'jwtauthtoken': token
                        }, params: {
                            scanResult: scanResult
                        },
                    }
                );
                console.log("SearchPage.response >>>>>>>>>>>..", response);
                if (response.status !== 200) {
                    throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
                }
                const resData = response.data;
                console.log("resData", resData);
                navigate(`/branch/income/list/inspection/${resData}`);
            } catch (error) {
                console.error("Error during fetchData:", error);
            }
        };
        if (scanResult) {
            fetchData();
        }
    }, [scanResult, navigate]);

    return (
        <>
            <div style={{ height:"92vh", fontFamily:'Pretendard-Regular'}} className="w-full mx-auto my-auto  overflow-scroll text-center">
                { !modalOpen &&
                <div className="w-3/5 my-1 mx-auto flex justify-center items-center text-2xl h-20">
                    <input type="button" value="입고내역서 스캔" 
                    className="mt-56 text-xl w-80 font-bold shadow-lg border rounded-md h-full btn_salelist"
                    onClick={handleModalOpen}/>
                </div>
                }               
                {datas.map(function(r,i){
                    return(
                    <div style={{height:"6.8%"}} 
                        className="w-3/5 my-3 mx-auto flex justify-center items-center text-2xl"
                        key={i} >
                        <div style={{border:"0.1px solid #d5d5d5", borderRadius:"7px", background:"#f6f5efb3", height:"100%"}} 
                        className="w-11/12  flex justify-between items-center text-lg shadow-lg px-4">
                            <input type="checkbox" className="w-1/6"></input>
                            <span className="w-1/6">{r.outcome_id}</span>
                            <span className="w-2/6">CODE : {r.outcome_code}</span>
                            <span className="w-1/6">수량 : {r.outcome_amount}</span>
                            <span className="w-1/6">{r.outcome_date}</span>
                        </div>
                    </div>
                    )
                })}
            </div>
            {modalOpen && (
                <Modal_search
                    onSubmit={handleModalOpen}
                    onCancel={handleModalClose}
                    onScan={handleScanWebCam}
                    onType={"입고내역서"}
                >
                </Modal_search>)}
                {isPopUpOpen &&(
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>

    )
}
