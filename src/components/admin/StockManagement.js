import React from "react";
import StockList from "./stockManagement/StockList";

const StockManagement = () => {
    return (
        <>
        <div className="page-title-box">
          <div className="row align-items-center">
              <div className="col-sm-12">
                  <ol className="breadcrumb float-right">
                      <li className="breadcrumb-item active">Stock Adjustment</li>
                  </ol>
              </div>
          </div>
      </div>

      <div className="row">
          <div className="col-lg-12">
              <StockList/>
          </div>
      </div>
        </>
    )
}

export default StockManagement;