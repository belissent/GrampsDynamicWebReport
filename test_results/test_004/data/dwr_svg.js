// Gramps - a GTK+/GNOME based genealogy program
//
// Copyright (C) 2014 Pierre Bélissent
// See also https://github.com/andrewseddon/raphael-zpd/blob/master/raphael-zpd.js for parts of code from Raphael-ZPD
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA


var nbGenAsc; // Number of ancestry generations to print
var nbGenDsc; // Number of descedants generations to print
var nbGenAscFound; // Number of ancestry generations found in the tree
var nbGenDscFound; // Number of descedants generations found in the tree

var depNum = 1; // First number used for the SOSA notation
var DimX, DimY; // Size of the viewport in pixels

var rayons,rayonsAsc, rayonsDsc; // Gives the size of the circle for each generation
var nbPeopleAsc; // Gives the number of people for each generation (ancestry)
var nbPeopleDsc; // Gives the number of people for each generation (descendants)
var reuseIdx, reusePred, reuseSucc, reuseNum, reuseN;
var reuseX;

var txtRatio = 10.0; // width / height ratio for the text boxes
var linkRatio = 0.2; // Ratio between space reserved for the links  and the box width
var fontFactorX = 1.8, fontFactorY = 1.0;
var coordX = 10000.0, coordY = 10000.0;
var margeX = 200.0, margeY = 200.0;
var svgStroke; // Width of the box strokes

var hemiA = 0; // Math.PI/12;

var tpid = 0;
var curNumStr;

var x0, y0, w0, h0; // Coordinates of the top-left corner of the SVG graph, + width and height
var x1, y1, w1, h1; // Coordinates of the top-left corner of the SVG sheet, + width and height
var maxTextWidth; // Maximum width of the textboxes

var viewBoxX, viewBoxY, viewBoxW, viewBoxH; // Screen viewbox (top-left corner, width and height)
var viewScale; // Scale factor between SVG coordinates and screen coordinates

var iTxt = '';

// Each person is printed with a text SVG element, over a box (path).
// The same person could appear several times in the graph (implexes)
// The elements ID used to print a person are in the form:
//    - SVGTREE_P_<number> : box for the person (it is an SVG path)
//    - SVGTREE_T_<number> : text for the person (it is an SVG text)

// List giving the SVG element used to print a person, in the form
//    - person index (in table 'I')
//    - family index (in table 'F') when printing spouses (null in other cases)
//    - level (0 = center person, 1 = 1st generation, etc.)
//    - list of SVG elements connected to this element (children/parents)
//    - list of SVG elements connected to this element (spouses)
//    - size of the element (number of sub-elements)
//    - list of commands for the element creation (strings)
//    - box for the person (it is an SVG path)
var svgParents, svgChildren, svgElts;
SVGELT_IDX = 0;
SVGELT_FDX = 1;
SVGELT_LEV = 2;
SVGELT_NEXT = 3;
SVGELT_NEXT_SPOU = 4;
SVGELT_NB = 5;
SVGELT_CMD = 6;
SVGELT_P = 7;


//=========================================== Patrons

var CoordRatio;
var CoordXr;
var CoordYr;

var graphsBuild =
[
	buildAscTree,
	buildAsc,
	buildAscProp,
	buildAscHemi,
	buildAscHemiProp,
	buildDscTree,
	buildDscTreeSpou,
	buildDsc,
	buildDscSpou,
	buildDscHemi,
	buildDscHemiSpou,
	buildBothTreeProp,
	buildBothTreePropSpou,
	buildBoth,
	buildBothSpou,
	buildBothProp,
	buildBothPropSpou
];

var graphsInitialize =
[
	initAscTree,
	initAsc,
	initAscProp,
	initAscHemi,
	initAscHemiProp,
	initDscTree,
	initDscTreeSpou,
	initDsc,
	initDscSpou,
	initDscHemi,
	initDscHemiSpou,
	initBothTreeProp,
	initBothTreePropSpou,
	initBoth,
	initBothSpou,
	initBothProp,
	initBothPropSpou
];


//=========================================== Document

var svgPaper, svgRoot;


function SvgCreate(expand)
{
	if (typeof(expand) == 'undefined') expand = false;
	nbGenAsc = search.Asc + 1;
	nbGenDsc = search.Dsc + 1;
	nbGenAscFound = 0;
	nbGenDscFound = 0;
	$(window).load(SvgInit);
	var html = '';
	// Graph type selector floating div
	if (!expand)
		html += '<div class="panel panel-default dwr-panel-tree"><div class="panel-body">';
	html += '<div id="svg-drawing" class="' + (expand ? 'svg-drawing-expand' : 'svg-drawing') + '">';
	html += '<div id="svg-drawing-type" class="svg-drawing-type">';
	html += '<form class="form-inline">';
	html += '<select name="svg-type" id="svg-type" class="form-control" size="1" title="' + _('Select the type of graph') + '">';
	for (i = 0; i < graphsBuild.length; i++)
	{
		html += '<option value="' + i + '"' + ((search.SvgType == i) ? ' selected' : '') + '>' + SVG_TREE_TYPES_NAMES[i] + '</option>';
	}
	html += '</select> 	';
	// html += '<label for="svg-asc">' + _('Ancestry') + ':</label> ';
	html += '<select id="svg-asc" class="form-control svg-gens" size="1" title="' + _('Select the number of ascending generations') + '">';
	for (i = 0; i < NB_GENERATIONS_MAX; i++)
	{
		html += '<option value="' + i + '"' + ((search.Asc == i) ? ' selected' : '') + '>' + i + '</option>';
	}
	html += '</select> ';
	// html += '<label for="svg-dsc">' + _('Descendants') + ':</label> ';
	html += '<select id="svg-dsc" class="form-control svg-gens" size="1" title="' + _('Select the number of descending generations') + '">';
	for (i = 0; i < NB_GENERATIONS_MAX; i++)
	{
		html += '<option value="' + i + '"' + ((search.Dsc == i) ? ' selected' : '') + '>' + i + '</option>';
	}
	html += '</select> ';
	html += '</form>';
	html += '</div>';
	// Buttons div
	html += '<div id="svg-buttons">';
	html += '<div class="btn-group-vertical" role="group">';
	html += '<button id="SvgExpand" type="button" class="btn btn-default">';
	html += '<span class="glyphicon ' + (expand ? 'glyphicon-resize-small' : 'glyphicon-resize-full') + '"></span>';
	html += '</button>';
	html += '<button id="SvgZoomIn" type="button" class="btn btn-default">';
	html += '<span class="glyphicon glyphicon-zoom-in"></span>';
	html += '</button>';
	html += '<button id="SvgZoomOut" type="button" class="btn btn-default">';
	html += '<span class="glyphicon glyphicon-zoom-out"></span>';
	html += '</button>';
	html += '<button id="SvgHelp" type="button" class="btn btn-default">';
	html += '<span class="glyphicon glyphicon-question-sign"></span>';
	html += '</button>';
	html += '</span>';
	html += '</div>';
	html += '</div>';
	// Help div
	html += '<div id="svg-help-popover" class="popover fade in hide" role="tooltip">';
	html += '<h3 class="popover-title">' + _('Graph help') + '</h3>';
	html += '<div class="popover-content">';
	html += _('<p>Click on a person to center the graph on this person.<br>When clicking on the center person, the person page is shown.<p>The type of graph could be selected in the list (on the top left side of the graph)<p>The number of ascending end descending generations could also be adjusted.<p>Use the mouse wheel or the buttons to zoom in and out.<p>The graph could also be shown fullscreen.');
	html += '</div>';
	html += '</div>';
	// Floating popup div
	html += '<div id="svg-popup" class="svg-popup">';
	html += '</div>';
	html += '</div>'; // svg-drawing
	if (!expand)
		html += '</div></div>'; // panel
	return(html);
}


