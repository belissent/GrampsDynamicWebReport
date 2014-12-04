// Gramps - a GTK+/GNOME based genealogy program
//
// Copyright (C) 2014 Pierre Bélissent
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA


// Get current path
var scriptEls = document.getElementsByTagName("script");
var thisScriptEl = scriptEls[scriptEls.length - 1];
var scriptPath = thisScriptEl.src;
var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf('/'));
var toRoot = scriptFolder.substr(0, scriptFolder.lastIndexOf('/') + 1);
scriptFolder += "/";

// Load jQuery
loadjsfile(scriptFolder + "jquery.min.js");
loadjsfile(scriptFolder + "jquery.sizes.js");
loadjsfile(scriptFolder + "jquery.mousewheel.min.js");

// Load Raphael
loadjsfile(scriptFolder + "raphael-min.js");

// Load styles
loadcssfile(scriptFolder + "styles.css");

// Load tree scripts
loadjsfile(scriptFolder + "arbre_pgm.js");
loadjsfile(scriptFolder + "arbre_svg.js");
loadjsfile("index_nb.js");

// Load language file
loadjsfile("all_conf.js");

// Load specific scripts
loadjsfile(scriptFolder + "body.js");



//============================================ browser specific

var ua = navigator.userAgent.toLowerCase();
var brsDom = (document.getElementById) ? true : false;
var brsNet = (ua.indexOf('mozilla') != -1 && ua.indexOf('compatible') == -1);
var brsMie = (ua.indexOf('msie') != -1);
var brsNet4 = (brsNet && !brsDom && document.layers);
var brsMie4 = (brsMie && !brsDom && document.all);

function getYear(date)
{
	var y=date.getYear();
	if (brsNet) y += 1900;
	if (brsMie && y<100) y = parseInt("19" + y);
	return(y);
}


//============================================

//var finished = false;

function loadjsfile(filename)
{
/*
	var fileref = document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", filename);
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref);
*/
	document.write("<script language='javascript' src='" + filename + "' charset='UTF-8'></script>");
/*
	finished = false;
	$.getScript(filename, function(data, textStatus, jqxhr)
	{
		finished = true;
	});
	while(!finished);
*/
}

function loadcssfile(filename)
{
	var fileref = document.createElement("link");
	fileref.setAttribute("rel", "stylesheet");
	fileref.setAttribute("type", "text/css");
	fileref.setAttribute("href", filename);
	if (typeof fileref!="undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref);
}



//============================================ Cookies

var CookieExp = new Date(); 
CookieExp.setTime(CookieExp.getTime() + (1000*24*60*60*1000));

function LitCookie(name)
{
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen)
	{
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
		{
			var k = document.cookie.indexOf (";", j);
			if (k == -1)
			{
				k = clen;
			}
			return unescape(document.cookie.substring(j, k));
		}
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0) break;
	}
	return null;
}

