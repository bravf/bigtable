declare let WebViewJavascriptBridge, $

function regsiterNativeMethod():any {
    var configs = {
        appShare: 'appShare',           // app 分享xw
        getUserInfo: 'getUserInfo',     //获取用户信息
        activeWallet: 'activeWallet',   // 调起开卡接口
        appLogin: 'login',              // app登录接口
        appToast: 'toast',              // 调用app toast
        appAlert: 'alert',              // 调用app alert
        setTitle: 'setTitle',           // 设置标题
        callPay: 'callPay',             // 唤起支付密码 ｛instId、number｝
        callCouponPay: 'callCouponPay', // 唤起优惠券支付 ｛testA：String, testB: Number}
        goShopCar: 'goShopCar',         // 唤起购物车
        callSpike: 'callSpike',         // 跳转native秒杀详情 {commodityId: 'xxx', spikeId: 123}
    };
    var nativeMethods = {};

    var loadedDefer = $.Deferred(), failCount = 0
    ;(function () {
        if (typeof window['WebViewJavascriptBridge'] == 'object') {
            loadedDefer.resolve(window['WebViewJavascriptBridge'])
        } else if (failCount++ < 50) {
            window.setTimeout(arguments.callee, 200)
        } else {
            loadedDefer.reject()
        }
    })();

    function callApp(action, callBack){
        loadedDefer.done(_ => {
            window["WebViewJavascriptBridge"].callHandler('callApp', action,
            function(responseData) {
                if (callBack && responseData) {
                    callBack(responseData)
                }
            });
        })
    }
    for (var variable in configs) {
        if (configs.hasOwnProperty(variable)) {
            (function(variable){
                nativeMethods[variable] = function(params, cb) {
                    var action = {
                        type: configs[variable],
                        data: params || null,
                    };
                    callApp.call(this, action, cb);
                }
            })(variable)
        }
    }
    return nativeMethods;
}

var hybirdApp = regsiterNativeMethod;

export default hybirdApp
