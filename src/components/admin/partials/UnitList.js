import DataTable, {createTheme} from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState, useRef} from "react";
import Fuse from "fuse.js";
import UnitAddModal from "./UnitAddModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {useDispatch, useSelector} from "react-redux";
import {fetchAllUnits, fetchUnitGroup} from "../../../redux/actions/unitAction";
import {notifyError, notifySuccess} from "../../toastNotification";
import UnitEditModal from "./UnitEditModal";


const UnitList = () => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const unitGroup = useSelector((state) => state.units.unitGroup);
    const unitList = useSelector((state) => state.units.units);


    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [selectedRow, setSelectedRow] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (data) => {
        setSelectedRow(data);
        setShow(true)
    };




    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name', 'identifier', 'unitGroup']
        }

        const fuse = new Fuse(unitList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(unitList);
    }, [search])

    useEffect(() => {
        setSearchResults(unitList);
    }, [unitList])

    const effectRun = useRef(false);
    useEffect(() => {
        const abortController = new AbortController();
        const getUnitGroup = async () => {
            try {
                const response = await axiosPrivate.get('/admin/fetch/unit-group', {
                signal: abortController.signal
                });
                dispatch(fetchUnitGroup(response.data));
                return response.data;
            }catch (e) {
                console.log(e)
            }
        }
        if (effectRun.current) {
            getUnitGroup();
        }
        return () => {
            effectRun.current = true;
            abortController.abort();
        }
    }, []);


    const deleteUnit = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/unit`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...unitList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchAllUnits(newData))
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
            name: 'Identifier',
            selector: row => row.identifier,
        },
        {
            name: 'Value',
            selector: row => row.value,
        },
        {
            name: 'Unit Group',
            selector: row => row.unitGroup.name,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                <button className={'btn btn-sm btn-primary'} onClick={() => handleShow(row)}>Edit</button>
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteUnit(row)}>Delete</button>
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
            <UnitEditModal show={show} handleClose={handleClose} selectedRow={selectedRow} unitList={unitList} unitGroupList={unitGroup}/>
            <UnitAddModal unitGroupList={unitGroup} unitList={unitList}/>
            <DataTable
                title={'Unit Lists'}
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
                    <button style={{position: 'absolute', left: '15px'}} className={'btn btn-primary'} data-toggle={'modal'} data-target={'#addUnitModal'}>
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add Unit</button>
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

export default UnitList;