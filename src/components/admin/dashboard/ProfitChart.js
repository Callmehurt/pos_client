
import { AreaChart, Area, XAxis, YAxis, Legend, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const ProfitChart = ({data}) => {


    return (
        <>
            <div style={{width: '100%', height: '400px'}}>
                <ResponsiveContainer>
                    <AreaChart height={250} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={'_id'} />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36}/>
                        <Area type="monotone" name={'Total Collectable'} dataKey="totalCollectable" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" name={'Total Discount'} dataKey="totalDiscount" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                        <Area type="monotone" name={'Total Collected'} dataKey="totalCollected" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default ProfitChart;