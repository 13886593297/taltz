class TrainSummary extends eui.Component implements  eui.UIComponent {
	
	t1:any;
	t2:any;
	public constructor(t1:any,t2:any) {
		super();
		this.t1 = t1;
		this.t2 = t2;
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	
}