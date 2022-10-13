import {useFormik} from "formik";
import {unitSchema} from "../schema";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {notifySuccess, notifyError} from "../../toastNotification";
import {useDispatch} from "react-redux";
import {fetchAllUnits} from "../../../redux/actions/unitAction";


const UnitAddModal = ({unitGroupList, unitList}) => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const initialValues = {
            name: '',
            identifier: '',
            value: '',
            unit_group: '',
        }

    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        validationSchema: unitSchema,
        onSubmit: async (values, action) => {
            try {
                const response = await axiosPrivate.post('/admin/create/unit', values);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                    dispatch(fetchAllUnits([...unitList, response.data.data]))
                    action.resetForm();
                }else {
                    notifyError(response.data.message)
                }
            }catch (e) {
                console.log(e);
                notifyError(e.response.data.message)
            }
        }
    })

    return (
        <>
        <div id="addUnitModal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title mt-0">Add Unit</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text"
                                       className="form-control"
                                       placeholder=""
                                       name={'name'}
                                       value={values.name}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                />
                                {
                                    touched.name && errors.name ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.name}</li>
                                        </ul>
                                    ): null
                                }
                            </div>
                            <div className="form-group">
                                <label>Identifier</label>
                                <input type="text"
                                       className="form-control"
                                       placeholder=""
                                       name={'identifier'}
                                       value={values.identifier}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                />
                                {
                                    touched.identifier && errors.identifier ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.identifier}</li>
                                        </ul>
                                    ): null
                                }
                            </div>
                            <div className="form-group">
                                <label>Value</label>
                                <input type="text"
                                       className="form-control"
                                       placeholder=""
                                       name={'value'}
                                       value={values.value}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                />
                                {
                                    touched.value && errors.value ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.value}</li>
                                        </ul>
                                    ): null
                                }
                            </div>
                            <div className="form-group">
                                <label>Unit Group</label>
                                <select
                                       className="form-control"
                                       placeholder=""
                                       name={'unit_group'}
                                       value={values.unit_group}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                >
                                    {
                                        Object.keys(unitGroupList).length === 0 ? (
                                            <option value="">-- No unit group --</option>
                                        ): (
                                           <>
                                            <option value=""> == Choose ==</option>
                                               {
                                                   unitGroupList.map((opt, index) => {
                                                    return <option value={opt._id} key={opt._id}>{opt.name}</option>
                                                })
                                               }
                                           </>
                                        )
                                    }
                                </select>
                                {
                                    touched.unit_group && errors.unit_group ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.unit_group}</li>
                                        </ul>
                                    ): null
                                }
                            </div>
                            <div className="form-group">
                                <div>
                                    <button type="submit" className="btn btn-primary waves-effect waves-light">
                                        Submit
                                    </button>
                                    <button type="reset" className="btn btn-danger waves-effect ml-2" data-dismiss="modal">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default UnitAddModal;