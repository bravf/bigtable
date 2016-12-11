declare let Vue, jc, $, require

import tableData from './data'
import * as util from './util'

// 格式化scheme
tableData.scheme.forEach((_, idx)=>{
    _['width'] = 120
    _['cellIdx'] = idx
})

let datas = []

// 复制多行data
for (let i = 0; i < 30; i++) {
    datas.push(JSON.parse(JSON.stringify(tableData.data[0])))
}
datas.forEach((_, i) => {
    _[0] = '清迈' + i.toString()
    _[2] = '落地签' + i.toString()
})


const vm  = window['vm'] =  new Vue({
    el: '#bigtable',
    data: {
        sourceData: tableData,
        numbers: {
            dataCount: datas.length,           //数据总长度
            boxWidth: 600,                     //总容器宽度
            boxHeight: 400,                    //总容器高度
            tdWidth: 80,                       //单元格宽度
            tdHeight: 30,                      //单元格高度

            tableWidth: 0,                     //完整数据表格宽度
            tableHeight: 0,                    //匡正数据表格高度

            tableTop: 0,                       //表格滚动top(弃用)
            tableLeft: 0,                      //表格滚动left

            rightScrollerHeight: 10,            //右滚动条高度
            rightScrollerWidth: 10,             //右滚动条宽度
            rightScrollerTop: 0,               //右滚动条top

            bottomScrollerWidth: 10,            //下滚动条宽度
            bottomScrollerHeight: 10,           //下滚动条高度
            bottomScrollerLeft: 0,              //下滚动条left

            freezeNum: 2,                       //冻结列数
            freezeWidth: 0,                     //冻结宽度

            startRenderIdx: 0,                  //绘制开始索引
            renderNum: 1,                       //每次绘制个数

            editInputX: 0,
            editInputY: 0,
            eidtInputVal: ''
        }
    },
    watch: {
        'sourceData.scheme': {
            deep: true,
            handler: function (){
                this.getNumbers()
            }
        },
        'numbers.startRenderIdx': function (){
            this.updateDatas()
        }
    },
    methods: {
        init: function () {
            this.getNumbers()
            this.bindMouseWheel()
            this.bindScrollerDrag()
            this.bindCellResize()

            this.updateDatas()
        },
        getSomeCellWidth: function (i, j){
            let width = 0
            this.sourceData.scheme.slice(i, j).forEach(_=>{
                width = width + parseFloat(_.width)
            })
            return width
        },
        updateDatas: function (){
            let n = this.numbers
            this.sourceData.data = datas.slice(n.startRenderIdx,n.startRenderIdx+n.renderNum)
        },
        getNumbers: function (){
            let sd = this.sourceData
            let n = this.numbers

            //计算当前浏览器宽高
            n.boxWidth = 600//document.body.scrollWidth
            n.boxHeight = 400//document.body.scrollHeight

            //计算当前容器可以绘制的行数
            n.renderNum = Math.floor(n.boxHeight/n.tdHeight) - 1

            n.tableWidth = this.getSomeCellWidth(0, 1000)
            n.tableHeight = n.tdHeight * (n.dataCount + 1)

            if (n.tableHeight > n.boxHeight){
                n.rightScrollerHeight = Math.max(50, n.boxHeight * n.boxHeight / n.tableHeight)
            }
            else {
                n.rightScrollerHeight = 0
            }

            if (n.tableWidth > n.boxWidth){
                n.bottomScrollerWidth = Math.max(50, n.boxWidth * n.boxWidth / n.tableWidth)
            }
            else {
                n.bottomScrollerWidth = 0
            }

            n.freezeWidth = this.getSomeCellWidth(0, n.freezeNum)
        },
        reduceSpeed: function (n=2){
            //降低滚轮的速度，n代表降低多少倍
            return (parseInt('' + Math.random() * 10) % n) == 0
        },
        getStartIndex: function (idx){
            // 开始绘制的索引范围[0, dataCount-renderNum]
            let n = this.numbers

            idx = Math.max(0, idx)
            idx = Math.min(idx, n.dataCount - n.renderNum)

            return idx
        },
        bindMouseWheel: function () {
            let $box = $('#table-box')
            let n = this.numbers
            let me = this
            let sd = this.sourceData

            $box[0].addEventListener('mousewheel', function (e) {
                e.stopPropagation()
                e.preventDefault()

                var delta = util.getDeltaFromEvent(e)
                var deltax = delta[0]
                var deltay = delta[1]

                //计算上下滚动
                let top = n.tableTop + parseInt(deltay)
                top =  Math.min(0, Math.max(-n.tableHeight+n.boxHeight, top))

                let rightScrollerTop = (n.boxHeight - n.rightScrollerHeight) / (n.tableHeight - n.boxHeight) * -top

                n.tableTop = top
                n.rightScrollerTop = rightScrollerTop
                n.startRenderIdx = me.getStartIndex(-Math.floor(n.tableTop/n.tdHeight))

                // 计算左右滚动条
                var left = n.tableLeft - deltax
                left = Math.min(0, Math.max(-n.tableWidth + n.boxWidth, left))

                let bottomScrollerLeft = (n.boxWidth - n.bottomScrollerWidth) / (n.tableWidth - n.boxWidth) * -left

                n.tableLeft = left
                n.bottomScrollerLeft = bottomScrollerLeft
            }, false)
        },
        bindScrollerDrag: function (){
            let me = this
            let n = this.numbers
            let $bottomScroller = $('.bottom-scroller')
            let $rightScroller = $('.right-scroller')
            let sd = this.sourceData

            util.drag($bottomScroller, function (wx, wy){
                let left = n.bottomScrollerLeft + wx
                    
                left = Math.max(0, Math.min(left, n.boxWidth-n.bottomScrollerWidth))
                n.bottomScrollerLeft = left

                //求tableLeft
                n.tableLeft = -left * (n.tableWidth-n.boxWidth) / (n.boxWidth - n.bottomScrollerWidth)
            })

            util.drag($rightScroller, function (wx, wy){
                let top = n.rightScrollerTop + wy
                    
                top = Math.max(0, Math.min(top, n.boxHeight-n.rightScrollerHeight))
                n.rightScrollerTop = top

                //根据scrolTop求startRenderIdx
                let tableTop = top * (n.tableHeight-n.boxHeight) / (n.boxHeight - n.rightScrollerHeight)
                let idx = Math.ceil(tableTop/n.tdHeight)
                idx = me.getStartIndex(idx)

                n.startRenderIdx = idx
                n.tableTop = -idx * n.tdHeight
            })
        },
        bindCellResize: function (){
            let me = this
            let scheme = this.sourceData.scheme
            let n = this.numbers

            $('.div-table-cell-drag').each(function (){
                let $drag = $(this)
                let cellIdx = $drag.parent().data('cell-idx')

                util.drag($drag, function (wx, wy){
                    let width = scheme[cellIdx].width + wx
                    
                    width = Math.max(n.tdWidth, width)
                    scheme[cellIdx].width = width
                })
            })
        },
        cellDbclick: function (e){
            let n = this.numbers
            let $e = $(e.target)

            let x = $e.data('cell-idx')
            let y = $e.data('row-idx')

            n.editInputX = x
            n.editInputY = y

            n.editInputVal = datas[y+n.startRenderIdx-1][x]
            
            //延迟选中文本
            setTimeout(function (){
                $('.edit-input')[0].select()
            }, 10)
            
        },
        editInputBlur: function (){
            let n = this.numbers
            datas[n.editInputY+n.startRenderIdx-1][n.editInputX]=n.editInputVal

            n.editInputX = 0
            n.editInputY = 0
        }
    }
})
vm.init()