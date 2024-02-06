import React from "react";
import "../sources/css/scanner.css";
import Modal from "../commons/Modal_search";
import axios from "axios";
import { json } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../util/auth";
import PopUp from "../commons/PopUp"; 
export default function Release({scanner}) {
    /*QR 사용 및 폐기 등록*/
    const [outcomeModalOpen, setOutcomeModalOpen] = useState(false);
    const [discardModalOpen, setDiscardModalOpen] = useState(false);
    const [outcomeQrvalue, setOutcomeQrvalue] = useState('');
    const [discardQrvalue, setDiscardQrvalue] = useState('');
    const branch_id = localStorage.getItem("branch_id");
    const navigate = useNavigate();

    useEffect(() => {
        if (scanner === "outcome") {
            setOutcomeModalOpen(true);
        } else if (scanner === "discard") {
            setDiscardModalOpen(true);
        }
    }, [scanner]);

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
        navigate('/branch/stock/inventory/list');
    };
    //////////////////////////////////////////////////////////////////////
    
    //QR 취소
    const handleModalClose = () => {
        setOutcomeQrvalue('');
        setDiscardQrvalue('');
        setOutcomeModalOpen(false);
        setDiscardModalOpen(false);
        navigate('/branch/sale/product');
    }

    //모달 열기
    const handleOutcomeModalOpen = () => {
        setOutcomeModalOpen(true);
    };

    const handleDiscardModalOpen = () => {
        setDiscardModalOpen(true);
    };

    //사용등록
    const handleOutcomeQRValue = (result) => {
        /* QR 유효성 검사 */
        console.log("handleOutcomeQRValue (상품 QR값) : ", result);
        // QR이 상품 QR이 맞으면 , TODO 우리 지점 상품이 맞으면
        if (result.includes('@') && result.includes('-')) {
            // 올바른 상품 QR이 스캔된 경우 사용등록
            setOutcomeQrvalue(result);
            setOutcomeModalOpen(false);
        } else {
            //올바르지 않은 상품 QR이 스캔된 경우(ex. 장소QR을 스캔함, 입고내역서 QR을 스캔함)
            setOutcomeModalOpen(false);
            setOutcomeQrvalue('');
            openPopUp("check","상품 QR코드를 스캔해주세요.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!outcomeQrvalue) {
                return;
            }

            try {
                const token = getAuthToken();
                const qrcode_value = outcomeQrvalue;
                const response = await axios.get(
                    `/ssgtarbucks_BE/api/v1/qrcode/outcome/product/${qrcode_value}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'jwtauthtoken': token
                        }, params: {
                            branch_id: branch_id
                        },
                    }
                );

                console.log("response >>>>>>>>>>>..", response);

                if (response.status !== 200) {
                    throw json({ message: '사용 등록에 실패했습니다.' }, { status: 500 });
                }

                const resData = response.data;
                console.log("resData", resData);
                openPopUp("success","정상적으로 사용등록되었습니다.");
                setOutcomeModalOpen(false);
                setOutcomeQrvalue('');
                //window.location.reload();
                
            } catch (error) {
                setOutcomeModalOpen(false);
                setOutcomeQrvalue('');
                console.error("Error during fetchData:", error);
                navigate('/error', { state: { errorMessage: '조회시 없음' } });
            }
        };

        if (outcomeQrvalue) {
            fetchData();
            
        }

    }, [outcomeQrvalue, navigate]);

    //폐기등록
    const handleDiscardQRValue = (result) => {
        /* QR 유효성 검사 */
        console.log("handleDiscardQRValue (상품 QR값) : ", result);
        // QR이 상품 QR이 맞으면 , TODO 우리 지점 상품이 맞으면
        if (result.includes('@') && result.includes('-')) {
            // 올바른 상품 QR이 스캔된 경우 사용등록
            setDiscardQrvalue(result);
            setDiscardModalOpen(false);
        } else {
            //올바르지 않은 상품 QR이 스캔된 경우(ex. 장소QR을 스캔함, 입고내역서 QR을 스캔함)
            setDiscardModalOpen(false);
            setDiscardQrvalue('');
            openPopUp("check",'상품 QR코드를 스캔해주세요.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!discardQrvalue) {
                return;
            }

            try {
                const token = getAuthToken();
                const qrcode_value = discardQrvalue;
                const response = await axios.get(
                    `/ssgtarbucks_BE/api/v1/qrcode/discard/product/${qrcode_value}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'jwtauthtoken': token
                        }, params: {
                            branch_id: branch_id
                        },
                    }
                );

                console.log("response >>>>>>>>>>>..", response);

                if (response.status !== 200) {
                    throw json({ message: '폐기 등록에 실패했습니다.' }, { status: 500 });
                }

                const resData = response.data;
                console.log("resData", resData);
                openPopUp("success","정상적으로 폐기등록되었습니다.");
                setDiscardModalOpen(false);
                setDiscardQrvalue('');
                //window.location.reload();
            } catch (error) {
                setDiscardModalOpen(false);
                setDiscardQrvalue('');
                console.error("Error during fetchData:", error);
                navigate('/error', { state: { errorMessage: '조회시 없음' } });
            }
        };

        if (discardQrvalue) {
            fetchData();
        }
    }, [discardQrvalue, navigate]);





    return (
        <>
            {outcomeModalOpen && (
                <Modal
                    onCancel={handleModalClose}
                    onScan={handleOutcomeQRValue}
                    onType={"사용할 상품의"}
                >
                </Modal>)
            }
            {discardModalOpen && (
                <Modal
                    onCancel={handleModalClose}
                    onScan={handleDiscardQRValue}
                    onType={"폐기할 상품의"}
                >
                </Modal>)
            }
            {isPopUpOpen && (
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>

    )
}