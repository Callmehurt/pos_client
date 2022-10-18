import React, {useEffect, useState} from "react";
import noImage from "../../../images/noImage.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useDebounce} from "use-debounce";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import arrayBufferToBase64 from "../../../hooks/arrayBufferToBase64";
import {notifySuccess, notifyError} from "../../toastNotification";
import {Modal} from "react-bootstrap";

const img = {
    display: 'block',
    width: '80px',
    height: '100%',
    objectFit: 'contain',
    padding: '5px',
    border: '1px dashed gainsboro',
};

const btnStyle = {
    height: '40px',
    width: '40px',
    borderRadius: '50%',
    background:'red',
    border: 'none',
    display: 'grid',
    placeItems: 'center',
    fontSize: '14px'
}

const dropDownStyle = {
    height: '200px',
    width: '100%',
    background: 'gainsboro',
    padding: '10px',
    positive: 'absolute !important',
    overflowY: 'auto'
}

const ProductSearch = ({selectedProduct, setSelectedProduct}) => {

    const axiosPrivate = useAxiosPrivate();
    const [searchKey, setSearchKey] = useState('');
    const [searchedProducts, setSearchedProducts] = useState([]);
    // const [selectedProduct, setSelectedProduct] = useState([])
    const [dropDownStatus, setDropDownStatus] = useState(false)
    const [value] = useDebounce(searchKey, 500);

    const searchProducts = async () => {
        const response = await axiosPrivate.get(`/admin/search/products?productName=${value}`);
        setSearchedProducts(response.data);
    }

    useEffect(() => {
        if(value === ''){
            setDropDownStatus(false)
            setSearchedProducts([])
        }else {
            searchProducts();
        }
    }, [value]);


    useEffect(() => {
        if(Object.keys(searchedProducts).length === 1){
            const prevData = selectedProduct.find((ptd) => ptd._id === searchedProducts[0]._id);
            if(!prevData){
                const newFav = [...selectedProduct, searchedProducts[0]];
                setSelectedProduct(newFav);
            }
            setDropDownStatus(false);
        }else if(Object.keys(searchedProducts).length > 1){
            setDropDownStatus(true)
        }
    }, [searchedProducts]);


    const chooseProduct = (product) => {
        setDropDownStatus(false);
        const prevData = selectedProduct.find((ptd) => ptd._id === product._id);
        if(!prevData){
            const newFav = [...selectedProduct, product];
            setSelectedProduct(newFav);
        }
    }

    const removeProduct = (product) => {
        const newProducts = [...selectedProduct]
        newProducts.splice(newProducts.indexOf(product), 1);
        setSelectedProduct(newProducts);
    }

    const onStockChange = (event, product) => {
        if(event.key === 'Enter' || event.type === 'blur'){
            if(event.target.value === '0' || event.target.value === ''){
                event.target.value = 1;
                product.changedQuantity = 1
                product.purchaseValue = parseInt(product?.unitPrice ? product.unitPrice : 0)*parseInt(product.changedQuantity);
                product.saleValue = parseInt(product.changedQuantity)*parseInt(product.salePrice);
                const newProducts = [...selectedProduct]
                newProducts[newProducts.indexOf(product)] = product;
                setSelectedProduct(newProducts)
            }else {
                product.changedQuantity = event.target.value;
                product.purchaseValue = parseInt(product?.unitPrice ? product.unitPrice : 0)*parseInt(product.changedQuantity);
                product.saleValue = parseInt(product.changedQuantity)* parseInt(product.salePrice);
                const newProducts = [...selectedProduct]
                newProducts[newProducts.indexOf(product)] = product;
                setSelectedProduct(newProducts)
            }
        }
    }

    const onUnitPriceChange = (event, product) => {
         if(event.key === 'Enter' || event.type === 'blur'){
            if(event.target.value === '0' || event.target.value === ''){
                event.target.value = 1;
                product.unitPrice = 1
                product.purchaseValue = parseInt(product?.changedQuantity ? product.changedQuantity : 1);
                const newProducts = [...selectedProduct]
                newProducts[newProducts.indexOf(product)] = product;
                setSelectedProduct(newProducts)
            }else {
                product.unitPrice = event.target.value;
                product.purchaseValue = parseInt(product.unitPrice)*parseInt(product?.changedQuantity ? product.changedQuantity : 1);
                const newProducts = [...selectedProduct]
                newProducts[newProducts.indexOf(product)] = product;
                setSelectedProduct(newProducts)
            }
        }
    }

    return (
        <>
            <div>
                <table className={'table table-striped table-bordered'}>
                    <thead>
                    <tr>
                        <th colSpan={9}>
                            <div style={{width: '50%', height: '28px', position: 'relative'}}>
                                <input type="search"
                                   className={'form-control form-control-sm'}
                                   placeholder={'Search..'}
                                   value={searchKey}
                                   onChange={(e) => setSearchKey(e.target.value)}
                                />
                                {
                                    dropDownStatus ? (
                                        <div style={dropDownStyle}>
                                            <span onClick={() => setDropDownStatus(false)} style={{color: 'red', cursor: 'pointer', float: 'right'}}>Close</span>
                                            {
                                                searchedProducts.map((data) => {
                                                    return (
                                                        <div key={data._id}>
                                                            <h6 style={{cursor: 'pointer'}} onClick={() => chooseProduct(data)}>{data.name}</h6>
                                                            <hr/>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    ) : ''
                                }
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>S.N</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Unit</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Value</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        Object.keys(selectedProduct).length === 0 ? (
                            <tr>
                                <td colSpan={9}><p className={'text-center'}>Search & add some products</p></td>
                            </tr>
                        ): (
                            selectedProduct.map((data, index) => {
                                return (
                                    <tr key={data._id}>
                                        <td>{++index}</td>
                                        <td>
                                            {
                                                data.thumbnail ? <img src={`data:image/png;base64,${arrayBufferToBase64(data.thumbnail.image.data)}`} style={img} alt=""/> : <img src={noImage} style={img} alt=""/>
                                            }
                                        </td>
                                        <td>{data.name}</td>
                                        <td>{data.assignedUnit.name}</td>
                                        <td>
                                            <input type="number" defaultValue={1} min='1' className={'form-control'} onBlur={(e) => onUnitPriceChange(e, data)} onKeyUp={(e) => onUnitPriceChange(e, data)}/>
                                        </td>
                                        <td>
                                            <input type="number" defaultValue={1} min='1' className={'form-control'} onBlur={(e) => onStockChange(e, data)} onKeyUp={(e) => onStockChange(e, data)}/>
                                        </td>
                                        <td>Rs. {
                                            data?.purchaseValue ? data.purchaseValue : 1
                                        }</td>
                                        <td><button style={btnStyle} onClick={() => removeProduct(data)}><FontAwesomeIcon className={'fa-lg'} style={{ color: 'white'}} icon={faXmark}/></button></td>
                                    </tr>
                                )
                            })
                        )
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ProductSearch;