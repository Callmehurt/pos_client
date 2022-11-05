import {Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {tableSchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";
import {fetchProviders} from "../../../redux/actions/providerAction";
import {fetchAvailableTables} from "../../../redux/actions/tableAction";

const TableEditModal = ({setShow, show, selectedTable}) => {


    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const tableList = useSelector((state) => state.tables.availableTables);

    const [isLoading, setIsLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        tableId: '',
        tableNumber: '',
        tableSpace: '',
        status: 'vacant',
    });

    useEffect(() => {
        if(selectedTable){
            setInitialValues({
                tableId: selectedTable._id ? selectedTable._id : '',
                tableNumber: selectedTable.tableNumber ? selectedTable.tableNumber : '',
                tableSpace: selectedTable.tableSpace ? selectedTable.tableSpace : '',
                status: selectedTable.status ? selectedTable.status : '',
            })
        }
    }, [selectedTable])

    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: tableSchema,
        onSubmit: async (values, action) => {
            try {
                setIsLoading(true);
                const response = await axiosPrivate.put('/admin/update/table', values);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                    const newList = [...tableList];
                    const table = newList.find((data) => data._id === selectedTable._id);
                    newList[newList.indexOf(table)] =  response.data.table;
                    dispatch(fetchAvailableTables(newList));
                    setShow(false)
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
    })

    return (
        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header>
               <h5 className="modal-title mt-0">Edit Provider</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <form>
                  <div className="form-group">
                        <label>Table No.</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
                               name={'tableNumber'}
                               value={values.tableNumber}
                               onChange={handleChange}
                               onBlur={handleBlur}
                        />
                        {
                            touched.tableNumber && errors.tableNumber ? (
                                <ul className="parsley-errors-list filled">
                                    <li>{errors.tableNumber}</li>
                                </ul>
                            ): null
                        }
                    </div>
                    <div className="form-group">
                        <label>Table Space</label>
                        <input type="text"
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
                               name={'tableSpace'}
                               value={values.tableSpace}
                               onChange={handleChange}
                               onBlur={handleBlur}
                        />
                        {
                            touched.tableSpace && errors.tableSpace ? (
                                <ul className="parsley-errors-list filled">
                                    <li>{errors.tableSpace}</li>
                                </ul>
                            ): null
                        }
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                               className="form-control"
                               placeholder=""
                               autoComplete={'off'}
                               name={'status'}
                               value={values.status}
                               onChange={handleChange}
                               onBlur={handleBlur}
                        >
                            <option value="vacant">Vacant</option>
                            <option value="occupied">Occupied</option>
                        </select>
                        {
                            touched.status && errors.status ? (
                                <ul className="parsley-errors-list filled">
                                    <li>{errors.status}</li>
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
                  </button> : <button onClick={handleSubmit} className={'btn btn-sm btn-primary'}>
                    Submit
                  </button>
                }
            </Modal.Footer>
          </Modal>
    )
}

export default TableEditModal;