<script lang="ts">

  export let isSelected = false;
  export let onSelect:(id: number) => void = () => null;
  export let onDuplicate:(id: number) => void = () => null;
  export let onRemove:(id: number) => void = () => null;
  export let value = {id: 1, value: ""};

</script>

<div
  class="row"
  class:selected={isSelected}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    on:click={() => onSelect(value.id)}
  >
  {value.value}
  </div>
  <button on:click={()=>onDuplicate(value.id)} data-testid="duplicate-btn">
    duplicate
  </button>
  <button on:click={()=>onRemove(value.id)} data-testid="remove-btn">
    remove
  </button>
</div>

<style lang="scss">

  .row{
    width: fit-content;
    display: flex;
  }

  .row.selected{
    background-color: red;
  }

</style>
