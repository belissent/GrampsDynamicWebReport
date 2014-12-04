// Gramps - a GTK+/GNOME based genealogy program
//
// Copyright (C) 2014 Pierre Bélissent
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA


$(document).ready(function(){
	bodyDecorate();
});


//=================================================================
//============================================================ Body
//=================================================================

function bodyDecorate()
{
	SearchInit();
	
	var tocless = false;
	if ($(".tocless").length > 0) tocless = true;
	
	$("body").wrapInner("<div id='body_page'><div id='body_page_inner'></div></div>");
	
	if (!tocless)
	{
		buildTOC();
	}
	if (!tocless || searchEmbedded)
	{
		searchEvents();
	}
	
	// Text for the header
	if (HEADER != "") $("body").prepend(
		"<div id='header'>" +
		"<div id='header_inner'>" +
		HEADER +
		"</div></div>");
		
	// Div for the simple tree
	$("body").append(
		"<div id='body_tree'>" +
		"<div id='body_tree_inner'>" +
		"</div></div>");
	$("#body_tree").hide();
		
	// Text for the footer
	if ((FOOTER + COPYRIGHT) != "") $("body").append(
		"<div id='footer'>" +
		"<div id='footer_inner'>" +
		FOOTER + COPYRIGHT +
		"</div></div>");
}

function bodyLayout()
{
	/*
	var h = $("#body_page").height();
	if (h < 500) $("#body_page").css("height", 500);
	*/
	// var m = $("#toc").margin();
	// var p = $("#toc").padding();
	// var b = $("#toc").border();
	// var tocw = $("#toc").width() + p.left + b.left + m.left + p.right + b.right + m.right;
	// var toch = $("#toc").height() + p.top + b.top + m.top + p.bottom + b.bottom + m.bottom;
	// m = $("#body_page").margin();
	// p = $("#body_page").padding();
	// b = $("#body_page").border();
	// var pageh = $("#body_page").height() + p.top + b.top + m.top + p.bottom + b.bottom + m.bottom;
	// h = Math.max(toch, pageh);
	// $("#body_page").css("left", tocw);
	// $("#body_page").css("height", h);
	// $("#toc").css("height", h);
	// $("#copr").css("top", h);
}

function bodyContentsMaxSize()
{
	var w = $(window).width();
	var h = $(window).height();
	if ($("#header").length > 0) h -= $("#header").outerHeight();
	if ($("#footer").length > 0) h -= $("#footer").outerHeight();
	if ($("div.menu").length > 0) h -= $("div.menu").outerHeight();
	if ($("div.form").length > 0) h -= $("div.form").outerHeight();
	var size = {"width": w, "height": h}
	size = innerDivNetSize(size, $("body"));
	size = innerDivNetSize(size, $("#body_page"));
	size = innerDivNetSize(size, $("#body_page_inner"));
	return(size);
}

function innerDivNetSize(size, div)
{
	var w = size.width;
	var h = size.height;
	if (div && div.length > 0)
	{
		var m = div.margin();
		var p = div.padding();
		var b = div.border();
		w -= p.left + b.left + m.left + p.right + b.right + m.right;
		h -= p.top + b.top + m.top + p.bottom + b.bottom + m.bottom;
	}
	return({"width": w, "height": h});
}


//=================================================================
//=================================================== Search string
//=================================================================

var FsearchTxt, FsearchAsc, FsearchDsc, FsearchSvgType;
var FsearchModified = [false, false];
var searchInitialized = false;
var searchEmbedded = false;

