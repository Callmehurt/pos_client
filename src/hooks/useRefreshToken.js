import {axiosDefault} from "../api/axios";
import {useDispatch} from "react-redux";
import {updateToken} from "../redux/actions/authenticationAction";
const useRefreshToken = () => {

    const dispatch = useDispatch();
    const refresh = async () => {
        try{
            const response = await axiosDefault.get('/user/refresh-token', {
            withCredentials: true
            });
            const userDetail = {
                token: response.data.access_token,
                user: response.data.user
            }
            dispatch(updateToken(userDetail))
            return response.data.access_token
        }catch (e) {
            console.log(e);
        }
    }
    return refresh;
}

export default useRefreshToken;