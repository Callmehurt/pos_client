import React, {useEffect, useRef} from "react";
import ProcurementList from "./ProcurementList";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {fetchProcurements} from "../../../redux/actions/procurementAction";

const Procurement = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const effectRun = useRef(false);

    useEffect(() => {
        const abortController = new AbortController();

        const getProcurements = async () => {
            const res = await axiosPrivate.get('/admin/fetch/procurements', {
                signal: abortController.signal
            });
            dispatch(fetchProcurements(res.data));
            return res.data;
        }

        if(effectRun.current){
            getProcurements();
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
                          <li className="breadcrumb-item active">Procurements List</li>
                      </ol>
                  </div>
              </div>
          </div>

           <div className="row justify-content-center">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <ProcurementList/>
                        </div>
                  </div>
              </div>
           </div>

        </>
    )
}

export default Procurement;