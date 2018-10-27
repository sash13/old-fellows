function Object() {
  this.x = 0;
  this.y = 0;
  this.w = 1;
  this.h = 1;
  this.imageObj = new Image();
}

function Text() {
  this.x = 0;
  this.y = 0;
  this.w = 1;
  this.h = 1;
  this.lines = 0;
  this.maxWidth = 500;
  this.lineHeight = 45;
  this.text ="";
  this.font = "30pt Calibri";
  this.fillStyle ="white";
  this.strokeStyle ="black";
  this.lineWidth =3;
}

Text.prototype = {
  draw: function(context) {
      context.font = this.font;
      context.fillStyle = this.fillStyle;
      wrapText(context, this.text, this.x, this.y, this.maxWidth, this.lineHeight,this,0);
      //context.lineWidth = this.lineWidth;
      //context.strokeStyle = this.strokeStyle;
      wrapText(context, this.text, this.x, this.y, this.maxWidth, this.lineHeight,this,1);
      
      //context.lineWidth = this.lineWidth;
      //context.strokeStyle = this.strokeStyle;
      //context.strokeRect(this.x,this.y,this.w,this.h);
  },
    update: function() {
    this.text =document.getElementById('text').value;
  },
    del: function() {
        //texts.splice(this.id);
        //this.id=null;
        var l = texts.length;
  		for (var i = l-1; i >= 0; i--) {
            if(this == texts[i]) {
                //delete texts[i];
                texts.splice(i);
                break;
            }
        }
    }
}
    
Object.prototype = {
  // we used to have a solo draw function
  // but now each box is responsible for its own drawing
  // mainDraw() will call this with the normal canvas
  // myDown will call this with the ghost canvas with 'black'
  draw: function(context, optionalColor) {
      if (context === gctx) {
        context.fillStyle = 'black'; // always want black for the ghost canvas
      } else {
        context.fillStyle = this.fill;
      }
      
      // We can skip the drawing of elements that have moved off the screen:
      if (this.x > WIDTH || this.y > HEIGHT) return; 
      if (this.x + this.w < 0 || this.y + this.h < 0) return;
      
      //context.fillRect(this.x,this.y,this.w,this.h);
      context.drawImage(this.imageObj,this.x,this.y,this.w,this.h);
      
    // draw selection
    // this is a stroke along the box and also 8 new selection handles
    if (mySel === this) {
      context.strokeStyle = mySelColor;
      context.lineWidth = mySelWidth;
      context.strokeRect(this.x,this.y,this.w,this.h);
      
      // draw the boxes
      
      var half = mySelBoxSize / 2;
      
      // 0  1  2
      // 3     4
      // 5  6  7
      
      // top left, middle, right
      selectionHandles[0].x = this.x-half;
      selectionHandles[0].y = this.y-half;
      
      selectionHandles[1].x = this.x+this.w-half;
      selectionHandles[1].y = this.y-half;
      
      selectionHandles[2].x = this.x-half;
      selectionHandles[2].y = this.y+this.h-half;
      
      selectionHandles[3].x = this.x+this.w-half;
      selectionHandles[3].y = this.y+this.h-half;

      
      context.fillStyle = mySelBoxColor;
      for (var i = 0; i < 4; i ++) {
        var cur = selectionHandles[i];
        context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
      }
    }
    
  },
    // end draw
    del: function() {
        var l = objects.length;
  		for (var i = l-1; i >= 0; i--) {
            if(this == objects[i]) {
                objects.splice(i);
                mySel=null;
                break;
            }
        }
    }
}
    
function addObj(x, y, w, h, src) {
  var rect = new Object;
  rect.x = x;
  rect.y = y;
  rect.w = w
  rect.h = h;
  rect.imageObj.src = src;
  objects.push(rect);
  invalidate();
}

function addText(x, y, maxWidth, lineHeight, text, font, fillStyle, strokeStyle, lineWidth) {
  text = document.getElementById('text').value;
    if(text==""){ return; }
  maxWidth = 500;
  lineHeight = 45;
  font = "30pt Calibri";
  fillStyle ="white";
  strokeStyle ="black";
  lineWidth =3;
    x=200;
    y=200;
    //alert(text);
  var text_obj = new Text;
  text_obj.x = x;
  text_obj.y = y;

  text_obj.maxWidth = maxWidth;
  text_obj.lineHeight = lineHeight;
  text_obj.text =text;
  text_obj.font = font;
  text_obj.fillStyle =fillStyle;
  text_obj.strokeStyle =strokeStyle;
  text_obj.lineWidth =lineWidth;

  texts.push(text_obj);
  
    
  document.getElementById('text').value = "";
  invalidate();
}


var objects = []; 
var texts = []; 
var selectionHandles = [];
var indexText =1;
var indexObject =1;

