import {Modal} from "react-bootstrap";
import React, {useState} from "react";
import ServingDish from '../../../../images/serving-dish.png';
import TakeAway from '../../../../images/food.png';

const OrderStepModal = ({show, setShow, step, orderType, prevStep, orderTypeChange, nextStep, setPaymentModal, amount, calculation, setCalculation, setupNewOrder}) => {

    const onTypeChange = (type) => {
        orderTypeChange(type);
        if(calculation.orderStatus === 'complete'){
            setShow(false);
            setPaymentModal(true);
        }else {
            nextStep();
        }
    }

    const referenceChange = (val) => {
        const ref = {...calculation};
        ref['reference'] = val;
        setCalculation(ref);
    }

    const cancelAction = () => {
        setShow(false);
        prevStep();
    }

    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} keyboard={false} centered size={'md'}>
            <Modal.Header>
                {
                    step === 1 ? (
                        <>
                            <h5 className="modal-title mt-0">Define Order Type</h5>
                        </>
                    ): (
                        <>
                            <h5 className="modal-title mt-0">Hold Order</h5>
                            <button type="button" className="close" onClick={() => setShow(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </>
                    )
                }
            </Modal.Header>
            <Modal.Body>
                {
                    step === 1 ? (
                        <>
                            <div className={'order-type-section'}>
                                <div className={orderType === 'inhouse' ? 'type-child active' : 'type-child'} onClick={() => onTypeChange('inhouse')}>
                                    <span><img src={ServingDish} alt=""/><br/><h5>In House</h5></span>
                                </div>
                                <div className={orderType === 'takeaway' ? 'type-child active' : 'type-child'} onClick={() => onTypeChange('takeaway')}>
                                    <span><img src={TakeAway} alt=""/><h5>Take Away</h5></span>
                                </div>
                            </div>
                        </>
                    ): (
                        <>
                            <h3 style={{textAlign: 'center'}}>Rs. {amount}</h3>
                                <hr/>
                                <input type="text" className={'form-control'} placeholder={'Order Reference'} value={calculation.reference} onChange={(e) => referenceChange(e.target.value)}/>
                                <p className={'mt-2'}>The current order will be set on hold. You can retrieve this order from the pending order button. Providing a reference to it might help you to identify the order more quickly.
                                </p>
                                <div className={'confirm-order-area'}>
                                    <div>
                                        <button onClick={() => setupNewOrder()}>Confirm</button>
                                    </div>
                                    <div>
                                        <button onClick={() => cancelAction()}>Cancel</button>
                                    </div>
                                </div>
                            </>
                    )
                }
            </Modal.Body>
        </Modal>

        </>
    )
}

export default OrderStepModal;