import { useCallback, useState } from "react";
import "./App.css";
import afterFrame from "afterframe";

type Data = {
  id: number;
  value: string;
};

function random(max: number): number {
  return Math.round(Math.random() * 1000) % max;
}

const generateData = (quantity: number): Data[] => {
  const A = [
    "governor",
    "small",
    "spiffy",
    "wash",
    "adventurous",
    "window",
    "bless",
    "glamorous",
    "shock",
    "animal",
    "psychotic",
    "melt",
    "attractive",
    "memorize",
    "sort",
    "skin",
    "brief",
    "devilish",
    "fearless",
    "uncle",
    "conscious",
    "comfortable",
    "robust",
    "insidious",
    "whispering",
    "cave",
    "loaf",
    "arrest",
    "celery",
    "delay",
    "move",
    "wiry",
    "excuse",
    "toothpaste",
    "whirl",
    "nod",
    "faded",
    "poison",
    "man",
    "greet",
    "onerous",
    "educated",
    "cherry",
    "bushes",
    "well-groomed",
    "size",
    "snore",
    "trot",
    "earn",
    "torpid",
  ];

  return Array.from(Array(quantity), (_, i) => {
    return {
      id: i + 1,
      value: `${A[random(A.length)]} - ${A[random(A.length)]}`,
    };
  });
};

function App() {
  const [data, setData] = useState<Data[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  performance.mark("start--app");

  const run = useCallback(() => {
    performance.mark("start--rendering-500-rows");
    setData(generateData(500));
    afterFrame(() => {
      performance.mark("end--rendering-500-rows");
    });
  }, [generateData]);

  const select = useCallback((id: number) => {
    setSelected(id);
  }, []);

  return (
    <div className="App">
      <div className="buttonsWrapper">
        <button data-testid="generate-btn" onClick={run}>
          Generate 500
        </button>
        <button>Swap</button>
        <button>Clear</button>
        <button>Remove row</button>
      </div>

      <TableList data={data} selected={selected} onSelect={select} />
    </div>
  );
}

export default App;

function TableList({
  data = [],
  selected = null,
  onSelect = () => null,
}: {
  data?: Data[];
  selected?: number | null;
  onSelect?: (id: number) => void;
}) {
  return (
    <div className="tableList">
      {data.map((el) => (
        <Row
          key={el.id}
          value={el}
          isSelected={selected === el.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function Row({
  value = { id: 1, value: "" },
  isSelected = false,
  onSelect = () => null,
}: {
  value?: Data;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}) {
  return (
    <div
      className="row"
      onClick={() => onSelect(value.id)}
      style={isSelected ? { backgroundColor: "red" } : {}}
    >
      {value.value}
    </div>
  );
}