var canvas;
var ctx;

var bg;
var bgCtx;
var tool_select;
  

var stripColor = '#efaa71';
var bgColorIn = '#d05d02';

var WIDTH;
var HEIGHT;

var INTERVAL = 20;  // how often, in milliseconds, we check to see if a redraw is needed
var CENTREx = 300;
var CENTREy = 0;
var LENGHT = 800;

var isDrag = false;
var isText = false;
var isResizeDrag = false;
var expectResize = -1;
var mx, my; // mouse coordinates


var mySel; 
var mySelText; 
// The selection color and width. Right now we have a red selection with a small width
var mySelColor = '#CC0000';
var mySelWidth = 2;
var mySelBoxColor = 'darkred'; // New for selection boxes
var mySelBoxSize = 6;

 // when set to true, the canvas will redraw everything
 // invalidate() just sets this to false right now
 // we want to call invalidate() whenever we make a change
var canvasValid = false;
var obj_default = 'line';

var textBox = '';
// we use a fake canvas to draw individual shapes for selection testing
var ghostcanvas;
var gctx; // fake canvas context

// since we can drag from anywhere in a node
// instead of just its x/y corner, we need to save
// the offset of the mouse when we start dragging.
var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;


// initialize our canvas, add a ghost canvas, set draw loop
// then add everything we want to intially exist on the canvas
function init() {
    
    
  obj_select = document.getElementById('sel_obj_color');
  obj_select.value = obj_default;
  
  textBox = document.getElementById('text');
    
   
  var dragZone = document.querySelector('#drag-zone');
  var dropZone = document.querySelector('#container');
  
  
    
  dragZone.addEventListener('dragstart', function(event) {
     if (event.target.className) { // img case
         event.dataTransfer.effectAllowed = event.target.className;;
     }
      return true;
      }, true);
     dragZone.addEventListener('dragend', function(event) {
        if (event.target.className) { // img case
         }
                return true;
              }, true);
   dropZone.addEventListener('dragenter', function(event) {
                if (event.preventDefault) event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
                this.className = 'hovering';
                return false;
              }, false);
    dropZone.addEventListener('dragover', function(event) {
                if (event.preventDefault) event.preventDefault(); // allows us to drop
                event.dataTransfer.dropEffect = 'copy';
                return false;
              }, false);
    dropZone.addEventListener('dragleave', function(event) {
                if (event.preventDefault) event.preventDefault(); // allows us to drop
                this.className = '';
                return false;
              }, false);
    dropZone.addEventListener('drop', function(event) {
                if (event.preventDefault) event.preventDefault();
                var imgPassed = null;
                var types = event.dataTransfer.types;
                for (var i = 0; i < types.length; i++) {
                  if (types[i] == 'text/uri-list') {
                    imgPassed = event.dataTransfer.getData('text/uri-list');
                      
                  }
                }
        if(imgPassed) {
            addObj(0, 0, 220, 220, imgPassed);
        }
                return false;
    }, false);
    
  bg = document.getElementById('canvas');
  HEIGHT = bg.height;
  WIDTH = bg.width;
  bgCtx = bg.getContext('2d');
    
  canvas = document.getElementById('canvas');
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT;
  ghostcanvas.width = WIDTH;
  gctx = ghostcanvas.getContext('2d');
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () { return false; }
  
  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 5)      || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 5)       || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 5)  || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 5)   || 0;
  }
  
  // make draw() fire every INTERVAL milliseconds
  setInterval(draw, INTERVAL);
  
  // set our events. Up and down are for dragging,
  // double click is for making new boxes
  canvas.onmousedown = myDown;
  canvas.onmouseup = myUp;
  canvas.ondblclick = myDblClick;
  
  // add custom initialization here:
   for (var i = 0; i < 4; i ++) {
    var rect = new Object;
    selectionHandles.push(rect);
  }
    //addObj(69, 50, 200, 137, "http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg");
    //addObj(350, 55, 93, 104, "http://www.html5canvastutorials.com/demos/assets/yoda.jpg");
    
    //function addText(x, y, maxWidth, lineHeight, text, font, fillStyle, strokeStyle, lineWidth) {
   //addText(69, 50, 500, 45, "test", "30pt Calibri", "white", "black", 5);
    //addText(200, 200, 100, 45, "Тестики тестики", "30pt Calibri", "white", "black", 4);
}

