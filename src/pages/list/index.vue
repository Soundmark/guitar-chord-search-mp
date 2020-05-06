<template>
  <div class="list" @touchmove="touchMove" @touchstart='touchStart'>
    <div class="search" v-if="showSearch">
      <a href="../index/main">取消</a>
      <input type="search" v-model="search" @confirm="searchList"/>
    </div>
    <div class="main" >
      <ul>
        <li class="item" v-for="(item, index) in list" :key="index">
          <a :href="'../chord/main?link=' + item.link">
            <div class="title">
              <h4>{{item.song}}</h4>
              <h6>{{item.artist}}</h6>
            </div>
            <div class="hot">
              <span>热度{{item.hot?item.hot:0}}</span>
            </div>
          </a>
        </li>
      </ul>
      <ul class="pagination" v-if="pagination.show">
        <li :class="pagination.pre" @click="prePage">&laquo;</li>
        <li v-for="(item, index) in pagination.arr" :key="index"
        :class="currentPage==item?'current':''">{{item}}</li>
        <li :class="pagination.next" @click="nextPage">&raquo;</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Request from '@/utils/request.js'
export default {
  data () {
    return {
      search: '',
      showSearch: true,
      list: [],
      pagination: {
        show: false,
        pre: 'disabled'
      },
      currentPage: 1,
      showFail: false,
      touch: {}
    }
  },
  methods: {
    searchList () {
      if (!this.search) return
      let list = []
      wx.showLoading({
        title: '加载中'
      })
      let url = 'https://www.ultimate-guitar.com/search.php?title=' + this.search + '&page=' + this.currentPage + '&type=300'
      let request = new Request()
      request.get(url).then(res => {
        let data = res.data.replace(/&nbsp;/g, ' ')
        let test = data.match(/<article[\s\S]+<\/article>/g)[0]
        let arr = test.split('<article class="clearfix ugm-list--link js-tapped js-bottom-sheet-target" ' || '</article>')
        arr.shift()
        arr = arr.filter(item => {
          if (item.match(/CRD(?=\s*<)/)) {
            return true
          }
        })
        arr.forEach(item => {
          let data = {}
          data.song = item.match(/(?<=link-song">)[\w\s()]+(?=<\/a>)/) || item.match(/(?<=link-song">\s*)[\w\s()<>/.'&-]+<\/b>[\s\w().'&-]*(?=\s*<\/a>)/)
          if (data.song) data.song = data.song[0].replace(/<b>|<\/b>/g, '')
          data.artist = item.match(/(?<="\s*>\n)[\w\s()/<>.'&-]+(?=<\/a>\s*<\/footer>)/)
          if (data.artist) data.artist = data.artist[0].replace(/<b>|<\/b>/g, '')
          data.link = item.match(/"https:[\w/\-.]+"/)[0].replace('https://tabs.ultimate-guitar.com/tab', '').replace(/"/g, '')
          data.hot = item.match(/(?<=text-left">)\d+(?=<\/span>)/)
          list.push(data)
        })
        this.list = list
        // let artist = arr[0].match(/(?<="\s*>\n)[\w\s/<>]+(?=<\/a>\s*<\/footer>)/)[0].replace(/<b>|<\/b>/g, '')
        // 获取分页数据
        let myPagination = data.match(/(?<=<ul class="pagination">)[\s\S]+(?=<\/ul>)/)
        // 判断是否需要分页，数据太少时无需分页
        if (myPagination) {
          myPagination = myPagination[0].split('<li' || '</li>')
          myPagination.shift()
          this.pagination.pre = ''
          this.pagination.next = ''
          if (myPagination[0].match(/disabled/)) this.pagination.pre = 'disabled'
          if (myPagination[myPagination.length - 1].match(/disabled/)) this.pagination.next = 'disabled'
          let pgiArr = []
          for (let i = 1; i < myPagination.length - 1; i++) {
            let page = myPagination[i].match(/(?<=>)\d+(?=<)/)[0]
            pgiArr.push(page)
          }
          this.pagination.arr = pgiArr
          this.pagination.show = true
        }
        wx.hideLoading()
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '加载失败，请重试!',
          icon: 'none',
          duration: 1500
        })
      })
    },
    prePage () {
      if (this.pagination.pre !== 'disabled') {
        this.currentPage -= 1
        this.searchList()
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        this.showSearch = true
      }
    },
    nextPage () {
      if (this.pagination.next !== 'disabled') {
        this.currentPage += 1
        this.searchList()
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        this.showSearch = true
      }
    },
    touchStart (e) {
      this.touch.before = e.clientY
    },
    touchMove (e) {
      this.touch.current = e.clientY
      if (this.touch.current - this.touch.before >= 0) {
        // 向上滚动
        this.showSearch = true
      } else {
        // 向下滚动
        this.showSearch = false
      }
    }
  },
  created () {
    wx.showLoading({
      title: '加载中'
    })
  },
  mounted () {
    wx.hideLoading()
    this.search = this.$root.$mp.query.search
    if (this.search) {
      this.searchList()
    }
  }
}
</script>

<style lang='less'>
@rem: 3.2vw;
.list {
  position: relative;
  .search {
    text-align: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 320/@rem;
    background-color: #fff;
    a {
      display: inline-block;
      vertical-align: middle;
    }
    input {
      border: 1px solid #e6e6e6;
      border-radius: 5px;
      width: 250 / @rem;
      height: 25/@rem;
      display: inline-block;
      margin-left: 5 / @rem;
      vertical-align: middle;
      text-align: left;
    }
  }
  .main{
    margin-top: 26/@rem;
    border-top: 1px solid #e6e6e6;
    .item{
      border-bottom: 1px solid #e6e6e6;
      height: 50/@rem;
      a{
        height: 50/@rem;
      }
      div{
        display: inline-block;
      }
      .title{
        padding-top: 5/@rem;
        padding-left: 5/@rem;
        h4{
          width: 250/@rem;
          height: 20.8/@rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        h6{
          font-size: 10/@rem;
          margin-top: 5/@rem;
        }
      }
      .hot{
        float: right;
        font-size: 12/@rem;
        padding-top: 14/@rem;
        padding-right: 5/@rem;
      }
    }
    .pagination{
      display: flex;
      height: 40/@rem;
      justify-content: center;
      li{
        height: 40/@rem;
        line-height: 40/@rem;
        padding: 0 10/@rem;
      }
      .disabled{
        color: #e6e6e6;
      }
      .current{
        color: rgb(71, 141, 245);
      }
    }
  }
}
</style>