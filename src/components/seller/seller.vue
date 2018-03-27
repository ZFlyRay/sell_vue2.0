<template>
  <scroll class="seller" :data="sellerArr" :click="click">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item, index) in seller.supports" :key="index">
            <icon :size="2" :type="item.type"></icon>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <scroll ref="picScroll" class="pic-wrapper" :scrollY="false" :scrollX="true" :data="seller.pics"
                :direction="direction"
                :eventPassthrough="eventPassthrough">
          <!--手动计算ul的宽度-->
          <ul class="pic-list" ref="picList">
            <li class="pic-item ignore" v-for="(pic, index) in seller.pics" :key="index">
              <img class="ignore" :src="pic">
            </li>
          </ul>
        </scroll>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Star from 'base/star/star';
  import Split from 'base/split/split';
  import Icon from 'base/icon/icon';
  import {saveToLocal, loadFromLocal} from 'common/js/store';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        sellerArr: [],
        click: true,
        direction: 'horizontal',
        eventPassthrough: true,
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      this._normalizeSellerToArr();
    },
    mounted() {
      // 从别的路由进入，初始化横向scroll计算宽度
      this._initPics();
    },
    methods: {
      toggleFavorite() {
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
      _normalizeSellerToArr() {
        this.sellerArr.push(this.seller);
      },
      _initPics() {
        if (this.seller.pics) {
          // 计算ul宽度
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
        }
      }
    },
    watch: {
      // 如果在seller这个页面刷新，需要初始化横向scroll 计算宽度
      seller() {
        this._initPics();
      }
    },
    components: {
      Scroll,
      Star,
      Split,
      Icon
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">
  @import "../../common/sass/mixin"

  .seller
    position: absolute
    left: 0
    top: 174px
    bottom: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        @include border-1px(rgba(7, 17, 27, .1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, .1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        width: 50px
        right: 11px
        top: 18px
        text-align: center
        font-size: 0
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        @include border-1px(rgba(7, 17, 27, .1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          @include border-1px(rgba(7, 17, 27, .1))
          font-size: 0
          &:last-child
            @include border-none
          .text
            display: inline-block
            vertical-align: top
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            &.ignore
              margin-right: 6px
              width: 120px
              height: 90px
            &:last-child
              margin-right: 0
            img
              &.ignore
                width: 120px
                height: 90px
    .info
      padding: 18px 18px 0 18px
      .title
        padding-bottom: 12px
        line-height: 14px
        @include border-1px(rgba(7, 17, 27, .1))
        font-size: 14px
        color: rgb(7, 17, 27)
      .info-item
        padding: 16px 12px
        @include border-1px(rgba(7, 17, 27, .1))
        &:last-child
          @include border-none
        line-height: 16px
        font-size: 12px
        font-weight: 200
        color: rgb(7, 17, 27)

</style>
