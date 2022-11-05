import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Fuse from "fuse.js";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faPlusCircle, faPenAlt, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import {notifyError, notifySuccess} from "../../toastNotification";
import {fetchProducts} from "../../../redux/actions/productAction";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import noImage from "../../../images/noImage.jpg";
import TableLoader from "../../loader/TableLoader";


const img = {
    display: 'block',
    width: '80px',
    height: '100%',
    objectFit: 'contain',
    padding: '5px',
    border: '1px dashed black',
};

const ProductList = () => {

    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();

    const products = useSelector((state) => state.products.products)
    const isLoading = useSelector((state) => state.loading.isLoading)

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    useEffect(() => {
        setSearchResults(products)
    }, [products]);


    useEffect(() =>{
        const options = {
          includeScore: true,
          // Search in `author` and in `tags` array
          keys: ['name']
        }
        const fuse = new Fuse(products, options)
        const result = fuse.search(search);
        search ? setSearchResults(result.map((data) => data.item)) : setSearchResults(products);
    }, [search]);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    const deleteProduct = async (data) => {
         try {
             const response = await axiosPrivate.delete(`/admin/delete/${data._id}/product`)
             if(response.status === 200){
                 notifySuccess(response.data.message)
                 const newData = [...products]
                 newData.splice(newData.indexOf(data), 1)
                 dispatch(fetchProducts(newData))
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
                row.thumbnail ? <img
                      src={`data:image/png;base64,${arrayBufferToBase64(row.thumbnail.image.data)}`}
                      style={img}
                      alt={row.name}
                      onLoad={() => { URL.revokeObjectURL(`data:image/png;base64,${arrayBufferToBase64(row.thumbnail.image.data)}`) }}
                    /> : <img src={noImage} style={img} alt=""/>
            ),
            sortable: false,
        },
        {
            name: 'Product Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'SKU',
            cell: row => (
                <span>sku</span>
            ),
            sortable: false,
        },
        {
            name: 'Category',
            selector: row => row.category.name,
            sortable: true,
        },
        {
            name: 'Unit Group',
            selector: row => row.unitGroup.name,
            sortable: true,
        },
        {
            name: 'Unit',
            cell: row => (
                <span>{row.assignedUnit.name} - {row.assignedUnit.identifier}</span>
            ),
            sortable: true,
        },
        {
            name: 'Sale Price',
            cell: row => (
                <span>Rs. {row.salePrice}</span>
            ),
            sortable: true,
        },
        {
            name: 'Low Quantity',
            cell: row => (
                <span>{row.lowQuantity}</span>
            ),
            sortable: true,
        },
        {
            name: 'On Stock',
            cell: row => (
                <span>{row.onStock}</span>
            ),
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <>
                <Link to={`/admin/update/${row._id}/product`}><button className={'btn btn-sm btn-primary'}><FontAwesomeIcon icon={faPenAlt}/></button></Link>
                <button className={'btn btn-sm btn-danger ml-1'} onClick={() => deleteProduct(row)}><FontAwesomeIcon icon={faTrashCan}/></button>
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
                title={'Product List'}
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
                    <Link to={'/admin/create-product'}>
                        <button style={{position: 'absolute', left: '15px'}} className={'btn btn-primary'}>
                        <FontAwesomeIcon icon={faPlusCircle} className={'mr-1'}/>Add New Product</button>
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
                // theme={'solarized'}
                customStyles={customStyles}
                progressPending={isLoading}
			    progressComponent={<TableLoader />}
            />
        </>
    )
}

export default ProductList;