<template>
  <sidebar
    title="周报"
    :toArray="['/week/aboutWeek/quick','/week/aboutWeek/other']"
    :ok="[true,true]"
    :name="['快捷周报','他人周报']"
    className="quick"
  ></sidebar>
</template>

<script>
  import sidebar from '../../../components/sidebar'
  export default{
    name: 'my',
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
