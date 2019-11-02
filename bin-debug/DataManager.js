/**
 * 数据管理器
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
var DataManager = (function (_super) {
    __extends(DataManager, _super);
    function DataManager() {
        var _this = _super.call(this) || this;
        _this.equipment = null;
        _this.hasShowRanker = false;
        _this.pkData = {};
        return _this;
    }
    DataManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new DataManager();
        }
        return this.instance;
    };
    DataManager.prototype.setCurrentBandge = function (bandge) {
        this.bandge = bandge;
    };
    DataManager.prototype.getCurrentBandge = function () {
        return this.bandge;
    };
    DataManager.prototype.setUser = function (user) {
        this.user = user;
    };
    DataManager.prototype.getUser = function () {
        return this.user;
    };
    /**
     * 更新数据
     */
    DataManager.prototype.updateUser = function (key, data) {
        this.user[key] = data;
    };
    DataManager.prototype.updateUserInfo = function (data) {
        if (typeof (this.user) != 'undefined') {
            data['attrName'] = this.user.attrName;
            data['attrInfo'] = this.user.attrInfo;
        }
        this.user = data;
    };
    DataManager.prototype.getEquipCategory = function () {
    };
    //设置签到数据
    DataManager.prototype.setSign = function (data) {
        this.sign = data;
    };
    DataManager.prototype.getSign = function () {
        return this.sign;
    };
    //设置pk 数据
    DataManager.prototype.setPk = function (data) {
        if (data.pkCode)
            this.pkData.pkCode = data.pkCode;
        if (data.pkType)
            this.pkData.pkType = data.pkType;
        if (data.pkUser)
            this.pkData.pkUser = data.pkUser;
    };
    DataManager.prototype.setPkstart = function (data) {
        this.pkData.status = 1;
        this.pkData.type = data.type;
        this.pkData.questions = data.pkQuestions;
    };
    /**
     * 设置pk 结果
     */
    DataManager.prototype.setPkResult = function (data) {
        var winner = data.winUserId;
        var status = PkResult.SUCCESS;
        if (winner == 0) {
            status = PkResult.DRAW;
        }
        else if (winner != this.user.userId) {
            status = PkResult.FAIL;
        }
        var pkUser = null;
        if (this.pkData && this.pkData.pkUser) {
            pkUser = this.pkData.pkUser;
        }
        var result = {};
        result['status'] = status;
        result['sender'] = data[this.user.userId];
        if (pkUser)
            result['receiver'] = data[pkUser.userId];
        else
            result['receiver'] = null;
        console.log('setPkResult', result);
        this.pkData.result = result;
        //更新用户数据
        Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", function (info) {
            DataManager.getInstance().updateUserInfo(info.data);
        });
    };
    DataManager.prototype.setPkResult1 = function (data) {
        var winner = data.winUserId;
        var status = PkResult.SUCCESS;
        if (winner == 0) {
            status = PkResult.DRAW;
        }
        else if (winner != this.user.userId) {
            status = PkResult.FAIL;
        }
        var result = {};
        result['status'] = status;
        for (var _i = 0, _a = data.pkUsers; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.userId == this.user.userId) {
                result['sender'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            }
            else {
                result['receiver'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            }
        }
        this.pkData.result = result;
    };
    DataManager.prototype.convertPkResult = function (data) {
        var winner = data.winUserId;
        var status = PkResult.FAIL;
        if (winner == 0) {
            status = PkResult.DRAW;
        }
        else {
            if (winner == this.user.userId) {
                status = PkResult.SUCCESS;
            }
        }
        if (data.tipsCode > 0) {
            status = PkResult.INVALID;
        }
        var pkUser = this.pkData.pkUser;
        var result = {};
        result['tipsMsg'] = data['tipsMsg'];
        result['status'] = status;
        result['sender'] = data[data.sendUserId];
        result['receiver'] = data[data.acceptUserId];
        return result;
    };
    DataManager.prototype.convertPkResult1 = function (data) {
        var winner = data.winUserId;
        var status = PkResult.FAIL;
        if (winner == 0) {
            status = PkResult.DRAW;
        }
        else {
            if (winner == this.user.userId) {
                status = PkResult.SUCCESS;
            }
        }
        var pkUser = this.pkData.pkUser;
        var result = {};
        result['status'] = status;
        for (var _i = 0, _a = data.pkUsers; _i < _a.length; _i++) {
            var user = _a[_i];
            if (user.userId == data.sendUserId) {
                result['sender'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            }
            else {
                result['receiver'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            }
        }
        return result;
    };
    /**
     * PK结果
     */
    DataManager.prototype.getPkResult = function () {
        return this.pkData.result;
    };
    DataManager.prototype.getPkData = function () {
        return this.pkData;
    };
    /**
     * 清空pk结果
     */
    DataManager.prototype.removePkData = function () {
        this.pkData = {};
    };
    DataManager.prototype.setPkModel = function (model) {
        this.pkModel = model;
    };
    DataManager.prototype.getPkModel = function () {
        return this.pkModel;
    };
    DataManager.prototype.test = function () {
        this.roomList = {
            6: [
                {
                    room: 12341,
                    roomId: '11212',
                    status: 1,
                    roomNumber: 6,
                    in: 5,
                    see: 2,
                }, {
                    room: 12342,
                    roomId: '11212',
                    status: 2,
                    roomNumber: 6,
                    in: 5,
                    see: 2,
                }, {
                    room: 12343,
                    roomId: '11212',
                    status: 1,
                    roomNumber: 6,
                    in: 5,
                    see: 2,
                }, {
                    room: 12344,
                    status: 2,
                    roomId: '11212',
                    roomNumber: 6,
                    in: 5,
                    see: 2,
                },
            ],
            10: [
                {
                    room: 12345,
                    roomId: '11212',
                    status: 1,
                    roomNumber: 10,
                    in: 5,
                    see: 2,
                },
                {
                    room: 12346,
                    roomId: '11212',
                    status: 2,
                    roomNumber: 10,
                    in: 5,
                    see: 2,
                },
                {
                    room: 12347,
                    roomId: '11212',
                    status: 1,
                    roomNumber: 10,
                    in: 5,
                    see: 2,
                },
                {
                    room: 12348,
                    roomId: '11212',
                    status: 2,
                    roomNumber: 10,
                    in: 5,
                    see: 2,
                },
            ]
        };
        // this.pkUsers = {
        //     green: [{ nickName: '张三', avatar: null }, null, { nickName: '李四' }, { nickName: '顽固' }, { nickName: '第多少' }],
        //     blue: [{ nickName: '刚发的' }, { nickName: '订单' }, null, { nickName: '的味道' }, { nickName: '大萨达' }]
        // }
    };
    DataManager.prototype.clearRoomData = function () {
        this.roomData = null;
    };
    /**
     * 设置房间信息
     */
    DataManager.prototype.setRoomData = function (tableNo, roomType, roomNumber, joinType, users) {
        this.roomData = new Room();
        this.roomData.tableNo = tableNo;
        this.roomData.roomType = roomType;
        this.roomData.roomNumber = roomNumber;
        this.roomData.joinType = joinType;
        var roomUsers = {};
        //初始化
        for (var i = 1; i < roomNumber + 1; i++) {
            var format = {};
            format['status'] = ReadyType.UNJOIN;
            format['userInfo'] = null;
            format['position'] = i;
            roomUsers[i] = format;
        }
        //格式化用户信息
        for (var key in users) {
            var user = users[key];
            var format = {};
            var position = Number(key) + 1;
            if (user && position > 0) {
                format['team'] = user['team'];
                format['position'] = user['index'];
                format['userInfo'] = user['userInfo'];
                format['status'] = user.ok ? ReadyType.READYED : ReadyType.UNREADY;
                this.updateRoomSelfData(format);
                roomUsers[position] = format;
            }
        }
        console.log('users', roomUsers);
        this.roomData.users = roomUsers;
        /**
        
        
                this.roomData.pkResult = {
                    winner: 1, // 0 平局 1：绿队 2蓝队
                    end: 0,//比赛未结束 1 已结束
                    mvp: [2, 6],
                    score: {
                        1: 5,
                        2: 3
                    },
                    result: {
                        1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 4, 7: 2, 8: 4, 9: 1, 10: 5
                    }
                }
                this.roomData.pkData = {
                    pkCode: 1233333,
                    pkType: 2,
                    questions: [{ id: 961 }, { id: 962 }, { id: 963 }],
                    users: {
                        1: {
                            nickName: '张三', avatar: null, status: 1, position: 1,
                        },
                        2: {
                            nickName: '王五', avatar: null, status: 1, position: 6,
                        },
                    },
                    result: {
                        score: {
                            1: 50,
                            2: 30
                        },
                        winner: 1,
                    }
                }
         */
    };
    /**更新房间自己的数据 */
    DataManager.prototype.updateRoomSelfData = function (format) {
        if (format.userInfo && format.userInfo.userId == this.user.userId) {
            var number = this.roomData.roomNumber / 2;
            var team = format.position > number ? TeamType.BLUE : TeamType.GREEN;
            //定义self数据
            var self_1 = {
                position: format.position,
                status: format['status'],
                userId: this.user.userId,
                team: team
            };
            this.roomData.self = self_1;
        }
    };
    DataManager.prototype.getRoomData = function () {
        return this.roomData;
    };
    DataManager.prototype.getPkUsers = function () {
        return this.pkUsers;
    };
    /**
     * 更新用户数据
     */
    DataManager.prototype.updateTeamUser = function (user) {
        //TODO
        // let user = userData.joinUser;
        var format = {};
        var position = user.index;
        console.log('user', user);
        format['position'] = position;
        if (user.userInfo) {
            format['userInfo'] = user['userInfo'];
            format['status'] = user.ok ? ReadyType.READYED : ReadyType.UNREADY;
            //检查是否是自己
            this.updateRoomSelfData(format);
        }
        else {
            format['userInfo'] = null;
            format['status'] = ReadyType.UNJOIN;
        }
        if (this.roomData && this.roomData.users)
            this.roomData.users[position] = format;
        console.log('updateTeamUser', format);
    };
    /**
     * 用户离开 更新数据
     */
    DataManager.prototype.updateUserLeave = function (user) {
        var format = {};
        var position = user.index;
        console.log('user', user);
        format['position'] = position;
        format['userInfo'] = null;
        format['status'] = ReadyType.UNJOIN;
        if (this.roomData && this.roomData.users)
            this.roomData.users[position] = format;
        console.log('updateTeamUser', format);
    };
    /**
     * 更新用户的准备状态
     */
    DataManager.prototype.updateTeamUserStatus = function (position, status) {
        if (this.roomData && this.roomData.users[position])
            this.roomData.users[position].status = status ? ReadyType.READYED : ReadyType.UNREADY;
    };
    /**
     * 当前用户 状态
     */
    DataManager.prototype.setRoomSelfData = function (data) {
        var position = data.index;
        var number = this.roomData.roomNumber / 2;
        var team = position > number ? TeamType.BLUE : TeamType.GREEN;
        var self = {
            position: position,
            status: ReadyType.READYED,
            userId: data.userId,
            team: team
        };
        this.roomData.self = self;
    };
    DataManager.prototype.getRoomSelfData = function () {
        return this.roomData.self;
    };
    DataManager.prototype.getRoomUser = function (position) {
        if (this.roomData) {
            return this.roomData.users[position];
        }
        return null;
    };
    /**
     * 更新房间数据
     */
    DataManager.prototype.updateRoomData = function (data) {
        //TODO
    };
    /**
     * 更新pk 数据
     */
    DataManager.prototype.updateTeamPkData = function (data) {
        var _this = this;
        if (!this.roomData)
            return;
        var pkData = {};
        pkData['questions'] = data['questions'];
        if (this.roomData.roomType == PkModel.KNOW) {
            //知识赛
            var groups = data.groups;
            var _loop_1 = function (key) {
                var group = groups[key];
                var isSelfGroup = false;
                var users = {};
                group.map(function (item) {
                    if (item) {
                        if (_this.roomData.joinType == JoinType.JOIN && _this.roomData.self && item.userId == _this.roomData.self['userId']) {
                            isSelfGroup = true;
                        }
                        users[item.team] = item.userInfo;
                    }
                });
                //用户所在的group
                if (isSelfGroup) {
                    pkData['groupId'] = key;
                    pkData['users'] = users;
                }
            };
            for (var key in groups) {
                _loop_1(key);
            }
        }
        this.roomData.pkData = pkData;
        console.log('updateTeamPkData', this.roomData.pkData);
        // = {
        //         pkCode: 1233333,
        //         pkType: 2,
        //         questions: [{ id: 961 }, { id: 962 }, { id: 963 }],
        //         users: {
        //             1: {
        //                 nickName: '张三', avatar: null, status: 1, position: 1,
        //             },
        //             2: {
        //                 nickName: '王五', avatar: null, status: 1, position: 6,
        //             },
        //         },
        //         result: {
        //             score: {
        //                 1: 50,
        //                 2: 30
        //             },
        //             winner: 1,
        //         }
        //     }
    };
    DataManager.prototype.updateTeamPersonPkResult = function (data) {
        if (!this.roomData)
            return;
        var score = {};
        data.group.map(function (item) {
            score[item.team] = item.totalScore;
        });
        var result = {
            winner: data.winTeam,
            score: score
        };
        this.roomData.pkData.result = result;
    };
    DataManager.prototype.updateTeamPkResult = function (data) {
        if (!this.roomData)
            return;
        var winner = 0;
        if (data.teamScore[UserPositionType.LEFT] > data.teamScore[UserPositionType.RIGHT]) {
            winner = UserPositionType.LEFT;
        }
        else if (data.teamScore[UserPositionType.LEFT] < data.teamScore[UserPositionType.RIGHT]) {
            winner = UserPositionType.RIGHT;
        }
        this.roomData.pkResult = {
            winner: winner,
            mvps: data.mvps,
            score: data.teamScore,
        };
    };
    /**更新pk结果页 */
    DataManager.prototype.updateTeamKonwResult = function (data) {
        if (!this.roomData)
            return;
        var pkResult = {
            score: data.teamScore,
            end: data.isOver,
        };
        if (data.isOver) {
            var winner = 0;
            if (data.teamScore[UserPositionType.LEFT] > data.teamScore[UserPositionType.RIGHT]) {
                winner = UserPositionType.LEFT;
            }
            else if (data.teamScore[UserPositionType.LEFT] < data.teamScore[UserPositionType.RIGHT]) {
                winner = UserPositionType.RIGHT;
            }
            pkResult['winner'] = winner;
        }
        var result = {};
        if (data.groupProgress) {
            data.groupProgress.map(function (key) {
                var group = data.groups[key];
                group.map(function (item) {
                    if (item) {
                        var status_1 = 0;
                        switch (item.isWin) {
                            case 1:
                                status_1 = WinnerStatus.WIN;
                                break;
                            case 0:
                                status_1 = WinnerStatus.DRAW;
                                break;
                            case -1:
                                status_1 = WinnerStatus.LOSE;
                                break;
                        }
                        if (item.isMvp)
                            status_1 = WinnerStatus.MVP;
                        result[item.userIndex] = status_1;
                    }
                });
            });
        }
        pkResult['result'] = result;
        this.roomData.pkResult = pkResult;
    };
    DataManager.prototype.getTeamPkData = function () {
        if (this.roomData)
            return this.roomData.pkData;
        return null;
    };
    return DataManager;
}(egret.EventDispatcher));
__reflect(DataManager.prototype, "DataManager");
