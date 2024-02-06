import { useEffect, useState } from "react"
import axios from "axios";
import { json, useLoaderData, NavLink, useNavigate } from "react-router-dom";
import { getAuthToken } from "../../util/auth";
import Modal_search from "../../commons/Modal_search";
import PopUp from "../../commons/PopUp.js";
import dayjs from "dayjs";

export default function History() {
    let [toggle, setToggle] = useState([]);
    const [incomeId, setIncomeId] = useState(0);
    const initialIncomeList = useLoaderData();
    const [modalOpen, setModalOpen] = useState(false);
    const [scanResult, setScanResult] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [incomeStatus, setIncomeStatus] = useState('');
    const [completeItemCode, setcompleteItemCode] = useState([]);

    //////////////////////////////////////////////////////////////////////
  /*팝업창*/
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [popupType, setPopupType] = useState('');
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const openPopUp = (type, comment) => {
    setModalOpen(false);
    setPopUpOpen(true);
    setComment(comment);
    setPopupType(type);
  };
  const closePopUp = () => {
    setPopUpOpen(false);
    if(comment=="검수 완료 처리되었습니다.\n검수상품을 재고로 등록하시기 바랍니다."){
    navigate('/branch/income/new');
  }
  };
  //////////////////////////////////////////////////////////////////////
    let groupedList = initialIncomeList.reduce((acc, curr) => {
        const { income_id } = curr;
        if (acc[income_id]) acc[income_id].push(curr);
        else acc[income_id] = [curr];
        return acc;
    }, {});

    console.log("groupedList >>>", groupedList);
    let groupedListkeys = Object.keys(groupedList).reverse();
    const resultArray = groupedListkeys.map(key => groupedList[key][0]);

    const handleModalClose = () => {
      setModalOpen(false);
  };
    const handleScanWebCam = (result) => {
        setScanResult(result);
    };
    const handleScannerClick = (item_code) => {
        setModalOpen(!modalOpen);
        console.log("스캔시작 with item_code:", item_code);
        setItemCode(item_code);        
    };

    //스캔값이 있으면
    useEffect(() => {
        const fetchData = async (itemCodeParam) => {
          if (!scanResult || !itemCodeParam) {
            return;
          }
          /* QR 유효성 검사 */
      console.log("스캔한 QR값 : ", scanResult, "상품코드 : ", itemCodeParam);
      // 올바르지 않은 상품 QR이 스캔된 경우(ex. 장소QR을 스캔함, 입고내역서 QR을 스캔함)
      if (!scanResult.includes('@') || !scanResult.includes('-')) {
        openPopUp("check", "상품 QR코드를 스캔해주세요.");
        setModalOpen(false);
        setItemCode('');
        setScanResult('');
        return;
      } else if(!scanResult.includes(itemCodeParam)){
        openPopUp("check", "해당 상품이 아닙니다. 다시 시도해주세요.");
        setModalOpen(false);
        setItemCode('');
        setScanResult('');
        return;
      }


          console.log("itemCode >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", itemCodeParam);



          try {
            const token = getAuthToken();
            const response = await axios.get(
              `/ssgtarbucks_BE/api/v1/income/inspection/product`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'jwtauthtoken': token
                },
                params: {
                  scanResult: scanResult,
                  itemCode: itemCodeParam
                }
              }
            );
    
            console.log("ShowIncomeList.response >>>>>>>>>>>..", response);
    
            if (response.status !== 200) {
              throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
            }
    
            const resData = response.data;
            console.log("resData>>>>>>>>>>>>>>", resData);
            if(resData === "성공") {
                setModalOpen(false);
                setcompleteItemCode(prevCompleteItemCode => [
                  ...prevCompleteItemCode,
                  itemCodeParam
                ]);
                console.log("6544444444444",completeItemCode);                                  
                //navigate(`/income/list/${incomeId}`);
                //window.location.reload();
            }

            //navigate(`/income/list/inspection/${incomeId}`);
          } catch (error) {
            console.error("Error during fetchData:", error);
            // navigate('/error', { state: { errorMessage: '조회시 없음' } });
          }
        };
    
        if (scanResult) {
          // Fetch data with the updated itemCode
          fetchData(itemCode);
        }
      }, [scanResult, incomeId]);


    return (
        <>
            <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full my-auto overflow-auto">

                <div style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3" }}
                    className="w-2/3 h-14 my-4 mx-auto flex justify-between items-center text-lg shadow-lg px-3 text-center font-bold">
                    <i className="w-8"></i>
                    <span className="w-16">번호</span>
                    <span className="w-1/12">입고코드</span>
                    <span className="w-1/12">수량</span>
                    <span className="w-2/12">입고일자</span>
                    <span className="w-32">처리상태</span>

                </div>
                { groupedListkeys.length === 0 ? <h1 className="text-3xl mt-20 text-center">불러올 입고내역이 없습니다.</h1> :
                groupedListkeys.map((key, index) => {
                    const isToggled = toggle === key; // 현재 키에 해당하는 아이템이 펼쳐져 있는지 여부
                    return (
                        <>
                            <div
                                style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3", height: "6.5%" }}
                                className="w-2/3 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-3 text-center"
                            >
                                <i
                                    className={`fa-solid fa-angle-${isToggled ? 'up' : 'down'} fa-fade fa-lg grow-0 w-8`}
                                    onClick={() => {
                                        setToggle(isToggled ? null : key); // 클릭 시 현재 상태의 반대로 토글
                                        setIncomeId(isToggled ? 0 : groupedList[key][0].income_id);
                                        setIncomeStatus(groupedList[key][0].income_status);
                                    }}
                                ></i>
                                <span className="w-16"><NavLink to={`inspection/${groupedList[key][0].income_id}`} >{index+1}</NavLink></span>
                                <span className="w-1/12">{groupedList[key][0].income_code}</span>
                                <span className="w-1/12">{groupedList[key][0].income_amount}</span>
                                <span className="w-2/12">{groupedList[key][0].income_date}</span>
                                <span className="w-32"
                                    style={groupedList[key][0].income_status === "재고등록완료" ? { boxShadow: 'inset 0 -30px 0 #dcffe4' } : ( groupedList[key][0].income_status === "검수완료" ? { boxShadow: 'inset 0 -30px 0 #fff5b1' } : { boxShadow: 'inset 0 -30px 0 #f5f0ff' } )}
                                    >{groupedList[key][0].income_status}</span>

                            </div>
                            {isToggled && 
                            <Detail id={groupedList[key][0].income_id} 
                                    incomeStatus={groupedList[key][0].income_status} 
                                    modalHandler={handleScannerClick} 
                                    completeItemCode = {completeItemCode}/>}
                        </>
                    )
                })}
            </div>
            {modalOpen && (
                <Modal_search
                    onCancel={handleModalClose}
                    onScan={handleScanWebCam}
                    onType={"검수할 상품의"}
                />
            )}
             {isPopUpOpen && (
              <PopUp onClose={closePopUp} onComment={comment} onType={popupType} />
            )}
        </>
    )
}

