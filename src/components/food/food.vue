<template>
  <transition name="slide">
    <div class="food" v-show="showFlag">
      <div ref="foodHeader" class="food-header clearfix">
        <div class="back ignore" @click="hide">
          <i ref="backIcon" class="icon-arrow_lift ignore"></i>
        </div>
      </div>
      <div ref="foodImage" class="food-image" :style="bgStyle"></div>
      <div class="bg-layer" ref="layer"></div>
      <scroll ref="foodContent" @scroll="scroll" :data="foodArray" :probe-type="probeType" :listen-scroll="listenScroll"
              class="food-content">
        <div>
          <div class="content-wrapper">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好评率{{food.rating}}</span>
            </div>
            <price :now="food.price" :old="oldPriceToString"></price>
            <div class="cartcontrol-wrapper">
              <cart-control :food="food" @add="addFood"></cart-control>
            </div>
            <transition name="fade">
              <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
            </transition>
          </div>
          <split v-if="food.info"></split>
          <div class="info" v-if="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split v-if="food.ratings"></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <rating-select @select="selectRating" @toggle="toggleContent" :selectType="selectType"
                           :onlyContent="onlyContent" :desc="desc"
                           :ratings="food.ratings"></rating-select>
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px"
                    v-for="(rating, index) in food.ratings" :key="index">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" :src="rating.avatar">
                  </div>
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                暂无评价
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import {formatDate} from 'common/js/utils';
  import {prefixStyle} from 'common/js/dom';
  import Scroll from 'base/scroll/scroll';
  import Price from 'base/price/price';
  import CartControl from 'base/cartcontrol/cartcontrol';
  import Split from 'base/split/split';
  import ratingSelect from 'base/ratingselect/ratingselect';

  const transform = prefixStyle('transform');
  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        // scroll设置
        probeType: 3,
        listenScroll: true,
        scrollY: 0,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
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
    beforeUpdate() {
      // 进入/退出food页面时
      // 1、初始化layer的位置
      // 2、初始化scroll组件的内容滚动位置
      setTimeout(() => {
        this.$refs.layer.style[transform] = '';
        this.$refs.foodContent.scrollTo(0, 0);
        this.$refs.foodImage.style.paddingTop = '100%';
        this.$refs.foodImage.style.height = 0;
      }, 200);
    },
    updated() {
      this.foodImageHeight = this.$refs.foodImage.clientHeight;
      this.foodHeaderHeight = this.$refs.foodHeader.clientHeight;
      this.minTranslateY = -this.foodImageHeight + this.foodHeaderHeight;
      this.oMinTranslateY = this.minTranslateY * 0.9;
      // console.log(this.minTranslateY);
      // console.log(Math.floor(0.9 * this.minTranslateY));
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      addFood(target) {
        this.$emit('add', target);
      },
      selectRating(type) {
        this.selectType = type;
        this.$refs.foodContent.refresh();
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      scroll(pos) {
        this.scrollY = pos.y;
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
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY);
        let oTranslateY = this.oMinTranslateY;
        // let oPercent = Number(((newY - oTranslateY) / (this.minTranslateY * 0.1)).toFixed(3));
        let oPercent = (newY - oTranslateY) / (this.minTranslateY * 0.1);
        let zIndex = 0;
        let scale = 1;
        this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
        const percent = Math.abs(newY / this.foodImageHeight);

        if (newY > 0) {
          scale = 1 + percent;
          zIndex = 10;
        }
        if (newY < this.minTranslateY) {
          zIndex = 10;
          this.$refs.foodImage.style.paddingTop = 0;
          this.$refs.foodImage.style.height = `${this.foodHeaderHeight}px`;
        } else {
          this.$refs.foodImage.style.paddingTop = '100%';
          this.$refs.foodImage.style.height = 0;
          if (newY < 0.9 * this.minTranslateY) {
            console.log(newY);
            console.log(oPercent);
            // 0~0.2, 0.2~0.4, 0.4~0.6, 0.6~0.8, 0.8~1 改变透明度
            // if (oPercent >= 0 && oPercent <= 0.2) {
            //   this.$refs.foodHeader.style.background = 'rgba(255,255,255,0)';
            //   this.$refs.backIcon.style.color = '';
            // } else if (oPercent > 0.2 && oPercent <= 0.4) {
            //   this.$refs.foodHeader.style.background = 'rgba(255,255,255,0.2)';
            // } else if (oPercent > 0.4 && oPercent <= 0.6) {
            //   this.$refs.foodHeader.style.background = 'rgba(255,255,255,0.4)';
            // } else if (oPercent > 0.6 && oPercent <= 0.8) {
            //   this.$refs.foodHeader.style.background = 'rgba(255,255,255,0.6)';
            // } else if (oPercent > 0.8 && oPercent <= 1) {
            //   this.$refs.foodHeader.style.background = 'rgba(255,255,255,1)';
            //   this.$refs.backIcon.style.color = '#333';
            // }
          }
        }
        this.$refs.foodImage.style.zIndex = zIndex;
        this.$refs.foodImage.style[transform] = `scale(${scale})`;
      }
    },
    components: {
      Scroll,
      Price,
      CartControl,
      Split,
      ratingSelect
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">
  @import "../../common/sass/mixin"

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
      z-index: 30
      background: rgba(255, 255, 255, 0)
      .back
        position: relative
        float: left
        z-index: 50
        &.ignore
          margin: 4px 0 0 4px
          .icon-arrow_lift
            display: block
            color: #fff
            &.ignore
              padding: 10px
              font-size: 20px
    .food-image
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      transform-origin: top
      background-size: cover
    .bg-layer
      position: relative
      height: 100%
      background: #fff
    .food-content
      position: absolute
      top: 100vw
      bottom: 0
      width: 100%
      /*overflow: hidden*/
      .content-wrapper
        position: relative
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
          opacity: 1
          &.fade-enter-active, &.fade-leave-active
            transition: all .2s
          &.fade-enter, &.fade-leave-to
            opacity: 0
      .info
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)
        .text
          line-height: 24px
          padding: 0 8px
          font-size: 12px
          color: rgb(77, 85, 93)
      .rating
        padding-top: 18px
        .title
          line-height: 14px
          margin-left: 18px
          font-size: 14px
          color: rgb(7, 17, 27)
        .rating-wrapper
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            @include border-1px(rgba(7, 17, 27, .1))
            .user
              position: absolute
              right: 0
              top: 16px
              line-height: 12px
              font-size: 0
              .name
                display: inline-block
                margin-right: 6px
                vertical-align: top
                font-size: 10px
                color: rgb(147, 153, 159)
              .avatar
                display: inline-block
                vertical-align: top
                width: 12px
                height: 12px
                border-radius: 50%
            .time
              margin-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_down, .icon-thumb_up
                margin-right: 4px
                line-height: 16px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
</style>
