import React, { useState } from "react";
import '../sources/css/login.css';
import { Form, Link, redirect } from "react-router-dom";
import axios from "axios";
import PopUp from "../commons/PopUp";

export default function Login(){

  const  checkLogin = localStorage.getItem("fail");
  console.log("checkLogin >>>" ,checkLogin);

    return(
        <div className="bg">
          <div>
          <div className="circle shadow-lg"></div>
          <div className="card_login shadow-lg">
              <h2>SSGTARBUCKS</h2><br/>
              <h4>재고관리시스템</h4>
              <Form method="POST" className="form_login">
                  <input type="text" placeholder="직원코드" name="user_id" required/>
                  <input type="password" placeholder="비밀번호" name="user_pw" required/>
                  {checkLogin&& <p className="text-red-500 text-sm font-semibold">아이디 또는 비밀번호가 일치하지 않습니다.</p>}
                  <button>SIGN IN</button>
              </Form>
              <footer>
                  <Link to="/find">비밀번호 찾기</Link>
              </footer>
          </div>
          </div>
        </div>
    )
}

export async function action({ request }) {
    const searchParams = new URL(request.url).searchParams;
    console.log("searchParams>>", searchParams);
    const mode = searchParams.get('mode') || 'login';
    console.log("mode>>", mode);
  
    const data = await request.formData();
    const authData = {
      user_id: data.get('user_id'),
      user_pw: data.get('user_pw')
    };
    console.log("authData>>", authData);
    let resData = '';
    try {
        const response = await axios({
        method: "POST",
        url: '/ssgtarbucks_BE/api/v1/user/' + mode,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(authData),
      });
      console.log("response>>>>>>", response);
      //데이터 삽입
      resData = response.data;
      // 자바의 TokenDTO 에 저장된 필드명
      if (mode === "login") {
  
        const token = resData.jwtauthtoken;
        localStorage.setItem('jwtauthtoken', token);
        localStorage.setItem('branch_id', resData.branch_id);
        localStorage.setItem('branch_name', resData.branch_name);
        localStorage.setItem('user_type', resData.user_type);
        localStorage.setItem('user_id', resData.user_id);
      }
    } catch (error) {
      console.log("error:", error);
      localStorage.setItem('fail', true);
      localStorage.removeItem('fail');
      alert("아이디 또는 비밀번호가 올바르지 않습니다.")
      return redirect('/');
      // throw new Error("error 발생되었습니다");
    }
    if(localStorage.getItem("user_type") === "manager"){
      return redirect('/branch/main');
    }else if(localStorage.getItem("user_type") === "admin"){
      return redirect('/admin/main');
    }
    
  }
  