import React, {useEffect, useState} from "react";
import noImage from "../../../images/noImage.jpg";
import {Link, useParams} from "react-router-dom";
import {useFormik} from "formik";
import {productSchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import {fetchCategories} from "../../../redux/actions/categoryAction";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllUnits, fetchUnitGroup} from "../../../redux/actions/unitAction";
import ThumbnailSelectionModal from "./ThumbnailSelectionModal";
import {fetchMedias} from "../../../redux/actions/galleryAction";
import {fetchProducts} from "../../../redux/actions/productAction";

const UpdateProduct = () => {


    const {productId} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.products);
    const categories = useSelector((state) => state.categories.categories);
    const unitGroup = useSelector((state) => state.units.unitGroup);
    const unitList = useSelector((state) => state.units.units);
    const selectedProduct = products.find((data) => data._id === productId);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchAllCategories = async () => {
            try {
                const response = await axiosPrivate.get('/admin/fetch/categories', {
                    signal: abortController.signal
                });
                dispatch(fetchCategories(response.data));
            }catch (e) {
                console.log(e)
            }
        }

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

        const fetchUnits = async () => {
            try {
                const response = await axiosPrivate.get('/admin/fetch/units', {
                    signal: abortController.signal
                });
                dispatch(fetchAllUnits(response.data));
            }catch (err){
                console.log(err)
            }
        }

        const fetchMediaData = async () => {
            try {
                const response = await axiosPrivate.get('/admin/fetch/all-media', {
                    signal: abortController.signal
                });
                dispatch(fetchMedias(response.data));
            }catch (e) {
                console.log(e)
            }
        }

        const fetchAllProducts = async () => {
            const response = await axiosPrivate.get('/admin/fetch/products', {
                signal: abortController.signal
            });
            dispatch(fetchProducts(response.data))
        }

        fetchAllProducts();
        fetchAllCategories();
        getUnitGroup();
        fetchUnits();
        fetchMediaData();

        return () => {
                abortController.abort();
        }

    }, [])


    const [mediaShow, setMediaShow] = useState(false);
    const [preview, setPreview] = useState('');
    const [requiredUnits, setRequiredUnits] = useState([]);
    const [initialValues, setInitialValues] = useState({
        name: '',
        categoryId: '',
        unitGroup: '',
        thumbnail: null,
        stockManagement: true,
        onPos: true,
        assignedUnit: '',
        salePrice: '',
        wholeSalePrice: '',
        lowQuantity: ''
    });

    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: productSchema,
        onSubmit: async (values, action) => {
            try {
                const response = await axiosPrivate.put('/admin/update/product', values);
                if(response.status === 200){
                    notifySuccess(response.data.message);
                }else {
                    notifyError(response.data.message)
                }
            }catch (e) {
                console.log(e);
                notifyError(e.response.data.message)
            }
        }
    })

    const changeMedia = (id, preview) => {
        const newData = {...values}
        newData['thumbnail'] = id;
        setInitialValues(newData);
        setPreview(preview)
        setMediaShow(false);
    }


    const onUnitGroupChange = async (val) => {
        const units = await unitList.filter((unit) => unit.unitGroup._id === val);
        setRequiredUnits(units)
    }

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    useEffect(() => {
        if(selectedProduct && productId){
            setInitialValues({
                productId: selectedProduct._id,
                name: selectedProduct.name,
                category: selectedProduct.category._id,
                unitGroup: selectedProduct.unitGroup._id,
                thumbnail: selectedProduct.thumbnail ? selectedProduct.thumbnail._id : null,
                stockManagement: selectedProduct.stockManagement,
                onPos: selectedProduct.onPos,
                assignedUnit: selectedProduct.assignedUnit._id,
                salePrice: selectedProduct.salePrice,
                wholeSalePrice: '',
                lowQuantity: selectedProduct.lowQuantity
            });

            if (selectedProduct.thumbnail){
                setPreview(arrayBufferToBase64(selectedProduct.thumbnail.image.data))
            }

        }
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedProduct && unitList){
            const units = unitList.filter((unit) => unit.unitGroup._id === selectedProduct.unitGroup._id);
            setRequiredUnits(units)
        }
    }, [selectedProduct, unitList])


    return (
        <>
        <ThumbnailSelectionModal mediaShow={mediaShow} setMediaShow={setMediaShow} changeMedia={changeMedia} />
        <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Update Product</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row justify-content-center">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                <label>Product Name</label>
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
                                <div className="col-6">
                                <div className="form-group">
                                <label>Category</label>
                                 <select
                                   className="form-control"
                                   placeholder=""
                                   name={'category'}
                                   value={values.category}
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                            >
                                {
                                    Object.keys(categories).length === 0 ? (
                                        <option value="">-- No Category --</option>
                                    ): (
                                       <>
                                        <option value=""> == Choose Category ==</option>
                                           {
                                               categories.map((opt, index) => {
                                                   return <option value={opt._id} key={opt._id}>{opt.name}</option>
                                            })
                                           }
                                       </>
                                    )
                                }
                            </select>
                            {
                                touched.category && errors.category ? (
                                    <ul className="parsley-errors-list filled">
                                        <li>{errors.category}</li>
                                    </ul>
                                ): null
                            }
                            </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                    <label>Unit Group</label>
                                     <select
                                       className="form-control"
                                       placeholder=""
                                       name={'unitGroup'}
                                       value={values.unitGroup}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       onInput={(e) => onUnitGroupChange(e.target.value)}
                                >
                                    {
                                        Object.keys(unitGroup).length === 0 ? (
                                            <option value="">-- No Unit Group --</option>
                                        ): (
                                           <>
                                            <option value=""> == Choose Unit Group ==</option>
                                               {
                                                   unitGroup.map((opt, index) => {
                                                       return <option value={opt._id} key={opt._id}>{opt.name}</option>
                                                })
                                               }
                                           </>
                                        )
                                    }
                                </select>
                                {
                                    touched.unitGroup && errors.unitGroup ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.unitGroup}</li>
                                        </ul>
                                    ): null
                                }
                                </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                    <label>Assigned Unit</label>
                                     <select
                                       className="form-control"
                                       placeholder=""
                                       name={'assignedUnit'}
                                       value={values.assignedUnit}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                >
                                    {
                                        Object.keys(requiredUnits).length === 0 ? (
                                            <option value="">-- No Units --</option>
                                        ): (
                                           <>
                                            <option value=""> == Choose Unit ==</option>
                                               {
                                                   requiredUnits.map((opt, index) => {
                                                       return <option value={opt._id} key={opt._id}>{opt.name} - {opt.identifier}</option>
                                                })
                                               }
                                           </>
                                        )
                                    }
                                </select>
                                {
                                    touched.assignedUnit && errors.assignedUnit ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.assignedUnit}</li>
                                        </ul>
                                    ): null
                                }
                                </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label>Searchable On POS</label>
                                        <input name="onPos" className={'toggleInput'} id="onPos" checked={values.onPos} onChange={handleChange} type="checkbox"/>
                                        <label htmlFor="onPos"><span></span></label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                    <label>Sale Price</label>
                                    <input type="text"
                                           className="form-control"
                                           placeholder=""
                                           autoComplete={'off'}
                                           name={'salePrice'}
                                           value={values.salePrice}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                    />
                                    {
                                        touched.salePrice && errors.salePrice ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.salePrice}</li>
                                            </ul>
                                        ): null
                                    }
                                </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                    <label>Low Quantity</label>
                                    <input type="text"
                                           className="form-control"
                                           placeholder=""
                                           autoComplete={'off'}
                                           name={'lowQuantity'}
                                           value={values.lowQuantity}
                                           onChange={handleChange}
                                           onBlur={handleBlur}
                                    />
                                    {
                                        touched.lowQuantity && errors.lowQuantity ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.lowQuantity}</li>
                                            </ul>
                                        ): null
                                    }
                                </div>
                                </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>Stock Management</label>
                                            <input name="stockManagement" className={'toggleInput'} id="stockCheck" checked={values.stockManagement} onChange={handleChange} type="checkbox"/>
                                            <label htmlFor="stockCheck"><span></span></label>
                                        </div>
                                    </div>
                                <div className="col-12">
                                    <div className="form-group">
                                    <label>Thumbnail</label>
                                    {
                                        preview ? (
                                            <img src={`data:image/png;base64,${preview}`} style={{objectFit: 'contain', width: '100%', height: '300px', cursor: 'pointer'}} onClick={() => setMediaShow(true)} alt=""/>
                                        ): (
                                            <img src={noImage} style={{objectFit: 'contain', width: '100%', height: '300px', cursor: 'pointer'}} onClick={() => setMediaShow(true)} alt=""/>
                                        )
                                    }
                                    <input type="hidden"
                                           className="form-control"
                                           placeholder=""
                                           name={'mediaId'}
                                           value={values.thumbnail}
                                    />
                                    {
                                        touched.thumbnail && errors.thumbnail ? (
                                            <ul className="parsley-errors-list filled">
                                                <li>{errors.thumbnail}</li>
                                            </ul>
                                        ): null
                                    }
                                </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                    <div>
                                        <button type="submit" className="btn btn-primary waves-effect waves-light">
                                            Submit
                                        </button>
                                        <Link to={'/admin/products'}><button type="reset" className="btn btn-danger waves-effect ml-2" data-dismiss="modal">
                                            Return Back
                                        </button>
                                        </Link>
                                    </div>
                                </div>
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

export default UpdateProduct;