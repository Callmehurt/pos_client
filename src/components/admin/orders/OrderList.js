import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faDownload,
    faPrint,
    faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Fuse from "fuse.js";
import {Link} from "react-router-dom";
import OrderExpandableRow from "./OrderExpandableRow";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {fetchAllOrders} from "../../../redux/actions/orderAction";
import {Receipt} from "./Receipt";
import {useReactToPrint} from "react-to-print";
import {OrderListPrintComponent} from "./OrderListPrintComponent";

const OrderList = () => {

    const orderList = useSelector((state) => state.orderList.orders);

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(orderList)
    }, [orderList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name']
        }

        const fuse = new Fuse(orderList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(orderList);
    }, [search]);

    const deleteOrder = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/delete/${data._id}/order`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...orderList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchAllOrders(newData))
             }
         }catch (e){
             notifyError(e.response.data.message)
             console.log(e)
         }
    }


    const columns = [
        {
          name: 'Action',
          cell: row => (
              <>
                <ul className="navbar-right ml-auto list-inline float-right mb-0">
                      <li className="dropdown notification-list list-inline-item">
                          <div className="dropdown notification-list nav-pro-img">
                              <a className="dropdown-toggle nav-link arrow-none nav-user"
                                 data-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                                 aria-expanded="false">
                                 <button className={'btn btn-sm btn-primary'}>Options..</button>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                 <a className="dropdown-item" href="#" onClick={() => setSelectedOrder(row)}><FontAwesomeIcon icon={faPrint} className={'mr-1'}/>Invoice</a>
                                  <a href="#" className={'dropdown-item'} onClick={() => deleteOrder(row)}><FontAwesomeIcon icon={faTrashCan} className={'mr-1'}/>Delete</a>
                              </div>
                          </div>
                      </li>
                </ul>
            </>
          )
        },
        {
            name: 'Order Code',
            cell: row => (
                <span>{row.orderCode}</span>
            ),
            sortable: true,
        },
        {
            name: 'Order Type',
            cell: row => (
                <span style={{textTransform: 'capitalize'}}>{row.orderType}</span>
            ),
            sortable: true,
        },
        {
            name: 'Order Status',
            cell: row => (
                <span style={{textTransform: 'capitalize'}}>{row.orderStatus}</span>
            ),
            sortable: true,
        },
        {
            name: 'Payment Status',
            cell: row => (
                <span style={{textTransform: 'capitalize'}}>{row.paymentStatus}</span>
            ),
            sortable: true,
        },
        {
            name: 'Payment',
            cell: row => (
                <span style={{textTransform: 'capitalize'}}>{row.paymentMethod}</span>
            ),
            sortable: true,
        },
        {
            name: 'Partial Payment',
            cell: row => (
                row.partialPayment ? <span>Rs. {row.partialPaidAmount}</span> : 'N/A'
            ),
            sortable: true,
        },
        {
            name: 'SubTotal',
            cell: row => (
                <span>Rs. {row.subTotal}</span>
            ),
            sortable: true,
        },
        {
            name: 'Discount',
            cell: row => (
                row.discountValue > 0 ? <span>Rs. {row.discountAmount}</span> : 'N/A'
            ),
            sortable: true,
        },
        {
            name: 'Total',
            cell: row => (
                <span>Rs. {row.total}</span>
            ),
            sortable: true,
        },
        {
            name: 'Paid Amount',
            cell: row => (
                <span>Rs. {row.paidAmount}</span>
            ),
            sortable: true,
        },
        {
            name: 'Change',
            cell: row => (
                <span>Rs. {row.changeAmount}</span>
            ),
            sortable: true,
        },
    ]

    const nextIcon = <FontAwesomeIcon icon={faArrowRight} />;
    const prevIcon = <FontAwesomeIcon icon={faArrowLeft} />;

    const customStyles = {
        headCells: {
          style: {
              background: '#222437',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'uppercase',
              color: 'white'
          }
        },
    }

        const conditionalRowStyles = [
          {
            when: row => row.orderStatus === 'complete' && row.paymentStatus === 'paid',
            style: {
              backgroundColor: 'rgba(69, 235, 27, 0.6)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
            {
            when: row => row.orderStatus === 'complete' && row.paymentStatus === 'partial',
            style: {
              backgroundColor: 'rgba(84,101,238, 0.5)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
            {
            when: row => row.orderStatus === 'hold',
            style: {
              backgroundColor: 'rgba(250,79,123, 0.8)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
            ]

        const componentRef = useRef();
        const handlePrint = useReactToPrint({
            content: () => componentRef.current,
            onAfterPrint: () => setSelectedOrder({})
        });

        const [selectedOrder, setSelectedOrder] = useState({});

        useEffect(() => {
            if(Object.keys(selectedOrder).length !== 0){
                handlePrint();
            }
        }, [selectedOrder])


        const printRef = useRef();
        const handleOrderPrint = useReactToPrint({
            content: () => printRef.current,
        });


    return (
        <>
            {
                Object.keys(selectedOrder).length > 0 ? <Receipt selectedOrder={selectedOrder} ref={componentRef}/> : ''

            }
            <OrderListPrintComponent ref={printRef} orders={orderList}/>
            <DataTable
                title={'Orders List'}
                columns={columns}
                data={searchResults}
                pagination={true}
                paginationPerPage={50}
                paginationRowsPerPageOptions={[50, 100, 150]}
                paginationIconNext={nextIcon}
                paginationIconPrevious={prevIcon}
                responsive={true}
                striped={true}
                highlightOnHover={true}
                pointerOnHover={true}
                persistTableHead={true}
                fixedHeader={true}
                subHeader={true}
                subHeaderComponent={
                <div className="dataTables_filter">
                    <button onClick={handleOrderPrint} style={{position: 'absolute', left: '15px'}} className={'btn btn-primary'}>
                        <FontAwesomeIcon icon={faDownload} className={'mr-1'}/>Download</button>
                    <label>
                        <input type="search"
                               className={'form-control form-control-sm'}
                               placeholder={'Search..'}
                               value={search}
                               onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                </div>
                }
                subHeaderAlign={'right'}
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                expandableRowsComponent={OrderExpandableRow}
            />
        </>
    )
}

export default OrderList;