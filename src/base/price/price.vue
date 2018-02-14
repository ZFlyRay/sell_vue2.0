<template>
  <div class="price">
    <span class="now">¥{{now}}</span><span class="old" v-show="old.length>0">¥{{old}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      now: {
        type: Number,
        default: 0
      },
      old: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">
  .price
    line-height: 24px
    font-weight: 700
    font-size: 0
    .now
      margin-right: 8px
      font-size: 14px
      color: rgb(240, 20, 20)
    .old
      text-decoration: line-through
      font-size: 10px
      color: rgb(147, 153, 159)
</style>
