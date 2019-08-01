<template>
  <sidebar
    title="同事"
    :toArray="['/week/workmate/pm','/week/workmate/ios','/week/workmate/frontEnd','/week/workmate/backEnd','/week/workmate/Android']"
    :ok="[true,true,true,true,true]"
    :name="['在职产品组','在职IOS组','在职前端组','在职后台组','在职Android组']"
    className="workmate"
  ></sidebar>
</template>
<script>
  import sidebar from '../../../components/sidebar'
  export default{
    name: 'workmate',
    data () {
      return {
      }
    },
    components:{
      sidebar
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
