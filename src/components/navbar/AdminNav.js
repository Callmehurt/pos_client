import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxesStacked, faDashboard, faDolly, faPhotoFilm} from "@fortawesome/free-solid-svg-icons";

const AdminNav = () => {
    return (
        <>
            <ul className="metismenu" id="side-menu">
                <li className="menu-title">Menu</li>
                <li>
                    <Link to={`/admin/dashboard`}><FontAwesomeIcon icon={faDashboard} className={'mr-1'} /> Dashboard</Link>
                </li>
                <li className="has-submenu">
                    <Link to={`/admin/medias`}><FontAwesomeIcon icon={faPhotoFilm} className={'mr-1'} /> Medias</Link>
                </li>
                <li className="has-submenu">
                    <Link to={`/admin/providers`}><FontAwesomeIcon icon={faPhotoFilm} className={'mr-1'} /> Providers</Link>
                </li>
                <li>
                    <a className="waves-effect"><i
                        className="icon-mail-open"></i><span> Email <span className="float-right menu-arrow"><i
                        className="mdi mdi-chevron-right"></i></span>
                    </span></a>
                    <ul className="submenu">
                        <li><a href="email-inbox.html">Inbox</a></li>
                        <li><a href="email-read.html">Email Read</a></li>
                        <li><a href="email-compose.html">Email Compose</a></li>
                    </ul>
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
              <li>
                  <a href="#"><FontAwesomeIcon icon={faDolly} className={'mr-1'} /> Procurements <i
                      className="mdi mdi-chevron-down mdi-drop"></i></a>
                  <ul className="submenu ">
                      <li>
                          <ul>
                              <li><Link to={'/admin/procurements'}>Procurements List</Link></li>
                          </ul>
                      </li>
                  </ul>
              </li>
            </ul>
        </>
    )
}

export default AdminNav;