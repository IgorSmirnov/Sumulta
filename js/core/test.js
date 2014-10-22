'use strict';
function TestContext()
{


}

function TestCanvas()
{
	var ctx2d = new TestContext();
	//this.listeners = {};
	this.getContext = function(name)
	{
		chai.expect(name).to.equal('2d');
		return ctx2d;
	}
	this.addEventListener = function(name, func)
	{
		this[name] = func;
	}
	this.getBoundingClientRect = function()
	{
		return {top: 0, left: 0};
	}
}

var canvas = new TestCanvas();
var fast = new TestCanvas();

describe('Core', function(){
	describe('View', function(){
    		it('expected initial state', function(){
			var view = new View(canvas, fast);
			chai.expect(view.scale).to.equal(1.0);
			chai.expect(view.offsetX).to.equal(0.0);
			chai.expect(view.offsetY).to.equal(0.0);
    		});
  	});
  	describe('Controller', function()
  	{
		var view = new View(canvas, fast);
		var win = {};
  		var ctl = new Controller(view, win);
  		it('expected initial state', function(){
  			var error;
  			try {
  				ctl.pop();
  				error = false;
  			} catch(e){ chai.expect(e).to.be.a('object'); error = true;}
  			chai.expect(error).to.ok;
  		});
  		it('mouse button down', function(){
  			var mx = null, my = null;
  			ctl.go({leftdown: function(x, y){mx = x; my = y}});
  			fast.onmousedown({pageX: 200, pageY: 300, button: 0});
    		chai.expect(mx).to.equal(200); 			
    		chai.expect(my).to.equal(300);
  		});
  	});
  	describe('Editor', function()
  	{

  	});
});
