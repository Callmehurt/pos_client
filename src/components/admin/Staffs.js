import React from "react";
import StaffList from "./staff/StaffList";


const Staffs = () => {
    return (
        <>
        <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Staffs</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <StaffList/>
              </div>
          </div>
        </>
    )
}

export default Staffs;