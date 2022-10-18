import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
import ProviderAddModal from "./ProviderAddModal";
import {notifyError, notifySuccess} from "../../toastNotification";
import {fetchProviders} from "../../../redux/actions/providerAction";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ProviderEditModal from "./ProviderEditModal";

const ProviderList = () => {

    const providersList = useSelector((state) => state.providersList.providers);


    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(providersList)
    }, [providersList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name']
        }

        const fuse = new Fuse(providersList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(providersList);
    }, [search]);

    const deleteProvider = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/provider`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...providersList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchProviders(newData))
             }
         }catch (e){
             notifyError(e.response.data.message)
             console.log(e)
         }
    }

    const [selectedProvider, setSelectedProvider] = useState({});

    const handleProviderEdit = (providerId) => {
        const provider = providersList.find((data) => data._id === providerId);
        setSelectedProvider(provider);
        setEditShow(true);
    }

    const columns = [
        {
            name: 'Name',
            cell: row => (
                <span>{row.name}</span>
            ),
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Amount Due',
            cell: row => (
                <span>Rs. {row?.amountDue}</span>
            ),
            sortable: true,
        },
        {
            name: 'Amount Paid',
            cell: row => (
                <span>Rs. {row?.amountPaid}</span>
            ),
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                <button className={'btn btn-sm btn-primary'} onClick={() => handleProviderEdit(row._id)}>Edit</button>
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteProvider(row)}>Delete</button>
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
            <ProviderAddModal show={show} setShow={setShow}/>
            <ProviderEditModal show={editShow} setShow={setEditShow} selectedProvider={selectedProvider}/>
            <DataTable
                title={'Providers List'}
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
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add Provider</button>
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

export default ProviderList;