function SearchInit()
{
	if (searchInitialized) return;
	searchInitialized = true;
	FsearchTxt = "";
	FsearchAsc = 4;
	FsearchDsc = 4;
	FsearchSvgType = SVG_TREE_TYPE;
	searchIdx = -1;
	searchFdx = -1;
	searchMdx = -1;
	searchSdx = -1;
	searchPdx = -1;
	searchRdx = -1;
	searchSort = "";
	searchSurn = -1;
	var i = location.href.indexOf("?");
	if (i >= 0)
	{
		// Get the query after the file name, if there is one
		var s = location.href.substr(i+1);
		// Remove the anchor at the end, if there is one
		s = s.substring(0, (s.indexOf("#") == -1) ? s.length : s.indexOf("#"));
		// Parse query string
		s=unescape(s);
		s = s.replace(/\+/g, " ");
		s = s.replace(/&([^#])/g, "\";$1");
		s = s.replace(/=/g, "=\"") + "\"";
		s = s.replace(/"on"/g, "\"1\"");
		s = s.replace(/"off"/g, "\"0\"");
		s = s.replace(/"true"/g, "\"1\"");
		s = s.replace(/"false"/g, "\"0\"");
		eval(s);
		FsearchAsc = (typeof(FsearchAsc) == 'string') ? parseInt(FsearchAsc) : 4;
		FsearchDsc = (typeof(FsearchDsc) == 'string') ? parseInt(FsearchDsc) : 4;
		FsearchSvgType = (typeof(FsearchSvgType) == 'string') ? parseInt(FsearchSvgType) : SVG_TREE_TYPE;
		if (isNaN(FsearchAsc)) FsearchAsc = 4;
		if (isNaN(FsearchDsc)) FsearchDsc = 4;
		if (isNaN(FsearchSvgType)) FsearchSvgType = SVG_TREE_TYPE;
		searchImgList = (typeof(searchImgList) !== 'undefined') ? eval(searchImgList) : [];
		searchIdx = (typeof(idx) == 'undefined') ? -1 : parseInt(idx) - 1;
		searchFdx = (typeof(fdx) == 'undefined') ? -1 : parseInt(fdx) - 1;
		searchMdx = (typeof(mdx) == 'undefined') ? -1 : parseInt(mdx) - 1;
		searchSdx = (typeof(sdx) == 'undefined') ? -1 : parseInt(sdx) - 1;
		searchPdx = (typeof(pdx) == 'undefined') ? -1 : parseInt(pdx) - 1;
		searchRdx = (typeof(rdx) == 'undefined') ? -1 : parseInt(rdx) - 1;
		searchSurn = (typeof(surn) == 'undefined') ? -1 : parseInt(surn) - 1;
		if (searchMdx != -1 && searchImgList.length == 0) searchImgList = [searchMdx];
	}
}

function buildSearchString(new_idx, new_fdx, new_mdx, new_sdx, new_pdx, new_rdx, new_surn)
{
	searchIdx = (typeof(searchIdx) == 'undefined') ? -1 : searchIdx;
	searchFdx = (typeof(searchFdx) == 'undefined') ? -1 : searchFdx;
	searchMdx = (typeof(searchMdx) == 'undefined') ? -1 : searchMdx;
	searchSdx = (typeof(searchSdx) == 'undefined') ? -1 : searchSdx;
	searchPdx = (typeof(searchPdx) == 'undefined') ? -1 : searchPdx;
	searchRdx = (typeof(searchRdx) == 'undefined') ? -1 : searchRdx;
	searchSurn = (typeof(searchSurn) == 'undefined') ? -1 : searchSurn;
	new_idx = (typeof(new_idx) !== 'undefined') ? new_idx : searchIdx;
	new_fdx = (typeof(new_fdx) !== 'undefined') ? new_fdx : searchFdx;
	new_mdx = (typeof(new_mdx) !== 'undefined') ? new_mdx : searchMdx;
	new_sdx = (typeof(new_sdx) !== 'undefined') ? new_sdx : searchSdx;
	new_pdx = (typeof(new_pdx) !== 'undefined') ? new_pdx : searchPdx;
	new_rdx = (typeof(new_rdx) !== 'undefined') ? new_rdx : searchRdx;
	new_surn = (typeof(new_surn) !== 'undefined') ? new_surn : searchSurn;
	new_idx = (new_idx != -1) ? new_idx : searchIdx;
	new_fdx = (new_fdx != -1) ? new_fdx : searchFdx;
	new_mdx = (new_mdx != -1) ? new_mdx : searchMdx;
	new_sdx = (new_sdx != -1) ? new_sdx : searchSdx;
	new_pdx = (new_pdx != -1) ? new_pdx : searchPdx;
	new_rdx = (new_rdx != -1) ? new_rdx : searchRdx;
	new_surn = (new_surn != -1) ? new_surn : searchSurn;
	var txt = "";
	if (tocSearchCleared[0] && $("#FsearchTxt").length > 0)
		txt = escape(document.Fsearch.FsearchTxt.value);
	if (tocSearchCleared[1] && $("#Fsearch2Txt").length > 0)
		txt = escape(document.Fsearch2.Fsearch2Txt.value);
	var s = "FsearchTxt=" + txt;
	var newFsearchAsc = $("#FsearchAsc").val() || FsearchAsc || 4;
	var newFsearchDsc = $("#FsearchDsc").val() || FsearchDsc || 4;
	if (true || !(FsearchModified[0] || FsearchModified[1])) s +=
		((new_idx >= 0) ? "&idx=" + (new_idx + 1) : "") +
		((new_fdx >= 0) ? "&fdx=" + (new_fdx + 1) : "") +
		((new_mdx >= 0) ? "&mdx=" + (new_mdx + 1) : "") +
		((new_sdx >= 0) ? "&sdx=" + (new_sdx + 1) : "") +
		((new_pdx >= 0) ? "&pdx=" + (new_pdx + 1) : "") +
		((new_rdx >= 0) ? "&rdx=" + (new_rdx + 1) : "") +
		((new_surn >= 0) ? "&surn=" + (new_surn + 1) : "") +
		"&FsearchAsc=" + newFsearchAsc +
		"&FsearchDsc=" + newFsearchDsc;
	if ($("#FsearchSvgType").length > 0)
		 s += "&FsearchSvgType=" + $("#FsearchSvgType").val();
	else
		 s += "&FsearchSvgType=" + FsearchSvgType;
	s = s.replace(/ /g, "+");
	return(s);
}


function redirect(url)
{
	window.location.href = url + "?" + buildSearchString();
}


//=================================================================
//====================================================== Formulaire
//=================================================================

function FsearchExec(n)
{
	FsearchModified[n] = true;
	tocSearchCleared[1 - n] = false;
	searchIdx = -1;
	searchFdx = -1;
	searchMdx = -1;
	searchSdx = -1;
	searchPdx = -1;
	searchRdx = -1;
	treeRef();
	return(false);
}


var tocButtonIndex = -1;
var tocSearchCleared = [false, false];

function buildTOC()
{
	// Get current page
	var ad = window.location.href;
	ad = ad.replace(/\?.*/, "");
	ad = ad.replace(/.*\//, "");
	var i;
	
	// Get current menu item
	menu_fallback = {
		"indi.html": "persons.html",
		"persons.html": "indi.html",
		"families.html": "fam.html",
		"fam.html": "families.html",
		"sources.html": "sour.html",
		"sour.html": "sources.html",
		"medias.html": "media.html",
		"media.html": "medias.html",
		"places.html": "place.html",
		"place.html": "places.html",
		"surnames.html": "surname.html",
		"surname.html": "surnames.html"
	}
	var i_current = -1;
	var i_current_fallback = -1;
	for (i=0; i<PAGES_TITLE.length; i++)
	{
		if (PAGES_FILE[i].indexOf(ad) >= 0)
		{
			// This menu item is the current page
			tocButtonIndex = i;
			i_current = i;
		}
		if (menu_fallback[PAGES_FILE[i]] && menu_fallback[PAGES_FILE[i]].indexOf(ad) >= 0)
		{
			// This menu item could be the current page
			i_current_fallback = i;
		}
	}
	if (i_current == -1) i_current = i_current_fallback;
	
	// Text for the menu
	var txt_menu = "";
	for (i=0; i<PAGES_TITLE.length; i++)
	{
		var addclass = "";
		if (i == i_current) addclass = " menu_item_current";
		if (i == tocButtonIndex)
		{
			txt_menu += "<span class='menu_button menu_item_current'>";
			txt_menu += PAGES_TITLE[i] + "</span>";
		}
		else
		{
			txt_menu += "<a class='menu_button" + addclass;
			txt_menu += "' href='javascript:redirect(\"" + toRoot + PAGES_FILE[i] + "\")'>";
			txt_menu += PAGES_TITLE[i] + "</a>";
		}
	}	
	
	// Text for the form
	var txt_form = "";
	txt_form += "<form class='menu_form' method='get' name='Fsearch' onsubmit='return FsearchExec(0)'>";
	txt_form += "<div class='menu_item'><input type='text' id='FsearchTxt' name='FsearchTxt' class='FsearchTxt FsearchTxt_init' maxlength='300'/></div>";
	txt_form += "<div class='menu_search'><img src='" + scriptFolder + "loupe.gif' alt='" + _("Search") + "'></div>";
	txt_form += "<span id='menu_form_tree_buttons' class='hidden'>";
	txt_form += "<div class='menu_item_tree'>" + _("Ancestry") +":</div>";
	txt_form += "<div class='menu_item_tree menu_item_tree_control'><select name='FsearchAsc' id='FsearchAsc' class='FsearchGen' size='1'>";
	for (i = 0; i < NB_GENERATIONS_MAX; i++)
	{
		txt_form += "<option value='" + i + "'" + ((FsearchAsc == i) ? " selected" : "") + ">" + i + "</option>";
	}
	txt_form +=
		"</select></div>" +
		"<div class='menu_item_tree'>" + _("Descendants") +":</div>" +
		"<div class='menu_item_tree menu_item_tree_control'><select name='FsearchDsc' id='FsearchDsc' class='FsearchGen' size='1'>";
	for (i = 0; i < NB_GENERATIONS_MAX; i++)
	{
		txt_form += "<option value='" + i + "'" + ((FsearchDsc == i) ? " selected" : "") + ">" + i + "</option>";
	}
	txt_form += "</select></div>";
	txt_form += "</span></form>";
	
	// Text for the menu and form
	var txt1 = "<div class='form'><div class='form_inner'>";
	var txt2 = "<div class='menu'><div class='menu_inner' id='menu' role='navigation'>";
	var txt3 = "</div></div>";
	var txt = "";
	if (FORM_ABOVE_MENU)
		txt = txt1 + txt_form + txt3 + txt2 + txt_menu + txt3;
	if (FORM_BELOW_MENU)
		txt = txt2 + txt_menu + txt3 + txt1 + txt_form + txt3;
	if (FORM_NEXT_TO_MENU)
		txt = txt2 + txt_menu + txt_form + txt3;
	$("body").prepend(txt);

	// $(".menu_button").click(function()
	// {
		// id = $(this).attr("id");
		// id = parseInt(id.replace("menu_button", ""));
		// if (id != tocButtonIndex)
			// window.location.href = toRoot + PAGES_FILE[id] + "?" + buildSearchString();
		// return(false);
	// }).mouseenter(function()
	// {
		// id = $(this).attr("id");
		// id = parseInt(id.replace("menu_button", ""));
		// if (id != tocButtonIndex)
			// $(this).toggleClass("menu_button_on", true).css('cursor', 'pointer');
		// else
			// $(this).css('cursor', 'default');
	// }).mouseleave(function()
	// {
		// id = $(this).attr("id");
		// id = parseInt(id.replace("menu_button", ""));
		// if (id != tocButtonIndex)
			// $(this).toggleClass("menu_button_on", false).css('cursor', 'auto');
		// else
			// $(this).css('cursor', 'auto');
	// });
	
	$(".FsearchGen").change(function()
	{
		var n = $(this).attr("name");
		var v = $(this).val();
		eval(n + "=" + v);
		treeRef();
	});
}


function searchEvents()
{	
	if (FsearchTxt != "")
	{
		tocSearchCleared[0] = true;
		tocSearchCleared[1] = true;
		$("#FsearchTxt").toggleClass("FsearchTxt_init", false).val(FsearchTxt);
		$("#Fsearch2Txt").toggleClass("FsearchTxt_init", false).val(FsearchTxt);
	}
	else
	{
		$("#FsearchTxt").val(_("Person to search for"));
		$("#Fsearch2Txt").val(_("Person to search for"));
	}
	
	$(".menu_search").click(function()
	{
		var id = $(this).parent().find("input:text").attr('id');
		var n = (id == "Fsearch2Txt")? 1: 0;
		if (!tocSearchCleared[n]) $(this).parent().find("input:text").val("");
		tocSearchCleared[n] = true;
		FsearchExec(n);
		return(false);
	}).mouseenter(function()
	{
		$(this).toggleClass("menu_button_on", true).css('cursor', 'pointer');
		$(this).prev().toggleClass("menu_button_on", true).css('cursor', 'pointer');
		$(this).find("img").attr("src", scriptFolder + "loupe_over.gif");
	}).mouseleave(function()
	{
		$(this).toggleClass("menu_button_on", false).css('cursor', 'auto');
		$(this).prev().toggleClass("menu_button_on", false).css('cursor', 'auto');
		$(this).find("img").attr("src", scriptFolder + "loupe.gif");
	});
	
	$("#FsearchTxt").change(function()
	{
		tocSearchCleared[0] = true;
		$(this).toggleClass("FsearchTxt_init", false);
	}).click(function()
	{
		if (!tocSearchCleared[0]) $(this).val("");
		tocSearchCleared[0] = true;
		$(this).toggleClass("FsearchTxt_init", false);
	}).focus(function()
	{
		if (!tocSearchCleared[0]) $(this).val("");
		tocSearchCleared[0] = true;
		$(this).toggleClass("FsearchTxt_init", false);
	});
	
	$("#Fsearch2Txt").change(function()
	{
		tocSearchCleared[1] = true;
		$(this).toggleClass("FsearchTxt_init", false);
	}).click(function()
	{
		if (!tocSearchCleared[1]) $(this).val("");
		tocSearchCleared[1] = true;
		$(this).toggleClass("FsearchTxt_init", false);
	}).focus(function()
	{
		if (!tocSearchCleared[1]) $(this).val("");
		tocSearchCleared[1] = true;
		$(this).toggleClass("FsearchTxt_init", false);
	});
}

function embedSearch()
{
	var txt = "";
	txt += "<div class='embed_search'>";
	txt += "<form class='menu_form' method='get' name='Fsearch2' onsubmit='return FsearchExec(1)'>";
	txt += "<div class='menu_item'><input type='text' id='Fsearch2Txt' name='Fsearch2Txt' class='FsearchTxt FsearchTxt_init' maxlength='300' style='width:400;'></div>";
	txt += "<div class='menu_search'><img src='" + scriptFolder + "loupe.gif' alt='" + _("Search") + "'></div>";
	txt += "</form>";
	txt += "</div>";
	document.write(txt);
	Fsearch2Modified = false;
	searchEmbedded = true;
}
