import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {categorySchema} from "../schema";
import {notifyError, notifySuccess} from "../../toastNotification";
import noImage from '../../../images/noImage.jpg'
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../../redux/actions/categoryAction";
import {fetchMedias} from "../../../redux/actions/galleryAction";
import MediaSelectionModal from "./mediaSelectionModal";
import {Link, useParams} from "react-router-dom";


const UpdateCategory = () => {

    const {categoryId} = useParams();
    const categories = useSelector((state) => state.categories.categories)
    const selectedCategory = categories.find((data) => data._id === categoryId);

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [mediaShow, setMediaShow] = useState(false);

    useEffect(() => {
        fetchAllCategories();
        fetchMediaData();
    }, [])


    useEffect(() => {
        if(selectedCategory && categoryId){
            setInitialValues({
                categoryId: categoryId,
                name: selectedCategory.name,
                mediaId: selectedCategory.media._id,
                parentId: selectedCategory.parent? selectedCategory.parent._id : '',
            })
            setPreview(selectedCategory.media.image)

        }
    }, [selectedCategory])

    const fetchAllCategories = async () => {
        const response = await axiosPrivate.get('/admin/fetch/categories');
        dispatch(fetchCategories(response.data));
    }

    const fetchMediaData = async () => {
        try {
            const response = await axiosPrivate.get('/admin/fetch/all-media');
            dispatch(fetchMedias(response.data));
            return response.data;
        }catch (e) {
            console.log(e)
        }
    }


    const [initialValues, setInitialValues] = useState({
        categoryId: '',
        name: '',
        mediaId: '',
        parentId: '',
    });

    const [preview, setPreview] = useState('');


    const {values, errors, handleBlur, handleChange, handleSubmit, touched} = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: categorySchema,
        onSubmit: async (values, action) => {
            try {
                const response = await axiosPrivate.put('/admin/update/category', values);
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
        newData['mediaId'] = id;
        setInitialValues(newData);
        setPreview(preview)
        setMediaShow(false);
    }


    return (
        <>
            <MediaSelectionModal mediaShow={mediaShow} setMediaShow={setMediaShow} changeMedia={changeMedia}/>
            <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Update Category</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row justify-content-center">
              <div className="col-lg-6">
                  <div className="card m-b-30">
                        <div className="card-body">
                             <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
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
                                    <label>Parent</label>
                                     <select
                                       className="form-control"
                                       placeholder=""
                                       name={'parentId'}
                                       value={values.parentId}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                >
                                    {
                                        Object.keys(categories).length === 0 ? (
                                            <option value="">-- No category --</option>
                                        ): (
                                           <>
                                            <option value=""> == Choose Parent ==</option>
                                               {
                                                   categories.map((opt, index) => {
                                                       if(opt.parent === null){
                                                            return <option value={opt._id} key={opt._id}>{opt.name}</option>
                                                       }
                                                })
                                               }
                                           </>
                                        )
                                    }
                                </select>
                                {
                                    touched.parentId && errors.parentId ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.parentId}</li>
                                        </ul>
                                    ): null
                                }
                            </div>
                            <div className="form-group">
                                <label>Media</label>
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
                                       value={values.mediaId}
                                />
                                {
                                    touched.mediaId && errors.mediaId ? (
                                        <ul className="parsley-errors-list filled">
                                            <li>{errors.mediaId}</li>
                                        </ul>
                                    ): null
                                }
                            </div>
                            <div className="form-group">
                                <div>
                                    <button type="submit" className="btn btn-primary waves-effect waves-light">
                                        Submit
                                    </button>
                                    <Link to={'/admin/product-categories'}><button type="button" className="btn btn-danger waves-effect ml-2">
                                        Return Back
                                    </button></Link>
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

export default UpdateCategory;