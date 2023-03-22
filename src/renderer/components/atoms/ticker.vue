<template>
  <time>{{ fromS(duration, 'hh:mm:ss') }}</time>
</template>

<script>
import { fromS } from 'hh-mm-ss';
import { parseISO, differenceInSeconds } from 'date-fns';

export default {
  timers: {
    updateDuration: {
      time: 500,
      autostart: true,
      repeat: true
    }
  },
  props: {
    startedAt: {
      type: String,
      default: undefined
    },
    flagconpau: {
      type: Boolean,
      default: false
    },
    flagstrstp: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fromS,
      elapsedtime: 0,
      started: parseISO(this.startedAt),
      stopped: parseISO(
        new Date()
          .toISOString()
          .substr(0, 19)
          .replace('T', ' ')
      )
    };
  },
  computed: {
    duration() {
      if (!this.flagconpau) return this.elapsedtime;
      var ret = differenceInSeconds(this.stopped, this.started) || 0;
      ret = Math.max(ret, 0);
      return ret + this.elapsedtime;
    }
  },
  watch: {
    startedAt: function(val) {
      this.started = parseISO(val);
    }
  },
  methods: {
    updateDuration() {
      if (typeof this.startedAt === 'undefined') {
        if (!this.flagstrstp) {
          this.elapsedtime = 0;
          // this.$timer.stop('updateDuration');
        }
        return;
      }

      if (!this.flagconpau) return;

      this.started = parseISO(this.startedAt);
      this.stopped = parseISO(
        new Date()
          .toISOString()
          .substr(0, 19)
          .replace('T', ' ')
      );
    },
    setElapsed() {
      this.elapsedtime = this.duration;
    }
  }
};
</script>
