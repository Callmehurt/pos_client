import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useNavigate, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

const Dashboard = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const userDetail = useSelector((state) => state.authentication.user)

    const testCall = async () => {
        try{
            const response = await axiosPrivate.get('/user/test');
            console.log('response from api', response)
        }catch (e) {
            console.log(e);
            navigate('/user/login', {state: {from: location}, replace: true})
        }
    }

  return (
      <>
          <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Dashboard</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <h1>{userDetail.username}</h1>
              </div>
          </div>
      </>
  )
}

export default Dashboard;