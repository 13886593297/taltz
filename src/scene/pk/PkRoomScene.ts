class PkRoomScene extends Scene {
    public model
    public roomNumber
    private tableNo
    private joinType
    private roomView
    private scrollView
    private roomListViews
    private tableType

    private readonly titles = {
        '6': ['room_six_png', 'room_ten_gray_png'],
        '10': ['room_six_gray_png', 'room_ten_png'],
    }

    private roomList = {
        6: [],
        10: []
    }

    constructor(model) {
        super()
        this.name = "room"
        this.model = model
        this.roomNumber = RoomNumber.SIX
    }

    public init() {
        super.setBackground()
        this.initEvent()

        let y = 100
        let roomSix = new Title(this.titles[this.roomNumber][0])
        roomSix.x = this.stage.stageWidth / 2 - roomSix.width - 20
        roomSix.y = y
        this.addChild(roomSix)
        roomSix.touchEnabled = true
        roomSix.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.roomNumber == RoomNumber.TEN) {
                this.roomNumber = RoomNumber.SIX
                this.initTitle(roomSix, roomTen)
            }
        }, this)

        let roomTen = new Title(this.titles[this.roomNumber][1])
        roomTen.x = this.stage.stageWidth / 2 + 10
        roomTen.y = y
        this.addChild(roomTen)
        roomTen.touchEnabled = true
        roomTen.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (this.roomNumber == RoomNumber.SIX) {
                this.roomNumber = RoomNumber.TEN
                this.initTitle(roomSix, roomTen)
            }
        }, this)

        let roomView = new eui.Group()
        roomView.width = this.stage.stageWidth
        // roomView.y = 200
        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth
        myScroller.height = this.stage.stageHeight - 400
        myScroller.y = 250
        //设置viewport
        myScroller.viewport = roomView
        this.addChild(myScroller)
        this.scrollView = myScroller
        this.roomView = roomView
        // let data= {"code":0,"data":[{"tableNo":"11001","joinNum":1,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11002","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11003","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11004","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11005","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11006","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11007","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11008","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11009","joinNum":0,"watchNum":0,"maxJoin":10,"status":0},{"tableNo":"11010","joinNum":0,"watchNum":0,"maxJoin":10,"status":0}]}
        // this.roomList[this.roomNumber] = data.data 
        // this.updateRoomList()
    }


    private initTitle(roomSix, roomTen) {
        roomSix.updateTitle(this.titles[this.roomNumber][0])
        roomTen.updateTitle(this.titles[this.roomNumber][1])
        if (this.roomList[this.roomNumber].length > 0) {
            this.updateRoomList()
        } else {
            SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: this.getTableType() })
        }
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
                var val1 = obj1[pro]
                var val2 = obj2[pro]
                if (val1 < val2) { //正序
                    return -1
                } else if (val1 > val2) {
                    return 1
                } else {
                    return 0
                }
            }
        }

        SocketX.getInstance().addEventListener(NetEvent.TEAM_ROOM_LIST, (data) => {
            let list = data.data
            list.sort(compare('tableNo'))
            this.roomList[this.roomNumber] = list
            this.updateRoomList()
        }, this)

        SocketX.getInstance().sendMsg(NetEvent.TEAM_ROOM_LIST, { tableType: this.getTableType() })
        //更新
        SocketX.getInstance().addEventListener(NetEvent.TEAM_ROOMLIST_USER_UPDATE, (data) => {
            let res = data.data
            if (!res) return
            if (this.roomListViews && this.roomListViews[data.data.tableNo]) {
                this.roomListViews[data.data.tableNo].update(data.data)
            }

            if (this.roomList[6].length > 0) {
                for (let key in this.roomList[6]) {
                    let room = this.roomList[6][key]
                    if (room.tableNo == data.data.tableNo) {
                        this.roomList[6][key] = data.data
                        return
                    }
                }
            }
            if (this.roomList[10].length > 0) {
                for (let key1 in this.roomList[10]) {
                    let room = this.roomList[10][key1]
                    if (room.tableNo == data.data.tableNo) {
                        this.roomList[10][key1] = data.data
                        return
                    }
                }
            }

        }, this, 'room')



        SocketX.getInstance().addEventListener(NetEvent.TEAM_JOIN_IN, (data) => {
            //加入房间 跳转页面
            //  DataManager.getInstance().setRoomData(item.roomId, this.model, item.roomNumber, JoinType.JOIN)
            //                 DataManager.getInstance().setRoomUser({})
            if (data.data.errCode && data.data.errCode > 0) {
                let confirm = new Confirm(data.data.errMsg, '重新选择', '进入旁观')
                this.addChild(confirm)
                confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, () => {
                    this.joinType = JoinType.OBSEVER
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: this.tableNo, joinType: JoinType.OBSEVER })
                }, this)
            } else {
                let roomData = data.data
                DataManager.getInstance().setRoomData(roomData.tableNo, this.model, roomData.maxJoin, this.joinType, roomData.users)
                if (roomData.status == 0) {
                    let teamMatch = new TeamMatchScene(roomData.showTimeout)
                    ViewManager.getInstance().changeScene(teamMatch)
                } else { //进入答题页
                    DataManager.getInstance().updateTeamPkData(data.data)
                    this.GoBattle()
                }


            }
        }, this)
        //进入结果页面
        SocketX.getInstance().addEventListener(NetEvent.TEAM_PK_KNOW_RESULT, (data) => {
            if (this.canJump) {
                DataManager.getInstance().updateTeamKonwResult(data.data)
                let scene = new TeamKnowResultScene()
                ViewManager.getInstance().changeScene(scene)
            }
        }, this)

    }

    private canJump = false
    /**
     * 全部准备好 进行战斗状态
     */
    private GoBattle() {
        let roomData = DataManager.getInstance().getRoomData()
        let battleScene
        switch (roomData.roomType) {
            case PkModel.ANSWER:
                battleScene = new TeamBattleScene(true)
                break
            case PkModel.KNOW:
                if (roomData.joinType == JoinType.JOIN) {
                    battleScene = new TeamKnowBattleScene()
                } else {
                    this.canJump = true
                    SocketX.getInstance().sendMsg(NetEvent.TEAM_PK_KNOW_RESULT, { tableNo: roomData.tableNo })
                }
                break
        }
        if (battleScene) {
            ViewManager.getInstance().changeScene(battleScene)
        }
    }
    
    public updateScene() {
        this.updateRoomList()
    }

    private updateRoomList() {
        let roomList = this.roomList[this.roomNumber]
        if (roomList && roomList.length > 0) {
            this.scrollView.viewport.scrollV = 0
            this.roomView.removeChildren()
            this.roomListViews = {}
            let y = 0
            for (let item of roomList) {
                item.model = this.model
                item.roomNumber = this.roomNumber
                let roomItem = new RoomItem(item)
                roomItem.x = (this.stage.stageWidth - roomItem.width) / 2
                roomItem.y = y
                this.roomView.addChild(roomItem)
                roomItem.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                    //根据item 状态进行判断
                  //  console.log(item)
                    // let teamMatch = new TeamMatchScene()
                    // //  let teamMatch = new TeamBattleScene()
                    // ViewManager.getInstance().changeScene(teamMatch)
                    this.tableNo = item.tableNo
                    if (item.status == RoomStatus.PK) {
                        let confirm = new Confirm(`房间${item.tableNo}比赛进行中\n是否进入观战模式？`)
                        this.addChild(confirm)
                        confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, () => {
                            this.joinType = JoinType.OBSEVER
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER })
                        }, this)
                    } else {
                        let confirm = new Confirm('请选择您进入房间的\n角色身份', '参赛者', '旁观者')
                        this.addChild(confirm)
                        confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_YES, () => {
                            //TODO  发送进入房间时间
                            this.joinType = JoinType.JOIN
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.JOIN })
                        }, this)
                        confirm.addEventListener(ConfirmEvent.CONFIRM_BUTTON_NO, () => {
                            //我是旁观者
                            this.joinType = JoinType.OBSEVER
                            SocketX.getInstance().sendMsg(NetEvent.TEAM_JOIN_IN, { tableNo: item.tableNo, joinType: JoinType.OBSEVER })
                        }, this)
                    }
                }, this)
                y += 180
                this.roomListViews[item.tableNo] = roomItem
            }
        }
    }

}


