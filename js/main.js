var app = new Vue({
  el: '#app',
  data: {
    //timer関係
    status: "clear",
    time: 0,
    startTime: null,
    stopTime: 0,

    //画面遷移関係
    activeScreenNo: 1,

    //ドロワー関係
    drawerVisible: false,
    direction: 'rtl',//ドロワーの方向
    width: window.innerWidth,

    //設定関係
    selectedSettingNo: 0,
    settings: [
      {
        settingName: "4:6メソッド20g300ml",
        pairs: [
          { startTime: 0, targetAmount: 60 },
          { startTime: 40, targetAmount: 120 },
          { startTime: 90, targetAmount: 180 },
          { startTime: 130, targetAmount: 240 },
          { startTime: 160, targetAmount: 300 },
        ]
      },
      {
        settingName: "4:6メソッド14g200ml",
        pairs: [
          { startTime: 0, targetAmount: 40 },
          { startTime: 40, targetAmount: 80 },
          { startTime: 90, targetAmount: 120 },
          { startTime: 130, targetAmount: 160 },
          { startTime: 160, targetAmount: 200 },
        ]
      },
      {
        settingName: "テストデータ",
        pairs: [
          { startTime: 0, targetAmount: 10 },
          { startTime: 5, targetAmount: 20 },
          { startTime: 10, targetAmount: 30 },
        ]
      },
    ],
  },

  filters: {
  },

  computed: {// 何か処理をした結果をデータとして返す
    getTimerSecondValue: function () {
      return Math.floor(this.time / 1000)
    },
    drawerWidth: function () {//ページ表示時のウィンドウ幅に応じてダイアログのwidthを計算
      if (this.width < 640)
        return "50%";//モバイル端末のとき
      else
        return "30%";//PCのとき
    },
  },

  methods: {
    //現在のカウント値に基づき各抽出量行の色を変えるためのクラス名を返す
    getRowColor(idx) {
      let row_pairs = this.settings[this.selectedSettingNo].pairs;
      let s_time = row_pairs[idx].startTime;
      let next_row_time = row_pairs.length <= idx + 1 ? 999 : row_pairs[idx + 1].startTime;

      if (this.status !== "start")
        return { "normal-row": true }

      if (s_time <= this.getTimerSecondValue && this.getTimerSecondValue < next_row_time)
        return { "active-row": true }
      else if (this.getTimerSecondValue < s_time)
        return { "normal-row": true }
      else
        return { "inactive-row": true }
    },

    start() {
      this.status = "start"

      if (this.startTime === null) {
        this.startTime = Date.now()
      }

      const checkTime = () => {
        this.time = Date.now() - this.startTime + this.stopTime
      }
      this.timer = setInterval(checkTime, 10);
    },
    stop() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      this.status = "stop"
      this.startTime = null
      this.stopTime = this.time
    },
    reset() {
      this.stop()
      this.status = "clear"
      this.time = 0
      this.startTime = null
      this.stopTime = 0
    },
    getTimeStr() {
      // this.time is milliseconds
      // 1秒 = 1000ミリ秒
      // 1分 = 60 * 1000ミリ秒
      // 1時間 = 60 * 60 * 1000ミリ秒
      let milliseconds = this.time % 1000
      let seconds = Math.floor((this.time / 1000) % 60)
      let minutes = Math.floor((this.time / (60 * 1000)) % 60)
      //let hours = Math.floor(this.time / (60 * 60 * 1000))

      let millisecondsMultiplyTen = Math.floor(milliseconds / 10)

      millisecondsMultiplyTen = ("0" + millisecondsMultiplyTen).slice(-2)
      seconds = ("0" + seconds).slice(-2)
      minutes = ("0" + minutes).slice(-2)
      //hours = hours < 100 ? ("0" + hours).slice(-2) : hours

      return `${minutes}:${seconds}.${millisecondsMultiplyTen}`
    },

    handleResize: function () {
      // resizeのたびにやりたいことを記述
      this.width = window.innerWidth;
    },
  },

  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }

})
