import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faEye} from "@fortawesome/free-solid-svg-icons";
import TableLoader from "../../loader/TableLoader";

import moment from 'moment'
import OrderedProductListDisplayModal from "./OrderedProductListDisplayModal";

const OrderListModal = ({show, setShow, orderList, orderType, setOrderType, isFetchingOrders, openCalculation}) => {

    const [listShow, setListShow] = useState(false);
    const [listedProducts, setListedProducts] = useState([]);
    const [orderRef, setOrderRef] = useState('');


    const showListedProducts = (order) => {
        setListedProducts(order.products);
        const ref = order.reference.concat(`(${order._id})`)
        setOrderRef(ref)
        setListShow(true);
    }

    return (
        <>
            <OrderedProductListDisplayModal show={listShow} setShow={setListShow} listedProducts={listedProducts} orderRef={orderRef}/>
            <Modal show={show} onHide={() => setShow(false)} backdrop={'static'} centered size={'lg'}>
                <Modal.Header>
                    <h5 className="modal-title mt-0" style={{textTransform: 'capitalize'}}>Orders</h5>
                    <button type="button" className="close" onClick={() => setShow(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="order-list-area">
                        <div className="button-area">
                            <button onClick={() => setOrderType('hold')} className={orderType === 'hold' ? 'active': ''}>On Hold</button>
                            <button onClick={() => setOrderType('partial')} className={orderType === 'partial' ? 'active': ''}>Partially Paid</button>
                        </div>
                        <div className="order-lists">
                            {
                                isFetchingOrders ? (
                                    <div className={'loader'}>
                                        <TableLoader/>
                                    </div>
                                ): (
                                    Object.keys(orderList).length < 1 ? (
                                        <>
                                            <p style={{textAlign: 'center', marginTop: '45%'}}>Nothing to Display</p>
                                        </>
                                    ): (
                                        orderList.map((order) => {
                                            return (
                                                <div className="order-list" key={order._id}>
                                                    <div className={'flex-box'}>
                                                        <div>
                                                            <span><strong>Reference: </strong> {order.reference}</span>
                                                            <br/>
                                                            <span><strong>Total: </strong> Rs. {order.total}</span>
                                                            <br/>
                                                            <span><strong>Tendered: </strong> Rs. {order.partialPayment ? order.partialPaidAmount : order.paidAmount}</span>
                                                            <br/>
                                                        </div>
                                                        <div>
                                                            <span><strong>Code: </strong> {order.orderCode}</span>
                                                            <br/>
                                                            <span><strong>Date: </strong> {moment(order.createdAt).format('LLL')}</span>
                                                            <br/>
                                                            <span><strong>Type: </strong> {order.orderType}</span>
                                                            <br/>
                                                        </div>
                                                    </div>
                                                    <div className={'btn-group'}>
                                                        <div>
                                                            <button onClick={() => openCalculation(order)}><FontAwesomeIcon icon={faLock}/> Open</button>
                                                            <button onClick={() => showListedProducts(order)}><FontAwesomeIcon icon={faEye}/> Products</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                )
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OrderListModal;