function SvgInit()
{
	// Initialize graph dimensions
	graphsInitialize[search.SvgType]();
	CalcBoundingBox();
	svgPaper = new Raphael('svg-drawing', DimX, DimY);
	svgPaper.setViewBox(0, 0, viewBoxW, viewBoxH, true);
	svgRoot = svgPaper.canvas;
	// Graph type selector event
	$('#svg-type').change(function() {treeRef();});
	// Events for update of number of generations
	$('.svg-gens').change(function() {treeRef();});
	// Floating popup
	SvgPopupHide();
	$('#svg-popup').mousemove(SvgPopupMove);
	// Prepare the SVG group that will be used for scrolling/zooming
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.id = 'viewport';
	svgRoot.appendChild(g);
	svgPaper.canvas = g;
	var s = 'matrix(' + viewScale + ',0,0,' + viewScale + ',' + (-viewBoxX) + ',' + (-viewBoxY) + ')';
	g.setAttribute('transform', s);
	// Manage buttons
	$('#SvgZoomIn').click(SvgZoomIn);
	$('#SvgZoomOut').click(SvgZoomOut);
	if ($('.svg-drawing-expand').length == 0)
	{
		$('#SvgExpand').click(SvgExpand);
	}
	else
	{
		$('#SvgExpand').click(SvgMinimize);
	}
	svgPaper.canvas = g;
	// Help button
	$('#SvgHelp').click(function (e) {
		$('#svg-help-popover').toggleClass('hide');
	});
	$('#svg-help-popover').click(function (e) {
		$('#svg-help-popover').addClass('hide');
	});
	// Setup event handlers
	svgRoot.onmousedown = SvgMouseDown;
	svgRoot.onmouseup = SvgMouseUp;
	$(window).mouseup(SvgMouseUpWindow);
	svgRoot.onmousemove = SvgMouseMoveHover;
	$(window).mousemove(SvgMouseMoveWindow);
	svgRoot.onmouseout = SvgMouseOut;
	$(svgRoot).mousewheel(SvgMouseWheel);
	$(window).resize(SvgResize);
	// Build the graph
	graphsBuild[search.SvgType]();
	SvgCreateElts(0);
}


function CalcBoundingBox()
{
	if ($('.svg-drawing-expand').length == 0)
	{
		var w = $('#svg-drawing').innerWidth();
		var h = $('#svg-drawing').innerHeight();
		var dim = innerDivNetSize(BodyContentsMaxSize(), $('#svg-drawing'));
		if (!w || w < 77) w = dim.width;
		DimX = Math.max(77, w);
		DimY = Math.max(77, h, dim.height);
	}
	else
	{
		DimX = Math.max(77, $(window).width());
		DimY = Math.max(77, $(window).height());
	}
	// console.log($('#svg-drawing').width(), $('#svg-drawing').height(), DimX, DimY);
	viewScale = Math.min(DimX / w0, DimY / h0);
	x1 = x0 - (DimX / viewScale - w0) / 2;
	y1 = y0 - (DimY / viewScale - h0) / 2;
	w1 = DimX / viewScale;
	h1 = DimY / viewScale;
	// console.log(x0, y0, w0, h0, x1, y1, w1, h1);
	viewBoxX = Math.round(x1 * viewScale);
	viewBoxY = Math.round(y1 * viewScale);
	viewBoxW = DimX;
	viewBoxH = DimY;
}


function SvgCreateElts(n)
{
	// Difers the SVG element creation
	var incr = 50;
	for (var x_elt = n; (x_elt < n + incr) && (x_elt < svgElts.length); x_elt++)
	{
		for (var i = 0; i < svgElts[x_elt][SVGELT_CMD].length; i++) 
		{
			// console.log(svgElts[x_elt][SVGELT_CMD][i]);
			eval(svgElts[x_elt][SVGELT_CMD][i]);
		}
	}
	if (svgElts.length > n + incr)
	{
		setTimeout(function()
		{
			SvgCreateElts(n + incr);
		}, 200);
	}
}


function SvgSetStyle(p, text, x_elt, lev)
{
	var elt = svgElts[x_elt];
	var cl = 'svg-tree';
	var clt = 'svg-text';
	if (elt[SVGELT_IDX] == search.Idx)
	{
		cl += ' svg-center';
		clt += ' svg-text-center';
	}
	if (isImplex(elt[SVGELT_IDX]))
	{
		cl += ' svg-implex';
		clt += ' svg-text-implex';
	}
	if (I[elt[SVGELT_IDX]][I_GENDER] == 'M')
	{
		cl += ' svg-male';
		clt += ' svg-text-male';
	}
	else if (I[elt[SVGELT_IDX]][I_GENDER] == 'F')
	{
		cl += ' svg-female';
		clt += ' svg-text-female';
	}
	else
	{
		cl += ' svg-unknown';
		clt += ' svg-text-unknown';
	}
	if (typeof(lev) != 'undefined') cl += ' svg-gen-' + (lev + 1);
	p.node.setAttribute('class', cl);
	p.node.id = 'SVGTREE_P_' + x_elt;
	elt[SVGELT_P] = p;
	if (text)
	{
		text.node.setAttribute('class', clt);
		text.attr({
            font: ''
		});
		text.node.id = 'SVGTREE_T_' + x_elt;
	}
}


//=========================================== Mouse events

var clickOrigin = null;
var tfMoveZoom = null;
var clickedBox = -1;
var hoverBox = -1;


function SvgGetElt(node)
{
	while (node.id != 'svg-drawing')
	{
		if (node.id.indexOf('SVGTREE_') == 0)
			return(parseInt(node.id.replace(/SVGTREE_[A-Z_]+/, '')));
		node = node.parentNode;
	}
	return(-1);
}


function SvgMouseDown(event)
{
	if (event.button > 0) return(true);
	clickOrigin = getEventPoint(event);
	var g = svgRoot.getElementById('viewport');
	tfMoveZoom = g.getCTM().inverse();
	clickedBox = -1;
	var elt = SvgGetElt(event.target);
	if (elt >= 0)
	{
		clickedBox = elt;
		SvgMouseEventEnter(elt);
	}
	return(false);
}

function SvgMouseUp(event)
{
	if (event.button > 0) return(true);
	var elt = SvgGetElt(event.target);
	if (elt >= 0 && elt == clickedBox)
	{
		if (elt == 0) indiRef(search.Idx);
		else treeRef(svgElts[elt][SVGELT_IDX]);
	}
	clickedBox = -1;
	return(true);
}

function SvgMouseUpWindow(event)
{
	if (event.button > 0) return(true);
	clickOrigin = null;
	tfMoveZoom = null;
	return(true);
}

function SvgExpand(elt)
{
	svgRef();
}

function SvgMinimize(elt)
{
	svgRef(false);
}

function SvgMouseMoveWindow(event)
{
	var p = getEventPoint(event);
	if (clickOrigin)
	{
		var d = Math.sqrt((p.x - clickOrigin.x) * (p.x - clickOrigin.x) + (p.y - clickOrigin.y) * (p.y - clickOrigin.y));
		if (d > 5 || clickedBox == -1)
		{
			var p2 = p.matrixTransform(tfMoveZoom);
			var o2 = clickOrigin.matrixTransform(tfMoveZoom);
			// console.log(p.x, clickOrigin.x, p2.x, o2.x);
			SvgSetGraphCtm(tfMoveZoom.inverse().translate(p2.x - o2.x, p2.y - o2.y));
			SvgMouseEventExit();
			clickedBox = -1;
			return(false);
		}
	}
	return(true);
}

