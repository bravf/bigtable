declare var $
// WebViewJavascriptBridge Simulator
function hyBridAppDebugTool(mobile= '18210378280', password= 'ZWU/y6H5yns=') {
    var VERSION = '1.0'
    var UserDataKey = 'WVJBS_UD'
    var __debug = (info, ...args) => {
        args.unshift(`%c[WVJBS]%c ${info}`, 'color: blue', 'color: inherits')
        console.info.apply(console, args)
    }

    var __alert = info => {
        alert(`[WVJBS]\n${info}`)
    }
    __debug(`WebViewJavascriptBridge Simulator ${VERSION}`)
    __debug('init')

    window['WebViewJavascriptBridge'] = {
        _getUserData: function () {
            var userData = localStorage[UserDataKey]
            if (!userData) {
                userData = {}
            } else {
                userData = JSON.parse(userData)
            }

            return userData
        },
        saveUserData: function (key, value) {
            var userData = this._getUserData()
            userData[key] = value
            localStorage[UserDataKey] = JSON.stringify(userData)
        },
        getUserData: function (key) {
            var userData = this._getUserData()

            return userData[key]
        },
        dumpUserData: function () {
            console.info(this._getUserData())
        },
        clearUserData: function () {
            localStorage.removeItem(UserDataKey)
        },
        setLogin: function() {
            this.callHandler('callApp', {type: 'login'});
        },
        callHandler: function (func, data, responseCallback) {
            __debug(`call ${func}(${JSON.stringify(data)}), ${!!responseCallback ? 'with' : 'without'} a callback`)

            if ('callApp' == func) {
                const action = data.type

                if ('getUserInfo' == action) {
                    var loginData = this.getUserData('loginData')
                    var responseData = {}

                    if (!loginData || !!loginData.errorCode) {
                        // not login or fail
                        responseData['loginState'] = false
                        responseData['activeWalletState'] = false
                    } else {
                        // logined
                        responseData['loginState'] = true
                        responseData['activeWalletState'] = !!loginData.data.openCardTime
                    }
                    responseData['ticket'] = loginData ? loginData['ticket'] : ''
                    __debug('getUserInfo:', responseData)

                    ;(responseCallback || $.noop).call(window, JSON.stringify(responseData))
                } else if ('login' == action) {
                    // app登录接口
                    $.ajax({
                        url: '/installment/fws/user/userLogin',
                        method: 'get',
                        data: {
                            mobile, password
                        },
                        dataType: 'json',
                        headers: {
                            params: 'de3dba76-bfe0-4901-bdc6-3fe68fe38e2d#ios#iPhone 6 Plus#9.2.1#1.2.6#appstore#39.976246,116.344770'|| 'c013871b-6a42-4b61-ab66-d83269ffe072#ios#iPhone 6 Plus#9.3.1#1#appstore#39.976554,116.344490',
                            token: '143ce51df4393c4f0642b684a9450329' || 'f04dd41d1ef37563d884aea943443177'
                        }
                    }).done((loginData, textStatus, jqXHR) => {
                        loginData.ticket = jqXHR.getResponseHeader('ticket')
                        this.saveUserData('loginData', loginData)
                        __debug('loginData:', loginData)
                    })
                } else if ('activeWallet' == action) {
                    __debug('Should show ActiveWaller', data.data);
                } else if ('alert' == action) {
                    __alert(data.data)
                } else if ('appShare' == action) {
                    __debug('Should show Share', data.data)
                } else if ('setTitle' == action) {
                    __debug('Should set APP title to:', data.data)
                } else if ('toast' == action) {
                    __debug('Should show toast:', data.data)
                } else if ('goShopCar' == action) {
                    __debug('Should call shopCar:', data.data);
                } else if ('callSpike' == action) {
                    __debug('Should jump to second kill detail:', data.data);
                } else if ('callPay' == action) {
                    __debug('Should call pay password:', data.data);
                } else if('callCouponPay' == action) {
                    __debug('Should call pay coupon password:', data.data);
                } else if ('exit' == action) {
                    __alert('Should close H5 page')
                } else {
                    console.warn('THIS ACTION IS NOT DEFINED')
                }
            }
        }
    }
    __debug('listening...')
}

export default hyBridAppDebugTool;
