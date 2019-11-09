// class RankerPanel extends eui.Group {
//     private ranks
//     public constructor(data) {
//         super()
//         this.ranks = data
//         this.init()
//     }

//     public init() {
//         let stage = ViewManager.getInstance().stage
//         let mask: egret.Bitmap = Util.createBitmapByName('bg_png')
//         mask.y = 0
//         mask.x = 0
//         mask.width = stage.stageWidth
//         mask.height = stage.stageHeight
//         this.addChild(mask)

//         let panel = new eui.Panel()
//         // let y = (stage.stageHeight - 1000) / 2
//         panel.title = "战队月排名"
//         panel.width = 700
//         panel.height = 1000
//         panel.x = stage.stageWidth / 2
//         panel.y = stage.stageHeight / 2
//         panel.anchorOffsetX = panel.width / 2
//         panel.anchorOffsetY = panel.height / 2
//         panel.scaleX = 0
//         panel.scaleY = 0
//         egret.Tween.get(panel).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backInOut)
//         this.addChild(panel)

//         var group = new eui.Group()
//         group.height = 5000
//         group.width = 700
//         panel.addChild(group)

//         let ranks = this.ranks
//         let x = 50
//         let y = 0

//         for (let rank of ranks) {
//             let rankitem = new RankItemTeamTemplate(rank, false)
//             rankitem.x = x
//             rankitem.y = y
//             group.addChild(rankitem)
//             y += 140
//         }

//         var myScroller: eui.Scroller = new eui.Scroller()
//         //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
//         myScroller.height = 800
//         myScroller.width = 660
//         myScroller.y = 150
//         myScroller.x = 20
//         //设置viewport
//         myScroller.viewport = group
//         panel.addChild(myScroller)


//         let closeX = Util.createBitmapByName('dialog_close_x_png')
//         panel.addChild(closeX)
//         closeX.x = panel.width - 80
//         closeX.y = -10
//         closeX.touchEnabled = true
//         closeX.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
//             console.log('close')
//             Util.playMusic('model_select_mp3')
//             eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CLOSING, true, true)
//             this.parent.removeChild(this)
//             panel.close()
//         }, this)

//     }
// }

class RankItem extends eui.Group {

    private rankData
    private type
    constructor(rankData, width = 600) {
        super()
        this.width = width
        this.rankData = rankData
        this.init()
    }

    private init() {

        this.height = 130

        let bg: egret.Bitmap
        if (this.rankData.serialNo == 1) {
            bg = Util.createBitmapByName("rank_item1_bg_png")
        }
        else {
            bg = Util.createBitmapByName("rank_item_bg_png")
        }

        bg.width = this.width
        bg.height = this.height
        this.addChild(bg)

        if (this.rankData.serialNo < 4) {
            let cup: egret.Bitmap = Util.createBitmapByName("cup" + this.rankData.serialNo + "_png")
            cup.width = 28
            cup.height = 27
            cup.x = this.width - 40
            cup.y = 40
            this.addChild(cup)
        }

        let numberbg: egret.Bitmap = Util.createBitmapByName("rank_number_bg_png")
        numberbg.width = 59
        numberbg.height = 59
        numberbg.x = -30
        numberbg.y = 20
        this.addChild(numberbg)

        let number = new egret.TextField()
        number.text = this.rankData.serialNo + ""
        number.size = 28
        number.x = -25
        number.y = 25
        number.height = 50
        number.width = 50
        number.verticalAlign = egret.VerticalAlign.MIDDLE
        number.textAlign = egret.HorizontalAlign.CENTER
        this.addChild(number)


        let title = new egret.TextField()
        if (this.rankData.type == 1) {
            title.text = this.rankData.teamName + '-' + this.rankData.userName
        } else {
            title.text = this.rankData.teamName
        }

        title.size = 30
        title.height = 60
        title.verticalAlign = egret.VerticalAlign.MIDDLE
        title.textAlign = egret.HorizontalAlign.CENTER
        title.width = this.width
        title.y = 10
        this.addChild(title)


        let line: egret.Bitmap = Util.createBitmapByName("dialog_line_png")
        line.x = 138
        line.y = 70
        line.width = 323
        this.addChild(line)

        let score = new egret.TextField()

        if (this.rankData.type == 1) {
            score.textFlow = new Array<egret.ITextElement>(
                { text: "个人积分:" },
                { text: this.rankData.score + "", style: { textColor: 0xF46C22, size: 32 } },
            )
        } else {
            score.textFlow = new Array<egret.ITextElement>(
                { text: "战队积分:" },
                { text: this.rankData.teamScore + "", style: { textColor: 0xF46C22, size: 32 } },
            )
        }

        score.size = 30
        score.height = 60
        score.verticalAlign = egret.VerticalAlign.MIDDLE
        score.textAlign = egret.HorizontalAlign.CENTER
        score.width = this.width
        score.y = 72
        this.addChild(score)

        if (this.rankData.type == 2) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                let scene = new TeamRankScene(this.rankData.teamId)
                ViewManager.getInstance().changeScene(scene)
            }, this)
        }
    }


}

class AlertPanel extends eui.Group {

    private title = ""
    private isGray = false
    private _y
    public constructor(title = " ", _y, isGray = false, ) {
        super()
        this.title = title
        this.isGray = isGray
        
        this._y = _y
        this.init()
    }

    private init() {
        let stage = ViewManager.getInstance().stage
        this.width = stage.stageWidth
        this.height = stage.stageHeight
        
        let panel = new eui.Panel()
        panel.skinName = "resource/eui_skins/AlertPanelSkin.exml"
        panel.title = this.title
        panel.width = 472
        panel.height = 60
        panel.x = (stage.stageWidth - panel.width) / 2
        panel.y = this._y
        this.addChildAt(panel, 101)
        if (this.isGray) {
            panel.filters = [Util.grayFliter()]
        }

        panel.addEventListener(eui.UIEvent.CLOSING, () => {
            this.parent.removeChild(this)
        }, this)
    }
}