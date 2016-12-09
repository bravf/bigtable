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
    el: '#table',
    data: {
        tableData: tableData
    }
})

let $table = $('#table')
let $topTable = $('.top-table')
let $leftTable = $('.left-table')
let $rightTable = $('.right-table')
let $bottomScroller = $('.bottom-scroller')
let $rightScroller = $('.right-scroller')

let viewH = 400
let viewW = 600

let mainTableH = $('.right-table-body').height()
let mainTableW = $('.left-placeholder').width() + $('.right-table-body').width()

let rightScrollerHeight = Math.max(50, viewH * viewH / mainTableH)
let bottomScrollerWidth = viewW * viewW / mainTableW

$rightScroller.height(rightScrollerHeight)
$bottomScroller.width(bottomScrollerWidth)

$table[0].addEventListener('mousewheel', function (e){
    e.stopPropagation()
    e.preventDefault()
     
    var delta = getDeltaFromEvent(e)
    var deltax = delta[0]
    var deltay = delta[1]

    var top = parseFloat($rightTable.css('top')) + deltay
    top = Math.min(0, Math.max(-mainTableH + viewH, top))

    var left = parseFloat($rightTable.css('left')) - deltax
    left = Math.min(0, Math.max(-mainTableW + viewW, left))

    var rightScrollerTop = (viewH - rightScrollerHeight) / (mainTableH - viewH) * -top
    var bottomScrollerLeft = (viewW - bottomScrollerWidth) / (mainTableW - viewW) * -left

    //$('.scroller').show()

    $leftTable.css('top', top)
    $rightTable.css('top', top)
    $rightScroller.css('top', rightScrollerTop)

    $topTable.css('left', left)
    $rightTable.css('left', left)
    $bottomScroller.css('left', bottomScrollerLeft)

}, false)