function SvgMouseMoveHover(event)
{
	var elt = SvgGetElt(event.target);
	if (elt >= 0)
	{
		if (clickedBox < 0)
		{
			if (elt != hoverBox)
			{
				SvgMouseEventExit();
				SvgMouseEventEnter(elt);
			}
		}
		else
		{
			if (elt != clickedBox) SvgMouseEventExit();
			else SvgMouseEventEnter(elt);
		}
		SvgPopupShow(svgElts[elt][SVGELT_IDX], event);
	}
	else if (hoverBox >= 0)
	{
		SvgMouseEventExit();
		SvgPopupHide();
	}
	return(true);
}

function SvgMouseOut(event)
{
	var e = event.toElement || event.relatedTarget;
	if ($(e).attr('id') == 'svg-popup' ||
		e == svgRoot ||
		(e && (e.parentNode == svgRoot ||
		(e.parentNode && (e.parentNode.parentNode == svgRoot ||
		(e.parentNode.parentNode && (e.parentNode.parentNode.parentNode == svgRoot))))))) return(true);
	SvgMouseEventExit();
	SvgPopupHide();
	return(true);
}

function SvgMouseEventExit()
{
	if (hoverBox >= 0)
	{
		var p = svgElts[hoverBox][SVGELT_P];
		var cl = p.node.getAttribute('class');
		p.node.setAttribute('class', cl.replace(' svg-hover', ''));
		$('#SVGTREE_P_' + hoverBox).attr({cursor: 'auto'});
		$('#SVGTREE_T_' + hoverBox).attr({cursor: 'auto'});
	}
	hoverBox = -1;
}

function SvgMouseEventEnter(elt)
{
	if (elt >= 0 && elt != hoverBox)
	{
		hoverBox = -1;
		var p = svgElts[elt][SVGELT_P];
		if (p)
		{
			hoverBox = elt;
			var cl = p.node.getAttribute('class');
			p.node.setAttribute('class', cl + ' svg-hover');
			$('#SVGTREE_P_' + hoverBox).attr({cursor: 'pointer'});
			$('#SVGTREE_T_' + hoverBox).attr({cursor: 'pointer'});
		}
	}
}

function SvgMouseWheel(event)
{
	if (event.preventDefault) event.preventDefault();
    var p = getEventPoint(event);
	// See jquery-mousewheel plugin
	// console.log(event.deltaX, event.deltaY, event.deltaFactor);
	SvgZoom(event.deltaY, p);
	// Zoom factor: 0.97/1.03
	return(false);
}

function SvgZoom(delta, p)
{
	// Use center if p not defined
	if (typeof(p) == 'undefined')
	{
		p = svgRoot.createSVGPoint();
		p.x = DimX / 2;
		p.y = DimY / 2;
	}
	// Zoom factor: 0.97/1.03
	var z = Math.pow(1 + Math.sign(delta) * .1, Math.abs(delta));
    var g = svgRoot.getElementById('viewport');
	var ctm = g.getCTM().inverse();
	var scale = ctm.a;
	if ((delta < 0) && (z / scale < DimX / w1))	
		z = DimX / w1 * scale; // Minimal zoom
	if ((delta > 0) && (z / scale > 1.0))
		z = 1.0 * scale; // Maximal zoom
	p = p.matrixTransform(ctm);
	// Compute new scale matrix in current mouse position
	var k = svgRoot.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);
	SvgSetGraphCtm(g.getCTM().multiply(k));
	// Update the matrix used for moving
	if (tfMoveZoom) tfMoveZoom = k.inverse().multiply(tfMoveZoom);
}

function SvgZoomIn()
{
	SvgZoom(1);
	return(false);
}

function SvgZoomOut()
{
	SvgZoom(-1);
	return(false);
}

function SvgResize()
{
	// Do not resize when not full size
	if ($('.svg-drawing-expand').length == 0) return;
	// Compute new size
	var _DimX = DimX;
	var _DimY = DimY;
	var _viewBoxX = viewBoxX;
	var _viewBoxY = viewBoxY;
	var _viewBoxW = viewBoxW;
	var _viewBoxH = viewBoxH;
	var _viewScale = viewScale;
	CalcBoundingBox();
	viewScale = _viewScale;
	if ((_DimX == DimX) && (_DimY == DimY)) return(true);
	// Change viewport size
	var g = svgPaper.canvas
	svgPaper.canvas = svgRoot;
	svgPaper.setSize(DimX, DimY);
	svgPaper.setViewBox(0, 0, viewBoxW, viewBoxH);
	svgPaper.canvas = g;
	// Move buttons
	var gbut1 = $('#buttons_group_1');
	if (gbut1.length > 0)
	{
		gbut1 = gbut1[0];
		var m = gbut1.getCTM();
		m = m.translate(DimX - _DimX, DimY - _DimY);
		// console.log('matrix(' + m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.e + ',' + m.f + ') '+DimX+', '+DimY+' / '+_DimX+', '+_DimY);
		gbut1.setAttribute('transform', 'matrix(' + m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.e + ',' + m.f + ')');
	}
	var gbut2 = $('#buttons_group_2');
	if (gbut2.length > 0)
	{
		gbut2 = gbut2[0];
		var m = gbut2.getCTM();
		m = m.translate(DimX - _DimX, 0)
		gbut2.setAttribute('transform', 'matrix(' + m.a + ',' + m.b + ',' + m.c + ',' + m.d + ',' + m.e + ',' + m.f + ')');
	}
	// Translate graph
	var g = svgRoot.getElementById('viewport');
	// var s = g.getCTM().translate((DimX - _DimX) / 2.0, (DimY - _DimY) / 2.0);
	var s = g.getCTM();
	s.e += (DimX - _DimX) / 2.0;
	s.f += (DimY - _DimY) / 2.0;
	// console.log((DimX - _DimX) / 2.0, (s.translate((DimX - _DimX) / 2.0, (DimY - _DimY) / 2.0)).e-s.e);
	SvgSetGraphCtm(s);
	return(false);
}

function getEventPoint(event)
{
	var p = svgRoot.createSVGPoint();
	var posX = $(svgRoot).offset().left;
	var posY = $(svgRoot).offset().top;
	p.x = event.pageX - posX;
	p.y = event.pageY - posY;
	// console.log(p.x, p.y);
	// p.x = event.clientX;
	// p.y = event.clientY;
	return p;
}


function SvgSetGraphCtm(matrix)
{
	var g = svgRoot.getElementById('viewport');
	// Limit matrix to bounding rect
	// console.log(matrix.a * x1 + matrix.e, matrix.a * (x1 + w1) + matrix.e - DimX);
	matrix.e -= Math.max(0, matrix.a * x1 + matrix.e);
	matrix.e -= Math.min(0, matrix.a * (x1 + w1) + matrix.e - DimX);
	matrix.f -= Math.max(0, matrix.a * y1 + matrix.f);
	matrix.f -= Math.min(0, matrix.a * (y1 + h1) + matrix.f - DimY);
	// Limit matrix to graph area
	if (matrix.a * x0 + matrix.e > 0)
		matrix.e -= Math.min(matrix.a * x0 + matrix.e, Math.max(0, matrix.a * (x0 + x0 + w0) / 2 + matrix.e - DimX / 2));
	if (matrix.a * (x0 + w0) + matrix.e < DimX)
		matrix.e -= Math.max(matrix.a * (x0 + w0) + matrix.e - DimX, Math.min(0, matrix.a * (x0 + x0 + w0) / 2 + matrix.e - DimX / 2));
	if (matrix.a * y0 + matrix.f > 0)
		matrix.f -= Math.min(matrix.a * y0 + matrix.f, Math.max(0, matrix.a * (y0 + y0 + h0) / 2 + matrix.f - DimY / 2));
	if (matrix.a * (y0 + h0) + matrix.f < DimY)
		matrix.f -= Math.max(matrix.a * (y0 + h0) + matrix.f - DimY, Math.min(0, matrix.a * (y0 + y0 + h0) / 2 + matrix.f - DimY / 2));
	// Set transform
	var s = 'matrix(' + matrix.a + ',' + matrix.b + ',' + matrix.c + ',' + matrix.d + ',' + matrix.e + ',' + matrix.f + ')';
	g.setAttribute('transform', s);
}


