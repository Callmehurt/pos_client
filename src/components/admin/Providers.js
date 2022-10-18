import React, {useEffect, useRef} from "react";
import ProvidersList from "./provider/ProvidersList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {fetchProviders} from "../../redux/actions/providerAction";

const Providers = () => {

    const privateAxios = useAxiosPrivate();
    const dispatch = useDispatch();

    const effectRun = useRef(false);
    useEffect(() => {
        const abortController = new AbortController();

        const getProviderData = async () => {
            const res = await privateAxios.get('/admin/fetch/providers', {
                signal: abortController.signal
            })
            dispatch(fetchProviders(res.data))
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
                          <li className="breadcrumb-item active">Providers List</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <ProvidersList/>
              </div>
          </div>
        </>
    )
}

export default Providers;