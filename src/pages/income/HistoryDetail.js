import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router";
import { json, useLoaderData, useParams } from "react-router-dom";
import { getAuthToken } from "../../util/auth";
import Modal_search from "../../commons/Modal_search";
import PopUp from "../../commons/PopUp.js";
import dayjs from "dayjs";

//변경사항
export default function HistoryDetail() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [itemCode, setItemCode] = useState('');
  
  const { incomeId } = useParams();
  const incomeDetailList = useLoaderData();
  console.log("InspectionPage, incomeDetailList >>>>>>>>>>>>.", incomeDetailList);
  //////////////////////////////////////////////////////////////////////
  /*팝업창*/
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [popupType, setPopupType] = useState('');
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const openPopUp = (type, comment) => {
    setPopUpOpen(true);
    setComment(comment);
    setPopupType(type);
  };
  const closePopUp = () => {
    setPopUpOpen(false);
    if(comment=="검수완료처리되었습니다.\n검수상품을 재고로 등록하시기 바랍니다."){
    navigate('/branch/income/new');
  }
  };
  //////////////////////////////////////////////////////////////////////
  const handleclick = (item_code) => {
    setItemCode(item_code);
    console.log("검수할 상품 코드>>", item_code);
    setModalOpen(true);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleScanWebCam = (result) => {
    setScanResult(result);
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
        if (resData === "성공") {
          setModalOpen(false);
          window.location.reload();
        }

      } catch (error) {
        console.error("Error during fetchData:", error);
      }
    };

    if (scanResult) {
      fetchData(itemCode);
    }
  }, [scanResult, incomeId]);

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
            incomeId: incomeId,
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
      setModalOpen(false);
      setItemCode('');
      setScanResult('');
      openPopUp("success", "검수완료처리되었습니다.\n검수상품을 재고로 등록하시기 바랍니다.");

    } catch (error) {
      console.error("Error during fetchData:", error);
    }

  }
  return (
    <>
      
      <div style={{ height: "92vh", fontFamily: 'Pretendard-Regular' }} className="w-full my-auto overflow-scroll text-center">

        <div style={{ border: "1px solid #d5d5d5", borderRadius: "3px", background: "#f6f5efb3" }}
          className="w-9/12 h-14 my-4 mx-auto flex justify-between items-center text-lg shadow-lg px-3 text-center font-bold">
          <span className="w-1/12">번호</span>
          <span className="w-1/12">상품코드</span>
          <span className="w-1/6">상품명</span>
          <span className="w-1/6">유통기한</span>
          <span className="w-1/12">검수여부</span>
          <span className="w-1/12">스캔하기</span>
        </div>

        {incomeDetailList.map((incomeItem, index) => (
          <div style={{ border: "1px solid #d5d5d5", borderRadius: "5px", background: "#f6f5efb3", height: "6vh" }}
            className="w-9/12 my-3 mx-auto flex justify-between items-center text-lg shadow-lg px-4 text-center ">
            <span className="w-1/12">{index + 1}</span>
            <span className="w-1/12">{incomeItem.item_code}</span>
            <span className="w-1/6">{incomeItem.product_name}</span>
            <span className="w-1/6">{dayjs(incomeItem.item_exp).format("YYYY-MM-DD")}</span>
            <span className="w-1/12">{incomeItem.income_list_result === "승인" ? "⭕" : "❌" }</span>
            <button className="w-1/12 border border-slate-400 h-8 shadow-md page_itms rounded-sm" onClick={() => handleclick(incomeItem.item_code)}>스캔</button>
          </div>
        ))}

        <button onClick={handleInspectionComplete} className="w-1/12 h-10 border page_itms shadow-md my-5 mx-auto">검수완료</button>

      </div>


      {modalOpen && (
        <Modal_search
          onSubmit={handleModalOpen}
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

export async function loader({ request, params }) {
  console.log("InspectionPage, loader >>>>>>>>>>>>.", request, params);
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  const incomeId = params.incomeId;
  console.log("incomeId---------->", incomeId);

  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url: `/ssgtarbucks_BE/api/v1/income/list/inspection/${incomeId}`,
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    }
  });

  console.log("InspectionPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}