class RoomItem extends eui.Group {
    private data
    private numberText
    private statusText
    private icon

    constructor(data) {
        super()
        this.data = data
        this.init()
    }

    public init() {
        let bg = Util.createBitmapByName('pk_team_list_bg_png')
        this.width = bg.width
        this.height = bg.height
        this.addChild(bg)

        let roomText = new egret.TextField
        roomText.text = '房间号'
        roomText.x = 60
        roomText.y = 18
        this.addChild(roomText)

        let roomNumber = new egret.TextField
        roomNumber.text = this.data.tableNo
        roomNumber.width = 100
        roomNumber.x = 150
        roomNumber.y = 18
        roomNumber.textAlign = 'right'
        this.addChild(roomNumber)

        let numberText = new egret.TextField
        numberText.x = 60
        numberText.y = 85
        numberText.size = 24
        let watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum
        let joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum

        numberText.textFlow = <Array<egret.ITextElement>>[
            { text: `观战${watchNum}人          `},
            { text: `${joinNum}/${this.data.maxJoin}`}
        ]
        this.numberText = numberText
        this.addChild(numberText)

        let statusText = new egret.TextField
        statusText.text = this.data.status == RoomStatus.PK ? "团队pk中" : "战场等待中"
        statusText.x = 290
        statusText.width = 270
        statusText.height = 150
        statusText.textAlign = egret.HorizontalAlign.RIGHT
        statusText.verticalAlign = egret.VerticalAlign.MIDDLE
        this.addChild(statusText)
        this.statusText = statusText

        let icon = new egret.Bitmap()
        icon.texture = RES.getRes(this.data.status == RoomStatus.PK ? 'pk_icon_fighting_png' : 'pk_icon_wait_png')
        icon.x = this.data.status == RoomStatus.PK ? 570 : 580
        icon.y = 57
        this.addChild(icon)
        this.icon = icon
    }

    public update(data) {
        this.data = data
        let watchNum = this.data.watchNum < 0 ? 0 : this.data.watchNum
        let joinNum = this.data.joinNum < 0 ? 0 : this.data.joinNum
        this.numberText.textFlow = <Array<egret.ITextElement>>[
            { text: `观战${watchNum}人          `},
            { text: `${joinNum}/${this.data.maxJoin}`}
        ]
        this.statusText = this.data.status == RoomStatus.PK ? "团队pk中" : "战场等待中"
        this.icon.texture = RES.getRes(this.data.status == RoomStatus.PK ? 'pk_icon_fighting_png' : 'pk_icon_wait_png')
        this.icon.x = this.data.status == RoomStatus.PK ? 570 : 580
    }
}