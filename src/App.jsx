import { Client } from "elasticsearch-browser";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  let [cpCount, setCpCount] = useState(0);
  let [juCount, setJuCount] = useState(0);
  let [moreAge, setMoreAge] = useState(0);
  let [lessAge, setLessAge] = useState(0);

  const COLORS = ["#0088FE", "#5EB2FF", "#3BA3FF"];

  const [data, setData] = useState([
    { name: "Campo Limpo", value: 0 },
    { name: "Jundiai", value: 0 },
  ]);

  const [data2, setData2] = useState([
    { name: "Idade maior que 30", value: 0 },
    { name: "Idade menor que 30", value: 0 },
  ]);

  useEffect(() => {
    async function testSearch() {
      const client = new Client({ node: "http://localhost:9200" });

      const cpResult = await client.search({
        index: "index-test-000001",
        body: {
          query: {
            match: { "user.location": "campo limpo" },
          },
        },
      });

      const juResult = await client.search({
        index: "index-test-000001",
        body: {
          query: {
            match: { "user.location": "jundiai" },
          },
        },
      });

      const agesMore = await client.search({
        index: "index-test-000001",
        body: {
          query: {
            range: {
              "user.age": {
                gte: 22,
              },
            },
          },
        },
      });

      const agesLess = await client.search({
        index: "index-test-000001",
        body: {
          query: {
            range: {
              "user.age": {
                lte: 22,
              },
            },
          },
        },
      });

      setCpCount(cpResult.hits.hits.length);
      setJuCount(juResult.hits.hits.length);
      setMoreAge(agesMore.hits.hits.length);
      setLessAge(agesLess.hits.hits.length);

      setData(
        [
          { name: "Campo Limpo", value: cpResult.hits.hits.length },
          { name: "Jundiai", value: juResult.hits.hits.length },
        ],
        []
      );

      setData2(
        [
          { name: "Idade maior que 22", value: agesMore.hits.hits.length },
          { name: "Idade menor que 22", value: agesLess.hits.hits.length },
        ],
        []
      );
    }

    testSearch().catch(console.log);
  }, []);

  return (
    <div className="App-container">
      <div className="chart1">
        <PieChart width={585} height={300}>
          <Pie
            dataKey="value"
            data={data}
            cx={282}
            cy={140}
            innerRadius={110}
            outerRadius={130}
            fill="#82ca9d"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <div className="counter-container">
          <h2>Morador de Campo Limpo: {cpCount}</h2>
          <h2>Morador de Jundiaí: {juCount}</h2>
        </div>
      </div>
      <div className="chart2">
        <PieChart width={585} height={300}>
          <Pie
            dataKey="value"
            data={data2}
            cx={282}
            cy={140}
            innerRadius={110}
            outerRadius={130}
            fill="#82ca9d"
          >
            {data2.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <div className="counter-container">
          <h2>Idade maior que 22: {moreAge}</h2>
          <h2>Idade menor que 22: {lessAge}</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
