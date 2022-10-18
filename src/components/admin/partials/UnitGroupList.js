import DataTable, {createTheme} from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import Fuse from "fuse.js";
import UnitGroupAddModal from "./UnitGroupAddModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {notifySuccess, notifyError} from "../../toastNotification";
import {useDispatch} from "react-redux";
import {fetchUnitGroup} from "../../../redux/actions/unitAction";


const UnitGroupList = ({unitGroupList}) => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(unitGroupList)
    }, [unitGroupList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name']
        }

        const fuse = new Fuse(unitGroupList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(unitGroupList);
    }, [search]);


    const deleteUnitGroup = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/unit-group`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...unitGroupList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchUnitGroup(newData))
             }
         }catch (e){
             notifyError('Error encountered')
             console.log(e)
         }
  }

const columns = [
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
    },
    {
        name: 'Description',
        selector: row => row.description,
    },
    {
        name: 'Action',
        cell: row => (
            <>
            <button className={'btn btn-sm btn-primary'}>Edit</button>
            <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteUnitGroup(row)}>Delete</button>
            </>
        )
    }
];



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
            <UnitGroupAddModal unitGroupList={unitGroupList} />
            <DataTable
                title={'Unit Group Lists'}
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
                    <button style={{position: 'absolute', left: '15px'}} className={'btn btn-primary'} data-toggle={'modal'} data-target={'#addUnitGroupModal'}>
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add Unit Group</button>
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
    );
}

export default UnitGroupList;