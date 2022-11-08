import React from "react";
import logo from '../../../images/logo.jpg'
import moment from "moment";

export const Receipt = React.forwardRef((props, ref) => {

    const styles = () => {
        return `
        
         @media print {
              @page { size: 58mm 100mm; overflow: hidden }
              
               html, body {
                height: initial !important;
                overflow: initial !important;
                -webkit-print-color-adjust: exact;
                display: block;
              }
              
             
              table, td, th {
                // border: 1px dashed gainsboro;
                font-family: Roboto, Helvetica, Arial, sans-serif;
                font-size: 10px !important;
            }
            
            
            .calculation ul{
            padding-left: 0;
            }
            
            .calculation ul li{
            list-style: none;
            font-size: 10px
            }
                            
            }
        `
    }

    return (
        <>
            <div ref={ref} style={{overFlow: 'hidden',height: '0'}}>
                <style type="text/css">
                    {styles()}
                </style>
                <div style={{width: '325px', marginTop: '8px', height: '50px', display: 'grid', placeItems: 'center'}} >
                    <div style={{height: '50px', width: '50px', borderRadius: '50%', overflow: 'hidden'}}>
                        <img src={logo} style={{height: '100%', width: '100%'}} alt=""/>
                    </div>
                </div>
                <div style={{width: '315px', display: 'grid', placeItems: 'center'}}>
                    <h5 style={{fontWeight: '600', lineHeight: '0px', fontSize: '14px'}}>The Chiya Station 2.0</h5>
                    <h6 style={{lineHeight: '0px', fontSize: '13px'}}>Sunder Haraicha, Biratchowk</h6>
                    <h6 style={{lineHeight: '0px', fontSize: '13px'}}>9810449087</h6>
                </div>
                <div style={{padding: '7px'}}>
                    <span style={{marginRight: '8px', fontSize: '11px'}}>Order: {props.selectedOrder.orderCode}</span><span style={{fontSize: '11px'}}>{moment(props.selectedOrder.createdAt).format('LLL')}</span>
                </div>
                <div style={{width: '100%', padding: '5px'}}>
                    <table style={{width: '100%', maxWidth: '315px'}}>
                        <thead style={{borderBottom: '1px dashed gainsboro'}}>
                        <tr>
                            <th style={{maxWidth: '20px'}}>Qty</th>
                            <th>Item Description</th>
                            <th style={{textAlign: 'right'}}>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.selectedOrder.products.map((product) => {
                                return (
                                    <tr key={product.productId}>
                                        <td>{product.quantity}</td>
                                        <td>{product.productName}</td>
                                        <td style={{textAlign: 'right'}}>Rs. {product.salePrice}</td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td colSpan={3} style={{textAlign: "center", paddingTop: '15px', paddingBottom: '5px', fontSize: '14px', fontWeight: '500'}}>{props.selectedOrder.products.reduce((total, obj) => total + parseInt(obj.quantity), 0)}x Items</td>
                        </tr>
                        </tbody>
                        <tbody style={{borderBottom: '1px dashed gainsboro', borderTop: '1px dashed gainsboro'}}>
                        <tr>
                                <td colSpan={2}><strong>Sub Total</strong></td>
                                <td style={{textAlign: 'right'}}>Rs. {props.selectedOrder.subTotal}</td>
                            </tr>
                        <tr>
                            <td colSpan={2}><strong>Discount</strong></td>
                            <td style={{textAlign: 'right'}}>Rs. {props.selectedOrder.discountAmount}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><strong>Grand Total</strong></td>
                            <td style={{textAlign: 'right'}}>Rs. {props.selectedOrder.total}</td>
                        </tr>
                        </tbody>
                        <tbody>
                        {
                            props.selectedOrder.partialPayment ?
                                (
                                    <>
                                        <tr>
                                            <td colSpan={2}><strong style={{textTransform: "capitalize"}}>Partially Paid:</strong></td>
                                            <td style={{textAlign: 'right'}}>Rs. {props.selectedOrder.partialPaidAmount}</td>
                                        </tr>
                                        <tr style={{borderBottom: '1px dashed gainsboro'}}>
                                            <td colSpan={2}><strong style={{textTransform: "capitalize"}}>{props.selectedOrder.paidAmount === 0 ? 'Pending Payment:' : 'Second Payment:'}</strong></td>
                                            {
                                                props.selectedOrder.paidAmount === 0 ? (
                                                    <td style={{textAlign: 'right'}}>Rs. {parseInt(props.selectedOrder.total)-parseInt(props.selectedOrder.partialPaidAmount)}</td>
                                                ) :
                                                    (
                                                        <td style={{textAlign: 'right'}}>Rs. {parseInt(props.selectedOrder.paidAmount)-parseInt(props.selectedOrder.partialPaidAmount)+parseInt(props.selectedOrder.changeAmount)}</td>
                                                    )
                                            }
                                        </tr>
                                    </>
                                )
                                : ''
                        }
                        <tr>
                            {
                                props.selectedOrder.paymentStatus === 'partial' ? (
                                <td colSpan={2}><strong style={{textTransform: "capitalize"}}>Partial: {props.selectedOrder.paymentMethod}</strong></td>
                                ): (
                                <td colSpan={2}><strong style={{textTransform: "capitalize"}}>{props.selectedOrder.paymentMethod}</strong></td>
                                )
                            }
                            <td style={{textAlign: 'right'}}>Rs. {props.selectedOrder.paymentStatus === 'partial' ? props.selectedOrder.partialPaidAmount : props.selectedOrder.paidAmount}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><strong>Change</strong></td>
                            <td style={{textAlign: 'right'}}>Rs. {props.selectedOrder.changeAmount}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{width: '325px'}}>
                    <p style={{textAlign: "center", fontSize: '12px'}}>Thank you & visit again!</p>
                </div>
            </div>
        </>
    )
})
