<template>
  <transition name="slide">
    <div class="food" v-show="showFlag">
      <div class="food-header clearfix">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div ref="foodImage" class="food-image" :style="bgStyle"></div>
      <scroll ref="foodContent" :data="foodArray" class="food-content">
        <div class="content-wrapper">
          <ul>
            <li>
              <h1 class="title">{{food.name}}</h1>
              <div class="detail">
                <span class="sell-count">月售{{food.sellCount}}份</span>
                <span class="rating">好评率{{food.rating}}</span>
              </div>
              <price :now="food.price" :old="oldPriceToString"></price>
              <div class="cartcontrol-wrapper">
                <cart-control :food="food"></cart-control>
              </div>
              <div @click="addFirst" class="buy" v-show="!food.count || food.count===0">
                加入购物车
              </div>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Vue from 'vue';
  import Price from 'base/price/price';
  import CartControl from 'base/cartcontrol/cartcontrol';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    computed: {
      bgStyle() {
        return `background-image:url(${this.food.image})`;
      },
      oldPriceToString() {
        return String(this.food.oldPrice);
      },
      foodArray() {
        return this._normalizeFoodArrry();
      }
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      _normalizeFoodArrry() {
        let arr = [];
        let _o1 = {
          name: this.food.name,
          sellCount: this.food.sellCount,
          rating: this.food.rating,
          price: this.food.price,
          oldPrice: this.food.oldPrice,
          count: this.food.count ? this.food.count : 0
        };
        let _o2 = {
          info: this.food.info
        };
        let _o3 = {
          ratings: this.food.ratings
        };
        arr.push(_o1, _o2, _o3);
        return arr;
      }
    },
    watch: {
      foodArray(newVal, oldVal) {
        console.log(newVal);
      }
    },
    components: {
      Scroll,
      Price,
      CartControl
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
    .food-content
      position: absolute
      top: 100vw
      bottom: 0
      width: 100%
      .content-wrapper
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          font-size: 0
          .sell-count, .rating
            font-size: 10px
            color: rgb(147, 153, 159)
          .sell-count
            margin-right: 12px
        .cartcontrol-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          border-radius: 12px
          font-size: 10px
          color: #fff
          background: rgb(0, 160, 220)
</style>
