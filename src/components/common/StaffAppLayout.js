import {Outlet} from 'react-router-dom'
import '../../posStyle.css'
import {ToastContainer} from "react-toastify";

const StaffAppLayout = () => {

    return (
        <>
            <ToastContainer/>
            <Outlet/>
            {/*<StaffNav/>*/}
        </>
    )
}

export default StaffAppLayout;