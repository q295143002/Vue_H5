<template>
  <dialog :show.sync = 'show' @click = 'Close($event)'>
    <div class="pd-05">
      <h3 class="pb-05 theme-color-blue">{{title}}</h3>
      <div  style='max-height:300px;' class ='ta-l of-y-s'>
        <slot></slot>
      </div>
    </div>
  </dialog>
</template>
<script>
  import {Dialog} from 'vux-c'
  export default {
    components: {
      Dialog
    },
    props: {
      type: String,
      title: String,
      show: Boolean
    },
    methods: {
      Close (event) {
        if (event.target.className === 'weui_mask') {
          this.show = false
        }
      }
    }
  }
</script>