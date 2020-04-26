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
var TeamMatchScene = (function (_super) {
    __extends(TeamMatchScene, _super);
    function TeamMatchScene(showTimeout) {
        var _this = _super.call(this) || this;
        _this.userViews = {};
        _this.showCountText = false;
        _this.userPositions = {};
        _this.isShowLoading = false;
        _this.showConfirm = false;
        _this.showCountText = showTimeout;
        return _this;
    }
    TeamMatchScene.prototype.init = function () {
        var _this = this;
        _super.prototype.setBackground.call(this);
        this.close_btn = false;
        this.initEvent();
        var stageW = this.stage.stageWidth;
        var roomData = DataManager.getInstance().getRoomData();
        if (roomData.joinType === JoinType.OBSEVER) {
            var observerTitle = Util.createBitmapByName('pk_observe_modal_png');
            observerTitle.x = (stageW - observerTitle.width) / 2;
            observerTitle.y = 45;
            this.addChild(observerTitle);
        }
        var init_y = 200;
        // 黄队
        var yellowGroup = Util.createBitmapByName('pk_yellow_group_png');
        yellowGroup.x = 50;
        yellowGroup.y = init_y;
        this.addChild(yellowGroup);
        // 绿队
        var greenGroup = Util.createBitmapByName('pk_green_group_png');
        greenGroup.x = stageW / 2 + 150;
        greenGroup.y = init_y;
        this.addChild(greenGroup);
        // 倒计时 
        var countBg = Util.createBitmapByName('pk_time_bg_png');
        countBg.x = (stageW - countBg.width) / 2;
        countBg.y = init_y;
        this.countBg = countBg;
        this.countBg.visible = false;
        this.addChild(countBg);
        var countText = new egret.TextField();
        countText.x = countBg.x;
        countText.y = countBg.y;
        countText.width = countBg.width;
        countText.height = countBg.height - 10;
        countText.textAlign = 'center';
        countText.verticalAlign = 'middle';
        countText.size = 26;
        this.addChild(countText);
        this.countText = countText;
        this.countText.visible = false;
        if (this.showCountText) {
            this.showTimer(30);
        }
        var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
        this.initUser();
        // 显示条件 自己在战队中 但是未点击准备
        if (roomData.joinType === JoinType.JOIN) {
            // 准备按钮
            var readyButton = Util.createBitmapByName('pk_ready_png');
            readyButton.x = stageW / 2 + 20;
            readyButton.y = this.stage.stageHeight - 150;
            readyButton.touchEnabled = true;
            this.addChild(readyButton);
            this.readyButton = readyButton;
            readyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                if (_this.isShowLoading)
                    return;
                SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_READY, { tableNo: roomData.tableNo });
            }, this);
            // 交换位置提示
            if (roomData.roomType === PkModel.ANSWER) {
                var centerTextBg = Util.drawRoundRect(3, Config.COLOR_MAINCOLOR, 0xffffff, 100, 80, 30, 0);
                centerTextBg.x = (stageW - centerTextBg.width) / 2;
                centerTextBg.y = ((number - 1) * 160 + 128) / 2 + 300 - centerTextBg.height / 2;
                this.addChild(centerTextBg);
                var centerText = new egret.TextField();
                centerText.text = '点击头像\n交换位置';
                centerText.textColor = 0x7bbf71;
                centerText.x = centerTextBg.x;
                centerText.y = centerTextBg.y;
                centerText.size = 18;
                centerText.width = centerTextBg.width;
                centerText.height = centerTextBg.height;
                centerText.textAlign = 'center';
                centerText.verticalAlign = 'middle';
                this.addChild(centerText);
            }
            else {
                var tip = Util.createBitmapByName('pk_seat_tip_png');
                tip.x = (stageW - tip.width) / 2;
                tip.y = number * 160 + 300;
                this.addChild(tip);
            }
        }
        else {
            // setTimeout(() => {
            //     let scene = new TeamKnowResultScene()
            //     ViewManager.getInstance().changeScene(scene)
            // }, 5000)
        }
        var leaveButton = Util.createBitmapByName('pk_leave_png');
        leaveButton.x = roomData.joinType === JoinType.JOIN ? stageW / 2 - leaveButton.width - 20 : (stageW - leaveButton.width) / 2;
        leaveButton.y = this.stage.stageHeight - 150;
        leaveButton.touchEnabled = true;
        this.leaveButton = leaveButton;
        this.addChild(leaveButton);
        leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var roomData = DataManager.getInstance().getRoomData();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType });
        }, this);
    };
    TeamMatchScene.prototype.initEvent = function () {
        var _this = this;
        //需要出发的时间  1.准备 2.交换位置 3.离开房间 
        // SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, () => { }, this)
        //监听加入事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_JOIN_BROADCAST, function (data) {
            // 更新用户
            DataManager.getInstance().updateTeamUser(data.data.joinUser);
            _this.updateUserStatus(data.data.joinUser.index);
            //TODO  满员进行准备 30秒
        }, this);
        //准备事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, function (data) {
            //当前用户准备    
            DataManager.getInstance().setRoomSelfData(data.data);
            DataManager.getInstance().updateTeamUserStatus(data.data.index, data.data.ok);
            if (data.data.ok)
                _this.userViews[data.data.index].setReady();
            _this.readyButton.visible = false;
            _this.leaveButton.x = (_this.stage.stageWidth - _this.leaveButton.width) / 2;
        }, this);
        //监听准备 广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_READY_BROADCAST, function (data) {
            DataManager.getInstance().updateTeamUserStatus(data.data.index, data.data.ok);
            if (data.data.ok)
                _this.userViews[data.data.index].setReady();
        }, this);
        //离开房间
        SocketX.getInstance().addEventListener(NetEvent.TEAM_LEAVE_ROOM, function () {
            //TODO  clear room data
            _this.clearListeners();
            _this.hideLoading();
            DataManager.getInstance().clearRoomData();
            //清除监听
            ViewManager.getInstance().back();
        }, this);
        //离开房间广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_LEAVE_ROOM_BROADCAST, function (data) {
            DataManager.getInstance().updateUserLeave(data.data);
            _this.updateUserStatus(data.data.index);
        }, this);
        //交换位置请求
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION, function (data) {
            if (_this.showConfirm && _this.confirm) {
                _this.removeChild(_this.confirm);
            }
            var sender = data.data;
            var nickName = sender.sendUserInfo.nickName;
            var roomData = DataManager.getInstance().getRoomData();
            //交换位置
            var confirm = new Confirm(nickName + '发起了交换位置', '拒绝', '同意');
            _this.addChild(confirm);
            _this.showConfirm = true;
            _this.confirm = confirm;
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, function () {
                //拒绝
                SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION_REPLY, {
                    tableNo: roomData.tableNo,
                    sendUserId: sender.sendUserId,
                    isDo: false,
                });
                _this.showConfirm = false;
            }, _this);
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, function () {
                //同意
                SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION_REPLY, {
                    tableNo: roomData.tableNo,
                    sendUserId: sender.sendUserId,
                    isDo: true,
                });
                _this.showConfirm = false;
            }, _this);
        }, this);
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION_REPLY, function (data) {
            var accept = data.data.isDo;
            _this.hideLoading();
            if (!accept) {
                //设置此人不能点击
                var position = _this.userPositions[data.data.acceptUserId];
                _this.userViews[position].setDisableClick();
                var stage = ViewManager.getInstance().stage;
                var group_1 = new eui.Group;
                _this.addChild(group_1);
                //背景
                var mask = Util.createBitmapByName('mask_png');
                mask.y = 0;
                mask.x = 0;
                mask.alpha = 0.5;
                mask.width = stage.stageWidth;
                mask.height = stage.stageHeight;
                group_1.addChild(mask);
                var alert_1 = Util.createBitmapByName('pk_alert_refuse_png');
                alert_1.x = (_this.stage.stageWidth - alert_1.width) / 2;
                alert_1.y = (_this.stage.stageHeight - alert_1.height) / 2;
                group_1.addChild(alert_1);
                var close_btn = Util.createBitmapByName('icon_err_png');
                close_btn.x = alert_1.x + alert_1.width - close_btn.width;
                close_btn.y = alert_1.y - 10;
                group_1.addChild(close_btn);
                close_btn.touchEnabled = true;
                close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                    group_1.visible = false;
                }, _this);
            }
        }, this);
        //位置交换广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION_BROADCAST, function (data) {
            for (var key in data.data) {
                var user = data.data[key];
                if (!user)
                    user = {};
                user.index = key;
                DataManager.getInstance().updateTeamUser(user);
                _this.updateUserStatus(key);
            }
        }, this);
        //倒计时 
        SocketX.getInstance().addEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST, function (data) {
            console.log('倒计时-------->', data);
            if (data.data.type == 1) {
                _this.showTimer(data.data.timeout);
            }
            else {
                _this.countBg.visible = false;
                _this.countText.visible = false;
                _this.showCountText = false;
                if (_this.timer)
                    _this.timer.stop();
            }
        }, this);
        //开始答题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_START, function (data) {
            DataManager.getInstance().updateTeamPkData(data.data);
            _this.GoBattle();
        }, this);
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, function (data) {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            _this.clearListeners();
            var scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
    };
    /**
     * 清除监听
     */
    TeamMatchScene.prototype.clearListeners = function () {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_JOIN_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_READY_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_CHANGE_POSITION_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_LEAVE_ROOM_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST);
    };
    TeamMatchScene.prototype.showLoading = function () {
        var _this = this;
        this.isShowLoading = true;
        var text = "等待对方回应";
        var waittingNumber = 10;
        var loading = new AlertLoading(waittingNumber + "\n" + text);
        this.loadingView = loading;
        this.addChild(loading);
        this.loadingView.visible = true;
        var timer = new egret.Timer(1000, 10);
        this.loadingTimer = timer;
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            waittingNumber--;
            if (waittingNumber <= 0) {
                _this.loadingTimer.stop();
                _this.hideLoading();
                return;
            }
            if (_this.showLoading && _this.loadingView) {
                _this.loadingView.setText(waittingNumber + "\n" + text);
            }
            else {
                _this.loadingTimer.stop();
            }
        }, this);
        this.loadingTimer.start();
    };
    TeamMatchScene.prototype.hideLoading = function () {
        this.isShowLoading = false;
        if (this.loadingTimer)
            this.loadingTimer.stop();
        if (this.loadingView) {
            // this.removeChild(this.loadingView)
            this.loadingView.visible = false;
        }
    };
    TeamMatchScene.prototype.showTimer = function (timeout) {
        var _this = this;
        //开始倒计时
        this.showCountText = true;
        this.countBg.visible = true;
        this.countText.visible = true;
        this.count = timeout;
        this.countText.text = timeout;
        if (!this.timer) {
            var timer = new egret.Timer(1000, 60);
            this.timer = timer;
            timer.addEventListener(egret.TimerEvent.TIMER, function () {
                _this.count--;
                if (_this.count == 0) {
                    timer.stop();
                    return;
                }
                _this.countText.text = _this.count;
            }, this);
            timer.start();
        }
        else {
            this.timer.reset();
            this.timer.start();
        }
    };
    /**
     * 全部准备好 进行战斗状态
     */
    TeamMatchScene.prototype.GoBattle = function () {
        var roomData = DataManager.getInstance().getRoomData();
        var battleScene;
        this.clearListeners();
        switch (roomData.roomType) {
            case PkModel.ANSWER:
                battleScene = new TeamBattleScene();
                break;
            case PkModel.KNOW:
                if (roomData.joinType == JoinType.JOIN) {
                    battleScene = new TeamKnowBattleScene();
                }
                else {
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo });
                }
                break;
        }
        if (battleScene) {
            ViewManager.getInstance().changeScene(battleScene);
        }
    };
    /**
     * 更新用户数据
     */
    TeamMatchScene.prototype.updateUserStatus = function (postion) {
        var user = DataManager.getInstance().getRoomUser(postion);
        if (user && this.userViews[postion]) {
            this.userViews[postion].updateUser(user.userInfo);
            if (user.userInfo && user.userInfo.userId)
                this.userPositions[user.userInfo.userId] = postion;
            if (user.status == ReadyType.READYED) {
                this.userViews[postion].setReady();
            }
        }
    };
    TeamMatchScene.prototype.updateUser = function () {
        var _this = this;
        var roomData = DataManager.getInstance().getRoomData();
        var pkUser = roomData.users;
        var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
        var _loop_1 = function (key) {
            var user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1) {
                return "continue";
            }
            var postionY = 160 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 160 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            var userinfo = user.status == ReadyType.UNJOIN ? null : user.userInfo;
            var teamUser = new TeamUser(userinfo, postionFlag);
            teamUser.y = postionY;
            this_1.userViews[user.position] = teamUser;
            if (userinfo && userinfo.userId) {
                this_1.userPositions[userinfo.userId] = user.position;
            }
            this_1.userGroup.addChild(teamUser);
            if (user.status == ReadyType.READYED) {
                teamUser.setReady();
            }
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.x = this_1.stage.stageWidth - teamUser.width;
            }
            teamUser.addUserEventListener(function () {
                console.log('点击用户', user);
                console.log('this.isShowLoading', _this.isShowLoading);
                if (_this.isShowLoading)
                    return;
                if (roomData.joinType == JoinType.OBSEVER)
                    return;
                var self = DataManager.getInstance().getRoomSelfData();
                if (self && self.status == ReadyType.READYED)
                    return;
                var positionUser = DataManager.getInstance().getRoomUser(user.position);
                if (positionUser && positionUser.userInfo && self && positionUser.userInfo.userId == self.userId)
                    return;
                switch (positionUser.status) {
                    case ReadyType.UNJOIN:
                        console.log('处理未加入事件');
                        Util.playMusic('model_select_mp3');
                        SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION, {
                            tableNo: roomData.tableNo,
                            acceptUserId: positionUser.userInfo ? positionUser.userInfo.userId : 0,
                            acceptIndex: user.position
                        });
                        break;
                    case ReadyType.UNREADY:
                        console.log('处理未准备 交换');
                        Util.playMusic('model_select_mp3');
                        _this.showLoading();
                        SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION, {
                            tableNo: roomData.tableNo,
                            acceptUserId: positionUser.userInfo ? positionUser.userInfo.userId : 0,
                            acceptIndex: user.position
                        });
                        break;
                    case ReadyType.READYED:
                        break;
                }
            }, this_1);
        };
        var this_1 = this;
        for (var key in pkUser) {
            _loop_1(key);
        }
    };
    TeamMatchScene.prototype.initUser = function () {
        var roomData = DataManager.getInstance().getRoomData();
        var userGroup = new eui.Group();
        userGroup.y = 300;
        this.addChild(userGroup);
        this.userGroup = userGroup;
        var number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5;
        this.updateUser();
        var y = 300;
        if (roomData.roomType === PkModel.KNOW) {
            for (var k = 0; k < number; k++) {
                var pkVs = Util.createBitmapByName('pk_vs_png');
                pkVs.x = (this.stage.stageWidth - pkVs.width) / 2;
                pkVs.y = y + 160 * k + pkVs.height / 2;
                this.addChild(pkVs);
            }
        }
        // test begin
        // setTimeout(() => {
        //     let teamMatch = new TeamKnowBattleScene()
        //     ViewManager.getInstance().changeScene(teamMatch)
        // }, 2000)
        // test end
    };
    return TeamMatchScene;
}(Scene));
__reflect(TeamMatchScene.prototype, "TeamMatchScene");
