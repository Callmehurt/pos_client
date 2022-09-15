import {Outlet} from 'react-router-dom'
import Header from "./Header";
import {ToastContainer} from "react-toastify";

const Layout = () => {
    return (
        <>
            <ToastContainer/>
            <Header/>
            <div className="wrapper">
                <div className="container-fluid">
                    <Outlet/>
                </div>
            </div>
        </>
    )
}

export default Layout;