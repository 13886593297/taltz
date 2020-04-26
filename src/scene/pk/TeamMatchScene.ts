class TeamMatchScene extends Scene {
    private userGroup: eui.Group
    private userViews = {}

    private selfReady
    private readyButton
    private leaveButton
    private countBg
    private countText
    private showCountText = false
    private count
    private timer

    private userPositions = {}

    private isShowLoading = false


    constructor(showTimeout) {
        super()
        this.showCountText = showTimeout
    }

    private showConfirm = false
    private confirm

    public init() {
        super.setBackground()
        this.close_btn = false

        this.initEvent()

        let stageW = this.stage.stageWidth
        let roomData = DataManager.getInstance().getRoomData()
        if (roomData.joinType === JoinType.OBSEVER) {
            let observerTitle = Util.createBitmapByName('pk_observe_modal_png')
            observerTitle.x = (stageW - observerTitle.width) / 2
            observerTitle.y = 45
            this.addChild(observerTitle)
        }

        let init_y = 200
        // 黄队
        let yellowGroup = Util.createBitmapByName('pk_yellow_group_png')
        yellowGroup.x = 50
        yellowGroup.y = init_y
        this.addChild(yellowGroup)

        // 绿队
        let greenGroup = Util.createBitmapByName('pk_green_group_png')
        greenGroup.x = stageW / 2 + 150
        greenGroup.y = init_y
        this.addChild(greenGroup)

        // 倒计时 
        let countBg = Util.createBitmapByName('pk_time_bg_png')
        countBg.x = (stageW - countBg.width) / 2
        countBg.y = init_y
        this.countBg = countBg
        this.countBg.visible = false
        this.addChild(countBg)

        let countText = new egret.TextField()
        countText.x = countBg.x
        countText.y = countBg.y
        countText.width = countBg.width
        countText.height = countBg.height - 10
        countText.textAlign = 'center'
        countText.verticalAlign = 'middle'
        countText.size = 26
        this.addChild(countText)
        this.countText = countText
        this.countText.visible = false
        if (this.showCountText) {
            this.showTimer(30)
        }

        let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5

        this.initUser()

        // 显示条件 自己在战队中 但是未点击准备
        if (roomData.joinType === JoinType.JOIN) {
            // 准备按钮
            let readyButton = Util.createBitmapByName('pk_ready_png')
            readyButton.x = stageW / 2 + 20
            readyButton.y = this.stage.stageHeight - 150
            readyButton.touchEnabled = true
            this.addChild(readyButton)
            this.readyButton = readyButton
            readyButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                if (this.isShowLoading) return
                SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_READY, { tableNo: roomData.tableNo })
            }, this)

            // 交换位置提示
            if (roomData.roomType === PkModel.ANSWER) {
                let centerTextBg = Util.drawRoundRect(3, Config.COLOR_MAINCOLOR, 0xffffff, 100, 80, 30, 0)
                centerTextBg.x = (stageW - centerTextBg.width) / 2
                centerTextBg.y = ((number - 1) * 160 + 128) / 2 + 300 - centerTextBg.height / 2
                this.addChild(centerTextBg)
    
                let centerText = new egret.TextField()
                centerText.text = '点击头像\n交换位置'
                centerText.textColor = 0x7bbf71
                centerText.x = centerTextBg.x
                centerText.y = centerTextBg.y
                centerText.size = 18
                centerText.width = centerTextBg.width
                centerText.height = centerTextBg.height
                centerText.textAlign = 'center'
                centerText.verticalAlign = 'middle'
                this.addChild(centerText)
            } else {
                let tip = Util.createBitmapByName('pk_seat_tip_png')
                tip.x = (stageW - tip.width) / 2
                tip.y = number * 160 + 300
                this.addChild(tip)
            }
        } else {//观察者 不可以加入战队
            // setTimeout(() => {
            //     let scene = new TeamKnowResultScene()
            //     ViewManager.getInstance().changeScene(scene)
            // }, 5000)
        }

        let leaveButton = Util.createBitmapByName('pk_leave_png')
        leaveButton.x = roomData.joinType === JoinType.JOIN ? stageW / 2 - leaveButton.width - 20 : (stageW - leaveButton.width) / 2
        leaveButton.y = this.stage.stageHeight - 150
        leaveButton.touchEnabled = true
        this.leaveButton = leaveButton
        this.addChild(leaveButton)
        leaveButton.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let roomData = DataManager.getInstance().getRoomData()
            SocketX.getInstance().sendMsg(NetEvent.TEAM_LEAVE_ROOM, { tableNo: roomData.tableNo, joinType: roomData.joinType })
        }, this)
    }

    public initEvent() {

        //需要出发的时间  1.准备 2.交换位置 3.离开房间 
        // SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, () => { }, this)
        //监听加入事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_JOIN_BROADCAST, (data) => {
            // 更新用户
            DataManager.getInstance().updateTeamUser(data.data.joinUser)
            this.updateUserStatus(data.data.joinUser.index)
            //TODO  满员进行准备 30秒

        }, this)


        //准备事件
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_READY, (data) => {
            //当前用户准备    
            DataManager.getInstance().setRoomSelfData(data.data)
            DataManager.getInstance().updateTeamUserStatus(data.data.index, data.data.ok)
            if (data.data.ok) this.userViews[data.data.index].setReady()
            this.readyButton.visible = false
            this.leaveButton.x = (this.stage.stageWidth - this.leaveButton.width) / 2
        }, this)

        //监听准备 广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_READY_BROADCAST, (data) => {
            DataManager.getInstance().updateTeamUserStatus(data.data.index, data.data.ok)
            if (data.data.ok) this.userViews[data.data.index].setReady()
        }, this)

        //离开房间
        SocketX.getInstance().addEventListener(NetEvent.TEAM_LEAVE_ROOM, () => {
            //TODO  clear room data
            this.clearListeners()
            this.hideLoading()
            DataManager.getInstance().clearRoomData()
            //清除监听
            ViewManager.getInstance().back()
        }, this)

        //离开房间广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_LEAVE_ROOM_BROADCAST, (data) => {
            DataManager.getInstance().updateUserLeave(data.data)
            this.updateUserStatus(data.data.index)
        }, this)

        //交换位置请求
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION, (data) => {
            if (this.showConfirm && this.confirm) {
                this.removeChild(this.confirm)
            }

            let sender = data.data
            let nickName = sender.sendUserInfo.nickName
            let roomData = DataManager.getInstance().getRoomData()
            //交换位置
            let confirm = new Confirm(nickName + '发起了交换位置', '拒绝', '同意')
            this.addChild(confirm)
            this.showConfirm = true
            this.confirm = confirm
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, () => {
                //拒绝
                SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION_REPLY, {
                    tableNo: roomData.tableNo,//桌子号(房间编号)
                    sendUserId: sender.sendUserId,//发送者交换位置用户的ID
                    isDo: false,//true=同意,false=拒绝
                })
                this.showConfirm = false
            }, this)
            confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, () => {
                //同意
                SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION_REPLY, {
                    tableNo: roomData.tableNo,//桌子号(房间编号)
                    sendUserId: sender.sendUserId,//发送者交换位置用户的ID
                    isDo: true,//true=同意,false=拒绝
                })
                this.showConfirm = false
            }, this)
        }, this)

        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION_REPLY, (data) => {
            let accept = data.data.isDo
            this.hideLoading()
            if (!accept) { //弹出框
                //设置此人不能点击
                let position = this.userPositions[data.data.acceptUserId]
                this.userViews[position].setDisableClick()

                let stage = ViewManager.getInstance().stage
                let group = new eui.Group
                this.addChild(group)
                //背景
                let mask: egret.Bitmap = Util.createBitmapByName('mask_png')
                mask.y = 0
                mask.x = 0
                mask.alpha = 0.5
                mask.width = stage.stageWidth
                mask.height = stage.stageHeight
                group.addChild(mask)

                let alert = Util.createBitmapByName('pk_alert_refuse_png')
                alert.x = (this.stage.stageWidth - alert.width) / 2
                alert.y = (this.stage.stageHeight - alert.height) / 2
                group.addChild(alert)

                let close_btn = Util.createBitmapByName('icon_err_png')
                close_btn.x = alert.x + alert.width - close_btn.width
                close_btn.y = alert.y - 10
                group.addChild(close_btn)
                close_btn.touchEnabled = true
                close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    group.visible = false
                }, this)
            }
        }, this)

        //位置交换广播
        SocketX.getInstance().addEventListener(NetEvent.TEAM_CHANGE_POSITION_BROADCAST, (data) => {
            for (let key in data.data) {
                let user = data.data[key]
                if (!user) user = {}
                user.index = key
                DataManager.getInstance().updateTeamUser(user)
                this.updateUserStatus(key)
            }
        }, this)

        //倒计时 
        SocketX.getInstance().addEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST, (data) => {
            console.log('倒计时-------->', data)
            if (data.data.type == 1) {
                this.showTimer(data.data.timeout)
            } else {
                this.countBg.visible = false
                this.countText.visible = false
                this.showCountText = false
                if (this.timer) this.timer.stop()
            }
        }, this)

        //开始答题
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_START, (data) => {
            DataManager.getInstance().updateTeamPkData(data.data)
            this.GoBattle()
        }, this)

        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            DataManager.getInstance().updateTeamKonwResult(data.data)
            this.clearListeners()
            let scene = new TeamKnowResultScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)
    }

    /**
     * 清除监听
     */
    public clearListeners() {
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_JOIN_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_READY_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_CHANGE_POSITION_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_LEAVE_ROOM_BROADCAST)
        SocketX.getInstance().removeEventListener(NetEvent.TEAM_COUNT_DOWN_BROADCAST)
    }

    private loadingView
    private loadingTimer
    private showLoading() {
        this.isShowLoading = true
        let text = "等待对方回应"
        let waittingNumber = 10

        let loading = new AlertLoading(waittingNumber + "\n" + text)
        this.loadingView = loading
        this.addChild(loading)
        this.loadingView.visible = true

        let timer = new egret.Timer(1000, 10)
        this.loadingTimer = timer
        timer.addEventListener(egret.TimerEvent.TIMER, () => {
            waittingNumber--
            if (waittingNumber <= 0) {
                this.loadingTimer.stop()
                this.hideLoading()
                return
            }

            if (this.showLoading && this.loadingView) {
                this.loadingView.setText(waittingNumber + "\n" + text)
            } else {
                this.loadingTimer.stop()
            }
        }, this)
        this.loadingTimer.start()
    }

    private hideLoading() {
        this.isShowLoading = false
        if (this.loadingTimer) this.loadingTimer.stop()
        if (this.loadingView) {
            // this.removeChild(this.loadingView)
            this.loadingView.visible = false
        }
    }

    private showTimer(timeout) {
        //开始倒计时
        this.showCountText = true
        this.countBg.visible = true
        this.countText.visible = true
        this.count = timeout
        this.countText.text = timeout
        if (!this.timer) {
            var timer: egret.Timer = new egret.Timer(1000, 60)
            this.timer = timer
            timer.addEventListener(egret.TimerEvent.TIMER, () => {
                this.count--
                if (this.count == 0) {
                    timer.stop()
                    return
                }
                this.countText.text = this.count
            }, this)
            timer.start()
        } else {
            this.timer.reset()
            this.timer.start()
        }
    }

    /**
     * 全部准备好 进行战斗状态
     */
    private GoBattle() {
        let roomData = DataManager.getInstance().getRoomData()
        let battleScene
        this.clearListeners()
        switch (roomData.roomType) {
            case PkModel.ANSWER:
                battleScene = new TeamBattleScene()
                break
            case PkModel.KNOW:
                if (roomData.joinType == JoinType.JOIN) {
                    battleScene = new TeamKnowBattleScene()
                } else {
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo })
                }
                break
        }
        if (battleScene) {
            ViewManager.getInstance().changeScene(battleScene)
        }
    }

    /**
     * 更新用户数据
     */
    private updateUserStatus(postion) {
        let user = DataManager.getInstance().getRoomUser(postion)
        if (user && this.userViews[postion]) {
            this.userViews[postion].updateUser(user.userInfo)
            if (user.userInfo && user.userInfo.userId) this.userPositions[user.userInfo.userId] = postion
            if (user.status == ReadyType.READYED) {
                this.userViews[postion].setReady()
            }
        }
    }

    private updateUser() {
        let roomData = DataManager.getInstance().getRoomData()
        let pkUser = roomData.users
        let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5
        for (let key in pkUser) {
            let user = pkUser[key]
            if (user.position > roomData.roomNumber || user.position < 1) {
                continue
            }

            let postionY = 160 * (user.position - 1)
            let postionFlag = UserPositionType.LEFT

            if (user.position > number) { // 绿队用户
                postionY = 160 * (user.position - number - 1)
                postionFlag = UserPositionType.RIGHT
            }

            let userinfo = user.status == ReadyType.UNJOIN ? null : user.userInfo
            let teamUser = new TeamUser(userinfo, postionFlag)
            teamUser.y = postionY
            this.userViews[user.position] = teamUser

            if (userinfo && userinfo.userId) {
                this.userPositions[userinfo.userId] = user.position
            }

            this.userGroup.addChild(teamUser)
            if (user.status == ReadyType.READYED) {
                teamUser.setReady()
            }

            if (postionFlag == UserPositionType.RIGHT) {
                teamUser.x = this.stage.stageWidth - teamUser.width
            }

            teamUser.addUserEventListener(() => {
                console.log('点击用户', user)
                console.log('this.isShowLoading', this.isShowLoading)
                if (this.isShowLoading) return
                if (roomData.joinType == JoinType.OBSEVER) return
                let self = DataManager.getInstance().getRoomSelfData()
                if (self && self.status == ReadyType.READYED) return
                let positionUser = DataManager.getInstance().getRoomUser(user.position)

                if (positionUser && positionUser.userInfo && self && positionUser.userInfo.userId == self.userId) return

                switch (positionUser.status) {
                    case ReadyType.UNJOIN:
                        console.log('处理未加入事件')
                        Util.playMusic('model_select_mp3')
                        SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION, {
                            tableNo: roomData.tableNo,
                            acceptUserId: positionUser.userInfo ? positionUser.userInfo.userId : 0,
                            acceptIndex: user.position
                        })
                        break
                    case ReadyType.UNREADY:
                        console.log('处理未准备 交换')
                        Util.playMusic('model_select_mp3')
                        this.showLoading()
                        SocketX.getInstance().sendMsg(NetEvent.TEAM_CHANGE_POSITION, {
                            tableNo: roomData.tableNo,
                            acceptUserId: positionUser.userInfo ? positionUser.userInfo.userId : 0,
                            acceptIndex: user.position
                        })
                        break
                    case ReadyType.READYED:
                        break
                }
            }, this)
        }
    }

    private initUser() {
        let roomData = DataManager.getInstance().getRoomData()
        let userGroup = new eui.Group()
        userGroup.y = 300
        this.addChild(userGroup)
        this.userGroup = userGroup
        let number = roomData.roomNumber == RoomNumber.SIX ? 3 : 5
        this.updateUser()
        let y = 300
        if (roomData.roomType === PkModel.KNOW) {
            for (let k = 0; k < number; k++) {
                let pkVs = Util.createBitmapByName('pk_vs_png')
                pkVs.x = (this.stage.stageWidth - pkVs.width) / 2
                pkVs.y = y + 160 * k + pkVs.height / 2
                this.addChild(pkVs)
            }
        }
        // test begin
        // setTimeout(() => {
        //     let teamMatch = new TeamKnowBattleScene()
        //     ViewManager.getInstance().changeScene(teamMatch)
        // }, 2000)
        // test end
    }
}

