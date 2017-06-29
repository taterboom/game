var common = require('common');
cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            default:null,
            type:cc.Node
        },
        labelSuccess:{
            default:null,
            type:cc.Label
        },
        labelScore:{
            default:null,
            type:cc.Label
        },
        inputName:{
            default:null,
            type:cc.Node
        },
        replayBtn:{
            default:null,
            type:cc.Button
        },
        menuBtn:{
            default:null,
            type:cc.Button
        }
    },
    saveRecord:function(){
        if(!cc.sys.localStorage.getItem('record')){
            cc.sys.localStorage.setItem('record',"["+JSON.stringify(common.userData)+"]");
        }else{
            var record = cc.sys.localStorage.getItem('record');
            record = JSON.parse(record);
            while(record.length>10){
                record.pop();
            }
            record.unshift(common.userData);
            cc.sys.localStorage.setItem('record',JSON.stringify(record));
        }
    },
    // use this for initialization
    onLoad: function () {
        this.currentBGMusic = cc.audioEngine.play(common.gameoverBgm, true,common.bgMusicVolume);
        if(common.userData.success == 'fail!'){
            this.player.runAction(cc.moveTo(1,cc.p(0,-845)));
        }else{
            // 跳跃上升
        var jumpUp = cc.moveBy(0.3, cc.p(0, 280)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(0.3, cc.p(0, -280)).easing(cc.easeCubicActionIn());

        this.player.y = -800;
        this.player.rotation = 0;
        this.player.runAction(cc.repeatForever(cc.sequence(jumpUp, jumpDown),1));
        }
        this.labelSuccess.string = common.userData.success;
        this.labelScore.string = 'your score is : '+common.userData.score;
        this.labelSuccess.node.runAction(cc.moveTo(0.5,cc.p(0,300)));
        this.labelScore.node.runAction(cc.moveTo(0.7,cc.p(0,50)));
        
        this.inputName.runAction(cc.moveTo(0.9,cc.p(0,-50)));
        cc.find('Canvas/inputName/name').on('text-changed',function(){
            //console.log(this.getComponent(cc.EditBox).string);
            common.userData.name = this.getComponent(cc.EditBox).string;
        });

        this.replayBtn.node.runAction(cc.fadeIn(0.5));
        this.menuBtn.node.runAction(cc.fadeIn(0.5));
        this.replayBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            this.saveRecord();
            cc.director.loadScene('play');
        },this);
        this.menuBtn.node.on('touchstart',function(){
            cc.audioEngine.play(common.btnMusic,false,common.btnMusicVolume);
            this.saveRecord();
            cc.director.loadScene('start');
        },this);
        
    },
    onDestroy: function () {
        //stop play bgMusic 
        cc.audioEngine.stop(this.currentBGMusic);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
