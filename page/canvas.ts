export class Point{
    x: number
    y: number
    constructor(x:number, y:number){
        this.x = x
        this.y = y
    }
}

export class Line{
    points: Array<Point>
    constructor(points:Array<Point> = []){
        this.points = points
    }
    addPoints(points:Array<Point>) {
        this.points = this.points.concat(points)
    }
    go(ctx){
        if (this.points.length < 2){
            return
        }
        
        let firstP = this.points[0]
        ctx.beginPath()
        ctx.moveTo(firstP.x, firstP.y)
        
        this.points.slice(1).forEach(p=>{
            ctx.lineTo(p.x, p.y)
        })

        ctx.stroke()
    }
}

export class Canvas{
    static ctx:HTMLCanvasElement

    static init(ctx){
        ctx.font = '24px Hiragino Sans GB'
        this.ctx = ctx
    }

    static line(line:Line){
        line.go(this.ctx)
    }

    static text(text:string, p:Point){
        this.ctx['fillText'](text, p.x, p.y)
    }
}