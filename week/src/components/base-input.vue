<template>
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
      <input
        v-bind="$attrs"
        v-bind:value="value"
      >
      <button
        v-on="inputListeners"
      ></button>
</label>
</template>
<script>
export default {
    inheritAttrs: false,
    name:'base-input',
    props: ['label', 'value'],
    computed: {
        inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
        //   input: function (event) {
        //     vm.$emit('input', event.target.value)
        //   }
            button: function (event) {
            vm.$emit('click', event.target.value)
          }
        }
      )
    }
  },
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