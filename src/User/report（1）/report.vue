<template>
  <div>
  <report-display></report-display>
  </div>
</template>
<script>
  import reportDisplay from './sub/report-display'
  export default {
    components: {
      reportDisplay
    }
  }
</script>

<style>
  .fade-transition {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>
