<script lang="ts">
  import { default as Component } from '../components/LineChart.svelte';

  let yMax: number = undefined;

  let yTicksStr: string = '50,100';
  let xTicksStr: string = '0,29,59';

  let bgGraphColor: string = 'bg-gray-200';

  let xTicks: number[];
  $: {
    let tmp = null;
    try {
      tmp = JSON.parse(`[${xTicksStr}]`);

    }
    catch (e) {
      tmp = xTicksStr.split(',').map((str:string,i:number)=>(myParseInt(str, i+1)));
    }
    xTicks = tmp;
  }
    
    
  $: console.log({xTicks,yTicks});

  let yTicks: number[];
  $: yTicks = yTicksStr.split(',').map((str:string,i:number)=>(myParseInt(str, i+1)));

  interface ValueStyle {
    label: string,
    values: string,
    class: string,
    fill: number | null,
    line: number | null,
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

    let color = Math.floor(colorOffset/1)%colorList.length;
    let intensity = colorOffset%1;
    colorOffset++;

    return `text-${colorList[color]}-${(intensity*2)+3}00`;
  }

  function newValues(index: number) {
    let retVal = [];
    for (let i=0; i < 60; i++)
      retVal.push(10*index+ Math.floor(Math.random()*15));
    return retVal.join(',');
  }


  let dataList: ValueStyle[] = [
  ];
  addItem();


  function removeLast() {
    if (!(dataList.length > 1))
      return;

    dataList.pop();
    dataList = dataList;
  }

  function myParseInt(val: string, defaultVal: number) {
    let valNum = parseInt(val, 10);
    if (typeof valNum !== 'number' || isNaN(valNum))
      return defaultVal;
    return valNum;
  }

  function removeRandom() {
    if (!(dataList.length > 1))
      return;

    let item = Math.floor(Math.random()*(dataList.length-1));
    dataList.splice(item, 1);
    dataList = dataList;
  }

  function updateRandom() {
    let index = Math.floor( dataList.length * Math.random() )
    dataList[ index ].values = newValues(index);
  }

  function addItem() {
    dataList.push({
      label: `label${10+dataList.length}`,
      values: newValues(dataList.length),
      class: newColor(),
      fill: null,
      line: null,
    });
    dataList = dataList;
  }

</script>

<div class="flex justify-center mx-auto text-xs">
  <div style="height:600px;" class="relative w-1/2 h-64 pl-16 p-8 border-gray-300 border-4 bg-gray-100">
    <div class="h-full w-full {bgGraphColor}">
    <Component
      values={dataList.slice(0).reverse().map((p)=>(p.values.split(',').map(x=>myParseInt(x,10))))}
      styles={
        dataList.slice(0).reverse().map(p=>({
          label: p.label, 
          class: p.class, 
          fill: p.fill,
          line: p.line,
        }))
      }
      yMax={yMax}
      xTicks={xTicks}
      yTicks={yTicks}
      formatValue={(value, info/*, index*/)=>{
        return info.label || '';
      }}
    />
    </div>
  </div>
  <div class="flex flex-col ml-2 bg-gray-100 border-gray-300 border-4 w-1/2">

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">yMax</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="number" step="5" bind:value={yMax}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">bg-color</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="string" step="5" bind:value={bgGraphColor}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">xTicks[]</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="string" bind:value={xTicksStr}>
    </div>

    <div class="my-2 mx-4">
      <span class="inline-block w-32 font-mono">yTicks[]</span>
      <input class="p-1 mr-1 border border-blue-400 bg-white" type="string" bind:value={yTicksStr}>
    </div>

    <div class="border-b border-gray-600 mt-2 mx-8"></div>

    <div class="m-4 inline-flex flex-col overflow-y-scroll h-64">
      {#each dataList as item, index}
        <div class="flex flex-row p-2 {index%2==0?'bg-gray-100':'bg-gray-200'}">
          <input class="p-1 w-16 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.label}">
          <input class="p-1 w-64 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.values}">
          <input class="p-1 w-24 mr-1 border border-blue-400 bg-white" type="text" bind:value="{item.class}">
          <input class="p-1 w-24 mr-1 border border-blue-400 bg-white" placeholder="fill opacity" min=0 max=1 step="0.1" type="number" bind:value="{item.fill}">
          <input class="p-1 w-24 mr-1 border border-blue-400 bg-white" placeholder="line width" min=0 step="0.5" type="number" bind:value="{item.line}">
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



