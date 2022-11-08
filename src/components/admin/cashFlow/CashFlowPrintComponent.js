import React from "react";
import moment from "moment";

export const CashFlowPrintComponent = React.forwardRef((props, ref) => {

    const getPageMargins = () => {
          return `
          @media print {
          html, body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @page {
          size: auto;
          margin: 5mm;
        }
          
          `;
        };

    const getTableStyle = () => {
        return `
        table, td, th {
        border: 1px solid black;
        font-family: Roboto, Helvetica, Arial, sans-serif;
    }

    thead tr th{
        padding: 5px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
    }

    tbody tr td{
        padding-left: 5px;
        font-family: Roboto, Helvetica, Arial, sans-serif;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    thead{
        background: gainsboro;
    }

    .table-top-head{
        text-align: center;
        height: 35px;
        width: 170px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        display: grid;
        place-items: center;
        border: 1px solid gainsboro;
        color: black;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom: none;
    }
        `
    }
    return (
        <>
            <div ref={ref} style={{overFlow: 'hidden',height: '0'}}>
                <style type="text/css" media="print">
                    {getPageMargins()}
                    {getTableStyle()}
                </style>
                <div style={{padding: '10px'}}>
                    <table>
                        <thead>
                        <tr>
                            <th>S.N</th>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Operation</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            props.cashFlows.map((data, index) => {
                                return (
                                    <tr key={data._id}>
                                        <td>{++index}</td>
                                        <td>{data.name}</td>
                                        <td>Rs. {data.value}</td>
                                        <td><span style={{textTransform: 'capitalize'}}>{data.operation}</span></td>
                                        <td>{moment(data.createdAt).format('LLL')}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
})