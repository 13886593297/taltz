/**
 * 后台对接的跨域问题
 */
class Http {

    private static instance: Http;
    private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE1NTA1ODU4ODgsImV4cCI6MTU1MDY3MjI4OH0.XeDCRzT4WGo-JgUx13PeR76dcYGHw8IUL-hQmhA1P5k"
    private constructor() {
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Http();
        }
        return this.instance;
    }

    /**
     * 获取GET 数据 
     */
    public get(url: string, msg: any) {
        let host = Util.getHost();
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", '*/*');
        let token = localStorage.getItem('token');
        if (!token) token = this.token;
        request.setRequestHeader("token", token);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        url += "?" + Util.urlEncode(msg, null);
        Util.log('url', url);
        request.open(url, egret.HttpMethod.GET);
        request.send(msg);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        return request;
    }

    public postTest(url: string, msg: any, callback: Function) {
        //数据缓存问题
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", 'application/json');
        let token = localStorage.getItem('token');
        if (!token) token = this.token;
        request.setRequestHeader("token", token);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.open(url, egret.HttpMethod.POST);

        let formData = Util.urlEncode(msg, null);
        request.send(formData);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete(callback), this);
        return request;
    }

    /**
     * 请求POST数据
     */
    public post(url: string, msg: any, callback: Function) {
        let host = Config.DEBUG ? Util.getConfig('host') : Util.getHost(); //Util.getConfig('host');//
        url = host + url;
        //数据缓存问题
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.setRequestHeader("Accept", 'application/json');
        let token = localStorage.getItem('token');
        if (!token) token = this.token;
        request.setRequestHeader("token", token);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.open(url, egret.HttpMethod.POST);

        let formData = Util.urlEncode(msg, null);
        request.send(formData);
        request.addEventListener(egret.Event.COMPLETE, this.onComplete(callback), this);
        return request;
    }

    private onComplete(callback: Function) {
        return (event: egret.Event) => {
            var request = <egret.HttpRequest>event.currentTarget;
            let data = JSON.parse(request.response);
            if (data.errno > 10) {
                if (data.errno == 1001) {
                    window.location.href = window.location.origin + window.location.pathname;
                    return;
                }
                let alert = new AlertPanel(`提示:${data.errmsg}`, 900)
                ViewManager.getInstance().getCurrentScene().addChild(alert);
                return;
            }
            if (callback) {
                callback(data);
            }
        }
    }

    public onGetIOError(error: any) {
        Util.log('onGetIOError', error);
    }
}


class Url {
    public static readonly HTTP_JSSDK_CONFIG = "/game/index/jssdkconfig";
    //游戏首页
    public static readonly HTTP_GAME_INIT = "/game/api/index/init";
    public static readonly HTTP_SIGN = "/game/api/index/sign";

    public static readonly HTTP_TEAM_RANK = '/game/api/index/teamrank'

    public static readonly HTTP_NOTICE = '/game/api/index/notice'

    public static readonly HTTP_BANNNER = '/game/api/index/adbanner'

    public static readonly HTTP_SHARE_UPLOAD = "/game/api/index/doshare";
    //装备库

    public static readonly HTTP_EQUIP_CATEGROY = "/game/api/cms/category";

    public static readonly HTTP_EQUIP_LIST = "/game/api/cms/list";

    public static readonly HTTP_EQUIP_SEARCH = "/game/api/cms/search";

    public static readonly HTTP_EQUIP_DETAIL = '/game/api/cms/details'

    //用户信息
    public static readonly HTTP_USER_INFO = "/game/api/user/info";

    public static readonly HTTP_USER_BASE_INFO = "/game/api/user/baseinfo";

    //训练场
    public static readonly HTTP_TRAIN_START = "/game/api/train/start";

    //提交答案
    public static readonly HTTP_TRAIN_SUBMIT = "/game/api/train/submitquestion";

    public static readonly HTTP_TRAIN_END = "/game/api/train/end";
    //炫耀成绩
    public static readonly HTTP_TRAIN_REPORT = "/game/api/train/report";
    //收藏
    public static readonly HTTP_FAVOR_SUBJECT = "/game/api/train/collectquestion";
    //收藏列表
    public static readonly HTTP_FAVOR_LIST = "/game/api/collect/index";
    //排行
    public static readonly HTTP_TEAM_RANK_LIST = "/game/api/rank/team";
    public static readonly HTTP_PERSON_RANK_LIST = "/game/api/rank/personal";
    public static readonly HTTP_TEAM_PERSON_RANK_LIST = "/game/api/rank/personalteam";


    public static readonly HTTP_PK_SOCKET = "http://xujiagui.vicp.cc:12631/proom"
    
}