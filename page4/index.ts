declare let Vue, jc, $, require

import tableData from './data'
import { getDeltaFromEvent } from './util'

// 格式化scheme
tableData.scheme.forEach((_, idx)=>{
    _['width'] = 120
    _['cellIdx'] = idx
})

// 复制多行data
for (let i = 0; i < 3000; i++) {
    tableData.data.push(JSON.parse(JSON.stringify(tableData.data[0])))
}
tableData.data.forEach((_, i) => {
    _[0] = '清迈' + i.toString()
    _[2] = '落地签' + i.toString()
})

const vm  = window['vm'] =  new Vue({
    el: '#bigtable',
    data: {
        sourceData: tableData,
        numbers: {
            boxWidth: 600,                     //总容器宽度
            boxHeight: 400,                    //总容器高度
            tdWidth: 80,                       //单元格宽度
            tdHeight: 30,                      //单元格高度

            tableWidth: 0,                     //完整数据表格宽度
            tableHeight: 0,                    //匡正数据表格高度

            tableTop: 0,                       //表格滚动top
            tableLeft: 0,                      //表格滚动left

            rightScrollerHeight: 10,            //右滚动条高度
            rightScrollerWidth: 10,             //右滚动条宽度
            rightScrollerTop: 0,               //右滚动条top

            bottomScrollerWidth: 10,            //下滚动条宽度
            bottomScrollerHeight: 10,           //下滚动条高度
            bottomScrollerLeft: 0,              //下滚动条left

            freezeNum: 2,                       //冻结列数
            freezeWidth: 0,                     //冻结宽度
        }
    },
    watch: {
        'sourceData.scheme': {
            deep: true,
            handler: function (){
                this.getNumbers()
            }
        }
    },
    methods: {
        init: function () {
            this.getNumbers()
            this.bindMouseWheel()
            this.bindScrollerDrag()
            this.bindCellResize()
        },
        getSomeCellWidth: function (i, j){
            let width = 0
            this.sourceData.scheme.slice(i, j).forEach(_=>{
                width = width + parseFloat(_.width)
            })
            return width
        },
        getNumbers: function (){
            let sd = this.sourceData
            let n = this.numbers

            n.tableWidth = this.getSomeCellWidth(0, 1000)
            n.tableHeight = n.tdHeight * sd.data.length

            n.rightScrollerHeight = Math.max(50, n.boxHeight * n.boxHeight / n.tableHeight)
            n.bottomScrollerWidth = Math.max(50, n.boxWidth * n.boxWidth / n.tableWidth)

            n.freezeWidth = this.getSomeCellWidth(0, n.freezeNum)
        },
        bindMouseWheel: function () {
            let $box = $('#table-box')
            let n = this.numbers
            let me = this

            $box[0].addEventListener('mousewheel', function (e) {
                e.stopPropagation()
                e.preventDefault()

                $('.scroller').show()

                var delta = getDeltaFromEvent(e)
                var deltax = delta[0]
                var deltay = delta[1]

                var top = n.tableTop + deltay
                top = Math.min(0, Math.max(-n.tableHeight + n.boxHeight, top))

                var left = n.tableLeft - deltax
                left = Math.min(0, Math.max(-n.tableWidth + n.boxWidth, left))

                var rightScrollerTop = (n.boxHeight - n.rightScrollerHeight) / (n.tableHeight - n.boxHeight) * -top
                var bottomScrollerLeft = (n.boxWidth - n.bottomScrollerWidth) / (n.tableWidth - n.boxWidth) * -left

                n.tableTop = top
                n.tableLeft = left
                n.rightScrollerTop = rightScrollerTop
                n.bottomScrollerLeft = bottomScrollerLeft
            }, false)

            // $box.on('mouseover', function (){
            //     $('.scroller').show()
            // })
            // .on('mousemove', function (){
            //     $('.scroller').show()
            // })
            // .on('mouseout', function (){
            //     $('.scroller').hide()
            // })
        },
        bindScrollerDrag: function (){
            let n = this.numbers
            let $bottomScroller = $('.bottom-scroller')
            let $rightScroller = $('.right-scroller')

            let xDrag = false
            let x = 0

            let yDrag = false
            let y = 0

            $bottomScroller.on('mousedown', function (e){
                xDrag = true
                x = e.clientX
            })

            $rightScroller.on('mousedown', function (e){
                yDrag = true
                y = e.clientY
            })

            $('body').on('mousemove', function (e){
                if (xDrag){
                    $('.scroller').show()

                    let walk = e.clientX - x
                    let left = n.bottomScrollerLeft + walk
                    
                    left = Math.max(0, Math.min(left, n.boxWidth-n.bottomScrollerWidth))
                    n.bottomScrollerLeft = left

                    //求tableLeft
                    n.tableLeft = -left * (n.tableWidth-n.boxWidth) / (n.boxWidth - n.bottomScrollerWidth)

                    x = e.clientX
                }
                if (yDrag){
                    $('.scroller').show()

                    let walk = e.clientY - y
                    let top = n.rightScrollerTop + walk
                    
                    top = Math.max(0, Math.min(top, n.boxHeight-n.rightScrollerHeight))
                    n.rightScrollerTop = top

                    //求tableTop
                    n.tableTop = -top * (n.tableHeight-n.boxHeight) / (n.boxHeight - n.rightScrollerHeight)

                    y = e.clientY
                }
            })
            .on('mouseup', function (e){
                xDrag = false
                yDrag = false
            })
        },
        bindCellResize: function (){
            let me = this
            let scheme = this.sourceData.scheme
            let n = this.numbers

            $('.div-table-cell-drag').each(function (){
                let $drag = $(this)
                let xDrag = false
                let x = 0
                let cellIdx = $drag.parent().data('cell-idx')

                $drag.on('mousedown', function (e){
                    xDrag = true
                    x = e.clientX
                })

                $('body').on('mousemove', function (e){
                    if (xDrag){
                        let walk = e.clientX - x
                        let width = scheme[cellIdx].width + walk
                        
                        width = Math.max(n.tdWidth, width)
                        scheme[cellIdx].width = width
                        x = e.clientX
                    }
                })
                .on('mouseup', function (){
                    xDrag = false
                })
            })
        }
    }
})
vm.init()