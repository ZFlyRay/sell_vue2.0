<template>
  <transition name="slide">
    <div class="food" v-show="showFlag">
      <div class="food-header clearfix">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="food-image" :style="bgStyle">
      </div>
      <scroll :data="foodArray" class="food-content">
        <div></div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        foodArray: []
      };
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.food.image})`;
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      }
    },
    components: {
      Scroll
    },
    watch: {
      food(newVal, oldVal) {
        console.log(newVal);
      }
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 40
    width: 100%
    background: #fff
    transform: translate3d(0, 0, 0)
    &.slide-enter-active, &.slide-leave-active
      transition: all .2s linear
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .food-header
      display: block
      position: absolute
      top: 0
      left: 0
      width: 100%
      opacity: 1
      .back
        position: relative
        float: left
        margin: 4px 0 0 4px
        z-index: 50
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .food-image
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      transform-origin: top
      background-size: cover
</style>
