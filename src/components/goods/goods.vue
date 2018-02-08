<template>
  <div class="goods">
    <scroll ref="menuWrapper" class="menu-wrapper" :data="goods" :click="true">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'active':currentIndex === index}"
            @click="selectMenu(index)">
          <span class="text border-1px"><icon v-show="item.type>0" :size="3"
                                              :type="item.type"></icon>{{item.name}}</span>
        </li>
      </ul>
    </scroll>
    <scroll ref="foodsWrapper" class="foods-wrapper" :data="goods" :click="true" :probeType="3" :listenScroll="true"
            @scroll="updateScrollY">
      <ul>
        <li class="food-list food-list-hook" v-for="(item, index) in goods" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food, index) in item.foods" :key="index" class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span><span class="old"
                                                                v-show="food.oldPrice">{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <shop-cart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
               :min-price="seller.minPrice"></shop-cart>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config';
  import Icon from 'base/icon/icon';
  import Scroll from 'base/scroll/scroll';
  import ShopCart from 'components/shopcart/shopcart';
  import CartControl from 'base/cartcontrol/cartcontrol';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      this.$http.get('./api/goods').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.goods = res.data;
          // this.$nextTick(() => {
          //   this._calculateHeight();
          // });
          setTimeout(() => {
            this._calculateHeight();
          }, 20);
        }
      });
    },
    methods: {
      updateScrollY(pos) {
        this.scrollY = Math.abs(Math.round(pos.y));
      },
      selectMenu(index) {
        let foodList = this.$refs.foodsWrapper.$el.getElementsByClassName('food-list-hook');
        let selectEl = foodList[index];
        this.$refs.foodsWrapper.scrollToElement(selectEl, 300);
      },
      _calculateHeight() {
        // console.log(this.$refs.foodsWrapper.$el.getElementsByClassName('food-list-hook'));
        let foodList = this.$refs.foodsWrapper.$el.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    components: {
      Icon,
      Scroll,
      ShopCart,
      CartControl
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">
  @import "../../common/sass/mixin"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.active
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            @include border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          @include border-1px(rgba(7, 17, 27, .1))
        &:last-child
          .text
            @include border-none()
    .foods-wrapper
      flex: 1
      .food-list
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          color: rgb(147, 153, 159)
          background: #f3f5f7
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          @include border-1px(rgba(7, 17, 27, .1))
          &:last-child
            @include border-none()
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            margin-right: 10px
            img
              width: 57px
              height: 57px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              line-height: 14px
              font-size: 14px
              color: rgb(7, 17, 27)
            .desc, .extra
              margin-bottom: 8px
              line-height: 10px
              font-size: 10px
              color: rgb(147, 153, 159)
            .desc
              margin-bottom: 8px
              line-height: 12px
            .extra
              .count
                margin-right: 12px
            .price
              line-height: 24px
              font-weight: 700
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240, 20, 20)
              .old
                text-decoration: line-through
                font-size: 10px
                color: rgb(147, 153, 159)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px
</style>
