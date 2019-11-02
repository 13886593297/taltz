/**
*
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
    TeamMatchScene.prototype.initEvent = function () {
        var _this = this;
        //需要出发的时间  1.准备 2.交换位置 3.离开房间 
        // SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, () => { }, this);
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
        //教官位置请求
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION, function (data) {
            if (_this.showConfirm && _this.confirm) {
                _this.removeChild(_this.confirm);
            }
            var sender = data.data;
            var nickName = sender.sendUserInfo.nickName;
            var roomData = DataManager.getInstance().getRoomData();
            //交换位置
            var confirm = new Confirm(nickName + '发起位置交换', '拒绝', '同意');
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
                var alert_1 = new AlertPanel("对方拒绝了您的位置请求！", true);
                _this.addChild(alert_1);
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
            if (data.data.type == 1) {
                _this.showTimer(data.data.timeout);
            }
            else {
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
        console.log(this.isShowLoading, "显示等待狂");
        var text = "等待对方回应";
        var waittingNumber = 10;
        if (!this.loadingView) {
            var loading = new AlertLoading(waittingNumber + "\n" + text);
            this.loadingView = loading;
            this.addChild(loading);
        }
        this.loadingView.visible = true;
        if (!this.loadingTimer) {
            var timer_1 = new egret.Timer(1000, 12);
            this.loadingTimer = timer_1;
            timer_1.addEventListener(egret.TimerEvent.TIMER, function () {
                waittingNumber--;
                if (waittingNumber <= 0) {
                    timer_1.stop();
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
        }
        else {
            this.loadingTimer.reset();
        }
        this.loadingTimer.start();
    };
    TeamMatchScene.prototype.hideLoading = function () {
        this.isShowLoading = false;
        if (this.loadingTimer)
            this.loadingTimer.stop();
        if (this.loadingView) {
            // this.removeChild(this.loadingView);
            this.loadingView.visible = false;
            ;
        }
    };
    TeamMatchScene.prototype.showTimer = function (timeout) {
        var _this = this;
        //开始倒计时
        this.showCountText = true;
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
    TeamMatchScene.prototype.init = function () {
        var _this = this;
        // this.nav = "返回"
        this.initEvent();
        var top = 70;
        var left = 30;
        var greenText = new egret.TextField();
        greenText.text = '绿队';
        greenText.size = 40;
        greenText.textColor = Config.COLOR_YELLOW;
        greenText.x = left;
        greenText.y = top;
        this.addChild(greenText);
        var blueText = new egret.TextField();
        blueText.textColor = Config.COLOR_BLUE;
        blueText.size = 40;
        blueText.text = '蓝队';
        blueText.x = this.stage.stageWidth - left;
        blueText.width = 100;
        blueText.anchorOffsetX = 100;
        blueText.textAlign = egret.HorizontalAlign.RIGHT;
        blueText.y = top;
        this.addChild(blueText);
        //倒计时 
        var countText = new egret.TextField();
        countText.size = 40;
        countText.x = this.stage.stageWidth / 2;
        countText.width = 100;
        countText.anchorOffsetX = 50;
        countText.textAlign = egret.HorizontalAlign.CENTER;
        countText.y = top;
        this.addChild(countText);
        this.countText = countText;
        this.countText.visible = false;
        if (this.showCountText) {
            this.showTimer(30);
        }
        var roomData = DataManager.getInstance().getRoomData();
        var number = 5;
        if (roomData.roomNumber == RoomNumber.SIX)
            number = 3;
        if (roomData.joinType === JoinType.OBSEVER) {
            var modelText = new egret.TextField();
            modelText.size = 25;
            modelText.text = '旁观模式';
            modelText.x = this.stage.stageWidth / 2;
            modelText.width = 200;
            modelText.anchorOffsetX = 100;
            modelText.textAlign = egret.HorizontalAlign.CENTER;
            modelText.y = 30;
            this.addChild(modelText);
        }
        //抢答题
        if (roomData.roomType === PkModel.ANSWER) {
            var centerTextY = number * 95 + 150;
            var centerText = new egret.TextField();
            centerText.textColor = 0x82879b;
            centerText.size = 30;
            centerText.text = '点击头像\n交换位置';
            centerText.x = this.stage.stageWidth / 2;
            centerText.width = 250;
            centerText.anchorOffsetX = 125;
            centerText.textAlign = egret.HorizontalAlign.CENTER;
            centerText.y = centerTextY;
            this.addChild(centerText);
        }
        this.initUser();
        var y = this.stage.stageHeight - 200;
        //显示条件 自己在战队中 但是未点击准备
        if (roomData.joinType === JoinType.JOIN) {
            var readyButton = new XButton('准备');
            readyButton.width = 500;
            readyButton.y = y;
            readyButton.anchorOffsetX = 250;
            readyButton.x = this.stage.stageWidth / 2;
            this.addChild(readyButton);
            this.readyButton = readyButton;
            readyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                console.log('点击准备');
                if (_this.isShowLoading)
                    return;
                SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_READY, { tableNo: roomData.tableNo });
            }, this);
        }
        else {
            // setTimeout(() => {
            //     let scene = new TeamKnowResultScene();
            //     ViewManager.getInstance().changeScene(scene);
            // }, 5000);
        }
        var leaveButton = new XButton('离开');
        leaveButton.width = 500;
        leaveButton.anchorOffsetX = 250;
        leaveButton.y = this.stage.stageHeight - 100;
        leaveButton.x = this.stage.stageWidth / 2;
        this.addChild(leaveButton);
        leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            var roomData = DataManager.getInstance().getRoomData();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType });
        }, this);
    };
    TeamMatchScene.prototype.updateUser = function () {
        var _this = this;
        var roomData = DataManager.getInstance().getRoomData();
        var pkUser = roomData.users;
        var number = 5;
        if (roomData.roomNumber == RoomNumber.SIX)
            number = 3;
        var _loop_1 = function (key) {
            var user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1)
                return "continue";
            var postionY = 190 * (user.position - 1);
            var postionFlag = UserPositionType.LEFT;
            if (user.position > number) {
                postionY = 190 * (user.position - number - 1);
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
            if (user.status == ReadyType.READYED)
                teamUser.setReady();
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 243;
                teamUser.x = this_1.stage.stageWidth;
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
                console.log('positionUser', positionUser, 'self', self);
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
        userGroup.y = 150;
        this.addChild(userGroup);
        this.userGroup = userGroup;
        var number = 5;
        if (roomData.roomNumber == RoomNumber.SIX)
            number = 3;
        this.updateUser();
        var y = 150;
        if (roomData.roomType === PkModel.KNOW) {
            for (var k = 0; k < number; k++) {
                var pkVs = Util.createBitmapByName('pk_vs_png');
                pkVs.width = 246;
                pkVs.height = 166;
                pkVs.anchorOffsetX = 123;
                pkVs.anchorOffsetY = 83;
                pkVs.x = this.stage.stageWidth / 2;
                pkVs.y = y + 190 * k + 95;
                this.addChild(pkVs);
                var pkText = new egret.TextField();
                pkText.text = "VS";
                pkText.size = 40;
                pkText.width = 100;
                pkText.textAlign = egret.HorizontalAlign.CENTER;
                pkText.height = pkText.textHeight;
                pkText.anchorOffsetX = 50;
                pkText.anchorOffsetY = pkText.height / 2;
                pkText.x = this.stage.stageWidth / 2;
                pkText.y = y + 190 * k + 95;
                this.addChild(pkText);
            }
        }
        // if (roomData.joinType === JoinType.OBSEVER && roomData.roomType === PkModel.ANSWER) {
        //     setTimeout(() => {
        //         let teamMatch = new TeamBattleScene();
        //         ViewManager.getInstance().changeScene(teamMatch);
        //     }, 5000);
        // }
    };
    return TeamMatchScene;
}(Scene));
__reflect(TeamMatchScene.prototype, "TeamMatchScene");
