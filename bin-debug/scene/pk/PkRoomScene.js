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
            '6': ['room_six_png', 'room_ten_gray_png'],
            '10': ['room_six_gray_png', 'room_ten_png'],
        };
        _this.roomList = {
            6: [],
            10: []
        };
        _this.canJump = false;
        _this.name = "room";
        _this.model = model;
        _this.roomNumber = RoomNumber.SIX;
        return _this;
    }
    PkRoomScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.initEvent();
        var y = 100;
        var roomSix = new Title(this.titles[this.roomNumber][0]);
        roomSix.x = this.stage.stageWidth / 2 - roomSix.width - 20;
        roomSix.y = y;
        this.addChild(roomSix);
        roomSix.touchEnabled = true;
        roomSix.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.roomNumber == RoomNumber.TEN) {
                _this.roomNumber = RoomNumber.SIX;
                _this.initTitle(roomSix, roomTen);
            }
        }, this);
        var roomTen = new Title(this.titles[this.roomNumber][1]);
        roomTen.x = this.stage.stageWidth / 2 + 10;
        roomTen.y = y;
        this.addChild(roomTen);
        roomTen.touchEnabled = true;
        roomTen.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            if (_this.roomNumber == RoomNumber.SIX) {
                _this.roomNumber = RoomNumber.TEN;
                _this.initTitle(roomSix, roomTen);
            }
        }, this);
        var roomView = new eui.Group();
        roomView.width = this.stage.stageWidth;
        // roomView.y = 200
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth;
        myScroller.height = this.stage.stageHeight - 400;
        myScroller.y = 250;
        //设置viewport
        myScroller.viewport = roomView;
        this.addChild(myScroller);
        this.scrollView = myScroller;
        this.roomView = roomView;
        // let data= {"code":0,"data":[{"tableNo":"11001","joinNum":1,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11002","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11003","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11004","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11005","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11006","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11007","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11008","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11009","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11010","joinNum":0,"watchNum":0,"maxJoin":10,"status":0}]}
        // this.roomList[this.roomNumber] = data.data 
        // this.updateRoomList()
    };
    PkRoomScene.prototype.initTitle = function (roomSix, roomTen) {
        roomSix.updateTitle(this.titles[this.roomNumber][0]);
        roomTen.updateTitle(this.titles[this.roomNumber][1]);
        if (this.roomList[this.roomNumber].length > 0) {
            this.updateRoomList();
        }
        else {
            SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: this.getTableType() });
        }
    };
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
            //  DataManager.getInstance().setRoomData(item.roomId, this.model, item.roomNumber, JoinType.JOIN)
            //                 DataManager.getInstance().setRoomUser({})
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
                roomItem.x = (this_1.stage.stageWidth - roomItem.width) / 2;
                roomItem.y = y;
                this_1.roomView.addChild(roomItem);
                roomItem.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    //根据item 状态进行判断
                    console.log(item);
                    // let teamMatch = new TeamMatchScene()
                    // //  let teamMatch = new TeamBattleScene()
                    // ViewManager.getInstance().changeScene(teamMatch)
                    _this.tableNo = item.tableNo;
                    if (item.status == RoomStatus.PK) {
                        var confirm_2 = new Confirm("\u623F\u95F4" + item.tableNo + "\u6BD4\u8D5B\u8FDB\u884C\u4E2D\n\u662F\u5426\u8FDB\u5165\u89C2\u6218\u6A21\u5F0F\uFF1F");
                        _this.addChild(confirm_2);
                        confirm_2.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, function () {
                            _this.joinType = JoinType.OBSEVER;
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER });
                        }, _this);
                    }
                    else {
                        var confirm_3 = new Confirm('请选择您进入房间的\n角色身份', '参赛者', '旁观者');
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
                y += 180;
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
        _this.data = data;
        _this.init();
        return _this;
    }
    RoomItem.prototype.init = function () {
        var bg = Util.createBitmapByName('pk_team_list_bg_png');
        this.width = bg.width;
        this.height = bg.height;
        this.addChild(bg);
        var roomText = new egret.TextField;
        roomText.text = '房间号';
        roomText.x = 60;
        roomText.y = 18;
        this.addChild(roomText);
        var roomNumber = new egret.TextField;
        roomNumber.text = this.data.tableNo;
        roomNumber.width = 100;
        roomNumber.x = 150;
        roomNumber.y = 18;
        roomNumber.textAlign = 'right';
        this.addChild(roomNumber);
        var numberText = new egret.TextField;
        numberText.x = 60;
        numberText.y = 85;
        numberText.size = 24;
        var watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum;
        var joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum;
        numberText.textFlow = [
            { text: "\u89C2\u6218" + watchNum + "\u4EBA          " },
            { text: joinNum + "/" + this.data.maxJoin }
        ];
        this.numberText = numberText;
        this.addChild(numberText);
        var statusText = new egret.TextField;
        statusText.text = this.data.status == RoomStatus.PK ? "团队pk中" : "战场等待中";
        statusText.x = 290;
        statusText.width = 270;
        statusText.height = 150;
        statusText.textAlign = egret.HorizontalAlign.RIGHT;
        statusText.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.addChild(statusText);
        this.statusText = statusText;
        var icon = new egret.Bitmap();
        icon.texture = RES.getRes(this.data.status == RoomStatus.PK ? 'pk_icon_fighting_png' : 'pk_icon_wait_png');
        icon.x = this.data.status == RoomStatus.PK ? 570 : 580;
        icon.y = 57;
        this.addChild(icon);
        this.icon = icon;
    };
    RoomItem.prototype.update = function (data) {
        this.data = data;
        var watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum;
        var joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum;
        this.numberText.textFlow = [
            { text: "\u89C2\u6218" + watchNum + "\u4EBA          " },
            { text: joinNum + "/" + this.data.maxJoin }
        ];
        this.statusText = this.data.status == RoomStatus.PK ? "团队pk中" : "战场等待中";
        this.icon.texture = RES.getRes(this.data.status == RoomStatus.PK ? 'pk_icon_fighting_png' : 'pk_icon_wait_png');
        this.icon.x = this.data.status == RoomStatus.PK ? 570 : 580;
    };
    return RoomItem;
}(eui.Group));
__reflect(RoomItem.prototype, "RoomItem");
