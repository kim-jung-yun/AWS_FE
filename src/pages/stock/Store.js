import React, { useState, useEffect } from "react";
import Pagination from "../../commons/Pagination.js";
import axios from "axios";
import { getAuthToken } from "../../util/auth.js";
import { json, useLoaderData, useNavigate } from "react-router";
import Modal_search from "../../commons/Modal_search.js";
import PopUp from "../../commons/PopUp.js"; 
import dayjs from "dayjs";

export default function Store() {
    const [datas, setDatas] = useState(useLoaderData());
    const [scanResult, setScanResult] = useState('');
    const [itemId, setitemId] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

     //////////////////////////////////////////////////////////////////////
    /*팝업창*/
    const [comment, setComment] = useState('');
    const [popupType, setPopupType] = useState('');
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const branch_id = localStorage.getItem("branch_id");
    const openPopUp = (type,comment) => {
        setPopUpOpen(true);
        setComment(comment);
        setPopupType(type);
    };
    const closePopUp = () => {
        setPopUpOpen(false);
        if(comment=="보관장소에 등록되었습니다."){
        window.location.reload();
         }
    };
    //////////////////////////////////////////////////////////////////////


    const handleScanWebCam = (result) => {
        setScanResult(result);
    };

    const handleclick = (itemId) => {
        setModalOpen(!modalOpen);
        setitemId(itemId);

    };

    useEffect(() => {
        const fetchData = async (itemId) => {
            if (!scanResult || !itemId) {
                return;
            }

            /* QR 유효성 검사 */
            console.log("handleMoveLocationQrValue (장소 QR값) : ", scanResult);
            // 올바르지 않은 QR을 스캔된 경우 (팝업띄우기, 모달닫기, 기록된 스캔값 지우기)
            if (scanResult.includes('@') || !scanResult.startsWith(branch_id)) {
                openPopUp("check", '보관장소 QR코드를 스캔해주세요.');
                setModalOpen(false);
                setScanResult('');
                return;
            } 

            try {
                console.log("스캔결과값----------------->", scanResult);
                console.log("선택한 검수내역의 아이템 아이디---->", itemId);
                const token = getAuthToken();
                const response = await axios.get(
                    `/ssgtarbucks_BE/api/v1/stock/checked/insert/location/qr`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'jwtauthtoken': token
                        }, params: {
                            scanResult: scanResult,
                            item_id: itemId
                        },
                    }
                );
                console.log("LocationInsertPage.response >>>>>>>>>>>..", response);
                if (response.status !== 200) {
                    throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
                }
                const resData = response.data;
                console.log("resData", resData);
                setModalOpen(false);
                setScanResult('');
                openPopUp("success", "보관장소에 등록되었습니다.");
            } catch (error) {
                console.error("Error during fetchData:", error);
            }
        };
        if (scanResult) {
            fetchData(itemId);
        }
    }, [scanResult, navigate]);

    return (
        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full mx-auto my-auto  overflow-auto text-center flex flex-col justify-between">
                <div className="h-full">
                <div style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3" }}
                    className="w-4/5 h-14 my-4 mx-auto flex justify-between items-center text-lg shadow-lg px-3 text-center font-bold">
                        <span className="w-14">번호</span>
                        <span className="w-1/12">입고코드</span>
                        <span className="w-1/12">입고일자</span>
                        <span className="w-3/12">상품명</span>
                        <span className="w-16">입고수량</span>
                        <span className="w-1/12">유통기한</span>
                        <span className="w-16">재고등록</span>
                </div>
                { datas.length === 0  ? <h1 className="text-3xl mt-20 text-center">재고로 등록할 상품이 없습니다.</h1> : 
                datas.map(function (r, i) {
                    return (
                        <div style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "6.5%" }}
                        className="w-4/5 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-3 text-center">
                                <span className="w-14">{i+1}</span>
                                <span className="w-1/12">{r.income_code}</span>
                                <span className="w-1/12">{r.income_date}</span>
                                <span className="w-3/12">{r.product_name} ({r.product_standard},&nbsp;{r.product_unit})</span>
                                <span className="w-16">{r.income_list_quantity}</span>
                                <span className="w-1/12">{dayjs(r.item_exp).format("YYYY-MM-DD")}</span>
                                <button className="w-16 h-10 border shadow-md rounded-md" id="hoverBtn" onClick={() => handleclick(r.item_id)}>
                                    <i className="fa-solid fa-expand fa-xl" ></i>
                                </button>
                        </div>
                    )
                })}
                </div>
            </div>
            {modalOpen && (
                <Modal_search
                    onSubmit={handleclick}
                    onCancel={handleclick}
                    onScan={handleScanWebCam}
                    onType={"보관할 장소의"}
                />
            )}
            {isPopUpOpen && (
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}

        </>
    )
}

export async function loader({ request, params }) {
    console.log("InspectionPage, loader >>>>>>>>>>>>.", request, params);
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    const incomeId = params.incomeId;
    console.log("incomeId---------->", incomeId);
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: `/ssgtarbucks_BE/api/v1/stock/checked/inspection`,
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        }, params: {
            branch_id: branch_id
        }
    });
    console.log("InspectionPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}