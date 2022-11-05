import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TableLoader from "../../loader/TableLoader";
import {fetchProcurements} from "../../../redux/actions/procurementAction";

const ProcurementList = () => {

    const procurementList = useSelector((state) => state.procurements.procurementList);


    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setIsLoading(false)
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

    const deleteProcurement = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/procurement`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...procurementList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchProcurements(newData))
             }
         }catch (e){
             notifyError(e.response.data.message)
             console.log(e)
         }
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
                    <ul className="navbar-right ml-auto list-inline float-right mb-0">

                                  <li className="dropdown notification-list list-inline-item">
                                      <div className="dropdown notification-list nav-pro-img">
                                          <a className="dropdown-toggle nav-link arrow-none nav-user"
                                             data-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                                             aria-expanded="false">
                                             <button className={'btn btn-sm btn-primary'}>Options..</button>
                                          </a>
                                          <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                              {
                                                  row.deliveryStatus === 'pending' ? (
                                                      <Link to={`/admin/edit/${row._id}/procurement`} className="dropdown-item" href="#">Edit</Link>
                                                  ) : ''
                                              }
                                              <a className="dropdown-item" href="#">Invoice</a>
                                              <a className="dropdown-item" href="#" onClick={() => deleteProcurement(row)}>Delete</a>
                                          </div>
                                      </div>
                                  </li>
                    </ul>
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

    return (
        <>
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
                progressPending={isLoading}
			    progressComponent={<TableLoader />}
                customStyles={customStyles}
            />
        </>
    )
}

export default ProcurementList;