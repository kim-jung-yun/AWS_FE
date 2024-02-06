import logo from "../sources/image/logo1.png";
import "../sources/css/search.css";
import scanner from "../sources/image/Scanner.png";
import magnifier from "../sources/image/magnifier.png";
import { Link } from "react-router-dom";

export default function searching(){
    return(
        <>
            <header>
                <Link to="/admin/main">
                    <div className="logo">
                        <img src={logo} alt="logo" id="logo_img" />
                        <h2 id="logo_title">SSGTARBUCKS</h2>
                    </div>
                </Link>

            </header>
        </>
    )
}