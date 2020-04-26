class DailyTasks5 extends eui.Component implements eui.UIComponent {
    btnClose: eui.Image
    btnGoto: eui.Image
    clickArea: eui.Label

    public constructor() {
        super()
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance)
    }

    protected childrenCreated(): void {
        super.childrenCreated()

        this.clickArea.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            DataManager.getInstance().hasShowSignIn = true

            Http.getInstance().post(Url.HTTP_SIGN, {}, (data) => {
                let scene = new IndexScene()
                ViewManager.getInstance().changeScene(scene)
            })
        }, this)

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.parent.parent.removeChild(this.parent.parent)
            DataManager.getInstance().hasShowSignIn = true

            Http.getInstance().post(Url.HTTP_SIGN, {}, (data) => {
                let scene = new IndexScene()
                ViewManager.getInstance().changeScene(scene)
            })
        }, this)
    }

}