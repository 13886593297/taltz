class PkRoomScene extends Scene {

    public model;
    public roomNumber;
    private tableNo;
    private joinType;

    private roomView;
    private scrollView


    private roomListViews;


    private tableType;

    private readonly titles = {
        '6': [
            { text: "10人房", style: { "size": 28, bold: true, textColor: 0xffffff } },
            { text: " | ", style: { "size": 30, textColor: 0xffffff } },
            { text: "6", style: { "size": 38, bold: true, textColor: Config.COLOR_YELLOW } },
            { text: "人房", style: { "size": 34, bold: true, textColor: Config.COLOR_YELLOW } }
        ],
        '10': [
            { text: "10", style: { "size": 38, bold: true, textColor: Config.COLOR_YELLOW } },
            { text: "人房", style: { "size": 34, textColor: Config.COLOR_YELLOW } },
            { text: " | ", style: { "size": 28 } },
            { text: "6人房", style: { "size": 30, bold: true } }
        ],
    }

    private roomList = {
        6: [],
        10: []
    }

    constructor(model) {
        super();
        this.name = "room";
        this.model = model;
        this.roomNumber = RoomNumber.TEN;
    }
    

    private getTableType() {
        switch (this.model) {
            case PkModel.ANSWER:
                return '1' + (this.roomNumber == RoomNumber.SIX ? '06' : this.roomNumber)
            case PkModel.KNOW:
                return '2' + (this.roomNumber == RoomNumber.SIX ? '06' : this.roomNumber)
        }
    }



    public initEvent() {
        function compare(pro) { 
            return function (obj1, obj2) { 
                var val1 = obj1[pro]; 
                var val2 = obj2[pro]; 
                if (val1 < val2 ) { //正序
                    return -1; 
                } else if (val1 > val2 ) { 
                    return 1; 
                } else { 
                    return 0; 
                } 
            } 
        } 

        SocketX.getInstance().addEventListener(NetEvent.TEAM_ROOM_LIST, (data) => {
            let list =  data.data;
            list.sort(compare('tableNo'))
            this.roomList[this.roomNumber] = list;
            this.updateRoomList();
        }, this)

        SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: this.getTableType() });
        //更新
        SocketX.getInstance().addEventListener(NetEvent.TEAM_ROOMLIST_USER_UPDATE, (data) => {
            let res = data.data
            if (!res) return;
            if (this.roomListViews && this.roomListViews[data.data.tableNo]) {
                this.roomListViews[data.data.tableNo].update(data.data);
            }

            if (this.roomList[6].length > 0) {
                for (let key in this.roomList[6]) {
                    let room = this.roomList[6][key];
                    if (room.tableNo == data.data.tableNo) {
                        this.roomList[6][key] = data.data;
                        return;
                    }
                }
            }
            if (this.roomList[10].length > 0) {
                for (let key1 in this.roomList[10]) {
                    let room = this.roomList[10][key1];
                    if (room.tableNo == data.data.tableNo) {
                        this.roomList[10][key1] = data.data;
                        return;
                    }
                }
            }

        }, this, 'room')



        SocketX.getInstance().addEventListener(NetEvent.TEAM_JOIN_IN, (data) => {
            //加入房间 跳转页面
            //  DataManager.getInstance().setRoomData(item.roomId, this.model, item.roomNumber, JoinType.JOIN);
            //                 DataManager.getInstance().setRoomUser({});
            if (data.data.errCode && data.data.errCode > 0) {
                let confirm = new Confirm(data.data.errMsg, '重新选择', '进入旁观');
                this.addChild(confirm);
                confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, () => {
                    this.joinType = JoinType.OBSEVER;
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: this.tableNo, joinType: JoinType.OBSEVER });
                }, this);
            } else {
                let roomData = data.data;
                DataManager.getInstance().setRoomData(roomData.tableNo, this.model, roomData.maxJoin, this.joinType, roomData.users);
                if (roomData.status == 0) {
                    let teamMatch = new TeamMatchScene(roomData.showTimeout);
                    ViewManager.getInstance().changeScene(teamMatch);
                } else { //进入答题页
                    DataManager.getInstance().updateTeamPkData(data.data);
                    this.GoBattle();
                }


            }
        }, this)
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            if (this.canJump) {
                DataManager.getInstance().updateTeamKonwResult(data.data);
                let scene = new TeamKnowResultScene();
                ViewManager.getInstance().changeScene(scene);
            }
        }, this)

    }

    private canJump = false;
    /**
     * 全部准备好 进行战斗状态
     */
    private GoBattle() {
        let roomData = DataManager.getInstance().getRoomData();
        let battleScene;
        switch (roomData.roomType) {
            case PkModel.ANSWER:
                battleScene = new TeamBattleScene(true);
                break;
            case PkModel.KNOW:
                if (roomData.joinType == JoinType.JOIN) {
                    battleScene = new TeamKnowBattleScene();
                } else {
                    this.canJump = true;
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo })
                }
                break;
        }
        if (battleScene) {
            ViewManager.getInstance().changeScene(battleScene);
        }
    }


    public init() {

        this.initEvent();

        let y = 80;
        let title = new Title('');
        this.addChild(title);
        title.y = y;
        let titleText = this.titles[this.roomNumber];
        title.updateTitle(titleText);
        title.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.roomNumber = this.roomNumber == RoomNumber.SIX ? RoomNumber.TEN : RoomNumber.SIX;
            let titleText = this.titles[this.roomNumber];
            title.updateTitle(titleText);
            if (this.roomList[this.roomNumber].length > 0) {
                this.updateRoomList();
            } else {
                SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: this.getTableType() });
            }
        }, this);

        let roomView = new eui.Group();
        roomView.width = this.stage.stageWidth;
        // roomView.y = 200;
        var myScroller: eui.Scroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = this.stage.stageHeight - 300;
        myScroller.y = 200;
        //设置viewport
        myScroller.viewport = roomView;
        this.addChild(myScroller);
        this.scrollView = myScroller;
        this.roomView = roomView;
        // let data= {"code":0,"data":[{"tableNo":"11001","joinNum":1,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11002","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11003","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11004","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11005","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11006","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11007","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11008","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11009","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11010","joinNum":0,"watchNum":0,"maxJoin":10,"status":0}]}
        // this.roomList[this.roomNumber] = data.data; 
        // this.updateRoomList();
    }
    public updateScene() {
        this.updateRoomList();
    }

    private updateRoomList() {
        let roomList = this.roomList[this.roomNumber]
        if (roomList && roomList.length > 0) {
            this.scrollView.viewport.scrollV = 0;
            this.roomView.removeChildren();
            this.roomListViews = {};
            let y = 0;
            for (let item of roomList) {
                item.model = this.model;
                item.roomNumber = this.roomNumber;
                let roomItem = new RoomItem(item);
                roomItem.y = y;
                this.roomView.addChild(roomItem);
                roomItem.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    //根据item 状态进行判断
                    console.log(item);
                    // let teamMatch = new TeamMatchScene();
                    // //  let teamMatch = new TeamBattleScene();
                    // ViewManager.getInstance().changeScene(teamMatch);
                    this.tableNo = item.tableNo;
                    if (item.status == RoomStatus.PK) {
                        let confirm = new Confirm('比赛进行中 \n是否进入观战模式');
                        this.addChild(confirm);
                        confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, () => {
                            this.joinType = JoinType.OBSEVER;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER });
                        }, this);
                    } else {
                        let confirm = new Confirm('请选择您进入房间的角色身份', '我是参赛者', '我是旁观者');
                        this.addChild(confirm);
                        confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, () => {
                            //TODO  发送进入房间时间
                            this.joinType = JoinType.JOIN;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.JOIN });
                        }, this);
                        confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, () => {
                            //我是旁观者
                            this.joinType = JoinType.OBSEVER;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER });
                        }, this);
                    }
                }, this);
                y += 200;
                this.roomListViews[item.tableNo] = roomItem;
            }
        }
    }

}


