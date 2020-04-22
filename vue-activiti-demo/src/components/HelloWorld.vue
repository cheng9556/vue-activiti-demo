<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>易样</h2>
    <h2>github地址：https://griabcrh.github.io/</h2>
    <h2>公众号：java开发高级进阶</h2>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '作者简介'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
