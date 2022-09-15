import {useLocation, Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";

const RequireAuth = ({allowedRole}) => {
    const userDetail = useSelector((state) => state.authentication);
    const auth = userDetail.isAuthenticated;
    console.log(userDetail.user.role)
    console.log(allowedRole)
    const location = useLocation();

    return (
        auth && userDetail.user.role === allowedRole  ? <Outlet/>
            : auth ?
            <Navigate to={'/unauthorized'} state={{from: location}} replace />
            : <Navigate to={'/user/login'} state={{from: location}} replace />
    );
}

export default RequireAuth;