<template v-slot:header>
<!-- <label>
  {{ label }}
  <input
    v-bind="$attrs"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
  >
</label> -->
<label>
      {{ label }}
      <button
      ></button>
      <slot name="header">header</slot>
      <slot name="footer">footer</slot>
      <slot>我只是一个默默无闻的slot</slot>
</label>
</template>
<script>
export default {
    inheritAttrs: false,
    name:'base-input',
    props: ['label', 'value'],
    created(){
      this.$emit('hellodad','爸爸,我想你了');
    }
}
</script>
<style scoped>
button{
    width: 20px;
    height: 20px;
    background-color: #000;
}
</style>