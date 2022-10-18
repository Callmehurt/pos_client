import {Outlet} from 'react-router-dom'
import Header from "./Header";
import {ToastContainer} from "react-toastify";
import TopHeader from "./TopHeader";
import SideMenuBar from "./SideMenuBar";

const Layout = () => {
    return (
        // <div id={'wrapper'}>
        //     <ToastContainer/>
        //     <TopHeader/>
        //     <SideMenuBar/>
        //     <div className="content-page">
        //         <div className="content">
        //             <div className="container-fluid">
        //                 <Outlet/>
        //             </div>
        //         </div>
        //     </div>
        // </div>

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