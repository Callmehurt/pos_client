import ProductList from "./products/ProductList";
import React, {useEffect, useRef} from "react";
import StockFlowRecordList from "./stockManagement/StockFLowRecordList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {fetchStockRecord} from "../../redux/actions/stockFlowAction";
import {setLoadingFalse, setLoadingTrue} from "../../redux/actions/loadingAction";

const StockFlowRecords = () => {


    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const effectRun = useRef(false);

    useEffect(() => {
        const abortController = new AbortController();
        const fetchAllStockRecords = async () => {
            try {
                dispatch(setLoadingTrue())
                const res = await axiosPrivate.get('/admin/fetch/stock-flow', {
                    signal: abortController.signal
                });
                dispatch(fetchStockRecord(res.data));
                dispatch(setLoadingFalse())
            }catch (e) {
                console.log(e)
            }
        }
        if (effectRun.current){
            fetchAllStockRecords();
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
                          <li className="breadcrumb-item active">Stock Flow History</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row justify-content-center">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <StockFlowRecordList/>
                        </div>
                  </div>
              </div>
          </div>
        </>
    )
}

export default StockFlowRecords;