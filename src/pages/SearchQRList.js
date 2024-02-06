import React, { useState, useEffect } from "react";
import axios from "axios";
import { json, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../util/auth.js";
import dayjs from "dayjs";
import { useLocation } from 'react-router-dom';



export default function SearchQRList() {

    //초기 키보드 검색 데이터(변경X)
    const initialData= useLoaderData();
    //정렬을 위해 쓸 데이터 (변경O)
    const [sortedSearchResult, setSortedSearchResult] = useState(useLoaderData());
    const [isExpAscending, setIsExpAscending] = useState(true);
    const [isQtyAscending, setIsQtyAscending] = useState(true);
    //QR value
    const { state } = useLocation();
    const qrValue = state?.qrValue;
    console.log("QR value값 : ", qrValue);

    //console.log("현재시각 : ", dayjs());
    //console.log(dayjs().isAfter(dayjs("2024-01-23").format("YYYY-MM-DD")));

    // 유통기한 계산
    function isExpired(date) {
        return dayjs().isAfter(dayjs(date).format("YYYY-MM-DD"));
    }
    function imminentExpiration(date) {
        let compareDate = dayjs(date).diff(dayjs(), "day", true);
        if (compareDate < 7 && compareDate > 0) {
            return true;
        }
    }
    //console.log("isExpired >>", isExpired("2024-01-23"));
    //console.log("imminentExpiration >>", imminentExpiration("2024-01-25"));

    //////////////////////////////////////////////////////////////////////////////
    /* 유통기한&수량별 상품 정렬 */
    useEffect(() => {
        sortExpSearchResult();
    }, [initialData]);

    useEffect(() => {
        sortQtySearchResult();
    }, [initialData]);

    const handleExpButtonClick = () => {
        console.log("유통기한순 정렬(오름차순 유무) : ", isExpAscending);
        setIsExpAscending(!isExpAscending);
        sortExpSearchResult();
    };

    const handleQtyButtonClick = () => {
        console.log("수량순 정렬(오름차순 유무) : ", isQtyAscending);
        setIsQtyAscending(!isQtyAscending);
        sortQtySearchResult();
    };

    const sortExpSearchResult = () => {
        const sortedResult = [...initialData].sort((a, b) => {
            const dateA = new Date(a.item_exp);
            const dateB = new Date(b.item_exp);

            return isExpAscending ? dateA - dateB : dateB - dateA;
        });

        setSortedSearchResult([...sortedResult]);
    };

    const sortQtySearchResult = () => {
        const sortedResult = [...initialData].sort((a, b) => {
            const qtyComparison = isQtyAscending ? a.stock_quantity - b.stock_quantity : b.stock_quantity - a.stock_quantity;
            return qtyComparison;
        });

        setSortedSearchResult([...sortedResult]);
    };

    ////////////////////////////////////////////////////////////////////////////////
    return (

        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full mx-auto my-auto  overflow-scroll text-center ">
                <h1 className="text-3xl mt-3 text-start ml-20">" {qrValue} " 검색결과</h1>
                <div
                    className="w-11/12 mx-auto flex justify-between items-center mt-3 h-14">
                    <div className="text-center text-lg w-12 flex justify-center items-center shadow-lg font-bold"
                        style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "70%" }}
                    >
                        번호
                    </div>
                    <div className="text-lg w-7/12 flex justify-around items-center shadow-lg font-bold text-center" style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "70%" }}>
                        <span className="w-1/4">
                            카테고리
                        </span>
                        <span className="w-3/6">
                            상품명
                        </span>
                        <span className="w-1/12">
                            상세
                        </span>
                        <span className="w-1/6 mx-3" onClick={handleExpButtonClick}>
                            유통기한
                            <i className={`fa-solid fa-sort ml-2`}></i>
                        </span>
                        <span className="w-1/12 mr-3">
                            상태
                        </span>
                    </div>
                    <div className="text-center text-lg w-4/12 flex justify-center items-center shadow-lg font-bold" style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "70%" }}>
                        <span className="w-1/4">
                            장소코드
                        </span>
                        <span className="w-1/6">
                            보관유형
                        </span>
                        <span className="w-1/6">
                            보관장소
                        </span>
                        <span className="w-1/4">
                            보관명칭
                        </span>
                    </div>
                </div>
                {sortedSearchResult.length === 0 ? <h1 className="text-3xl mt-20">검색결과가 없습니다.</h1> :
                    sortedSearchResult.map(function (r, i) {
                        return (
                            <div style={{ height: "8.5%" }}
                                className="w-11/12 mx-auto flex justify-between items-center text-2xl" key={`${r.product_id}-${i}`}>
                                <div className="text-center text-lg w-12 flex justify-center items-center shadow-lg" style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "70%" }}>
                                    {i + 1}
                                </div>
                                <div className="text-lg w-7/12 flex justify-around items-center shadow-lg text-center" style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "70%" }}>
                                    <span className="w-1/4"
                                        style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{r.category_name}</span>
                                    <span className="w-3/6"
                                        style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{`${r.product_name} (${r.product_standard} , ${r.product_unit})`}</span>
                                    <span className="w-1/12"
                                    >{r.product_spec}</span>
                                    <span className="w-1/6 mx-3"
                                        style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : (imminentExpiration(r.item_exp) ? { boxShadow: 'inset 0 -30px 0 rgb(255, 200, 200)' } : null)}>
                                        {dayjs(r.item_exp).format("YYYY-MM-DD")}
                                    </span>
                                    <span className="w-1/12 mr-3" style={{ boxShadow: "inset 0 -30px 0 rgb(255, 245, 160)" }}>{r.item_status}</span>
                                </div>
                                <div className="text-center text-lg w-4/12 flex justify-center items-center shadow-lg" style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "70%" }}>
                                    <span className="w-1/4">{r.location_code}</span>
                                    <span className="w-1/6">{r.location_area === "FR" ? "매장" : "창고"}</span>
                                    <span className="w-1/6">{r.location_section_name}</span>
                                    <span className="w-1/4">{r.location_alias}</span>
                                </div>
                            </div>
                        )
                    })}

            </div>
        </>
    )
}

export async function loader({ request, params }) {
    console.log("SearchQRResultPage,loader>>>>>>>>>>>>.", request, params);
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);
    const searchQRValue = params['searchWord'];

    //QR값이 없으면
    if (searchQRValue == null) {
        searchQRValue = '';
        return ;
    }
    const response = await axios({
        method: "GET",
        url: `/ssgtarbucks_BE/api/v1/qrcode/search/${searchQRValue}`,
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });
    console.log("SearchQRResultPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}
