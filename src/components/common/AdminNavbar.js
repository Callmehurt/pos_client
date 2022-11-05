import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDashboard, faPhotoFilm, faBoxesStacked, faDolly, faPerson} from "@fortawesome/free-solid-svg-icons";

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
                  <a href="#"><i className="icon-paper-sheet"></i> Pages <i
                      className="mdi mdi-chevron-down mdi-drop"></i></a>
                  <ul className="submenu megamenu">

                      <li>
                          <ul>
                              <li><a href="pages-pricing.html">Pricing</a></li>
                              <li><a href="pages-invoice.html">Invoice</a></li>
                              <li><a href="pages-timeline.html">Timeline</a></li>
                              <li><a href="pages-faqs.html">FAQs</a></li>
                              <li><a href="pages-maintenance.html">Maintenance</a></li>
                              <li><a href="pages-comingsoon.html">Coming Soon</a></li>
                              <li><a href="pages-starter.html">Starter Page</a></li>
                          </ul>
                      </li>
                      <li>
                          <ul>
                              <li><a href="pages-login.html">Login</a></li>
                              <li><a href="pages-register.html">Register</a></li>
                              <li><a href="pages-recoverpw.html">Recover Password</a></li>
                              <li><a href="pages-lock-screen.html">Lock Screen</a></li>
                              <li><a href="pages-404.html">Error 404</a></li>
                              <li><a href="pages-500.html">Error 500</a></li>
                          </ul>
                      </li>
                  </ul>
              </li>

          </ul>
      </div>
    )
}

export default AdminNavbar;