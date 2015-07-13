var Window        = require('pex-sys/Window');
var MouseEvent    = require('pex-sys/MouseEvent');
var PerspCamera   = require('pex-cam/PerspCamera');
var CameraArcball = require('pex-cam/CameraArcball');
var Draw          = require('pex-draw');
var Vec3          = require('pex-math/Vec3');

var DEFAULT_EYE    = [0,3,-3];
var DEFAULT_TARGET = [0,0,0];

Window.create({
    settings : {
        width  : 800,
        height : 600
    },
    resources : {
        vert : {text : __dirname + '/../assets/glsl/ShowColors.vert' },
        frag : {text : __dirname + '/../assets/glsl/ShowColors.frag' }
    },
    init : function(){
        var ctx       = this.getContext();
        var resources = this.getResources();

        this._program = ctx.createProgram(resources.vert,resources.frag);
        ctx.bindProgram(this._program);

        this._camera  = new PerspCamera(45,this.getAspectRatio(),0.001,20.0);
        this._camera.lookAt(DEFAULT_EYE,DEFAULT_TARGET);
        this._camera.updateViewMatrix();

        this._arcball = new CameraArcball(this._camera,this.getWidth(),this.getHeight());
        this._draw    = new Draw(ctx);

        ctx.setClearColor(0.125,0.125,0.125,1);
        ctx.setDepthTest(true);
        ctx.setProjectionMatrix(this._camera.getProjectionMatrix());

        //Hook to mouse event, no register method atm
        var mouse = this.getMouse();
        var self  = this;
        mouse.addEventListener(MouseEvent.MOUSE_DOWN,function(e){
            self._arcball.onMouseDown(e);
        });
        mouse.addEventListener(MouseEvent.MOUSE_DRAG,function(e){
            self._arcball.onMouseDrag(e);
        });
        mouse.addEventListener(MouseEvent.MOUSE_UP,function(e){
            self._arcball.onMouseUp(e);
        });
        mouse.addEventListener(MouseEvent.MOUSE_SCROLL,function(e){
            self._arcball.onMouseScroll(e);
        });
        //Add
        //this.addEventListener(WindowEvent.RESIZE,function(e){
        //    self._arcball.onWindowResize(e);
        //})
        //var keyboard = this.getKeyboard();
    },
    triggerArcballUsage : function(){
        this._arcball.isEnabled() ? this._arcball.disable() : this._arcball.enable();
    },
    draw : function(){
        var ctx  = this.getContext();
        var draw = this._draw;

        if(!this._arcball.isEnabled()){
            this._camera.lookAt(DEFAULT_EYE,DEFAULT_TARGET,[0,1,0]);
            this._camera.updateViewMatrix();
        }
        else{
            this._arcball.apply();
        }

        ctx.clear(ctx.COLOR_BIT | ctx.DEPTH_BIT);

        ctx.setViewMatrix(this._camera.getViewMatrix());
        draw.drawPivotAxes();
        draw.drawCubeColored();

        draw.drawArcball(this._arcball,true);
    }
});
