declare let Vue, jc, $

import tableData from './data'
import {Point, Line, Canvas} from './canvas'

// 复制多行data
for (let i=0; i<30; i++){
    tableData.data.push(tableData.data[0])
}

let width = 800 * 2         //总宽度
let height = 600 * 2        //总高度

let tdWidth = 100 * 2       //每个格子高50px
let tdHeight = 50 * 2       //每个格子宽100px

let paddingLeft = 15 * 2    //每个格子左边距
let paddingTop = 25 * 2     //每个格子上边距

function renderTable(){   
    //画横线
    for (let i=1; i<height/tdHeight; i++){
        let p1 = new Point(0, i * tdHeight)
        let p2 = new Point(width, i * tdHeight)

        let line = new Line([p1, p2])
        Canvas.line(line)
    }

    //画纵线
    for (let i=1; i<8; i++){
        let p1 = new Point(i * tdWidth, 0)
        let p2 = new Point(i * tdWidth, height)

        let line = new Line([p1, p2])
        Canvas.line(line)
    }
}

function renderTheadData(){
    tableData.scheme.forEach((obj, idx)=>{
        let p = new Point(idx * tdWidth + paddingLeft, paddingTop)
        Canvas.text(obj.title, p)
    })
}

function renderTbodyData(){
    tableData.data.forEach((obj, idx)=>{
        tableData.scheme.forEach((sobj, sidx)=>{
            let title = obj[sidx].toString()
            let p = new Point(sidx * tdWidth + paddingLeft, (idx+1) * tdHeight + paddingTop)
            Canvas.text(title, p)
        })
    })
}

var c = document.getElementById('mainCanvas')
var ctx = c['getContext']('2d')
Canvas.init(ctx)

renderTable()
renderTheadData()
renderTbodyData()


var rightScrollData = {
    isBegin: false,
    beginP: null
}

var isRightScrollBegin = false 
var $rightScroller = $('.right-scroller')

$rightScroller.on('mousedown', _=>{
    rightScrollData.isBegin = true
    rightScrollData.beginP = new Point(_.clientX, _.clientY)
    console.log('begin')
    console.log(_)
})

$('body').on('mousemove', _=>{
    var currP = new Point(_.clientX, _.clientY)
    if (rightScrollData.isBegin){
        $rightScroller.css('top', currP.y - rightScrollData.beginP.y)
    }
    console.log(_)
})
.on('mouseup', _=>{
    rightScrollData.isBegin = false
    console.log('end')
})

