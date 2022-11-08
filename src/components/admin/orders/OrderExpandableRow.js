import React from "react";
import moment from "moment";

const OrderExpandableRow = ({data}) => {
    return (
        <>
            <div style={{width: '100%', padding: '10px'}}>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Order Code: </strong>{data.orderCode}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Order Type: </strong>{data.orderType}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Order Status: </strong>{data.orderStatus}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Payment Status: </strong>{data.paymentStatus}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Payment Method: </strong>{data.paymentMethod}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Partial Payment: </strong>{data.partialPayment ? <span>Rs. {data.partialPaidAmount}</span> : 'N/A'}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Sub Total: </strong>Rs. {data.subTotal}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Discount: </strong>{data.discountValue > 0 ? <span>Rs. {data.discountAmount}</span> : 'N/A'}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Total: </strong>Rs. {data.total}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Paid Amount: </strong>Rs. {data.paidAmount}</p>
                <p style={{lineHeight: '10px', textTransform: 'capitalize'}}><strong>Change Amount: </strong>Rs. {data.changeAmount}</p>

                <table className={'table-bordered table-striped'} style={{minWidth: '40%'}}>
                    <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Unit</th>
                        <th>Quantity</th>
                        <th>Sale Price</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.products.map((product) => {
                            return (
                                <tr key={product.productId}>
                                    <td>{product.productName}</td>
                                    <td>{product.assignedUnit}</td>
                                    <td>{product.quantity}</td>
                                    <td>Rs. {product.salePrice}</td>
                                    <td>Rs. {product.total}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                </div>
        </>
    )
}
export default OrderExpandableRow;