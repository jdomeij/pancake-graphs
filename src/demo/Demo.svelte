
<script lang="ts">
  // Import the router component
  // Normally, this would be import: `import Router from 'svelte-spa-router'`
  import Router from 'svelte-spa-router';

  // Import the "link" action and the methods to control history programmatically from the same module, as well as the location store
  import {location} from 'svelte-spa-router';
  
  // Import the "active" action
  // Normally, this would be import: `import active from 'svelte-spa-router/active'`
  import active from 'svelte-spa-router/active'

  // 
  import DemoPage_Default from './Demo.Default.svelte'
  import * as DemoPages from './demo-pages'; 

  let processDemoPages = (pages: object)=>{
    return Object.keys(pages).map((name)=> ({
      path: `/${name.toLowerCase()}`, 
      name, 
      component: pages[name] 
    } ) );
  };

  const DefaultRoute = { path: '/',     name: 'Default',  component: DemoPage_Default };

  const routes = [
    DefaultRoute,
    ...processDemoPages(DemoPages),
  ];

  let routesMap = routes.reduce((coll, x)=>{
    coll[x.path] = x.component;
    return coll;
  }, {})


</script>

<div class="w-full flex flex-row justify-center">
  <div class="mx-auto bg-white" style="min-width: 1000px;">
    <ul class="flex flex-row bg-blue-500">
      {#each routes as rowItem (rowItem.name)}
        <li><a class="route-link" href="#{rowItem.path}"  use:active={rowItem.path}>{rowItem.name}</a></li>
      {/each}
    </ul>

    <!-- Show the current path -->
    <span class="block p-2 text-blue-100 bg-blue-600">
    Current path: {$location}
    </span>
  </div>
</div>

<div class="my-2 mx-16" style="max-width: 1400px;">
  <!-- Show the router -->
  <Router routes={routesMap}/>

</div>

<style type="text/postcss">
/* Style for "active" links; need to mark this :global because the router adds the class directly */
.route-link {
  @apply block text-lg px-5 py-5 font-bold text-white outline-none;
}

.route-link:hover {
   @apply bg-blue-400;
}

:global(.route-link.active) {
  @apply bg-blue-600;
}

</style>