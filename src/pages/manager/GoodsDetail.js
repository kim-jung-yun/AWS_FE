import React, { useEffect, useState } from "react";
import { getAuthToken } from "../../util/auth";
import { Link, json, useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";


export default function GoodsDetail() {
    const [datas, setDatas] = useState(useLoaderData());
    const imgPath = datas[0].image_path;
    let navigate = useNavigate();

    // 유통기한 계산
    function isExpired(date) {
        return dayjs().isAfter(dayjs(date).format("YYYY-MM-DD"));
    }
    function imminentExpiration(date) {
        let compareDate = dayjs(date).diff(dayjs(), "day", true);
        if (compareDate < 7 && compareDate > 0) {
            return true;
        }
    }
    
    return (
        <>
            <div className="w-full flex items-center justify-center flex-col">
                <div className="border w-fit ">
                    <ImageDisplayComponent image_path={imgPath} />
                </div>
                <div className="w-full">
                    <div className="w-4/5 mx-auto flex h-16 justify-around items-center rounded-md shadow-lg mt-4 font-semibold text-center" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                        <span className="w-1/12">번호</span>
                        <span className="w-2/12">카테고리</span>
                        <span className="w-3/12">상품명</span>
                        <span className="w-20 mx-3">상세</span>
                        <span className="w-1/12 mx-3">상품상태</span>
                        <span className="w-1/12 mx-3">보관유형</span>
                        <span className="w-1/12">보관장소</span>
                        <span className="w-2/12">보관명칭</span>
                        <span className="w-1/12 mr-5">유통기한</span>
                    </div>
                    <div className="w-full  overflow-auto h-72">
                        <div className="w-4/5 mx-auto ">
                            {datas.map((items, index) => {
                                return (
                                    <div className="flex h-16 justify-around items-center rounded-md shadow-lg my-4 text-center" style={{ backgroundColor: "#f6f5efb3", border: "1px solid #d5d5d5" }}>
                                        <span className="w-1/12">{index + 1}</span>
                                        <span className="w-2/12" style={isExpired(items.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{items.category_name}</span>
                                        <span className="w-3/12" style={isExpired(items.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{items.product_name} ({items.product_standard}, {items.product_unit})</span>
                                        <span className="w-20 mx-3 " style={isExpired(items.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : null}>{items.product_spec}</span>
                                        <span className="w-1/12 mx-3" style={{ boxShadow: "inset 0 -30px 0 rgb(255, 245, 160)" }}>{items.item_status}</span>
                                        <span className="w-1/12 mx-3">{(items.location_area === "FR") ? "매장" : "창고"}</span>
                                        <span className="w-1/12">{items.location_section_name}</span>
                                        <span className="w-2/12">{items.location_alias}</span>
                                        <span className="w-1/12 mr-5" style={isExpired(items.item_exp) ? { textDecoration: 'line-through rgb(255, 80, 80) 2px' } : (imminentExpiration(items.item_exp) ? { boxShadow: 'inset 0 -30px 0 rgb(255, 200, 200)' } : null)}>{dayjs(items.item_exp).format("YYYY-MM-DD")}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <Link to="/branch/stock/product/list" className="flex h-12 justify-center items-center rounded-lg shadow-lg my-4 w-1/12 mx-auto page_itms" style={{ border: "1px solid #d5d5d5" }}>
                    확인
                </Link>
            </div>

        </>
    )
}

export async function loader({ request }) {
    console.log("ProductDetailPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    // const params = useParams();
    const paramIndex =  request.url.lastIndexOf("/") +1;
    const product_id = request.url.slice(paramIndex);
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: `/ssgtarbucks_BE/api/v1/product/detail/${product_id}`,
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });

    console.log("ProductDetailPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}

const ImageDisplayComponent = ({ image_path }) => {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAuthToken();
                //get으로 하면 파일 경로를 들켜서 put방식으로 변경
                const response = await axios.put(
                    '/ssgtarbucks_BE/api/v1/stock/product/image',
                    { image_path: image_path },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'jwtauthtoken': token,
                        },
                        responseType: 'arraybuffer',
                    }
                );

                // 배열 버퍼를 base64 문자열로 변환
                const base64Image = arrayBufferToBase64(response.data);
                setImageData(`data:image/jpeg;base64,${base64Image}`);
            } catch (error) {
                console.error('이미지를 가져오는 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [image_path]);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return <>{imageData && <img src={imageData} alt="대체사진" style={{ height: '320px', width: '320px' }} />}</>;
};