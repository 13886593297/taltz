class CTitle extends eui.Component implements  eui.UIComponent {
	
	t:string;
	
	public constructor(title:string) {
		super();
		this.t = title;
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