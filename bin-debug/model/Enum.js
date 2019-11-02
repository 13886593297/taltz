/**
 * 房间类型
 */
var RoomNumber;
(function (RoomNumber) {
    RoomNumber[RoomNumber["SIX"] = 6] = "SIX";
    RoomNumber[RoomNumber["TEN"] = 10] = "TEN";
})(RoomNumber || (RoomNumber = {}));
/**
 * 参与样式
 */
var JoinType;
(function (JoinType) {
    JoinType[JoinType["JOIN"] = 1] = "JOIN";
    JoinType[JoinType["OBSEVER"] = 2] = "OBSEVER";
})(JoinType || (JoinType = {}));
var RoomStatus;
(function (RoomStatus) {
    RoomStatus[RoomStatus["WAITTING"] = 0] = "WAITTING";
    RoomStatus[RoomStatus["PK"] = 1] = "PK";
})(RoomStatus || (RoomStatus = {}));
/**
 * 团队赛匹配类型
 */
var ReadyType;
(function (ReadyType) {
    ReadyType[ReadyType["UNREADY"] = 1] = "UNREADY";
    ReadyType[ReadyType["READYED"] = 2] = "READYED";
    ReadyType[ReadyType["UNJOIN"] = 3] = "UNJOIN"; //未加入
})(ReadyType || (ReadyType = {}));
/**
 *
 */
var TeamType;
(function (TeamType) {
    TeamType[TeamType["BLUE"] = 2] = "BLUE";
    TeamType[TeamType["GREEN"] = 1] = "GREEN";
})(TeamType || (TeamType = {}));
/**
 * 用户的位置信息
 */
var UserPositionType;
(function (UserPositionType) {
    UserPositionType[UserPositionType["LEFT"] = 1] = "LEFT";
    UserPositionType[UserPositionType["RIGHT"] = 2] = "RIGHT";
})(UserPositionType || (UserPositionType = {}));
/**
 * 邀请状态
 */
var InviteStatus;
(function (InviteStatus) {
    InviteStatus[InviteStatus["WATTING"] = 2] = "WATTING";
    InviteStatus[InviteStatus["INVITING"] = 1] = "INVITING";
    InviteStatus[InviteStatus["NOACCEPT"] = 3] = "NOACCEPT";
    InviteStatus[InviteStatus["ACCEPTED"] = 4] = "ACCEPTED";
    InviteStatus[InviteStatus["MATCHEND"] = 5] = "MATCHEND";
    InviteStatus[InviteStatus["OBSERVE"] = 6] = "OBSERVE";
    InviteStatus[InviteStatus["INVALID"] = 7] = "INVALID";
    InviteStatus[InviteStatus["INVALID_ERROR"] = 8] = "INVALID_ERROR";
    InviteStatus[InviteStatus["PK_END_WAIT"] = 9] = "PK_END_WAIT";
    InviteStatus[InviteStatus["PK_NO_ANSWER"] = 10] = "PK_NO_ANSWER";
    InviteStatus[InviteStatus["PK_REJECT"] = 11] = "PK_REJECT";
    InviteStatus[InviteStatus["PK_ERR_MSG"] = 12] = "PK_ERR_MSG";
})(InviteStatus || (InviteStatus = {}));
/**
 * PK结果
 */
var PkResult;
(function (PkResult) {
    PkResult[PkResult["SUCCESS"] = 1] = "SUCCESS";
    PkResult[PkResult["FAIL"] = 2] = "FAIL";
    PkResult[PkResult["DRAW"] = 3] = "DRAW";
    PkResult[PkResult["INVALID"] = 4] = "INVALID"; //无效局
})(PkResult || (PkResult = {}));
/**
 * Pk结果返回类型
 */
var PkResultBackModel;
(function (PkResultBackModel) {
    PkResultBackModel[PkResultBackModel["BACK"] = 1] = "BACK";
    PkResultBackModel[PkResultBackModel["BACK_PK"] = 2] = "BACK_PK";
    PkResultBackModel[PkResultBackModel["BACK_HOME"] = 3] = "BACK_HOME"; //返回首页
})(PkResultBackModel || (PkResultBackModel = {}));
/**
 * PK模式
 */
var PkModel;
(function (PkModel) {
    PkModel[PkModel["AUTO"] = 1] = "AUTO";
    PkModel[PkModel["FRIEND"] = 2] = "FRIEND";
    PkModel[PkModel["ANSWER"] = 3] = "ANSWER";
    PkModel[PkModel["KNOW"] = 4] = "KNOW"; //知识题
})(PkModel || (PkModel = {}));
/**
 * 个人pk OR 团队Pk
 */
var PKTYPE;
(function (PKTYPE) {
    PKTYPE[PKTYPE["PERSON"] = 1] = "PERSON";
    PKTYPE[PKTYPE["TEAM"] = 2] = "TEAM";
})(PKTYPE || (PKTYPE = {}));
/**
 * 匹配状态
 */
var MatchStatus;
(function (MatchStatus) {
    MatchStatus[MatchStatus["MATCHING"] = 1] = "MATCHING";
    MatchStatus[MatchStatus["MATCHING_END"] = 2] = "MATCHING_END";
})(MatchStatus || (MatchStatus = {}));
/**
 * 胜利状态
 */
var WinnerStatus;
(function (WinnerStatus) {
    WinnerStatus[WinnerStatus["WIN"] = 1] = "WIN";
    WinnerStatus[WinnerStatus["DRAW"] = 2] = "DRAW";
    WinnerStatus[WinnerStatus["MVP"] = 3] = "MVP";
    WinnerStatus[WinnerStatus["LOSE"] = 4] = "LOSE";
    WinnerStatus[WinnerStatus["PKING"] = 5] = "PKING"; //进行中
})(WinnerStatus || (WinnerStatus = {}));
