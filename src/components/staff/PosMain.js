import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUtensils, faTrash, faMagnifyingGlass, faDollarSign, faPause, faPercentage, faTrashCan, faAngleRight, faLock} from "@fortawesome/free-solid-svg-icons";
import {faEraser} from "@fortawesome/free-solid-svg-icons";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Numpad from "./numpad/Numpad";
import ProductSearchModal from "./components/ProductSearchModal";
import DiscountNumpad from "./numpad/DiscountNumpad";
import noImage from "../../images/noImage.jpg";
import OnSelectNumpad from "./numpad/OnSelectNumpad";
import {notifyError, notifySuccess} from "../toastNotification";
import OrderStepModal from "./order/orderCreationSteps/OrderStepModal";
import OrderPaymentModal from "./order/orderCreationSteps/OrderPaymentModal";
import OrderListModal from "./order/OrderListModal";
import Loader from "../loader/Loader";
import useLogout from "../../hooks/useLogout";
import {useNavigate} from "react-router-dom";
const PosMain = () => {

    const axiosPrivate = useAxiosPrivate();

    const [showOrders, setShowOrders] = useState(false)

    const [isLoading, setIsLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [activeCategories, setActiveCategories] = useState([]);
    const [discountDetail, setDiscountDetail] = useState({
        discountType: 'percentage',
        discountValue: '0',
        discountAmount: '0',

    })
    const [calculation, setCalculation] = useState({
        products: [],
        discountType: 'percentage',
        discountValue: '0',
        discountAmount: '0',
        subTotal: '0',
        total: '0',
        table: '',
        orderType: 'inhouse',
        paymentStatus: 'unpaid',
        orderStatus: '',
        reference: '',
        paidAmount: '0',
        changeAmount: '0',
        paymentMethod: 'cash',
        partialPayment: false,
        partialPaidAmount: '0',
        calculationType: 'new',
        orderId: ''
    });
    const [currentSelectedProduct, setCurrentSelectedProduct] = useState({
        productId: '',
        productName: '',
        assignedUnit: '',
        salePrice: '',
        quantity: '',
        total: ''
    });
    const [showOrderStep, setShowOrderStep] = useState(false)
    const [orderStep, setOrderStep] = useState({
        step: 1
    });
    const [paymentModal, setPaymentModal] = useState(false);
    const [show, setShow] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [discountNumShow, setDiscountNumShow] = useState(false);
    const [categories, setCategories] = useState([]);


    const removeProduct = (product) => {
        const newProducts = [...selectedProducts]
        newProducts.splice(newProducts.indexOf(product), 1);
        setSelectedProducts(newProducts);
    }

    const [currentSelected, setCurrentSelected] = useState({});

    const handleNumpad = (data) => {
        setCurrentSelected(data);
        setShow(true)
    }

    const handleQuantityChange = (changedQuantity) => {
        const newCurrent = {...currentSelected};
        const newProducts = [...selectedProducts]
        const product = selectedProducts.find((ptd) => ptd.productId === newCurrent.productId);

        if(parseInt(changedQuantity) === 0){
            newProducts.splice(newProducts.indexOf(product), 1);
            setSelectedProducts(newProducts);
        }else {
            newCurrent['quantity'] = changedQuantity;
            newCurrent['total'] = parseInt(changedQuantity)*parseInt(newCurrent.salePrice);
            newProducts[selectedProducts.indexOf(product)] = newCurrent;
            setSelectedProducts(newProducts);
        }
    }

    const calculateFinalPrice = () => {
        const newCalculation = {...calculation};
        const totalPrice = selectedProducts.reduce((total, obj) => total + parseInt(obj.total), 0);
        newCalculation['products'] = selectedProducts;
        newCalculation['subTotal'] = totalPrice;
        newCalculation['total'] = totalPrice-parseInt(discountDetail.discountAmount);
        setCalculation(newCalculation);
    }

    const handleDiscount = (discountValue) => {
        const newDiscount = {...discountDetail};
        if(discountDetail.discountType === 'percentage'){
            const total = parseInt(calculation.subTotal);
            const discount = 0.01*total*discountValue;
            newDiscount['discountValue'] = discountValue;
            newDiscount['discountAmount'] = parseInt(discount);
            setDiscountDetail(newDiscount);
        }else {
            newDiscount['discountValue'] = discountValue;
            newDiscount['discountAmount'] = discountValue;
            setDiscountDetail(newDiscount);
        }
        const newCalculation = {...calculation};
        const totalPrice = selectedProducts.reduce((total, obj) => total + parseInt(obj.total), 0);
        newCalculation['total'] = totalPrice-parseInt(newDiscount.discountAmount);
        newCalculation['discountAmount'] = newDiscount.discountAmount;
        newCalculation['discountValue'] = newDiscount.discountValue;
        newCalculation['discountType'] = newDiscount.discountType;
        setCalculation(newCalculation);
    }


    useEffect(() => {
        calculateFinalPrice();
    }, [selectedProducts]);


    useEffect(() => {
        const fetchCategories = async () => {
            try{
                setIsLoading(true)
                const res = await axiosPrivate.get('/admin/fetch/categories');
                const final = res.data.filter((data) => data.parent === null);
                setCategories(final);
            }catch (e) {
                console.log(e);
            }finally {
                setIsLoading(false)
            }
        }

        fetchCategories();
    }, [])


    const selectCategory = async (cat) => {
        const categories = await fetchChildCategories(cat._id);
        const products = await fetchProducts(cat._id);
        setCategories(categories);
        setAvailableProducts(products)
        makeActiveCategories(cat);
    }

    const makeActiveCategories = (cat) => {
        const newList = [...activeCategories];
        const obj = cat;
        if(Object.keys(newList).length > 1){
            const newData = newList.slice(0, -1);
            const existedRecord = newData.find((data) => data.name === obj.name);
            const index = newData.indexOf(existedRecord);

            if(index === 0){
                setActiveCategories([obj])
            }else {
                newData.push(obj)
                setActiveCategories(newData)
            }
        }else {

            const existedRecord = newList.find((data) => data.name === obj.name);
            const index = newList.indexOf(existedRecord);

            if(index !== 0){
                newList.push(obj);
                setActiveCategories(newList)
            }

        }
    }

    const setInitialCategories = async () => {
        try {
            setIsLoading(true)
             const res = await axiosPrivate.get('/admin/fetch/categories');
             const final = res.data.filter((data) => data.parent === null);
             setCategories(final);
             setActiveCategories([]);
             setAvailableProducts([]);
        }catch (e) {
            notifyError(e.response.data.message);
        }finally {
            setIsLoading(false)
        }
    }

    const fetchChildCategories = async (id) => {
        try{
            setIsLoading(true);
            const res = await axiosPrivate.get(`/admin/fetch/child/${id}/category`);
            return res.data;
        }catch (e) {
            notifyError(e.response.data.message);
            return null;
        }finally {
            setIsLoading(false)
        }
    }

      const fetchProducts= async (id) => {
        const res = await axiosPrivate.get(`/admin/fetch/${id}/products`);
        return res.data
    }


    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        let bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    const [numpadShow, setNumpadShow] = useState(false);

    const chooseProduct = (product) => {
        const newCurrent = {...currentSelectedProduct};
        newCurrent['productId'] = product._id;
        newCurrent['productName'] = product.name;
        newCurrent['assignedUnit'] = product.assignedUnit.name;
        newCurrent['salePrice'] = product.salePrice;
        setNumpadShow(true);
        setCurrentSelectedProduct(newCurrent);
    }

    const resetPos = () => {
        setSelectedProducts([]);
        setCalculation({
            products: [],
            discountType: 'percentage',
            discountValue: '0',
            discountAmount: '0',
            subTotal: '0',
            total: '0',
            table: '',
            orderType: 'inhouse',
            paymentStatus: 'unpaid',
            orderStatus: '',
            reference: '',
            paidAmount: '0',
            changeAmount: '0',
            paymentMethod: 'cash',
            partialPayment: false,
            partialPaidAmount: '0',
            calculationType: 'new',
            orderId: ''
        });
        setDiscountDetail({
            discountType: 'percentage',
            discountValue: '0',
            discountAmount: '0',

        });
        setShowOrderStep(false);
        setOrderStep({step: 1});
    }


    const processOrder = (orderStatus) => {
        if(Object.keys(selectedProducts).length < 1){
            notifyError('Please select some products');
            return null;
        }
        const newRecord = {...calculation};
        newRecord['orderStatus'] = orderStatus;
        setCalculation(newRecord);
        setShowOrderStep(true);
    }

    const setupNewOrder = async () => {
        try{
            const res = await axiosPrivate.post('/setup/order', calculation);
            if(res.status === 200){
                notifySuccess(res.data.message);
                resetPos();
            }else {
                notifyError('Error encountered')
            }
        }catch (e) {
            notifyError(e.response.data.message)
        }
    }

    const orderTypeChange = (type) => {
        const newRecord = {...calculation};
        newRecord['orderType'] = type;
        setCalculation(newRecord);
    }



    // proceed to the next step
    const nextStep = () => {
      const { step } = orderStep;
      setOrderStep({ step: step + 1 });
    }

    const prevStep = () => {
      const { step } = orderStep;
      setOrderStep({ step: step - 1 });
    }



    const [orderList, setOrderList] = useState([]);
    const [orderType, setOrderType] = useState('hold');
    const [isFetchingOrders, setIsFetchingOrders] = useState(false);


    const handleOrderListShow = async () => {
        setShowOrders(true);
    }

    const effectRun = useRef(false);
    useEffect( () => {
        const abortController = new AbortController();
        const fetchOrders = async () => {
            try{
                setIsFetchingOrders(true);
                const res = await axiosPrivate.get(`/fetch/orders?orderType=${orderType}`, {
                    signal: abortController.signal
                });
                setOrderList(res.data);
            }catch (e) {
                console.log(e)
            }finally {
                setIsFetchingOrders(false);
            }
        }

        if(effectRun.current && showOrders){
            fetchOrders();
        }

        return () => {
            effectRun.current = true;
            abortController.abort();
        }
    }, [orderType, showOrders]);

    const openCalculation = (record) => {
        const newCalculation = {...calculation};
        newCalculation.changeAmount = record.changeAmount;
        newCalculation.discountAmount = record.discountAmount;
        newCalculation.discountType = record.discountType;
        newCalculation.discountValue = record.discountValue;
        newCalculation.orderStatus = record.orderStatus;
        newCalculation.orderType = record.orderType;
        newCalculation.paidAmount = record.paidAmount;
        newCalculation.partialPayment = record.partialPayment;
        newCalculation.partialPaidAmount = record.partialPaidAmount;
        newCalculation.paymentMethod = record?.paymentMethod;
        newCalculation.paymentStatus = record.paymentStatus;
        newCalculation.products = record.products;
        newCalculation.reference = record.reference;
        newCalculation.subTotal = record.subTotal;
        newCalculation.total = record.total;
        newCalculation.calculationType = 'old';
        newCalculation.orderId = record._id;

        setCalculation(newCalculation);

        setSelectedProducts(record.products);

        const newDiscount = {...discountDetail};
        newDiscount.discountValue = record.discountValue;
        newDiscount.discountType = record.discountType;
        newDiscount.discountAmount = record.discountAmount;
        setDiscountDetail(newDiscount);

        setShowOrders(false)
    }


    const voidOrder = async () => {
        if(calculation.calculationType === 'new'){
            notifyError('Unable to process');
            return null
        }

        const res = await axiosPrivate.delete(`/delete/${calculation.orderId}/order`);
        if(res.status === 200){
            resetPos();
            notifySuccess(res.data.message)
        }
    }


    const logout = useLogout();
    const navigate = useNavigate();

     const signOut = async () => {
        await logout();
        navigate('/user/login')
    }

  return (
      <>
          <OrderListModal
              show={showOrders}
              setShow={setShowOrders}
              orderType={orderType}
              setOrderType={setOrderType}
              isFetchingOrders={isFetchingOrders}
              orderList={orderList}
              openCalculation={openCalculation}
          />
          <OrderPaymentModal
              show={paymentModal}
              setShow={setPaymentModal}
              calculation={calculation}
              setCalculation={setCalculation}
              resetPos={resetPos}
          />
          <OrderStepModal amount={calculation.total}
                          nextStep={nextStep}
                          prevStep={prevStep}
                          orderTypeChange={orderTypeChange}
                          orderType={calculation.orderType}
                          show={showOrderStep}
                          setShow={setShowOrderStep}
                          step={orderStep.step}
                          calculation={calculation}
                          setCalculation={setCalculation}
                          setupNewOrder={setupNewOrder}
                          setPaymentModal={setPaymentModal}
          />
          <OnSelectNumpad
               show={numpadShow}
               setShow={setNumpadShow}
               currentSelected={currentSelectedProduct}
               selectedProducts={selectedProducts}
               setSelectedProducts={setSelectedProducts}
          />
          <DiscountNumpad show={discountNumShow} setShow={setDiscountNumShow} discountDetail={discountDetail} setDiscountDetail={setDiscountDetail} handleDiscount={handleDiscount}/>
          <Numpad show={show} setShow={setShow} currentSelected={currentSelected} handleQuantityChange={handleQuantityChange}/>
          <ProductSearchModal
              show={searchModal}
              setShow={setSearchModal}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
          />
          <div className="pos-wrapper">
              <div className={'header-area'}>
                  <button onClick={() => handleOrderListShow()} className={'btn btn-primary'}><FontAwesomeIcon icon={faUtensils} className={'mr-1'}/>Orders</button>
                  <button className={'btn btn-danger ml-3'} onClick={() => resetPos()}><FontAwesomeIcon icon={faEraser} className={'mr-1'}/>Reset</button>
                  <button className={'btn btn-danger ml-3'} onClick={() => signOut()}><FontAwesomeIcon icon={faLock} className={'mr-1'}/>Logout</button>
              </div>
              <div className="pos-area">
                  <div className="calculationArea">
                      <div style={{height: '83%', overflowY: 'auto'}}>
                          <table className={'table table-bordered'}>
                              <thead>
                              <tr>
                                  <th style={{minWidth: '120px'}}>Product</th>
                                  <th style={{maxWidth: '50px'}}>Quantity</th>
                                  <th style={{maxWidth: '50px'}}>Price</th>
                                  <th style={{maxWidth: '50px'}}>Total</th>
                              </tr>
                              </thead>
                              <tbody>
                              {
                                  Object.keys(selectedProducts).length > 0 ? (
                                      <>
                                          {
                                              selectedProducts.map((data) => {
                                                  return (
                                                      <tr key={data.productId}>
                                                          <td>
                                                              <span style={{fontWeight: '600'}}>{data.productName} - {data.assignedUnit}</span>
                                                              <button onClick={() => removeProduct(data)} className={'float-right'} style={{background: 'none', border: 'none'}}><FontAwesomeIcon style={{color: '#F87171', fontSize: '16px'}} icon={faTrash}/></button>
                                                          </td>
                                                          <td className={'qtyRow'} onClick={() => handleNumpad(data)} style={{cursor: 'pointer'}}>
                                                              {data.quantity}
                                                          </td>
                                                          <td>Rs. {data.salePrice}</td>
                                                          <td>Rs. {data.total}</td>
                                                      </tr>
                                                  )
                                              })
                                          }
                                      </>
                                  ): null
                              }
                              </tbody>
                          </table>
                      </div>
                      <div className="recentCalculation">
                          <table className={'table table-bordered calculationTable'}>
                              <tbody>
                              <tr>
                                  <td>{calculation.partialPayment ? `Partial Payment Received: Rs. ${calculation.partialPaidAmount}` : calculation.reference}</td>
                                  <td>Sub-Total : Rs. {calculation.subTotal}</td>
                                  <td>Discount: Rs. {calculation.discountAmount}</td>
                              </tr>
                              <tr>
                                  <td>Type: <span style={{textTransform: 'capitalize'}}>{calculation.orderType}</span></td>
                                  <td>Total</td>
                                  <td>Rs. {calculation.partialPayment ? parseInt(calculation.total) - parseInt(calculation.partialPaidAmount) : calculation.total}</td>
                              </tr>
                              </tbody>
                          </table>
                          <div className="calculation-action-area">
                              <div className="child">
                                  <button onClick={() => processOrder('complete')}><span><FontAwesomeIcon icon={faDollarSign} className={'mr-1'}/>Pay</span></button>
                              </div>
                              <div className="child">
                                  <button onClick={() => processOrder('hold')}><span><FontAwesomeIcon icon={faPause} className={'mr-1'}/>Hold</span></button>
                              </div>
                              <div className="child">
                                  <button onClick={() => setDiscountNumShow(true)}><span><FontAwesomeIcon icon={faPercentage} className={'mr-1'}/>Discount</span></button>
                              </div>
                              <div className="child">
                                  <button onClick={() => voidOrder()}><span><FontAwesomeIcon icon={faTrashCan} className={'mr-1'}/>Void</span></button>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="productArea">
                      <div className={'searchArea'}>
                          <button onClick={() => setSearchModal(true)}><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                      </div>
                      <div className="product-filter-area">
                          <ul style={{paddingLeft: '5px'}}>
                              <li onClick={() => setInitialCategories()}>
                                  <span style={{cursor: 'pointer'}}>Home<FontAwesomeIcon style={{marginLeft: '4px'}} icon={faAngleRight}/></span>
                              </li>
                              {
                                  activeCategories.map((cat) => {
                                      return (
                                          <li key={cat._id} onClick={() => selectCategory(cat)}>
                                              <span style={{cursor: 'pointer'}}>{cat.name}<FontAwesomeIcon style={{marginLeft: '4px'}} icon={faAngleRight}/></span>
                                          </li>
                                      )
                                  })
                              }
                          </ul>
                      </div>
                      <div className="category-list">
                          {
                              categories.map((cat) => {
                                  return (
                                      <div className="category" key={cat._id} onClick={() => selectCategory(cat)}>
                                          {
                                              cat.media?.image ? <img src={`data:image/png;base64,${cat.media.image}`} alt=""/> :
                                                  <img src={noImage} alt=""/>
                                          }
                                          <div>
                                              <h4>{cat.name}</h4>
                                          </div>
                                      </div>
                                  )
                              })
                          }
                      </div>
                      {
                          isLoading ? (
                              <div className={'loader-area'}>
                                  <Loader/>
                              </div>
                          ): (
                              <div className="product-list">
                                  {
                                      availableProducts.map((product) => {
                                          return (
                                              <div className="category" key={product._id} onClick={() => chooseProduct(product)} >
                                                  {
                                                      product?.thumbnail ? (
                                                          <img src={`data:image/png;base64,${arrayBufferToBase64(product.thumbnail.image.data)}`} alt={product.name}/>
                                                      ):
                                                          <img src={noImage} alt=""/>
                                                  }
                                                  <div>
                                                      <h4>{product.name} <br/>Rs. {product.salePrice}</h4>
                                                  </div>
                                              </div>
                                          )
                                      })
                                  }
                              </div>
                          )
                      }
                  </div>
              </div>
          </div>
      </>
  )
}
export default PosMain;