import React from "react";

export const OrderListPrintComponent = React.forwardRef((props, ref) => {

    const getTableStyle = () => {
        return `
        
        @media print {
          html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @page {
          size: auto;
          margin: 5mm;
        }
                
        table, td, th {
        border: 1px solid black;
        font-family: Roboto, Helvetica, Arial, sans-serif;
    }

    thead tr th{
        padding: 5px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
    }

    tbody tr td{
        padding-left: 5px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead{
        background: gainsboro;
    }

    .table-top-head{
        text-align: center;
        height: 35px;
        width: 170px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: grid;
        place-items: center;
        border: 1px solid gainsboro;
        color: black;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom: none;
    }
        `
    }

    return (
        <>
            <div ref={ref} style={{overFlow: 'hidden', height: '0'}}>
                <style type="text/css" media="print">
                    {getTableStyle()}
                </style>
                <div style={{margin: '10px'}}>
                    <table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Order Type</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            <th>Payment</th>
                            <th>Partial Payment</th>
                            <th>Sub Total</th>
                            <th>Discount</th>
                            <th>Total</th>
                            <th>Paid Amount</th>
                            <th>Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.orders.map((order, index) => {
                                return (
                                    <tr key={order.orderCode.concat(index)}>
                                        <td>{order.orderCode}</td>
                                        <td>{order.orderType}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>{order.paymentStatus}</td>
                                        <td>{order.paymentMethod}</td>
                                        <td>{order.partialPayment ? <span>Rs. {order.partialPaidAmount}</span> : 'N/A'}</td>
                                        <td>Rs. {order.subTotal}</td>
                                        <td>{order.discountValue > 0 ? <span>Rs. {order.discountAmount}</span> : 'N/A'}</td>
                                        <td>Rs. {order.total}</td>
                                        <td>Rs. {order.paidAmount}</td>
                                        <td>Rs. {order.changeAmount}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )

})