//=========================================== Popup


svgPopupIdx = -1;

function SvgPopupHide()
{
	$('#svg-popup').hide();
}

function SvgPopupShow(idx, event)
{
	$('#svg-popup').show();
	if (idx != svgPopupIdx)
	{
		var html = '<p>' + I[idx][I_NAME];
		html += '<br>' + I[idx][I_BIRTH_YEAR] + '-' + I[idx][I_DEATH_YEAR] + '</p>';
		$('#svg-popup').html(html);
		svgPopupIdx = idx;
	}
	SvgPopupMove(event);
}

function SvgPopupMove(event)
{
	var p = getEventPoint(event);
	var m = 10;
	p.x += m;
	p.y += m;
	if (p.x > DimX / 2) p.x -= $('#svg-popup').outerWidth() + 2 * m;
	if (p.y > DimY / 2) p.y -= $('#svg-popup').outerHeight() + 2 * m;
	$('#svg-popup').css('left', p.x);
	$('#svg-popup').css('top', p.y);
	return(true);
}


//=========================================== Acces DB
function getFams(idx)
{
	return(I[idx][I_FAMS]);
}
function getFamc(idx)
{
	indexes = [];
	for (var x = 0; x < I[idx][I_FAMC].length; x++)
		indexes.push(I[idx][I_FAMC][x][FC_INDEX]);
	return(indexes);
}
function getSpou(idx)
{
	return(F[idx][F_SPOU]);
}
function getChil(idx)
{
	indexes = [];
	for (var x = 0; x < F[idx][F_CHIL].length; x++)
		indexes.push(F[idx][F_CHIL][x][FC_INDEX]);
	return(indexes);
}

//=========================================== Calcul du nombre d'ascendants

function calcAsc(idx, lev)
{
	var i;
	nbPeopleAsc = [];
	for (i = 0; i <= nbGenAsc; i++) nbPeopleAsc[i] = 0;
	svgParents = [];
	calcAscSub(idx, lev);
}

function calcAscSub(idx, lev)
{
	var elt = [];
	elt[SVGELT_IDX] = idx;
	elt[SVGELT_LEV] = lev;
	elt[SVGELT_NEXT] = [];
	elt[SVGELT_NEXT_SPOU] = [];
	elt[SVGELT_CMD] = [];
	svgParents.push(elt);
	nbGenAscFound = Math.max(nbGenAscFound, lev + 1);
	var i, j;
	var nb = 0;
	if (lev < nbGenAsc - 1)
	{
		for (i = 0; i < getFamc(idx).length; i++)
		{
			for (j = 0; j < getSpou(getFamc(idx)[i]).length; j++)
			{
				elt[SVGELT_NEXT].push(svgParents.length);
				var elt_next = calcAscSub(getSpou(getFamc(idx)[i])[j], lev + 1);
				nb += elt_next[SVGELT_NB];
			}
		}
	}
	nb = Math.max(nb, 1);
	elt[SVGELT_NB] = nb;
	nbPeopleAsc[lev] += nb;
	return(elt);
}


//=========================================== Calcul des descendants
function calcDsc(idx, lev, print_spouses)
{
	var i;
	nbPeopleDsc = [];
	for (i = 0; i <= nbGenDsc; i++) nbPeopleDsc[i] = 0;
	svgChildren = [];
	// nbFams = [];
	return calcDscSub(idx, lev, print_spouses);
}
function calcDscSub(idx, lev, print_spouses)
{
	var elt = [];
	elt[SVGELT_IDX] = idx;
	elt[SVGELT_LEV] = lev;
	elt[SVGELT_NEXT] = [];
	elt[SVGELT_NEXT_SPOU] = [];
	elt[SVGELT_CMD] = [];
	svgChildren.push(elt);
	nbGenDscFound = Math.max(nbGenDscFound, lev + 1);
	var nb = 0;
	if (lev < nbGenDsc - 1)
	{
		for (var f = 0; f < getFams(idx).length; f++)
		{
			var nb_spou = 0;
			var nb_chil = 0;
			var next = [];
			var next_spou = [];
			var fdx = getFams(idx)[f];
			if (print_spouses)
			{
				for (var i = 0; i < getSpou(fdx).length; i++)
				{
					if (idx != getSpou(fdx)[i])
					{
						next_spou.push(svgChildren.length);
						var elt_next = calcDscSubSpou(getSpou(fdx)[i], fdx, lev, print_spouses);
						nb_spou += 1;
					}
				}
			}
			for (var i = 0; i < getChil(fdx).length; i++)
			{
				next.push(svgChildren.length);
				var elt_next = calcDscSub(getChil(fdx)[i], lev + 1, print_spouses);
				nb_chil += elt_next[SVGELT_NB];
			}
			var nbmax = Math.max(nb_spou, nb_chil);
			for (var i = 0; i < next.length; i++)
				svgChildren[next[i]][SVGELT_NB] *= 1.0 * nbmax / nb_chil;
			for (var i = 0; i < next_spou.length; i++)
				svgChildren[next_spou[i]][SVGELT_NB] *= 1.0 * nbmax / nb_spou;
			nb += nbmax;
			$.merge(elt[SVGELT_NEXT], next);
			$.merge(elt[SVGELT_NEXT_SPOU], next_spou);
		}
	}
	nb = Math.max(nb, 1);
	elt[SVGELT_NB] = nb;
	nbPeopleDsc[lev] += nb;
	return(elt);
}
function calcDscSubSpou(idx, fdx, lev, print_spouses)
{
	var elt = [];
	elt[SVGELT_IDX] = idx;
	elt[SVGELT_FDX] = fdx;
	elt[SVGELT_LEV] = lev;
	elt[SVGELT_NEXT] = [];
	elt[SVGELT_NEXT_SPOU] = [];
	elt[SVGELT_CMD] = [];
	svgChildren.push(elt);
	elt[SVGELT_NB] = 1;
	nbGenDscFound = Math.min(nbGenDsc, Math.max(nbGenDscFound, lev + 2));
	return(elt);
}


//=========================================== Calcul des rayons

// These functions compute the width of the circles for each generation

function calcRayons(nb_gen)
{
	var i;
	rayons = [];
	rayons[0] = 0.5;
	for (i = 1; i < nb_gen; i++)
	{
		var p = Math.pow(2, i);
		rayons[i] = 2 * Math.PI * rayons[i-1] * txtRatio / p;
		if (rayons[i] > 1.0) rayons[i] = 1.0;
		rayons[i] += rayons[i-1];
	}
	for (i = 0; i < nb_gen; i++)
	{
		rayons[i] /= rayons[nb_gen-1];
	}
}


function calcRayonsPropAsc(idx)
{
	calcRayonsPropSub(svgParents[0], nbPeopleAsc, nbGenAscFound, null);
}

function calcRayonsPropDsc(idx, print_spouses)
{
	calcRayonsPropSub(svgChildren[0], nbPeopleDsc, nbGenDscFound, print_spouses);
}

