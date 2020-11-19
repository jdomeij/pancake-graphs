<script lang="ts">
  import * as GraphLib from '../package.dist';

  function generateData(num: number, yOffset: number, yMax: number, yFloor: number=0): number[] {
    let interval = Math.floor(Math.random()*(num/4))+1;
    return [...Array(num).keys()].map( (_, i) => ( Math.floor((i%interval==0?(Math.random()*yOffset):0)+Math.random()*yMax + yFloor)) );
  }

</script>

<div class="flex flex-row p-4 m-4 border border-blue-200 bg-gray-100 h-48">
  <div class="m-4 pl-8 p-4 flex-grow">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'Line',
          class: 'text-yellow-500',
        }
      ]}
      yTicks={[
        250,
        500,
      ]}
      xTicks={[
        [59, '60'],
        [119, 'max'],
      ]}
      values={ [ generateData(120, 200, 300) ] }
    >
    </GraphLib.LineChart>
  </div>
  <div class="w-48 pl-12 pb-8 h-full relative">
    <GraphLib.PieChart
      lineWidth={1}
      lineColor={'white'}
      cutout={55}
      centerX={90}
      circleTotal={180}
      circleOffset={180}
      leftLegend={true}
      reverseLegend={true}
      classLegend={'h-full w-24 ml-24 overflow-y-hidden text-gray-800 text-sm'}
      values={[...Array(4).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label23',               class: 'text-yellow-700'},
        {label: 'label22',               class: 'text-yellow-600'},
        {label: 'label21',               class: 'text-yellow-500'},
        {label: 'label20',               class: 'text-yellow-400'},
      ]}
    />
  </div>
  <div class="w-48 pb-8 pr-16 h-full relative">
    <GraphLib.PieChart
      lineWidth={0}
      circleTotal={180}
      centerX={10}
      lineColor={'rgb(156, 66, 33)'}
      classLegend={'h-full mr-32 overflow-y-hidden text-gray-900 text-sm'}
      values={[...Array(4).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-yellow-500'},
        {label: 'label11',               class: 'text-yellow-600'},
        {label: 'label12',               class: 'text-yellow-700'},
        {label: 'label13',               class: 'text-yellow-800'},
      ]}
    />
  </div>

</div>

<div class="flex flex-row p-4 m-4 border border-blue-200 bg-gray-100 h-48">
  <div class="w-1/2 h-40 md:h-full pl-16 p-4">
    <GraphLib.BarChart
      styles={[
        {label: 'label10',               class: 'text-green-500'},
        {label: 'label11',               class: 'text-green-600'},
        {label: 'label12',               class: 'text-green-700'},
        {label: 'label13',               class: 'text-green-800'},
        {label: 'label14',               class: 'text-green-900'},
        {label: 'label15',               class: 'text-blue-500'},
        {label: 'label16',               class: 'text-blue-600'},
        {label: 'label17',               class: 'text-blue-700'},
        {label: 'label18',               class: 'text-blue-800'},
        {label: 'label19',               class: 'text-blue-900'},
      ]}

      xTicks={[
        25,
        50,
        75,
        100,
      ]}
      xMax={100}
      formatTick={(val, label, isY)=>{
        if (label) return label;
        if (isY) return `${val}%`;
        return val.toString();
      }}
      formatValue={(val) => {
        return `${val}%`;
      }}
      values={[...Array(10).keys()].map(()=>Math.floor(Math.random()*100))}
    />
  </div>

  <div class="w-1/2 h-40 md:h-full pl-16 p-4">
    <GraphLib.LineChart 
      styles={[
        {
          label: 'test2',
          class: 'text-blue-200',
          fill: true,
        },
        {
          line: 1,
          label: 'test3',
          class: 'text-red-500',
          fill: false,
          rawRender: true,
        },
      ]}
      xTicks={[
        20,
        40,
        60,
        80,
      ]}
      
      yTicks={ [
        0,
        250,
        500,
        750, 
        1000,
      ]}
    
      formatValue={(val, info) => {
        if (info.rawRender) {
          return '<div class="flex flex-row justify-end items-center bg-gray-300">'+
                 `<span class="inline-block">${info.label} - ${val}</span>`+
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
        generateData(100, 600, 500),
        generateData(100, 300, 400),
      ] }
    />
  </div>

</div>


<div class="flex flex-row p-4 m-4 border border-blue-200 bg-gray-100 h-48">
  <div class="h-40 w-2/5">
    <GraphLib.Pie
      lineWidth={2}
      lineColor={'rgb(42, 67, 101)'}
      values={[...Array(4).keys()].map(()=>Math.floor(Math.random()*10000))}
      styles={[
        {label: 'label10',               class: 'text-blue-400'},
        {label: 'label11',               class: 'text-blue-500'},
        {label: 'label12',               class: 'text-blue-600'},
        {label: 'label13',               class: 'text-blue-700'},
      ]}
      tooltip={false}
    />
  </div>
  <div class="m-4 w-1/5 border-2 border-gray-200 bg-gray-800">
    <GraphLib.LineChart 
      styles={[
        {
          line: 1.5,
          fill: true,
          label: 'Line',
          class: 'text-gray-200',
        }
      ]}
      tooltip={false}
      yMax={500}
      values={ [ generateData(50, 200, 300) ] }
    >
    </GraphLib.LineChart>
  </div>
</div>
