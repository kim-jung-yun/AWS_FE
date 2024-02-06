import { Outlet } from "react-router-dom"
import Nav from "./Nav"
import Search from "./Search.js"

export default function RootLayout(){
    return(
        <>
        <Search />
        <div className="low-opacity-bg-image" style={{display:"flex"}}>
            <Nav />
            <Outlet />

        </div>
        </>
    )
}