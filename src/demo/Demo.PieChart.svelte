<script lang="ts">
  import { default as Component } from '../components/PieChart.svelte';

  let lineWidth: number = .6;
  let lineColor: string = 'white';
  let cutout: number = 60;
  let circleOffset: number = 0;
  let circleTotal: number = 270;

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

    let color = Math.floor(colorOffset/5)%colorList.length;
    let intensity = colorOffset%5;
    colorOffset++;

    return `text-${colorList[color]}-${7-(intensity)}00`;
  }


  function newValue() {
    return Math.floor(Math.random()*100);
  }


  let pieData: ValueStyle[] = [
    {label: 'label10', value: newValue(), class: newColor()},
    {label: 'label11', value: newValue(), class: newColor()},
    {label: 'label12', value: newValue(), class: newColor()},
    {label: 'label13', value: newValue(), class: newColor()},
    {label: 'label14', value: newValue(), class: newColor()},
  ];

  function removeLast() {
    if (!(pieData.length > 1))
      return;


    pieData.pop();
    pieData = pieData;
  }

  function removeIndex(index: number) {
    if (!(pieData.length > 1))
      return;
    if (pieData.length < index + 1)
      return;
    pieData.splice(index, 1);
    pieData = pieData;
  }

  function removeRandom() {
    if (!(pieData.length > 1))
      return;

    let item = Math.floor(Math.random()*(pieData.length-1));
    pieData.splice(item, 1);
    pieData = pieData;
  }

  function updateRandom() {
    pieData[ Math.floor( pieData.length * Math.random() ) ].value = newValue();
  }

  function addItem() {
    pieData.push({
      label: `label${10+pieData.length}`,
      value: newValue(),
      class: newColor(),
    });
    pieData = pieData;
  }

</script>


<div class="flex justify-center mx-auto text-xs">
  <div style="width: 24rem" class="relative w-64 h-64 pr-32 border-gray-300 border-4 bg-gray-100">
    <Component
      classLegend={'h-full overflow-y-auto w-32 mr-32 bg-gray-200'}
      values={pieData.map((p)=>(p.value))}
      styles={
        pieData.map(p => ({label: p.label, class: p.class}))
      }
      {lineColor}
      {lineWidth}
      {cutout}
      {circleOffset}
      {circleTotal}
    />
  </div>

  <div class="flex flex-col ml-2 w-1/2 border-gray-300 border-4 bg-gray-100">

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">lineWidth</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" step="0.2" bind:value={lineWidth}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">lineColor</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="string" bind:value={lineColor}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">cutout</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" min="0" max="100" step="5" bind:value={cutout}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">circleTotal</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" min="0" max="360" step="10" bind:value={circleTotal}>
    </div>
    
    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">circleOffset</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" step="5" bind:value={circleOffset}>
    </div>

    <div class="border-b border-gray-600 mt-2 mx-8"></div>

    <div class="m-4 overflow-y-scroll h-64">
      {#each pieData as item, index}
        <div class="flex flex-row p-2 {index%2==0?'bg-white':'bg-gray-200'}">
          <button class="m-1 px-1 bg-red-400 hover:bg-red-600" on:click="{()=>removeIndex(index)}">X</button>
          <input style="min-width: 6rem" class="p-1 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.label}">
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



