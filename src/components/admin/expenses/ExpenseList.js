import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import {useDispatch, useSelector} from "react-redux";
import ExpenseAddModal from "./ExpenseAddModal";
import {notifyError, notifySuccess} from "../../toastNotification";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {fetchAllExpenses} from "../../../redux/actions/expensesAction";
import ExpenseEditModal from "./ExpenseEditModal";

const ExpenseList = () => {

    const expensesList = useSelector((state) => state.expenses.expenseList);

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(expensesList)
    }, [expensesList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name']
        }

        const fuse = new Fuse(expensesList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(expensesList);
    }, [search]);

    const deleteExpense = async (data) => {
        try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/expense`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...expensesList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchAllExpenses(newData))
             }
         }catch (e){
             notifyError(e.response.data.message)
             console.log(e)
         }
    }

    const [selectedExpense, setSelectedExpense] = useState({});

    const [editShow, setEditShow] = useState(false);

    const handleExpenseEdit = (expense) => {
        setSelectedExpense(expense);
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
            name: 'Value',
            cell: row => (
                <span>Rs. {row.value}</span>
            ),
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                <button className={'btn btn-sm btn-primary'} onClick={() => handleExpenseEdit(row)}>Edit</button>
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteExpense(row)}>Delete</button>
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

    return (
        <>
            <ExpenseAddModal expenses={expensesList} show={show} setShow={setShow}/>
            <ExpenseEditModal expenses={expensesList} show={editShow} setShow={setEditShow} selectedExpense={selectedExpense}/>
            <DataTable
                title={'Expenses List'}
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
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add Expense</button>
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

export default ExpenseList;