import {useSelector} from "react-redux";
import AdminNav from "../navbar/AdminNav";

const SideMenuBar = () => {

    const userDetail = useSelector((state) => state.authentication.user);

    return (
        <>
            <div className="left side-menu">
                <div className="slimscroll-menu" id="remove-scroll">

                    <div id="sidebar-menu">
                        {
                            userDetail.role === 'admin' ? <AdminNav/> : ''
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default SideMenuBar;