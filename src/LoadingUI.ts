//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite implements RES.PromiseTaskReporter {

    public constructor() {
        super();
        this.createView();
    }

    private textField: egret.TextField;

    private createView(): void {
        
        let stage = ViewManager.getInstance().stage;
        this.width = stage.stageWidth;
        this.height = stage.stageHeight;

        var bg:egret.Shape = new egret.Shape();
        bg.graphics.beginFill( 0x000000, 1);
        bg.graphics.drawRect( 0, 0, stage.stageWidth, stage.stageHeight );
        bg.graphics.endFill();
        bg.$alpha=0.1;
        this.addChild( bg );

        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = stage.stageHeight - 300;
        this.textField.width = stage.stageWidth;
        this.textField.x = 0
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.size = 60;
        this.textField.textColor = 0x808894;

        let group = new eui.Group();
        group.width = stage.stageWidth;
        group.y = 300;
        this.addChild(group);

        let vertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +

            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
            "}";
        let fragmentSrc1 =
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +
            "uniform sampler2D uSampler;\n" +

            "uniform float customUniform;\n" +

            "void main(void) {\n" +
            "vec2 uvs = vTextureCoord.xy;\n" +
            "vec4 fg = texture2D(uSampler, vTextureCoord);\n" +
            "fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;\n" +
            "gl_FragColor = fg * vColor;\n" +
            "}";
        let customFilter1 = new egret.CustomFilter(
            vertexSrc,
            fragmentSrc1,
            {
                customUniform: 0
            }
        );
    

        this.filters = [customFilter1];
        this.addEventListener(egret.Event.ENTER_FRAME, () => {
            customFilter1.uniforms.customUniform += 0.1;
            if (customFilter1.uniforms.customUniform > Math.PI * 2) {
                customFilter1.uniforms.customUniform = 0.0;
            }
        }, this);

        
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = `${Math.ceil(current/total*100)}%`;
    }
}
