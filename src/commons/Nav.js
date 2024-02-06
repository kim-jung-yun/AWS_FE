import { Form, Link, useLocation } from "react-router-dom";
import "../sources/css/nav.css";
import { useState } from "react";


export default function Nav(){
    let [isActive, setIsActive] = useState(false);
    let [masterData, setMasterData] = useState(false);
    let [wareHousing, setWareHousing] = useState(false);
    let [inventory, setInventory] = useState(false);
    let [factory, setFactory] = useState(false);
    let location = useLocation();

    let navIndex = (path) => {
        if(location.pathname.includes(path)){
            return true;
        }else{
            return false;
        }
    }

    return(
        <>
            <nav style={(isActive ? {width : "3%"} : {width : "11%"})}>
                <div className="content">
                    <div className="w-full flex flex-col justify-center">
                        <div className={navIndex("location") && "bg-green-700"}>
                        <div className="w-full flex justify-center" onClick={()=>{setMasterData(!masterData)
                                                                setWareHousing(false)
                                                                setInventory(false)
                                                                setFactory(false)}}>
                            <div className="flex items-center justify-evenly w-8/12 menu_item_color">
                                <i className="fa-solid fa-qrcode fa-lg my-7 "></i>
                                { !isActive && 
                                <span className="text-lg font-semibold ">
                                    기준정보
                                </span>
                                }
                            </div>
                        </div>
                        </div>
                        {isActive ? null : (masterData ? <MasterData/> : null)}
                        <div className={navIndex("income") && "bg-green-700"}>
                        <div className="w-full flex justify-center" onClick={()=>{setWareHousing(!wareHousing)
                                                                setMasterData(false)
                                                                setInventory(false)
                                                                setFactory(false)}}>
                            <div className="flex items-center justify-evenly w-8/12 menu_item_color">
                                <i className="fa-solid fa-truck fa-lg  my-7"></i>
                                { !isActive &&
                                <span className=" text-lg font-semibold">
                                    입고관리
                                </span>
                                }
                            </div>
                        </div>
                        </div>
                        {isActive ? null : (wareHousing ? <WareHousing/> : null)}
                        <div className={navIndex("stock") && "bg-green-700"}>
                        <div className="w-full flex justify-center" onClick={()=>{setInventory(!inventory)
                                                                setMasterData(false)
                                                                setWareHousing(false)
                                                                setFactory(false)}}>
                            <div className="flex items-center justify-evenly w-8/12 menu_item_color">
                                <i className="fa-solid fa-warehouse fa-lg  my-7"></i>
                                { !isActive &&
                                    <span className=" text-lg font-semibold">
                                        재고관리
                                    </span>
                                }
                            </div>
                        </div> 
                        </div>
                        {isActive ? null : (inventory ? <Inventory/> : null)}
                        <div className={(navIndex("discard") || navIndex("sale")) && "bg-green-700"}>
                        <div className="w-full flex justify-center" onClick={()=>{setFactory(!factory)
                                                                setMasterData(false)
                                                                setWareHousing(false)
                                                                setInventory(false)}}>
                            <div className="flex items-center justify-evenly w-8/12 menu_item_color">
                                <i className="fa-solid fa-arrow-left fa-lg  my-7"></i>
                                { !isActive &&
                                    <span className=" text-lg font-semibold">
                                        출고관리
                                    </span>
                                }
                            </div>
                        </div>
                        </div>
                        {isActive ? null : (factory ? <Factory/> : null)}
                        <div className={navIndex("mypage") && "bg-green-700"}>
                        <Link to="/branch/mypage" className="w-full flex justify-center">
                            <div className="flex items-center justify-evenly w-8/12 menu_item_color">
                                <i className="fa-solid fa-user fa-lg  my-7"></i>
                                { !isActive &&
                                    <span className=" text-lg font-semibold">
                                        내 정보
                                    </span>
                                }
                            </div>
                        </Link>
                        </div>
                    </div>
                    <hr style={{width:"100%", margin:"30px 0px"}}></hr>
                    <div onClick={
                        ()=>{
                            // let parent = e.target.parentNode.parentNode;
                            // parent.parentNode.setAttribute("style", "width : 3%");
                            setIsActive(isActive=>!isActive);
                        }
                    } style={{ marginTop : "20px"}} className="shadow-lg w-7 h-7 text-center flex items-center justify-center rounded-full toggle_icon hover:animate-bounce">
                        <i className={`fa-solid fa-caret-${(isActive ? "right" : "left")} fa-lg` } style={{color:"#343e36"}} ></i>
                    </div>
                    { !isActive && !masterData && !wareHousing && !inventory && !factory &&
                    <>
                        <hr style={{width:"100%", margin:"42vh 0px 10px", color:"#d5d5d5" }}></hr>
                            <div>
                                <Form action="/branch/logout" method="POST">
                                    <span className="menu_item_color text-lg font-semibold">
                                        <button>로그아웃</button>
                                    </span>
                                </Form>
                            </div>
                    </>
                    }
                </div>
            </nav>
        </>
    )
}


function MasterData(){
    return(
        <>
            <div className="menu_name_itm">
                <Link to="/branch/location/new" className="menu_item_color text-lg font-semibold menu_name_itms">장소등록</Link>
                <Link to="/branch/location/list" className="menu_item_color text-lg font-semibold menu_name_itms">장소조회</Link>
            </div>
        </>
    )
}

function WareHousing(){
    return(
        <>
            <div className="menu_name_itm">
                <Link to="/branch/income/list" className="menu_item_color text-lg font-semibold menu_name_itms">입고내역</Link>
                <Link to="/branch/income/inspection" className="menu_item_color text-lg font-semibold menu_name_itms">검수하기</Link>
                <Link to="/branch/income/new" className="menu_item_color text-lg font-semibold menu_name_itms">재고등록</Link>
            </div>
        </>
    )
}

function Inventory(){
    return(
        <>
            <div className="menu_name_itm">
                <Link to="/branch/stock/inventory/list" className="menu_item_color text-lg font-semibold menu_name_itms">재고조회</Link>
                <Link to="/branch/stock/product/list" className="menu_item_color text-lg font-semibold menu_name_itms">상품조회</Link>
            </div>
        </>
    )
}

function Factory(){
    return(
        <>
            <div className="menu_name_itm">
                <Link to="/branch/outcome/product" className="menu_item_color text-lg font-semibold menu_name_itms">사용등록</Link>
                <Link to="/branch/discard/product" className="menu_item_color text-lg font-semibold menu_name_itms">폐기등록</Link>
                <Link to="/branch/sale/product" className="menu_item_color text-lg font-semibold menu_name_itms">판매갱신</Link>
            </div>
        </>
    )
}