import { useNavigate } from 'react-router';
import logo1 from '../sources/image/logo1.png';


export default function ErrorPage_403(){
    let navigate = useNavigate();


    return(
        <div>
            <div style={{width:'50%', float:'left',paddingLeft:"5%"}}>
                <div style={{margin:"auto"}}>
                    <div style={{marginTop:"37%"}}>
                        <h1 style={{fontSize:"20px"}}>SSGTARBUCKS</h1>
                    </div>
                    <div>
                        <h1 style={{fontSize:"75px"}}>403 ERROR</h1>
                    </div>
                    <div style={{paddingTop:"5%"}}>
                        <text>죄송합니다. 요청하신 페이지 접근이 거부되었습니다.<br/>
                            입력하신 페이지의 주소가 정확한지 다시 한번 확인해주시기 바랍니다.
                        </text>
                    </div>
                    <div>
                        <div style={{paddingTop:"10%"}}>
                            <button style={{border:"1px solid #d5d5d5",width:"20%"}} 
                            className='h-10 bg-green-700 rounded-md text-white hover:bg-green-900 border'
                            onClick={()=>navigate(-1)}
                            >돌아가기</button>
                        </div>
                    </div>
                </div>    
            </div>
            <div style={{width:'50%', float:'right'}}>
                <img src={logo1}/>
            </div>
        </div>
    )
}