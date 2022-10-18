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

const StockList = () => {

    const axiosPrivate = useAxiosPrivate();
    const [searchKey, setSearchKey] = useState('');
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([])
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

    const onActionChange = (product, action) => {
        product.stockAction = action;
        const newProducts = [...selectedProduct]
        newProducts[newProducts.indexOf(product)] = product;
        setSelectedProduct(newProducts)
    }

    const onStockChange = (event, product) => {
        if(event.key === 'Enter' || event.type === 'blur'){
            if(event.target.value === '0' || event.target.value === ''){
                event.target.value = 1;
                product.changedQuantity = 1
                product.calculatedPrice = parseInt(product.salePrice)*parseInt(event.target.value);
                const newProducts = [...selectedProduct]
                newProducts[newProducts.indexOf(product)] = product;
                setSelectedProduct(newProducts)
            }else {
                product.changedQuantity = event.target.value;
                product.calculatedPrice = parseInt(product.salePrice)*parseInt(event.target.value);
                const newProducts = [...selectedProduct]
                newProducts[newProducts.indexOf(product)] = product;
                setSelectedProduct(newProducts)
            }
        }
    }

    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const proceedStockAdjustment = async () => {
        setIsLoading(true)
        try {
            const response = await axiosPrivate.post('/admin/adjust-stock', {
                adjustedProducts: selectedProduct
            });
            notifySuccess(response.data.message);
            setSelectedProduct([]);
            setShow(false);
            setIsLoading(false)
        }catch (e) {
            console.log(e);
            setIsLoading(false)
            notifyError(e.response.data.message);
        }
    }

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header>
               <h5 className="modal-title mt-0">Confirm Your Action</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>The stock adjustment is about to be made. Would you like to confirm ?</Modal.Body>
            <Modal.Footer>
              <button className={'btn btn-sm btn-danger'} onClick={() => setShow(false)}>
                Cancel
              </button>
                {
                    isLoading ? <button className={'btn btn-sm btn-primary'}>
                    Processing....
                  </button> : <button className={'btn btn-sm btn-primary'} onClick={() => proceedStockAdjustment()}>
                    Continue
                  </button>
                }
            </Modal.Footer>
          </Modal>

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
                        <th>Operation</th>
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
                                            <select className={'form-control'} defaultValue={'add'} onChange={(e) => onActionChange(data, e.target.value)}>
                                                <option value="add">Add</option>
                                                <option value="deduct">Deduct</option>
                                                <option value="defective">Defective</option>
                                                <option value="lost">Lost</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input type="number" defaultValue={1} min='1' className={'form-control'} onBlur={(e) => onStockChange(e, data)} onKeyUp={(e) => onStockChange(e, data)}/>
                                        </td>
                                        <td>Rs. {
                                            data?.calculatedPrice ? data.calculatedPrice : data.salePrice
                                        }</td>
                                        <td><button style={btnStyle} onClick={() => removeProduct(data)}><FontAwesomeIcon className={'fa-lg'} style={{ color: 'white'}} icon={faXmark}/></button></td>
                                    </tr>
                                )
                            })
                        )
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={9}>
                            <button className={'btn btn-sm btn-primary float-right'} onClick={() => setShow(true)}>Proceed</button>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </>
    )
}

export default StockList;