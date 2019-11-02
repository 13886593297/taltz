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
var PkRoomScene = (function (_super) {
    __extends(PkRoomScene, _super);
    function PkRoomScene(model) {
        var _this = _super.call(this) || this;
        _this.titles = {
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
        };
        _this.roomList = {
            6: [],
            10: []
        };
        _this.canJump = false;
        _this.name = "room";
        _this.model = model;
        _this.roomNumber = RoomNumber.TEN;
        return _this;
    }
    PkRoomScene.prototype.getTableType = function () {
        switch (this.model) {
            case PkModel.ANSWER:
                return '1' + (this.roomNumber == RoomNumber.SIX ? '06' : this.roomNumber);
            case PkModel.KNOW:
                return '2' + (this.roomNumber == RoomNumber.SIX ? '06' : this.roomNumber);
        }
    };
    PkRoomScene.prototype.initEvent = function () {
        var _this = this;
        function compare(pro) {
            return function (obj1, obj2) {
                var val1 = obj1[pro];
                var val2 = obj2[pro];
                if (val1 < val2) {
                    return -1;
                }
                else if (val1 > val2) {
                    return 1;
                }
                else {
                    return 0;
                }
            };
        }
        SocketX.getInstance().addEventListener(NetEvent.TEAM_ROOM_LIST, function (data) {
            var list = data.data;
            list.sort(compare('tableNo'));
            _this.roomList[_this.roomNumber] = list;
            _this.updateRoomList();
        }, this);
        SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: this.getTableType() });
        //更新
        SocketX.getInstance().addEventListener(NetEvent.TEAM_ROOMLIST_USER_UPDATE, function (data) {
            var res = data.data;
            if (!res)
                return;
            if (_this.roomListViews && _this.roomListViews[data.data.tableNo]) {
                _this.roomListViews[data.data.tableNo].update(data.data);
            }
            if (_this.roomList[6].length > 0) {
                for (var key in _this.roomList[6]) {
                    var room = _this.roomList[6][key];
                    if (room.tableNo == data.data.tableNo) {
                        _this.roomList[6][key] = data.data;
                        return;
                    }
                }
            }
            if (_this.roomList[10].length > 0) {
                for (var key1 in _this.roomList[10]) {
                    var room = _this.roomList[10][key1];
                    if (room.tableNo == data.data.tableNo) {
                        _this.roomList[10][key1] = data.data;
                        return;
                    }
                }
            }
        }, this, 'room');
        SocketX.getInstance().addEventListener(NetEvent.TEAM_JOIN_IN, function (data) {
            //加入房间 跳转页面
            //  DataManager.getInstance().setRoomData(item.roomId, this.model, item.roomNumber, JoinType.JOIN);
            //                 DataManager.getInstance().setRoomUser({});
            if (data.data.errCode && data.data.errCode > 0) {
                var confirm_1 = new Confirm(data.data.errMsg, '重新选择', '进入旁观');
                _this.addChild(confirm_1);
                confirm_1.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, function () {
                    _this.joinType = JoinType.OBSEVER;
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: _this.tableNo, joinType: JoinType.OBSEVER });
                }, _this);
            }
            else {
                var roomData = data.data;
                DataManager.getInstance().setRoomData(roomData.tableNo, _this.model, roomData.maxJoin, _this.joinType, roomData.users);
                if (roomData.status == 0) {
                    var teamMatch = new TeamMatchScene(roomData.showTimeout);
                    ViewManager.getInstance().changeScene(teamMatch);
                }
                else {
                    DataManager.getInstance().updateTeamPkData(data.data);
                    _this.GoBattle();
                }
            }
        }, this);
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, function (data) {
            if (_this.canJump) {
                DataManager.getInstance().updateTeamKonwResult(data.data);
                var scene = new TeamKnowResultScene();
                ViewManager.getInstance().changeScene(scene);
            }
        }, this);
    };
    /**
     * 全部准备好 进行战斗状态
     */
    PkRoomScene.prototype.GoBattle = function () {
        var roomData = DataManager.getInstance().getRoomData();
        var battleScene;
        switch (roomData.roomType) {
            case PkModel.ANSWER:
                battleScene = new TeamBattleScene(true);
                break;
            case PkModel.KNOW:
                if (roomData.joinType == JoinType.JOIN) {
                    battleScene = new TeamKnowBattleScene();
                }
                else {
                    this.canJump = true;
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo });
                }
                break;
        }
        if (battleScene) {
            ViewManager.getInstance().changeScene(battleScene);
        }
    };
    PkRoomScene.prototype.init = function () {
        var _this = this;
        this.initEvent();
        var y = 80;
        var title = new Title('');
        this.addChild(title);
        title.y = y;
        var titleText = this.titles[this.roomNumber];
        title.updateTitle(titleText);
        title.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.roomNumber = _this.roomNumber == RoomNumber.SIX ? RoomNumber.TEN : RoomNumber.SIX;
            var titleText = _this.titles[_this.roomNumber];
            title.updateTitle(titleText);
            if (_this.roomList[_this.roomNumber].length > 0) {
                _this.updateRoomList();
            }
            else {
                SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: _this.getTableType() });
            }
        }, this);
        var roomView = new eui.Group();
        roomView.width = this.stage.stageWidth;
        // roomView.y = 200;
        var myScroller = new eui.Scroller();
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
    };
    PkRoomScene.prototype.updateScene = function () {
        this.updateRoomList();
    };
    PkRoomScene.prototype.updateRoomList = function () {
        var _this = this;
        var roomList = this.roomList[this.roomNumber];
        if (roomList && roomList.length > 0) {
            this.scrollView.viewport.scrollV = 0;
            this.roomView.removeChildren();
            this.roomListViews = {};
            var y = 0;
            var _loop_1 = function (item) {
                item.model = this_1.model;
                item.roomNumber = this_1.roomNumber;
                var roomItem = new RoomItem(item);
                roomItem.y = y;
                this_1.roomView.addChild(roomItem);
                roomItem.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    //根据item 状态进行判断
                    console.log(item);
                    // let teamMatch = new TeamMatchScene();
                    // //  let teamMatch = new TeamBattleScene();
                    // ViewManager.getInstance().changeScene(teamMatch);
                    _this.tableNo = item.tableNo;
                    if (item.status == RoomStatus.PK) {
                        var confirm_2 = new Confirm('比赛进行中 \n是否进入观战模式');
                        _this.addChild(confirm_2);
                        confirm_2.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, function () {
                            _this.joinType = JoinType.OBSEVER;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER });
                        }, _this);
                    }
                    else {
                        var confirm_3 = new Confirm('请选择您进入房间的角色身份', '我是参赛者', '我是旁观者');
                        _this.addChild(confirm_3);
                        confirm_3.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, function () {
                            //TODO  发送进入房间时间
                            _this.joinType = JoinType.JOIN;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.JOIN });
                        }, _this);
                        confirm_3.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, function () {
                            //我是旁观者
                            _this.joinType = JoinType.OBSEVER;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER });
                        }, _this);
                    }
                }, this_1);
                y += 200;
                this_1.roomListViews[item.tableNo] = roomItem;
            };
            var this_1 = this;
            for (var _i = 0, roomList_1 = roomList; _i < roomList_1.length; _i++) {
                var item = roomList_1[_i];
                _loop_1(item);
            }
        }
    };
    return PkRoomScene;
}(Scene));
__reflect(PkRoomScene.prototype, "PkRoomScene");
var RoomItem = (function (_super) {
    __extends(RoomItem, _super);
    function RoomItem(data) {
        var _this = _super.call(this) || this;
        _this.models = {
            "3": "抢答题",
            "4": "知识题"
        };
        _this.data = data;
        _this.init();
        return _this;
    }
    RoomItem.prototype.init = function () {
        this.width = 750;
        this.height = 160;
        var stage = ViewManager.getInstance().stage;
        this.x = stage.stageWidth / 2 - 375;
        var bg = Util.createBitmapByName('bg_level_pass_png');
        bg.width = 700;
        bg.x = 25;
        bg.height = 160;
        this.addChild(bg);
        var roomText = new egret.TextField();
        roomText.x = 65;
        roomText.y = 30;
        roomText.textColor = Config.COLOR_YELLOW;
        roomText.verticalAlign = egret.VerticalAlign.MIDDLE;
        var model = this.models[this.data.model];
        roomText.textFlow = [
            { text: model, style: { "size": 28 } },
            { text: "  房间号: ", style: { "size": 28 } },
            { text: "" + this.data.tableNo, style: { "size": 38, bold: true } }
        ];
        this.addChild(roomText);
        var numberText = new egret.TextField();
        numberText.x = 65;
        numberText.y = 90;
        // numberText.textColor = Config.COLOR_YELLOW;
        numberText.size = 32;
        var watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum;
        var joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum;
        numberText.textFlow = [
            { text: "观 战: " },
            { text: watchNum + "\u4EBA    ", style: { "size": 34, } },
            { text: joinNum + "/" + this.data.maxJoin, style: { "size": 32, } }
        ];
        this.numberText = numberText;
        this.addChild(numberText);
        var text = "战场等待中";
        if (this.data.status == RoomStatus.PK) {
            text = "团队pk中";
        }
        var statusText = new egret.TextField();
        statusText.height = 160;
        statusText.verticalAlign = egret.VerticalAlign.MIDDLE;
        statusText.width = 300;
        statusText.textAlign = egret.HorizontalAlign.RIGHT;
        statusText.x = 350;
        statusText.text = text;
        statusText.size = 42;
        this.addChild(statusText);
        this.statusText = statusText;
    };
    RoomItem.prototype.update = function (data) {
        this.data = data;
        var watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum;
        var joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum;
        this.numberText.textFlow = [
            { text: "观 战: " },
            { text: watchNum + "\u4EBA    ", style: { "size": 34, } },
            { text: joinNum + "/" + this.data.maxJoin, style: { "size": 32, } }
        ];
        var text = this.data.status == RoomStatus.PK ? "团队pk中" : "战场等待中";
        this.statusText = text;
    };
    return RoomItem;
}(eui.Group));
__reflect(RoomItem.prototype, "RoomItem");
