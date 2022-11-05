const TableDetail = ({nextStep}) => {
    return (
        <>
            <h5>Choose Table Number</h5>

            <button onClick={() => nextStep()}>Next Step</button>
        </>
    )
}

export default TableDetail;