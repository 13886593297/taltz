
/**
 * 房间类型
 */
enum RoomNumber {
    SIX = 6,
    TEN = 10
}


/**
 * 参与样式
 */
enum JoinType {
    JOIN = 1,
    OBSEVER = 2,
}

enum RoomStatus {
    WAITTING = 0,
    PK = 1
}

/**
 * 团队赛匹配类型
 */
enum ReadyType {
    UNREADY = 1, //未准备
    READYED = 2,//已准备
    UNJOIN = 3 //未加入
}

/**
 * 
 */
enum TeamType {
    BLUE = 2,
    GREEN = 1
}
/**
 * 用户的位置信息
 */
enum UserPositionType {
    LEFT = 1,
    RIGHT = 2
}

/**
 * 邀请状态
 */
enum InviteStatus {
    WATTING = 2, //等待中
    INVITING = 1,//邀请好友
    NOACCEPT = 3,//未接受
    ACCEPTED = 4,//被邀请
    MATCHEND = 5,//匹配成功
    OBSERVE = 6,//旁观
    INVALID = 7,//无效局
    INVALID_ERROR = 8,//无效局全打错
    PK_END_WAIT = 9,//答完题等待
    PK_NO_ANSWER = 10,//24小时未应答
    PK_REJECT = 11,//对方拒绝应答    
    PK_ERR_MSG = 12,//对方拒绝应答    
}

/**
 * PK结果
 */
enum PkResult {
    SUCCESS = 1, //挑战成功
    FAIL = 2, //挑战失败
    DRAW = 3, //平局
    INVALID = 4 //无效局
}
/**
 * Pk结果返回类型
 */
enum PkResultBackModel {
    BACK = 1,
    BACK_PK = 2,    //返回pk
    BACK_HOME = 3 //返回首页
}

/**
 * PK模式
 */
enum PkModel {
    AUTO = 1, //自动匹配
    FRIEND = 2,//邀请好友
    ANSWER = 3,//抢答题
    KNOW = 4//知识题
}

/**
 * 个人pk OR 团队Pk
 */
enum PKTYPE {
    PERSON=1,
    TEAM=2
}


/**
 * 匹配状态
 */
enum MatchStatus {
    MATCHING = 1,
    MATCHING_END = 2,
}


/**
 * 胜利状态
 */
enum WinnerStatus {
    WIN = 1,
    DRAW = 2,
    MVP = 3,
    LOSE = 4,
    PKING = 5 //进行中
}

/**
 * 关卡类型
 */
 enum TrainType {
    TRAIN = 1,
    FAVOR = 2,
}
