import React, { useState } from "react";
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import '../sources/css/findpwd.css'
import PopUp from "../commons/PopUp"; 

export default function FindPwd() {

    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const navigate = useNavigate();
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
        if(comment==="비밀번호가 직원코드로 초기화되었습니다."){
            navigate('/');
        }
    };
    //////////////////////////////////////////////////////////////////////

    // 사원 인증
    const handleFindButtonClick = async (event) => {

        if (userId === '' || userEmail === '') {
            openPopUp("check","직원코드와 이메일을 모두 입력해주세요.");
            return;
        }

        try {
            const response = await axios({
                method: "POST",
                url: '/ssgtarbucks_BE/api/v1/user/find',
                data: {
                    user_id: userId,
                    user_email: userEmail,
                    auth_code: authCode,
                },
            });

            console.log('Axios Response:', response.data);

            if (response.data === '') {
                console.log("일치하는 유저정보 없음");
                openPopUp("fail","직원코드 또는 이메일을 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.");
            } else {
                console.log("일치하는 유저정보 있음");
                // 인증코드입력칸 열기
                setShowAuthCodeInput(true);
            }

        } catch (error) {
            console.error('Axios Error:', error);
        }
    };

    const handleVerificationButtonClick = async () => {
        if (authCode === '') {
            openPopUp("check","인증번호를 입력해주세요.");
            return;
        }

        try {
            console.log(authCode);

            const verificationResponse = await axios({
                method: "POST",
                url: '/ssgtarbucks_BE/api/v1/user/verify',
                data: {
                    user_id: userId,
                    auth_code: authCode,
                },
            });

            console.log('Verification Response:', verificationResponse.data);

            if (verificationResponse.data === '성공') {
                // 로그인페이지 이동
                // 팝업 전송
                openPopUp("success","비밀번호가 직원코드로 초기화되었습니다.");
                
            }else {
                openPopUp("fail","인증코드가 일치하지 않습니다.");
            }

            setVerificationResult(verificationResponse.data);

        } catch (error) {
            console.error('Verification Axios Error:', error);
        }
    };

    return (
        <>
        <div className="bg">
            <div>
                <div className="circle shadow-lg"></div>
                <div className="card_pwd shadow-lg" style={showAuthCodeInput ? {height : "500px"} : null}>
                    <h2>SSGTARBUCKS</h2><br />
                    <h4>비밀번호 찾기</h4>
                    <div className="form">
                        <input type="text" placeholder="직원코드" name="user_id" value={userId} onChange={(e) => setUserId(e.target.value)} />
                        <input type="e-mail" placeholder="이메일" name="user_email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        <button type="submit" onClick={handleFindButtonClick}>인증번호 발송</button>
                    </div>
                    <div className={showAuthCodeInput ? "form" : "form1"}>
                        <input type="text" placeholder="인증번호" value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
                        <button onClick={handleVerificationButtonClick}>인증번호 확인</button>
                    </div>
                    <footer>
                        <Link to="/"><button className="backbutton">BACK</button></Link>
                    </footer>
                </div>
            </div>
        </div>
        {isPopUpOpen &&(
            <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
        )}
        </>
    );
}