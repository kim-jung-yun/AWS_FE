import { useEffect, useState } from "react";
import axios from "axios";
import "../../sources/css/event.css"
import Pagination from "../../commons/Pagination";
import { getAuthToken } from "../../util/auth";
import { json, useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Modal from '../../commons/Modal_moveItem';
import Modal_moveQRItem from "../../commons/Modal_moveQRItem";
import PopUp from "../../commons/PopUp.js";  
import dayjs from "dayjs";

export default function View() {
    const [datas, setDatas] = useState(useLoaderData());
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [itemsPerPage] = useState(8); // 페이지 당 아이템 수
    const [modalOpen, setModalOpen] = useState(false);
    ////////////////////////////////////////////////////////////////////////
    /*QR 이동*/
    const [qrMoveItemModalOpen, setQrMoveItemModalOpen] = useState(false);
    const [qrMoveLocationModalOpen, setQrMoveLocationModalOpen] = useState(false);
    const [moveItemQrvalue, setMoveItemQrvalue] = useState('');
    const [moveLocationQrvalue, setMoveLocationQrvalue] = useState('');
    const branch_id = localStorage.getItem("branch_id");
    const navigate = useNavigate();
    //////////////////////////////////////////////////////////////////////////
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
        if(comment==="상품을 이동하였습니다."){
        window.location.reload();
        }
    };
    //////////////////////////////////////////////////////////////////////

    const loaderDataStorage = useLoaderData();
    //DB에서 조회한 전체 StockList(변경되면안됨)
    const [stockList, setStockList] = useState(loaderDataStorage);
    //카테고리 조회하는 임시 Stock List
    const [tmpStockList, setTmpStockList] = useState(loaderDataStorage);
    const [selectedStorageType, setSelectedStorageType] = useState('');
    const [selectedStorageLocation, setSelectedLocation] = useState('');
    const [selectedLocationAlias, setSelectedLocationAlias] = useState('');
    const [locationList, setLocationList] = useState([]);
    const [aliasList, setAliasList] = useState([]);
    //선택한 상품
    const [selectedItems, setSelectedItems] = useState([]);
    //console.log("stockList>>>", stockList);

    /*보관개수 수정*/
    const handleQuantityChange = async (index, delta, itemId) => {
        try {
            const updatedStockList = [...datas];
            const updatedItem = { ...updatedStockList[index] };

            updatedItem.stock_quantity += delta;

            updatedStockList[index] = updatedItem;
            setDatas(updatedStockList);

            const token = getAuthToken();
            const branch_id = localStorage.getItem("branch_id");

            const response = await axios({
                method: "PUT",
                url: `/ssgtarbucks_BE/api/v1/stock/quantity/`,
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                },
                params: {
                    branch_id: branch_id
                },
                data: {
                    item_id: itemId
                    , stock_quantity: updatedItem.stock_quantity
                }
            });
            console.log("Update Quantity Response:", response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // 유통기한 표시 계산
    function isExpired(date) {
        return dayjs().isAfter(dayjs(date).format("YYYY-MM-DD"));
    }
    function imminentExpiration(date) {
        let compareDate = dayjs(date).diff(dayjs(), "day", true);
        if (compareDate < 7 && compareDate > 0) {
            return true;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    /* 페이지네이션 */
    // 현재 페이지의 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //장소 null 값 제외
    const filteredList = tmpStockList.filter(stockItem => stockItem.product_name !== null);
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

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
        const totalPages = Math.ceil(tmpStockList.length / itemsPerPage);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const onCancel = () => {
        setModalOpen(false);
        setSelectedItems([]);
        //window.location.reload();
    }
    /////////////////////////////////////////////////////////////////////////////////
    /* 카테고리 필터 */
    useEffect(() => {
        doFilter();

    }, [selectedStorageType, selectedStorageLocation, selectedLocationAlias]);

    const getLocationType = (area) => {
        switch (area) {
            case 'FR':
                return "매장";
            case 'BA':
                return "창고";
            default:
                return area;
        }
    };

    // 선택한 보관유형 변경 시 처리
    const handleSelectedStorageTypeChange = (value) => {
        setSelectedStorageType(value);
        setSelectedLocation('');
        setSelectedLocationAlias(''); // 별칭 초기화
    };
    // 선택한 보관구역 변경시 처리
    const handleSelectedLocationChange = (value) => {
        setSelectedLocation(value);
        setSelectedLocationAlias(''); // 별칭 초기화
    }

    // 선택한 보관장소 변경 시 처리
    const handleSelectedLocationAliasChange = (value) => {
        setSelectedLocationAlias(value);
    };

    const doFilter = () => {
        console.log("doFilter  시작>>>", selectedStorageType, ", ", selectedStorageLocation, " , ", selectedLocationAlias);
        let filteredList = stockList;  // stockList로부터 필터링을 시작합니다.
        let filterTypeList = stockList; //보관유형까지 필터링된 데이터
        let filteredSectionList = stockList;  // 보관장소까지 필터링된 데이터

        if (selectedStorageType === "보관유형") {
            setSelectedStorageType('');
        }
        if (selectedStorageLocation === "보관구역") {
            setSelectedLocation('');
        }
        if (selectedLocationAlias === "보관명칭") {
            setSelectedLocationAlias('');
        }

        if (selectedStorageType && !selectedStorageLocation && selectedLocationAlias) {
            // 보관유형은 정하고 보관구역을 정하지 않고 보관명칭만 보는 것은 안됨
            openPopUp("check","보관구역을 선택해주세요.");
            setSelectedLocationAlias('');
            return; // 필터링을 하지 않고 종료
        }


        if (selectedStorageType) {
            filteredList = filteredList.filter(stockItem => getLocationType(stockItem.location_area) === selectedStorageType);
            filterTypeList = filteredList.filter(stockItem => getLocationType(stockItem.location_area) === selectedStorageType);
            console.log("유형 필터링된 리스트", filteredList);
            if (selectedStorageLocation) {
                filteredList = filteredList.filter(stockItem => stockItem.location_section_name === selectedStorageLocation);
                filteredSectionList = filteredList.filter(stockItem => stockItem.location_section_name === selectedStorageLocation);
                console.log("구역 필터링된 리스트", filteredList);
                if (selectedLocationAlias) {
                    filteredList = filteredList.filter(stockItem => stockItem.location_alias === selectedLocationAlias);
                    console.log("보관명칭 필터링된 리스트", filteredList);
                }
            }
        }

        else if (selectedStorageLocation) {
            filteredList = filteredList.filter(stockItem => stockItem.location_section_name === selectedStorageLocation);
            filteredSectionList = filteredList.filter(stockItem => stockItem.location_section_name === selectedStorageLocation);
            console.log("구역 필터링된 리스트", filteredList);
            if (selectedLocationAlias) {
                filteredList = filteredList.filter(stockItem => stockItem.location_alias === selectedLocationAlias);
                console.log("보관명칭 필터링된 리스트", filteredList);
            }
        }

        else if (selectedLocationAlias) {
            filteredList = filteredList.filter(stockItem => stockItem.location_alias === selectedLocationAlias);
            console.log("보관명칭 필터링된 리스트", filteredList);
        }
        // 필터링이 완료된 데이터로 tmpStockList 갱신
        setCurrentPage(1);
        setTmpStockList(filteredList);
        locationCategoryList(filterTypeList);
        aliasCategoryList(filteredSectionList);
    };

    /* 필터링된 구역 카테고리  */
    const locationCategoryList = (filteredList) => {
        try {
            if (Array.isArray(filteredList) && filteredList.length > 0) {
                const uniqueLocation = [...new Set(filteredList.map(item => item.location_section_name))];
                setLocationList(uniqueLocation);
            } else {
                setLocationList([]);
            }
        } catch (error) {
            console.error("Error in locationCategoryList:", error);
            setLocationList([]);
        }
    };

    /* 필터링된 보관명칭 카테고리  */
    const aliasCategoryList = (filteredList) => {
        try {
            if (Array.isArray(filteredList) && filteredList.length > 0) {
                const uniqueAliases = [...new Set(filteredList.map(item => item.location_alias))];
                setAliasList(uniqueAliases);
            } else {
                setAliasList([]);
            }
        } catch (error) {
            console.error("Error in aliasCategoryList:", error);
            setAliasList([]);
        }
    };
    //////////////////////////////////////////////////////////////////////////////////
    /* 선택이동 */
    //체크박스 변경
    const handleCheckboxChange = (stockItem) => {
        const updatedSelectedItems = [...selectedItems];
        const index = updatedSelectedItems.findIndex(item => item.stock_id === stockItem.stock_id);

        if (index === -1) {
            updatedSelectedItems.push(stockItem);
        } else {
            updatedSelectedItems.splice(index, 1);
        }

        setSelectedItems(updatedSelectedItems);
    };

    //선택해제
    const resetSelectedItems = () => {
        //데이터 삭제
        setSelectedItems([]);
    };
    /////////////////////////////////////////////////////////////////////////////////
    // QR 모달 
    const handleQRMoveModalOpen = () => {
        setQrMoveItemModalOpen(qrMoveItemModalOpen => !qrMoveItemModalOpen);
    };
    const handleQRMoveModalCancel = () => {
        setMoveItemQrvalue('');
        setMoveLocationQrvalue('');
        setQrMoveItemModalOpen(false);
        setQrMoveLocationModalOpen(false);
    }

    const handleMoveItemQrValue = (result) => {
        /* QR 유효성 검사 */
        console.log("handleMoveItemQrValue (상품 QR값) : ", result);
        // QR이 상품 QR이 맞으면
        if (result.includes('@') && result.includes('-')) {
            // 올바른 상품 QR이 스캔된 경우(QR저장-> Item모달 닫기 -> Location모달열기)
            setMoveItemQrvalue(result);
            setQrMoveItemModalOpen(false);
            setQrMoveLocationModalOpen(true);
        } else {
            //올바르지 않은 상품 QR이 스캔된 경우(ex. 장소QR을 스캔함, 입고내역서 QR을 스캔함)
            setQrMoveItemModalOpen(qrMoveLocationModalOpen => !qrMoveLocationModalOpen);
            openPopUp("check","상품 QR코드를 스캔해주세요.");
        }
    };

    const handleMoveLocationQrValue = (result) => {
        /* QR 유효성 검사 */
        console.log("handleMoveLocationQrValue (장소 QR값) : ", result);
        // 올바르지 않은 QR을 스캔된 경우 (팝업띄우기, 모달닫기, 기록된 스캔값 지우기)
        if (result.includes('@') || !result.startsWith(branch_id)) {
            openPopUp("check",'이동할 보관장소 QR코드를 스캔해주세요.');
            handleQRMoveModalCancel();
        } else {
            // 올바른 장소 QR이 스캔된 경우(QR 저장->Location 모달 닫기 -> 상품이동실행(axios))
            setQrMoveLocationModalOpen(false);
            setMoveLocationQrvalue(result);
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            if (!moveItemQrvalue || !moveLocationQrvalue) {
                return; // 두 값 중 하나라도 없으면 함수를 빠져나갑니다.
            }
            const item_qrcode_value = moveItemQrvalue;
            const location_qrcode_value = moveLocationQrvalue;

            try {
                const token = getAuthToken();
                const response = await axios.get(
                    `/ssgtarbucks_BE/api/v1/qrcode/stock/move/product/${item_qrcode_value}/${location_qrcode_value}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'jwtauthtoken': token,
                        }
                        , params: {
                            branch_id: branch_id
                        },
                    }
                );
                console.log("response >>>>>>>>>>>..", response);

                if (response.status !== 200) {
                    throw json({ message: '이동에 실패했습니다.' }, { status: 500 });
                }

                const resData = response.data;
                console.log("resData", resData);
                handleQRMoveModalCancel();
                openPopUp("success", "상품을 이동하였습니다.");
            } catch (error) {
                console.error("Error during fetchData:", error);
                navigate('/error', { state: { errorMessage: '조회시 없음' } });
            }
        };

        if (moveItemQrvalue && moveLocationQrvalue) {
            fetchData();
        }

    }, [moveItemQrvalue, moveLocationQrvalue, navigate]);



    //
    return (
        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full mx-auto my-auto  text-center flex flex-col justify-between">
                <div className="h-full">
                    <div style={{ height: "7%" }}
                        className="w-3/4 my-1 mx-auto flex justify-between items-center text-2xl my-4">
                        <div className="w-4/6 flex justify-around h-12">
                            <select className="text-center text-xl w-56 shadow-lg "
                                style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "100%" }}
                                onChange={(e) => handleSelectedStorageTypeChange(e.target.value)}>
                                <option value="보관유형">보관유형</option>
                                <option value="매장">매장</option>
                                <option value="창고">창고</option>
                            </select>
                            <select className="text-center text-xl w-56 shadow-lg" style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "100%" }}
                                onChange={(e) => handleSelectedLocationChange(e.target.value === '구역선택' ? '' : e.target.value)}>
                                <option value="보관구역">보관구역 </option>
                                {locationList.map((row, index) => (
                                    <option key={index}>{row}</option>
                                ))}
                            </select>
                            <select className="text-center text-xl w-56 shadow-lg" style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "100%" }}
                                onChange={(e) => handleSelectedLocationAliasChange(e.target.value)}>
                                <option>보관명칭</option>
                                {aliasList.map((alias, index) => (
                                    <option key={index}>{alias}</option>
                                ))}
                            </select>
                        </div>
                        <input type="button" value="QR이동" className="text-center text-lg w-28 shadow-lg" id="hoverBtn"
                            style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", height: "70%" }} onClick={handleQRMoveModalOpen} />
                        <input type="button" value="선택이동" className="text-center text-lg w-28 shadow-lg" id="hoverBtn" onClick={() => { setModalOpen(true) }}
                            style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", height: "70%" }} />
                        <input type="button" value="선택해제" className="text-center text-lg w-28 shadow-lg" id="hoverBtn" onClick={resetSelectedItems}
                            style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", height: "70%" }} />
                    </div>
                    <div style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "6.8%" }}
                        className="w-3/4 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-4 text-center font-bold">
                        <span className="w-10"></span>
                        <span className="w-1/12">보관유형</span>
                        <span className="w-1/12">보관구역</span>
                        <span className="w-2/12">보관명칭</span>
                        <span className="w-4/12">상품명</span>
                        <span className="w-1/12">유통기한</span>
                        <span className="w-1/12">수량</span>
                    </div>
                    {currentItems.length === 0 ? <h1 className="text-3xl mt-20 text-center">불러올 재고가 없습니다.</h1> :
                        currentItems.map(function (r, i) {
                            return (
                                <div style={{ border: "0.1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "6.8%" }}
                                    className="w-3/4 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-4 text-center"
                                    key={i} >
                                    <input type="checkbox" className="w-10" checked={selectedItems.includes(r)} onChange={() => handleCheckboxChange(r)} />
                                    <span className="w-1/12">{r.location_area === 'FR' ? '매장' : (r.location_area === 'BA' ? '창고' : '')}</span>
                                    <span className="w-1/12">{r.location_section_name}</span>
                                    <span className="w-2/12">{r.location_alias}</span>
                                    <span className="w-4/12"
                                        style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>
                                        {`${r.product_name} (${r.product_standard}, ${r.product_unit})`}
                                    </span>
                                    <span className="w-1/12"
                                        style={isExpired(r.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : (imminentExpiration(r.item_exp) ? { boxShadow: 'inset 0 -30px 0 rgb(255, 200, 200)' } : null)}>
                                        {dayjs(r.item_exp).format("YYYY-MM-DD")}
                                    </span>
                                    <div className="w-1/12">
                                        <input type='hidden' value={r.item_id} />
                                        <button onClick={() => handleQuantityChange(i, -1, r.item_id)} className="border w-8 h-8 mr-2 shadow-md page_itms">-</button>
                                        <span>{r.stock_quantity}</span>
                                        <button onClick={() => handleQuantityChange(i, 1, r.item_id)} className="border w-8 h-8 ml-2 shadow-md page_itms">+</button>
                                    </div>
                                </div>
                            )
                        })}
                </div>
                {currentItems.length === 0 ? null :
                <div className="mb-3">
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={tmpStockList.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        onPrevClick={handlePrevClick}
                        onNextClick={handleNextClick}
                    />
                </div>
                }
            </div>
            {modalOpen &&
                <Modal onCancel={onCancel} selectedItems={selectedItems} stockList={loaderDataStorage} />
            }
            {qrMoveItemModalOpen && (
                <Modal_moveQRItem
                    onCancel={handleQRMoveModalCancel}
                    onScan={handleMoveItemQrValue}
                    onType={"이동할 상품의"}
                />
            )}
            {qrMoveLocationModalOpen && (
                <Modal_moveQRItem
                    onCancel={handleQRMoveModalCancel}
                    onScan={handleMoveLocationQrValue}
                    onType={"이동할 장소의"}
                />
            )}
            {isPopUpOpen &&(
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>
    )
}

export async function loader({ request }) {
    console.log("StockListPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/stock/list/",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });

    console.log("StockListPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}