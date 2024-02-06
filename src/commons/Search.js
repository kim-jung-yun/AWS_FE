import logo from "../sources/image/logo1.png";
import "../sources/css/search.css";
import scanner from "../sources/image/Scanner.png";
import magnifier from "../sources/image/magnifier.png";
import { Link, useNavigate } from "react-router-dom";
import { useState ,useEffect } from "react";
import Modal_search from "./Modal_search";
import PopUp from "../commons/PopUp";    

export default function Searching() {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const branch_id = localStorage.getItem("branch_id");
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
    };
    //////////////////////////////////////////////////////////////////////

    function handleSearch() {
        console.log("search :", searchQuery);
        const searchUrl = `/branch/search/list/${searchQuery}`;
        if(!searchQuery){
            openPopUp("check","검색어를 입력해주세요.");
        }else{
            navigate(searchUrl);
        }
    };

    function handleOnKeyPress(e) {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    const handleScanWebCam = (result) => {
        /* QR 유효성 검사 */
        console.log("QR value :", result);
        //장소검색인 경우, branch_id가 일치해야 검색이 가능함
        if (!result.includes('@') && !result.startsWith(branch_id)) {
            setModalOpen(false);
            openPopUp("check","담당 지점의 QR코드를 스캔해주세요.");
            return ;
        }
        setModalOpen(false);
        /* 검색 결과 전달 */;
        const searchUrl = `/branch/qrcode/search/list/${result}`;
        navigate(searchUrl, { state: {qrValue : result }});
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

return (
    <>
        <header>
            <Link to="/branch/main">
                <div className="logo">
                    <img src={logo} alt="logo" id="logo_img" className="hover:cursor-pointer"/>
                    <h2 id="logo_title">SSGTARBUCKS</h2>
                </div>
            </Link>
            <div className="header_inn">
                <div id="search" >
                    <input type="text" id="search_inn" name="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleOnKeyPress(e)} />
                    <img src={magnifier} width={35} className="icon magnifier" onClick={handleSearch} />
                </div>
                <p className="hover:cursor-pointer">
                    {/* <i className="fa-solid fa-expand fa-2xl icon" ></i> */}
                    <img src={scanner} width={35} className="icon" onClick={() => setModalOpen(true)} />
                </p>
            </div>
        </header>
        {modalOpen && 
            <Modal_search
                onCancel={handleModalClose}
                onScan={handleScanWebCam}
                onType={"검색할 상품의"}
            />
            }
            {isPopUpOpen &&
                <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            }
    </>
)
}
