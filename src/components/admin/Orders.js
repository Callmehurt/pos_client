import React, {useEffect, useRef} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {fetchAllOrders} from "../../redux/actions/orderAction";
import OrderList from "./orders/OrderList";

const Orders = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();


    const effectRun = useRef(false);
    useEffect(() => {
        const abortController = new AbortController();

        const getAllOrders = async () => {
            const res = await axiosPrivate.get('/fetch/all/orders', {
                signal: abortController.signal
            });
            dispatch(fetchAllOrders(res.data));
        }

        if(effectRun.current){
            getAllOrders();
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
                          <li className="breadcrumb-item active">Orders</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <OrderList/>
                        </div>
                    </div>
              </div>
          </div>
        </>
    )
}

export default Orders;