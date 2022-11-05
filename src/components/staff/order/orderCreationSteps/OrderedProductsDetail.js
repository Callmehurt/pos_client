const OrderedProductsDetail = ({prevStep}) => {
    return (
        <>
            <h5>Product List</h5>
            <button onClick={() => prevStep()}>Prev Step</button>
        </>
    )
}

export default OrderedProductsDetail;
