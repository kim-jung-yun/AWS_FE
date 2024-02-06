import React, { useState } from "react";
import '../../sources/css/position.css'
import Nav from "../../commons/Nav.js";
import Search from "../../commons/Search.js";
import axios from "axios";
import { Form, redirect, useNavigation } from "react-router-dom";
import { getAuthToken } from "../../util/auth.js";
import PopUp from "../../commons/PopUp.js";


export default function Position() {
    const [rows, setRows] = useState([{ location_area: '', location_section_name: '', location_column: '', location_row: '', location_alias: '' }]);
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'registering...';
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
       
    };
    //////////////////////////////////////////////////////////////////////
    const handleInputChange = (index, name, value) => {
        const newRows = [...rows];
        newRows[index][name] = value;
        setRows(newRows);
    };

    const addRow = (event) => {
        event.preventDefault();
        setRows([...rows, { location_area: '', location_section_name: '', location_column: '', location_row: '', location_alias: '' }]);
    };

    const deleteRow = (event) => {
        event.preventDefault(); // 폼 전송 방지
        if (rows.length > 1) {
            const newRows = [...rows];
            newRows.pop(); // Remove the last row
            setRows(newRows);
        }
    };

    const handleRegisterLocation = (event) => {
        //console.log('유효성 검사');
        for (const row of rows) {
            if (row.location_area === "보관유형") {
                openPopUp("check", "보관유형을 선택해주세요.");
                event.preventDefault(); 
            }
            else if (row.location_section_name === "보관장소") {
                setComment();
                openPopUp("check","보관장소를 선택해주세요.");
                event.preventDefault(); 
            }
            else if (!/^[가-힣a-zA-Z0-9\s]+$/.test(row.location_alias)) {
                openPopUp("check","보관명칭을 입력해주세요.");
                event.preventDefault(); 
            }
        }
        const locations = rows.map(row => {
            return {
                location_area: row.location_area,
                location_section_name: row.location_section_name,
                location_alias: row.location_alias,
            };
        });
        openPopUp("success", "장소등록이 완료되었습니다.");
        console.log("입력 사항 완료: ", locations);
    };

    return (
        <>
            {isPopUpOpen && (
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}

            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full my-auto overflow-auto" >
                <div className="my-4" style={{ margin: "0 auto", width: "70%" }}>
                    <Form method="POST">
                        <table className="w-full">
                            <thead>
                                <tr className="flex items-center h-16 border-2 shadow-md rounded-sm">
                                    <th className="h-full w-full flex items-center justify-center px-5 text-lg" style={{ backgroundColor: "#f6f5efb3" }}>보관유형</th>
                                    <th className="h-full w-full flex items-center justify-center px-5 text-lg" style={{ backgroundColor: "#f6f5efb3" }}>보관장소</th>
                                    <th className="h-full w-full flex items-center justify-center px-5 text-lg" style={{ backgroundColor: "#f6f5efb3" }}>보관명칭</th>
                                </tr>
                            </thead>
                            <tbody id="text">
                                {rows.map((row, index) => (
                                    <tr key={index} className="tbody">
                                        <td className="w-1/3 text-center text-lg">
                                            <select className="table_select border text-center" name="location_area" value={row.location_area} onChange={(e) => handleInputChange(index, 'location_area', e.target.value)}>
                                                <option value="보관유형">보관유형</option>
                                                <option value="FR">매장</option>
                                                <option value="BA">창고</option>
                                            </select>
                                        </td>
                                        <td className="w-1/3 text-center">
                                            <select className="table_select text-lg border text-center" name="location_section_name" value={row.location_section_name} onChange={(e) => handleInputChange(index, 'location_section_name', e.target.value)}>
                                                <option value="보관장소">보관장소 </option>
                                                <option value="냉동고">냉동고</option>
                                                <option value="냉장고">냉장고</option>
                                                <option value="다용도렉">다용도렉</option>
                                                <option value="매대">매대</option>
                                                <option value="상부장">상부장</option>
                                                <option value="쇼케이스">쇼케이스</option>
                                                <option value="진열대">진열대</option>
                                                <option value="서랍">서랍</option>
                                                <option value="수납장">수납장</option>
                                                <option value="하부장">하부장</option>
                                                <option value="기타">기타</option>
                                            </select>
                                        </td>
                                        <td className="w-1/3 text-center text-lg">
                                            <input className="table_input border text-center" type="text" name="location_alias" placeholder="보관명칭" value={row.location_alias} onChange={(e) => handleInputChange(index, 'location_alias', e.target.value)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <div className="my-14 flex justify-end items-center">
                                <div className="mr-8">
                                    <button className="text-lg border-2 w-28 h-10 rounded-md mx-1 shadow-md" id="hoverBtn" onClick={addRow}>행 추가</button>
                                    <button className="text-lg border-2 w-28 h-10 rounded-md mx-1 shadow-md" id="hoverBtn" onClick={deleteRow}>행 삭제</button>
                                </div>
                                <div>
                                    <button className="text-lg border-2 w-28 h-10 rounded-md mx-1 shadow-md" id="hoverBtn" onClick={handleRegisterLocation} disabled={isSubmitting}>저장</button>
                                    <button className="text-lg border-2 w-28 h-10 rounded-md mx-1 shadow-md" id="hoverBtn" type="reset" disabled={isSubmitting}>취소</button>
                                </div>
                                <h2>{isSubmitting ? '전송중...' : null}</h2>
                            </div>
                        </table>
                    </Form>
                </div>
            </div>
        </>
    )
}

export async function action({ request }) {
    console.log("RegisterLocationPage.action");
    const LOCATION_TYPES = {
        STORE: '매장',
        WAREHOUSE: '창고',
    };

    const LOCATION_SECTION_MAP = {
        "냉동고": "A",
        "냉장고": "B",
        "다용도렉": "C",
        "매대": "D",
        "상부장": "E",
        "쇼케이스": "F",
        "진열대": "G",
        "서랍": "H",
        "수납장": "I",
        "하부장": "J",
        "기타": "K"
      }

    const getLocationArea = (area) => {
        return area === LOCATION_TYPES.STORE ? "FR" : area === LOCATION_TYPES.WAREHOUSE ? "BA" : area;
    };

    const getLocationSection = (sectionName) => {
        return LOCATION_SECTION_MAP[sectionName] || sectionName;
    };

    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);
    const data = await request.formData();

    const location_area = data.getAll("location_area");
    const location_section_name = data.getAll("location_section_name");
    const location_alias = data.getAll("location_alias");
    console.log(location_area, location_section_name, location_alias);

    const jsonDataArray = location_area.map((_, index) => ({
        location_area: getLocationArea(location_area[index]),
        location_section_name: location_section_name[index],
        location_section: getLocationSection(location_section_name[index]),
        location_alias: location_alias[index],
        branch_id: branch_id
    }));

    console.log("jsonDataArray>>", jsonDataArray);
    console.log("jsonDataToString", JSON.stringify(jsonDataArray));
    let resData = '';
    try {
        const response = await axios({
            method: "post",
            url: '/ssgtarbucks_BE/api/v1/branch/location/new',
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
      //alert("보관장소를 정상적으로 등록하셨습니다.");
    } catch (error) {
        console.log("error:", error);
        
        throw new Error("error 발생되었습니다");
    }

    return redirect('/branch/location/list');
}

