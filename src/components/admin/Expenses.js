import React from "react";
import ExpenseList from "./expenses/ExpenseList";

const Expenses = () => {
    return (
         <>
            <div className="page-title-box">
              <div className="row align-items-center">
                  <div className="col-sm-12">
                      <ol className="breadcrumb float-right">
                          <li className="breadcrumb-item active">Accounts</li>
                      </ol>
                  </div>
              </div>
          </div>

          <div className="row">
              <div className="col-lg-12">
                  <div className="card m-b-30">
                        <div className="card-body">
                            <ExpenseList/>
                        </div>
                    </div>
              </div>
          </div>
        </>
    )
}

export default Expenses;