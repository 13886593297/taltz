
class PkListScene extends Scene {
    private readonly config = [
        { icon: 'person_pk_png', title: '个人挑战赛', type: 1 },
        { icon: 'team_pk_png', title: '团队PK赛', type: 2 }
    ]

    public init() {
        super.setBackground()
        this.name = "pklist"
        
        let stageW = ViewManager.getInstance().stage.stageWidth
        let title = Util.createBitmapByName('pk_list_title_png')
        title.x = (stageW - title.width) / 2
        title.y = 45
        this.addChild(title)

        let y = 250
        let grayFilter = Util.grayFliter()
        for (let data of this.config) {
            let item = new PkItem(data)
            // if (data.type == 2) item.filters = [grayFilter]
            this.addChild(item)
            item.y = y
            y += 500
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                Util.playMusic('model_select_mp3')
                // if (data.type == 2) {
                //     let alert = new AlertPanel("功能还未开放哦！", 1120)
                //     this.addChild(alert)
                //     return
                // }
                let modelScene = new PkModelScene(data.type)
                ViewManager.getInstance().changeScene(modelScene)
            }, this)
        }
    }

}   