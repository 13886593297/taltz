class DailyTasks24 extends eui.Component implements eui.UIComponent {

    btnClose: eui.Image;
    btnGoto: eui.Image;
    clickArea: eui.Label;
    t: any;
    i: any;

    public constructor() {
        super();

        this.i = Util.getDailyTaskID();
        this.t = '本篇内容涉及领域为：' + EquipmentConfigs[this.i].name;
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
        super.childrenCreated();

        this.clickArea.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            DataManager.getInstance().hasShowSignIn = true;
            Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[this.i].qaids }, (data) => {
                let answer = new Answers();
                answer.lifecycleId = data.data.lifecycleId;
                answer.questions = data.data.questions.slice(0, 5);
                let scene = new AnswerScene(answer, 9);
                ViewManager.getInstance().changeScene(scene);
            });

        }, this);

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            DataManager.getInstance().hasShowSignIn = true;
            let scene = new IndexScene();
            ViewManager.getInstance().changeScene(scene);
        }, this);
    }

}