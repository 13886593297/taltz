class TrainTitle extends eui.Component implements eui.UIComponent {

	t1: string
	t2: string
	public constructor(title1: string, title2: string) {
		super()
		this.t1 = title1
		this.t2 = title2
	}


	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance)
	}


	protected childrenCreated(): void {
		super.childrenCreated()
	}
}