import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {useFormik} from "formik";
import {procurementSchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import {fetchProviders} from "../../../redux/actions/providerAction";
import {useDispatch, useSelector} from "react-redux";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ProductSearch from "./ProductSearch";
import {Modal} from "react-bootstrap";

const CreateProcurement = () => {

    const providersList = useSelector((state) => state.providersList.providers);

    const privateAxios = useAxiosPrivate();
    const dispatch = useDispatch();

    const [selectedProduct, setSelectedProduct] = useState([])

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

    const [initialValues, setInitialValues] = useState({
            name: '',
            invoiceNumber: '',
            deliveryDate: '',
            invoiceDate: '',
            deliveryStatus: 'delivered',
            paymentStatus: 'paid',
            provider: '',
            products: null
        })

    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: procurementSchema,
        onSubmit: async (values, action) => {
            const totalPurchaseValue = values.products.reduce((total, obj) => total + parseInt(obj?.purchaseValue ? obj.purchaseValue : 1), 0)
            const totalSaleValue = values.products.reduce((total, obj) => total + (parseInt(obj?.changedQuantity ? obj.changedQuantity : 1)*parseInt(obj.salePrice)), 0)
            values.totalPurchaseValue = totalPurchaseValue;
            values.totalSaleValue = totalSaleValue;

            try {
                setIsLoading(true)
                const response = await privateAxios.post('/admin/register/procurement', values);
                if(response.status === 200){
                    setShow(false);
                    setInitialValues({
                        name: '',
                        invoiceNumber: '',
                        deliveryDate: '',
                        invoiceDate: '',
                        deliveryStatus: 'delivered',
                        paymentStatus: 'paid',
                        provider: '',
                        products: null
                    })
                    notifySuccess(response.data.message);
                    setSelectedProduct([]);
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


    useEffect(() => {
        const newValue = {...values};
        newValue['products'] = selectedProduct;
        setInitialValues(newValue);
    }, [selectedProduct]);

    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    return (
        <>
            <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Create Procurement</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">

                  <button className={'btn btn-sm btn-primary float-right mb-2'} onClick={() =>setShow(true)}>Save</button>

                  <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                       <h5 className="modal-title mt-0">Confirm Your Action</h5>
                        <button type="button" className="close" onClick={() => setShow(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </Modal.Header>
                    <Modal.Body>The procurement record is being saved. Would you like to confirm ?</Modal.Body>
                    <Modal.Footer>
                      <button className={'btn btn-sm btn-danger'} onClick={() => setShow(false)}>
                        Cancel
                      </button>
                        {
                            isLoading ? <button className={'btn btn-sm btn-primary'}>
                            Processing....
                          </button> : <button type={'submit'} className={'btn btn-sm btn-primary'} onClick={() => handleSubmit()}>
                            Continue
                          </button>
                        }
                    </Modal.Footer>
                  </Modal>

                   {
                        touched.products && errors.products ? (
                            <ul className="parsley-errors-list filled">
                                <li>{errors.products}</li>
                            </ul>
                        ): null
                    }
                  <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                          <a className="nav-link active" data-toggle="tab" href="#details" role="tab">
                              <span className="d-none d-md-block">Details</span>
                              <span className="d-block d-md-none">
                                  <FontAwesomeIcon icon={faInfoCircle}/>
                              </span>
                          </a>
                      </li>
                      <li className="nav-item">
                          <a className="nav-link" data-toggle="tab" href="#products" role="tab">
                              <span className="d-none d-md-block">Products</span><span className="d-block d-md-none"><i
                              className="mdi mdi-account h5"></i></span>
                          </a>
                      </li>
                  </ul>

                  <div className="tab-content">
                      <div className="tab-pane active p-3" id="details" role="tabpanel">
                          <form>
                            <div className="row">
                                <div className="col-4">
                                <div className="form-group">
                                    <label>Procurement Name</label>
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
                                </div>
                                <div className="col-4">
                                  <div className="form-group">
                                      <label>Delivery Date</label>
                                      <input type="date"
                                             className="form-control"
                                             placeholder="mm/dd/yyyy"
                                             name={'deliveryDate'}
                                             value={values.deliveryDate}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                      />
                                      {
                                        touched.deliveryDate && errors.deliveryDate ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.deliveryDate}</li>
                                            </ul>
                                        ): null
                                    }
                                  </div>
                              </div>
                              <div className="col-4">
                                  <div className="form-group">
                                      <label>Invoice Date</label>
                                      <input type="date"
                                             className="form-control"
                                             placeholder="mm/dd/yyyy"
                                             name={'invoiceDate'}
                                             value={values.invoiceDate}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                      />
                                      {
                                        touched.invoiceDate && errors.invoiceDate ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.invoiceDate}</li>
                                            </ul>
                                        ): null
                                    }
                                  </div>
                              </div>
                                <div className="col-4">
                                  <div className="form-group">
                                      <label>Delivery Status</label>
                                      <select
                                             className="form-control"
                                             name={'deliveryStatus'}
                                             value={values.deliveryStatus}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                      >
                                          <option value="delivered">Delivered</option>
                                          <option value="pending">Pending</option>
                                      </select>
                                      {
                                        touched.deliveryStatus && errors.deliveryStatus ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.deliveryStatus}</li>
                                            </ul>
                                        ): null
                                    }
                                  </div>
                              </div>

                              <div className="col-4">
                                  <div className="form-group">
                                      <label>Payment Status</label>
                                      <select
                                             className="form-control"
                                             name={'paymentStatus'}
                                             value={values.paymentStatus}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                      >
                                          <option value="paid">Paid</option>
                                          <option value="unpaid">Unpaid</option>
                                      </select>
                                      {
                                        touched.paymentStatus && errors.paymentStatus ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.paymentStatus}</li>
                                            </ul>
                                        ): null
                                    }
                                  </div>
                              </div>

                              <div className="col-4">
                                  <div className="form-group">
                                      <label>Provider</label>
                                      <select
                                             className="form-control"
                                             name={'provider'}
                                             value={values.provider}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                      >
                                          {
                                              Object.keys(providersList).length === 0 ? (
                                                  <option value="">== No Provider ==</option>
                                              ): (
                                                  <>
                                                      <option value="">== Choose Provider ==</option>
                                                      {
                                                          providersList.map((data) => {
                                                              return (
                                                                  <option key={data._id} value={data._id}>{data.name}</option>
                                                              )
                                                          })
                                                      }
                                                  </>
                                              )
                                          }
                                      </select>
                                      {
                                        touched.provider && errors.provider ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.provider}</li>
                                            </ul>
                                        ): null
                                    }
                                  </div>
                              </div>
                            </div>
                          </form>
                      </div>
                      <div className="tab-pane p-3" id="products" role="tabpanel">
                          <ProductSearch selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
                      </div>
                  </div>
              </div>
          </div>
        </>
    )
}

export default CreateProcurement;