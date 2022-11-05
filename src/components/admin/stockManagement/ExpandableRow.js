import React from "react";
import moment from "moment";

const ExpandableRow = ({data}) => {
    return (
        <>
            <div style={{width: '100%', padding: '10px'}}>
                <p style={{lineHeight: '10px'}}><strong>Product Name: </strong>{data.product.name}</p>
                <p style={{lineHeight: '10px'}}><strong>Procurement: </strong>{data.procurement ? data.procurement.name : 'N/A'}</p>
                <p style={{lineHeight: '10px'}}><strong>Order: </strong>{data.order ? data.order : 'N/A'}</p>
                <p style={{lineHeight: '10px'}}><strong>Operation: </strong><span style={{textTransform: 'capitalize'}}>{data.operationType}</span></p>
                <p style={{lineHeight: '10px'}}><strong>Unit: </strong>{data.product.assignedUnit.name} - {data.product.assignedUnit.identifier}</p>
                <p style={{lineHeight: '10px'}}><strong>Initial Quantity: </strong>{data.stockManagement ? data.initialQuantity : 'N/A'}</p>
                <p style={{lineHeight: '10px'}}><strong>Quantity: </strong>{data.quantity}</p>
                <p style={{lineHeight: '10px'}}><strong>New Quantity: </strong>{data.stockManagement ? data.newQuantity : 'N/A'}</p>
                <p style={{lineHeight: '10px'}}><strong>Total Price: </strong>Rs. {data.amount}</p>
                <p style={{lineHeight: '10px'}}><strong>Prompt Date: </strong>{moment(data.createdAt).format('LLL')}</p>
                </div>
        </>
    )
}

export default ExpandableRow;