var allTimeEvent = new Array();   //保留当前操作的事件数组
var canvas;                      //定义一个画板对象
var context;                     //定义一个画画板对象的工具
var allDataImage = new Array();   //所有图像数据对象，用于撤销和返回
var index = 0;                       //allDataImage的下标
var iosocket;
var mycanvas;
$(document).ready(function()
{	
	canvas = document.getElementById("mycanvas"); // 当前canvas属性
	context = canvas.getContext("2d");     //当前canvas的上下文对象
	mycanvas = new MyCanvas();
	
	var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
	allDataImage.push(drawingSurfaceData);	
	
	//同步的代码
	iosocket = io.connect();
    iosocket.on('connect', function () {
		alert("连接成功");
 		iosocket.on('message', function(message) {
			//接收数据的处理代码
				var alldata = eval(message);
				if(alldata[0].opId == "canvas")
				{
					mycanvas.drawEvery(alldata[0]);
				}
          });
        iosocket.on('disconnect', function() {
			
          });
	});
 
	
	//点击粉笔
	$("#fenbi").click(function()
	{		
		mycanvas.drawLine();
		$("#mycanvas").css("cursor","crosshair");
	});
	//点击直线
	$("#zhixian").click(function()
	{
		mycanvas.drawLine1();
	});
	
	//点击保存之后的事件
	
	$("#save").click(function(){
		var image = new Image();
		var dataURL = canvas.toDataURL("image/png");
		dataURL = dataURL.replace("image/png", "image/octet-stream");
		document.location.href = dataURL;
	})
	
	//点击撤销之后的事件
	$("#restore").click(function(){
		var length = allDataImage.length;
		if(length>=index )
		{
			context.putImageData(allDataImage[length-index-2],0,0);
			index++;
		}
	});
	//点击恢复之后的事情
	$("#back").click(function(){
		var length = allDataImage.length;
		if(length>=index )
		{
			context.putImageData(allDataImage[length-index],0,0);
			index--;
		}
	});
	
	//点击矩形事件
	$("#juxing").click(function(e){
		 var myleft = e.clientX+10;
		 var mytop = e.clientY+10;
		
		 if($("#showRect").css("display") == "none")
		 {
			  
			  $("#showRect").css({left:myleft,top:mytop}).fadeIn(100);
		 }
		else
		{
			$("#showRect").fadeOut(100);	
		}
//		mycanvas.drawRectangle(2);
	});
	
	
	//点击空心矩形事件
		$("#kongjuxing").click(function(){
			mycanvas.drawRectangle(1);
			$("#showRect").fadeOut(100);
		});
	
	//点击实心矩形事件
	$("#shijuxing").click(function(){
			mycanvas.drawRectangle(2);
			$("#showRect").fadeOut(100);
		});
	
	//点击圆形事件
	$("#yuanxing").click(function(e){
			var myleft = e.clientX+10;
			var mytop = e.clientY+10;
		
		 	if($("#showRect1").css("display") == "none")
		 	{
			  $("#showRect1").css({left:myleft,top:mytop}).fadeIn(100);
		 	}
			else
			{
				$("#showRect1").fadeOut(100);	
			}
			//mycanvas.CdrawArc(2);
		});
	
	
	//点击空心矩形事件
	$("#kongyuan").click(function(){
		mycanvas.CdrawArc(1);
		$("#showRect1").fadeOut(100);	
		});
	
	//点击实心矩形事件
	$("#shiyuan").click(function(){
			mycanvas.CdrawArc(2);
			$("#showRect1").fadeOut(100);	
		});
		
	//点击三角形事件
	$("#sanjiaoxing").click(function(){
		mycanvas.CdrawTriangle();
		});
	
	//点击曲线之后的事情
	$("#quxian").click(function(){
			mycanvas.drawCurve();
		});
	
	//点击字体
	$("#wenzi").click(function()
	{
		var font_family = $("#font_family").val();
		var font_size = $("#font_size").val()+"px";
		var myfont = font_size+" "+font_family;
		$("textarea").css("font",myfont);
		$("#Drigging").css("display","block");
	});
						
						
	//选择颜色
	$("#color").blur(function()
	{
		mycanvas.selectColor();
	});
	
	//点击橡皮擦的操作
	
	$("#xiangpica").click(function(e){
		 var myleft = e.clientX+10;
		 var mytop = e.clientY+10;
		
		 if($("#showInfo").css("display") == "none")
		 {
			  
			  $("#showInfo").css({left:myleft,top:mytop}).fadeIn(100);
		 }
		else
		{
			$("#showInfo").fadeOut(100);	
		}
		mycanvas.eraser();
	});
	
						
	//点击可拖动文本框的操作
	var isDrag = false;  //是否处于可拖动状态
	var offsetX=0;
    var offsetY=0;
	
	//当鼠标focus在textarea中的时候，清空里面的内容				
	$("#myText").focus(function()
	{
		$('#myText').val("");
	});
						
	//点击可拖动文本框的时候，获取文本框此时相对于父元素的内标签位置，并设置该div的cursor为可移动的
	$("#Drigging").mousedown(function(){
		isDrag = true;
		offsetX = event.offsetX;
        offsetY = event.offsetY;
		$(this).css('cursor','move');
	});
							
	$("#Drigging").mouseup(function(){
		isDrag = false;
	});
	//监控整个网页文档是否处于移动状态
	$(document).mousemove(function(e){
        if(!isDrag)
           return;
        var x = event.clientX-offsetX;
        var y = event.clientY-offsetY;
        $("#Drigging").css("left", x);
        $("#Drigging").css("top", y);
    });
               
	//以下代码是监控回车事件
	$('#myText').keypress(function(e){ 
		if (e.shiftKey && e.which==13 || e.which == 10) { //在ie6中 enter键码为10 在ff中 enter键码是13
			var x = $("#Drigging").css("left");  //获取可拖动文本框的距离左边框的距离
			x = parseInt(x)-canvas.offsetLeft+5;   //跟画板的距离差
			var y =$("#Drigging").css("top");    
			y=parseInt(y)-canvas.offsetTop+18;
									
			//得到字体和字号大小
			var font_family = $("#font_family").val();
			var font_size = $("#font_size").val()+"px";
			var myfont = font_size+" "+font_family;
			//设置字体
			context.font=myfont;
			//设置颜色
			context.fillStyle="#"+$("#color").val();
									
            context.fillText($(this).val(), x, y); 
			//保存当前所有数据
			var drawingSurfaceData = context.getImageData(0,0,canvas.width,canvas.height);
			allDataImage.push(drawingSurfaceData);
			
			$("#Drigging").css("display","none"); //隐藏文本框
       		}          
	});
});