var buttons= ["cache_up", 'cache_down', 'rotate_right', 'rotate_left',
		'rice_down', 'rice_up', 'truck_left', 'truck_right',
		'bridge_left', 'bridge_right'];
//var hard_buttons = [];

function ajaxSendPOST(xmlpage,data,callback)
{ 
	var xmlh = null;
	if(window.XMLHttpRequest)
		xmlh = new XMLHttpRequest();
	else
	try
	{ 
		xmlh = new ActiveXObject('Msxml2.XMLHTTP'); 
	}
	catch(ex) 
	{ 
		xmlh = new ActiveXObject('Microsoft.XMLHTTP'); 
	}
	if(xmlh)
	{
		xmlh.open('GET', xmlpage, true);
		xmlh.onreadystatechange = function(x) { if(xmlh.readyState==4) callback(xmlh.responseText); }
		//xmlh.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlh.send(data);
	}
}

function OnButtonDown (button) 
{
	console.log(button.id, 'down');
	document.getElementById("debug").innerHTML =  button.id + ' down';
    button.style.background = "#00ff00";

    url = './post.html?' + button.id + '=0';
    ajaxSendPOST(url,'', false);

}
function OnButtonUp (button) 
{
	console.log(button.id, 'up');
	document.getElementById("debug").innerHTML =  button.id + ' up';
    button.style.background = "#FFFFFF";
    url = './post.html?' + button.id + '=1';
    ajaxSendPOST(url,'', false);
}

function init () 
{
	var hard_buttons = document.getElementsByClassName('box');
	for (var i=0; i<hard_buttons.length; i++)
	{
		if (hard_buttons[i].addEventListener) 
		{ 
			hard_buttons[i].addEventListener ("touchstart", function () {OnButtonDown (this)}, false);
        	hard_buttons[i].addEventListener ("mousedown", function () {OnButtonDown (this)}, false);
        	hard_buttons[i].addEventListener ("touchend", function () {OnButtonUp (this)}, false);
        	hard_buttons[i].addEventListener ("mouseup", function () {OnButtonUp (this)}, false);
    	}
    	else 
    	{
        	if (hard_buttons[i].attachEvent) 
        	{
            	hard_buttons[i].attachEvent ("onmousedown", function () {OnButtonDown (hard_buttons[i])});
            	hard_buttons[i].attachEvent ("onmouseup", function () {OnButtonUp (hard_buttons[i])});
        	}
    	}
	}
}