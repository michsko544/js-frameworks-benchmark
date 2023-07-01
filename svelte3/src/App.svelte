<script lang="ts">
  import TableList from "./components/TableList.svelte";
  import type { Data } from "./types";
  import afterFrame from "afterframe";

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

  let data:Data[] = [];
  let selected: null | number = null;

  const run = () => {
    // performance.mark("start--rendering-500-rows");
    data = generateData(500);
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
    data = [];
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
    selected = id;
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
    data = [
      data[data.length - 1],
      ...data.slice(1, data.length - 1),
      data[0],
    ];
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
    // performance.mark("start--duplicating-row");
    data = data.reduce<Data[]>((acc, el) => {
        if (el.id === id) {
          acc.push({ value: el.value, id: data.length + 1 });
        }
        acc.push(el);
        return acc;
      }, []);
    // afterFrame(() => {
    //   performance.mark("end--duplicating-row");
    //   performance.measure(
    //     "time--duplicating-row",
    //     "start--duplicating-row",
    //     "end--duplicating-row"
    //   );
    // });
  }

  const remove = (id: number) => {
    performance.mark("start--removing-row");
    const idx = data.findIndex((el) => el.id === id);
    data = [...data.slice(0, idx), ...data.slice(idx + 1)];
    afterFrame(() => {
      performance.mark("end--removing-row");
      performance.measure(
        "time--removing-row",
        "start--removing-row",
        "end--removing-row"
      );
    });
  };
</script>

<div class="App">
  <div class="buttonsWrapper">
    <button data-testid="generate-btn" on:click={run}>
      Generate 500
    </button>
    <button data-testid="swap-btn" on:click={swap}>Swap</button>
    <button data-testid="clear-btn" on:click={clear}>Clear</button>
  </div>

  <TableList
    data={data}
    onSelect={select}
    onDuplicate={duplicate}
    onRemove={remove}
    selected={selected}
  />
</div>

<style lang="scss">
  .buttonsWrapper {
    display: flex;
  }
</style>
