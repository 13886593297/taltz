class PkRecordScene extends Scene {
    public constructor() {
        super()
    }

    private groupView
    private scrollView
    private itemY = 0
    private page = 1
    private pageSize = 20
    private end = false

    public init() {
        super.setBackground()
        this.close_btn = false

        let title = Util.createBitmapByName('pk_record_title_png')
        title.x = (this.stage.stageWidth - title.width) / 2
        title.y = 45
        this.addChild(title)

        let backButtonBg = Util.drawRoundRect(6, 0x4fb483, 0xbbc540, 360, 70, 80)
        backButtonBg.x = (this.stage.stageWidth - backButtonBg.width) / 2
        backButtonBg.y = this.stage.stageHeight - 200
        backButtonBg.touchEnabled = true
        backButtonBg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            ViewManager.getInstance().back()
        }, this)
        this.addChild(backButtonBg)

        let backButtonText = new egret.TextField
        backButtonText.text = '返回PK模式目录'
        backButtonText.width = backButtonBg.width
        backButtonText.height = backButtonBg.height
        backButtonText.x = backButtonBg.x
        backButtonText.y = backButtonBg.y
        backButtonText.textAlign = 'center'
        backButtonText.verticalAlign = 'middle'
        backButtonText.size = 40
        this.addChild(backButtonText)

        SocketX.getInstance().addEventListener(NetEvent.PK_RECORDS, (data) => {
          //  console.log(data.data)
            ViewManager.getInstance().hideLoading()
            if (data.data.length == 0 && this.page == 1) {
                let tip = new LineInfo('暂无挑战数据')
                this.addChild(tip)
                return
            }
            this.updateGroup(data.data || [])
        })

        SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: this.page, pageSize: this.pageSize })

        let border = Util.drawRoundRect(2, 0x4fb483, 0xFFFFFF, 650, this.stage.stageHeight - 300 + backButtonBg.height / 2, 80, 0)
        border.x = (this.stage.stageWidth - border.width) / 2
        border.y = 100
        this.addChildAt(border, 1)

        let group = new eui.Group()
        this.groupView = group

        var myScroller: eui.Scroller = new eui.Scroller()
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = this.stage.stageWidth
        myScroller.height = this.stage.stageHeight - 450
        myScroller.y = 200
        //设置viewport
        myScroller.viewport = group
        this.addChild(myScroller)
        this.scrollView = myScroller

        myScroller.addEventListener(eui.UIEvent.CHANGE_END, () => {
            if (myScroller.viewport.scrollV + myScroller.height >= myScroller.viewport.contentHeight) {
                if (!this.end) {
                    SocketX.getInstance().sendMsg(NetEvent.PK_RECORDS, { page: this.page, pageSize: this.pageSize })
                }
            }
        }, this)

        ViewManager.getInstance().showLoading('数据加载中...')
    }


    private updateGroup(list) {
        if (list.length < 20) {
            this.end = true
        }
        this.page += 1
        for (let data of list) {
            let item = new RecordItem(data)
            item.x = 55
            item.y = this.itemY
            this.groupView.addChild(item)
            this.itemY += 80
        }
    }
}

class RecordItem extends eui.Group {
    private data
    constructor(data) {
        super()
        this.data = data
        this.width = 540
        this.height = 80
        this.init()
    }

    private init() {
        let pkWayText = this.data.pkWay == 1 ? '匹配' : '邀请'

        let size = 24
        let fightPerson = new egret.TextField
        fightPerson.text = this.data.sendName + pkWayText + this.data.acceptName + '对战'
        fightPerson.width = 300
        fightPerson.height = this.height
        fightPerson.x = 40
        fightPerson.verticalAlign = 'middle'
        fightPerson.size = size
        fightPerson.textColor = 0x009649
        this.addChild(fightPerson)

        let result = new egret.TextField()
        result.text = this.data.pkResult.text
        result.width = 100
        result.height = this.height
        result.size = size
        result.x = 360
        result.verticalAlign = 'middle'
        result.textColor = 0x009649
        if (this.data.pkResult.text == '失败') {
            result.textColor = 0x747a7c
        } else {
            result.textColor = 0x006a3a
        }
        this.addChild(result)

        let date = new egret.TextField()
        date.text = this.data.createTime
        date.width = 150
        date.height = this.height
        date.size = size
        date.x = 450
        date.verticalAlign = 'middle'
        date.textColor = 0x009649
        date.textAlign = egret.HorizontalAlign.RIGHT
        this.addChild(date)

        let line = new egret.Shape
        line.graphics.lineStyle(2, 0x4fb483)
        line.graphics.moveTo(40, this.height)
        line.graphics.lineTo(600, this.height)
        line.graphics.endFill()
        this.addChild(line)

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            // test begin
            // let resultScene = new PkResultScene('', PkResultBackModel.BACK)
            // ViewManager.getInstance().changeScene(resultScene)
            // test end
            SocketX.getInstance().addEventListener(NetEvent.PK_INFO, (data) => {
                let result = data.data
                if (result.tipsCode == InviteStatus.WATTING) {
                    let pk = new PkInviteScene(InviteStatus.WATTING)
                    ViewManager.getInstance().changeScene(pk)
                } else {
                    // result.sendUserId = this.data.sendUserId
                    // result.accepUserId = this.data.accepUserId
                    result = DataManager.getInstance().convertPkResult(result)
                  //  console.log(result)
                    let resultScene = new PkResultScene(result, PkResultBackModel.BACK)
                    ViewManager.getInstance().changeScene(resultScene)
                }
            })
            SocketX.getInstance().sendMsg(NetEvent.PK_INFO, { pkCode: this.data.pkCode })
        }, this)
    }
}   