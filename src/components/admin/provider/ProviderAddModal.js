import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {useFormik} from "formik";
import {providerSchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";
import {fetchProviders} from "../../../redux/actions/providerAction";

const ProviderAddModal = ({setShow, show}) => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const providersList = useSelector((state) => state.providersList.providers);

    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        address: '',
    }

       const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: providerSchema,
        onSubmit: async (values, action) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post('/admin/create/provider', values);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                    const newList = [...providersList, response.data.provider]
                    dispatch(fetchProviders(newList))
                    action.resetForm();
                }else {
                    notifyError(response.data.message)
                }
                setIsLoading(false)
            }catch (e) {
                console.log(e);
                setIsLoading(false)
                notifyError(e.response.data.message)
            }
        }
    });


    return (
        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header>
               <h5 className="modal-title mt-0">Add Provider</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label>Provider Name</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
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
                        <label>Phone</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
                               name={'phone'}
                               value={values.phone}
                               onChange={handleChange}
                               onBlur={handleBlur}
                        />
                        {
                            touched.phone && errors.phone ? (
                                <ul className="parsley-errors-list filled">
                                    <li>{errors.phone}</li>
                                </ul>
                            ): null
                        }
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
                               name={'email'}
                               value={values.email}
                               onChange={handleChange}
                               onBlur={handleBlur}
                        />
                        {
                            touched.email && errors.email ? (
                                <ul className="parsley-errors-list filled">
                                    <li>{errors.email}</li>
                                </ul>
                            ): null
                        }
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
                               name={'address'}
                               value={values.address}
                               onChange={handleChange}
                               onBlur={handleBlur}
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
              <button className={'btn btn-sm btn-danger'} onClick={() => setShow(false)}>
                Cancel
              </button>
                {
                    isLoading ? <button className={'btn btn-sm btn-primary'}>
                    Processing....
                  </button> : <button onClick={handleSubmit} className={'btn btn-sm btn-primary'}>
                    Submit
                  </button>
                }
            </Modal.Footer>
          </Modal>
    )
}

export default ProviderAddModal;