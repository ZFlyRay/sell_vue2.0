<template>
  <span class="icon" :class="cls"></span>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      size: {
        type: Number,
        default: 1
      },
      type: {
        type: Number,
        default: -1
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    computed: {
      cls() {
        return `size-${this.size} ${this.classMap[this.type]}`;
      }
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">
  @import '../../common/sass/mixin'

  .icon
    display: inline-block
    vertical-align: top
    background-repeat: no-repeat
    &.size-1
      width: 12px
      height: 12px
      margin-right: 4px
      background-size: 12px 12px
      &.decrease
        @include bg-image('decrease_1')
      &.discount
        @include bg-image('discount_1')
      &.guarantee
        @include bg-image('guarantee_1')
      &.invoice
        @include bg-image('invoice_1')
      &.special
        @include bg-image('special_1')
    &.size-2
      width: 16px
      height: 16px
      margin-right: 6px
      background-size: 16px 16px
      &.decrease
        @include bg-image('decrease_2')
      &.discount
        @include bg-image('discount_2')
      &.guarantee
        @include bg-image('guarantee_2')
      &.invoice
        @include bg-image('invoice_2')
      &.special
        @include bg-image('special_2')
    &.size-3
      width: 12px
      height: 12px
      margin-right: 2px
      background-size: 12px 12px
      &.decrease
        @include bg-image('decrease_3')
      &.discount
        @include bg-image('discount_3')
      &.guarantee
        @include bg-image('guarantee_3')
      &.invoice
        @include bg-image('invoice_3')
      &.special
        @include bg-image('special_3')
</style>
