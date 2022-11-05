import {Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDebounce} from "use-debounce";
import OnSelectNumpad from "../numpad/OnSelectNumpad";


const ProductSearchModal = ({show, setShow, selectedProducts, setSelectedProducts}) => {

    const axiosPrivate = useAxiosPrivate();

    const [numpadShow, setNumpadShow] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [currentSelected, setCurrentSelected] = useState({
        productId: '',
        productName: '',
        assignedUnit: '',
        salePrice: '',
        quantity: '',
        total: ''
    })
    const [value] = useDebounce(searchKey, 500);

    const searchProducts = async () => {
        const response = await axiosPrivate.get(`/search/products?productName=${value}`);
        setSearchedProducts(response.data);
    }

    useEffect(() => {
        if(value === ''){
            setSearchedProducts([])
        }else {
            searchProducts();
        }
    }, [value]);


    const chooseProduct = (product) => {

        const newCurrent = {...currentSelected};
        newCurrent['productId'] = product._id;
        newCurrent['productName'] = product.name;
        newCurrent['assignedUnit'] = product.assignedUnit.name;
        newCurrent['salePrice'] = product.salePrice;

        setShow(false);
        setSearchKey('');
        setSearchedProducts([]);
        setNumpadShow(true);

        setCurrentSelected(newCurrent);
    }

    return (
        <>
           <OnSelectNumpad
               show={numpadShow}
               setShow={setNumpadShow}
               currentSelected={currentSelected}
               selectedProducts={selectedProducts}
               setSelectedProducts={setSelectedProducts}
           />
        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false} centered size={'lg'}>
            <Modal.Header>
                <h5 className="modal-title mt-0">Search Product</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <input type="search"
                           autoFocus className={'form-control'}
                           value={searchKey}
                           onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <hr/>
                </div>
                <div className={'searchResults'}>

                    {
                        Object.keys(searchedProducts).length > 0 ? (
                            <>
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
                            </>
                        ) : (
                            <>
                                <p style={{textAlign: 'center'}}>There is nothing to display. Have you started the search ?</p>
                            </>
                        )
                    }

                </div>
            </Modal.Body>
        </Modal>
        </>
    )
}

export default ProductSearchModal;