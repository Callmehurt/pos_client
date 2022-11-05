import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import DataTable, {createTheme} from "react-data-table-component";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {fetchStockRecord} from "../../../redux/actions/stockFlowAction";
import TableLoader from "../../loader/TableLoader";
import moment from 'moment'
import ExpandableRow from "./ExpandableRow";


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

const StockFlowRecordList = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const stockFLowRecords = useSelector((state) => state.stockFlowRecords.stockFlows);
    const isLoading = useSelector((state) => state.loading.isLoading);

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setSearchResults(stockFLowRecords)
    }, [stockFLowRecords]);


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['product.name', 'operationType']
        }
        const fuse = new Fuse(stockFLowRecords, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(stockFLowRecords);
    }, [search]);


     const deleteStockRecord = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/stock-flow`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...stockFLowRecords]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchStockRecord(newData))
             }
         }catch (e){
             notifyError(e.response.data.message)
         }
  }


    const columns = [
        {
            name: 'Product',
            selector: row => row.product.name,
            sortable: true,
        },
        {
            name: 'Procurement',
            selector: row => row.procurement ? row.procurement.name : 'N/A',
            sortable: true,
        },
        {
            name: 'Order',
            selector: row => row.order ? row.order : 'N/A',
            sortable: true,
        },
        {
            name: 'Operation Type',
            cell: row => (
                <span style={{textTransform: 'capitalize'}}>{row.operationType}</span>
            ),
            sortable: true,
        },
        {
            name: 'Unit',
            selector: row => <span>{row.product.assignedUnit.name} - {row.product.assignedUnit.identifier}</span>,
            sortable: true,
        },
        {
            name: 'Initial Quantity',
            selector: row => (
                row.stockManagement ? row.initialQuantity : 'N/A'
            ),
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: 'New Quantity',
            selector: row => (
                row.stockManagement ? row.newQuantity : 'N/A'
            ),
            sortable: true,
        },
        {
            name: 'Total price',
            selector: row => <span>Rs. {row.amount}</span>,
            sortable: true,
        },
        {
            name: 'Prompt Date',
            selector: row => <span>{moment(row.createdAt).format('LLL')}</span>,
            sortable: true,
        },

        {
            name: 'Action',
            cell: row => (
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteStockRecord(row)}><FontAwesomeIcon icon={faTrashCan}/></button>
            ),
            sortable: true,
        },
        ];

    const conditionalRowStyles = [
          {
            when: row => row.operationType === 'add',
            style: {
              backgroundColor: 'rgba(69, 235, 27, 0.6)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
        {
            when: row => row.operationType === 'deduct',
            style: {
              backgroundColor: 'rgba(255, 30, 75, 0.6)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
        {
            when: row => row.operationType === 'defective',
            style: {
              backgroundColor: 'rgba(27, 235, 193, 0.6)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
        {
            when: row => row.operationType === 'lost',
            style: {
              backgroundColor: 'rgba(235, 200, 63, 0.6)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
    ]
    const nextIcon = <FontAwesomeIcon icon={faArrowRight} />;
    const prevIcon = <FontAwesomeIcon icon={faArrowLeft} />;


    return (
        <>
        <DataTable
                title={'Stock Flow History'}
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
                fixedHeader={false}
                subHeader={true}
                subHeaderComponent={
                <div className="dataTables_filter">
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
                progressPending={isLoading}
			    progressComponent={<TableLoader />}
                conditionalRowStyles={conditionalRowStyles}
                expandableRows
                expandableRowsComponent={ExpandableRow}
            />
        </>
    )
}

export default StockFlowRecordList;