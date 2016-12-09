declare let Vue, jc, $, require

import tableData from './data'
import {getDeltaFromEvent} from './util'

// 复制多行data
for (let i=0; i<30; i++){
    tableData.data.push(JSON.parse(JSON.stringify(tableData.data[0])))
}
tableData.data.forEach((_,i)=>{
    _[0] = '清迈' + i.toString()
    _[2] = '落地签' + i.toString()
})

const vm = new Vue({
    el: '#bigtable',
    data: {
        sourceData: tableData,
        numbers: {
            boxWidth: 600,                     //总容器宽度
            boxHeight: 400,                    //总容器高度
            tdWidth: 80 + 1,                   //单元格宽度
            tdHeight: 30 + 1,                  //单元格高度
           
            tableWidth: 0,                     //完整数据表格宽度
            tableHeight: 0,                    //匡正数据表格高度
           
            tableTop: 0,                       //表格滚动top
            tableLeft: 0,                      //表格滚动left
                       
            rightScrollerHeight: 5,            //右滚动条高度
            rightScrollerWidth: 5,             //右滚动条宽度
            rightScrollerTop: 0,               //右滚动条top
                       
            bottomScrollerWidth: 5,            //下滚动条宽度
            bottomScrollerHeight: 5,           //下滚动条高度
            bottomScrollerLeft: 0,             //下滚动条left

            freezeNum: 2,                      //冻结列数
        },
        elements: {
            $box: $('#table-box'),

        }
    },
     methods: {
        init: function (){
            let sd = this.sourceData
            let n = this.numbers

            n.tableWidth = n.tdWidth * sd.scheme.length
            n.tableHeight = n.tdHeight * sd.data.length

            n.rightScrollerHeight = Math.max(50, n.boxHeight * n.boxHeight / n.tableHeight)
            n.bottomScrollerWidth = Math.max(50, n.boxWidth * n.boxWidth / n.tableWidth)

            this.bindMouseWheel()
        },
        bindMouseWheel: function (){
            let $box = this.elements.$box
            let n = this.numbers
            let me = this

            $('#table-box')[0].addEventListener('mousewheel', function (e){
                    e.stopPropagation()
                    e.preventDefault()
                    
                    var delta = getDeltaFromEvent(e)
                    var deltax = delta[0]
                    var deltay = delta[1]

                    var top = n.tableTop + deltay
                    top = Math.min(0, Math.max(-n.tableHeight + n.boxHeight, top))

                    var left = n.tableLeft - deltax
                    left = Math.min(0, Math.max(-n.tableWidth + n.boxWidth, left))

                    var rightScrollerTop = (n.boxHeight - n.rightScrollerHeight) / (n.tableHeight - n.boxHeight) * -top
                    var bottomScrollerLeft = (n.boxWidth -n.bottomScrollerWidth) / (n.tableWidth - n.boxWidth) * -left

                    n.tableTop = top
                    n.tableLeft = left
                    n.rightScrollerTop = rightScrollerTop
                    n.bottomScrollerLeft = bottomScrollerLeft
            }, false )
        }
    }
})
vm.init()