import React, { useState, useEffect } from "react";
import Pagination from "../../commons/Pagination";
import axios from "axios";
import { json, useLoaderData } from "react-router";
import { getAuthToken } from "../../util/auth";
import dayjs from "dayjs";
import { Link } from "react-router-dom";


export default function Inventory() {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(10); // 페이지 당 아이템 수
    const initialProductList = useLoaderData(); //DB에서 조회한 상품 리스트
    const [productList, setProductList] = useState(initialProductList); //필터링된 Product List
    const [selectedProductCategory, setSelectedProductCategory] = useState("카테고리");
    const categoryNames = new Set(initialProductList.map(product => product.category_name));
    const [categoryList, setCategoryList] = useState( [...categoryNames]);
    ////////////////////////////////////////////////////////////////////////////////
    /* 카테고리 필터 */
    const handleSelectedProductCategoryChange = (value) => {
        setSelectedProductCategory(value);
    };

    // 선택한 보관유형 변경, data 재로딩 시 처리
    useEffect(() => {
        doFilter();
    }, [selectedProductCategory,initialProductList]);

    const doFilter = () => {
        console.log("doFilter  시작>>>", selectedProductCategory);
        let filteredList = initialProductList; //필터링할 리스트 받아오기
        
        if (selectedProductCategory === "카테고리") {
        } else {
            filteredList = filteredList.filter(item => item.category_name === selectedProductCategory);
            // 필터링이 완료된 데이터로 tmpStockList 갱신
        }
        setProductList(filteredList);
        setCurrentPage(1);
    };
    ////////////////////////////////////////////////////////////////////////////////
    /* 페이지네이션 */
    // 현재 페이지의 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);

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
        const totalPages = Math.ceil(productList.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    ////////////////////////////////////////////////////////////////////////////////
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

    return (
        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full mx-auto my-auto  text-center flex flex-col justify-between">
                <div className="h-full">
                <div className="w-5/6 mx-auto flex justify-between items-center font-bold h-14 my-4">
                    <div className="text-center text-lg w-56 flex justify-center items-center shadow-lg h-full border rounded-md"
                        style={{ backgroundColor: "#f6f5efb3" }}>
                        <select className="text-center" style={{ backgroundColor: "#f6f5efb3" }}
                            onChange={(e) => handleSelectedProductCategoryChange(e.target.value)}>
                            <option value="카테고리">카테고리</option>
                            {categoryList.map((categoryName, i) => (
                                <option key={i} value={categoryName}>
                                    {categoryName}
                                </option>
                                ))}
                        </select>
                    </div>
                    <div className="text-lg w-10/12 flex border rounded-md justify-around items-center shadow-lg h-full" style={{ background: "#f6f5efb3" }}>
                        <span className="w-3/12">상품명</span>
                        <span className="w-1/12">규격</span>
                        <span className="w-1/12">단위</span>
                        <span className="w-1/12">옵션</span>
                        <span className="w-1/12">수량</span>
                    </div>
                </div>
                {currentItems.length === 0 ? <h1 className="text-3xl mt-20">불러올 상품이 없습니다.</h1> :
                    currentItems.map(function (r, i) {
                        return (
                            <div style={{ height: "6.5%" }} className="w-5/6 mx-auto flex justify-between items-center my-3">
                                <div className="text-center text-lg w-56 flex justify-center items-center shadow-lg border rounded-md h-full" style={{ background: "#f6f5efb3" }}>
                                    {r.category_name}
                                </div>
                                <Link to={`/branch/stock/product/detail/${r.product_id}`} className="text-lg w-10/12 flex justify-around items-center shadow-lg border rounded-md text-center h-full page_itms">
                                    <span className="w-3/12" style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null} >{r.product_name}</span>
                                    <span className="w-1/12" style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null} >{r.product_standard}</span>
                                    <span className="w-1/12" style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null} >{r.product_unit}</span>
                                    <span className="w-1/12" style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{r.product_spec}</span>
                                    <span className="w-1/12" style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{r.total_product_quantity}</span>
                                </Link>
                            </div>
                        )
                    })}
                    </div>
                    { currentItems.length === 0 ? null :
                    <div className="mb-3">
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={productList.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onPrevClick={handlePrevClick}
                        onNextClick={handleNextClick}
                    />
                    </div>
                    }
            </div>
        </>
    )
}

export async function loader({ request }) {
    console.log("ProductListPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/product/list/",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });

    console.log("ProductListPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}