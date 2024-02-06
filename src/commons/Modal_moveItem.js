import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthToken } from '../util/auth';
import PopUp from "../commons/PopUp.js";  

const Modal_moveItem = ({  onCancel, selectedItems, stockList }) => {
    const [tmpStockList, setTmpStockList] = useState(stockList);
    const [selectedStorageType, setSelectedStorageType] = useState('');
    const [selectedStorageLocation, setSelectedLocation] = useState('');
    const [selectedLocationAlias, setSelectedLocationAlias] = useState('');
    const [locationList, setLocationList] = useState([]);
    const [aliasList, setAliasList] = useState([]);

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


  /* 카테고리 필터 */
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
            openPopUp("check","보관구역을 선택해주세요.");
            setSelectedLocationAlias('');
            return; // 필터링을 하지 않고 종료
        }

        if (selectedStorageType) {
            filteredList = filteredList.filter(stockItem => stockItem.location_area === selectedStorageType);
            filterTypeList = filteredList.filter(stockItem => stockItem.location_area === selectedStorageType);
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
            <div className="modal-container" style={{ fontFamily: 'Pretendard-Regular' }}>
                <div className="madal-main">
                    <div className="madal-line">
                        <div className="modal-header">
                            선택한 상품 위치를 어느 장소로 이동하시겠습니까?
                        </div>
                        <div className="modal-content">
                            <div className="modal-th_1">
                                <div className="w-full flex items-center">
                                    <div className="w-1/3">
                                        <select className="text-center text-lg w-full font-normal" style={{ background: "#f6f5efb3" }} 
                                            onChange={(e) => handleSelectedStorageTypeChange(e.target.value === '매장' ? 'FR' : e.target.value === '창고' ? 'BA' : '')}>
                                            <option value="보관장소">보관유형</option>
                                            <option value="매장">매장</option>
                                            <option value="창고">창고</option>
                                        </select>
                                    </div>
                                    <div className="w-1/3">
                                        <select className="text-center text-lg w-full font-normal" style={{ background: "#f6f5efb3" }}
                                            onChange={(e) => handleSelectedLocationChange(e.target.value === '보관장소' ? '' : e.target.value)}>
                                            <option>보관장소</option>
                                            {locationList.map((section, index) => (
                                                <option key={index}>{section}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/3">
                                        <select className="text-center text-lg w-full font-normal" style={{ background: "#f6f5efb3" }}
                                            onChange={(e) => handleSelectedLocationAliasChange(e.target.value === '보관명칭' ? '' : e.target.value)}>
                                            <option>보관명칭</option>
                                            {aliasList.map((alias, index) => (
                                                <option key={index}>{alias}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="madal-footer">
                        <button className="border-2 w-28 h-11 rounded-md page_itms" onClick={() => action({ selectedStorageType, selectedLocationAlias, selectedItems, onCancel,openPopUp})}>이동</button>
                        <button className="border-2 w-28 h-11 rounded-md page_itms" onClick={() => onCancel()}>취소</button>
                    </div>
                </div>
            </div>
            {isPopUpOpen &&(
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>
    );
};
export default Modal_moveItem;

export async function action({ selectedStorageType, selectedLocationAlias, selectedItems, onCancel,  openPopUp }) {
    console.log("MoveItem.action");
    console.log(` "유형 ${selectedStorageType} 소분류 ${selectedLocationAlias}아아템  ${selectedItems}`);


    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);
    const location_area = `${selectedStorageType}`;
    const location_alias = `${selectedLocationAlias}`;
    const item_list = selectedItems.map(item => item.item_id);

    const jsonDataArray = {
        branch_id: branch_id,
        location_area: location_area,
        location_alias: location_alias,
        item_list: item_list,
    };

    console.log("jsonDataArray>>", jsonDataArray);
    console.log("jsonDataToString", JSON.stringify(jsonDataArray));
    let resData = '';
    try {
        const response = await axios({
            method: "put",
            url: 'http://localhost:8000/api/v1/stock/location/move/',
            headers: {
                'Content-Type': 'application/json',
                'jwtauthtoken': token,
            },
            params: {
                branch_id: branch_id
            },
            data: JSON.stringify(jsonDataArray),
        });

        console.log("response>>>>>>", response);
        resData = response.data;
        openPopUp("success", "상품을 이동하였습니다.");

        // Execute onCancel after a delay or user interaction
        setTimeout(() => {
            onCancel();
        }, 3000); // Adjust the delay as needed
    } catch (error) {
        console.log("error:", error);
        throw new Error("error 발생되었습니다");
    }

}