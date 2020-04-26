
/**
 * 数据管理器
 */

class DataManager extends egret.EventDispatcher {

    private static instance: DataManager;

    private user;
    private bandge;
    private sign;
    private equipment = null;
    public channel;

    private pkData;
    private pkModel;

    public hasShowRanker = false;
    public hasShowSignIn = false;

    /**
     * 房间列表信息
     */
    private roomList;
    private pkUsers; //团战用户列表
    private roomData: Room; //房间数据


    private constructor() {
        super()
        this.pkData = {};
    }
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new DataManager();
        }
        return this.instance;
    }

    public setCurrentBandge(bandge) {
        this.bandge = bandge;
    }

    public getCurrentBandge() {
        return this.bandge;
    }


    public setUser(user) {
        this.user = user;
    }

    public getUser() {
        return this.user;
    }

    /**
     * 更新数据
     */
    public updateUser(key, data) {
        this.user[key] = data;
    }


    public updateUserInfo(data) {
        if(typeof(this.user) != 'undefined')
        {
            data['attrName'] = this.user.attrName;
            data['attrInfo'] = this.user.attrInfo;
        }
        
        this.user = data;
    }

    public getEquipCategory() {

    }

    //设置签到数据
    public setSign(data) {
        this.sign = data;
    }

    public getSign() {
        return this.sign;
    }

    //设置pk 数据
    public setPk(data) {
        if (data.pkCode) this.pkData.pkCode = data.pkCode;
        if (data.pkType) this.pkData.pkType = data.pkType;
        if (data.pkUser) this.pkData.pkUser = data.pkUser;
    }

    public setPkstart(data) {
        this.pkData.status = 1;
        this.pkData.type = data.type;
        this.pkData.questions = data.pkQuestions;
    }

    /**
     * 设置pk 结果
     */
    public setPkResult(data) {

        let winner = data.winUserId;
        let status = PkResult.SUCCESS;
        if (winner == 0) { //平局
            status = PkResult.DRAW;
        } else if (winner != this.user.userId) {
            status = PkResult.FAIL;
        }
        let pkUser = null;
        if (this.pkData && this.pkData.pkUser) {
            pkUser = this.pkData.pkUser;
        }
        let result = {};
        result['status'] = status
        result['sender'] = data[this.user.userId];
        if (pkUser) result['receiver'] = data[pkUser.userId];
        else result['receiver'] = null
        console.log('setPkResult', result);
        this.pkData.result = result;
        //更新用户数据
        Http.getInstance().post(Url.HTTP_USER_BASE_INFO, "", (info) => {
            DataManager.getInstance().updateUserInfo(info.data);
        })
    }

    public setPkResult1(data) {
        let winner = data.winUserId;
        let status = PkResult.SUCCESS;
        if (winner == 0) { //平局
            status = PkResult.DRAW;
        } else if (winner != this.user.userId) {
            status = PkResult.FAIL;
        }

        let result = {};
        result['status'] = status
        for (var user of data.pkUsers) {
            if (user.userId == this.user.userId) {
                result['sender'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            } else {
                result['receiver'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            }
        }
        this.pkData.result = result;

    }

    public convertPkResult(data) {
        let winner = data.winUserId;
        let status = PkResult.FAIL;
        if (winner == 0) { //平局
            status = PkResult.DRAW;
        } else {
            if (winner == this.user.userId) {
                status = PkResult.SUCCESS;
            }
        }
        if (data.tipsCode > 0) {
            status = PkResult.INVALID;
        }

        let pkUser = this.pkData.pkUser;
        let result = {};
        result['tipsMsg'] = data['tipsMsg'];
        result['status'] = status
        result['sender'] = data[data.sendUserId];
        result['receiver'] = data[data.acceptUserId];
        return result;
    }

    public convertPkResult1(data) {
        let winner = data.winUserId;
        let status = PkResult.FAIL;
        if (winner == 0) { //平局
            status = PkResult.DRAW;
        } else {
            if (winner == this.user.userId) {
                status = PkResult.SUCCESS;
            }
        }
        let pkUser = this.pkData.pkUser;
        let result = {};
        result['status'] = status
        for (var user of data.pkUsers) {
            if (user.userId == data.sendUserId) {
                result['sender'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            } else {
                result['receiver'] = {
                    pkUser: user,
                    pkResult: data.pkResults[user.userId]
                };
            }
        }
        return result;
    }

    /**
     * PK结果
     */
    public getPkResult() {
        return this.pkData.result;
    }

    public getPkData() {
        return this.pkData;
    }


    /**
     * 清空pk结果
     */
    public removePkData() {
        this.pkData = {};
    }


    public setPkModel(model) {
        this.pkModel = model;
    }

    public getPkModel() {
        return this.pkModel;
    }


    public test() {


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
        }

        // this.pkUsers = {
        //     green: [{ nickName: '张三', avatar: null }, null, { nickName: '李四' }, { nickName: '顽固' }, { nickName: '第多少' }],
        //     blue: [{ nickName: '刚发的' }, { nickName: '订单' }, null, { nickName: '的味道' }, { nickName: '大萨达' }]
        // }

    }

    public clearRoomData() {
        this.roomData = null;
    }
    /**
     * 设置房间信息
     */
    public setRoomData(tableNo: string, roomType: PkModel, roomNumber: RoomNumber, joinType: JoinType, users: Array<any>) {
        this.roomData = new Room();
        this.roomData.tableNo = tableNo;
        this.roomData.roomType = roomType;
        this.roomData.roomNumber = roomNumber;
        this.roomData.joinType = joinType;

        let roomUsers = {
        };
        //初始化
        for (let i = 1; i < roomNumber + 1; i++) {
            let format = {}
            format['status'] = ReadyType.UNJOIN;
            format['userInfo'] = null;
            format['position'] = i;
            roomUsers[i] = format;
        }

        //格式化用户信息
        for (let key in users) {
            let user = users[key];
            let format = {}
            let position = Number(key) + 1;

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

        
        // test begin
        // this.roomData.pkResult = {
        //     winner: 2, // 0 平局 1：绿队 2蓝队 
        //     end: 1,//比赛未结束 1 已结束
        //     mvp: [2, 6],
        //     score: {
        //         1: 5,
        //         2: 3
        //     },
        //     result: {
        //         1: 1, 2: 4, 3: 3, 4: 4, 5: 5, 6: 4, 7: 2, 8: 4, 9: 1, 10: 5
        //     }
        // }
        // this.roomData.pkData = {
        //     pkCode: 1233333,
        //     pkType: 2,
        //     questions: [{ id: 961 }, { id: 962 }, { id: 963 }],
        //     users: {
        //         1: {
        //             nickName: '周武Zhou Wu周武Zhou Wu', avatar: 'http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg', status: 1, position: 1,
        //         },
        //         2: {
        //             nickName: '王五', avatar: 'http://127.0.0.1:8360/uploads/avatar/13886593297_avatar.jpg', status: 1, position: 6,
        //         },
        //     },
        //     result: {
        //         score: {
        //             1: 50,
        //             2: -30
        //         },
        //         winner: 1,
        //     }
        // }
        // test end
    }

    /**更新房间自己的数据 */
    public updateRoomSelfData(format) {
        if (format.userInfo && format.userInfo.userId == this.user.userId) {
            let number = this.roomData.roomNumber / 2;
            let team = format.position > number ? TeamType.BLUE : TeamType.GREEN;
            //定义self数据
            let self = {
                position: format.position,
                status: format['status'],
                userId: this.user.userId,
                team: team
            }
            this.roomData.self = self;
        }
    }


    public getRoomData(): Room {
        return this.roomData;
    }


    public getPkUsers() {
        return this.pkUsers;
    }

    /**
     * 更新用户数据 
     */
    public updateTeamUser(user) {
        //TODO
        // let user = userData.joinUser;
        let format = {}
        let position = user.index;
        console.log('user', user)
        format['position'] = position;
        if (user.userInfo) {
            format['userInfo'] = user['userInfo'];
            format['status'] = user.ok ? ReadyType.READYED : ReadyType.UNREADY;
            //检查是否是自己
            this.updateRoomSelfData(format)
        } else {
            format['userInfo'] = null;
            format['status'] = ReadyType.UNJOIN;
        }
        if (this.roomData && this.roomData.users) this.roomData.users[position] = format;
        console.log('updateTeamUser', format)
    }

    /**
     * 用户离开 更新数据
     */
    public updateUserLeave(user) {
        let format = {}
        let position = user.index;
        console.log('user', user)
        format['position'] = position;
        format['userInfo'] = null;
        format['status'] = ReadyType.UNJOIN;
        if (this.roomData && this.roomData.users) this.roomData.users[position] = format;
        console.log('updateTeamUser', format)
    }


    /**
     * 更新用户的准备状态
     */
    public updateTeamUserStatus(position, status) {
        if (this.roomData && this.roomData.users[position])
            this.roomData.users[position].status = status ? ReadyType.READYED : ReadyType.UNREADY;
    }
    /**
     * 当前用户 状态
     */
    public setRoomSelfData(data) {
        let position = data.index;
        let number = this.roomData.roomNumber / 2;
        let team = position > number ? TeamType.BLUE : TeamType.GREEN;
        let self = {
            position: position,
            status: ReadyType.READYED,
            userId: data.userId,
            team: team
        }
        this.roomData.self = self;
    }

    public getRoomSelfData(): any {
        return this.roomData.self;
    }


    public getRoomUser(position) {
        if (this.roomData) {
            return this.roomData.users[position]
        }
        return null;
    }

    /**
     * 更新房间数据
     */
    public updateRoomData(data) {
        //TODO
    }

    /**
     * 更新pk 数据
     */
    public updateTeamPkData(data) {
        if (!this.roomData) return;
        let pkData = {};
        pkData['questions'] = data['questions'];
        if (this.roomData.roomType == PkModel.KNOW) {
            //知识赛
            let groups = data.groups;
            for (let key in groups) {
                let group = groups[key];
                let isSelfGroup = false;
                let users = {}
                group.map(item => {
                    if (item) {
                        if (this.roomData.joinType == JoinType.JOIN && this.roomData.self && item.userId == this.roomData.self['userId']) {
                            isSelfGroup = true;
                        }
                        users[item.team] = item.userInfo;
                    }
                })
                //用户所在的group
                if (isSelfGroup) {
                    pkData['groupId'] = key;
                    pkData['users'] = users;
                }
            }
        }
        this.roomData.pkData = pkData;

        console.log('updateTeamPkData', this.roomData.pkData)
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

    }

    public updateTeamPersonPkResult(data) {
        if (!this.roomData) return;
        let score = {};
        data.group.map(item => {
            score[item.team] = item.totalScore;
        });

        let result = {
            winner: data.winTeam,
            score: score
        }
        this.roomData.pkData.result = result;
    }


    public updateTeamPkResult(data) {
        if (!this.roomData) return;
        let winner = 0;
        if (data.teamScore[UserPositionType.LEFT] > data.teamScore[UserPositionType.RIGHT]) {
            winner = UserPositionType.LEFT;
        } else if (data.teamScore[UserPositionType.LEFT] < data.teamScore[UserPositionType.RIGHT]) {
            winner = UserPositionType.RIGHT;
        }
        this.roomData.pkResult = {
            winner: winner, // 0 平局 1：绿队 2蓝队 
            mvps: data.mvps,
            score: data.teamScore,
        }
    }

    /**更新pk结果页 */
    public updateTeamKonwResult(data) {
        if (!this.roomData) return;
        let pkResult = {
            score: data.teamScore,
            end: data.isOver,
        }
        if (data.isOver) {
            let winner = 0;
            if (data.teamScore[UserPositionType.LEFT] > data.teamScore[UserPositionType.RIGHT]) {
                winner = UserPositionType.LEFT;
            } else if (data.teamScore[UserPositionType.LEFT] < data.teamScore[UserPositionType.RIGHT]) {
                winner = UserPositionType.RIGHT;
            }
            pkResult['winner'] = winner;
        }
        let result = {};
        if (data.groupProgress) {
            data.groupProgress.map(key => {
                let group = data.groups[key];
                group.map(item => {
                    if (item) {
                        let status = 0;
                        switch (item.isWin) {
                            case 1:
                                status = WinnerStatus.WIN
                                break;
                            case 0:
                                status = WinnerStatus.DRAW;
                                break;
                            case -1:
                                status = WinnerStatus.LOSE;
                                break;
                        }
                        if (item.isMvp) status = WinnerStatus.MVP;
                        result[item.userIndex] = status;
                    }
                })
            })
        }
        pkResult['result'] = result;
        this.roomData.pkResult = pkResult;
    }



    public getTeamPkData() {
        if (this.roomData) return this.roomData.pkData
        return null;
    }



}
