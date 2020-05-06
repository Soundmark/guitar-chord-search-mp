<template>
  <div class="index">
    <h3>吉他谱查找</h3>
    <div class="search">
      <input type="search" @confirm="goSearch" v-model="search" placeholder="暂只支持英文曲谱哦~" placeholder-class="placeholder">
    </div>
    <div class="github">
      <img src="../../../static/images/user1.png" @click="description">
      <a href="https://github.com/Soundmark">https://github.com/Soundmark</a>
    </div>
    <div class="modal" :animation="animationData">
      <div class="text">
        <img src="../../../static/images/user1.png">
        <p>本小程序内容仅供研究学习。</p>
        <p>如果发现bug可以联系我哦~</p>
        <p>beatboxzjh@163.com</p>
      </div>
      <div class="button" @click="closeModal">我知道了~</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      animationData: {}
    }
  },
  methods: {
    goSearch () {
      if (!this.search) return
      let url = '../list/main?search=' + this.search
      wx.navigateTo({url})
    },
    description () {
      let animation = mpvue.createAnimation({
        duration: 500
      })
      animation.opacity(1).step()
      this.animationData = animation.export()
    },
    closeModal () {
      let animation = mpvue.createAnimation({
        duration: 500
      })
      animation.opacity(0).step()
      this.animationData = animation.export()
    }
  },
  mounted () {
    wx.hideLoading()
    wx.showShareMenu()
    this.search = ''
  }
}
</script>

<style lang='less'>
@rem: 3.2vw;
.index {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(https://img.zg234.com/upload/25702/2019/05-14/20190514161345_3997ysxccsbx_small.jpg)
    0 0 ~"/" 100vw 100vh;
  h3 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 8%;
    color: white;
  }
  .search {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 15%;
    z-index: 1000;
    input {
      border: 1px solid #e6e6e6;
      border-radius: 5px;
      width: 250 / @rem;
      height: 25 / @rem;
      color: white;
    }
    .placeholder {
	    color: rgb(194, 194, 201);
    }
  }
  .github {
    position: absolute;
    width: 280 / @rem;
    top: 250 / @rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    img {
      width: 40 / @rem;
      height: 40 / @rem;
      vertical-align: middle;
    }
  }
  .modal{
    width: 170/@rem;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    background-color: rgb(255,255,255);
    box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    opacity: 0;
    .text{
      // height: 60/@rem;
      text-align: center;
      padding-top: 10/@rem;
      img{
        height: 15/@rem;
        width: 15/@rem;
      }
    }
    .button{
      height: 10%;
      text-align: center;
      margin-top: 10/@rem;
    }
  }
}
</style>
