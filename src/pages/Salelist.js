import React, { useEffect, useState } from "react";
import Nav from "../commons/Nav";
import Search from "../commons/Search"
import '../sources/css/salelist.css';
import axios from 'axios';
import Pagination from "../commons/Pagination";
import { getAuthToken } from "../util/auth";
import { json, useLoaderData } from "react-router";
import PopUp from "../commons/PopUp"; 

export default function Salelist() {
    const [datas, setDatas] = useState(useLoaderData());
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
        window.location.reload();
    };
    //////////////////////////////////////////////////////////////////////
    const handleSaleListUpdate = async () => {
        try {
            const token = getAuthToken();
            const branch_id = localStorage.getItem("branch_id");

            const response = await axios({
                method: "PUT",
                url: `/ssgtarbucks_BE/api/v1/stock/sale/product`,
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                },
                params: {
                    branch_id: branch_id
                }
            });

            console.log("Update Quantity Response:", response.data);

            openPopUp("success","정상적으로 판매내역이 업데이트되었습니다.");
          
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <>
        <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full mx-auto my-auto  overflow-auto text-center">
                <div className="w-2/3 my-4 mx-auto flex justify-around items-center text-lg h-14 rounded-md border font-bold shadow-lg" style={{background: "#f6f5efb3"}}>
                    <span className="w-1/12">번호</span>
                    <span className="w-2/12">판매코드</span>
                    <span className="w-4/12">상품명</span>
                    <span className="w-1/12">수량</span>
                    <span className="w-2/12">판매일자</span>
                    <span className="w-1/12">갱신상태</span>
                </div>
                { datas.length === 0 ? <h1 className="text-3xl mt-20">갱신할 판매목록이 없습니다.</h1> : 
                <>
                {datas.map(function (r, i) {
                    return (
                        <div style={{ height: "6.8%" }}
                            className="w-2/3 my-3 mx-auto flex justify-center items-center"
                            key={i} >
                            <div style={{ border: "0.1px solid #d5d5d5", borderRadius: "7px", background: "#f6f5efb3", height: "100%" }}
                                className="w-full flex justify-between items-center text-lg shadow-lg px-4">
                                <span className="w-1/12">{i+1}</span>
                                <span className="w-2/12">{r.sale_code}</span>
                                <span className="w-4/12">  {`${r.product_name} (${r.product_standard}, ${r.product_unit})`}</span>
                                <span className="w-1/12">{r.sale_list_quantity}</span>
                                <span className="w-2/12">{r.sale_date}</span>
                                <span className="w-1/12">{r.sale_status}</span>
                            </div>
                        </div>
                    )
                })}
                <div className="w-3/5 my-5 mx-auto flex justify-center items-center text-lg h-10">
                    <input type="button" value="갱신하기" className="text-center text-lg font-bold w-28 shadow-lg border rounded-md h-full btn_salelist "
                        onClick={() => handleSaleListUpdate()} 
                    />
                </div>
                </>
                }

            </div>
            {isPopUpOpen &&(
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>
    )
}

export async function loader({ request }) {
    console.log("OutcomeListPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);
    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/stock/sale/list",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });
    console.log("OutcomeListPage.response >>>>>>>>>>>..", response);
    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }
    const resData = response.data;
    console.log("resData", resData);
    return resData;
}