
class EquipSearch extends Scene {

    private keywords
    constructor(keywords) {
        super()
        this.isnSpecialReturn = true
        this.keywords = keywords
    }

    public init() {
        super.setBackground()

        let title = Util.createBitmapByName('equip_title_png')
        title.y = 20
        this.addChild(title)

        let searchInput = new SearchInput(this.keywords)
        searchInput.x = (this.stage.stageWidth - 515) / 2
        searchInput.y = 230
        this.addChild(searchInput)

        this.changeTypeList()
    }

    private changeTypeList() {
        Http.getInstance().post(Url.HTTP_EQUIP_SEARCH, { keywords: this.keywords }, data => {
            var group = new eui.Group()
            group.width = this.stage.stageWidth
            this.addChild(group)

            let bg: egret.Bitmap = Util.createBitmapByName('search_result_bg_png')
            bg.y = 320
            bg.x = (this.stage.stageWidth - bg.width) / 2
            this.addChild(bg)

            let title = new egret.TextField()
            title.text = '搜索结果列表'
            title.textColor = 0x7fc871
            title.size = 32
            title.x = 150
            title.y = 365
            this.addChild(title)

            let y = 0
            if (data.data != null) {
                let list = data.data
                for (let item of list) {
                    let equipItem = new EquipItem(item)
                    equipItem.width = 490
                    equipItem.height = 60
                    equipItem.scaleX = .75
                    equipItem.scaleY = .75
                    equipItem.y = y
                    y += equipItem.height + 30
                    equipItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeeItemDetail(item), this)
                    group.addChild(equipItem)
                }
            } else {
                let emptytips = new egret.TextField()
                emptytips.text = "暂无结果"
                emptytips.width = this.stage.stageWidth
                emptytips.textAlign = egret.HorizontalAlign.CENTER
                emptytips.y = 550
                emptytips.size = 40
                emptytips.textColor = 0x7fc871
                this.addChild(emptytips)
            }

            var myScroller: eui.Scroller = new eui.Scroller()
            //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
            myScroller.width = 490
            myScroller.height = 310
            myScroller.y = 430
            myScroller.x = 130
            //设置viewport
            myScroller.viewport = group
            this.addChild(myScroller)
        })
    }


    private onSeeItemDetail(item) {
        return (e) => {
            if (item.url && item.url.toLowerCase().trim().endsWith('.pdf')) {
                window.location.href = item.url
            }
            else {
                // let scene = new EquipViewScene()
                // scene.contentId = item.contentId
                // ViewManager.getInstance().changeScene(scene)
                Http.getInstance().post(Url.HTTP_EQUIP_DETAIL, { conid: item.contentId }, (data) => {
                    let base = new Base64()
                    let s1 = base.decode(data.data.contentTxt)
                    Util.onStopMusic()
                    showIFrame(this.keywords, s1, item.publicTime)
                })
            }
        }
    }
}