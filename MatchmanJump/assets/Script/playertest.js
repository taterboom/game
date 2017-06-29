var common = require ('common');
cc.Class({
    extends: cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(0, 0),
        gravity: 0,
        drag: 0,
        direction: 0,
        jumpSpeed: 0,
        jumpleft:{
            default:null,
            type:cc.SpriteFrame
        },
        jumpright:{
            default:null,
            type:cc.SpriteFrame
        },
        jumpup:{
            default:null,
            type:cc.SpriteFrame
        },
        jumpdown:{
            default:null,
            type:cc.SpriteFrame
        }
        
    },
    touchControl:function(n){
        this.direction = n;
    },
    // use this for initialization
    onLoad: function () {
        var _self = this;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        //add keyboard input listener to call turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD, 
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this),
        }, this.node);
        
        this.collisionX = 0;
        this.collisionY = 0;

        //this.prePosition = cc.v2();
        //this.preStep = cc.v2();

        this.flag = 0;
        this.flagChange = 0;
    },
    
    onDisabled: function () {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },
    
    onKeyPressed: function (keyCode, event) {
        switch(keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.direction = -1;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 1;
                break;
        }
    },
    
    onKeyReleased: function (keyCode, event) {
        switch(keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 0;
                break;
        }
    },
    
    onCollisionEnter: function (other, self) {
        this.node.color = cc.Color.RED;

        this.touchingNumber ++;
        
        // 1st step 
        // get pre aabb, go back before collision
        var otherAabb = other.world.aabb;
        var otherPreAabb = other.world.preAabb.clone();

        var selfAabb = self.world.aabb;
        var selfPreAabb = self.world.preAabb.clone();
        /*
        // 2nd step
        // forward x-axis, check whether collision on x-axis
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)) {
                //this.node.x = otherPreAabb.xMax - this.node.parent.x;
                this.collisionX = -1;
            }
            else if (this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)) {
                //this.node.x = otherPreAabb.xMin - selfPreAabb.width - this.node.parent.x;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            other.touchingX = true;
            return;
        }
        */
        // 3rd step
        // forward y-axis, check whether collision on y-axis
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;

        if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
            if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)) {
                if(other.node.name == 'cloud3'){
                    //this.node.getComponent('cc.Sprite').spriteFrame=this.die;
                    cc.audioEngine.play(common.thunderMusic,false,common.btnMusicVolume);
                    var anim = this.getComponent(cc.Animation);
                    anim.play();
                    this.flag = 1;
                }
                this.node.y = otherPreAabb.yMax - this.node.parent.y;
                this.collisionY = -1;
                //darkcloud can only jump once
                if(other.node.name == 'cloud2'){
                    other.node.getComponent('CloudController').delayDestroy();
                }
                cc.audioEngine.play(common.jumpMusic,false,common.btnMusicVolume);
                
                
                
            }
            other.touchingY = true;
        }    
        
    },
    
    onCollisionStay: function (other, self) {
        
    },
    
    onCollisionExit: function (other) {
         if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
        }
    },
    
    update: function (dt) {
        //drop with gravity when no collision
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }
        //jump when droping to cloud
        if(this.collisionY === -1){
            this.speed.y = this.jumpSpeed;
        }
        //no key pressed => drag
        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            }
            else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        } else {//key pressed => left/right accelerate
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }
        //?what it used for
        //this.prePosition.x = this.node.x;
        //this.prePosition.y = this.node.y;

        //this.preStep.x = this.speed.x * dt;
        //this.preStep.y = this.speed.y * dt;
        
        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
        if(this.node.x > 1080){
            this.node.x = 0;
        }
        if(this.node.x < 0){
            this.node.x = 1080;
        }
        if(common.userData.gender == 'mm'){
            if(this.speed.y < 0){
                this.node.getComponent('cc.Sprite').spriteFrame=this.jumpdown;
            }else{
                this.node.getComponent('cc.Sprite').spriteFrame=this.jumpup;
            }
        }
        
        if(common.userData.gender == 'gg'){
            if(this.direction == -1){
                this.node.getComponent('cc.Sprite').spriteFrame=this.jumpleft;
            }else if(this.direction == 1){
                this.node.getComponent('cc.Sprite').spriteFrame=this.jumpright;
            }
        }
        if(this.flag === 1){
            this.speed.y = 0;
        }
        if(this.flag === 1 && this.flagChange === 0){
            this.flagChange = 1;
            common.userData.success = 'fail!';
            setTimeout(function(){
                cc.director.loadScene('gameover');
            },500)
            
        }
        //root move
        //if(this.node.y+this.node.parent.y>800){
        //    this.node.parent.y-=(this.node.y+this.node.parent.y-800);
        //}

    },
});
