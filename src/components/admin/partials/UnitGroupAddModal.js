import {useFormik} from "formik";
import {unitGroupSchema} from "../schema";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {notifySuccess, notifyError} from "../../toastNotification";
import {useDispatch} from "react-redux";
import {fetchUnitGroup} from "../../../redux/actions/unitAction";


const UnitGroupAddModal = ({unitGroupList}) => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const initialValues = {
            name: '',
            description: ''
        }

    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        validationSchema: unitGroupSchema,
        onSubmit: async (values, action) => {
            try {
                const response = await axiosPrivate.post('/admin/create/unit-group', values);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                    dispatch(fetchUnitGroup([...unitGroupList, response.data.data]))
                    action.resetForm();
                }else {
                    notifyError(response.data.message)
                }
            }catch (e) {
                console.log(e);
                notifyError(e)
            }
        }
    })


    return (
        <>
        <div id="addUnitGroupModal" className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title mt-0">Add Unit Group</h5>
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
                                <label>Description</label>
                                <div>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        name={'description'}
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                    </textarea>
                                </div>
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

export default UnitGroupAddModal;