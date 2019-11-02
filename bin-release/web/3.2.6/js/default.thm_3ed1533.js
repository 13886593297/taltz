window.skins={};
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml","TrainTitle":"resource/eui_skins/TrainTitle.exml","CTitle":"resource/eui_skins/CTitle.exml","RadarPanel":"resource/eui_skins/RadarPanel.exml","RankItemTemplate":"resource/eui_skins/RankItemTemplate.exml","RankItemTeamTemplate":"resource/eui_skins/RankItemTeamTemplate.exml","TrainSummary":"resource/eui_skins/TrainSummary.exml","SearchInput":"resource/eui_skins/SearchInput.exml"};generateEUI.paths['resource/eui_skins/AlertPanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	var PanelSkin$Skin1 = 	(function (_super) {
		__extends(PanelSkin$Skin1, _super);
		function PanelSkin$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = PanelSkin$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "dialog_close_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return PanelSkin$Skin1;
	})(eui.Skin);

	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["closeButton","titleDisplay"];
		
		this.height = 235;
		this.minHeight = 235;
		this.minWidth = 680;
		this.width = 680;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this.closeButton_i(),this.titleDisplay_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.left = 0;
		t.source = "alter_bg_png";
		t.top = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 49.5;
		t.anchorOffsetY = 49.5;
		t.height = 99;
		t.source = "dialog_close_x_png";
		t.width = 99;
		t.x = 670;
		t.y = 0;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.anchorOffsetX = 49.5;
		t.anchorOffsetY = 49.5;
		t.height = 99;
		t.label = "";
		t.width = 99;
		t.x = 670;
		t.y = 0;
		t.skinName = PanelSkin$Skin1;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "SimHei";
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 40;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0xffffff;
		t.verticalCenter = -28;
		t.percentWidth = 80;
		t.wordWrap = false;
		t.x = 195.00000000000003;
		t.y = 357.00000000000006;
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/Button.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.height = 79;
		this.minHeight = 79;
		this.minWidth = 336;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.fillMode = "scale";
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(68,31,188,35);
		t.source = "button_bg_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 23;
		t.fontFamily = "SimHei";
		t.height = 60;
		t.left = 16;
		t.right = 14;
		t.size = 28;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 2;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.height = 24;
		t.horizontalCenter = -124;
		t.verticalCenter = -11.5;
		t.width = 24;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CTitle.exml'] = window.CTitleSkin = (function (_super) {
	__extends(CTitleSkin, _super);
	function CTitleSkin() {
		_super.call(this);
		this.skinParts = ["title"];
		
		this.height = 73;
		this.width = 283;
		this.elementsContent = [this._Image1_i(),this.title_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.t"],[0],this.title,"text");
	}
	var _proto = CTitleSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "dialog_title_bg_png";
		t.x = 2;
		t.y = 1;
		return t;
	};
	_proto.title_i = function () {
		var t = new eui.Label();
		this.title = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 38;
		t.textAlign = "center";
		t.textColor = 0xf46c22;
		t.verticalAlign = "middle";
		t.width = 202;
		t.x = 8;
		t.y = 18;
		return t;
	};
	return CTitleSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	var PanelSkin$Skin2 = 	(function (_super) {
		__extends(PanelSkin$Skin2, _super);
		function PanelSkin$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = PanelSkin$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "dialog_close_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return PanelSkin$Skin2;
	})(eui.Skin);

	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","closeButton","moveArea"];
		
		this.height = 794;
		this.minHeight = 794;
		this.minWidth = 686;
		this.width = 639;
		this.elementsContent = [this._Image1_i(),this.moveArea_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.height = 794;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(261,78,310,483);
		t.source = "blue_small_bg_png";
		t.top = 0;
		t.width = 639;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 78;
		t.horizontalCenter = 0;
		t.left = 0;
		t.right = 0;
		t.top = 83;
		t.elementsContent = [this._Image2_i(),this._Image3_i(),this.titleDisplay_i(),this.closeButton_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.fillMode = "clip";
		t.height = 78;
		t.horizontalCenter = 87;
		t.source = "dialog_title_bg_png";
		t.verticalCenter = 0;
		t.width = 451;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 49.5;
		t.anchorOffsetY = 49.5;
		t.fillMode = "scale";
		t.height = 99;
		t.right = -50;
		t.source = "dialog_close_x_png";
		t.top = -55;
		t.visible = false;
		t.width = 99;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = -20.5;
		t.size = 30;
		t.text = "";
		t.textAlign = "center";
		t.textColor = 0x00bed6;
		t.verticalCenter = -0.5;
		t.width = 250;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.anchorOffsetX = 49.5;
		t.anchorOffsetY = 49.5;
		t.height = 99;
		t.label = "";
		t.right = -50;
		t.top = -55;
		t.visible = false;
		t.width = 99;
		t.skinName = PanelSkin$Skin2;
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","border","labelDisplay"];
		
		this.height = 22;
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this.thumb_i(),this.border_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.anchorOffsetY = 0;
		t.fillMode = "repeat";
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		t.x = 0;
		return t;
	};
	_proto.border_i = function () {
		var t = new eui.Image();
		this.border = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(33,0,49,26);
		t.source = "progress_bg_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bold = true;
		t.fontFamily = "Tahoma";
		t.size = 25;
		t.textAlign = "center";
		t.textColor = 0xF36C21;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		t.x = -100;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadarPanel.exml'] = window.RadarPanelSkin = (function (_super) {
	__extends(RadarPanelSkin, _super);
	function RadarPanelSkin() {
		_super.call(this);
		this.skinParts = ["savePic","share"];
		
		this.height = 580;
		this.width = 660;
		this.elementsContent = [this._Image1_i(),this.savePic_i(),this.share_i(),this._Label1_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.t"],[0],this._Label1,"text");
	}
	var _proto = RadarPanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "radar_border_png";
		t.x = 8;
		t.y = -10;
		return t;
	};
	_proto.savePic_i = function () {
		var t = new eui.Image();
		this.savePic = t;
		t.source = "button_small_1_png";
		t.x = 75;
		t.y = 505;
		return t;
	};
	_proto.share_i = function () {
		var t = new eui.Image();
		this.share = t;
		t.source = "button_small_2_png";
		t.x = 344;
		t.y = 505;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		this._Label1 = t;
		t.anchorOffsetX = 0;
		t.textAlign = "center";
		t.textColor = 0xf46c22;
		t.width = 202;
		t.x = 197;
		t.y = 14;
		return t;
	};
	return RadarPanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RankItemTeamTemplate.exml'] = window.RankItemTeamTemplateSkin = (function (_super) {
	__extends(RankItemTeamTemplateSkin, _super);
	function RankItemTeamTemplateSkin() {
		_super.call(this);
		this.skinParts = ["bigImg","cup","labserialNo"];
		
		this.height = 158;
		this.width = 555;
		this.elementsContent = [this.bigImg_i(),this.cup_i(),this._Image1_i(),this._Rect1_i(),this._Label1_i(),this._Label2_i(),this.labserialNo_i(),this._Label3_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.teamName"],[0],this._Label1,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.serialNo"],[0],this.labserialNo,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.achiRate"],[0],this._Label3,"text");
	}
	var _proto = RankItemTeamTemplateSkin.prototype;

	_proto.bigImg_i = function () {
		var t = new eui.Image();
		this.bigImg = t;
		t.height = 128;
		t.source = "rank_item_bg_png";
		t.width = 525;
		t.x = 30;
		t.y = 30;
		return t;
	};
	_proto.cup_i = function () {
		var t = new eui.Image();
		this.cup = t;
		t.height = 27;
		t.source = "cup1_png";
		t.width = 28;
		t.x = 516;
		t.y = 64.5;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 59;
		t.source = "rank_number_bg_png";
		t.width = 59;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xc1bdbd;
		t.height = 60;
		t.width = 1;
		t.x = 210;
		t.y = 50;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		this._Label1 = t;
		t.anchorOffsetX = 0;
		t.width = 138;
		t.x = 65;
		t.y = 66;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.size = 24;
		t.text = "团队达标率：";
		t.x = 220.5;
		t.y = 69;
		return t;
	};
	_proto.labserialNo_i = function () {
		var t = new eui.Label();
		this.labserialNo = t;
		t.x = 21;
		t.y = 16;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		this._Label3 = t;
		t.size = 36;
		t.x = 370;
		t.y = 63;
		return t;
	};
	return RankItemTeamTemplateSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RankItemTemplate.exml'] = window.RankItemTemplateSkin = (function (_super) {
	__extends(RankItemTemplateSkin, _super);
	function RankItemTemplateSkin() {
		_super.call(this);
		this.skinParts = ["bigImg","cup","labserialNo"];
		
		this.height = 128;
		this.width = 555;
		this.elementsContent = [this.bigImg_i(),this.cup_i(),this._Image1_i(),this._Rect1_i(),this._Label1_i(),this._Label2_i(),this._Label3_i(),this._Label4_i(),this.labserialNo_i(),this._Label5_i(),this._Label6_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.teamName"],[0],this._Label1,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.userName"],[0],this._Label2,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.serialNo"],[0],this.labserialNo,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.achiRate"],[0],this._Label5,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.score"],[0],this._Label6,"text");
	}
	var _proto = RankItemTemplateSkin.prototype;

	_proto.bigImg_i = function () {
		var t = new eui.Image();
		this.bigImg = t;
		t.height = 128;
		t.source = "rank_item_bg_png";
		t.width = 525;
		t.x = 30;
		t.y = 0;
		return t;
	};
	_proto.cup_i = function () {
		var t = new eui.Image();
		this.cup = t;
		t.height = 27;
		t.source = "cup1_png";
		t.width = 28;
		t.x = 516;
		t.y = 34.5;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 59;
		t.source = "rank_number_bg_png";
		t.width = 59;
		t.x = 0.5;
		t.y = 18.5;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xc1bdbd;
		t.height = 60;
		t.width = 1;
		t.x = 210;
		t.y = 20;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		this._Label1 = t;
		t.anchorOffsetX = 0;
		t.size = 24;
		t.width = 140;
		t.x = 65;
		t.y = 13;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		this._Label2 = t;
		t.anchorOffsetX = 0;
		t.size = 24;
		t.width = 140;
		t.x = 65;
		t.y = 55;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		t.size = 24;
		t.text = "个人达标率：";
		t.x = 221;
		t.y = 17;
		return t;
	};
	_proto._Label4_i = function () {
		var t = new eui.Label();
		t.anchorOffsetX = 0;
		t.size = 24;
		t.text = "个人积分：";
		t.width = 152;
		t.x = 221;
		t.y = 58;
		return t;
	};
	_proto.labserialNo_i = function () {
		var t = new eui.Label();
		this.labserialNo = t;
		t.x = 21;
		t.y = 33;
		return t;
	};
	_proto._Label5_i = function () {
		var t = new eui.Label();
		this._Label5 = t;
		t.x = 363;
		t.y = 14;
		return t;
	};
	_proto._Label6_i = function () {
		var t = new eui.Label();
		this._Label6 = t;
		t.x = 362;
		t.y = 54;
		return t;
	};
	return RankItemTemplateSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/SearchInput.exml'] = window.SearchInputSkin = (function (_super) {
	__extends(SearchInputSkin, _super);
	function SearchInputSkin() {
		_super.call(this);
		this.skinParts = ["txtInput","btnSearch"];
		
		this.height = 50;
		this.width = 612;
		this.elementsContent = [this._Image1_i(),this.txtInput_i(),this.btnSearch_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.keywords"],[0],this.txtInput,"text");
	}
	var _proto = SearchInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 48;
		t.source = "search_left_png";
		t.width = 552;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.txtInput_i = function () {
		var t = new eui.EditableText();
		this.txtInput = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 44;
		t.textColor = 0x262626;
		t.verticalAlign = "middle";
		t.width = 540;
		t.x = 2;
		t.y = 2;
		return t;
	};
	_proto.btnSearch_i = function () {
		var t = new eui.Image();
		this.btnSearch = t;
		t.source = "search_right_png";
		t.width = 55;
		t.x = 552;
		t.y = 0;
		return t;
	};
	return SearchInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TrainSummary.exml'] = window.TrainSummarySkin = (function (_super) {
	__extends(TrainSummarySkin, _super);
	function TrainSummarySkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.height = 108;
		this.width = 564;
		this.elementsContent = [this._Image1_i(),this._Label1_i(),this._Label2_i(),this._Label3_i(),this._Label4_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.t1"],[0],this._Label3,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.t2"],[0],this._Label4,"text");
	}
	var _proto = TrainSummarySkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "score_bg_png";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.text = "累计训练：";
		t.textColor = 0xf46c22;
		t.x = 14;
		t.y = 39;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.text = "正确率:";
		t.textColor = 0xf46c22;
		t.x = 361;
		t.y = 39;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		this._Label3 = t;
		t.size = 36;
		t.textColor = 0xf46c22;
		t.x = 150;
		t.y = 34;
		return t;
	};
	_proto._Label4_i = function () {
		var t = new eui.Label();
		this._Label4 = t;
		t.size = 36;
		t.textColor = 0xf46c22;
		t.x = 464;
		t.y = 34;
		return t;
	};
	return TrainSummarySkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TrainTitle.exml'] = window.TrainTitleSkin = (function (_super) {
	__extends(TrainTitleSkin, _super);
	function TrainTitleSkin() {
		_super.call(this);
		this.skinParts = ["title1","title2"];
		
		this.height = 160;
		this.width = 212;
		this.elementsContent = [this._Image1_i(),this.title1_i(),this.title2_i()];
		
		eui.Binding.$bindProperties(this, ["hostComponent.t1"],[0],this.title1,"text");
		eui.Binding.$bindProperties(this, ["hostComponent.t2"],[0],this.title2,"text");
	}
	var _proto = TrainTitleSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "train_title_bg_png";
		t.x = 66;
		t.y = 13.5;
		return t;
	};
	_proto.title1_i = function () {
		var t = new eui.Label();
		this.title1 = t;
		t.bold = true;
		t.textColor = 0xf46c22;
		t.x = 3;
		t.y = 65;
		return t;
	};
	_proto.title2_i = function () {
		var t = new eui.Label();
		this.title2 = t;
		t.anchorOffsetX = 0;
		t.textColor = 0xf46c22;
		t.width = 74;
		t.x = 106;
		t.y = 56;
		return t;
	};
	return TrainTitleSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);