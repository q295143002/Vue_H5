<template>
<div class="w-tip-name">
  <alert :show.sync="show" button-text='确定' title="输入提示">
    <div class="w-editpsg-tip">
      <p>1.请确保姓名与证件上的一致</p>
      <p>2.若用护照登机，请确保护照上有中文姓名</p>
      <p>3.中文姓名中的生僻字可用拼音代替，拼音之后不可再输入汉字，拼音后面的汉字都用拼音代替。如:"张燊林"可输入为:"张shenlin"</p>
      <p>4.姓名中如有".-"等特殊字符，不用输入。如"沙塔尔·买买提"可输入为"沙塔尔买买提"</p>
      <p>5.英文姓名总长度为55个字符，若过长请使用缩写。</p>
      <p>6.英文名填写说明:请按照lastname(姓),middleName(中间名),firstname(名)格式填写,之间用空格区分。如果姓名中有特殊字符".-()"等，可不用输入。
      如"steve p.(aul) jobs"输入为"jobs steve paul"。</p>
      <p>7.姓名过长时请使用缩写,如：Sheikn khalifa bin Zayed Alyle Nahyan 简写为Sheikh khalifa b Z A N;"买买提不拉多娜萨日娜阿诺凡"简写为"买买提不拉多娜萨日娜阿"</p>
    </div>
  </alert>
</div>
</template>
<script>
import {Alert} from 'vux-c'
export default {
  components: {
    Alert
  },
  data () {
    return {}
  },
  props: {
    show: Boolean
  }
}
</script>