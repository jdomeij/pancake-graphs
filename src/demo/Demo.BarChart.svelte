<script lang="ts">
  import { default as Component } from '../components/BarChart.svelte';

  let xMax: number = undefined;
  let barHeight: number = 75;
  let xTicksBar: boolean = true;
  let xTicksStr: string = "50,100";

  let xTicks: number[];
  $: xTicks = xTicksStr.split(',').map((str:string,i:number)=>(parseInt(str)||i+1));


  interface ValueStyle {
    label: string,
    value: number,
    class: string,
  };


  let colorOffset = 0;
  function newColor() {
    const colorList = [
      'yellow',
      'gray',
      'blue',
      'green',
      'indigo',
      'red',
      'purple',
      'pink',
    ];

    let color = Math.floor(colorOffset/4)%colorList.length;
    let intensity = colorOffset%4;
    colorOffset++;

    return `text-${colorList[color]}-${(intensity*2)+3}00`;
  }

  function newValue() {
    return Math.floor(Math.random()*100);
  }


  let dataList: ValueStyle[] = [
    {label: 'label10', value: newValue(), class: newColor()},
    {label: 'label11', value: newValue(), class: newColor()},
    {label: 'label12', value: newValue(), class: newColor()},
    {label: 'label13', value: newValue(), class: newColor()},
    {label: 'label14', value: newValue(), class: newColor()},
    {label: 'label15', value: newValue(), class: newColor()},
    {label: 'label13', value: newValue(), class: newColor()},
    {label: 'label14', value: newValue(), class: newColor()},
    {label: 'label15', value: newValue(), class: newColor()},
    {label: 'label16', value: newValue(), class: newColor()},
    {label: 'label17', value: newValue(), class: newColor()},
    {label: 'label18', value: newValue(), class: newColor()},
    {label: 'label19', value: newValue(), class: newColor()},
    {label: 'label20', value: newValue(), class: newColor()},
  ];

  function removeLast() {
    if (!(dataList.length > 1))
      return;

    dataList.pop();
    dataList = dataList;
  }

  function removeRandom() {
    if (!(dataList.length > 1))
      return;

    let item = Math.floor(Math.random()*(dataList.length-1));
    dataList.splice(item, 1);
    dataList = dataList;
  }

  function updateRandom() {
    dataList[ Math.floor( dataList.length * Math.random() ) ].value = newValue();
  }

  function addItem() {
    dataList.push({
      label: `label${10+dataList.length}`,
      value: Math.floor(Math.random()*100),
      class: newColor(),
    });
    dataList = dataList;
  }

</script>

<div class="flex justify-center mx-auto text-xs">
  <div style="height:600px;" class="relative w-1/2 h-64 pl-16 p-8 border-gray-300 border-4 bg-gray-100">
    <Component
      values={dataList.map((p)=>(p.value))}
      styles={
        dataList.map(p=>({label: p.label, class: p.class}))
      }
      xMax={xMax}
      xTicks={xTicks}
      height={barHeight}
      xTicksBar={xTicksBar}
    />
  </div>
  <div class="flex flex-col ml-2 bg-gray-100 border-gray-300 border-4 w-1/2">

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">barHeight</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" step="5" bind:value={barHeight}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">xMax</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" step="5" bind:value={xMax}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">xTicks[]</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="string" bind:value={xTicksStr}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">xTicksBar</span>
      <input type="checkbox" bind:checked={xTicksBar}>
    </div>

    <div class="border-b border-gray-600 mt-2 mx-8"></div>

    <div class="m-4 inline-flex flex-col overflow-y-scroll h-64">
      {#each dataList as item, index}
        <div class="flex flex-row p-2 {index%2==0?'bg-gray-100':'bg-gray-200'}">
          <input style="min-width: 6rem" class="p-1 flex-shrink mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.label}">
          <input class="p-1 w-16 mr-1 border border-blue-400 bg-white" type="number" bind:value="{item.value}">
          <input class="p-1 w-32 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.class}">
        </div>
      {/each}
    </div>
  
    <div class="m-4 inline-flex flex-row">
      <button class="m-1 p-2 bg-blue-500 hover:bg-blue-700 inline-block border rounded text-white" on:click="{()=>addItem()}">Add New</button>
      <button class="m-1 p-2 bg-blue-500 hover:bg-blue-700 inline-block border rounded text-white" on:click="{()=>updateRandom()}">Update Random</button>

      <button class="m-1 p-2 bg-red-500 hover:bg-red-700 inline-block border rounded text-white" on:click="{()=>removeLast()}">Remove Last</button>
      <button class="m-1 p-2 bg-red-500 hover:bg-red-700 inline-block border rounded text-white" on:click="{()=>removeRandom()}">Remove Random</button>
    </div>
  </div>
</div>



