import {Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft, faShare} from "@fortawesome/free-solid-svg-icons";

const DiscountNumpad = ({show, setShow, discountDetail, setDiscountDetail, handleDiscount}) => {

    const [num, setNum] = useState('0');


     useEffect(() => {
        if(discountDetail){
            setNum(discountDetail.discountValue.toString());
        }
    }, [discountDetail])

    const handleKeyValue = (val) => {
        if(parseInt(num) === 0){
            const newNum = val.toString();
            setNum(newNum)
        }else {
            const rNum = val.toString();
            const newNum = num.concat(rNum);
            if(discountDetail.discountType === 'percentage'){
                if(parseInt(newNum) > 100){
                    setNum('100')
                }else {
                    setNum(newNum);
                }
            }else {
                setNum(newNum);
            }
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

    const handleDiscountType = (val) => {
        const newType = {...discountDetail};
        newType['discountType'] = val;
        setDiscountDetail(newType);
        if(val === 'percentage'){
            if(parseInt(num) > 100){
                setNum('100')
            }
        }
    }

    const handleNumSubmit = () => {
        handleDiscount(parseInt(num))
        setShow(false);
    }


    return (
        <>
        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false} centered size={'md'}>
            <Modal.Header>
                <h5 className="modal-title mt-0">Define Discount</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <h3 style={{textAlign: 'center'}}>
                    {discountDetail.discountType === 'flat' ? `Rs. ${num}` :`${num}%`}
                </h3>
                <button style={{width: '50%'}} onClick={() => handleDiscountType('flat')} className={discountDetail.discountType === 'flat' ? 'discount-btn discount-active' : 'discount-btn'}>Flat</button>
                <button style={{width: '50%'}} onClick={() => handleDiscountType('percentage')} className={discountDetail.discountType === 'percentage' ? 'discount-btn discount-active' : 'discount-btn'}>Percentage</button>
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
            </Modal.Body>
        </Modal>
        </>
    )
}

export default DiscountNumpad;