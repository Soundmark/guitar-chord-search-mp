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
        :class="currentPage==item?'current':''" @click="changePage(item)">{{item}}</li>
        <li :class="pagination.next" @click="nextPage">&raquo;</li>
      </ul>
    </div>
  </div>
</template>

<script>
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
      // 调用云函数请求数据
      wx.cloud.callFunction({
        name: 'getList',
        data: {
          search: this.search,
          currentPage: this.currentPage
        }
      }).then(res => {
        console.log('调用了云函数')
        console.log(res.result)
        let dataList = res.result.results.filter(item => item.artist_id)
        // console.log(dataList)
        dataList.forEach(item => {
          let data = {}
          data.song = item.song_name
          data.artist = item.artist_name
          data.link = item.tab_url
          data.hot = item.votes
          list.push(data)
        })
        this.list = list
        // 获取分页
        let total = res.result.pagination.total
        if (total > 1) {
          this.pagination.show = true
          let arr = []
          let i
          switch (this.currentPage) {
            case 1 || 2:
              i = 1
              break
            case total || (total - 1):
              i = Math.max(1, total - 4)
              break
            default:
              i = Math.max(1, this.currentPage - 2)
          }
          let maxPage = Math.min(i + 4, total)
          for (i; i <= maxPage; i++) {
            arr.push(i)
          }
          this.pagination.arr = arr
        }
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
    },
    changePage (newPage) {
      if (newPage !== this.currentPage) {
        this.currentPage = newPage
        this.searchList()
        this.goTop()
      }
    },
    prePage () {
      if (this.pagination.pre !== 'disabled') {
        this.currentPage -= 1
        this.searchList()
        this.goTop()
      }
    },
    nextPage () {
      if (this.pagination.next !== 'disabled') {
        this.currentPage += 1
        this.searchList()
        this.goTop()
      }
    },
    // 页面回到顶部
    goTop () {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
      this.showSearch = true
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
  mounted () {
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