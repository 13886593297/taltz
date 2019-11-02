/**
* 
*/

class TeamMatchScene extends Scene {

    private userGroup: eui.Group;
    private userViews = {};

    private selfReady;
    private readyButton;

    private countText;
    private showCountText = false;
    private count;
    private timer;

    private userPositions = {};

    private isShowLoading = false;


    constructor(showTimeout) {
        super();
        this.showCountText = showTimeout;

    }

    private showConfirm = false;
    private confirm;

    public initEvent() {

        //需要出发的时间  1.准备 2.交换位置 3.离开房间 
        // SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, () => { }, this);
        //监听加入事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_JOIN_BROADCAST, (data) => {
            // 更新用户
            DataManager.getInstance().updateTeamUser(data.data.joinUser);
            this.updateUserStatus(data.data.joinUser.index);
            //TODO  满员进行准备 30秒

        }, this)
        //准备事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, (data) => {
            //当前用户准备    
            DataManager.getInstance().setRoomSelfData(data.data);
            DataManager.getInstance().updateTeamUserStatus(data.data.index, data.data.ok);
            if (data.data.ok) this.userViews[data.data.index].setReady();
            this.readyButton.visible = false;
        }, this)
        //监听准备 广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_READY_BROADCAST, (data) => {
            DataManager.getInstance().updateTeamUserStatus(data.data.index, data.data.ok);
            if (data.data.ok) this.userViews[data.data.index].setReady();
        }, this)
        //离开房间
        SocketX.getInstance().addEventListener(NetEvent.TEAM_LEAVE_ROOM, () => {
            //TODO  clear room data
            this.clearListeners();
            this.hideLoading();
            DataManager.getInstance().clearRoomData();
            //清除监听
            ViewManager.getInstance().back();
        }, this);

        //离开房间广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_LEAVE_ROOM_BROADCAST, (data) => {
            DataManager.getInstance().updateUserLeave(data.data);
            this.updateUserStatus(data.data.index);
        }, this);


        //教官位置请求
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION, (data) => {
            if (this.showConfirm && this.confirm) {
                this.removeChild(this.confirm);
            }

            let sender = data.data;
            let nickName = sender.sendUserInfo.nickName;
            let roomData = DataManager.getInstance().getRoomData();
            //交换位置
            let confirm = new Confirm(nickName + '发起位置交换', '拒绝', '同意');
            this.addChild(confirm);
            this.showConfirm = true;
            this.confirm = confirm;
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, () => {
                //拒绝
                SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION_REPLY, {
                    tableNo: roomData.tableNo,//桌子号(房间编号)
                    sendUserId: sender.sendUserId,//发送者交换位置用户的ID
                    isDo: false,//true=同意,false=拒绝
                })
                this.showConfirm = false;
            }, this);
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, () => {
                //同意
                SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION_REPLY, {
                    tableNo: roomData.tableNo,//桌子号(房间编号)
                    sendUserId: sender.sendUserId,//发送者交换位置用户的ID
                    isDo: true,//true=同意,false=拒绝
                })
                this.showConfirm = false;
            }, this);
        }, this)

        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION_REPLY, (data) => {
            let accept = data.data.isDo;
            this.hideLoading();
            if (!accept) { //弹出框
                //设置此人不能点击
                let position = this.userPositions[data.data.acceptUserId];
                this.userViews[position].setDisableClick();
                let alert = new AlertPanel("对方拒绝了您的位置请求！", true)
                this.addChild(alert);
            }
        }, this)

        //位置交换广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION_BROADCAST, (data) => {
            for (let key in data.data) {
                let user = data.data[key];
                if (!user) user = {};
                user.index = key;
                DataManager.getInstance().updateTeamUser(user);
                this.updateUserStatus(key);
            }
        }, this)
        //倒计时 
        SocketX.getInstance().addEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST, (data) => {
            if (data.data.type == 1) {
                this.showTimer(data.data.timeout)
            } else {
                this.countText.visible = false;
                this.showCountText = false;
                if (this.timer) this.timer.stop();
            }
        }, this);

        //开始答题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_START, (data) => {
            DataManager.getInstance().updateTeamPkData(data.data);
            this.GoBattle();
        }, this)

        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            DataManager.getInstance().updateTeamKonwResult(data.data);
            this.clearListeners();
            let scene = new TeamKnowResultScene();
            ViewManager.getInstance().changeScene(scene);
        }, this)
    }

    /**
     * 清除监听
     */
    public clearListeners() {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_JOIN_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_READY_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_CHANGE_POSITION_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_LEAVE_ROOM_BROADCAST);
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST);
    }

    private loadingView;
    private loadingTimer;
    private showLoading() {
        this.isShowLoading = true;
        console.log(this.isShowLoading, "显示等待狂")
        let text = "等待对方回应"
        let waittingNumber = 10;

        if (!this.loadingView) {
            let loading = new AlertLoading(waittingNumber + "\n" + text);
            this.loadingView = loading;
            this.addChild(loading);
        }
        this.loadingView.visible = true;

        if (!this.loadingTimer) {
            let timer = new egret.Timer(1000, 12)
            this.loadingTimer=timer;
            timer.addEventListener(egret.TimerEvent.TIMER, () => {
                waittingNumber--;
                if (waittingNumber <= 0) { //剩余10秒 匹配机器人
                    timer.stop();
                    this.hideLoading();
                    return;
                }
                if (this.showLoading && this.loadingView) {
                    this.loadingView.setText(waittingNumber + "\n" + text)
                } else {
                    this.loadingTimer.stop();
                }
            }, this);
        }else{
            this.loadingTimer.reset();
        }
        this.loadingTimer.start();
    }
    private hideLoading() {
        this.isShowLoading = false;
        if( this.loadingTimer)  this.loadingTimer.stop();
        if (this.loadingView) {
            // this.removeChild(this.loadingView);
            this.loadingView.visible = false;;
        }
    }



    private showTimer(timeout) {
        //开始倒计时
        this.showCountText = true;
        this.countText.visible = true;
        this.count = timeout;
        this.countText.text = timeout;
        if (!this.timer) {
            var timer: egret.Timer = new egret.Timer(1000, 60);
            this.timer = timer;
            timer.addEventListener(egret.TimerEvent.TIMER, () => {
                this.count--;
                if (this.count == 0) { //剩余10秒 匹配机器人
                    timer.stop();
                    return;
                }
                this.countText.text = this.count;
            }, this);
            timer.start();
        } else {
            this.timer.reset();
            this.timer.start();
        }
    }

    /**
     * 全部准备好 进行战斗状态
     */
    private GoBattle() {
        let roomData = DataManager.getInstance().getRoomData();
        let battleScene;
        this.clearListeners();
        switch (roomData.roomType) {
            case PkModel.ANSWER:
                battleScene = new TeamBattleScene();
                break;
            case PkModel.KNOW:
                if (roomData.joinType == JoinType.JOIN) {
                    battleScene = new TeamKnowBattleScene();
                } else {
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo })
                }
                break;
        }
        if (battleScene) {
            ViewManager.getInstance().changeScene(battleScene);
        }
    }


    /**
     * 更新用户数据
     */
    private updateUserStatus(postion) {
        let user = DataManager.getInstance().getRoomUser(postion);
        if (user && this.userViews[postion]) {
            this.userViews[postion].updateUser(user.userInfo)
            if (user.userInfo && user.userInfo.userId) this.userPositions[user.userInfo.userId] = postion;
            if (user.status == ReadyType.READYED) {
                this.userViews[postion].setReady();
            }
        }
    }


    public init() {
        // this.nav = "返回"
        this.initEvent();
        let top = 70;
        let left = 30;
        let greenText = new egret.TextField();
        greenText.text = '绿队';
        greenText.size = 40;
        greenText.textColor = Config.COLOR_YELLOW;
        greenText.x = left;
        greenText.y = top;
        this.addChild(greenText);

        let blueText = new egret.TextField();
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
        let countText = new egret.TextField();
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
            this.showTimer(30)
        }

        let roomData = DataManager.getInstance().getRoomData();
        let number = 5;
        if (roomData.roomNumber == RoomNumber.SIX) number = 3;
        
        if(roomData.joinType === JoinType.OBSEVER){
            let modelText = new egret.TextField();
            modelText.size = 25;
            modelText.text =  '旁观模式';
            modelText.x = this.stage.stageWidth / 2;
            modelText.width = 200;
            modelText.anchorOffsetX = 100;
            modelText.textAlign = egret.HorizontalAlign.CENTER;
            modelText.y = 30;
            this.addChild(modelText);
        }


        //抢答题
        if (roomData.roomType === PkModel.ANSWER) {
            let centerTextY = number * 95 + 150
            let centerText = new egret.TextField();
            centerText.textColor = 0x82879b;
            centerText.size = 30;
            centerText.text = '点击头像\n交换位置';
            centerText.x = this.stage.stageWidth / 2;
            centerText.width = 250;
            centerText.anchorOffsetX = 125;
            centerText.textAlign = egret.HorizontalAlign.CENTER;
            centerText.y = centerTextY
            this.addChild(centerText);
        }


        this.initUser();
        let y = this.stage.stageHeight - 200;

        //显示条件 自己在战队中 但是未点击准备
        if (roomData.joinType === JoinType.JOIN) {
            let readyButton = new XButton('准备');
            readyButton.width = 500;
            readyButton.y = y;
            readyButton.anchorOffsetX = 250;
            readyButton.x = this.stage.stageWidth / 2;
            this.addChild(readyButton);
            this.readyButton = readyButton;
            readyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                console.log('点击准备')
                if (this.isShowLoading) return;
                SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_READY, { tableNo: roomData.tableNo })
            }, this);
        } else {//观察者 不可以加入战队
            // setTimeout(() => {
            //     let scene = new TeamKnowResultScene();
            //     ViewManager.getInstance().changeScene(scene);
            // }, 5000);


        }

        let leaveButton = new XButton('离开');
        leaveButton.width = 500;
        leaveButton.anchorOffsetX = 250;
        leaveButton.y = this.stage.stageHeight - 100;
        leaveButton.x = this.stage.stageWidth / 2
        this.addChild(leaveButton);
        leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let roomData = DataManager.getInstance().getRoomData();
            SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType })
        }, this);
    }


    private updateUser() {
        let roomData = DataManager.getInstance().getRoomData();
        let pkUser = roomData.users;
        let number = 5;
        if (roomData.roomNumber == RoomNumber.SIX) number = 3;
        for (let key in pkUser) {
            let user = pkUser[key];
            if (user.position > roomData.roomNumber || user.position < 1) continue;
            let postionY = 190 * (user.position - 1);
            let postionFlag = UserPositionType.LEFT;
            if (user.position > number) { //蓝队用户
                postionY = 190 * (user.position - number - 1);
                postionFlag = UserPositionType.RIGHT;
            }
            let userinfo = user.status == ReadyType.UNJOIN ? null : user.userInfo;
            let teamUser = new TeamUser(userinfo, postionFlag);
            teamUser.y = postionY;
            this.userViews[user.position] = teamUser;
            if (userinfo && userinfo.userId) {
                this.userPositions[userinfo.userId] = user.position;
            }


            this.userGroup.addChild(teamUser);
            if (user.status == ReadyType.READYED) teamUser.setReady();
            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.anchorOffsetX = 243;
                teamUser.x = this.stage.stageWidth;
            }
            teamUser.addUserEventListener(() => {
                console.log('点击用户', user);
                console.log('this.isShowLoading', this.isShowLoading);
                if (this.isShowLoading) return;
                if (roomData.joinType == JoinType.OBSEVER) return;
                let self = DataManager.getInstance().getRoomSelfData();
                if (self && self.status == ReadyType.READYED) return;
                let positionUser = DataManager.getInstance().getRoomUser(user.position);
                console.log('positionUser', positionUser, 'self', self);
                if (positionUser && positionUser.userInfo && self && positionUser.userInfo.userId == self.userId) return;
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
                        this.showLoading();
                        SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION, {
                            tableNo: roomData.tableNo,
                            acceptUserId: positionUser.userInfo ? positionUser.userInfo.userId : 0,
                            acceptIndex: user.position
                        });
                        break;
                    case ReadyType.READYED:
                        break;
                }
            }, this)
        }
    }


    private initUser() {
        let roomData = DataManager.getInstance().getRoomData();
        let userGroup = new eui.Group();
        userGroup.y = 150;
        this.addChild(userGroup);
        this.userGroup = userGroup;
        let number = 5;
        if (roomData.roomNumber == RoomNumber.SIX) number = 3;
        this.updateUser();
        let y = 150;
        if (roomData.roomType === PkModel.KNOW) {
            for (let k = 0; k < number; k++) {
                let pkVs = Util.createBitmapByName('pk_vs_png');
                pkVs.width = 246;
                pkVs.height = 166;
                pkVs.anchorOffsetX = 123;
                pkVs.anchorOffsetY = 83;
                pkVs.x = this.stage.stageWidth / 2;
                pkVs.y = y + 190 * k + 95;
                this.addChild(pkVs)
                let pkText = new egret.TextField();
                pkText.text = "VS";
                pkText.size = 40
                pkText.width = 100;
                pkText.textAlign = egret.HorizontalAlign.CENTER;
                pkText.height = pkText.textHeight;
                pkText.anchorOffsetX = 50;
                pkText.anchorOffsetY = pkText.height / 2
                pkText.x = this.stage.stageWidth / 2;
                pkText.y = y + 190 * k + 95;
                this.addChild(pkText)
            }
        }

        // if (roomData.joinType === JoinType.OBSEVER && roomData.roomType === PkModel.ANSWER) {
        //     setTimeout(() => {
        //         let teamMatch = new TeamBattleScene();
        //         ViewManager.getInstance().changeScene(teamMatch);
        //     }, 5000);
        // }

    }

}

