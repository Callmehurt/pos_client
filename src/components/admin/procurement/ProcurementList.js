import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
// import ProviderAddModal from "./ProviderAddModal";
// import {notifyError, notifySuccess} from "../../toastNotification";
// import {fetchProviders} from "../../../redux/actions/providerAction";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
// import ProviderEditModal from "./ProviderEditModal";

const ProcurementList = () => {

    const procurementList = useSelector((state) => state.procurements.procurementList);


    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(procurementList)
    }, [procurementList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name', 'provider.name']
        }

        const fuse = new Fuse(procurementList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(procurementList);
    }, [search]);

    // const deleteProvider = async (data) => {
    //      try {
    //          const response = await axiosPrivate.delete(`/admin/delete/${data._id}/provider`)
    //          if(response.status === 200){
    //              notifySuccess(response.data.message)
    //              const newData = [...procurementList]
    //              newData.splice(newData.indexOf(data), 1)
    //              dispatch(fetchProviders(newData))
    //          }
    //      }catch (e){
    //          notifyError(e.response.data.message)
    //          console.log(e)
    //      }
    // }

    // const [selectedProvider, setSelectedProvider] = useState({});

    // const handleProviderEdit = (providerId) => {
    //     const provider = providersList.find((data) => data._id === providerId);
    //     setSelectedProvider(provider);
    //     setEditShow(true);
    // }

    const columns = [
        {
            name: 'Name',
            cell: row => (
                <span>{row.name}</span>
            ),
            sortable: true,
        },
        {
            name: 'Provider',
            selector: row => row.provider.name,
            sortable: true,
        },
        {
            name: 'Delivery Status',
            selector: row => <span style={{textTransform: 'capitalize'}}>{row.deliveryStatus}</span>,
            sortable: true,
        },
        {
            name: 'Payment Status',
            selector: row => <span style={{textTransform: 'capitalize'}}>{row.paymentStatus}</span>,
            sortable: true,
        },
        {
            name: 'Invoice Date',
            cell: row => (
                <span>{row.invoiceDate}</span>
            ),
            sortable: true,
        },
        {
            name: 'Sale Value',
            cell: row => (
                <span>Rs. {row?.saleValue}</span>
            ),
            sortable: true,
        },
        {
            name: 'Purchase Value',
            cell: row => (
                <span>Rs. {row?.purchaseValue}</span>
            ),
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                {/*<button className={'btn btn-sm btn-primary'} onClick={() => handleProviderEdit(row._id)}>Edit</button>*/}
                {/*<button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteProvider(row)}>Delete</button>*/}
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

    const [editShow, setEditShow] = useState(false);

    return (
        <>
            {/*<ProviderEditModal show={editShow} setShow={setEditShow} selectedProvider={selectedProvider}/>*/}
            <DataTable
                title={'Procurements List'}
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
            />
        </>
    )
}

export default ProcurementList;