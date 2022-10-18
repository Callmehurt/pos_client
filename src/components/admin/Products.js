import React, {useEffect} from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import {fetchProducts} from "../../redux/actions/productAction";
import ProductList from "./products/ProductList";
import {setLoadingFalse, setLoadingTrue} from "../../redux/actions/loadingAction";

const Products = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const fetchAllProducts = async () => {
        dispatch(setLoadingTrue())
        const response = await axiosPrivate.get('/admin/fetch/products');
        dispatch(setLoadingFalse())
        dispatch(fetchProducts(response.data))
    }

    useEffect(() => {
        fetchAllProducts();
    })


    return (
        <>
            <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Products</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row justify-content-center">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <ProductList/>
                        </div>
                  </div>
              </div>
          </div>
        </>
    )
}

export default Products;