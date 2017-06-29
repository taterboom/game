var common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        label:{
            default:null,
            type:cc.Prefab
        },
        backBtn:{
            default:null,
            type: cc.Button
        },

    },

    // use this for initialization
    onLoad: function () {
        
        var r = cc.sys.localStorage.getItem('record');
        this.record = eval('('+r+')');

        for(var i = 0 ; i < 10; i ++){
            if(this.record[i]){
                var player = cc.instantiate(this.label);
                player.getComponentInChildren(cc.Label).string = this.record[i].name;
                var level = cc.instantiate(this.label);
                level.getComponentInChildren(cc.Label).string = this.record[i].levelName;
                var score = cc.instantiate(this.label);
                score.getComponentInChildren(cc.Label).string = this.record[i].score;
                cc.find('Canvas/recordLayout').addChild(player);
                cc.find('Canvas/recordLayout').addChild(level);
                cc.find('Canvas/recordLayout').addChild(score);
            }
            
            
        }

        
        this.backBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            this.node.runAction(cc.scaleTo(0.5,0.2,0.2));
            cc.director.loadScene('start');
            
        },this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
