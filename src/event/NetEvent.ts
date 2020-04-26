
/**
 * 网络事件
 */

class NetEvent {

    /**已连接 */
    public static readonly ON_CONNENT = "connect";

    public static readonly DIS_CONNENT = "disconnect";
    public static readonly RE_CONNENT = "reconnect";


    // 进入房间
    public static readonly PK_IN_ROOM = "opend";
    //测试授权
    public static readonly PK_OAUTH = "oauth";
    //自动匹配
    public static readonly PK_MATCH = 'match';

    public static readonly CACEL_MATCH = 'closematch';


    public static readonly MATCH_TIMER_END = 'matchend';

    //开始pk
    public static readonly PK_START = 'startpk'
    //提交答案
    public static readonly PK_ANSWER = 'answerpk'

    public static readonly PK_PROGRESS = 'progressbar'

    //结束答题
    public static readonly PK_END = "endpk"

    //邀请pk
    public static readonly PK_INVITE = "invitepk";
    //接受pk
    public static readonly PK_ACCEPT = "acceptpk";

    //获取用户信息
    public static readonly GET_USERINFO = 'userinfo';

    public static readonly PK_RECORDS = "pklogs";

    public static readonly PK_INFO = "pklog";


    /**准备用户变化*/
    public static readonly TEAM_ROOMLIST_USER_UPDATE = "tablebroadcast"


    /**获取房间列表 */
    public static readonly TEAM_ROOM_LIST = "tablelist";
    /**进入房间**/
    public static readonly TEAM_JOIN_IN = "jointable";

    public static readonly TEAM_JOIN_BROADCAST = "jointablebroadcast";


    /**离开房间*/
    public static readonly TEAM_LEAVE_ROOM = "leavetable"
    /**离开房间广播 */
    public static readonly TEAM_LEAVE_ROOM_BROADCAST = "leavetablebroadcast"



    /**准备*/
    public static readonly TEAM_PK_READY = "ready"
    /**通知准备 */
    public static readonly TEAM_READY_BROADCAST = "readybroadcast"

    /**准备用户加入*/
    public static readonly TEAM_READY_JOIN = "team_ready_join"

    /**交换位置*/
    public static readonly TEAM_CHANGE_POSITION = "tochangepos";
    /**回复交换位置*/
    public static readonly TEAM_CHANGE_POSITION_REPLY = "dochangepos";

    public static readonly TEAM_CHANGE_POSITION_BROADCAST = "changeposbroadcast";


    public static readonly TEAM_COUNT_DOWN_BROADCAST = "countdownbroadcast"


    /**开始答题*/
    public static readonly TEAM_PK_START = "startpk"
    /**提交答案*/
    public static readonly TEAM_PK_SUBMIT = "answerpk"

    /**提交答案广播*/
    public static readonly TEAM_PK_SUBMIT_BROADCAST = "answerpkbroadcast"

    /**提交答案广播*/
    public static readonly TEAM_PK_NEXT_BROADCAST = "answernextbroadcast"
    /**
     * 结束pk
     */
    public static readonly TEAM_END_PK = "endpkbroadcast";


    /**结束结果*/
    public static readonly TEAM_PK_KNOW_RESULT = "checkpk"






}

class UserEvent extends egret.Event {

    public static readonly UPDATE_USER_EVENT = "UPDATE_USER_EVENT"

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }
}