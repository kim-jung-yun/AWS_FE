import Search from "../../commons/SearchManager"
import Nav from "../../commons/NavManager"
import { useEffect, useState } from "react"
import axios from "axios";

export default function History(){
    let [toggle, setToggle] = useState(false);
    const [datas, setDatas] = useState([]);

    useEffect(()=>{
        axios.get("https://gonookim.github.io/income.json")
        .then((response) => { 
            console.log("check : ", response);
            setDatas(response.data);
        })
    },[]);

    return(
        <>
            <Search />
            <div className="low-opacity-bg-image" style={{display:"flex"}}>
                <Nav />
                <div style={{ height:"92vh"}} className="w-full mx-auto my-auto  overflow-scroll">
                    {datas.map(function(r,i){
                        return(
                        <>
                            <div style={{border:"1px solid #d5d5d5", borderRadius:"7px", background:"#f6f5efb3", height:"6.5%"}} 
                                className="w-3/5 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-4">
                                <i className="fa-solid fa-angle-down fa-fade fa-lg grow-0 w-1/6" onClick={()=>{setToggle(!toggle)}}></i>
                                <span className="w-1/6">{r.income_id}</span>
                                <span className="w-2/6">{r.income_code}</span>
                                <span className="w-1/6">{r.income_amount} 개</span>
                                <span className="w-1/6">{r.income_date}</span>
                            </div>
                        </>
                        )
                    })}

                </div>
            </div>
        </>
    )
}