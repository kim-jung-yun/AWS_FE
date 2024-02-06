import React, { useState } from "react";
import Nav from "../commons/Nav";
import Search from "../commons/Search"
import { getAuthToken } from "../util/auth";
import axios from "axios";
import { Form, json, useLoaderData, useNavigate } from "react-router-dom";
import PopUp from "../commons/PopUp";   

export default function MyPage() {
    const myData = useLoaderData();
    const [editPwd, setEditPwd] = useState(false);
   
    return (
        <>
            
            <div className="w-full " style={{ height: "100%", fontFamily: 'Pretendard-Regular' }}>
                <div className="w-8/12 h-3/6 mx-auto mt-10">
                    <div className="text-center h-14 mt-20" >
                        <h4 className="text-3xl font-bold " style={{ fontFamily: "EASTARJET-Medium", textDecoration: "underline #eaeaea", textUnderlineOffset: "10px" }}>
                            내 정보
                        </h4>
                    </div>
                    <div >
                        <div className="flex justify-around border-b mt-10 mb-4 pb-10">
                            <div >
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="id">지점 코드</label>
                                    </h4>
                                    <input className="w-80 h-10 border text-center text-xl" disabled type="text" id="id" value={myData.branch_id}></input>
                                </div>
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="id">지점명</label>
                                    </h4>
                                    <input className="w-80 h-10 border text-center text-xl" disabled type="text" id="id" value={myData.branch_name}></input>
                                </div>
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="id">지점 주소</label>
                                    </h4>
                                    <input className="w-80 h-10 border text-center text-xl" disabled type="text" id="address" value={myData.branch_address.match(/([^(]*)/)[0].trim()}></input>
                                </div>
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="id">상세주소</label>
                                    </h4>
                                    <input className="w-80 h-10 border text-center text-xl" disabled type="text" id="address" value={myData.branch_address.match(/\(([^)]+)\)/)[1].trim()}></input>
                                </div>
                            </div>

                            <div >
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="number">이름</label>
                                    </h4>
                                    <input className="w-96 h-10 border text-center text-xl" disabled type="text" id="number" value={myData.user_name}></input>
                                </div>
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="number">직원 코드</label>
                                    </h4>
                                    <input className="w-96 h-10 border text-center text-xl" disabled type="text" id="number" value={myData.user_id}></input>
                                </div>
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="e-mail">이메일</label>
                                    </h4>
                                    <input className="w-96 h-10 border text-center text-xl" disabled type="e-mail" id="e-mail" value={myData.user_email}></input>
                                </div>
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg my-4" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="number">연락처</label>
                                    </h4>
                                    <input className="w-96 h-10 border text-center text-xl" disabled type="text" id="number" value={myData.user_phone}></input>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="flex h-10 justify-end items-center">
                        <button className="text-lg page_itms h-full w-32 border rounded-md shadow-md mx-3" onClick={() => setEditPwd(!editPwd)}>비밀번호 변경</button>
                    </div>
                </div>
            </div>
            {editPwd && <Modal_change_pwd onCancel={()=> setEditPwd(false)}/> }

        </>
    )
}


export async function loader({ request }) {
    console.log("UserListPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    const user_type = localStorage.getItem("user_type");
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/branch/info",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });

    console.log("UserListPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}

const Modal_change_pwd = ({  onCancel }) => {
    const [checkPwd, setCheckPwd] = useState(""); 
    const [checkPwdConfirm, setCheckPwdConfirm] = useState(""); 
    const user_id = localStorage.getItem("user_id");
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
    };
    //////////////////////////////////////////////////////////////////////

    
    const handleChangePassword = async () => {
        try { 
            const token = getAuthToken();
            const response = await axios({
                method: "POST",
                url: "/ssgtarbucks_BE/api/v1/user/modify", 
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                },
                data: {
                    user_id: user_id,
                    user_pw: checkPwd
                }
            });

            console.log("Password Change Response:", response.data);
            openPopUp("success","비밀번호가 변경되었습니다.");
            
        } catch (error) {
            console.error("Password Change Error:", error);
        }
    };

    return (
        <>
            <Form>
                <div className="modal-container" style={{ fontFamily: 'Pretendard-Regular' }}>
                    <div className="bg-white h-3/5 w-6/12 flex flex-col items-center rounded-lg border-8 border-lime-700">
                        <h1 className="text-2xl pt-10 pb-2 h-1/3 font-semibold" style={{textDecoration: "underline #eaeaea", textUnderlineOffset: "10px" }}>비밀번호 변경</h1>
                        <div className="w-7/12 h-1/2">
                            <div className="h-1/2">
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg " style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="number">비밀번호</label>
                                    </h4>
                                    <input className="w-2/3 h-10 border text-center text-xl" type="password" id="number" onInput={(e)=>setCheckPwd(e.target.value)}></input>
                                </div>
                            </div>
                            <div className="h-1/2">
                                <div className="flex h-16 justify-between px-8 items-center rounded-lg shadow-lg" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                    <h4 className="text-lg font-bold mr-4">
                                        <label for="number">비밀번호 확인</label>
                                    </h4>
                                    <input className="w-2/3 h-10 border text-center text-xl" type="password" id="number" onInput={(e)=>setCheckPwdConfirm(e.target.value)}></input>
                                </div>
                            </div>
                            {checkPwd && (checkPwd == checkPwdConfirm) ? <h1 className="text-md text-red-500">비밀번호가 일치합니다.</h1> : (checkPwd && checkPwdConfirm ? <h1 className="text-md text-red-500">비밀번호가 일치하지 않습니다.</h1> : null)}
                        </div>
                        <div className="flex justify-center items-center my-10 h-1/4">
                            <button className="border-2 w-28 h-11 rounded-md page_itms mx-4" onClick={handleChangePassword}  disabled={!checkPwd || (checkPwd !== checkPwdConfirm)} >비밀번호 변경</button>
                            <button className="border-2 w-28 h-11 rounded-md page_itms mx-4" onClick={onCancel}>취소</button>
                        </div>
                    </div>
                </div>
            </Form>
            {isPopUpOpen &&(
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>
    );
};