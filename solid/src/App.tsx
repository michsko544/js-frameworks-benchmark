import {
  Component,
  For,
  createSelector,
  mergeProps,
  splitProps,
} from "solid-js";
import { createSignal } from "solid-js";

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

const App: Component = () => {
  const [data, setData] = createSignal<Data[]>([]);
  const [selected, setSelected] = createSignal<number | null>(null);
  const isSelected = createSelector(selected);

  const run = () => {
    // performance.mark("start--rendering-500-rows");
    setData(generateData(500));
    // afterFrame(() => {
    //   performance.mark("end--rendering-500-rows");
    //   performance.measure(
    //     "time--rendering-500-rows",
    //     "start--rendering-500-rows",
    //     "end--rendering-500-rows"
    //   );
    // });
  };

  const clear = () => {
    // performance.mark("start--clearing-5000-rows");
    setData([]);
    // afterFrame(() => {
    //   performance.mark("end--clearing-5000-rows");
    //   performance.measure(
    //     "time--clearing-5000-rows",
    //     "start--clearing-5000-rows",
    //     "end--clearing-5000-rows"
    //   );
    // });
  };

  const select = (id: number) => {
    // performance.mark("start--selecting-row");
    setSelected(id);
    // afterFrame(() => {
    //   performance.mark("end--selecting-row");
    //   performance.measure(
    //     "time--selecting-row",
    //     "start--selecting-row",
    //     "end--selecting-row"
    //   );
    // });
  };

  const swap = () => {
    // First with last
    // performance.mark("start--swapping-rows");
    setData((data) => [
      data[data.length - 1],
      ...data.slice(1, data.length - 1),
      data[0],
    ]);
    // afterFrame(() => {
    //   performance.mark("end--swapping-rows");
    //   performance.measure(
    //     "time--swapping-rows",
    //     "start--swapping-rows",
    //     "end--swapping-rows"
    //   );
    // });
  };

  const duplicate = (id: number) => {
    performance.mark("start--duplicating-row");
    setData((data) =>
      data.reduce<Data[]>((acc, el) => {
        if (el.id === id) {
          acc.push({ value: el.value, id: data.length + 1 });
        }
        acc.push(el);
        return acc;
      }, [])
    );
    afterFrame(() => {
      performance.mark("end--duplicating-row");
      performance.measure(
        "time--duplicating-row",
        "start--duplicating-row",
        "end--duplicating-row"
      );
    });
  };

  const remove = (id: number) => {
    performance.mark("start--removing-row");
    setData((data) => {
      const idx = data.findIndex((el) => el.id === id);
      return [...data.slice(0, idx), ...data.slice(idx + 1)];
    });
    afterFrame(() => {
      performance.mark("end--removing-row");
      performance.measure(
        "time--removing-row",
        "start--removing-row",
        "end--removing-row"
      );
    });
  };

  return (
    <div class="App">
      <div class="buttonsWrapper">
        <button data-testid="generate-btn" onClick={run}>
          Generate 500
        </button>
        <button data-testid="swap-btn" onClick={swap}>
          Swap
        </button>
        <button data-testid="clear-btn" onClick={clear}>
          Clear
        </button>
        <button>Remove row</button>
      </div>

      <TableList
        data={data()}
        isSelected={isSelected}
        onSelect={select}
        onDuplicate={duplicate}
        onRemove={remove}
      />
    </div>
  );
};

export default App;

function TableList(props: {
  data?: Data[];
  isSelected?: (key: number) => boolean;
  onSelect?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onRemove?: (id: number) => void;
}) {
  const [local] = splitProps(
    mergeProps(
      {
        data: [],
        isSelected: () => false,
        onSelect: () => null,
        onDuplicate: () => null,
        onRemove: () => null,
      },
      props
    ),
    ["data", "isSelected", "onSelect", "onDuplicate", "onRemove"]
  );

  return (
    <div class="tableList">
      <For each={local.data}>
        {(el) => (
          <Row
            value={el}
            isSelected={local.isSelected(el.id)}
            onSelect={local.onSelect}
            onDuplicate={local.onDuplicate}
            onRemove={local.onRemove}
          />
        )}
      </For>
    </div>
  );
}

function Row(props: {
  value?: Data;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onRemove?: (id: number) => void;
}) {
  const [local] = splitProps(
    mergeProps(
      {
        value: { id: 1, value: "" },
        isSelected: false,
        onSelect: () => null,
        onDuplicate: () => null,
        onRemove: () => null,
      },
      props
    ),
    ["value", "isSelected", "onSelect", "onDuplicate", "onRemove"]
  );

  return (
    <div class="row" classList={{ selected: local.isSelected }}>
      <div onClick={() => local.onSelect(local.value.id)}>
        {local.value.value}
      </div>
      <button
        onClick={() => local.onDuplicate(local.value.id)}
        data-testid="duplicate-btn"
      >
        duplicate
      </button>
      <button
        onClick={() => local.onRemove(local.value.id)}
        data-testid="remove-btn"
      >
        remove
      </button>
    </div>
  );
}
