mabp.languages = {
    'en': {
        'AreYouSure' : 'Are you sure?',
        'Sure' : 'Sure',
        'OK' : 'OK',
        'ClickSureForExecute' : 'Click sure to execute?'
},
    'zh-CN': {
        'Sure': '确定',
        'OK': '确定',
        'AreYouSure': '你确定吗?',
        'ClickSureForExecute' : '点击确定将会执行操作?'
    }
}
mabp.language = mabp.languages['zh-CN'];
mabp.setDefaultLanguage = function(lang) {
    mabp.language = mabp.languages[lang];
}
mabp.L = function(key) {
    return mabp.language[key];
}