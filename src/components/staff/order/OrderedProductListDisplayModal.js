import {Modal} from "react-bootstrap";
import React from "react";

const OrderedProductListDisplayModal = ({setShow, show, listedProducts, orderRef}) => {
    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} backdrop={'static'} centered size={'md'}>
                <Modal.Header>
                    <h6 className="modal-title mt-0" style={{textTransform: 'capitalize'}}>{orderRef}</h6>
                    <button type="button" className="close" onClick={() => setShow(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    {
                        listedProducts.map((product) => {
                            return (
                                <div key={product.productId} style={{borderBottom: '1px solid #60A5FA', marginBottom: '7px', paddingBottom: '7px', paddingTop: '7px'}}>
                                    <div>
                                        <span><strong>{product.productName} (x{product.quantity}) </strong></span>
                                        <span style={{float: 'right'}}><strong>Rs. {product.salePrice} </strong></span>
                                    </div>
                                    <div>
                                        <span><strong>Unit: </strong> {product.assignedUnit}</span>
                                        <span style={{float: 'right'}}><strong>Rs. {product.total} </strong></span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OrderedProductListDisplayModal;