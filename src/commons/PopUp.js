import React, { useState, useEffect } from "react";
import checkImage from "../sources/image/check.png";
import successImage from "../sources/image/success.png";
import failImage from "../sources/image/fail.png";

export default function PopUp({ onType, onClose, onComment }) {
    const [comment, setComment] = useState('');
    const [type, setType] = useState('');
    useEffect(() => {
        setComment(onComment);
        setType(onType);
        //console.log("onComment : " + comment);
    }, [onComment, onType]);

    const renderComment = () => {
        return comment.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <>
            <div className="modal-container ">
                <div className="madal-main " style={{ border: "5px solid rgb(77 124 15)", width: "30%", padding: "20px" }}>
                <div  style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                    {type === "check" && (
                        <img src={checkImage} alt="Check Image" style={{ width: "45px", height: "45px" }} />
                    )}
                    {type === "success" && (
                        <img src={successImage} alt="Success Image" style={{ width: "45px", height: "45px" }} />
                    )}
                    {type === "fail" && (
                        <img src={failImage} alt="Fail Image" style={{ width: "45px", height: "45px" }} />
                    )}
                </div>
                    <div style={{ paddingTop: "20px", textAlign: "center" }}>
                        <h2 style={{ fontSize: "18px" }}>{renderComment()}</h2>
                    </div>
                    <div style={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}>
                        <button
                            style={{
                                border: "1px solid rgba(106, 136, 30, 0.519)",
                                borderRadius: "3px",
                                boxShadow: "0px 5px 5px #ccc",
                                height: "35px",
                                width: "100px"
                            }}
                            onClick={() => onClose()}> 확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}