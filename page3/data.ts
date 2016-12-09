export default {
    scheme: [
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
    ],
    data: [
        ['清迈', '晴/31℃', '落地签', 30, true, '泰国', 5.19, 4500.00, 4500.00]
    ]
}