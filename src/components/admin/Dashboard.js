import React, {useEffect, useRef, useState} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useNavigate, useLocation} from "react-router-dom";
import ProfitChart from "./dashboard/ProfitChart";
import DebitCreditChart from "./dashboard/DebitCreditChart";

const Dashboard = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const [orderTotal, setOrderTotal] = useState([]);
    const [debitCredit, setDebitCredit] = useState([]);

    const testCall = async () => {
        try{
            const response = await axiosPrivate.get('/user/test');
            console.log('response from api', response)
        }catch (e) {
            console.log(e);
            navigate('/user/login', {state: {from: location}, replace: true})
        }
    }


    const effectRun = useRef(false);
    useEffect(() => {

        const abortController = new AbortController();
        const fetchOrderTotal = async () => {
            try{
                const response = await axiosPrivate.get('/fetch/order-total', {
                    signal: abortController.signal
                });
                const result = await response.data.slice().reverse();
                setOrderTotal(result)
            }catch (e) {
                console.log(e);
            }
        }

        const fetchDebitCredit = async () => {
            try{
                const response = await axiosPrivate.get('/fetch/debit-credit', {
                    signal: abortController.signal
                });
                const result = await response.data.slice().reverse();
                setDebitCredit(result)
            }catch (e) {
                console.log(e);
            }
        }

        if(effectRun.current){
            fetchOrderTotal();
            fetchDebitCredit();
        }

        return () => {
            effectRun.current = true;
            abortController.abort();
        }

    }, [])

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
              <div className="col-xl-12">
                  <div className="card m-b-30">
                      <div className="card-body">
                          <h4 className="mt-0 header-title mb-4">Sales Chart</h4>
                          <ProfitChart data={orderTotal}/>
                      </div>
                  </div>
              </div>

              <div className="col-xl-12">
                  <div className="card m-b-30">
                      <div className="card-body">
                          <h4 className="mt-0 header-title mb-4">Donut Chart</h4>
                          <DebitCreditChart data={debitCredit}/>
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}

export default Dashboard;