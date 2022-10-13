import UnitList from "./partials/UnitList";
import {useDispatch} from "react-redux";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useEffect} from "react";
import {fetchAllUnits} from "../../redux/actions/unitAction";



const Units = () => {

    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();


    useEffect(() => {
        fetchUnits();
    })

    const fetchUnits = async () => {
        try {
            const response = await axiosPrivate.get('/admin/fetch/units');
            dispatch(fetchAllUnits(response.data));
            return response.data;
        }catch (err){
            console.log(err)
        }
    }


    return (
        <>
            <div className="page-title-box">
                <div className="row align-items-center">
                    <div className="col-sm-12">
                        <ol className="breadcrumb float-right">
                            <li className="breadcrumb-item active">Units</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card m-b-30">
                        <div className="card-body">
                            <UnitList/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Units;