function EcritCookie(name, value)
{
	var argv = EcritCookie.arguments;
	var argc = EcritCookie.arguments.length;
	var expires = (argc > 2) ? argv[2] : null;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	document.cookie = name + "=" + escape (value) +
	((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
	((path == null) ? "" : ("; path=" + path)) +
	((domain == null) ? "" : ("; domain=" + domain)) +
	((secure == true) ? "; secure" : "");
}

function EffaceCookie(name)
{
	var exp = new Date();
	exp.setTime (exp.getTime() - 1);
	var cval = GetCookie(name);
	document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}


//============================================ addresses encrypting

function crypteAddress(_message)
{
	var key = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1029384756><#].";
	var wTG;
	var mcH =  key.length / 2;
	var _newString = "";
	var dv;
	for (var x = 0; x < _message.length; x++)
	{
		wTG = key.indexOf(_message.charAt(x));
		if (wTG > mcH)
		{
			dv = wTG - mcH;
			_newString += key.charAt(33 - dv);
		}
		else
		{
			if (key.indexOf(_message.charAt(x)) < 0)
			{
				_newString += _message.charAt(x);
			}
			else
			{
				dv = mcH - wTG;
				_newString += key.charAt(33 + dv);
			}
		}
	}
	return (_newString);
}


//============================================ Colors

// Colors are arrays of 3 floats (red, green, blue) from 0 to 255.
// HSV colors are arrays of 3 floats (hue [0-255], saturation [0-255], luminosity [0-255]).

function string2rgb(s)
{
	var x = parseInt(s, 16);
	var col = [];
	col[0] = (x & 0xFF0000) >> 16;
	col[1] = (x & 0xFF00) >> 8;
	col[2] = x & 0xFF;
	return(col);
}

function rgb2string(col)
{
	var s = "";
	s = parseInt(Math.round(col[2])).toString(16) + s;
 	if (s.length == 1) s = "0" + s;
	s = parseInt(Math.round(col[1])).toString(16) + s;
 	if (s.length == 3) s = "0" + s;
	s = parseInt(Math.round(col[0])).toString(16) + s;
 	if (s.length == 5) s = "0" + s;
	return("#" + s.toUpperCase());
}

function RGBtoHSV(rgb)
{
	var hsv = [];
	var min = Math.min(rgb[0], Math.min(rgb[1], rgb[2]));
	var max = Math.max(rgb[0], Math.max(rgb[1], rgb[2]));
	hsv[2] = max;
	var delta = max - min;
	if (delta != 0)
		hsv[1] = 255.0 * delta / max;
	else
	{
		//s = 0, h is undefined
		hsv[0] = 0;
		hsv[1] = 0;
		return(hsv);
	}
	if (rgb[0] == max)
		hsv[0] = (rgb[1] - rgb[2]) / delta;		// between yellow & magenta
	else if (rgb[1] == max)
		hsv[0] = 2 + (rgb[2] - rgb[0]) / delta;	// between cyan & yellow
	else
		hsv[0] = 4 + (rgb[0] - rgb[1]) / delta;	// between magenta & cyan
	hsv[0] *= 255.0 / 6;
	if (hsv[0] < 0) hsv[0] += 255;
	return(hsv);
}

function HSVtoRGB(hsv)
{
	var rgb = [];
	hsv[1] /= 255.0;
	hsv[0] /= 255.01 / 6;			// sector 0 to 5
	var i = Math.floor(hsv[0]);
	var f = hsv[0] - i;			// factorial part of h
	var p = hsv[2] * (1 - hsv[1]);
	var q = hsv[2] * (1 - hsv[1] * f);
	var t = hsv[2] * (1 - hsv[1] * (1 - f));
	var j0 = Math.floor((hsv[0] + 1) / 2) % 3;
	var j1 = Math.floor(hsv[0] / 2 + 2) % 3;
	var j2 = 2 - (i + 1) % 3;
	rgb[j0] = hsv[2];
	rgb[j1] = p;
	rgb[j2] = (i % 2) ? q : t;
	return(rgb);
}

function HSVWtoRGB(hsv)
{
	var Y = [0.213, 0.715, 0.072];
	var rgb = [];
	hsv[1] /= 255.0;
	hsv[0] /= 255.01 / 6;			// sector 0 to 5
	var i = Math.floor(hsv[0]);
	var f = hsv[0] - i;			// factorial part of h
	var p = hsv[2] * (1 - hsv[1]);
	var q = hsv[2] * (1 - hsv[1] * f);
	var t = hsv[2] * (1 - hsv[1] * (1 - f));
	var j0 = Math.floor((hsv[0] + 1) / 2) % 3;
	var j1 = Math.floor(hsv[0] / 2 + 2) % 3;
	var j2 = 2 - (i + 1) % 3;
	rgb[j0] = hsv[2];
	rgb[j1] = p;
	rgb[j2] = (i % 2) ? q : t;
	if (hsv[2] == 0) return(rgb);
	var h;
	h = Math.min(255 / rgb[j0], hsv[2] / (Y[0] * rgb[0] + Y[1] * rgb[1] + Y[2] * rgb[2]));
	rgb[0] *= h;
	rgb[1] *= h;
	rgb[2] *= h;
	h = Y[0] * (255 - rgb[0]) + Y[1] * (255 - rgb[1]) + Y[2] * (255 - rgb[2]);
	if (h == 0) return(rgb);
	h = (hsv[2] - (Y[0] * rgb[0] + Y[1] * rgb[1] + Y[2] * rgb[2])) / h;
	rgb[0] += (255 - rgb[0]) * h;
	rgb[1] += (255 - rgb[1]) * h;
	rgb[2] += (255 - rgb[2]) * h;
	return(rgb);
}


//============================================ tableaux

function cmp(a, b)
{
	if (a < b) return(-1);
	if (a > b) return(1);
	return 0;
}


//============================================ tableaux

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function (obj, fromIndex)
	{
		if (fromIndex == null)
		{
			fromIndex = 0;
		}
		else if (fromIndex < 0)
		{
			fromIndex = Math.max(0, this.length + fromIndex);
		}
		for (var i = fromIndex, j = this.length; i < j; i++)
		{
			if (this[i] === obj)
			return i;
		}
		return -1;
	};
}

function arrayCopy(a)
{
	if (typeof(a) == "object" && a != null)
	{
		var b=new Array(), i;
		for (i=0; i<a.length; i++) b[i] = arrayCopy(a[i]);
		return(b);
	}
	return(a);
}

function shuttlesort(from, to, low, high)
{
	if (high - low < 2) return;

	var middle = Math.floor((low + high)/2);
	shuttlesort(to, from, low, middle);
	shuttlesort(to, from, middle, high);
	var p = low;
	var q = middle;
	var i;

	if (high - low >= 4 && compare(from[middle-1], from[middle]) <= 0)
	{
		for (i = low; i < high; i++)
		{
			to[i] = from[i];
		}
		return;
	}

	for (i = low; i < high; i++)
	{
		if (q >= high || (p < middle && compare(from[p], from[q]) <= 0))
		{
			to[i] = from[p++];
		}
		else
		{
			to[i] = from[q++];
		}
	}
}

function invertMatrix(D)
{
	var n = D.length;
	var alpha, beta;
	var i, ii, j, k;
	var R = [];
	var avail = [];

	// init the reduction matrix
	for (i=0; i<n; i++)
	{
		R[i] = [];
		for (j=0; j<n; j++)
		{
			R[i][j] = 0.0;
		}
		R[i][i] = 1.0;
		avail[i] = true;
	}

	// perform the reductions
	for (i=0; i<n; i++)
	{
		alpha = 0.0;
		for (k=0; k<n; k++)
		{
			if (Math.abs(D[k][k]) > Math.abs(alpha) && avail[k])
			{
				alpha = D[k][k];
				ii = k;
			}
		}
		if (alpha == 0.0)
		{
			// error - singular matrix
			return([]);
		}
		else
		{
			for (j=0; j<n; j++)
			{
				D[ii][j] /= alpha;
				R[ii][j] /= alpha;
			}
			for (k=0; k<n; k++)
			{
				if (k != ii)
				{
					beta = D[k][ii];
					for (j=0; j<n; j++)
					{
						D[k][j] -= beta * D[ii][j];
						R[k][j] -= beta * R[ii][j];
					}
				}
			}
		}
		avail[ii] = false;
	}
	return(R);
}




//============================================ Caracteres

var FirstIdx = 192;
var entities = new Array(
"Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","Ccedil", // 192 to 199
"Egrave","Eacute","Ecirc","Euml","Igrave","Iacute","Icirc","Iuml","ETH","Ntilde", // 200 to 209
"Ograve","Oacute","Ocirc","Otilde","Ouml","","Oslash","Ugrave","Uacute","Ucirc", // 210 to 219
"Uuml","Yacute","THORN","szlig","agrave","aacute","acirc","atilde","auml","aring", // 220 to 229
"aelig","ccedil","egrave","eacute","ecirc","euml","igrave","iacute","icirc","iuml", // 230 to 239
"eth","ntilde","ograve","oacute","ocirc","otilde","ouml","","oslash","ugrave", // 240 to 249
"uacute","ucirc","uuml","yacute","thorn","yuml" // 250 to 255
);

function char_html2iso(s)
{
	var i,j;
	var m=s.match(/&[A-Za-z]+;/g);
	if (m == null) return(s);
	for (i=0; i<m.length; i++)
	{
		for (j=0; j<entities.length; j++)
		{
			if (m[i] == "&"+entities[j]+";")
			{
				s=s.replace(new RegExp(m[i]), String.fromCharCode(FirstIdx + j));
				break;
			}
		}
	}
	return(s);
}

function char_iso2ascii(s)
{
	s = escape(s)
	s = s.replace(/%(C0|C1|C2|C3|C4|C5)/gi, "A");
	s = s.replace(/%(E0|E1|E2|E3|E4|E5)/gi, "a");
	s = s.replace(/%(C6)/gi, "AE");
	s = s.replace(/%(E6)/gi, "ae");
	s = s.replace(/%(C7)/gi, "C");
	s = s.replace(/%(E7)/gi, "c");
	s = s.replace(/%(C8|C9|CA|CB)/gi, "E");
	s = s.replace(/%(E8|E9|EA|EB)/gi, "e");
	s = s.replace(/%(CC|CD|CE|CF)/gi, "I");
	s = s.replace(/%(EC|ED|EE|EF)/gi, "i");
	s = s.replace(/%(D0)/gi, "D");
	s = s.replace(/%(F0)/gi, "d");
	s = s.replace(/%(D1)/gi, "N");
	s = s.replace(/%(F1)/gi, "n");
	s = s.replace(/%(D2|D3|D4|D5|D6|D8)/gi, "O");
	s = s.replace(/%(F2|F3|F4|F5|F6|F8)/gi, "o");
	s = s.replace(/%(D9|DA|DB|DC)/gi, "U");
	s = s.replace(/%(F9|FA|FB|FC)/gi, "u");
	s = s.replace(/%(DD)/gi, "Y");
	s = s.replace(/%(FD)/gi, "y");
	s = unescape(s)
	return(s);
}

function char_html2ascii(s)
{
	s = s.replace(/&([A-Za-z])(grave|acute|tilde|circ|ring|cedil|uml|slash);/g, "$1");
	return(s);
}


// -----------------------------------------------------------------------------------

//
// getPageSize()
// Returns array with page width, height and window width, height
// Core code from - quirksmode.org
// Edit for Firefox by pHaez
//
function getPageSize(){

	var xScroll, yScroll;

	if (window.innerHeight && window.scrollMaxY) {
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}

	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}

	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else {
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll;
	}

	pageSize = {"pageWidth": pageWidth, "pageHeight": pageHeight, "windowWidth": windowWidth, "windowHeight": windowHeight};
	return pageSize;
}

