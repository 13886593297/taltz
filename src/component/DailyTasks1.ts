class DailyTasks1 extends eui.Component implements eui.UIComponent {

    btnClose: eui.Image
    clickArea: eui.Label
    t: any
    i: any

    public constructor() {
        super()
        this.i = Util.getDailyTaskID()
        this.t = '本篇内容涉及领域为：' + EquipmentConfigs[this.i].name
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance)
    }

    protected childrenCreated(): void {
        super.childrenCreated()

        this.clickArea.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.parent.parent.removeChild(this.parent.parent)
            DataManager.getInstance().hasShowSignIn = true
            let scene = new EquipList(EquipmentConfigs[this.i])
            scene.isFromDY = true
            ViewManager.getInstance().changeScene(scene)
        }, this)

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.parent.parent.parent.removeChild(this.parent.parent)
            DataManager.getInstance().hasShowSignIn = true
            let scene = new IndexScene()
            ViewManager.getInstance().changeScene(scene)
        }, this)
    }

}