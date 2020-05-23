<template>
  <div class="chord">
    <div class="title" v-if="showTitle">
      <h2>{{song}}</h2>
      <h5>{{artist}}</h5>
      <p v-if="capo">Capo:{{capo}}</p>
    </div>
    <div class="main">
      <rich-text :nodes="content"></rich-text>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
// import Request from '@/utils/request.js'
export default {
  data () {
    return {
      artist: '',
      song: '',
      content: '',
      capo: '',
      showTitle: false
    }
  },
  mounted () {
    wx.showLoading({
      title: '加载中'
    })
    let url = this.$root.$mp.query.link
    wx.cloud.callFunction({
      name: 'getChord',
      data: {
        url
      }
    }).then(res => {
      // console.log(res.result)
      let chord = res.result.tab_view.wiki_tab.content
      chord = chord.replace(/\[ch\]/g, '<b style="background-color:#a4a4a4;">').replace(/\[\/ch\]/g, '</b>').replace(/\[tab\]/g, '<div>').replace(/\[\/tab\]/g, '</div>')
      this.content = '<pre style="font:微软雅黑;">' + chord + '</pre>'
      this.artist = res.result.tab.artist_name
      this.song = res.result.tab.song_name
      if (res.result.tab_view.meta.capo) {
        this.capo = res.result.tab_view.meta.capo + 'st fret'
      }
      this.showTitle = true
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '加载失败，请重试!',
        icon: 'none',
        duration: 1500
      })
    })
  }
}
</script>

<style lang="less">
@rem: 3.2vw;
.chord{
  min-width: 100vw;
  min-height: 100vh;
  background: url(https://pic.52112.com/180404/180404_82/o18n4kTAix_small.jpg) rgb(201,177,143);
  .title{
    padding-left: 10/@rem;
    padding-bottom: 10/@rem;
    border-bottom: .5px solid rgb(94, 92, 89);
    h2{
      font-size: 18/@rem;
      height: 28/@rem;
      line-height: 28/@rem;
      padding-top: 10/@rem;
    }
    h5, p{
      font-size: 15/@rem;
    }
  }
  .main{
    white-space: pre;
    overflow: scroll;
    padding-left: 10/@rem;
    b{
      color: red;
    }
  }
}
</style>