import React from "react";
import {Outlet} from "react-router-dom";
import {useState, useEffect} from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import {useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";


const PersistLogin = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const authState = useSelector((state) => state.authentication)

    useEffect(() => {

        let isMounted = true;
        const verifyRefreshToken = async () => {
            try{
                await refresh();
            }catch (e) {
                console.log(e);
                navigate('/user/login', {state: {from: location}, replace: true})
            }finally {
                isMounted && setIsLoading(false)
            }
        }
        !authState?.token ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;

    }, [])


    useEffect(() => {
        console.log(`whole page isLoading: ${isLoading}`)
        console.log(`Auth: ${authState}`)
    }, [isLoading])

    return (
        <>
            {
                isLoading ? (
                    <h1>Loading...</h1>
                ) : <Outlet/>
            }
        </>
    )

}

export default PersistLogin;

