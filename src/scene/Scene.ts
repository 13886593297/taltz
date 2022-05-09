type BTN = 'close_png' | 'close_white_png' | 'close_yellow_png' | false

class Scene extends eui.UILayer {
    private isRemove: boolean = true
    public close_btn: BTN = 'close_png'  // 关闭按钮
    public isnSpecialReturn: any = false
    public navColor
    public name
    public isBackHome = false
    public backPage: any = false
    private flag = true
    public removeEvent

    public constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.initScene, this)
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.release, this)
    }

    private initScene() {
        if (this.isRemove) { //防止多次加载
            this.init()
            this.isRemove = false
            if (this.close_btn != false) {
                this.createNavButton(this.close_btn)
            }
        }
    }

    public createNavButton(bg) {
        let nav_bg = Util.createBitmapByName(bg)
        nav_bg.x = this.stage.stageWidth - 90
        nav_bg.y = 40
        this.addChild(nav_bg)

        nav_bg.touchEnabled = true
        nav_bg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            if (!this.flag) return
            this.flag = false
            hideIFrame()
            if (this.isBackHome) {
                let scene = new IndexScene()
                ViewManager.getInstance().changeScene(scene)
            } else if (this.backPage) {
                ViewManager.getInstance().backByName(this.backPage)
            } else {
                this.onBack()
            }
            this.removeEvent && SocketX.getInstance().removeEventListener(this.removeEvent)
            setTimeout(() => {
                this.flag = true
            }, 300)
        }, this)
    }

    public setBackground(bg = "bg_png") {
        let sky = Util.createBitmapByName(bg)
        this.addChildAt(sky, -2)
        sky.width = this.stage.stageWidth
        sky.height = this.stage.stageHeight
    }

    /**
     * 更新页面信息 
     */
    public updateScene() {

    }

    /**
     * 初始化界面
     */
    public init() {

    }

    public onBack() {
        ViewManager.getInstance().back()
    }

    /**
     * 释放界面
     */
    public release() {

    }

    /**
     * 退出页面，需要加载动画
     */
    public remove() {
        // 切换动画
        this.removeChildren()
        this.parent.removeChild(this)
        this.isRemove = true
    }

}