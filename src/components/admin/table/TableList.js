import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
// import ProviderAddModal from "./ProviderAddModal";
import {notifyError, notifySuccess} from "../../toastNotification";
import {fetchProviders} from "../../../redux/actions/providerAction";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TableAddModal from "./TableAddModal";
import TableLoader from "../../loader/TableLoader";
import {fetchAvailableTables} from "../../../redux/actions/tableAction";
import TableEditModal from "./TableEditModal";
// import ProviderEditModal from "./ProviderEditModal";

const TableList = () => {

    const tableList = useSelector((state) => state.tables.availableTables);

    const isLoading = useSelector((state) => state.loading.isLoading);

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(tableList)
    }, [tableList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['tableNumber']
        }

        const fuse = new Fuse(tableList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(tableList);
    }, [search]);

    const deleteTable = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/table`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...tableList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchAvailableTables(newData))
             }
         }catch (e){
             notifyError(e.response.data.message)
             console.log(e)
         }
    }

    const [selectedTable, setSelectedTable] = useState({});

    const handleTableEdit = (tableId) => {
        const table = tableList.find((data) => data._id === tableId);
        setSelectedTable(table);
        setEditShow(true);
    }

    const columns = [
        {
            name: 'Table No.',
            cell: row => (
                <span>{row.tableNumber}</span>
            ),
            sortable: true,
        },
        {
            name: 'Available Space',
            selector: row => row.tableSpace,
            sortable: true,
        },
        {
            name: 'status',
            selector: row => <span style={{textTransform: 'capitalize'}}>{row.status}</span>,
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                <button className={'btn btn-sm btn-primary'} onClick={() => handleTableEdit(row._id)}>Edit</button>
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteTable(row)}>Delete</button>
                </>
            )
        }
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

    const [show,setShow] = useState(false);
    const [editShow, setEditShow] = useState(false);

    return (
        <>
            <TableAddModal show={show} setShow={setShow} />
            <TableEditModal show={editShow} setShow={setEditShow} selectedTable={selectedTable}/>
            <DataTable
                title={'Available Tables List'}
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
                    <button onClick={() => setShow(true)} style={{position: 'absolute', left: '15px'}} className={'btn btn-primary'}>
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add New Table</button>
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
            />
        </>
    )
}

export default TableList;