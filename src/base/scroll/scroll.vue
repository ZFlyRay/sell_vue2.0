<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';

  const DIRECTION_H = 'horizontal';
  const DIRECTION_V = 'vertical';

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      scrollY: {
        type: Boolean,
        default: true
      },
      scrollX: {
        type: Boolean,
        default: false
      },
      click: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      direction: {
        type: String,
        default: DIRECTION_V
      },
      eventPassthrough: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
      }, 20);
    },
    computed: {
      com_eventPassthrough() {
        return this.eventPassthrough ? this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V : '';
      }
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return;
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          scrollY: this.scrollY,
          scrollX: this.scrollX,
          probeType: this.probeType,
          click: this.click,
          // eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
          eventPassthrough: this.com_eventPassthrough
        });

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos);
          });
        }
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, this.refreshDelay);
      }
    }
  };
</script>

<style scoped lang="sass" type="text/sass" rel="stylesheet/sass">

</style>
