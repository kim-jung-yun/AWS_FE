import React, { useState } from "react";
import SearchManager from "../../commons/SearchManager";
import NavManager from "../../commons/NavManager";
import { useLoaderData, useNavigate, useParams } from "react-router";
import { Form, Link, json } from "react-router-dom";
import { getAuthToken } from "../../util/auth";
import axios from "axios";
import PopUp from "../../commons/PopUp.js";  

export default function ManagerDetail() {
    const [showModifyRenderer, setShowModifyRenderer] = useState(false);
    const [datas, setDatas] = useState(useLoaderData());
    const [edit, setEdit] = useState(false);
    const [modifyList, setModifyList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(datas);
    const [initialUserId, setInitialUserId] = useState(datas.user_id);
    const params = useParams();
    const navigate = useNavigate();
    // const targetObject = datas.find(item => item.branch_id === params.branch_id);
    const handleEditClick = async () => {
        console.log("버튼누름");
        try {
            const token = getAuthToken();
            const response = await axios({
                method: "GET",
                url: `/ssgtarbucks_BE/api/v1/admin/branch/user/modify/list`,
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                }
            });
            console.log('BranchIsNull=========================>', response.data);

            setModifyList(response.data);
            setShowModifyRenderer(true);

        } catch (error) {
            console.error('Error :', error);
        }
    };

    const handleUpdateDetails = (data) => {
        setSelectedItem(data);
        console.log('Initial User ID:', initialUserId);
    };

    return (
        <>
            <div className="w-full " style={{ height: "100%", fontFamily: 'Pretendard-Regular' }}>
                <div className="w-2/4 h-full mx-auto my-8">

                    <div className="flex h-14 justify-around items-center  my-2" >
                        <h4 className="text-3xl font-bold " style={{ fontFamily: "EASTARJET-Medium", textDecoration: "underline #eaeaea", textUnderlineOffset: "10px" }}>
                            {datas.branch_name}
                        </h4>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="e-mail">지점 코드</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="e-mail" id="e-mail" value={datas.branch_id}></input>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="id">지점 주소</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="text" id="address" value={datas.branch_address.match(/([^(]*)/)[0].trim()}></input>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="id">상세주소</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="text" id="address" value={datas.branch_address.match(/\(([^)]+)\)/)[1].trim()}></input>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="number">담당 직원</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="text" id="number" value={datas.user_name}></input>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="number">직원 코드</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="text" id="number" value={datas.user_id}></input>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="number">연락처</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="text" id="number" value={datas.user_phone}></input>
                    </div>
                    <div className="w-full mx-auto flex h-16 justify-around items-center rounded-lg shadow-lg my-6" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <h4 className="text-md font-bold pl-4">
                            <label for="number">이메일</label>
                        </h4>
                        <input className="w-96 h-10 text-center text-xl border" disabled type="text" id="number" value={datas.user_email}></input>
                    </div>
                    <div className="w-8/12 mx-auto flex h-20 justify-around items-center rounded-md">
                        <button className="text-lg border page_itms w-1/4 mx-5 h-3/5 shadow-lg rounded-md" style={{ fontFamily: 'Pretendard-Regular' }} onClick={() => { setEdit(!edit); handleEditClick() }}>
                            담당직원 변경
                        </button>
                        <Link to="/admin/branch/list" className="text-lg border page_itms w-1/4 mx-5 h-3/5 shadow-lg rounded-md flex items-center justify-center" style={{ fontFamily: 'Pretendard-Regular' }}>뒤로가기</Link>
                    </div>
                </div>
            </div>
            {edit && showModifyRenderer && <Modal_change_manager onCancel={() => setShowModifyRenderer(false)} modifyList={modifyList} onUpdateDetails={handleUpdateDetails} initialUserId={initialUserId} />}
        </>
    )
}

const Modal_change_manager = ({ onCancel, modifyList, onUpdateDetails, initialUserId }) => {


    return (
        <>
            <Form>
                <div className="modal-container" style={{ fontFamily: 'Pretendard-Regular' }}>
                    <div className="bg-white h-3/5 w-6/12 flex flex-col items-center justify-around rounded-lg border-8 border-lime-700">
                        <ModifyRenderer modifyList={modifyList} onUpdateDetails={onUpdateDetails} initialUserId={initialUserId} onCancel={onCancel}/>

                    </div>
                </div>
            </Form>
        </>
    );
};

const ModifyRenderer = ({ modifyList, onUpdateDetails, initialUserId, onCancel }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    let selectedIndex;
    let selectedData;

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
        onCancel();
        window.location.reload();
    };
    //////////////////////////////////////////////////////////////////////
    const handleSelectChange = (event) => {
        selectedIndex = event.target.selectedIndex;
        selectedData = modifyList[selectedIndex - 1];
        setSelectedItem(selectedData);
    };
    const handleSelectSubmit = async (selectedItem) => {
        console.log("initialUserId >>>", initialUserId);
        console.log("액시오스 ==>", selectedItem);
    
        try {
            const token = getAuthToken();
            await axios({
                method: "PUT",
                url: "/ssgtarbucks_BE/api/v1/admin/branch/user/modify",
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                },
                data: selectedItem,
                params: {
                    initialUserId: initialUserId
                }
            });
            console.log('Data sent to /branch/user/modify:', selectedItem);
            openPopUp("success","담당직원이 변경되었습니다.");
        } catch (error) {
            console.error('Error sending data to /branch/user/modify:', error);
            alert("변경실패하였습니다.");
        }
    };
    

    return (
        <>
            <h1 className="text-2xl font-semibold" style={{ textDecoration: "underline #eaeaea", textUnderlineOffset: "10px" }}>변경가능 목록</h1>
            <select onChange={handleSelectChange} className="text-lg border h-12 w-2/3 ">
                <option value="">선택</option>
                {modifyList.map((item, index) => (
                    <option key={index}>
                        {item.user_id}/{item.user_name}/{item.user_phone}/{item.user_email}
                    </option>
                ))}
            </select>
            <div className="w-full flex justify-center">
                <button  onClick={() => { handleSelectSubmit(selectedItem); }} className="border w-2/12 h-10 page_itms rounded-sm shadow-md mx-4">확인</button>
                <button onClick={onCancel} className="border w-2/12 h-10 page_itms rounded-sm shadow-md mx-4">취소</button>
            </div>
            {isPopUpOpen &&(
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>

    );
};


export async function loader({ request, params }) {
    console.log("BranchDetailPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("params:", params);


    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/admin/branch/detail",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: params.branch_id
        }
    });

    console.log("BranchDetailPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}
