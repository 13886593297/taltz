class SignInIcon extends eui.Component implements eui.UIComponent {

    btnOpen: eui.Image;
    btnClose: eui.Image;
    btnGoto: eui.Image;
    public constructor() {
        super();
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    protected childrenCreated(): void {
        super.childrenCreated();

        this.btnOpen.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            egret.Tween.get(this).to({ x: 0 }, 600, egret.Ease.sineIn);
        }, this);

        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            egret.Tween.get(this).to({ x: -260 }, 600, egret.Ease.sineIn);
        }, this);

        this.btnGoto.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            let curDate = new Date();
            let week = curDate.getDay();
            // week = 6
            let dialogContainer;
            let ctr;
            switch (week) {
                case 1:
                case 3:
                    var i = Util.getDailyTaskID();
                    let scene = new EquipList(EquipmentConfigs[i]);
                    scene.isFromDY = true;
                    ViewManager.getInstance().changeScene(scene);
                    break;
                case 2:
                case 4:
                    var i = Util.getDailyTaskID();
                    Http.getInstance().post(Url.HTTP_DAILYTASKS_START, { questionAttrIds: EquipmentConfigs[i].qaids }, (data) => {
                        let answer = new Answers();
                        answer.lifecycleId = data.data.lifecycleId;
                        answer.questions = data.data.questions.slice(0, 5);

                        let scene = new AnswerScene(answer, 9);
                        ViewManager.getInstance().changeScene(scene);
                    });
                    break;
            }
            egret.Tween.get(this).to({ x: -260 }, 600, egret.Ease.sineIn);
        }, this);
    }
}