import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {useFormik} from "formik";
import {expenseSchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {fetchAllExpenses} from "../../../redux/actions/expensesAction";

const ExpenseAddModal = ({setShow, show, expenses}) => {



    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        name: '',
        value: '',
    }

       const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: expenseSchema,
        onSubmit: async (values, action) => {
            try {
                setIsLoading(true)
                const response = await axiosPrivate.post('/admin/register/expense', values);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                    const newList = [...expenses, response.data.expense]
                    dispatch(fetchAllExpenses(newList))
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
               <h5 className="modal-title mt-0">Add Expense</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div className="form-group">
                        <label>Expense Name</label>
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
                        <label>Value</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
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
                </form>
            </Modal.Body>
            <Modal.Footer>
              <button className={'btn btn-sm btn-danger'} onClick={() => setShow(false)}>
                Cancel
              </button>
                {
                    isLoading ? <button className={'btn btn-sm btn-primary'}>
                    Processing....
                  </button> : <button type={'submit'} onClick={handleSubmit} className={'btn btn-sm btn-primary'}>
                    Submit
                  </button>
                }
            </Modal.Footer>
          </Modal>
    )
}

export default ExpenseAddModal;