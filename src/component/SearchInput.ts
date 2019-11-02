class SearchInput extends eui.Component implements eui.UIComponent {

	txtInput: eui.EditableText
	btnSearch: egret.Shape
	private keywords
	public constructor(keywords) {
		super()
		this.keywords = keywords
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance)
	}

	protected childrenCreated(): void {
		super.childrenCreated()
		this.btnSearch.touchEnabled = true

		this.btnSearch.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			let keywords = this.txtInput.text
			if (keywords == '') {
				let alert = new AlertPanel("请输入查询关键字", 1200)
				alert.x = 0 - this.x
				alert.y = 0 - this.y
				super.addChildAt(alert, 100)
			}
			else {
				let scene = new EquipSearch(keywords)
				ViewManager.getInstance().changeScene(scene)
			}
		}, this)
	}
}