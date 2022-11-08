import {Modal} from "react-bootstrap";
import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft, faShare} from "@fortawesome/free-solid-svg-icons";
import {notifyError, notifySuccess} from "../../../toastNotification";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import {Receipt} from "../../../admin/orders/Receipt";
import {useReactToPrint} from "react-to-print";

const OrderPaymentModal = ({show, setShow, calculation, setCalculation, resetPos}) => {

    const privateAxios = useAxiosPrivate();

    const [num, setNum] = useState('0');
    const [changeAmount, setChangeAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentType, setPaymentType] = useState('')

    const handleKeyValue = (val) => {
        if(parseInt(num) === 0){
            const newNum = val.toString();
            setNum(newNum)
        }else {
            const rNum = val.toString();
            const newNum = num.concat(rNum);
            setNum(newNum);
        }
    }

    const handleClear = () => {
        const newNum = num.slice(0, -1);
        if(newNum.length === 0 || parseInt(newNum) === 0){
            setNum('0');
        }else {
            setNum(newNum);
        }
    }

    const handleNumSubmit = () => {
        if (calculation.partialPayment){
            setChangeAmount(parseInt(num)-parseInt(calculation.total)+parseInt(calculation.partialPaidAmount));
        }else {
            setChangeAmount(parseInt(num)-parseInt(calculation.total));
        }
        setPaidAmount(parseInt(num));
    }


    const paymentProcess = (type) => {
        setPaymentType(type);
        setConfirmShow(true);
    }

    const changePaymentMethod = (method) => {
        const newCalculation = {...calculation};
        newCalculation['paymentMethod'] = method;
        setCalculation(newCalculation);

    }

    const [confirmShow, setConfirmShow] = useState(false);

    const confirmPayment = async () => {
        const newCalculation = {...calculation};
        if(paymentType === 'full'){
            if(calculation.calculationType === 'old' && calculation.partialPaidAmount > 0){
                newCalculation['paidAmount'] = calculation.total-calculation.partialPaidAmount;
            }else{
                newCalculation['paidAmount'] = calculation.total
            }
            newCalculation['changeAmount'] = '0';
            newCalculation['paymentStatus'] = 'paid';
            if(calculation.calculationType === 'old' && calculation.partialPayment){
                newCalculation.prevPartial = true
            }
            newCalculation['partialPayment'] = false;
        }else {
            if(parseInt(paidAmount) === 0){
                notifyError('Paid amount cannot be zero');
                return null;
            }else if(parseInt(paidAmount) > parseInt(calculation.total)){
                notifyError('Paid amount is greater than payable amount');
                return null;
            }
            newCalculation['partialPaidAmount'] = paidAmount;
            newCalculation['partialPayment'] = true;
            newCalculation['paymentStatus'] = 'partial';
            if(calculation.calculationType === 'old' && calculation.partialPayment){
                newCalculation.prevPartial = true
            }
        }
        try {
            const res = await privateAxios.post('/setup/order', newCalculation);
            if(res.status === 200){
                if(res.data.order.orderStatus === 'complete'){
                    setSelectedOrder(res.data.order)
                }
                notifySuccess(res.data.message);
                resetPos();
                setPaidAmount(0)
                setChangeAmount(0);
                setPaymentType('');
                setConfirmShow(false);
                setShow(false);
                setNum('0')
            }else {
                notifyError('Error encountered')
            }
        }catch (e) {
            console.log(e)
            notifyError(e.response.data.message)
        }
    }

    const processNormalPayment = async () => {
        const newCalculation = {...calculation};
        newCalculation['paidAmount'] = paidAmount;
        newCalculation['changeAmount'] = changeAmount;
        newCalculation['paymentStatus'] = 'paid';
        newCalculation['partialPayment'] = false;
        if(calculation.calculationType === 'old' && calculation.partialPayment){
            newCalculation.prevPartial = true
        }

        try {
            const res = await privateAxios.post('/setup/order', newCalculation);
            if (res.status === 200) {
                if(res.data.order.orderStatus === 'complete'){
                    setSelectedOrder(res.data.order)
                }
                notifySuccess(res.data.message);
                resetPos();
                setPaidAmount(0)
                setChangeAmount(0);
                setPaymentType('');
                setConfirmShow(false);
                setShow(false);
                setNum('0');
            } else {
                notifyError('error')
            }
        }catch (e) {
            notifyError(e.response.data.message)
        }
    }

    const [selectedOrder, setSelectedOrder] = useState({});

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onAfterPrint: () => setSelectedOrder({})
    });

    useEffect(() => {
            if(Object.keys(selectedOrder).length !== 0){
                handlePrint();
            }
        }, [selectedOrder])

    return (
        <>
            {
                Object.keys(selectedOrder).length > 0 ? <Receipt selectedOrder={selectedOrder} ref={componentRef}/> : ''

            }
            <Modal show={confirmShow} onHide={() => setConfirmShow(false)} keyboard={false} backdrop={'static'} centered>
            <Modal.Header>
                <h5 className="modal-title mt-0">{paymentType === 'full' ? 'Full': 'Partial'} Payment Confirmation</h5>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p>A {paymentType === 'full' ? 'full': 'partial'} payment {paymentType === 'partial' ? `of ${paidAmount} `: ''} will be made using {calculation.paymentMethod} for Rs. {calculation.calculationType === 'old' && calculation.partialPayment ? calculation.total-calculation.partialPaidAmount : calculation.total}</p>
                </div>
                <div className={'confirm-order-area'}>
                    <div>
                        <button onClick={() => confirmPayment()}>Confirm</button>
                    </div>
                    <div>
                        <button onClick={() => setConfirmShow(false)}>Cancel</button>
                    </div>
                </div>
            </Modal.Body>
            </Modal>

        <Modal show={show} onHide={() => setShow(false)} backdrop={'static'} centered size={'xl'}>
            <Modal.Header>
                <h5 className="modal-title mt-0" style={{textTransform: 'capitalize'}}>Gateway: {calculation.paymentMethod}</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className={'payment-box'}>
                    <div>
                        <button onClick={() => changePaymentMethod('cash')} className={calculation.paymentMethod === 'cash' ? 'payment-option active' : 'payment-option'}>Cash</button>
                        <button onClick={() => changePaymentMethod('esewa')} className={calculation.paymentMethod === 'esewa' ? 'payment-option active' : 'payment-option'}>E-Sewa</button>
                        <button onClick={() => changePaymentMethod('mobank')} className={calculation.paymentMethod === 'mobank' ? 'payment-option active' : 'payment-option'}>Mobank</button>
                    </div>
                    <div>
                        <div className={'final-payment-area'}>
                            <div>
                                <span>Total: Rs. {calculation.partialPayment ? parseInt(calculation.total) - parseInt(calculation.partialPaidAmount) : calculation.total}</span>
                            </div>
                            <div>
                                <span>Discount: Rs. {calculation.discountAmount}</span>
                            </div>
                            <div>
                                <span>Paid: Rs. {paidAmount}</span>
                            </div>
                            <div>
                                <span>Change: Rs. {changeAmount}</span>
                            </div>
                        </div>
                        <div style={{border: '1px solid gainsboro', marginTop: '7px', marginBottom: '7px', padding: '20px'}}>
                            <span style={{fontSize: '17px'}}><strong>Screen:</strong> Rs. {num}</span>
                        </div>
                        <div>
                            <div className={'numpad-area'}>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(1)}>1</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(2)}>2</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(3)}>3</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(4)}>4</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(5)}>5</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(6)}>6</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(7)}>7</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(8)}>8</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(9)}>9</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleClear()}><FontAwesomeIcon style={{fontSize: '16px'}} icon={faDeleteLeft}/></button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleKeyValue(0)}>0</button>
                                </div>
                                <div className={'nums'}>
                                    <button onClick={() => handleNumSubmit()}><FontAwesomeIcon style={{fontSize: '16px'}} icon={faShare}/></button>
                                </div>
                            </div>
                        </div>
                        <div className={'payment-buttons'}>
                            <div>
                                <button onClick={() => paymentProcess('full')}>Full Payment</button>
                            </div>
                            <div>
                                <button disabled={calculation.calculationType === 'old' && calculation.partialPayment ? true : false} onClick={() => paymentProcess('partial')}>Partial Payment</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {
                    calculation.calculationType === 'old' && calculation.partialPayment ? (
                        <button onClick={() => processNormalPayment()} disabled={parseInt(paidAmount) >= parseInt(calculation.total) - parseInt(calculation.partialPaidAmount) ? false: true} style={{height: '40px', width: '150px', borderRadius: '5px',float: 'right', border: 'none', background: '#68c634', color: 'white'}}>Submit Payment</button>
                    ): (
                        <button onClick={() => processNormalPayment()} disabled={parseInt(paidAmount) >= parseInt(calculation.total) ? false: true} style={{height: '40px', width: '150px', borderRadius: '5px',float: 'right', border: 'none', background: '#68c634', color: 'white'}}>Submit Payment</button>
                    )
                }
                {/*<button onClick={() => processNormalPayment()} style={{height: '40px', width: '150px', borderRadius: '5px',float: 'right', border: 'none', background: '#68c634', color: 'white'}}>Submit Payment</button>*/}
                {/*<button onClick={() => processNormalPayment()} disabled={parseInt(paidAmount) >= parseInt(calculation.total) ? false: true} style={{height: '40px', width: '150px', borderRadius: '5px',float: 'right', border: 'none', background: '#68c634', color: 'white'}}>Submit Payment</button>*/}
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default OrderPaymentModal;