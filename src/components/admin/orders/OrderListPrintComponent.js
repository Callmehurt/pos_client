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
                
        #order-table, td, th {
            border: 1px solid black;
            font-family: Roboto, Helvetica, Arial, sans-serif;
        }

    #order-table thead tr th{
        padding: 5px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
    }

    #order-table tbody tr td{
        padding-left: 5px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
    }

    #order-table {
        width: 100%;
        border-collapse: collapse;
    }

    #order-table thead{
        background: gainsboro;
    }

        `
    }

    return (
        <>
            <div ref={ref} style={{height: '0px', overFlow: 'hidden'}}>
                <style type="text/css">
                    {getTableStyle()}
                </style>
                <div className={'order-print'}>
                    <table id={'order-table'}>
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