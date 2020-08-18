<script lang="ts">
  import * as GraphLib from '../package.dist';

  function generateData(num, yOffset, yMax) {
    let interval = Math.floor(Math.random()*(num/4))+1;
    return [...Array(num).keys()].map( (v, i) => ( Math.floor((i%interval==0?(Math.random()*yOffset):0)+Math.random()*yMax)) );
  }

</script>


<div class="bg-gray-200 p-4 rounded mt-4 flex flex-col md:flex-row h-auto md:h-40 justify-between mx-1 md:mx-16 md:space-x-8 md:space-y-0 space-y-4">
  <div class="h-40 md:h-full flex-auto p-2">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'test',
          color: 'SteelBlue',
        }
      ]}

      tooltip={false}
      yMax={1000}
      
      values={ [ generateData(60, 200, 300) ] }
    >
    </GraphLib.LineChart>
  </div>
  <div class="h-40 md:h-full flex-auto py-2 pl-12 pr-2">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'test',
          class: 'text-pink-400',
        }
      ]}
      yTicksColor={'pink'}
      yTicks={ [
        [0, 'min'],
        [25, null],
        [50, 'mid'],
        [75, null], 
        [100,'max'],
      ]}
      xTicks={[
        [0, 'start'],
        [15, null],
        [29, 'mid'],
        [45, null],
        [59, 'end'],
      ]}
      formatValue={ (val) => {
        return `${val}%`;
      }}

      formatTick={ (val, label, yAxis) => {
        if (typeof label === 'string')
          return label;
        if (yAxis)
          return `${val}%`;
        return `${Math.floor((val*100/60))}%`;
      }}
      
      values={ [ generateData(60, 30, 70)] }
    >
    </GraphLib.LineChart>
  </div>
  <div class="h-40 md:h-full flex-auto pl-16 pt-8 pb-6 pr-4 bg-blue-300">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'test1',
          class: 'text-gray-500',
        },
        {
          label: 'test2',
          class: 'text-gray-700',
        },
        {
          label: 'test3',
          class: 'text-gray-900',
        }
      ]}
      xTicks={[
        [10, null],
        [20, null],
        [30, null],
        [40, null],
        [50, null],
      ]}
      
      yTicks={ [
        [0, ''],
        [250, null],
        [500, null],
        [750, null], 
        [1000,null],
      ]}
    
      formatValue={(val) => {
        return `${val}`;
      }}

      formatTick={(val, label, yAxis) => {
        if (typeof label === 'string')
          return label;
        if (yAxis)
          return `${val}`;
        return `${val}`;
      }}
      
      values={ [
        generateData(60, 800, 200),
        generateData(60, 500, 200),
        generateData(60, 300, 200),
      ] }
    >
    </GraphLib.LineChart>
  </div>
  <div class="h-40 md:h-auto flex-auto bg-gray-800 pl-16 py-8 pr-4">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'test2',
          class: 'text-blue-500',
          fill: false,
        },
        {
          label: 'test3',
          class: 'text-red-500',
          fill: false,
        },
      ]}
      xTicks={[
        [20, null],
        [40, null],
        [60, null],
        [80, null],
      ]}
      
      yTicks={ [
        [0, null],
        [250, null],
        [500, null],
        [750, null], 
        [1000,null],
      ]}
    
      formatValue={(val) => {
        return `${val}`;
      }}

      formatTick={(val, label, yAxis) => {
        if (typeof label === 'string')
          return label;
        if (yAxis)
          return `${val}`;
        return `${val}%`;
      }}
      
      values={ [
        generateData(100, 300, 200),
        generateData(100, 100, 300),
      ] }
    />
  </div>
</div>

<div class="bg-blue-900 p-4 rounded mt-4 flex md:flex-row text-sm font-arial mx-16 space-x-8 space-y-0 ">
  {#each [6,10, 16, 24] as size, index}
    <div  class="h-{size} w-{size*2}">
      <GraphLib.LineChart 
        styles={[
          {
            label: 'test',
            class: 'text-blue-300'
          }
        ]}
        yMax={1000}
        values={ [ generateData((index+1)*10, 500, 250)] }
      >
      </GraphLib.LineChart>
    </div>
  {/each}
  <div  class="h-32 w-16">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'test',
          class: 'text-blue-300'
        }
      ]}
      yMax={1000}
      values={ [ generateData(20, 500, 250) ] }
    >
    </GraphLib.LineChart>
  </div>
  <div  class="h-auto w-full">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'Blue',
          class: 'text-blue-700'
        },
        {
          label: 'Red',
          class: 'text-red-700 text-right'
        },
        {
          label: 'Green',
          class: 'text-green-700'
        }
      ]}
      yMax={1000}
      values={ [ 
        generateData(120, 400, 420),
        generateData(120, 500, 500),
        generateData(120, 600, 220),
        //[console.log(generateData(120, 600, 220).sort())]
      ] }
      formatValue={(val, info, index)=>{
        if (index === 0) return `${val} £`;
        if (index === 1) return `${val} $`;
        if (index === 2) return `${info.label}: ${val} €`;
        return `${val}`;
      }}
    >
    </GraphLib.LineChart>
  </div>
</div>

