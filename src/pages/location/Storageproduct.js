import React, { useState, useEffect } from "react";
import Nav from "../../commons/Nav";
import Search from "../../commons/Search";
import '../../sources/css/storageproduct.css'
import Modal from "../../commons/Modal_QRViewer";
import { getAuthToken } from "../../util/auth";
import axios from "axios";
import { json, redirect, useLoaderData } from "react-router-dom";
import PopUp from "../../commons/PopUp.js";

export default function Storageproduct() {
    /*장소 QR코드 이미지 모달*/
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLocationCode, setSelectedLocationCode] = useState('');

    //////////////////////////////////////////////////////////////////////
    /*팝업창*/
    const [comment, setComment] = useState('');
    const [popupType, setPopupType] = useState('');
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const openPopUp = (type, comment) => {
        setPopUpOpen(true);
        setComment(comment);
        setPopupType(type);
    };
    const closePopUp = () => {
        setPopUpOpen(false);
        if (comment === "보관장소가 삭제되었습니다.") {
            window.location.reload();
            // return redirect("/branch/main")
        }
    };
    //////////////////////////////////////////////////////////////////////

    /*필터링*/
    const loaderDataStorage = useLoaderData().stockLocationDataList;
    //DB에서 조회한 전체 StockList(변경되면안됨)
    const [stockList, setStockList] = useState(loaderDataStorage);
    //카테고리 조회하는 임시 Stock List
    const [tmpStockList, setTmpStockList] = useState(loaderDataStorage);
    const [selectedStorageType, setSelectedStorageType] = useState('');
    const [selectedStorageLocation, setSelectedLocation] = useState('');
    const [selectedLocationAlias, setSelectedLocationAlias] = useState('');
    const [locationList, setLocationList] = useState([]);
    const [aliasList, setAliasList] = useState([]);

    console.log("stockList>>>", stockList);

    const openModal = (location) => {
        setSelectedLocationCode(location.location_code);
        console.log("openModal", location.location_code);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedLocationCode(null);
        setModalOpen(false);
    };

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
    const LOCATION_SECTION_MAP = {
        "A": "냉동고",
        "B": "냉장고",
        "C": "다용도렉",
        "D": "매대",
        "E": "상부장",
        "F": "쇼케이스",
        "G": "진열대",
        "H": "서랍",
        "I": "수납장",
        "J": "하부장",
        "K": "기타"
    };
    const getLocationSection = (section) => {
        const firstLetter = section.charAt(0).toUpperCase();
        return LOCATION_SECTION_MAP[firstLetter] || section;
    };

    //장소 삭제
    const handleDeleteLocation = async (location_id) => {
        const token = getAuthToken();
        const branch_id = localStorage.getItem("branch_id");

        try {
            const response = await axios.delete(`/ssgtarbucks_BE/api/v1/branch/location/${location_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token,
                    branch_id: branch_id
                }
            });

            console.log("LocatoinListPage(delete).response >>>>>>>>>>>..", response);

            if (response.status !== 200) {
                throw json({ message: 'Could not save event.' }, { status: 500 });
            }
            console.log(response.data);

            //화면 재랜더링
            openPopUp("success", "보관장소가 삭제되었습니다.");

        } catch (error) {
            alert("다시 시도하시기 바랍니다.");
            console.error('Error during location deletion:', error);
        }
    };

    /* 카테고리 정렬 */
    useEffect(() => {
        doFilter();
    }, [selectedStorageType, selectedStorageLocation, selectedLocationAlias]);


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
            openPopUp("check", "보관구역을 선택해주세요.");
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


    return (
        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full my-auto overflow-auto">
                <div style={{ margin: "0 auto", width: "80%" }} className="my-4">
                    <table className="w-full">
                        <thead>
                            <tr className="h-14 flex justify-between items-center border shadow-md" style={{ backgroundColor: "#f6f5efb3" }}>
                                <th className="w-1/5 text-lg text-center">
                                    <select className="text-lg text-center" style={{ backgroundColor: "#f6f5efb3" }}
                                        onChange={(e) => handleSelectedStorageTypeChange(e.target.value)}>
                                        <option value="보관유형">보관유형</option>
                                        <option value="매장">매장</option>
                                        <option value="창고">창고</option>
                                    </select>
                                </th>
                                <th className="w-1/5 text-lg text-center">
                                    <select style={{ backgroundColor: "#f6f5efb3" }} className="text-center"
                                        onChange={(e) => handleSelectedLocationChange(e.target.value === '구역선택' ? '' : e.target.value)}>
                                        <option value="보관구역">보관구역 </option>
                                        {locationList.map((row, index) => (
                                            <option key={index}>{row}</option>
                                        ))}
                                    </select>
                                </th>
                                <th className="w-1/5 text-lg text-center">
                                    <select style={{ backgroundColor: "#f6f5efb3" }} className="text-center"
                                        onChange={(e) => handleSelectedLocationAliasChange(e.target.value)}>
                                        <option>보관명칭</option>
                                        {aliasList.map((alias, index) => (
                                            <option key={index}>{alias}</option>
                                        ))}
                                    </select>
                                </th>
                                <th className="w-1/5 text-lg text-center">보관장소코드</th>
                                <th className="w-1/5 text-lg text-center">QR/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tmpStockList.length === 0 ? <h1 className="text-3xl mt-20 text-center">불러올 장소목록이 없습니다.</h1> :
                                tmpStockList.map((row, index) => (
                                    <tr className="tbody flex justify-between items-center my-3" key={`${row.product_id}-${index}`}>
                                        <td className="text-lg w-1/5 text-center">{getLocationType(row.location_area)}</td>
                                        <td className="text-lg w-1/5 text-center">{getLocationSection(row.location_section)}</td>
                                        <td className="text-lg w-1/5 text-center">{row.location_alias}</td>
                                        <td className="text-lg w-1/5 text-center">{row.location_code}</td>
                                        <td className="text-lg w-1/5 pl-10 text-center flex items-center justify-around">
                                            <button className="btn_3" id="hoverBtn" onClick={() => openModal(row)} >QR</button>
                                            <button className="btn_3" id="hoverBtn" onClick={() => handleDeleteLocation(row.location_id)}>삭제</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {modalOpen && (
                <Modal
                    onCancel={closeModal} onSendLocationQRValue={selectedLocationCode}>
                </Modal>)
            }
            {isPopUpOpen && (
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>
    );
}

export async function loader() {
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    const expResponse = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/branch/location/list",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
            , curDate: null
        }
    });

    if (expResponse.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const stockLocationDataList = expResponse.data;
    return { stockLocationDataList };
}