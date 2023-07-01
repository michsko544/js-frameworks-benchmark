<script lang="ts">
  import type { Data } from "@/types";
  import Row from "./Row.svelte";

  export let data: Data[] = [];
  export let selected:number | null = null;
  export let onSelect: (id: number) => void = () => null;
  export let onDuplicate: (id: number) => void = () => null;
  export let onRemove: (id: number) => void = () => null;
</script>

<div class="tableList">
  {#each data as el}
    <Row
      value={el}
      isSelected={selected === el.id}
      onSelect={onSelect}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
    />
  {/each}
</div>

<style lang="scss">

</style>