<div class="bg-gray-300 p-4 rounded mt-4 flex flex-col md:flex-row md:h-48 justify-between items-center text-sm font-arial mx-16 space-x-0 space-y-8 md:space-x-2 md:space-y-0">
  <div class="w-32 h-32 relative">
    <GraphLib.PieChart
      cutout={0}
      classLegend={'h-full'}
      values={[...Array(4).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-gray-500'},
        {label: 'label11',               class: 'text-gray-600'},
        {label: 'label12',               class: 'text-gray-700'},
        {label: 'label13',               class: 'text-gray-800'},
      ]}
    />
  </div>
  <div class="h-24 md:h-full w-48 md:w-64 pr-24 border border-gray-300 relative bg-black">
    <GraphLib.PieChart
      cutout={75}
      radius={90}
      centerX={95}
      centerY={5}
      circleTotal={25}
      circleOffset={180}
      reverseLegend={true}
      lineColor={'currentColor'}
      classLegend={'w-24 mr-24 h-full bg-gray-900'}
      formatValue={(val, info, index)=>{
        return `${val} pies`;
      }}
      values={ generateData(5, 20, 40).sort() }
      styles={[
        {label: 'label10',               class: 'text-yellow-400'},
        {label: 'label11',               class: 'text-yellow-500'},
        {label: 'label12',               class: 'text-orange-500'},
        {label: 'label13',               class: 'text-orange-600'},
        {label: 'label14',               class: 'text-orange-700'},
      ].reverse()}
    />
  </div>
  <div class="h-32 md:h-full w-64 pl-24 border border-gray-300 relative bg-blue-200 ">
    <GraphLib.PieChart
      cutout={0}
      leftLegend={true}
      classLegend={'w-24 ml-24 h-full bg-gray-200'}
      lineColor={'#ccf'}
      values={[...Array(5).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-blue-400'},
        {label: 'label11',               class: 'text-blue-500'},
        {label: 'label12',               class: 'text-blue-600'},
        {label: 'label13',               class: 'text-blue-700'},
        {label: 'label14',               class: 'text-gray-800'},
      ]}
    />
  </div>
  <div class="h-32 md:h-full p-1 w-64 border-8 bg-teal-500 border-teal-600 rounded-full">
    <GraphLib.Pie 
      cutout={60}
      values={[...Array(5).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-teal-500'},
        {label: 'label11',               class: 'text-teal-600'},
        {label: 'label12',               class: 'text-teal-700'},
        {label: 'label13',               class: 'text-teal-800'},
        {label: 'label14',               class: 'text-teal-900'},
      ]}
    />
  </div>
</div>


<div class="bg-blue-900 p-4 rounded mt-4 flex flex-row content-center text-sm font-arial mx-16 space-x-2 space-y-0">
  {#each [4, 6, 8, 10, 16, 24, 32, 40] as size, index}
    <div class="w-{size} h-{size} .flex-shrink-0">
      <GraphLib.Pie 
        cutout={index*10}
        lineColor={'currentColor'}
        values={[...Array(3).keys()].map(()=>Math.floor(Math.random()*10000))}
        styles={[
          {label: 'label10',               class: 'text-gray-500'},
          {label: 'label11',               class: 'text-gray-600'},
          {label: 'label12',               class: 'text-gray-700'},
        ]}
      />
    </div>
  {/each}
  <div class="p-0 h-40 w-auto flex-grow">
    <GraphLib.Pie
      lineColor={'currentColor'}
      values={[...Array(5).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-yellow-500'},
        {label: 'label11',               class: 'text-yellow-600'},
        {label: 'label12',               class: 'text-yellow-700'},
        {label: 'label13',               class: 'text-yellow-800'},
        {label: 'label14',               class: 'text-yellow-900'},
      ]}
    />
  </div>
</div>


<div class="bg-gray-200 p-4 rounded mt-4 flex flex-row md:h-48 justify-between text-sm font-arial mx-16">
  <div class="w-full h-40 md:h-full pl-16 p-4">
    <GraphLib.BarChart
      styles={[
        {label: 'label10',               class: 'text-teal-500'},
        {label: 'label11',               class: 'text-teal-600'},
        {label: 'label12',               class: 'text-teal-700'},
        {label: 'label13',               class: 'text-teal-800'},
        {label: 'label14',               class: 'text-teal-900'},
        {label: 'label15',               class: 'text-blue-500'},
        {label: 'label16',               class: 'text-blue-600'},
        {label: 'label17',               class: 'text-blue-700'},
        {label: 'label18',               class: 'text-blue-800'},
        {label: 'label19',               class: 'text-blue-900'},
      ]}

      formatValue={(val) => {
        return `${val}%`;
      }}
      values={[...Array(10).keys()].map(()=>Math.floor(Math.random()*100))}
    />
  </div>
  <div class="w-full h-32 pl-16 pt-4 pb-8 pr-8 relative bg-black">
    <GraphLib.BarChart
      styles={[
        {label: 'label10',               class: 'text-yellow-500'},
        {label: 'label11',               class: 'text-yellow-600'},
        {label: 'label12',               class: 'text-yellow-700'},
      ]}
      xMax={101}
      xTicks={[
        [25, null],
        [50, null],
        [75, null],
        [100, null],
      ]}
      values={[...Array(5).keys()].map(()=>Math.floor(Math.random()*100))}
      formatTick={(val, label, yAxis) => {
        if (typeof label === 'string')
          return label;
        if (yAxis)
          return `${val}%`;
        return val.toString();
      }}
    />
  </div>
</div>
