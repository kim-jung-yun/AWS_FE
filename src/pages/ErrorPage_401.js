import { useNavigate } from 'react-router';
import logo1 from '../sources/image/logo1.png';


export default function ErrorPage_401(){
    let navigate = useNavigate();


    return(
        <div>
            <div style={{width:'50%', float:'left',paddingLeft:"5%"}}>
                <div style={{margin:"auto"}}>
                    <div style={{marginTop:"37%"}}>
                        <h1 style={{fontSize:"20px"}}>SSGTARBUCKS</h1>
                    </div>
                    <div>
                        <h1 style={{fontSize:"75px"}}>401 ERROR</h1>
                    </div>
                    <div style={{paddingTop:"5%"}}>
                        <text>죄송합니다. 올바르지 않은 로그인 정보를 사용 중이라면<br/>
                                사이트의 안내에 따라 비밀번호를 재설정하거나 본사에 문의해<br/>
                                액세스를 요청하시기 바랍니다.
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