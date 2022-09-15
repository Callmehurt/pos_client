import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import RequireAuth from "./components/RequireAuth";
import {Routes, Route} from 'react-router-dom'


import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/admin/Dashboard";
import StaffDashboard from './components/staff/Dashboard'
import NotFound from "./components/NotFound";
import PersistLogin from "./components/PersistLogin";
import AppLayout from "./components/common/AppLayout";
import './style.css'
import MediaPage from "./components/admin/MediaPage";

function App() {
  return (
    <Routes>
        <Route path={'/'} element={<Layout/>}>

            {/*Protected routes*/}
            <Route element={<PersistLogin/>}>

                <Route path={'/user/login'} element={<Login/>}/>

                <Route element={<RequireAuth allowedRole={'admin'} />}>
                    <Route element={<AppLayout/>}>
                        <Route exact path={'/admin/dashboard'} element={<Dashboard/>} />
                        <Route exact path={'/admin/medias'} element={<MediaPage/>} />
                    </Route>
                </Route>
                <Route element={<RequireAuth allowedRole={'staff'} />}>
                    <Route element={<AppLayout/>}>
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