function calcRayonsPropBoth(idx, print_spouses)
{
	calcRayonsPropSub(svgParents[0], nbPeopleAsc, nbGenAscFound, null);
	rayonsAsc = rayons;
	calcRayonsPropSub(svgChildren[0], nbPeopleDsc, nbGenDscFound, print_spouses);
	rayonsDsc = rayons;
	rayons = null;
	var nb_gen = Math.max(nbGenAscFound, nbGenDscFound);
	for (var i = 0 ; i < nb_gen; i++)
	{
		var r_dsc = rayonsDsc[i];
		if (i >= nbGenAscFound) rayonsAsc[i] = rayonsDsc[i];
		else if (i >= nbGenDscFound) rayonsDsc[i] = rayonsAsc[i];
		else if (rayonsAsc[i] < r_dsc) rayonsDsc[i] = rayonsAsc[i];
		else rayonsAsc[i] = rayonsDsc[i];
	}
	if (print_spouses)
	{
		var offset = 0;
		for (var i = 0 ; i < nbGenAscFound; i++)
		{
			if (i < nbGenAscFound - 1) offset = (rayonsAsc[i + 1] - rayonsAsc[i]) / 2;
			else if (i < nbGenDscFound - 1) offset = (rayonsDsc[i + 1] - rayonsDsc[i]) / 2;
			rayonsAsc[i] += offset;
		}
		var ratio = Math.min(1.0, 1.0 / rayonsAsc[nbGenAscFound - 1]);
		for (var i = 0 ; i < nb_gen; i++)
		{
			rayonsAsc[i] *= ratio;
			rayonsDsc[i] *= ratio;
		}
	}
}

function calcRayonsPropSub(center_elt, nb_people, nb_gen, print_spouses)
{
	var i;
	rayons = [];
	rayons[0] = 0.5;
	for (i = 1; i <= nb_gen; i++)
	{
		rayons[i] = 2.0 * Math.PI * rayons[i-1] * txtRatio * nb_people[i] / center_elt[SVGELT_NB];
		if (rayons[i] > 1) rayons[i] = 1.0;
		if (print_spouses && i == nb_gen) rayons[i] /= 2.0;
		rayons[i] += rayons[i-1];
	}
	for (i = 0; i <= nb_gen; i++)
	{
		rayons[i] /= rayons[nb_gen];
	}
}


//=========================================== Roue ascendante

function initAsc()
{
	x0 = -(coordX + margeX);
	y0 = -(coordY + margeY);
	w0 = 2 * (coordX + margeX);
	h0 = 2 * (coordY + margeY);
}

function buildAsc()
{
	calcAsc(search.Idx, 0);
	calcRayons(nbGenAscFound);
	svgElts = svgParents;
	maxTextWidth = coordX * rayons[0] * 2;
	svgElts[0][SVGELT_CMD].push('cCircle(' + [rayons[0], 0].join(', ') + ');');
	buildAscSub0(0, 0, 0, 2*Math.PI, depNum);
}

function buildAscSub0(x_elt, lev, a, b, num)
{
	var n = svgElts[x_elt][SVGELT_NEXT].length;
	for (var i = 0; i < n; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var sex = I[svgElts[x_next][SVGELT_IDX]][I_GENDER];
		buildAscSub(x_next, lev+1,
			a + (b - a) / n * i,
			a + (b - a) / n * (i + 1),
			(sex == 'F') ? num * 2 + 1 : num * 2);
	}
}

function buildAscSub(x_elt, lev, a, b, num)
{
	svgElts[x_elt][SVGELT_CMD].push('secteur(' + [a, b, rayons[lev-1], rayons[lev], x_elt, lev].join(',') + ');');
	buildAscSub0(x_elt, lev, a, b, num);
}


//=========================================== Hemisphere ascendant
function initAscHemi()
{
	x0 = -(coordX + margeX);
	y0 = -(coordY + margeY);
	w0 = 2 * (coordX + margeX);
	h0 = 2 * (coordY * (1+Math.sin(hemiA))/2 + margeY);
}

function buildAscHemi()
{
	calcAsc(search.Idx, 0);
	calcRayons(nbGenAscFound);
	svgElts = svgParents;
	maxTextWidth = coordX * rayons[0] * 2;
	svgParents[0][SVGELT_CMD].push('cCircleHemi(' + [rayons[0], -Math.PI/2 - hemiA, Math.PI/2 + hemiA, 0].join(', ') + ');');
	buildAscSub0(0, 0, -Math.PI/2 - hemiA, Math.PI/2 + hemiA, depNum);
}


//=========================================== Roue ascendante proportionnelle
function initAscProp()
{
	initAsc();
}

function buildAscProp()
{
	calcAsc(search.Idx, 0);
	calcRayonsPropAsc(search.Idx);
	svgElts = svgParents;
	maxTextWidth = coordX * rayons[0] * 2;
	svgElts[0][SVGELT_CMD].push('cCircle(' + [rayons[0], 0].join(', ') + ');');
	buildAscPropSub0(0, 0, 0, 2*Math.PI, depNum);
}

function buildAscPropSub0(x_elt, lev, a, b, num)
{
	var c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var sex = I[svgElts[x_next][SVGELT_IDX]][I_GENDER];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildAscPropSub(x_next, lev + 1, c, c+da, (sex == 'F') ? num * 2 + 1 : num * 2);
		c += da;
	}
}

function buildAscPropSub(x_elt, lev, a, b, num)
{
	svgElts[x_elt][SVGELT_CMD].push('secteur(' + [a, b, rayons[lev-1], rayons[lev], x_elt, lev].join(',') + ');');
	buildAscPropSub0(x_elt, lev, a, b, num);
}

//=========================================== Hemisphere ascendant proportionnel
function initAscHemiProp()
{
	initAscHemi();
}

function buildAscHemiProp()
{
	calcAsc(search.Idx, 0);
	calcRayonsPropAsc(search.Idx);
	svgElts = svgParents;
	maxTextWidth = coordX * rayons[0] * 2;
	svgParents[0][SVGELT_CMD].push('cCircleHemi(' + [rayons[0], -Math.PI/2 - hemiA, Math.PI/2 + hemiA, 0].join(', ') + ');');
	buildAscPropSub0(0, 0, -Math.PI/2 - hemiA, Math.PI/2 + hemiA, depNum);
}

//=========================================== Roue descendante
function initDsc()
{
	initAsc();
}

function buildDsc()
{
	calcDsc(search.Idx, 0, false);
	calcRayonsPropDsc(search.Idx, false);
	svgElts = svgChildren;
	maxTextWidth = coordX * rayons[0] * 2;
	svgElts[0][SVGELT_CMD].push('cCircle(' + [rayons[0], 0].join(', ') + ');');
	buildDscSub0(0, 0, 0, 2*Math.PI);
}

function buildDscSub0(x_elt, lev, a, b)
{
	var c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildDscSub(x_next, lev + 1, c, c + da);
		c += da;
	}
}

// function buildDscSub1(x_elt, lev, a, b)
// {
	// var i;
	// if (lev >= nbGenDsc) return;
	// var c = a;
	// for (i = 0; i < getChil(fdx).length; i++)
	// {
		// var da = nbChildren[getChil(fdx)[i]] / nbFams[fdx] * (b - a);
		// buildDscSub2(getChil(fdx)[i], lev, c, c+da);
		// c += da;
	// }
// }

function buildDscSub(x_elt, lev, a, b)
{
	svgElts[x_elt][SVGELT_CMD].push('secteur(' + [a, b, rayons[lev-1], rayons[lev], x_elt, lev].join(',') + ');');
	buildDscSub0(x_elt, lev, a, b);
}

//=========================================== Hemisphere descendant
function initDscHemi()
{
	initAscHemi();
}

function buildDscHemi()
{
	calcDsc(search.Idx, 0, false);
	calcRayonsPropDsc(search.Idx, false);
	svgElts = svgChildren;
	maxTextWidth = coordX * rayons[0] * 2;
	svgElts[0][SVGELT_CMD].push('cCircleHemi(' + [rayons[0], -Math.PI/2 - hemiA, Math.PI/2 + hemiA, 0].join(', ') + ');');
	buildDscSub0(0, 0, -Math.PI/2 - hemiA, Math.PI/2 + hemiA);
}


//=========================================== Roue descendante avec epoux
function initDscSpou()
{
	initAsc();
}

