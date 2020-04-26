var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 后台对接的跨域问题
 */
var Http = (function () {
    function Http() {
        this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE1NTA1ODU4ODgsImV4cCI6MTU1MDY3MjI4OH0.XeDCRzT4WGo-JgUx13PeR76dcYGHw8IUL-hQmhA1P5k";
    }
    Http.getInstance = function () {
        if (!this.instance) {
            this.instance = new Http();
        }
        return this.instance;
    };
    /**
     * 获取GET 数据
     */
    Http.prototype.get = function (url, msg) {
        var host = Util.getHost();
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", '*/*');
        var token = localStorage.getItem('token');
        if (!token)
            token = this.token;
        request.setRequestHeader("token", token);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        url += "?" + Util.urlEncode(msg, null);
        Util.log('url', url);
        request.open(url, egret.HttpMethod.GET);
        request.send(msg);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        return request;
    };
    Http.prototype.postTest = function (url, msg, callback) {
        //数据缓存问题
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", 'application/json');
        var token = localStorage.getItem('token');
        if (!token)
            token = this.token;
        request.setRequestHeader("token", token);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.open(url, egret.HttpMethod.POST);
        var formData = Util.urlEncode(msg, null);
        request.send(formData);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete(callback), this);
        return request;
    };
    /**
     * 请求POST数据
     */
    Http.prototype.post = function (url, msg, callback) {
        var host = Config.DEBUG ? Util.getConfig('host') : Util.getHost(); //Util.getConfig('host');//
        url = host + url;
        //数据缓存问题
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", 'application/json');
        var token = localStorage.getItem('token');
        if (!token)
            token = this.token;
        request.setRequestHeader("token", token);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.open(url, egret.HttpMethod.POST);
        var formData = Util.urlEncode(msg, null);
        request.send(formData);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete(callback), this);
        return request;
    };
    Http.prototype.onComplete = function (callback) {
        return function (event) {
            var request = event.currentTarget;
            var data = JSON.parse(request.response);
            if (data.errno > 10) {
                if (data.errno == 1001) {
                    window.location.href = window.location.origin + window.location.pathname;
                    return;
                }
                var alert_1 = new AlertPanel("\u63D0\u793A:" + data.errmsg, 900);
                ViewManager.getInstance().getCurrentScene().addChild(alert_1);
                return;
            }
            if (callback) {
                callback(data);
            }
        };
    };
    Http.prototype.onGetIOError = function (error) {
        Util.log('onGetIOError', error);
    };
    return Http;
}());
__reflect(Http.prototype, "Http");
var Url = (function () {
    function Url() {
    }
    Url.HTTP_JSSDK_CONFIG = "/game/index/jssdkconfig";
    //游戏首页
    Url.HTTP_GAME_INIT = "/game/api/index/init";
    Url.HTTP_SIGN = "/game/api/index/sign";
    Url.HTTP_SIGNINFO = "/game/api/index/signinfo";
    Url.HTTP_TEAM_RANK = '/game/api/index/teamrank';
    Url.HTTP_NOTICE = '/game/api/index/notice';
    Url.HTTP_BANNNER = '/game/api/index/adbanner';
    Url.HTTP_SHARE_UPLOAD = "/game/api/index/doshare";
    //装备库
    Url.HTTP_EQUIP_CATEGROY = "/game/api/cms/category";
    Url.HTTP_EQUIP_LIST = "/game/api/cms/list";
    Url.HTTP_EQUIP_SEARCH = "/game/api/cms/search";
    Url.HTTP_EQUIP_DETAIL = '/game/api/cms/details';
    //用户信息
    Url.HTTP_USER_INFO = "/game/api/user/info";
    Url.HTTP_USER_BASE_INFO = "/game/api/user/baseinfo";
    //训练场
    Url.HTTP_TRAIN_START = "/game/api/train/start";
    //每日任务
    Url.HTTP_DAILYTASKS_START = "/game/api/dailytasks/start";
    //提交答案
    Url.HTTP_TRAIN_SUBMIT = "/game/api/train/submitquestion";
    Url.HTTP_TRAIN_END = "/game/api/train/end";
    //炫耀成绩
    Url.HTTP_TRAIN_REPORT = "/game/api/train/report";
    //收藏
    Url.HTTP_FAVOR_SUBJECT = "/game/api/train/collectquestion";
    //收藏列表
    Url.HTTP_FAVOR_LIST = "/game/api/collect/index";
    //排行
    Url.HTTP_TEAM_RANK_LIST = "/game/api/rank/team";
    Url.HTTP_PERSON_RANK_LIST = "/game/api/rank/personal";
    Url.HTTP_TEAM_PERSON_RANK_LIST = "/game/api/rank/personalteam";
    Url.HTTP_WATERING_INFO = '/game/api/watering/info';
    Url.HTTP_WATERING_DO = '/game/api/watering/do';
    Url.HTTP_WATERING_PICK = '/game/api/watering/pick';
    return Url;
}());
__reflect(Url.prototype, "Url");
