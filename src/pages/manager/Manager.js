import React, { useState, useEffect } from 'react';
import SearchManager from "../../commons/SearchManager";
import NavManager from "../../commons/NavManager";
import axios from "axios";

export default function Manager(){


    return(
        <>
            <div className="w-full" style={{height:"92vh"}}>
                <div className="h-full text-center flex items-center flex-col">
                    <h1 className="text-5xl h-1/12 mt-5" style={{fontFamily: 'SUITE-Regular'}}>
                        SSGTARBUCKS에 오신 것을 환영합니다 :)
                        <p>스타벅스 <span style={{boxShadow: "inset 0 -20px 0 #D9FCDB", fontFamily:"EASTARJET-Medium"}}>관리자 페이지</span> 입니다 </p>
                    </h1>
                </div>
            </div>
        </>
    )
}

