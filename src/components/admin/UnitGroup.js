import UnitGroupList from "./partials/UnitGroupList";
import {useEffect} from "react";
import {fetchUnitGroup} from "../../redux/actions/unitAction";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";

const UnitGroup = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const unitGroup = useSelector((state) => state.units.unitGroup);

    useEffect(() => {
        const abortController = new AbortController();
        const getUnitGroup = async () => {
            try {
                const response = await axiosPrivate.get('/admin/fetch/unit-group', {
                signal: abortController.signal
                });
                dispatch(fetchUnitGroup(response.data));
            }catch (e) {
                console.log(e)
            }
        }
        getUnitGroup();

        return () => {
            abortController.abort();
        }
    }, [])

    return (
        <>
            <div className="page-title-box">
                <div className="row align-items-center">
                    <div className="col-sm-12">
                        <ol className="breadcrumb float-right">
                            <li className="breadcrumb-item active">Unit Group</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12">
                    <div className="card m-b-30">
                        <div className="card-body">
                            <UnitGroupList unitGroupList={unitGroup} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UnitGroup;