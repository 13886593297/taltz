/**
 * 网络事件
 */
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var NetEvent = (function () {
    function NetEvent() {
    }
    /**已连接 */
    NetEvent.ON_CONNENT = "connect";
    NetEvent.DIS_CONNENT = "disconnect";
    NetEvent.RE_CONNENT = "reconnect";
    // 进入房间
    NetEvent.PK_IN_ROOM = "opend";
    //测试授权
    NetEvent.PK_OAUTH = "oauth";
    //自动匹配
    NetEvent.PK_MATCH = 'match';
    NetEvent.CACEL_MATCH = 'closematch';
    NetEvent.MATCH_TIMER_END = 'matchend';
    //开始pk
    NetEvent.PK_START = 'startpk';
    //提交答案
    NetEvent.PK_ANSWER = 'answerpk';
    NetEvent.PK_PROGRESS = 'progressbar';
    //结束答题
    NetEvent.PK_END = "endpk";
    //邀请pk
    NetEvent.PK_INVITE = "invitepk";
    //接受pk
    NetEvent.PK_ACCEPT = "acceptpk";
    //获取用户信息
    NetEvent.GET_USERINFO = 'userinfo';
    NetEvent.PK_RECORDS = "pklogs";
    NetEvent.PK_INFO = "pklog";
    /**准备用户变化*/
    NetEvent.TEAM_ROOMLIST_USER_UPDATE = "tablebroadcast";
    /**获取房间列表 */
    NetEvent.TEAM_ROOM_LIST = "tablelist";
    /**进入房间**/
    NetEvent.TEAM_JOIN_IN = "jointable";
    NetEvent.TEAM_JOIN_BROADCAST = "jointablebroadcast";
    /**离开房间*/
    NetEvent.TEAM_LEAVE_ROOM = "leavetable";
    /**离开房间广播 */
    NetEvent.TEAM_LEAVE_ROOM_BROADCAST = "leavetablebroadcast";
    /**准备*/
    NetEvent.TEAM_PK_READY = "ready";
    /**通知准备 */
    NetEvent.TEAM_READY_BROADCAST = "readybroadcast";
    /**准备用户加入*/
    NetEvent.TEAM_READY_JOIN = "team_ready_join";
    /**交换位置*/
    NetEvent.TEAM_CHANGE_POSITION = "tochangepos";
    /**回复交换位置*/
    NetEvent.TEAM_CHANGE_POSITION_REPLY = "dochangepos";
    NetEvent.TEAM_CHANGE_POSITION_BROADCAST = "changeposbroadcast";
    NetEvent.TEAM_COUNT_DOWN_BROADCAST = "countdownbroadcast";
    /**开始答题*/
    NetEvent.TEAM_PK_START = "startpk";
    /**提交答案*/
    NetEvent.TEAM_PK_SUBMIT = "answerpk";
    /**提交答案广播*/
    NetEvent.TEAM_PK_SUBMIT_BROADCAST = "answerpkbroadcast";
    /**提交答案广播*/
    NetEvent.TEAM_PK_NEXT_BROADCAST = "answernextbroadcast";
    /**
     * 结束pk
     */
    NetEvent.TEAM_END_PK = "endpkbroadcast";
    /**结束结果*/
    NetEvent.TEAM_PK_KNOW_RESULT = "checkpk";
    return NetEvent;
}());
__reflect(NetEvent.prototype, "NetEvent");
var UserEvent = (function (_super) {
    __extends(UserEvent, _super);
    function UserEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        return _super.call(this, type, bubbles, cancelable) || this;
    }
    UserEvent.UPDATE_USER_EVENT = "UPDATE_USER_EVENT";
    return UserEvent;
}(egret.Event));
__reflect(UserEvent.prototype, "UserEvent");