function Detail({ id, modalHandler,completeItemCode,incomeStatus}) {
    const navigate = useNavigate();
    const [resData, setResData] = useState('');
    const incomeDetailList = useLoaderData();
    const [comment, setComment] = useState('');
    const [popupType, setPopupType] = useState('');
    const [isPopUpOpen, setPopUpOpen] = useState(false);

    console.log("!!!!!!!!!!!!!",completeItemCode);
    const openPopUp = (type,comment) => {
        setPopUpOpen(true);
        setComment(comment);
        setPopupType(type);
    };
    const closePopUp = () => {
        setPopUpOpen(false);
    };

    console.log(incomeStatus);
    let groupedDetailList = incomeDetailList.reduce((acc, curr) => {
        const { income_id } = curr;
        if (acc[income_id]) acc[income_id].push(curr);
        else acc[income_id] = [curr];
        return acc;
    }, {});

    
  //검수완료버튼
  const handleInspectionComplete = async () => {
    try {
      const token = getAuthToken();
      const branch_id = localStorage.getItem("branch_id");
      const response = await axios.get(
        `/ssgtarbucks_BE/api/v1/income/inspection/complete`,
        {
          headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
          }, params: {
            incomeId: id,
            branch_id: branch_id
          }
        }
      );

      console.log("handleInspectionComplete.response >>>>>>>>>>>..", response);

      if (response.status !== 200) {
        throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
      }

      const resData = response.data;
      console.log("resData>>>>>>>>>>>>>>", resData);

        //alert(resData);
        openPopUp("success","검수 완료 처리되었습니다.\n검수상품을 재고로 등록하시기 바랍니다.");
        window.location.reload();

    } catch (error) {
      console.error("Error during fetchData:", error);
    }

  }

    return (
        <>
            <div className="w-3/5 p-2 mx-auto text-center" style={{ backgroundColor: "#f0f0f0aa" }}>
                <div style={{ border: "1px solid #d5d5d5", borderRadius: "5px", background: "white" }}
                    className="w-11/12 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-4 h-10 font-bold text-center">
                    <span className="w-1/12">번호</span>
                    <span className="w-1/6">상품코드</span>
                    <span className="w-2/6">상품명</span>
                    <span className="w-1/6">유통기한</span>
                    <span className="w-1/6">검수여부</span>
                    <span className="w-1/12">스캔하기</span>
                </div> 
                {true && groupedDetailList[id].map((row, index) =>
                    <div style={{ border: "1px solid #d5d5d5", borderRadius: "5px", background: "white", height: "6vh" }}
                        className="w-11/12 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-4 text-center ">
                        <span className="w-1/12">{index + 1}</span>
                        <span className="w-1/6">{row.item_code}</span>
                        <span className="w-2/6">{row.product_name}({row.product_standard}, {row.product_unit})</span>
                        <span className="w-1/6">{dayjs(row.item_exp).format("YYYY-MM-DD")}</span>
                        <span className="w-1/6">
                        {row.income_list_result === "승인"? "⭕" :  completeItemCode? ( completeItemCode.includes(row.item_code) ? "⭕" :  "❌" ) : ""}
                        </span>                        
                        {incomeStatus === '재고등록완료'?
                              <button className="w-1/12 border-2 h-8 shadow-md page_itms rounded-sm"  disabled onClick={() => { modalHandler(row.item_code); }}>스캔</button>
                            : <button className="w-1/12 border-2 h-8 shadow-md page_itms rounded-sm"  onClick={() => { modalHandler(row.item_code); }}>스캔</button>
                        }
                    </div>
                )}
                {incomeStatus === '재고등록완료'? null :<button className="border w-2/12 h-11 rounded-md mx-auto hoverBtn_white shadow-md" onClick={handleInspectionComplete}>검수완료</button>}
                
            </div>
        </>
    )
}


export async function loader({ request }) {
    console.log("IncomeListPage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
        method: "GET",
        url: "/ssgtarbucks_BE/api/v1/income/list/",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
        }
    });

    console.log("IncomeListPage.response >>>>>>>>>>>..", response);

    if (response.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const resData = response.data;
    console.log("resData", resData);
    return resData;
}
