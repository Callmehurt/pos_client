import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import RequireAuth from "./components/RequireAuth";
import {Routes, Route} from 'react-router-dom'

import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/admin/Dashboard";
import StaffDashboard from './components/staff/PosMain'
import NotFound from "./components/NotFound";
import PersistLogin from "./components/PersistLogin";
import AppLayout from "./components/common/AppLayout";
import MediaPage from "./components/admin/MediaPage";
import Units from "./components/admin/Units";
import UnitGroup from "./components/admin/UnitGroup";
import Category from "./components/admin/Category";
import CreateCategory from "./components/admin/partials/CreateCategory";
import UpdateCategory from "./components/admin/partials/UpdateCategory";
import Products from "./components/admin/Products";
import CreateProduct from "./components/admin/products/CreateProduct";
import UpdateProduct from "./components/admin/products/UpdateProduct";
import StockManagement from "./components/admin/StockManagement";
import StockFlowRecords from "./components/admin/StockFlowRecords";
import Procurement from "./components/admin/procurement/Procurement";
import Providers from "./components/admin/Providers";
import CreateProcurement from "./components/admin/procurement/CreateProcurement";
import EditProcurement from "./components/admin/procurement/EditProcurement";
import StaffAppLayout from "./components/common/StaffAppLayout";
import Staffs from "./components/admin/Staffs";
import Tables from "./components/admin/Tables";
import CashFlow from "./components/admin/CashFlow";

function App() {
  return (
    <Routes>
        <Route path={'/'} element={<Layout/>}>

            {/*Protected routes*/}
            <Route element={<PersistLogin/>}>

                <Route path={'/user/login'} element={<Login/>}/>

                {/*Admin routes*/}
                <Route element={<RequireAuth allowedRole={'admin'} />}>
                    <Route element={<AppLayout/>}>
                        <Route exact path={'/admin/dashboard'} element={<Dashboard/>} />

                        <Route exact path={'/admin/medias'} element={<MediaPage/>} />

                        <Route exact path={'/admin/unit-group'} element={<UnitGroup/>} />

                        <Route exact path={'/admin/units'} element={<Units/>} />

                        <Route exact path={'/admin/product-categories'} element={<Category/>} />
                        <Route exact path={'/admin/create-product-categories'} element={<CreateCategory/>} />
                        <Route exact path={'/admin/update/:categoryId/category'} element={<UpdateCategory/>} />

                        <Route exact path={'/admin/products'} element={<Products/>} />
                        <Route exact path={'/admin/create-product'} element={<CreateProduct/>} />
                        <Route exact path={'/admin/update/:productId/product'} element={<UpdateProduct/>} />

                        <Route exact path={'/admin/stock-management'} element={<StockManagement/>} />
                        <Route exact path={'/admin/stock-flow-history'} element={<StockFlowRecords/>} />


                        <Route exact path={'/admin/providers'} element={<Providers/>} />


                        <Route exact path={'/admin/procurements'} element={<Procurement/>} />
                        <Route exact path={'/admin/create-procurement'} element={<CreateProcurement/>} />
                        <Route exact path={'/admin/edit/:procurementId/procurement'} element={<EditProcurement/>} />


                        <Route exact path={'/admin/cash-flows'} element={<CashFlow/>} />


                        <Route exact path={'/admin/table-list'} element={<Tables/>} />


                        <Route exact path={'/admin/staff-list'} element={<Staffs/>} />
                    </Route>
                </Route>

                {/*Staff routes*/}
                <Route element={<RequireAuth allowedRole={'staff'} />}>
                    <Route element={<StaffAppLayout/>}>
                        <Route exact path={'/staff/dashboard'} element={<StaffDashboard/>} />
                    </Route>
                </Route>
            </Route>
            <Route path={'*'} element={<NotFound/>} />
        </Route>
    </Routes>
  );
}

export default App;
