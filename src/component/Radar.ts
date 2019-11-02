
class Radar extends egret.Sprite {
    private data
    private attrName
    private shape: egret.Shape

    public constructor(data, attrName, width, height) {
        super()
        this.data = data
        this.attrName = attrName
        this.shape = new egret.Shape()
        this.addChild(this.shape)
        this.drawRadar(width, height)
    }

    public drawRadar(width, height) {
        var step = this.data.length
        var r = width / 2
        var ranges = [10, 8, 6]
        var graphics = this.shape.graphics
        var points = []
        // 画底部六边形
        for (var j in ranges) {
            var sx_1 = 0
            var sy_1 = 0
            var s = ranges[j]
            graphics.lineStyle(5, 0x1f6941)
            for (var i = 0; i < step; i++) {
                var rad = 2 * Math.PI / step * i
                var x = r + Math.cos(rad) * r * (s / 10)
                var y = r + Math.sin(rad) * r * (s / 10)
                if (s == 10) {
                    points.push({ x: x, y: y })
                }
                if (i == 0) {
                    sx_1 = x
                    sy_1 = y
                    graphics.moveTo(x, y)
                }
                else {
                    graphics.lineTo(x, y)
                }
            }
            graphics.lineTo(sx_1, sy_1)
            graphics.endFill()
        }

        // 中间连接线
        for (var k in points) {
            graphics.moveTo(width / 2, height / 2)
            graphics.lineTo(points[k]['x'], points[k]['y'])
        }
        graphics.endFill()

        // 60% 80%文字
        var percentTextArr = ['80%', '60%']
        var percentTextY = 32
        percentTextArr.map(item => {
            var percentText = new egret.TextField()
            percentText.text = item
            percentText.textColor = 0x38aa4b
            percentText.bold = true
            percentText.size = 40
            percentText.x = 190
            percentText.y = percentTextY
            this.addChild(percentText)
            percentTextY += 40
        })

        // 不规则遮罩
        var sx = 0
        var sy = 0
        graphics.lineStyle(3, 0x1f6941)
        graphics.beginFill(0xc2cf00, .8)
        for (var i = 0; i < step; i++) {
            var rad = 2 * Math.PI / step * i
            var x = r + Math.cos(rad) * r * this.data[i].rate
            var y = r + Math.sin(rad) * r * this.data[i].rate
            if (i == 0) {
                sx = x
                sy = y
                graphics.moveTo(x, y)
            }
            else {
                graphics.lineTo(x, y)
            }
        }
        graphics.lineTo(sx, sy)
        graphics.endFill()

        // 添加项目名字
        for (var k in points) {
            var label = new egret.TextField()
            label.text = this.data[k].name
            label.textColor = 0xc1ce00
            label.width = 60
            label.size = 30
            var x_1 = points[k].x
            var y_1 = points[k].y
            if (k == '0') {
                x_1 += 30
            } else if (k == '1' || k == '5') {
                x_1 += 40
            } else if (k == '2' || k == '4') {
                x_1 -= 100
            } else if (k == '3') {
                x_1 -= 80
            }
            label.x = x_1
            label.y = y_1 - 25
            this.addChild(label)
        }

        // 添加称号
        var attrName = new egret.TextField()
        attrName.text = this.attrName
        attrName.textColor = 0x0ba23a
        attrName.stroke = 6
        attrName.strokeColor = 0xffffff
        attrName.size = 40
        attrName.x = 145
        attrName.y = 210
        this.addChild(attrName)
    }
}