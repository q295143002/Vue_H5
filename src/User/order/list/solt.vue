<template>
  <!--pulldown slot-->
	<div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 40px; top: -60px; text-align: center;">
    <span v-show="pdownStatus === 'default'"></span>
    <span class="pulldown-arrow" v-show="pdownStatus === 'down' || pdownStatus === 'up'" :class="{'rotate': pdownStatus === 'up'}">↓</span>
    <span v-show="pdownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
  </div>
  <!--pullup slot-->
  <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px;bottom: -40px; text-align: center;">
    <span v-show="pupStatus === 'default'"></span>
    <span class="pullup-pulldown-arrow dp-ib" v-show="pupStatus === 'down' || pupStatus === 'up'" :class="{'rotate': pupStatus === 'up'}">↑</span>
    <span v-show="pupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
  </div>
</template>
<script>
import {Spinner} from 'vux-c'
export default {
  components: {
    Spinner
  },
  props: ['pdownStatus', 'pupStatus']
}
</script>
<style lang="less">
  .rotate {
    transform: rotate(-180deg);
  }
  .pulldown-arrow {
    display: inline-block;
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
  .pullup-arrow {
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
</style>