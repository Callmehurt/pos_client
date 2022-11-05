import DataTable, {createTheme} from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import Fuse from "fuse.js";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {notifySuccess, notifyError} from "../../toastNotification";
import {useDispatch} from "react-redux";
import noImg from '../../../images/noImage.jpg'


import {fetchCategories} from "../../../redux/actions/categoryAction";
import {Link} from "react-router-dom";


const img = {
    display: 'block',
    width: '80px',
    height: '100%',
    objectFit: 'contain',
    padding: '5px',
    border: '1px dashed black',
};

const CategoryList = ({categoryList}) => {

    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(categoryList)
    }, [categoryList])


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name']
        }

        const fuse = new Fuse(categoryList, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(categoryList);
    }, [search]);


    const deleteCategory= async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/category`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...categoryList]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchCategories(newData))
             }
         }catch (e){
             notifyError('Error encountered')
             console.log(e)
         }
    }


    const columns = [
        {
            name: 'Image',
            cell: row => (
                row.media ? <img
                      src={`data:image/png;base64,${row.media.image}`}
                      style={img}
                      alt={'category image'}
                      onLoad={() => { URL.revokeObjectURL(`data:image/png;base64,${row.media.image}`) }}
                    /> : <img src={noImg} style={img} alt=""/>
            ),
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Parent',
            selector: row => row.parent? row.parent.name : 'No Parent',
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                <Link to={`/admin/update/${row._id}/category`}><button className={'btn btn-sm btn-primary'}>Edit</button></Link>
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteCategory(row)}>Delete</button>
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
            <DataTable
                title={'Category Lists'}
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
                    <Link to={'/admin/create-product-categories'}>
                        <button style={{position: 'absolute', left: '15px'}} className={'btn btn-primary'}>
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add Category</button>
                    </Link>
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

export default CategoryList;