let scheme = [
    {
        title: '城市',
        type: 'string'
    },
    {
        title: '当前天气',
        type: 'string'
    },
    {
        title: '签证',
        type: 'string'
    },
    {
        title: '可留天数',
        type: 'string'
    },
    {
        title: 'Uber',
        type: 'bool'
    },
    {
        title: '国家',
        type: '国家_multi_select'
    },
    {
        title: '汇率',
        type: 'number'
    },
    {
        title: '住宿费用（月）',
        type: 'number'
    },
    {
        title: '吃饭费用（月）',
        type: 'number'
    }
]

// 格式化scheme
scheme.forEach((_, idx)=>{
    _['width'] = 120
    _['cellIdx'] = idx
})

let data = [['清迈', '晴/31℃', '落地签', 30, true, '泰国', 5.19, 4500.00, 4500.00]]
let datas = []

// 复制多行data
let dataCount = 3000000 + 5
for (let i = 0; i < dataCount; i++) {
    let d = JSON.parse(JSON.stringify(data[0]))
    
    //最后5行为空行
    if (i >= dataCount-5){
        for (let j=0; j<d.length; j++){
            d[j] = ''
        }
    }

    datas.push(d)
}
datas.forEach((_, i) => {
    if (i >= dataCount-5){
        return
    }
    _[0] = '清迈' + i.toString()
    _[2] = '落地签' + i.toString()
})


console.log(JSON.stringify(scheme))
console.log(datas)


export {
    scheme,
    datas
}