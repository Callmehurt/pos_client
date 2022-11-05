import {useDispatch} from "react-redux";
import {axiosDefault} from "../api/axios";
import {logoutUser} from "../redux/actions/authenticationAction";

const useLogout = () => {
    const dispatch = useDispatch();

    const logout = async () => {
        try{
            const response = await axiosDefault.get('/user/logout');
            if(response.status === 200){
                dispatch(logoutUser())
            }
        }catch (e){
            console.log(e)
        }
    }

    return logout;
}

export default useLogout;