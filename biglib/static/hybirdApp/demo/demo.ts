declare var SSpa, Vue, $, WebViewJavascriptBridge
import hybirdAppInit from '../hybridApp';

$(function(){

    var hybirdApp = hybirdAppInit();
    $('#getUserInfo').on('click', (e) => {
        hybirdApp.getUserInfo(null, (data)=>{
            var userInfo = JSON.parse(data);
            if (!userInfo.loginState) {
                hybirdApp.appLogin();
            }
        });
    })

    $('#appLogin').on('click', (e) => {
        hybirdApp.appLogin();
    });

    $('#appGoShopCar').on('click', (e) => {
        hybirdApp.goShopCar();
    });

    $('#appCallPay').on('click', (e) => {
        hybirdApp.callPay({
            instId: 123,
            number: 50
        });
    });

    $('#secondKill').on('click', (e) => {
        hybirdApp.callSpike({
            commodityId: 814,
            spikeId: 2
        });
    });

    $('#appCallCouponPay').on('click', (e) => {
        hybirdApp.callCouponPay({
            testA: 'testA',
            testB: 404
        });
    });

    $('#appTitle').on('click', (e) => {
        hybirdApp.setTitle('设置自定义标题');
    });

    document.getElementById('appShare').addEventListener('click', function(e){
        hybirdApp.appShare({
            "url": "http://www.mljr.com",
            "title": "金融服务帮助年轻人实现美好生活",
            "content": "美利金融-以金融服务帮助年轻人创造美好生活，为投资理财人群提供高收益、低风险的互联网理财产品，为借款人群提供小额、短期的个人消费贷款。",
            "img": "https://www.mljr.com/favicon.ico"
        }, (data) => {

        });
    }, false);

    document.getElementById('activeWallet').addEventListener('click', function(e){
        hybirdApp.activeWallet();
    }, false);

    document.getElementById('appToast').addEventListener('click', function(e){
        hybirdApp.appToast('这是H5传来的Toast提示信息');
    }, false);

    document.getElementById('appAlert').addEventListener('click', function(e){
        hybirdApp.appAlert('这是H5传来的提示信息');
    }, false);

    // userinfos
    var userInfoDefer = $.Deferred()
    hybirdApp.getUserInfo('', (data)=>{
        userInfoDefer.resolve(JSON.parse(data))
    })
})
