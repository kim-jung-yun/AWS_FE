import Search from "../commons/Search"
import Nav from "../commons/Nav"
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { json, useLoaderData } from "react-router-dom";
import { getAuthToken } from "../util/auth";
import dayjs from "dayjs";

export default function Main(){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const newDate = new Date(selectedDate);
    console.log("newDate : ", newDate);
    // let changedDate =[new Date(newDate.setDate(newDate.getDate() -2)), new Date(newDate.setDate(newDate.getDate() -1)), new Date(newDate.setDate(newDate.getDate())) ,new Date(newDate.setDate(newDate.getDate() +1)), new Date(newDate.setDate(newDate.getDate() +2))];
    let changedDate =[new Date(new Date(selectedDate).setDate(newDate.getDate() -2)), 
                        new Date(new Date(selectedDate).setDate(newDate.getDate() -1)), 
                        new Date(new Date(selectedDate).setDate(newDate.getDate() )),
                        new Date(new Date(selectedDate).setDate(newDate.getDate() +1)), 
                        new Date(new Date(selectedDate).setDate(newDate.getDate() +2))];

    const [datas, setDatas] = useState(useLoaderData());
    const [ expData, setExpData ] = useState(datas);
    let {expDataList, remainDataList} = datas;
    console.log("loaderDataMain >>>>>" , datas);
    console.log("loaderDataMain >>>>>" , expDataList);
    console.log("loaderDataMain2 >>>>>" , remainDataList);

    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    const branch_name = localStorage.getItem("branch_name");

    const handleDateChange = (daysToAdd) => {
        console.log("~~~~~~~~~~~~~~~~~",daysToAdd);
        newDate.setDate(selectedDate.getDate() + daysToAdd);
        setSelectedDate(newDate);
        console.log("~~~~~~~~~~~~~~~~~",newDate);
        // onSelectDate(newDate);
        handleRetrieve(newDate);
    };

    const handleDateToday = () =>{
        setSelectedDate(new Date());
        handleRetrieve(null);
    }

    const handleRetrieve = async (newDate) => {
        try {
            // onSelectDate(selectedDate);
            console.log("selectedDate>>>",newDate);

            const token = getAuthToken();
            const branch_id = localStorage.getItem("branch_id");

            const response = await axios({
                method: "GET",
                url: `/ssgtarbucks_BE/api/v1/branch/main/exp`,
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                },
                params: {
                    branch_id: branch_id,
                    curDate: newDate
                }
            });

            console.log("select exp date :", response.data);

            setDatas({ ...datas, expDataList: response.data }); // Update expDataList
        } catch (error) {
            console.error('Error selecting exp date:', error);
        }
    };

    return(
        <>
            <div className="w-full" style={{height:"92vh"}}>
                <div className="h-full text-center flex items-center flex-col">
                    <h1 className="text-5xl h-1/12 mt-5" style={{fontFamily: 'SUITE-Regular'}}>
                        SSGTARBUCKS에 오신 것을 환영합니다 :)
                        <p>스타벅스 <span style={{boxShadow: "inset 0 -20px 0 #D9FCDB", fontFamily:"EASTARJET-Medium"}}>{branch_name}</span> 입니다 </p>
                    </h1>
                    <div className="w-11/12 h-32 flex flex-col justify-end items-center" style={{fontFamily: 'Pretendard-Regular'}}>
                            <h3 className="mb-3 text-xl ">TODAY : {dayjs().format("YYYY년 M월 D일")} <button className=" page_itms w-14 border rounded-md text-lg ml-3" onClick={handleDateToday}>조회</button> </h3>
                            
                            <div className="">
                                
                                <input type="radio" id="date1" className="border mx-2 w-20 rounded-md h-8 hidden" value="date1" name="date" /><label for="date1" className="border w-20 mr-2 rounded-md py-1 page_itms hover:cursor-pointer" onClick={()=>handleDateChange(-2)}>{`${changedDate[0].getMonth() +1}월 ${changedDate[0].getDate()}일`}</label>
                                <input type="radio" id="date2" className="border mx-2 w-20 rounded-md h-8 hidden" value="date2" name="date" /><label for="date2" className="border w-20 mr-2 rounded-md py-1 page_itms hover:cursor-pointer" onClick={()=>handleDateChange(-1)}>{`${changedDate[1].getMonth() +1}월 ${changedDate[1].getDate()}일`}</label>
                                <input type="radio" id="date3" className="border mx-2 w-20 rounded-md h-8 hidden" value="date3" name="date" /><label for="date3" className="border w-20 mr-2 rounded-md py-1 bg-lime-800 text-white " onClick={handleRetrieve}>{`${changedDate[2].getMonth() +1}월 ${changedDate[2].getDate()}일`}</label>
                                <input type="radio" id="date4" className="border mx-2 w-20 rounded-md h-8 hidden" value="date4" name="date" /><label for="date4" className="border w-20 mr-2 rounded-md py-1 page_itms hover:cursor-pointer" onClick={()=>handleDateChange(1)}>{`${changedDate[3].getMonth() +1}월 ${changedDate[3].getDate()}일`}</label>
                                <input type="radio" id="date5" className="border mx-2 w-20 rounded-md h-8 hidden" value="date5" name="date" /><label for="date5" className="border w-20 mr-2 rounded-md py-1 page_itms hover:cursor-pointer" onClick={()=>handleDateChange(2)}>{`${changedDate[4].getMonth() +1}월 ${changedDate[4].getDate()}일`}</label>
                            </div>
                    </div>
                    <div className="w-11/12 h-72 text-start flex justify-center flex-col ">
                        <h3 className="text-xl h-10  bg-lime-800 text-white rounded-md w-fit px-4 my-2 flex items-center"
                            >
                            유통기한 임박 목록
                        </h3>
                        {expDataList.length ? 
                        <Table1 onLoadData={datas} />
                        : <h1 className="text-xl">불러올 목록이 없습니다.</h1>}
                    </div>
                    <div className="w-11/12 h-72 text-start flex justify-center flex-col ">
                        <h3 className="text-xl h-10  bg-lime-800 text-white rounded-md w-fit px-4 my-2 flex items-center">
                            발주추천 목록
                        </h3>
                        {remainDataList.length ? 
                        <Table2 onLoadData={datas}/>
                        : <h1 className="text-xl">불러올 목록이 없습니다.</h1>}
                    </div>
                </div>
            </div>
        </>
    )
}


