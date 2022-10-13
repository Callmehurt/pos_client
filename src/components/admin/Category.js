import React, {useEffect} from "react";
import CategoryList from "./partials/CategoryList";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../redux/actions/categoryAction";


const Category = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const categories = useSelector((state) => state.categories.categories);

    useEffect(() => {
        fetchAllCategories();
    }, [])


    const fetchAllCategories = async () => {
        const response = await axiosPrivate.get('/admin/fetch/categories');
        dispatch(fetchCategories(response.data));
    }

    return (
        <>
            <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Category</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <CategoryList categoryList={categories}/>
                        </div>
                    </div>
              </div>
          </div>
        </>
    )
}

export default Category;