class RoomItem extends eui.Group {
    private data;
    private readonly models = {
        "3": "抢答题",
        "4": "知识题"
    };

    private numberText;
    private statusText;

    constructor(data) {
        super();
        this.data = data;
        this.init();
    }

    public init() {
        this.width = 750;
        this.height = 160;
        let stage = ViewManager.getInstance().stage;
        this.x = stage.stageWidth / 2 - 375;
        let bg = Util.createBitmapByName('bg_level_pass_png');
        bg.width = 700;
        bg.x = 25;
        bg.height = 160;
        this.addChild(bg);

        let roomText = new egret.TextField();
        roomText.x = 65;
        roomText.y = 30;
        roomText.textColor = Config.COLOR_YELLOW;
        roomText.verticalAlign = egret.VerticalAlign.MIDDLE;

        let model = this.models[this.data.model];
        roomText.textFlow = <Array<egret.ITextElement>>[
            { text: model, style: { "size": 28 } },
            { text: "  房间号: ", style: { "size": 28 } },
            { text: `${this.data.tableNo}`, style: { "size": 38, bold: true } }
        ]

        this.addChild(roomText);


        let numberText = new egret.TextField();
        numberText.x = 65;
        numberText.y = 90;
        // numberText.textColor = Config.COLOR_YELLOW;
        numberText.size = 32;
        let watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum;
        let joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum;

        numberText.textFlow = <Array<egret.ITextElement>>[
            { text: "观 战: " },
            { text: `${watchNum}人    `, style: { "size": 34, } },
            { text: `${joinNum}/${this.data.maxJoin}`, style: { "size": 32, } }
        ]
        this.numberText = numberText
        this.addChild(numberText);
        let text = "战场等待中"
        if (this.data.status == RoomStatus.PK) {
            text = "团队pk中";
        }


        let statusText = new egret.TextField();
        statusText.height = 160;
        statusText.verticalAlign = egret.VerticalAlign.MIDDLE;
        statusText.width = 300;
        statusText.textAlign = egret.HorizontalAlign.RIGHT;
        statusText.x = 350;
        statusText.text = text
        statusText.size = 42;
        this.addChild(statusText);
        this.statusText  = statusText;
    }

    public update(data) {
        this.data = data;
        let watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum;
        let joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum;
        this.numberText.textFlow = <Array<egret.ITextElement>>[
            { text: "观 战: " },
            { text: `${watchNum}人    `, style: { "size": 34, } },
            { text: `${joinNum}/${this.data.maxJoin}`, style: { "size": 32, } }
        ]
        let text = this.data.status == RoomStatus.PK?"团队pk中":"战场等待中"
        this.statusText = text
    }

}