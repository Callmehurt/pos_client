import React, {useEffect, useRef} from "react";
import TableList from "./table/TableList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {setLoadingFalse, setLoadingTrue} from "../../redux/actions/loadingAction";
import {fetchAvailableTables} from "../../redux/actions/tableAction";


const Tables = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const effectRun = useRef(false);
    useEffect(() => {
        const abortController = new AbortController();
        const getTables = async () => {
            dispatch(setLoadingTrue())
            const res = await axiosPrivate.get('/admin/fetch/tables', {
                signal: abortController.signal
            })
            dispatch(fetchAvailableTables(res.data));
            dispatch(setLoadingFalse());
        }

        if(effectRun.current){
            getTables();
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
                          <li className="breadcrumb-item active">Available Tables</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                   <div className="card m-b-30">
                        <div className="card-body">
                            <TableList/>
                        </div>
                   </div>
              </div>
          </div>
        </>
    )
}

export default Tables;