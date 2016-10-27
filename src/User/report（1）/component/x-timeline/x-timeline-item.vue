<template>
	<li class="vux-timeline-item">
		<div :class=" {'vux-timeline-item-head': !current,'vux-timeline-item-head-first': current }" :style="headStyle">
			<icon v-show="current" type="success_no_circle" class="vux-timeline-item-checked"></icon>
		</div>
		<div class="vux-timeline-item-tail" :style="tailStyle"></div>
		<div class="vux-timeline-item-content">
			<slot ></slot>
		</div>
	</li>
</template>

<script>
import {Icon} from 'vux-c'
export default {
  props: {
    current: Boolean
  },
  data () {
    return {
      isLast: true,
      isFirst: true,
      headStyle: { backgroundColor: this.$parent.color }
    }
  },
  ready () {
    this.$parent.setChildProps()
  },
  beforeDestroy () {
    // this will be null
    const $parent = this.$parent
    this.$nextTick(() => {
      $parent.setChildProps()
    })
  },
  components: {
    Icon
  },
  computed: {
    tailStyle () {
      return this.isLast ? { display: 'none', backgroundColor: this.$parent.color } : { display: 'block', backgroundColor: this.$parent.color }
    }
  }
}
</script>

