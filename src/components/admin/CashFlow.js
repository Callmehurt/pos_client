import React, {useEffect, useRef} from "react";
import CashFLowList from "./cashFlow/CashFlowList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {fetchCashFlows} from "../../redux/actions/cashFlowAction";


const CashFlow = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const effectRun = useRef(false);
    useEffect(() => {
        const abortController = new AbortController();

        const getProviderData = async () => {
            const res = await axiosPrivate.get('/admin/fetch/cash-flows', {
                signal: abortController.signal
            })
            dispatch(fetchCashFlows(res.data))
        }

        if(effectRun.current){
            getProviderData();
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
                          <li className="breadcrumb-item active">Cash Flow</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <CashFLowList/>
                        </div>
                    </div>
              </div>
          </div>
        </>
    )
}

export default CashFlow;