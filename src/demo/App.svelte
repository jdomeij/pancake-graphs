<script lang="ts">
  import * as GraphLib from '../package.dist';

  function generateData(num: number, yOffset: number, yMax: number, yFloor: number=0): number[] {
    let interval = Math.floor(Math.random()*(num/4))+1;
    return [...Array(num).keys()].map( (v, i) => ( Math.floor((i%interval==0?(Math.random()*yOffset):0)+Math.random()*yMax + yFloor)) );
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
          rawRender: true,
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
    
      formatValue={(val, info, label) => {
        if (info.rawRender) {
          return '<div class="flex flex-row justify-end items-center bg-gray-300">'+
                 `<span class="inline-block">${val}</span>`+
                 `<span class="inline-block mx-2 w-3 h-3 bg-current rounded-full border border-current ${info.class}"></span></div>`;
                 
        }
        return `${val} ${info.label}`;
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

<div class="bg-gradient-to-r from-gray-700 via-blue-600 to-green-600 p-4 rounded mt-4 flex md:flex-row text-sm font-arial mx-16 space-x-8 space-y-0 h-48">
  <div  class="h-auto w-full">
    <GraphLib.LineChart
      tooltipTitle={"Title"} 
      styles={[
        {
          label: '(Total)',
          class: 'text-gray-500',
          fill: true,
          line: false,
        },
        {
          label: '(A)',
          class: 'text-green-500',
          fill: false,
        },
        {
          label: '(B)',
          class: 'text-blue-500',
          fill: false,
        }
      ]}
      values={ (()=>{
          let a = generateData(240, 200, 150, 400);
          let b = generateData(240, 300, 300, 200);
      
          return [
            a.map((v, i)=>a[i] + b[i]),
            a,
            b
          ];
        })() }
      yMax={1000}
      formatValue={(val, info)=>{
        return `${val.toString()} ${info.label || ''}` ;
      }}
    >
    </GraphLib.LineChart>
  </div>
</div>


<div class="bg-gray-300 p-4 rounded mt-4 flex flex-col md:flex-row md:h-48 justify-between items-center text-sm font-arial mx-16 space-x-0 space-y-8 md:space-x-2 md:space-y-0">
  <div class="w-64 pr-32 h-32 relative">
    <GraphLib.PieChart
      lineWidth={1}
      lineColor={'#310'}
      classLegend={'h-full mr-32 overflow-y-hidden'}
      values={[...Array(4).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-orange-500'},
        {label: 'label11',               class: 'text-orange-600'},
        {label: 'label12',               class: 'text-orange-700'},
        {label: 'label13',               class: 'text-orange-800'},
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
      lineWidth={0.5}
      lineColor={'black'}
      
      classLegend={'w-24 mr-24 h-full bg-gray-900 text-gray-700'}
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

  <div class="md:h-full pl-36 relative bg-white p-0" style="width: 10rem;">
    <GraphLib.PieChart
      cutout={50}
      leftLegend={true}
      classLegend={'w-36 h-full'}
      lineColor={'#fff'}
      lineWidth={1}
      values={[30, 2, 2, 2, 2, 2, 2]}
      styles={[
        {label: 'test1', color: '#BEE3F8'},
        {label: 'boobooo', color: '#90CDF4'},
        {label: 'svelte', color: '#63B3ED'},
        {label: 'test123', color: '#4299E1'},
        {label: '123test', color: '#3182CE'},
        {label: 'value', color: '#2B6CB0'},
        {label: 'aaa', color: '#2C5282'},
      ].reverse()}
      />
      <!--
        values={[...Array(5).keys()].map((i)=>Math.floor(Math.random()*10000+(i*1000))).reverse()}
        {label: 'label10',               color: 'hsl(205, 41%, 45.9%)'},
        {label: 'label11',               color: 'hsl(204.9, 39.2%, 52.9%)'},
        {label: 'label12',               color: 'hsl(205, 38.3%, 63.1%)'},
        {label: 'label13',               color: 'hsl(204.9, 35%, 77.1%)'},
        {label: 'label14',               color: 'hsl(202.5, 30.8%, 94.9%)'},
      ]}
      -->
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
        lineWidth={0}
        tooltip={false}
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
      lineWidth={0}
      values={[...Array(5).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-blue-800'},
        {label: 'label11',               class: 'text-blue-700'},
        {label: 'label12',               class: 'text-blue-600'},
        {label: 'label13',               class: 'text-blue-600'},
        {label: 'label14',               class: 'text-blue-500'},
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

