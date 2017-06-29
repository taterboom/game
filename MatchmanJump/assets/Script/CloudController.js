cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            default:null,
            type:cc.Node
        }
    },
    delayDestroy:function(){
        this.node.runAction(cc.fadeOut(0.2));
        var _self = this;
        setTimeout(function(){
           _self.node.destroy(); 
        },200);  
    },
    // move:function(){
    //     var moveLeft = cc.moveTo(4+cc.random0To1()*2,cc.p(0,this.node.y));
    //     var moveRight = cc.moveTo(4+cc.random0To1()*2,cc.p(1080,this.node.y));
    //     this.node.runAction(cc.repeatForever(cc.sequence(moveLeft,moveRight)));
    // },
    flagMove:0,
    // use this for initialization
    onLoad: function () {
        var zhengfu = cc.random0To1()>=0.5?1:-1;
        this.speed = zhengfu*(1 + cc.random0To1()*2);
        
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.player.y-this.node.y>1000){
            this.node.parent.removeChild(this.node);
            this.node.destroy();
        }
        if(this.flagMove == 1){
            if(this.node.x < 0 || this.node.x >1080){
                this.speed = -this.speed;
            }
            
            this.node.x += this.speed;
        }
    },
});