function Table1({onLoadData}){
let {expDataList, remainDataList} = onLoadData;

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
    return(
        <>
            <div className="rounded-xl overflow-auto h-full" >
                <table className="w-full mx-auto text-lg shadow-lg" style={{borderRadius:"10px"}}>
                    <thead >
                        <tr className="text-center" style={{backgroundColor:"#f6f5efb3"}} >
                            <th className="px-1 w-14">번호</th>
                            <th className="px-1 w-40">카테고리</th>
                            <th className="px-1 w-2/12">상품명</th>
                            <th className="px-1">규격</th>
                            <th className="px-1">단위</th>
                            <th className="px-1 w-1/12">옵션</th>
                            <th className="px-1 w-28">유통기한</th>
                            <th className="px-1 w-1/12">재고상태</th>
                            <th className="px-1">보관유형</th>
                            <th className="px-1">보관장소</th>
                            <th className="px-1 w-2/12">보관명칭</th>
                            <th className="px-1">수량</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expDataList.map(function(r,i){
                            return(
                                <tr className="h-10 text-center" style={{borderBottom:"1px dashed black", fontFamily:'Pretendard-Regular'}} key={`${r.product_id}-${i}`}>
                                    <td className="px-1 w-14">
                                        {i+1}
                                    </td>
                                    <td className="px-1 w-40">
                                        {r.category_name}
                                    </td>
                                    <td className="px-1 w-2/12"> 
                                        {r.product_name}
                                    </td>
                                    <td className="px-1">
                                        {r.product_standard}
                                    </td>
                                    <td className="px-1">
                                        {r.product_unit}
                                    </td>
                                    <td className="px-1 w-1/12">
                                        {r.product_spec}
                                    </td>
                                    <td className="px-1 w-28 ">
                                        <span style={{boxShadow: "inset 0 -20px 0 rgb(255, 200, 200)"}}className=" text-lg">{dayjs(r.item_exp).format("YYYY-MM-DD")}</span>
                                    </td>
                                    <td className="px-1 w-1/12">
                                        <span className=" text-lg" style={{boxShadow: "inset 0 -20px 0 rgb(255, 245, 160)"}}>{r.item_status}</span>
                                    </td>
                                    <td className="px-1">
                                        {getLocationType(r.location_area)}
                                    </td>
                                    <td className="px-1">
                                        {r.location_section_name}
                                    </td>
                                    <td className="px-1 w-2/12">
                                        {r.location_alias}
                                    </td>
                                    <td className="px-1">
                                        {r.stock_quantity}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

function Table2({onLoadData}){
    let {expDataList, remainDataList} = onLoadData;
        return(
            <>
                <div className="rounded-xl overflow-auto h-full">
                    <table className="w-full mx-auto text-lg text-center shadow-lg" style={{borderRadius:"10px"}}>
                        <thead  >
                            <tr style={{backgroundColor:"#f6f5efb3"}} >
                                <th className="px-1">번호</th>
                                <th className="px-1">카테고리</th>
                                <th className="px-1">상품명</th>
                                <th className="px-1">규격</th>
                                <th className="px-1">단위</th>
                                <th className="px-1">옵션</th>
                                <th className="px-1">잔여수량</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {remainDataList.map(function(r,i){
                                return(
                                    <tr className="h-10" style={{borderBottom:"1px dashed black", fontFamily:'Pretendard-Regular'}} key={`${r.product_id}-${i}`}>
                                        <td className="px-1">
                                            {i+1}
                                        </td>
                                        <td className="px-1">
                                            {r.category_name}
                                        </td>
                                        <td className="px-1">
                                            {r.product_name}
                                        </td>
                                        <td className="px-1">
                                            {r.product_standard}
                                        </td>
                                        <td className="px-1">
                                            {r.product_unit}
                                        </td>
                                        <td className="px-1">
                                            {r.product_spec}
                                        </td>
                                        <td className="px-1 flex justify-center">
                                            <p style={{boxShadow: "inset 0 -25px 0 rgb(200, 200, 255)"}} className="w-fit">{r.total_product_quantity}개</p>
                                        </td>
                                    </tr>
                                )
                            })} 
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

export async function loader({ request }) {
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    const expResponse = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/branch/main/exp",
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
    const remainResponse = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/branch/main/remain",
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


    const expDataList = expResponse.data;
    const remainDataList = remainResponse.data;
    console.log("remainDataList>>>",remainDataList);
    return { expDataList, remainDataList };
}
