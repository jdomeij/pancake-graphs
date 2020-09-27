<script lang="ts">
  import * as GraphLib from '../package.dist';

  let lineWidth: number = 1;
  let lineColor: string = 'black';
  
  interface PieStyle {
    label: string,
    value: number,
    class: string,
  };


  let colorOffset = 0;
  function newColor() {
    const colorList = [
      'orange',
      'red',
      'yellow',
      'green',
      'teal',
      'blue',
    ];

    let color = Math.floor(colorOffset/4)%colorList.length;
    let intensity = colorOffset%4;
    colorOffset++;

    return `text-${colorList[color]}-${(intensity*2)+3}00`;
  }


  let pieData = [
    {label: 'label10', value: 17, class: newColor()},
    {label: 'label11', value: 23, class: newColor()},
    {label: 'label12', value: 5, class: newColor()},
    {label: 'label13', value: 22, class: newColor()},
  ];

  function removeLast() {
    if (!(pieData.length > 1))
      return;

    pieData.pop();
    pieData = pieData;
  }

  function removeRandom() {
    if (!(pieData.length > 1))
      return;

    let item = Math.floor(Math.random()*(pieData.length-1));
    pieData.splice(item, 1);
    pieData = pieData;
  }

  function addItem() {
    pieData.push({
      label: `label${10+pieData.length}`,
      value: Math.floor(Math.random()*100),
      class: newColor(),
    });
    pieData = pieData;
  }

</script>

<div class="flex">
  <div class="m-2">
    <div class="relative w-64 h-64 mr-32 bg-gray-300">
      <GraphLib.PieChart
        lineWidth={lineWidth}
        lineColor={lineColor}
        classLegend={'h-full overflow-y-auto w-32 bg-gray-200'}
        values={pieData.map((p)=>(p.value))}
        styles={
          pieData.map((p,i)=>({label: p.label, class: p.class}))
        }
      />
    </div>
  </div>
  <div class="flex flex-col">

    <div class="m-4 inline-flex flex-col overflow-y-scroll h-64">
      {#each pieData as item, index}
        <div class="flex flex-row p-2 {index%2==0?'bg-white':'bg-gray-200'}">
          <input class="p-1 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.label}">
          <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" bind:value="{item.value}">
          <input class="p-1 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.class}">
        </div>
      {/each}
    </div>
  
    <div class="m-4 inline-flex flex-row">
      <button class="m-1 p-2 bg-blue-500 hover:bg-blue-700 inline-block border rounded text-white" on:click="{()=>addItem()}">Add New</button>
      <button class="m-1 p-2 bg-red-500 hover:bg-red-700 inline-block border rounded text-white" on:click="{()=>removeLast()}">Remove Last</button>
      <button class="m-1 p-2 bg-red-500 hover:bg-red-700 inline-block border rounded text-white" on:click="{()=>removeRandom()}">Remove Random</button>
    </div>

    <div class="">
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" step="0.2" bind:value={lineWidth}>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="string" bind:value={lineColor}>
    </div>

  </div>
</div>



