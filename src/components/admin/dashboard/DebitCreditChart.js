import {ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from "recharts";


const DebitCreditChart = ({data}) => {


    return (
          <div style={{width: '100%', height: '400px'}}>
                <ResponsiveContainer>
                    <LineChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} />
                      <Line name={'Debit'} type="monotone" dataKey="debit" stroke="#F87171" activeDot={{ r: 5 }} />
                      <Line name={'Credit'} type="monotone" dataKey="credit" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
          </div>
    )
}

export default DebitCreditChart;