function buildDscSpou()
{
	calcDsc(search.Idx, 0, true);
	calcRayonsPropDsc(search.Idx, true);
	svgElts = svgChildren;
	maxTextWidth = coordX * rayons[0] * 2;
	svgElts[0][SVGELT_CMD].push('cCircle(' + [rayons[0], 0].join(', ') + ');');
	buildDscSpouSub0(0, 0, 0, 2*Math.PI);
}

function buildDscSpouSub0(x_elt, lev, a, b)
{
	var c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT_SPOU].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT_SPOU][i];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildDscSpouSub1(x_next, lev, c, c + da);
		c += da;
	}
	c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildDscSpouSub2(x_next, lev + 1, c, c + da);
		c += da;
	}
}

function buildDscSpouSub1(x_elt, lev, a, b)
{
	// Print spouse
	svgElts[x_elt][SVGELT_CMD].push('secteur(' + [a, b, rayons[lev], (rayons[lev+1]+rayons[lev])/2, x_elt, lev].join(',') + ');');
}

function buildDscSpouSub2(x_elt, lev, a, b)
{
	// Print child
	svgElts[x_elt][SVGELT_CMD].push('secteur(' + [a, b, (rayons[lev]+rayons[lev-1])/2, rayons[lev], x_elt, lev].join(',') + ');');
	buildDscSpouSub0(x_elt, lev, a, b);
}


//=========================================== Hemisphere descendant avec epoux
function initDscHemiSpou()
{
	initAscHemi();
}

function buildDscHemiSpou()
{
	calcDsc(search.Idx, 0, true);
	calcRayonsPropDsc(search.Idx, true);
	svgElts = svgChildren;
	maxTextWidth = coordX * rayons[0] * 2;
	svgElts[0][SVGELT_CMD].push('cCircleHemi(' + [rayons[0], -Math.PI/2 - hemiA, Math.PI/2 + hemiA, 0].join(', ') + ');');
	buildDscSpouSub0(0, 0, -Math.PI/2 - hemiA, Math.PI/2 + hemiA);
}


//=========================================== Roue ascendante+descendante

function buildBothSub(prop, print_spouses)
{
	calcAsc(search.Idx, 0);
	calcDsc(search.Idx, 0, print_spouses);
	calcRayonsPropBoth(search.Idx, print_spouses);
	mergeSVGelts();
	var center1 = svgParents[0];
	var center2 = svgChildren[0];
	// Ascendants
	svgElts[0] = center1;
	maxTextWidth = coordX * rayonsAsc[0] * 2;
	rayons = rayonsAsc;
	if (prop) buildAscPropSub0(0, 0, -Math.PI/2, Math.PI/2, depNum);
	else buildAscSub0(0, 0, -Math.PI/2, Math.PI/2, depNum);
	// Descendants
	svgElts[0] = center2;
	maxTextWidth = coordX * rayonsDsc[0] * 2;
	rayons = rayonsDsc;
	if (print_spouses) buildDscSpouSub0(0, 0, Math.PI/2, 3*Math.PI/2);
	else buildDscSub0(0, 0, Math.PI/2, 3*Math.PI/2);
	// Texte central
	svgElts[0][SVGELT_CMD].push('cCircleBoth(' + [rayonsAsc[0], rayonsDsc[0], 0].join(', ') + ');');
}

function mergeSVGelts()
{
	// Merge svgParents and svgChildren
	var shift = svgParents.length;
	svgElts = svgParents;
	for (var x_elt = 0; x_elt < svgChildren.length; x_elt++)
	{
		elt = svgChildren[x_elt];
		fields = [SVGELT_NEXT, SVGELT_NEXT_SPOU];
		for (var x_field = 0; x_field < 2; x_field++)
		{
			var field = fields[x_field];
			for (var i = 0; i < elt[field].length; i++) elt[field][i] += shift - 1;
		}
		if (x_elt > 0) svgElts.push(elt);
	}
}

function initBoth()
{
	initAsc();
}
function buildBoth()
{
	buildBothSub(false, false);
}

function initBothProp()
{
	initAsc();
}
function buildBothProp()
{
	buildBothSub(true, false);
}

function initBothSpou()
{
	initAsc();
}
function buildBothSpou()
{
	buildBothSub(false, true);
}

function initBothPropSpou()
{
	initAsc();
}
function buildBothPropSpou()
{
	buildBothSub(true, true);
}


