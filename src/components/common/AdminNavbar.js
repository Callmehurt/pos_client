import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDashboard, faPhotoFilm, faBoxesStacked, faDolly, faPerson, faCalculator, faListOl} from "@fortawesome/free-solid-svg-icons";

const AdminNavbar = ({userDetail}) => {
    return (
        <div id="navigation">
          <ul className="navigation-menu">
              <li className="has-submenu">
                  <Link to={`/${userDetail.role}/dashboard`}><FontAwesomeIcon icon={faDashboard} className={'mr-1'} /> Dashboard</Link>
              </li>
              <li className="has-submenu">
                  <Link to={`/${userDetail.role}/medias`}><FontAwesomeIcon icon={faPhotoFilm} className={'mr-1'} /> Medias</Link>
              </li>
              <li className="has-submenu">
                  <Link to={`/admin/providers`}><FontAwesomeIcon icon={faPerson} className={'mr-1'} /> Providers</Link>
              </li>
              <li className="has-submenu">
                  <Link to={`/admin/order-list`}><FontAwesomeIcon icon={faListOl} className={'mr-1'} /> Orders</Link>
              </li>

              <li className="has-submenu">
                  <a href="#"><FontAwesomeIcon icon={faBoxesStacked} className={'mr-1'} /> Inventory <i
                      className="mdi mdi-chevron-down mdi-drop"></i></a>
                  <ul className="submenu megamenu">
                      <li>
                          <ul>
                              <li><Link to={'/admin/unit-group'}>Unit Group</Link></li>
                              <li><Link to={'/admin/units'}>Units</Link></li>
                              <li><Link to={'/admin/product-categories'}>Product Categories</Link></li>
                              <li><Link to={'/admin/products'}>Products</Link></li>
                              <li><Link to={'/admin/stock-management'}>Stock Adjustment</Link></li>
                              <li><Link to={'/admin/stock-flow-history'}>Stock Flow Records</Link></li>
                          </ul>
                      </li>
                  </ul>
              </li>
              <li className="has-submenu">
                  <a href="#"><FontAwesomeIcon icon={faDolly} className={'mr-1'} /> Procurements <i
                      className="mdi mdi-chevron-down mdi-drop"></i></a>
                  <ul className="submenu megamenu">
                      <li>
                          <ul>
                              <li><Link to={'/admin/create-procurement'}>New Procurement</Link></li>
                              <li><Link to={'/admin/procurements'}>Procurements List</Link></li>
                          </ul>
                      </li>
                  </ul>
              </li>
              <li className="has-submenu">
                  <a href="#"><FontAwesomeIcon icon={faDolly} className={'mr-1'} /> Misc. <i
                      className="mdi mdi-chevron-down mdi-drop"></i></a>
                  <ul className="submenu megamenu">
                      <li>
                          <ul>
                              <li><Link to={'/admin/table-list'}>Tables List</Link></li>
                              <li><Link to={'/admin/staff-list'}>Staff List</Link></li>
                          </ul>
                      </li>
                  </ul>
              </li>

              <li className="has-submenu">
                  <a href="#"><FontAwesomeIcon icon={faCalculator} className={'mr-1'} /> Accounting <i
                      className="mdi mdi-chevron-down mdi-drop"></i></a>
                  <ul className="submenu megamenu">
                      <li>
                          <ul>
                              <li><Link to={'/admin/expenses'}>Expenses</Link></li>
                              <li><Link to={'/admin/cash-flows'}>Cash FLow History</Link></li>
                          </ul>
                      </li>
                  </ul>
              </li>
          </ul>
      </div>
    )
}

export default AdminNavbar;