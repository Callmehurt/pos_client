import {Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft, faShare} from "@fortawesome/free-solid-svg-icons";

const Numpad = ({show, setShow, handleQuantityChange, currentSelected}) => {

    const [num, setNum] = useState('1');


    useEffect(() => {
        if(currentSelected){
            setNum(currentSelected.quantity)
        }
    }, [currentSelected])

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
        handleQuantityChange(num);
        setShow(false);
    }

    return (
        <>
        <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false} centered size={'md'}>
            <Modal.Header>
                <h5 className="modal-title mt-0">Define Quantity</h5>
                <button type="button" className="close" onClick={() => setShow(false)}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body>
                <h3 style={{textAlign: 'center'}}>{num}</h3>
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

export default Numpad;