//=========================================== Arbre ascendant
function initAscTree()
{
	calcAsc(search.Idx, 0);
	svgElts = svgParents;
	var box_width = Math.min(coordX / nbGenAscFound, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = box_width / txtRatio;
	maxTextWidth = box_width;
	x0 = -margeX;
	y0 = -margeY;
	w0 = box_width * nbGenAscFound + box_width * (nbGenAscFound - 1) * linkRatio + 2.0 * margeX;
	h0 = box_height * svgElts[0][SVGELT_NB] + 2.0 * margeY;
}

function buildAscTree()
{
	buildAscTreeSub(0, 0, svgElts[0][SVGELT_NB], depNum, nbGenAscFound, 0);
}

function buildAscTreeSub(x_elt, a, b, num, nb_gens, offsetx, child_x, child_y)
{
	var lev = svgElts[x_elt][SVGELT_LEV];
	var box_width = Math.min(coordX / nb_gens, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = Math.min(box_width, svgElts[x_elt][SVGELT_NB] * box_width / txtRatio);
	var x = box_width * (1.0 + linkRatio) * (lev + offsetx);
	var y = (a + b) / 2.0 * box_width / txtRatio;
	svgElts[x_elt][SVGELT_CMD].push('rectangle(' + [x, y - box_height / 2.0, box_width, box_height, x_elt, lev].join(',') + ');');
	if (typeof(child_x) == 'number')
	{
		// Draw links
		svgElts[x_elt][SVGELT_CMD].push('line(' + [child_x, child_y, x, y].join(',') + ');');
	}
	var c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var sex = I[svgElts[x_next][SVGELT_IDX]][I_GENDER];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildAscTreeSub(x_next, c, c + da, (sex == 'F') ? num * 2 + 1 : num * 2, nb_gens, offsetx, x + box_width, y);
		c += da;
	}
}

//=========================================== Arbre descendant
function initDscTree()
{
	calcDsc(search.Idx, 0, false);
	svgElts = svgChildren;
	var box_width = Math.min(coordX / nbGenDscFound, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = box_width / txtRatio;
	maxTextWidth = box_width;
	x0 = -margeX;
	y0 = -margeY;
	w0 = box_width * nbGenDscFound + box_width * (nbGenDscFound - 1) * linkRatio + 2.0 * margeX;
	h0 = box_height * svgElts[0][SVGELT_NB] + 2.0 * margeY;
}

function buildDscTree()
{
	buildDscTreeSub(0, 0, svgElts[0][SVGELT_NB], nbGenDscFound, nbGenDscFound - 1, true);
}

function buildDscTreeSub(x_elt, a, b, nb_gens, offsetx, print_center, parent_x, parent_y)
{
	var lev = svgElts[x_elt][SVGELT_LEV];
	var box_width = Math.min(coordX / nb_gens, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = Math.min(box_width, svgElts[x_elt][SVGELT_NB] * box_width / txtRatio);
	var x = box_width * (1.0 + linkRatio) * (offsetx - lev);
	var y = (a + b) / 2.0 * box_width / txtRatio;
	if (print_center || lev > 0)
		svgElts[x_elt][SVGELT_CMD].push('rectangle(' + [x, y - box_height / 2.0, box_width, box_height, x_elt, lev].join(',') + ');');
	if (typeof(parent_x) == 'number')
	{
		// Draw links
		svgElts[x_elt][SVGELT_CMD].push('line(' + [parent_x, parent_y, x + box_width, y].join(',') + ');');
	}
	var c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildDscTreeSub(x_next, c, c + da, nb_gens, offsetx, print_center, x, y);
		c += da;
	}
}

//=========================================== Arbre descendant avec epoux
function initDscTreeSpou()
{
	calcDsc(search.Idx, 0, true);
	svgElts = svgChildren;
	var nb_gens = (nbGenDscFound * 2 - 1);
	var box_width = Math.min(coordX / nb_gens, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = box_width / txtRatio;
	maxTextWidth = box_width;
	x0 = -margeX;
	y0 = -margeY;
	w0 = box_width * nb_gens + box_width * (nb_gens - 1) * linkRatio + 2.0 * margeX;
	h0 = box_height * svgElts[0][SVGELT_NB] + 2.0 * margeY;
}

function buildDscTreeSpou()
{
	var nb_gens = (nbGenDscFound * 2 - 1);
	buildDscTreeSpouSub(0, 0, svgElts[0][SVGELT_NB], nbGenDscFound * 2 - 1, nb_gens - 1, true);
}

function buildDscTreeSpouSub(x_elt, a, b, nb_gens, offsetx, print_center, parent_x, parent_y)
{
	var lev = svgElts[x_elt][SVGELT_LEV];
	var box_width = Math.min(coordX / nb_gens, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = Math.min(box_width, svgElts[x_elt][SVGELT_NB] * box_width / txtRatio);
	var x = box_width * (1.0 + linkRatio) * (offsetx - lev * 2);
	var y = (a + b) / 2.0 * box_width / txtRatio;
	if (print_center || lev > 0)
		svgElts[x_elt][SVGELT_CMD].push('rectangle(' + [x, y - box_height / 2.0, box_width, box_height, x_elt, lev].join(',') + ');');
	if (typeof(parent_x) == 'number')
	{
		// Draw links
		svgElts[x_elt][SVGELT_CMD].push('line(' + [parent_x, parent_y, x + box_width, y].join(',') + ');');
	}
	var spou_offset = (svgElts[x_elt][SVGELT_NEXT_SPOU].length > 0) ? -box_width : 0;
	var c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT][i];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		buildDscTreeSpouSub(x_next, c, c + da, nb_gens, offsetx, print_center, x + spou_offset, y);
		c += da;
	}
	c = a;
	for (var i = 0; i < svgElts[x_elt][SVGELT_NEXT_SPOU].length; i++)
	{
		var x_next = svgElts[x_elt][SVGELT_NEXT_SPOU][i];
		var da = 1.0 * (b - a) * svgElts[x_next][SVGELT_NB] / svgElts[x_elt][SVGELT_NB];
		svgElts[x_next][SVGELT_CMD].push('rectangle(' + [x - box_width, y - box_height / 2.0, box_width, box_height, x_next, lev].join(',') + ');');
		c += da;
	}
}


//=========================================== Arbre ascendant+descendant

function initBothTreeSub(prop, print_spouses)
{
	calcAsc(search.Idx, 0);
	calcDsc(search.Idx, 0, print_spouses);
	var maxN = Math.max(svgParents[0][SVGELT_NB], svgChildren[0][SVGELT_NB]);
	var ratio = 1.0 * maxN / svgParents[0][SVGELT_NB];
	for (var i = 0; i < svgParents.length; i++) svgParents[i][SVGELT_NB] *= ratio;
	ratio = 1.0 * maxN / svgChildren[0][SVGELT_NB];
	for (var i = 0; i < svgChildren.length; i++) svgChildren[i][SVGELT_NB] *= ratio;
	mergeSVGelts();
	var nb_gens = nbGenAscFound + (print_spouses ? (nbGenDscFound * 2 - 1) : nbGenDscFound) - 1;
	var box_width = Math.min(coordX / nb_gens, coordY / svgElts[0][SVGELT_NB] * txtRatio);
	var box_height = box_width / txtRatio;
	maxTextWidth = box_width;
	x0 = -margeX;
	y0 = -margeY;
	w0 = box_width * nb_gens + box_width * (nb_gens - 1) * linkRatio + 2.0 * margeX;
	h0 = box_height * svgElts[0][SVGELT_NB] + 2.0 * margeY;
}

function buildBothTreeSub(prop, print_spouses)
{
	var center1 = svgParents[0];
	var center2 = svgChildren[0];
	var nb_gens = nbGenAscFound + (print_spouses ? (nbGenDscFound * 2 - 1) : nbGenDscFound) - 1;
	// Ascendants
	svgElts[0] = center1;
	if (prop) buildAscTreeSub(0, 0, svgElts[0][SVGELT_NB], depNum, nb_gens, nb_gens - nbGenAscFound);
	else ;
	// Descendants
	svgElts[0] = center2;
	if (print_spouses) buildDscTreeSpouSub(0, 0, svgElts[0][SVGELT_NB], nb_gens, nb_gens - nbGenAscFound, false);
	else buildDscTreeSub(0, 0, svgElts[0][SVGELT_NB], nb_gens, nb_gens - nbGenAscFound, false);
	// Texte central
	svgElts[0] = center1;
}

function initBothTreeProp()
{
	initBothTreeSub(true, false);
}
function buildBothTreeProp()
{
	buildBothTreeSub(true, false);
}

function initBothTreePropSpou()
{
	initBothTreeSub(true, true);
}
function buildBothTreePropSpou()
{
	buildBothTreeSub(true, true);
}


//=========================================== Shapes
function cCircle(r, x_elt)
{
	var idx = svgElts[x_elt][SVGELT_IDX];
	// Create center for Circle graphs
	var p = svgPaper.circle(0, 0, r * coordX);
	// Create text
	var x = r * coordX * 0.87;
	var y = r * coordY * 0.5;
	var text = textRect(-x, -y, x, y, x_elt);
	// Build the SVG elements style
	SvgSetStyle(p, text, x_elt, 0);
}

function cCircleHemi(r, a1, a2, x_elt)
{
	var idx = svgElts[x_elt][SVGELT_IDX];
	// Create center for CircleHemi graphs
	var ap = 'M ' + (coordX * r * Math.sin(a1)) + ',' + (-coordY * r * Math.cos(a1)) +
			arcPath(r,a1,a2,1) +
			' z';
	var p = svgPaper.path(ap);
	// Create text
	var x = r * coordX * 0.87;
	var y = r * coordY * 0.5;
	var y2 = r * coordY * Math.sin(hemiA);
	var text = textRect(-x, -y, x, Math.min(y, y2), x_elt);
	// Build the SVG elements style
	SvgSetStyle(p, text, x_elt, 0);
}

function cCircleBoth(r1, r2, x_elt)
{
	var idx = svgElts[x_elt][SVGELT_IDX];
	// Create center for CircleBoth graphs
	var ap = 'M ' + (-coordX * r1) + ',' + 0 +
			arcPath(r1, -Math.PI/2, Math.PI/2, 1) +
			' L ' + (coordX * r2) + ',' + 0 +
			arcPath(r2, Math.PI/2, 3*Math.PI/2, 1) +
			' z';
	var p = svgPaper.path(ap);
	// Create text
	var x = coordX * Math.min(r1, r2) * 0.87;
	var y = coordX * Math.min(r1, r2) * 0.5;
	var text = textRect(-x, -y, x, y, x_elt);
	// Build the SVG elements style
	SvgSetStyle(p, text, x_elt, 0);
}

function line(x1, y1, x2, y2)
{
	var p = svgPaper.path(['M', x1, y1, 'L', x2, y2]);
	p.node.setAttribute('class', 'svg-line');
}

function calcTextTab(tab, n)
{
	var i, j, l = tab.length;
	if (l <= n)
	{
		var t = arrayCopy(tab);
		for (i=l; i<n; i++) t[i] = '';
		return(t);
	}
	j = 0;
	for (i = 0; i < l; i++) j = Math.max(j, tab[i].length);
	NEWSZ:for (; j<1000; j++)
	{
		var t = [];
		for (i = 0; i < n; i++) t[i] = '';
		var o = 0;
		for (i = 0; i < l; i++)
		{
			if (tab[i].length > j) continue NEWSZ;
			if (tab[i].length + t[o].length >= j)
			{
				o++;
				if (o >= n) continue NEWSZ;
				t[o] = tab[i];
			}
			else
			{
				t[o] += ' ' + tab[i];
			}
		}
		return(t);
	}
}

function calcTextTabSize(tab, n)
{
	tab = calcTextTab(tab, n);
	var i, sz = 0;
	for (i = 0; i < tab.length; i++)
	{
		sz = Math.max(sz, tab[i].length);
	}
	return(sz);
}

// function textPath(p, tab, w, h)
// {
	// return;
	// Calcul de la taille de police et des lignes
	// var fs = 0;
	// var i, fi = 0;
	// for (i = 0; i < tab.length; i++)
	// {
		// var sz = calcTextTabSize(tab, i+1);
		// var nfs = Math.round(Math.min(fontFactorX * w / sz, fontFactorY * h / (i+1)));
		// nfs = Math.min(nfs, Math.round(maxTextWidth * fontFactorX / txtRatio));
		// if (nfs > fs)
		// {
			// fs = nfs;
			// fi = i;
		// }
	// }
	// tab = calcTextTab(tab, fi+1);
	// Dessin
	// var ai = 'pid_' + tpid;
	// var p2 = SVGDoc.createElementNS(xmlns, 'path');
	// p2.setAttributeNS(null, 'd', p);
	// p2.setAttributeNS(null, 'id', ai);
	// SVGDefs.appendChild(p2);
	// for (i = 0; i < tab.length; i++)
	// {
		// var svgt = SVGDoc.createElementNS(xmlns, 'text');
		// svgt.setAttributeNS(null, 'font-size', fs);
		// svgt.setAttributeNS(null, 'fill', 'black');
		// svgPaper.appendChild(svgt);

		// var dy = (Math.round((0.8 - tab.length/2 + i) * 100) / 100) + 'em';
		// var dy = (Math.round((0.8 - tab.length/2 + i) * 100) / 100) * fs;
		// var q = SVGDoc.createElementNS(xmlns, 'textPath');
		// q.setAttributeNS(xlink, 'xlink:href', '#'+ai);
		// q.setAttributeNS(null, 'startOffset', '50%');

		// svgt.appendChild(q);
		// var s = SVGDoc.createElementNS(xmlns, 'tspan');
		// s.setAttributeNS(null, 'dy', dy);
		// var blanc =  SVGDoc.createTextNode('\n');
		// q.appendChild(blanc);
		// q.appendChild(s);
		// var u = SVGDoc.createTextNode(tab[i]);
		// s.appendChild(u);
		// /*
		// q.setAttributeNS(null, 'dy', dy);
		// svgt.appendChild(q);
		// var u = SVGDoc.createTextNode(tab[i]);
		// q.appendChild(u);
		// */
	// }
	// tpid++;
// }

function textLine(x, y, a, txt, w, h, x_elt)
{
	var idx = svgElts[x_elt][SVGELT_IDX];
	// Calcul de la taille de police et des lignes
	var tab = txt.split(/[ \-]+/g);
	var fs = 0;
	var i, fi = 0;
	for (i = 0; i < tab.length; i++)
	{
		var sz = calcTextTabSize(tab, i+1);
		var nfs = Math.round(Math.min(fontFactorX * w / sz, fontFactorY * h / (i+1)));
		nfs = Math.min(nfs, Math.round(maxTextWidth * fontFactorX / txtRatio));
		if (nfs > fs)
		{
			fs = nfs;
			fi = i;
		}
	}
	tab = calcTextTab(tab, fi+1);
	txt = tab.join('\n');
	// Dessin
	var text = svgPaper.text(x, y, txt);
	var fs0 = Math.max(10, Math.round(20 / viewScale));
	text.attr('font-size', '' + fs0);
	var bbox = text.getBBox();
	var fs = Math.min(w / bbox.width, h / bbox.height);
	text.attr('font-size', fs0 * fs);
	text.transform('r' + a * 180 / Math.PI);
	return(text);
}

function arcPath(r, a1, a2, sweep)
{
	with(Math){
	var p = '';
	var n = floor(abs(a2 - a1) * 2 / PI) + 1;
	var i;
	for (i=1; i<=n; i++)
	{
		p += ' A ' + (coordX * r) + ',' + (coordY * r) +
			' 0 0,' + sweep + ' ' +
			(coordX * r * sin(a1+(a2-a1)*i/n)) + ',' + (-coordY * r * cos(a1+(a2-a1)*i/n));
	}
	} // with(Math)
	return(p);
}

function secteur(a1, a2, r1, r2, x_elt, lev)
{
	with(Math){
	var idx = svgElts[x_elt][SVGELT_IDX];
	// Create sector
	while (a1 < 0) {a1 += 2*PI; a2 += 2*PI;}
	while (a1 > 2*PI) {a1 -= 2*PI; a2 -= 2*PI;}
	var ap1 = (coordX * r1 * sin(a1)) + ',' + (-coordY * r1 * cos(a1));
	var ap2 = (coordX * r1 * sin(a2)) + ',' + (-coordY * r1 * cos(a2));
	var ap3 = (coordX * r2 * sin(a1)) + ',' + (-coordY * r2 * cos(a1));
	var ap4 = (coordX * r2 * sin(a2)) + ',' + (-coordY * r2 * cos(a2));
	var ap = 'M ' + ap2 + arcPath(r1, a2, a1, 0) + ' L ' + ap3 + arcPath(r2, a1, a2, 1) + ' z';
	var p = svgPaper.path(ap);
	// Create text over the sector
	var txt = GetTextI(idx);
	var r = (r1 + r2) / 2;
	var a = (a1 + a2) / 2;
	var w = coordX * (r2 - r1);
	var h = coordX * r * min(abs(sin(acos(r1 / r2))), abs(a2 - a1));
	var ta = a;
	if (w < h)
	{
		var tmp = w;
		w = h;
		h = tmp;
	}
	else
	{
		ta = a + PI/2;
	}
	while (ta > 2*PI) ta -= 2*PI;
	if ((ta > PI/2) && (ta < 3*PI/2)) ta += PI;
	var text = textLine(coordX * r * sin(a), -coordY * r * cos(a), ta, txt, w, h, x_elt);
	// Build the SVG elements style
	SvgSetStyle(p, text, x_elt, lev);
	} // with(Math)
}

function rectangle(x, y, w, h, x_elt, lev)
{
	with(Math){
	var idx = svgElts[x_elt][SVGELT_IDX];
	// Create rectangle
	var p = svgPaper.rect(x, y, w, h);
	// Create text over the sector
	var txt = GetTextI(idx);
	var tw = w;
	var th = h;
	var ta = 0;
	if (w < h)
	{
		var tmp = tw;
		tw = th;
		th = tmp;
		ta = -PI/2;
	}
	var text = textLine(x + w / 2.0, y + h / 2.0, ta, txt, tw, th, x_elt);
	// Build the SVG elements style
	SvgSetStyle(p, text, x_elt, lev);
	} // with(Math)
}

function textRect(x1, y1, x2, y2, x_elt)
{
	var idx = svgElts[x_elt][SVGELT_IDX];
	var txt = GetTextI(idx);
	return textLine((x1 + x2) / 2, (y1 + y2) / 2, 0, txt, x2 - x1, y2 - y1, x_elt);
}

function GetTextI(idx)
{
	if (idx < 0) return('?');
	return(I[idx][I_SHORT_NAME]);
}
