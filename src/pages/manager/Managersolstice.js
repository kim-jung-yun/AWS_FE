import React, { useState } from "react";
import '../../sources/css/storageproductmanager.css'
import NavManager from "../../commons/NavManager";
import SearchManager from "../../commons/SearchManager";
import { Link, json, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../../util/auth";
import axios from "axios";
import Pagination from "../../commons/Pagination";

export default function Managersolstice() {
    const [ datas, setDatas ] = useState(useLoaderData());
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(10); // 페이지 당 아이템 수
    const branchList = useLoaderData();
    console.log("datas >>>", datas);
    console.log("branchList >>>", branchList);

        ////////////////////////////////////////////////////////////////////////////////////////////////
    /* 페이지네이션 */
    // 현재 페이지의 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동
    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 다음 페이지로 이동
    const handleNextClick = () => {
        const totalPages = Math.ceil(datas.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    /////////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full my-auto overflow-auto flex flex-col justify-between">
                <div className="h-full"> 
                    <div style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3" }}
                        className="w-3/5 h-14 my-4 mx-auto flex justify-around items-center text-lg shadow-lg px-3 text-center font-bold">
                        <span className="w-16">번호</span>
                        <span className="w-1/4">지점명</span>
                        <span className="w-1/2">지점주소</span>
                        <span className="w-1/4">담당직원</span>
                    </div>
                    {datas.length === 0 ? <h1 className="text-3xl mt-20 text-center">불러올 지점정보가 없습니다.</h1> :
                        datas.map((row, index)=> {
                        return(
                            <Link to={`/admin/branch/detail/${row.branch_id}`}
                            style={{ border: "1px solid #d5d5d5", borderRadius: "3px", height: "6.5%" }}
                            className="w-3/5 my-3 mx-auto flex justify-around items-center text-lg shadow-lg px-3 text-center page_itms"
                            >
                                <span className="w-16">{index + 1}</span>
                                <span className="w-1/4">{row.branch_name}</span>
                                <span className="w-1/2">{row.branch_address.match(/([^(]*)/)[0].trim()}</span>
                                <span className="w-1/4">{row.user_name}</span>
                            </Link>
                        )
                    })}
                </div>
                {datas.length === 0 ? null :
                <div className="mb-3">
                </div>
                }
            </div>
        </>
    )
}

export async function loader({ request }) {
    console.log("BranchListPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/admin/branch/list",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        }
    });

    console.log("BranchListPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}