//wipes the canvas context
function clear(c) {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw_fon() {
        bgCtx.beginPath();
        bgCtx.rect(0, 0, WIDTH, HEIGHT);
        // create radial gradient
        var grd = bgCtx.createRadialGradient(CENTREx, CENTREy, 20, CENTREx, CENTREy, LENGHT);

        grd.addColorStop(0, bgColorIn);

        //grd.addColorStop(1, "#fdac39");
    	grd.addColorStop(1, stripColor);
        bgCtx.fillStyle = grd;
        //bgCtx.fillStyle = '#d6690c';
        bgCtx.fill();
}
function draw_bg() {
        // set line width for all lines
        bgCtx.lineWidth = 0;
        var n =0
        var rad;
	while (n <= 360) {
        rad = Math.PI/180;
        bgCtx.beginPath();
        bgCtx.moveTo(CENTREx+LENGHT*Math.cos((n+6)*rad), CENTREy+LENGHT*Math.sin((n+6)*rad));
        bgCtx.lineTo(CENTREx, CENTREy);
        bgCtx.lineTo(CENTREx+LENGHT*Math.cos((n+14)*rad), CENTREy+LENGHT*Math.sin((n+14)*rad));
        bgCtx.lineJoin = "miter";
        bgCtx.closePath();
        bgCtx.fillStyle = stripColor;
        bgCtx.fill();
        //bgCtx.strokeStyle = stripColor;
		//bgCtx.stroke();

        
        n+=20
      }   
}
// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
function draw() {
  //if (canvasValid == false) {
    clear(ctx);
    
    // Add stuff you want drawn in the background all the time here
     ctx.strokeStyle = "";
      ctx.lineWidth = "";
    // draw all boxes
        draw_fon();
 		draw_bg();
   var l = objects.length;
    for (var i = 0; i < l; i++) {
        objects[i].draw(ctx);
    }
    
    
   if (mySel != null) {
      ctx.strokeStyle = mySelColor;
      ctx.lineWidth = mySelWidth;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }
    var l = texts.length;
    for (var i = 0; i < l; i++) {
        texts[i].draw(ctx);
    }

    
   // canvasValid = true;
 // }
}

// Draws a single shape to a single context
// draw() will call this with the normal canvas
// myDown will call this with the ghost canvas
function drawshape(context, shape) {
  
  // We can skip the drawing of elements that have moved off the screen:
  if (shape.x > WIDTH || shape.y > HEIGHT) return; 
  if (shape.x + shape.w < 0 || shape.y + shape.h < 0) return;
  
  context.fillRect(shape.x,shape.y,shape.w,shape.h);
}

function drawimage(context, shape) {
  
  // We can skip the drawing of elements that have moved off the screen:
  //if (shape.x > WIDTH || shape.y > HEIGHT) return; 
  //if (shape.x + shape.w < 0 || shape.y + shape.h < 0) return;
  
  context.drawImage(shape.imageObj,shape.x,shape.y,shape.w,shape.h);
}

// Happens when the mouse is moving inside the canvas
function myMove(e){
  if (isDrag || isText) {
    getMouse(e);
    
    mySel.x = mx - offsetx;
    mySel.y = my - offsety;   
    
    // something is changing position so we better invalidate the canvas!
    invalidate();
  } else if (isResizeDrag) {
    // time ro resize!
    var oldx = mySel.x;
    var oldy = mySel.y;
    
    // 0  1  2
    // 3     4
    // 5  6  7
    switch (expectResize) {
      case 0:
        mySel.x = mx;
        mySel.y = my;
        mySel.w += oldx - mx;
        mySel.h += oldy - my;
        break;
      case 1:
        mySel.y = my;
        mySel.w = mx - oldx;
        mySel.h += oldy - my;
        break;
      case 2:
        mySel.x = mx;
        mySel.w += oldx - mx;
        mySel.h = my - oldy;
        break;
      case 3:
        mySel.w = mx - oldx;
        mySel.h = my - oldy;
        break;
    }
    
    invalidate();
  }
  
  getMouse(e);
  // if there's a selection see if we grabbed one of the selection handles
  if (mySel !== null && !isResizeDrag) {
    for (var i = 0; i < 4; i++) {
      // 0  1  2
      // 3     4
      // 5  6  7
      
      var cur = selectionHandles[i];
      
      // we dont need to use the ghost context because
      // selection handles will always be rectangles
      if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
          my >= cur.y && my <= cur.y + mySelBoxSize) {
        // we found one!
        expectResize = i;
        invalidate();
        
        switch (i) {
          case 0:
            this.style.cursor='nw-resize';
            break;
          case 1:
            this.style.cursor='ne-resize';
            break;
          case 2:
            this.style.cursor='sw-resize';
            break;
          case 3:
            this.style.cursor='se-resize';
            break;
        }
        return;
      }
      
    }
    // not over a selection box, return to normal
    isResizeDrag = false;
    expectResize = -1;
    this.style.cursor='auto';
  }
  
}
  
    
    

function myMoveBg(e){
  if (isDrag){
    getMouse(e);
    
    CENTREx = mx - offsetx;
    CENTREy = my - offsety;   
    
    // something is changing position so we better invalidate the canvas!
    invalidate();
  }
}

