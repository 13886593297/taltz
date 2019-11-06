class RadarPanel extends eui.Component implements eui.UIComponent {
	savePic: eui.Image;
	share: eui.Image;
	pp: Scene;
	public constructor(p: Scene) {
		super();
		this.pp = p;
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}

	protected childrenCreated(): void {
		super.childrenCreated();

		// 分享
		this.share.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			let tips = new SharePanel();
			this.pp.addChild(tips);
		}, this);
		this.savePic.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSaveImg, this);
	}

	// 保存图片
	public onSaveImg() {
		let alert = new AlertPanel("提示:请自行截图保存图片", 1150)
		this.pp.addChild(alert);
	}
}