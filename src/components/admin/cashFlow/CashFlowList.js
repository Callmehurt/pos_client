import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faDownload} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useState, useRef} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import { useReactToPrint } from 'react-to-print';
import {CashFlowPrintComponent} from "./CashFlowPrintComponent";
import {Modal} from "react-bootstrap";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {fetchRangedCashFlows} from "../../../redux/actions/cashFlowAction";


const CashFLowList = () => {

    const cashFlowList = useSelector((state) => state.cashFlows.cashFlows);
    const rangedCashFlowList = useSelector((state) => state.cashFlows.rangedCashFlows);

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(cashFlowList)
    }, [cashFlowList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name', 'operation']
        }

        const fuse = new Fuse(cashFlowList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(cashFlowList);
    }, [search]);


     const columns = [
        {
            name: 'Name',
            cell: row => (
                <span>{row.name}</span>
            ),
            sortable: true,
        },
         {
            name: 'Value',
            cell: row => (
                <span>Rs. {row.value}</span>
            ),
            sortable: true,
        },
         {
            name: 'Operation',
            cell: row => (
                row.operation === 'debit' ? <button className={'btn btn-sm'} style={{background: '#F87171', textTransform: 'capitalize', color: 'white'}}>{row.operation}</button> : <button className={'btn btn-sm'} style={{background: '#4ADE80', textTransform: 'capitalize', color: 'white'}}>{row.operation}</button>
            ),
            sortable: true,
        },
         {
            name: 'Date',
            cell: row => (
                moment(row.createdAt).format('LLL')
            ),
            sortable: true,
        },
     ]

     const conditionalRowStyles = [
          {
            when: row => row.operation === 'credit',
            style: {
              backgroundColor: 'rgba(187, 247, 208, 0.8)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
          },
        {
            when: row => row.operation === 'debit',
            style: {
              backgroundColor: 'rgba(254, 202, 202, 0.8)',
              color: 'black',
              '&:hover': {
                cursor: 'pointer',
              },
            },
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

    const componentRef = useRef();
    const [show, setShow] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: moment(Date.now()).format('yyyy-MM-DD'),
        end: moment(Date.now()).format('yyyy-MM-DD')
    })
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforeGetContent: () => {
          setShow(false);
        },
        onAfterPrint: () => {
            dispatch(fetchRangedCashFlows([]))
        }
    });

    const fetchDatedCashFlow = async () => {
        try{
            const res = await axiosPrivate.post('/admin/fetch/cash-flows', dateRange);
            dispatch(fetchRangedCashFlows(res.data));
        }catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(Object.keys(rangedCashFlowList).length > 0){
            handlePrint();
        }
    }, [rangedCashFlowList])


    const onDateChange = (e) => {
        const dates = {...dateRange}
        dates[e.target.name] = e.target.value;
        setDateRange(dates);
    }

    return (
        <>
            <CashFlowPrintComponent cashFlows={rangedCashFlowList} ref={componentRef} />
            <Modal show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
                <Modal.Header>
                   <h5 className="modal-title mt-0">Choose Cash Flow Date Range</h5>
                    <button type="button" className="close" onClick={() => setShow(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>{JSON.stringify(dateRange)}</label>
                        <label>From</label>
                        <label style={{float: 'right', marginRight: '45%'}}>To</label>
                        <div>
                            <div className="input-daterange input-group" id="date-range">
                                <input type="date" className="form-control" name="start" onChange={(e) => onDateChange(e)} value={dateRange.start}/>
                                <input type="date" className="form-control" name="end" onChange={(e) => onDateChange(e)} value={dateRange.end}/>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={fetchDatedCashFlow} className={'btn btn-success'}>Submit</button>
                </Modal.Footer>
            </Modal>
            <DataTable
                title={'Cash Flow List'}
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
            />
        </>
    )
}

export default CashFLowList;