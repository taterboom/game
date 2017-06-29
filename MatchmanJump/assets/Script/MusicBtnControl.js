cc.Class({
    extends: cc.Component,

    properties: {
        musicopen:{
            default:null,
            type:cc.SpriteFrame
        },
        musicclose:{
            default:null,
            type:cc.SpriteFrame
        }
    },

    // use this for initialization
    onLoad: function () {
        var _self=this;
        var flag=0;
        this.node.on('touchend',function(){
            flag+=1;
            flag%=2;
            _self.getComponent('cc.Sprite').spriteFrame=flag==0?_self.musicopen:_self.musicclose;   
        });
        
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