function myMoveText(e){
  if (isDrag){
    getMouse(e);
    
    mySelText.x = mx - offsetx;
    mySelText.y = my - offsety;   
    
    // something is changing position so we better invalidate the canvas!
    invalidate();
  }
}

// Happens when the mouse is clicked in the canvas
function myDown(e){
  getMouse(e);
    
  //we are over a selection box
  if (expectResize !== -1) {
    isResizeDrag = true;
    return;
  }
    
  clear(gctx);
 
    
 var l = objects.length;
  for (var i = l-1; i >= 0; i--) {
    // draw shape onto ghost context
    drawshape(gctx, objects[i]);
    
    // get image data at the mouse x,y pixel
    var imageData = gctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      mySel = objects[i];
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;
      canvas.onmousemove = myMove;
      invalidate();
            textBox.value = '';
      clear(gctx);
      return;
    } 
    
  }

    
      var l = texts.length;
  for (var i = l-1; i >= 0; i--) {
      mySelText = texts[i];
    if (mx>mySelText.x && mx <(mySelText.x+mySelText.w)) {
        if ((my>mySelText.y && my <(mySelText.y+mySelText.h)) || (my>mySelText.y+mySelText.h && my <mySelText.y))  {
      //mySelText = texts[i];
      offsetx = mx - mySelText.x;
      offsety = my - mySelText.y;
      mySelText.x = mx - offsetx;
      mySelText.y = my - offsety;
      isDrag = true;
      isText = true;
       mySel = null;
      canvas.onmousemove = myMoveText;
      invalidate();
      clear(gctx);
      textBox.value = mySelText.text;
      return;
        }
    } 
    
  } 
    
    
  var imageData = gctx.getImageData(mx, my, 1, 1);
  if (imageData.data[3] == 0)  {
      offsetx = mx - CENTREx;
      offsety = my - CENTREy;
      CENTREx = mx - offsetx;
      CENTREy = my - offsety;
      isDrag = true;
      canvas.onmousemove = myMoveBg;
      invalidate();
      clear(gctx); 
      mySel = null;
      mySelText =null;
      textBox.value = '';
      return;
    }
    
  // havent returned means we have selected nothing
  mySel = null;
  mySelText =null;
  // clear the ghost canvas for next time
  clear(gctx);
  // invalidate because we might need the selection border to disappear
  invalidate();
}

function myUp(){
  isDrag = false;
  //canvas.onmousemove = null;
  isResizeDrag = false;
  isText = false;
  expectResize = -1;
}

// adds a new node
function myDblClick(e) {
  getMouse(e);
  // for this method width and height determine the starting X and Y, too.
  // so I left them as vars in case someone wanted to make them args for something and copy this code

}

function invalidate() {
  canvasValid = false;
}

// Sets mx,my to the mouse position relative to the canvas
// unfortunately this can be tricky, we have to worry about padding and borders
function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY
}


function wrapText(context, text, x, y, maxWidth, lineHeight,tc, fill) {
        var words = text.split(" ");
        var line = "";
		var wii = 0;
    	var lines_my = 0;
    	//var lines =0;
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + " ";
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if(testWidth > maxWidth) {
              tc.lines += 1;
            if(fill){
            	context.fillText(line, x, y);
            } else {
                context.lineWidth = tc.lineWidth;
      			context.strokeStyle = tc.strokeStyle;
            	context.strokeText(line, x, y);
            }
            line = words[n] + " ";
            wii =context.measureText(line).width;
            if(tc.w< wii) {
            	tc.w = wii;
          	}
            y += lineHeight;
            lines_my +=1
            //alert(y);
            tc.lines=lines_my;
            tc.h =lines_my*lineHeight;
          }
          else {
            line = testLine;
            tc.lines=1;
            tc.h =-lineHeight;
          }
        }
        if(fill){
        	context.fillText(line, x, y);
        } else {
            context.lineWidth = tc.lineWidth;
      		context.strokeStyle = tc.strokeStyle;
            context.strokeText(line, x, y);
        }
        tc.w = context.measureText(line).width;
    	
		
}


var saveImage = document.createElement("button");
saveImage.innerHTML = "Save Image";
saveImage.addEventListener("click", function (evt) {
    window.open(canvas.toDataURL("image/png"));
}, false);
document.getElementById("button").appendChild(saveImage);


ColorPicker(document.getElementById('slide2'),
                        document.getElementById('picker2'),
                        function(hex, hsv, rgb) { 
                            switch (obj_select.value) {
                                    case 'line':stripColor = hex; break;
                                    case 'bg':bgColorIn = hex; break;
                                    default: break;
                            }
 });
// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();