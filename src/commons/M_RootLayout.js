import { Outlet } from "react-router-dom"
import SearchManager from "./SearchManager"
import NavManager from "./NavManager"


export default function M_RootLayout(){
    return(
        <>
        <SearchManager/>
        <div className="low-opacity-bg-image" style={{display:"flex"}}>
            <NavManager />
            <Outlet />
        </div>
        </>
    )
}