
class EquipList extends Scene {
    private config
    private searchInput: SearchInput
    constructor(config) {
        super()
        this.config = config
        this.close_btn = "close_png"
    }

    public init() {
        super.setBackground()
        let bd: egret.Bitmap = Util.createBitmapByName('equip_bg_' + this.config.type + '_01_png')
        bd.y = 20
        this.addChild(bd)
        this.changeTypeList(this.config)
    }

    private changeTypeList(config) {
        Http.getInstance().post(Url.HTTP_EQUIP_LIST, { catid: config.type }, data => {
            var group = new eui.Group()
            group.height = 5000
            group.width = this.stage.stageWidth
            this.addChild(group)

            let y = 0
            if (data.data != null) {
                let list = data.data
                for (let item of list) {
                    let equipItem = new EquipItem(item)
                    equipItem.y = y
                    y += 130
                    equipItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeeItemDetail(item), this)
                    group.addChild(equipItem)
                }
            } else {
                let emptytips = new egret.TextField()
                emptytips.text = "暂无结果"
                emptytips.width = this.stage.stageWidth
                emptytips.textAlign = egret.HorizontalAlign.CENTER
                emptytips.y = 600
                emptytips.size = 40
                emptytips.textColor = 0x7fc871
                this.addChild(emptytips)
            }

            group.height = y + 400
            var myScroller: eui.Scroller = new eui.Scroller()
            //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
            myScroller.height = 1000
            myScroller.y = 200
            //设置viewport
            myScroller.viewport = group
            this.addChild(myScroller)
        })
    }


    private onSeeItemDetail(item) {
        return () => {
            if (item.url && item.url.toLowerCase().trim().endsWith('.pdf')) {
                window.location.href = item.url
            } else {
                Http.getInstance().post(Url.HTTP_EQUIP_DETAIL, { conid: item.contentId }, data => {
                    let base = new Base64()
                    let s1 = base.decode(data.data.contentTxt)
                    Util.onStopMusic()
                    showIFrame(this.config.bg.slice(0, -4), s1, item.publicTime)
                })
            }
        }
    }
}