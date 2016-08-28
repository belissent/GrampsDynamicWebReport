﻿// Gramps - a GTK+/GNOME based genealogy program
//
// Copyright (C) 2014 Pierre Bélissent
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA

"use strict";


//=================================================================
//==================================================== Localisation
//=================================================================

function _(text)
{
	if (__[text]) return(__[text]);
	return(text);
}


//=================================================================
//=================================== Database exported from Gramps
//=================================================================

// Access to databases

function I(x, field) {return GetDb("I", x, field)}
function F(x, field) {return GetDb("F", x, field)}
function S(x, field) {return GetDb("S", x, field)}
function C(x, field) {return GetDb("C", x, field)}
function R(x, field) {return GetDb("R", x, field)}
function M(x, field) {return GetDb("M", x, field)}
function P(x, field) {return GetDb("P", x, field)}
function N(x, field) {return GetDb("N", x, field)}

// Exception for abort and wait for script loading
function WaitScriptLoad() {}

var nbScriptsToLoad = 0; // Number of database scripts being currently loaded
var rebuildPageAfterScriptLoad = false; // Request a restart of the page after script load

function GetDb(name, x, field)
{
	var i = Math.floor(x / SPLIT);
	var partial = name + '_' + field + '_' + i;
	if (!window[partial])
	{
		// Script 'db_dwr_*' has to be loaded
		var file = 'dwr_db_' + partial + '.js';
		PreloadScripts([file], true);
	}
	return(window[partial][x % SPLIT]);
}

function NameSplitScripts(name, field)
{
	var scripts = [];
	for (var i = 0; i < DB_SIZES[name] / SPLIT; i++)
	{
		var partial = name + '_' + field + '_' + i;
		if (!window[partial])
		{
			scripts.push('dwr_db_' + partial + '.js');
		}
	}
	return scripts;
}

function NameFieldScripts(name, x, fields)
{
	var scripts = [];
	for (var i = 0; i < fields.length; i++)
	{
		var partial = name + '_' + fields[i] + '_' +  Math.floor(x / SPLIT);;
		if (!window[partial])
		{
			scripts.push('dwr_db_' + partial + '.js');
		}
	}
	return scripts;
}

function PreloadScripts(scripts, rebuildPage)
{
	if (scripts.length == 0) return;
	rebuildPage = (typeof(rebuildPage) !== 'undefined') ? rebuildPage : false;
	console.log("Loading " + scripts);
	// Remove duplicates
	var uniques = [];
	while (scripts.length > 0)
	{
		var s = scripts.pop();
		if ($.inArray(s, uniques) < 0) uniques.push(s);
	}
	// Increment the number of database scripts being loaded
	nbScriptsToLoad += uniques.length;
	// Load scripts in the stream of the document (works with both file:// and http:// protocols)
	for (var j = 0; j < uniques.length; j += 1)
	{
		document.write('<script language="javascript" src="' + uniques[j] + '" charset="UTF-8"' +
			// ((rebuildPage && j == uniques.length - 1) ? ' onload="scriptLoaded(\'' + uniques + '\');"' : '') +
			'><\/script>');
	}
	// Re-compute the page once the script is downloaded
	if (rebuildPage)
	{
		rebuildPageAfterScriptLoad = true;
		throw new WaitScriptLoad();
	}
}

function scriptLoaded(file)
{
	console.log("Loaded " + file);
	nbScriptsToLoad -= 1;
	if (nbScriptsToLoad == 0 && rebuildPageAfterScriptLoad)
	{
		rebuildPageAfterScriptLoad = false;
		DwrMainRun();
	}
}

function ScriptIsLoading()
{
	return(nbScriptsToLoad);
}

function buildDataArray(table, field)
{
	// Optimization: Put all the data from the files 'db_dwr_<field>_*.js' into 1 big array, for easier access
	if (window[table + '_' + field]) return;
	var data = new Array(DB_SIZES[table]);
	for (var i = 0; i <= Math.floor(DB_SIZES[table] / SPLIT); i += 1)
	{
		var partial = window[table + '_' + field + '_' + i];
		if (!partial) continue;
		for (var x = 0; x < partial.length; x += 1)
		{
			data[SPLIT * i + x] = partial[x];
		}
	}
	window[table + '_' + field] = data;
}

//=================================================================
//======================================================= Constants
//=================================================================

// Events fallbacks

var EVENTS_BIRTH = [_('Birth'), _('Baptism'), _('Christening')];
var EVENTS_MARR = [_('Marriage'), _('Engagement'), _('Alternate Marriage')];
var EVENTS_DEATH = [_('Death'), _('Burial'), _('Cremation'), _('Cause Of Death')];


// Number of entries in the tables
// var A_LENGTH_MENU = [[10, 50, 100, 500, 1000, -1], [10, 50, 100, 500, 1000, _('all')]]
var A_LENGTH_MENU = [[10, 50, 100, 500, 1000, 5000], [10, 50, 100, 500, 1000,  5000]] // too long to render over 5000

// Type of the page
var i = 1;
var PAGE_HOME = i++;
var PAGE_INDI = i++;
var PAGE_FAM = i++;
var PAGE_SOURCE = i++;
var PAGE_MEDIA = i++;
var PAGE_PLACE = i++;
var PAGE_REPO = i++;
var PAGE_SEARCH = i++;
var PAGE_CONF = i++;
var PAGE_SVG_TREE = i++;
var PAGE_SVG_TREE_FULL = i++;
var PAGE_SVG_TREE_CONF = i++;
var PAGE_SVG_TREE_SAVE = i++;
var PAGE_STATISTICS = i++;
var PAGE_SURNAMES_INDEX = i++;
var PAGE_SURNAMES_INDEX2 = i++;
var PAGE_SURNAME_INDEX = i++;
var PAGE_PERSONS_INDEX = i++;
var PAGE_FAMILIES_INDEX = i++;
var PAGE_SOURCES_INDEX = i++;
var PAGE_MEDIA_INDEX = i++;
var PAGE_PLACES_INDEX = i++;
var PAGE_ADDRESSES_INDEX = i++;
var PAGE_REPOS_INDEX = i++;


//=================================================================
//=========================================================== Liens
//=================================================================

var PageFile = {
	'I': 'person.html',
	'F': 'family.html',
	'S': 'source.html',
	'M': 'media.html',
	'P': 'place.html',
	'R': 'repository.html'
};

var SearchStringField = {
	'I': 'Idx',
	'F': 'Fdx',
	'S': 'Sdx',
	'M': 'Mdx',
	'P': 'Pdx',
	'R': 'Rdx'
};

var UrlField = {
	'I': 'idx',
	'F': 'fdx',
	'S': 'sdx',
	'M': 'mdx',
	'P': 'pdx',
	'R': 'rdx'
};

function hrefFunction(table)
{
	// Returns a function that gives the address of URL for a given element of the <table>
	return function(dx, m_list) {
		m_list = (typeof(m_list) !== 'undefined') ? m_list : [];
		if (search.Mdx >= 0 && PageContents == PAGE_MEDIA)
		{
			m_list = search.ImgList;
		}
		var searchStringArgs = {
			MapExpanded: false,
			ImgList: m_list
		};
		dx = (typeof(dx) !== 'undefined') ? dx : search[SearchStringField[table]];
		searchStringArgs[SearchStringField[table]] = dx;
		var url = PageFile[table] + '?' + BuildSearchString(searchStringArgs);
		return(url);
	}
}

function refFunction(table)
{
	// Returns a function that leaves the current page and goes to the page of a given element of the <table>
	var f_url = hrefFunction(table);
	return function(dx, m_list) {
		window.location.href = f_url(dx, m_list);
		return(false);
	}
}

function optimizedHrefFunction(table)
{
	// Optimized version for hrefFunction
	// The search string is built only once for all
	// The returned function does not check for undefined parameter.
	// No possibility to specify a list of media
	var searchStringArgs = {
		MapExpanded: false // Reset map
	};
	searchStringArgs[SearchStringField[table]] = -1;
	var url = PageFile[table] + '?' + BuildSearchString(searchStringArgs) + '&' + UrlField[table] + '=';
	return function(dx) {
		return(url + dx);
	}
}

var indiHref = hrefFunction('I');
var indiRef = refFunction('I');
var famHref = hrefFunction('F');
var famRef = refFunction('F');
var mediaHref = hrefFunction('M');
var mediaRef = refFunction('M');
var sourceHref = hrefFunction('S');
var sourceRef = refFunction('S');
var placeHref = hrefFunction('P');
var placeRef = refFunction('P');
var repoHref = hrefFunction('R');
var repoRef = refFunction('R');

var indiHrefOptimized = optimizedHrefFunction('I')
var famHrefOptimized = optimizedHrefFunction('F');
var mediaHrefOptimized = optimizedHrefFunction('M');
var sourceHrefOptimized = optimizedHrefFunction('S');
var placeHrefOptimized = optimizedHrefFunction('P');
var repoHrefOptimized = optimizedHrefFunction('R');

function m_list_from_mr(mr_list)
{
	// Build a list of the media referenced in the list of media reference structure
	// This list is used for numbering media in the pagination (see "printMedia")
	var m_list = [];
	for (var j = 0; j < mr_list.length; j++)
		m_list[j] = mr_list[j].m_idx;
	return(m_list);
}

function searchHref()
{
	// Get the search page address
	return('search.html?' + BuildSearchString());
}

function svgHref(idx, expand)
{
	// Get the SVG tree page
	if (typeof(idx) == 'undefined') idx = search.Idx;
	if (typeof(expand) == 'undefined') expand = search.SvgExpanded;
	var page;
	if (expand)
	{
		page = 'tree_svg_full.html';
	}
	else
	{
		page = 'tree_svg.html';
	}
	return(page + '?' + BuildSearchString({
		Idx: idx,
		SvgExpanded: expand,
	}));
}

function svgRef(idx, expand)
{
	// Go to the SVG tree page
	window.location.href = svgHref(idx, expand);
	return(false);
}

function svgConfRef()
{
	// Go to the SVG tree configuration page
	window.location.href = 'tree_svg_conf.html?' + BuildSearchString();
	return(false);
}

function svgSaveRef()
{
	// Go to the SVG tree save-as page
	window.location.href = 'tree_svg_save.html?' + BuildSearchString();
	return(false);
}


//=================================================================
//====================================================== Duplicates
//=================================================================

// List of the persons index 'idx' of table 'I', that appear several times in the ancestors or descendants of the center person
var duplicates = [];


function searchDuplicate(idx)
{
	// Recursively search for duplicates in ancestors and descendants of person 'idx'
	// The search is limited to search.Asc ascending generations and search.Dsc descending generations

	duplicates = [];
	searchDuplicateAsc(idx, search.Asc, []);
	searchDuplicateDsc(idx, search.Dsc, []);
}


function searchDuplicateAsc(idx, lev, found)
{
	// Recursively search for duplicates in ancestors of person 'idx',
	// limited to "lev" generations.
	// "found" contains all the persons found in the tree traversal

	if (($.inArray(idx, found) >= 0) && ($.inArray(idx, duplicates) < 0))
	{
		duplicates.push(idx);
		return;
	}
	found.push(idx);
	if (lev <= 0) return;
	for (var x_fam = 0; x_fam < I(idx, 'famc').length; x_fam++)
	{
		var spou = F(I(idx, 'famc')[x_fam].index, 'spou');
		for (var x_spou = 0; x_spou < spou.length; x_spou++)
			searchDuplicateAsc(spou[x_spou], lev - 1, found);
	}
}


function searchDuplicateDsc(idx, lev, found)
{
	// Recursively search for duplicates in descendants of person 'idx',
	// limited to "lev" generations.
	// "found" contains all the persons found in the tree traversal

	if (($.inArray(idx, found) >= 0) && ($.inArray(idx, duplicates) < 0))
	{
		duplicates.push(idx);
	}
	found.push(idx);
	if (lev <= 0) return;
	for (var x_fam = 0; x_fam < I(idx, 'fams').length; x_fam++)
	{
		PreloadScripts(NameFieldScripts('F', I(idx, 'fams')[x_fam], ['spou', 'chil']), true);
		var spou = F(I(idx, 'fams')[x_fam], 'spou');
		var chil = F(I(idx, 'fams')[x_fam], 'chil');
		if (!isDuplicate(idx))
			for (var x_chil = 0; x_chil < chil.length; x_chil++)
				searchDuplicateDsc(chil[x_chil].index, lev - 1, found);
		for (var x_spou = 0; x_spou < chil.length; x_spou++)
			if (idx != spou[x_spou])
				searchDuplicateDsc(spou[x_spou], -1, found);
	}
}


function isDuplicate(idx)
{
	return($.inArray(idx, duplicates) >= 0);
}


//=================================================================
//================================= Text for individuals / families
//=================================================================

function indiLinked(idx, citations)
{
	PreloadScripts(NameFieldScripts('I', idx, ['name', 'birth_year', 'death_year', 'gid', 'cita']), true);
	citations = (typeof(citations) !== 'undefined') ? citations : true;
	var txt = I(idx, 'name') + ' (' + I(idx, 'birth_year') + '-' + I(idx, 'death_year') + ')';
	txt += gidBadge(I(idx, 'gid'));
	if (citations) txt += citaLinks(I(idx, 'cita'));
	if (idx != search.Idx || PageContents != PAGE_INDI)
		txt = '<a href="' + indiHref(idx) + '">' + txt + '</a>';
	return(txt);
}

function gidBadge(gid)
{
	var txt = '';
	if (!search.HideGid) txt = ' <span class="dwr-gid badge">' + gid + '</span>';
	return(txt);
}

var GENDERS_TEXT = {
	'M': _('Male'),
	'F': _('Female'),
	'U': _('Unknown')
};
var GENDERS_TEXT_ORDER = [
	GENDERS_TEXT['M'],
	GENDERS_TEXT['F'],
	GENDERS_TEXT['U']
];

function indiDetails(idx)
{
	PreloadScripts(NameFieldScripts('I', idx, ['names', 'gender', 'death_age']), true);
	var txt = '';
	var x_name;
	txt += '<table class="table table-condensed table-bordered dwr-table-flat">';
	// txt += '<table class="dt-table dwr-table-flat">';
	for (x_name = 0; x_name < I(idx, 'names').length; x_name++)
	{
		var name = I(idx, 'names')[x_name];
		var name_full = name.full;
		if (name.date != '') name_full += ' (' + name.date + ')';
		if (name.cita.length > 0) name_full += citaLinks(name.cita);
		txt += '<tr><td class="dwr-attr-title">' + name.type + '</td><td colspan="2" class="dwr-attr-value">' + name_full + '</td></tr>';
		if (name.nick != '') txt += '<tr><td class="empty"></td><td class="dwr-attr-title">' + _('Nick Name') + '</td><td class="dwr-attr-value">' + name.nick + '</td></tr>';
		if (name.call != '') txt += '<tr><td class="empty"></td><td class="dwr-attr-title">' + _('Call Name') + '</td><td class="dwr-attr-value">' + name.call + '</td></tr>';
		if (name.fam_nick != '') txt += '<tr><td class="empty"></td><td class="dwr-attr-title">' + _('Family Nick Name') + '</td><td class="dwr-attr-value">' + name.fam_nick + '</td></tr>';
		if (name.note != '') txt += '<tr><td class="empty"></td><td class="dwr-attr-title">' + _('Notes') + '</td><td class="dwr-attr-value">' + notePara(name.note, '<p class="dwr-attr-value">') + '</td></tr>';
	}
	txt += '<tr><td class="dwr-attr-title">' + _('Gender') + '</td><td colspan="2" class="dwr-attr-value">' + GENDERS_TEXT[I(idx, 'gender')] + '</td></tr>';
	if (I(idx, 'death_age') != '') txt += '<tr><td class="dwr-attr-title">' + _('Age at death') + '</td><td colspan="2" class="dwr-attr-value">' + I(idx, 'death_age') + '</td></tr>';
	txt += '</table>';
	return(txt);
}


function famLinked(fdx, citations)
{
	PreloadScripts(NameFieldScripts('F', fdx, ['name', 'gid', 'cita']), true);
	citations = (typeof(citations) !== 'undefined') ? citations : true;
	var txt =F(fdx, 'name');
	txt += gidBadge(F(fdx, 'gid'));
	if (citations) txt += citaLinks(F(fdx, 'cita'));
	if (INC_FAMILIES && (fdx != search.Fdx || PageContents != PAGE_FAM))
		txt = '<a href="' + famHref(fdx) + '">' + txt + '</a>';
	return(txt);
}


function noteSection(note)
{
	if (note == '') return([]);
	return([{
		title: _('Notes'),
		text: notePara(note, '<p>')
	}]);
}


function mediaSection(media)
{
	if (media.length == 0) return([]);
	return([{
		title: _('Media'),
		text: mediaLinks(media),
		panelclass: 'dwr-panel-media'
	}]);
}


function eventTable(events, idx, fdx)
{
	if (events.length == 0) return([]);
	var contents = {};
	contents.title = _('Events');
	var txt = '';
	txt += '<table class="table table-condensed table-bordered dwr-table-panel">';
	// txt += '<table class="dt-table events">';
	txt += '<thead><tr>';
	txt += '<th class="dwr-attr-header">' + _('Event') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Date') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Place') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Notes') + '</th>';
	txt += '</tr></thead><tbody>';
	for (var j = 0; j < events.length; j++)
	{
		var e = events[j];
		txt += '<tr>';
		txt += '<td class="dwr-attr-title">' + e.type + citaLinks(e.cita) + '</td>';
		txt += '<td class="dwr-attr-value">' + e.date + '</td>';
		txt += '<td class="dwr-attr-value">' + placeLink(e.place, idx, fdx, e) + '</td>';
		var notes = [];
		if (e.descr != '') notes.push('<span class="dwr-attr-header">' + _('Description') + '</span>:<br>' + e.descr);
		if (e.text != '') notes.push('<span class="dwr-attr-header">' + _('Notes') + '</span>:<br>' + notePara(e.text, '<p>'));
		var mlinks = mediaLinks(e.media);
		if (mlinks != '') notes.push('<span class="dwr-attr-header">' + _('Media') + '</span>:<br>' + mlinks);
		// Get participants
		var participants = '';
		for (var i = 0; i < e.part_person.length; i += 1)
		{
			var p_idx = e.part_person[i];
			if (p_idx != idx) participants += '<br>' + indiLinked(p_idx, false);
		}
		for (var i = 0; i < e.part_family.length; i += 1)
		{
			var p_fdx = e.part_family[i];
			if (p_fdx != fdx) participants += '<br>' + indiLinked(p_fdx, false);
		}
		if (participants != '') notes.push('<span class="dwr-attr-header">' + _('Other participants') + '</span>:' + participants);
		// Build notes from notes + description + media + participants + etc.
		txt += '<td class="dwr-attr-value">' + notes.join('<p>') + '</td>';
		txt += '</tr>';
	}
	txt += '</tbody></table>';
	contents.text = txt;
	return([contents]);
}


function locationString(loc)
{
	var loc2 = [];
	for (var x_loc = 0; x_loc < loc.length; x_loc++)
		if (loc[x_loc] != '') loc2.push(loc[x_loc]);
	return(loc2.join(', '));
}


function addrsTable(addrs)
{
	if (addrs.length == 0) return([]);
	var contents = {};
	contents.title = _('Addresses');
	var txt = '';
	txt += '<table class="table table-condensed table-bordered dwr-table-panel">';
	// txt += '<table class="dt-table addrs">';
	txt += '<thead><tr>';
	txt += '<th class="dwr-attr-header">' + _('Address') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Date') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Notes') + '</th>';
	txt += '</tr></thead><tbody>';
	for (var x_addr = 0; x_addr < addrs.length; x_addr++)
	{
		var addr = addrs[x_addr];
		txt += '<tr>';
		txt += '<td class="dwr-attr-value">' + locationString(addr.location) + citaLinks(addr.cita) + '</td>';
		txt += '<td class="dwr-attr-value">' + addr.date + '</td>';
		txt += '<td class="dwr-attr-value">' + notePara(addr.note, '<p>') + '</td>';
		txt += '</tr>';
	}
	txt += '</tbody></table>';
	contents.text = txt;
	return([contents]);
}


function attrsTable(attrs)
{
	if (attrs.length == 0) return([]);
	var contents = {};
	contents.title = _('Attributes');
	var txt = '';
	txt += '<table class="table table-condensed table-bordered dwr-table-panel">';
	// txt += '<table class="dt-table attrs">';
	txt += '<thead><tr>';
	txt += '<th class="dwr-attr-header">' + _('Attribute') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Value') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Notes') + '</th>';
	txt += '</tr></thead><tbody>';
	for (var x_attr = 0; x_attr < attrs.length; x_attr++)
	{
		var a = attrs[x_attr];
		txt += '<tr>';
		txt += '<td class="dwr-attr-title">' + a.type + citaLinks(a.cita) + '</td>';
		txt += '<td class="dwr-attr-value">' + a.value + '</td>';
		txt += '<td class="dwr-attr-value">' + notePara(a.note, '<p>') + '</td>';
		txt += '</tr>';
	}
	txt += '</tbody></table>';
	contents.text = txt;
	return([contents]);
}


function urlsTable(urls)
{
	if (urls.length == 0) return([]);
	var contents = {};
	contents.title = _('Web Links');
	var txt = '';
	txt += '<table class="table table-condensed table-bordered dwr-table-panel">';
	// txt += '<table class="dt-table urls">';
	txt += '<thead><tr>';
	txt += '<th class="dwr-attr-header">' + _('Link') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Description') + '</th>';
	txt += '</tr></thead><tbody>';
	for (var x_url = 0; x_url < urls.length; x_url++)
	{
		var url = urls[x_url];
		txt += '<tr>';
		txt += '<td class="dwr-attr-value"><a href="' + url.uri + '">' + url.uri + '</a></td>';
		txt += '<td class="dwr-attr-value">' + url.descr + '</td>';
		txt += '</tr>';
	}
	txt += '</tbody></table>';
	contents.text = txt;
	return([contents]);
}


function assocsTable(assocs)
{
	if (assocs.length == 0) return([]);
	var contents = {};
	contents.title = _('Associations');
	var txt = '';
	txt += '<table class="table table-condensed table-bordered dwr-table-panel">';
	// txt += '<table class="dt-table assocs">';
	txt += '<thead><tr>';
	txt += '<th class="dwr-attr-header">' + _('Person') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Relationship') + '</th>';
	txt += '<th class="dwr-attr-header">' + _('Notes') + '</th>';
	txt += '</tr></thead><tbody>';
	for (var x_assoc = 0; x_assoc < assocs.length; x_assoc++)
	{
		var assoc = assocs[x_assoc];
		txt += '<tr>';
		txt += '<td class="dwr-attr-value">' + indiLinked(assoc.person, false) + '</td>';
		txt += '<td class="dwr-attr-value">' + assoc.relationship + citaLinks(assoc.cita) + '</td>';
		txt += '<td class="dwr-attr-value">' + notePara(assoc.note, '<p>') + '</td>';
		txt += '</tr>';
	}
	txt += '</tbody></table>';
	contents.text = txt;
	return([contents]);
}


function notePara(note, p)
{
	if (note.indexOf('<div>') == -1 && note.indexOf('<p>') == -1)
		note = p + note + '</p>';
	return(note);
}

var pageSources = [];
var pageCitations = [];
var pageCitationsBullets = [];

function citaLinks(cita)
{
	var txt = '';
	var j, k;
	for (j = 0; j < cita.length; j++)
	{
		var cdx = cita[j];
		var sdx = C(cdx, 'source');
		PreloadScripts([].concat.apply([], [
			NameFieldScripts('C', cdx, ['source', 'media', 'text', 'note']),
			NameFieldScripts('S', sdx, ['author', 'title', 'gid'])]),
			true);
		var title = sourName(sdx);
		if (title != '') title=' title="' + title + '"';
		// Check if source is already referenced
		var x1 = $.inArray(sdx, pageSources);
		if (x1 == -1)
		{
			x1 = pageSources.length;
			pageSources[x1] = sdx;
			pageCitations[x1] = [];
		}
		var x2 = pageCitations[x1].length;
		// Check if citation already exists
		var c_m = mediaLinks(C(cdx, 'media'))
		for (k = 0; k < pageCitations[x1].length; k++)
		{
			var cdx2 = pageCitations[x1][k];
			var c2_m = mediaLinks(C(cdx2, 'media'));
			if (C(cdx2, 'text') == C(cdx, 'text') &&
				C(cdx2, 'note') == C(cdx, 'note') &&
				c2_m == c_m)
			{
				x2 = k;
				break;
			}
		}
		pageCitations[x1][x2] = cita[j];
		// Reference text
		txt += ' <a class="dwr-citation label label-primary" href="#cita_' + sdx + '"' + title + '>' + x1 + ',' + x2 + '</a> ';
	}
	return(txt);
}

function sourceSection()
{
	// Citations and source references
	var ctxt = printCitations();
	if (ctxt == '') return([]);
	return([{
		title: _('Sources'),
		text: ctxt,
		panelclass: 'dwr-sources-panel'
	}]);
}

function printCitations()
{
	if (pageSources.length == 0) return('');
	var txt = '';
	var j, k;
	// Print output
	txt += '<ol>';
	for (j = 0; j < pageSources.length; j++)
	{
		var sdx = pageSources[j];
		txt += '<li><a name="cita_' + sdx + '" href="' + sourceHref(sdx) + '">';
		txt += sourName(sdx) + '</a>';
		var txts = '';
		pageCitationsBullets[j] = [];
		for (k = 0; k < pageCitations[j].length; k++)
		{
			var cdx = pageCitations[j][k];
			var txtc = C(cdx, 'text') + C(cdx, 'note') + mediaLinks(C(cdx, 'media'))
			if (txtc != '')
			{
				txts += '<li>' + txtc + '</li>';
				pageCitationsBullets[j][k] = (j + 1) + citationBullet(k);
			}
			else
			{
				pageCitationsBullets[j][k] = (j + 1) + '';
			}
		}
		if (txts != '') txt += '<ol style="list-style-type: lower-alpha">' + txts + '</ol>';
		txt += '</li>';
	}
	txt += '</ol>';
	return(txt);
}

function handleCitations()
{
	// Replace references text by the list index
	$('.dwr-citation').each(function(i, e) {
		var txt = $(this).text();
		var x = txt.split(',');
		$(this).text(pageCitationsBullets[x[0]][x[1]]);
	});
	// Show Source tabbed pane upon click

	$('.dwr-citation').click(function(e) {
		$('a.dwr-sources-panel[role=tab]').tab('show');
	});
}

function citationBullet(x2)
{
	var num = '';
	num = String.fromCharCode('a'.charCodeAt(0) + (x2 % 26)) + num;
	x2 = Math.floor(x2 / 26);
	if (x2 > 0) num = String.fromCharCode('a'.charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode('a'.charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode('a'.charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode('a'.charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode('a'.charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	return(num);
}

function sourName(sdx)
{
	var title = '';
	if (search.SourceAuthorInTitle && S(sdx, 'author') != '') title = S(sdx, 'author');
	if (S(sdx, 'title') != '')
	{
		if (title != '') title += ': ';
		title += S(sdx, 'title');
	}
	if (title != '') return(title);
	return(_('Source') + ' ' + S(sdx, 'gid'));
}


function mediaName(mdx)
{
	var txt = '';
	if (M(mdx, 'title') != '') return(M(mdx, 'title'));
	return(M(mdx, 'gramps_path'));
}


// List of places referenced in the page with for each one:
//    - pdx: the place index in table "P"
//    - idx: the referencing person index in table "I", -1 if none
//    - fdx: the referencing family index in table "F", -1 if none
//    - event: the referencing event, if any
var pagePlaces = [];
var PP_PDX = 0;
var PP_IDX = 1;
var PP_FDX = 2;
var PP_EVENT = 3;


function placeLink(pdx, idx, fdx, event)
{
	if (typeof(idx) == 'undefined') idx = -1;
	if (typeof(fdx) == 'undefined') fdx = -1;
	if (typeof(event) == 'undefined') event = null;
	if (pdx == -1) return('');
	pagePlaces.push({pdx: pdx, idx: idx, fdx: fdx, event: event});
	if (!INC_PLACES) return(P(pdx, 'name'));
	if (PageContents == PAGE_PLACE && pdx == search.Pdx) return(P(pdx, 'name'));
	return('<a href="' + placeHref(pdx) + '">' + P(pdx, 'name') + '</a>');
}


function repoLink(rdx)
{
	if (rdx == -1) return('');
	if (PageContents == PAGE_REPO && rdx == search.Rdx) return(R(rdx, 'name'));
	return('<a href="' + repoHref(rdx) + '">' + R(rdx, 'name') + '</a>');
}


function strToContents(title, txt)
{
	if (txt == '') return([]);
	return([{
		title: title,
		text: txt
	}]);
}


//=================================================================
//========================================================== Titles
//=================================================================

var titlesCollapsible = []; // Stack of titles property: is the title collapsible ?
var titlesTable = []; // Stack of titles property: is the title containing a table ?
var titlesNumber = 0;


function printTitle(level, contents, collapsible, is_tabbeb)
{
	if (contents.length == 0) return('');
	if (typeof(is_tabbeb) == 'undefined') is_tabbeb = false;
	if (typeof(collapsible) == 'undefined') collapsible = (level >= 1);
	is_tabbeb = is_tabbeb && collapsible && search.TabbedPanels;
	var html = '';
	if (is_tabbeb)
	{
		//  Generate nav tabs
		html += '<ul class="nav nav-tabs" role="tablist">';
		for (var i = 0; i < contents.length; i += 1)
		{
			if (typeof(contents[i].panelclass) == 'undefined') contents[i].panelclass = '';
			html += '<li role="presentation"' + ((i == 0) ? ' class="active"' : '') +
				'><a href="#section_' + (titlesNumber + i) + '" role="tab" data-toggle="tab" class="' + contents[i].panelclass + '">' +
				'<h' + level + ' class="panel-title">' +
				contents[i].title +
				'</h' + level + '>' +
				'</a></li>';
		}
		html += '</ul>';
		html += '<div class="panel panel-default dwr-tab-panel"><div class="tab-content panel-body">';
	}
	for (var i = 0; i < contents.length; i += 1)
	{
		var id = 'section_' + titlesNumber;
		titlesNumber += 1;
		var is_table = (contents[i].text.indexOf('<table') == 0);
		is_table = is_table && collapsible;
		if (is_tabbeb)
		{
			html += '<div id="' + id + '" role="tabpanel" class="tab-pane' +
				(is_table ? ' dwr-panel-table' : '') +
				((i == 0) ? ' active ' : ' ') + contents[i].panelclass + '">';
			html += contents[i].text;
			html += '</div>';
		}
		else if (collapsible)
		{
			html += '<div class="panel panel-default ' + contents[i].panelclass + '">';
			html += '<div class="panel-heading dwr-collapsible" data-toggle="collapse" data-target="#' + id + '">';
			html += '<h' + level + ' class="panel-title">' + contents[i].title + '</h' + level + '>';
			html += '</div>';
			html += '<div id="' + id + '" class="panel-collapse collapse in ' + (is_table ? 'dwr-panel-table' : 'dwr-panel') + '">';
			if (is_table)
			{
				html += contents[i].text;
				html += '</div></div>';
			}
			else
			{
				html += '<div class="panel-body">';
				html += contents[i].text;
				html += '</div></div></div>';
			}

		}
		else
		{
			html += '<h' + level + '>' + contents[i].title + '</h' + level + '>';
			html += contents[i].text;
		}
	}
	if (is_tabbeb)
	{
		html += '</div></div>';
	}
	return(html);
}


function handleTitles()
{
	// Handle collapsible panels
	$('.panel-heading').click(function(event) {
		// Prevent title collapse when the click is not on the title
		var target = $(event.target);
		if (!target.is('.panel-heading') && !target.is('.panel-title'))
		{
			event.stopImmediatePropagation();
		}
	});

	// Handle Bootstrap nav tabs
	$('.nav-tabs>li>a').click(function (event) {
		var target = $(event.target);
		if (target.attr('role') != 'tab' && !target.is('.panel-title'))
		{
			event.stopImmediatePropagation();
		}
	});

	// Enable Bootstrap tooltips and popovers
	$('[data-toggle=tooltip]').tooltip();
	$('[data-toggle=popover]').popover();

}


function printChangeTime(change_time)
{
	$('#dwr-change-time').html(_('Last Modified') + ': ' + change_time);
	return('');
}

//=================================================================
//====================================================== Individual
//=================================================================

function printIndi(idx)
{
	PreloadScripts(NameFieldScripts('I', idx, ['name', 'gid', 'cita', 'events', 'addrs', 'attr', 'urls', 'assoc', 'media', 'note', 'change_time', 'famc', 'fams']), true);
	var html = '';
	html += '<h2 class="page-header">' + I(idx, 'name') + gidBadge(I(idx, 'gid')) + citaLinks(I(idx, 'cita')) + '</h2>';

	html += indiDetails(idx);
	html += printTitle(3, [].concat(
		eventTable(I(idx, 'events'), idx, -1),
		addrsTable(I(idx, 'addrs')),
		attrsTable(I(idx, 'attr')),
		urlsTable(I(idx, 'urls')),
		assocsTable(I(idx, 'assoc')),
		mediaSection(I(idx, 'media')),
		noteSection(I(idx, 'note')),
		[{
			title: _('Ancestors'),
			text: printIndiAncestors(idx)
		},
		{
			title: _('Descendants'),
			text: printIndiDescendants(idx)
		}],
		printMap(search.MapFamily),
		sourceSection()),
		true /*collapsible*/, true /*is_tabbeb*/);
	html += printChangeTime(I(idx, 'change_time'));
	return(html);
}


function printIndiAncestors(idx)
{
	var html = "";
	var famc_list = $.map(I(idx, 'famc'), function (fc) {return(fc.index);});
	if (SHOW_ALL_SIBLINGS)
	{
		for (var j = 0; j < I(idx, 'famc').length; j++)
		{
			var fdx = I(idx, 'famc')[j].index;
			for (var k = 0; k < F(fdx, 'spou').length; k++)
			{
				var fams = I(F(fdx, 'spou')[k], 'fams');
				for (var x_fams = 0; x_fams < fams.length; x_fams++)
				{
					var fdx2 = fams[x_fams];
					if ($.inArray(fdx2, famc_list) < 0) famc_list.push(fdx2);
				}
			}
		}
	}
	for (var j = 0; j < famc_list.length; j++)
	{
		var fdx = famc_list[j];
		html += printTitle(4,
			[{
				title: _('Parents') + ': ' + famLinked(fdx),
				text: printIndiParents(fdx)
			},
			{
				title: _('Siblings'),
				text: printIndiSiblings(fdx)
			}]);
	}
	if (famc_list.length == 0) html += ('<p class="dwr-ref">' + _('None'));
	return(html);
}


function printIndiParents(fdx)
{
	var html = '';
	if (F(fdx, 'spou').length == 0)
	{
		html += ('<p class="dwr-ref">' + _('None'));
	}
	else
	{
		for (var k = 0; k < F(fdx, 'spou').length; k++)
		{
			html += '<p class="dwr-ref">' + indiLinked(F(fdx, 'spou')[k]) + '</p>';
		}
	}
	return(html);
}


function printIndiSiblings(fdx)
{
	var html = '';
	if (F(fdx, 'chil').length > 0)
	{
		html += '<ol class="dwr-ref">';
		for (var k = 0; k < F(fdx, 'chil').length; k++)
		{
			html += '<li class="dwr-ref">';
			html += printChildRef(F(fdx, 'chil')[k]);
			html += '</li>';
		}
		html += '</ol>';
	}
	else
	{
		html += ('<p class="dwr-ref">' + _('None'));
	}
	return(html);
}


function printIndiDescendants(idx)
{
	var html = '';
	for (var j = 0; j < I(idx, 'fams').length; j++)
	{
		var fdx = I(idx, 'fams')[j];
		html += printTitle(4,
			[{
				title: famLinked(fdx),
				text: printIndiSpouses(fdx, idx)
			}],
			I(idx, 'fams').length > 1 /*collapsible*/);
	}
	if (I(idx, 'fams').length == 0) html += ('<p class="dwr-ref">' + _('None') + '</p>');
	return(html);
}


function printIndiSpouses(fdx, idx)
{
	PreloadScripts(NameFieldScripts('F', fdx, ['events', 'attr', 'media', 'note']), true);
	var html = '';
	var spouses = $(F(fdx, 'spou')).not([idx]).get();
	for (var k = 0; k < spouses.length; k++)
	{
		html += '<p class="dwr-ref">' + indiLinked(spouses[k]) + '</p>';
	}
	html += printTitle(4, [].concat(
		[{
			title: _('Children'),
			text: printIndiChildren(fdx)
		}],
		eventTable(F(fdx, 'events'), -1, fdx),
		attrsTable(F(fdx, 'attr')),
		mediaSection(F(fdx, 'media')),
		noteSection(F(fdx, 'note'))),
		true /*collapsible*/, true /*is_tabbeb*/);
	return(html);
}


function printIndiChildren(fdx)
{
	var html = '';
	if (F(fdx, 'chil').length == 0)
	{
		html += '<p class="dwr-ref">' + _('None') + '</p>';
	}
	else
	{
		html += '<ol class="dwr-ref">';
		for (var k = 0; k < F(fdx, 'chil').length; k++)
		{
			html += '<li class="dwr-ref">';
			html += printChildRef(F(fdx, 'chil')[k]);
			html += '</li>';
		}
		html += '</ol>';
	}
	return(html);
}


function printChildRef(fc)
{
	var txt = '';
	txt += indiLinked(fc.index);
	txt += citaLinks(fc.cita);
	if (fc.note != '') txt += '<p><b>' + _('Notes') + ':</b></p>' + notePara(fc.note, '</p>');
	var rel, title;
	rel = fc.to_father;
	title = _('Relationship to Father');
	if (rel != '' && rel != _('Birth')) txt += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + title + ': </span>' + rel + '</p>';
	rel = fc.to_mother;
	title = _('Relationship to Mother');
	if (rel != '' && rel != _('Birth')) txt += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + title + ': </span>' + rel + '</p>';
	return(txt);
}


//=================================================================
//========================================================== Family
//=================================================================

function printFam(fdx)
{
	PreloadScripts(NameFieldScripts('F', fdx, ['name', 'gid', 'cita', 'events', 'attr', 'media', 'note', 'change_time', 'spou', 'chil']), true);
	var html = '';
	html += '<h2 class="page-header">' + F(fdx, 'name') + gidBadge(F(fdx, 'gid')) + citaLinks(F(fdx, 'cita')) + '</h2>';
	html += printTitle(3, [].concat(
		eventTable(F(fdx, 'events'), -1, fdx),
		attrsTable(F(fdx, 'attr')),
		mediaSection(F(fdx, 'media')),
		noteSection(F(fdx, 'note')),
		[{
			title: _('Parents'),
			text: printFamParents(fdx)
		},
		{
			title: _('Children'),
			text: printFamChildren(fdx)
		}],
		printMap(search.MapFamily),
		sourceSection()),
		true /*collapsible*/, true /*is_tabbeb*/);
	html += printChangeTime(F(fdx, 'change_time'));
	return(html);
}

function printFamParents(fdx)
{
	var html = '';
	if (F(fdx, 'spou').length == 0)
	{
		html += ('<p class="dwr-ref">' + _('None'));
	}
	else
	{
		html += '<ul class="dwr-ref-detailed">';
		for (var k = 0; k < F(fdx, 'spou').length; k++)
		{
			var idx = F(fdx, 'spou')[k];
			html += '<li class="dwr-ref-detailed">' + indiLinked(idx);
			html += indiDetails(idx);
			html += printTitle(4, [].concat(
				eventTable(I(idx, 'events'), idx, -1),
				// addrsTable(I(idx, 'addrs')),
				// attrsTable(I(idx, 'attr')),
				// urlsTable(I(idx, 'urls')),
				// assocsTable(I(idx, 'assoc')),
				mediaSection(I(idx, 'media'))),
				// noteSection(I(idx, 'note')),
				true /*collapsible*/, true /*is_tabbeb*/);
			html += '</li>';
		}
	}
	return(html);
}


function printFamChildren(fdx)
{
	var html = '';
	if (F(fdx, 'chil').length == 0)
	{
		html += ('<p class="dwr-ref">' + _('None') + '</p>');
	}
	else
	{
		html += '<ol class="dwr-ref-detailed">';
		for (var k = 0; k < F(fdx, 'chil').length; k++)
		{
			var fc = F(fdx, 'chil')[k];
			var idx = F(fdx, 'chil')[k].index;
			html += '<li class="dwr-ref-detailed">' + printChildRef(F(fdx, 'chil')[k])
			html += indiDetails(idx);
			html += printTitle(4, [].concat(
				eventTable(I(idx, 'events'), idx, -1),
				// addrsTable(I(idx, 'addrs')),
				// attrsTable(I(idx, 'attr')),
				// urlsTable(I(idx, 'urls')),
				// assocsTable(I(idx, 'assoc')),
				mediaSection(I(idx, 'media'))),
				// noteSection(I(idx, 'note')),
				true /*collapsible*/, true /*is_tabbeb*/);
			html += '</li>';
		}
		html += '</ol>';
	}
	return(html);
}


//=================================================================
//=========================================================== Media
//=================================================================

function mediaLinks(media)
{
	var scripts = [];
	for (var j = 0; j < media.length; j++)
	{
		var mr = media[j];
		$.merge(scripts, NameFieldScripts('M', media[j].m_idx, ['title', 'gramps_path']));
	}
	PreloadScripts(scripts, true);
	var txt = '';
	for (var j = 0; j < media.length; j++)
	{
		var mr = media[j];
		var alt = M(mr.m_idx, 'title');
		if (alt == '') alt = M(mr.m_idx, 'title');
		if (alt == '') alt = M(mr.m_idx, 'gramps_path');
		if (alt == '') alt = _('Media') + ' ' + mr.m_idx;
		txt += ' <a title="' + alt + '" class="thumbnail" href="' + mediaHref(mr.m_idx, m_list_from_mr(media)) + '">';
		txt += '<img src="' + mr.thumb + '" alt="' + alt + '"></a> ';
	}
	return(txt);
}

function mediaPaginationButtonHtml(id, class_, text)
{
	var html = '<li id="' + id + '"';
	if (class_ != '') html += ' class="' + class_ + '"';
	html += '><a href="#">' + text + '</a></li>';
	return(html);
}

function printMedia(mdx)
{
	PreloadScripts(NameFieldScripts('M', mdx, ['title', 'gramps_path', 'gid', 'cita', 'mime', 'path', 'bki', 'bkf', 'bks', 'bkp', 'date', 'note', 'attr', 'change_time']), true);
	var html = '';
	var title = M(mdx, 'title');
	if (title == '') title = M(mdx, 'gramps_path');
	html += '<h2 class="page-header">' + title + gidBadge(M(mdx, 'gid')) + citaLinks(M(mdx, 'cita')) + '</h2>';

	// Pagination buttons
	if (search.ImgList.length > 1)
	{
		var imgI = search.ImgList.indexOf(mdx);
		html += '<ul id="dwr-img-btns" class="pagination">';
		// 'Previous' button
		html += mediaPaginationButtonHtml('media_button_prev', (imgI == 0) ? 'disabled' : '',
			'<span class="glyphicon glyphicon-chevron-left"></span>');
		// First item button
		html += mediaPaginationButtonHtml('media_button_0', (imgI == 0) ? 'active' : '', '1');
		var first_but = Math.min(imgI - 1, search.ImgList.length - 4);
		first_but = Math.max(1, first_but);
		var last_but = Math.min(first_but + 2, search.ImgList.length - 2);
		if (first_but > 1)
		{
			// Separator between first item and current item buttons
			html += mediaPaginationButtonHtml('media_button_hellip', 'disabled', '&hellip;');
		}
		// Current item buttons
		for (var i = first_but; i <= last_but; i++)
		{
			html += mediaPaginationButtonHtml('media_button_' + i, (imgI == i) ? 'active' : '', i + 1);
		}
		if (last_but < search.ImgList.length - 2)
		{
			// Separator between current item buttons and last item
			html += mediaPaginationButtonHtml('media_button_hellip', 'disabled', '&hellip;');
		}
		if (search.ImgList.length > 1)
		{
			// Last item button
			var i = search.ImgList.length - 1;
			html += mediaPaginationButtonHtml('media_button_' + i, (imgI == i) ? 'active' : '', i + 1);
		}
		// 'Next' button
		html += mediaPaginationButtonHtml('media_button_next', (imgI == search.ImgList.length - 1) ? 'disabled' : '',
			'<span class="glyphicon glyphicon-chevron-right"></span>');
		html += '</ul>';
		// Pagination events
		$(window).load(function()
		{
			// Disable <a> anchors for disabled buttons
			$('.pagination .disabled a, .pagination .active a').on('click', function(e) {e.preventDefault();});
			// Connect click events
			$('#media_button_prev:not(.disabled)').click(function() {return mediaButtonPageClick(-1);});
			$('#media_button_next:not(.disabled)').click(function() {return mediaButtonPageClick(1);});
			$('#media_button_0:not(.active)').click(function() {return mediaButtonPageClick(0, 0);});
			$('#media_button_' + (search.ImgList.length - 1) + ':not(.active)').click(function() {return mediaButtonPageClick(0, search.ImgList.length - 1);});
			for (var i = first_but; i <= last_but; i++)
			{
				(function(){ // This is used to create instances of local variables
					var icopy = i;
					$('#media_button_' + i + ':not(.active)').click(function() {return mediaButtonPageClick(0, icopy);});
				})();
			}
		});
	}

	// Image or link (if media is not an image)
	if (M(mdx, 'mime').indexOf('image') == 0)
	{
		html += '<div class="dwr-centered"><div id="dwr-img-div">';
		html += '<img id="dwr-image" src="' + M(mdx, 'path') + '">';
		html += printMediaMap(mdx);

		// Expand button
		html += '<div id="media-buttons">';
		html += '<button id="media-button-max" type="button" class="btn btn-default" title=' + _('Maximize') + '>';
		html += '<span class="glyphicon glyphicon-fullscreen"></span>';
		html += '</button>';
		html += '</div>';

		html += '</div></div>';

		// Expand button events
		$(window).load(function()
		{
			$('#media-button-max').click(function() {return mediaButtonMaxClick();});
		});
	}
	else
	{
		var name = M(mdx, 'gramps_path');
		name = name.replace(/.*[\\\/]/, '');
		html += '<p class="dwr-centered"><a href="' + M(mdx, 'path') + '">' + name + '</a></p>';
	}

	// Back references
	var bk_txt = printBackRefs(BKREF_TYPE_MEDIA, M(mdx, 'bki'), M(mdx, 'bkf'), M(mdx, 'bks'), [], M(mdx, 'bkp'), []);

	// Media description
	if (M(mdx, 'date') != '') html += '<p><b>' + _('Date') + ': </b>' + M(mdx, 'date') + '</p>';
	html += printTitle(3, [].concat(
		noteSection(M(mdx, 'note')),
		attrsTable(M(mdx, 'attr')),
		strToContents(_('References'), bk_txt),
		sourceSection()),
		true /*collapsible*/, true /*is_tabbeb*/);

	html += printChangeTime(M(mdx, 'change_time'));
	return(html);
}


function mediaButtonPageClick(page_delta, page)
{
	var imgI = search.ImgList.indexOf(search.Mdx);
	if (typeof(page) == 'undefined') page = imgI;
	var i = page + page_delta;
	i = (i + search.ImgList.length) % search.ImgList.length;
	window.location.href = mediaHref(search.ImgList[i]);
	return(false);
}

function mediaButtonMaxClick()
{
	window.location.href = M(search.Mdx).path;
	return(false);
}

function printMediaMap(mdx)
{
	var html = '';
	var j, k;
//	html += '<ul id="imgmap">';
	html += printMediaRefArea(M(mdx, 'bki'), indiHref, function(ref) {return(I(ref, 'name'));});
	if (INC_FAMILIES)
		html += printMediaRefArea(M(mdx, 'bkf'), famHref, function(ref) {return(F(ref, 'name'));});
	if (INC_SOURCES)
		html += printMediaRefArea(M(mdx, 'bks'), sourceHref, sourName);
	if (INC_PLACES)
		html += printMediaRefArea(M(mdx, 'bkp'), placeHref, function(ref) {return(P(ref, 'name'));});
//	html += '</ul>';
	return(html);
}

function printMediaRefArea(bk_table, fref, fname)
{
	var html = '';
	for (var j = 0; j < bk_table.length; j++)
	{
		var ref = bk_table[j];
		var idx = ref.bk_idx;
		var rect = [];
		for (var k = 0; k < 4; k++)
		{
			rect[k] = parseFloat(ref.rect[k]);
		}
		if (!isNaN(rect[0]) && rect.join(',') != '0,0,100,100')
		{
			html += '<a href="' + fref(idx) + '"';
			html += ' title="' + fname(idx) + '" class="dwr-imgmap" style="';
			html += 'left: ' + rect[0] + '%;';
			html += 'top: ' + rect[1] + '%;';
			html += 'width: ' + (rect[2] - rect[0]) + '%;';
			html += 'height: ' + (rect[3] - rect[1]) + '%;">';
			html += '</a>';
		}
	}
	return(html);
}


//=================================================================
//========================================================== Source
//=================================================================

function printSource(sdx)
{
	PreloadScripts(NameFieldScripts('S', sdx, ['gid', 'repo', 'attr', 'media', 'note', 'bkc', 'change_time']), true);
	var html = '';
	if (S(sdx, 'title') != '') html += '<h2 class="page-header">' + S(sdx, 'title') + gidBadge(S(sdx, 'gid')) + '</h2>';
	if (S(sdx, 'text') != '') html += S(sdx, 'text');

	// Repositories for this source
	var bk_txt = printBackRefs(BKREF_TYPE_REPOREF, [], [], [], [], [], S(sdx, 'repo'));

	html += printTitle(3, [].concat(
		attrsTable(S(sdx, 'attr')),
		mediaSection(S(sdx, 'media')),
		noteSection(S(sdx, 'note')),
		strToContents(_('Repositories'), bk_txt),
		[{
			title: _('Citations'),
			text: printSourceCitations(sdx)
		}]),
		true /*collapsible*/, true /*is_tabbeb*/);
	html += printChangeTime(S(sdx, 'change_time'));
	return(html);
}

function printSourceCitations(sdx)
{
	var html = '';
	if (S(sdx, 'bkc').length > 0)
	{
		html += '<ul class="dwr-citations">';
		var j;
		for (var j = 0; j < S(sdx, 'bkc').length; j++)
		{
			var cdx = S(sdx, 'bkc')[j];
			PreloadScripts(NameFieldScripts('C', cdx, ['text', 'note', 'media', 'note', 'bki', 'bkf', 'bkm', 'bkp', 'bkr']), true);
			// html += '<li>' + _('Citation') + ': ';
			html += '<li>';
			if (C(cdx, 'text') != '') html += notePara(C(cdx, 'text'), '<p>');
			if (C(cdx, 'note') != '') html += '<p><b>' + _('Notes') + ':</b></p>' + notePara(C(cdx, 'note'), '<p>');
			if (C(cdx, 'media').length > 0) html += '<p>' + _('Media') + ': ' + mediaLinks(C(cdx, 'media')) + '</p>';
			// Back references
			html += printBackRefs(BKREF_TYPE_INDEX, C(cdx, 'bki'), C(cdx, 'bkf'), [], C(cdx, 'bkm'), C(cdx, 'bkp'), C(cdx, 'bkr'));
			html += '</li>';
		}
		html += '</ul>';
	}
	else
	{
		html += '<p>' + _('None') + '</p>';
	}
	return(html);
}


//=================================================================
//========================================================== Places
//=================================================================

function placeNames(pnames)
{
	if (pnames.length == 0) return('');
	var names = []
	for (var j = 0; j < pnames.length; j++)
	{
		var txt = pnames[j].name;
		if (pnames[j].date != '') txt += ' (' + pnames[j].date + ')';
		names.push(txt);
	}
	return(names.join(', '));
}

function placeHierarchy(enclosed_by, visited)
{
	if (enclosed_by.length == 0) return('');
	var txt = '<ul>';
	for (var j = 0; j < enclosed_by.length; j++)
	{
		var pdx = enclosed_by[j].pdx;
		if ($.inArray(pdx, visited) != -1) continue;
		txt += '<li class="dwr-attr-value">';
		txt += '<a href="' + placeHref(pdx) + '">'
		txt += placeNames(P(pdx, 'names'));
		txt += '</a>';
		if (enclosed_by[j].date != '') txt += ' (' + enclosed_by[j].date + ')';
		txt += placeHierarchy(P(pdx, 'enclosed_by'), $.merge($.merge([], visited), [pdx]))
		txt += '</li>';
	}
	txt += '</ul>';
	return(txt);
}

function printPlace(pdx)
{
	PreloadScripts(NameFieldScripts('P', pdx, ['name', 'locations', 'gid', 'cita', 'names', 'type', 'code', 'coords', 'enclosed_by', 'bki', 'bkf', 'bkp', 'urls', 'media', 'note', 'change_time']), true);
	var html = '';
	placeLink(pdx);
	var name = P(pdx, 'name');
	if (name == '') name = locationString(P(pdx, 'locations'));
	html += '<h2 class="page-header">' + name + gidBadge(P(pdx, 'gid')) + citaLinks(P(pdx, 'cita')) + '</h2>';
	if (P(pdx, 'names').length > 0)
	{
		html += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Name') + ':</span> ';
		html += placeNames(P(pdx, 'names'));
		html += '</p>';
	}
	if (P(pdx, 'type') != '') html += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Type') + ':</span> ' + P(pdx, 'type') + '</p>';
	if (P(pdx, 'code') != '') html += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Code') + ':</span> ' + P(pdx, 'code') + '</p>';
	if (P(pdx, 'coords')[0] != '' && P(pdx, 'coords')[1] != '')
		html +=
			'<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Latitude') + ':</span> ' + P(pdx, 'coords')[0] + '</p>' +
			'<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Longitude') + ':</span> ' + P(pdx, 'coords')[1] + '</p>';
	for (var j = 0; j < P(pdx, 'locations').length; j++)
	{
		html += '<p class="dwr-attr-title">';
		if (j == 0) html += _('Location');
		else html += _('Alternate Name') + ' ' + j;
		html += ': </p><ul>';
		var loc = P(pdx, 'locations')[j];
		for (var k = 0; k < loc.length; k ++)
		{
			html += '<li class="dwr-attr-value"><span class="dwr-attr-title">' + loc.type + ':</span> ' + loc.name + '</li>';
		}
		html += '</ul>';
	}
	if (P(pdx, 'enclosed_by').length > 0)
	{
		html += '<p class="dwr-attr-title">' + _('Enclosed By') + ':</p';
		html += placeHierarchy(P(pdx, 'enclosed_by'), [pdx]);
	}

	// Back references
	var bk_txt = printBackRefs(BKREF_TYPE_INDEX, P(pdx, 'bki'), P(pdx, 'bkf'), [], [], P(pdx, 'bkp'), []);

	html += printTitle(3, [].concat(
		urlsTable(P(pdx, 'urls')),
		mediaSection(P(pdx, 'media')),
		noteSection(P(pdx, 'note')),
		printMap(search.MapPlace),
		sourceSection(),
		strToContents(_('References'), bk_txt)),
		true /*collapsible*/, true /*is_tabbeb*/);

	html += printChangeTime(P(pdx, 'change_time'));
	return(html);
}


//=================================================================
//==================================================== Repositories
//=================================================================

function printRepo(rdx)
{
	PreloadScripts(NameFieldScripts('R', rdx, ['name', 'gid', 'type', 'bks', 'addrs', 'urls', 'note', 'change_time']), true);
	var html = '';
	html += '<h2 class="page-header">' + R(rdx, 'name') + gidBadge(R(rdx, 'gid')) + '</h2>';
	html += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Type') + ': </span>'
	html += R(rdx, 'type') + '</p>';

	// Back references
	var bk_txt = printBackRefs(BKREF_TYPE_REPO, [], [], R(rdx, 'bks'), [], [], []);
	if (bk_txt == '') bk_txt = _('None');

	html += printTitle(3, [].concat(
		addrsTable(R(rdx, 'addrs')),
		urlsTable(R(rdx, 'urls')),
		noteSection(R(rdx, 'note')),
		strToContents(_('References'), bk_txt),
		sourceSection()),
		true /*collapsible*/, true /*is_tabbeb*/);
	html += printChangeTime(R(rdx, 'change_time'));
	return(html);
}


//=================================================================
//=========================================================== Index
//=================================================================

var TABLE_OPTIMIZATION_LIMIT = 1000; // Fancy features are disabled above this limit

function printIndex(id, data, defaultsort, columns)
{
	// var time = Date.now();
	var j, k;

	// Compute data
	// (optimization: copy data in another array in order to call functions ftext, fsort, fhref only once)
	// Also check if a column is empty
	var data_copy = Array(data.length);
	var nb_cols = columns.length;
	var col_empty = []; // is the column emtpy ?
	var col_num = []; // does the colmun contain only numbers ?
	for (j = 0; j < nb_cols; j++)
	{
		col_empty.push(true);
		col_num.push(true);
	}
	for (j = 0; j < data.length; j++)
	{
		var line = [];
		for (k = 0; k < nb_cols; k++)
		{
			var text = columns[k].ftext(j, k);
			if (typeof(text) == 'undefined') text = '';
			text = text.toString();
			var text_sort = text.replace(/<[^>]*>/g, '');
			// var text_filt = text_sort + " " + unorm.nfkc(text_sort);  // nfkc removed for optimization (too much time-consuming)
			var text_filt = text_sort;
			if (text != '')
			{
				col_empty[k] = false;
				if (columns[k].fhref)
				{
					var hr = columns[k].fhref(j);
					if (hr != '') text = '<a class="dwr-index" href="' + hr + '">' + text + '</a>';
				}
			}
			if (columns[k].fsort)
			{
				text_sort = columns[k].fsort(j, k);
				if (typeof(text_sort) == 'undefined') text_sort = '';
				if (typeof(text_sort) == 'number')
				{
					text_sort = '000000' + text_sort;
					text_sort = text_sort.substr(text_sort.length - 7);
				}
				text_sort = text_sort.toString();
			}
			if (text_sort != '' && isNaN(parseInt(text_sort))) col_num[k] = false;
			line.push({
				'text': text,
				'sort': text_sort,
				'filter': text_filt
			});
		}
		data_copy[j] = line;
	}

	// Remove empty columns
	var nb_cols_suppr = 0;
	for (k = 0; k < nb_cols; k++)
	{
		if (col_empty[k])
		{
			nb_cols_suppr += 1;
		}
		else if (nb_cols_suppr > 0)
		{
			columns[k - nb_cols_suppr] = columns[k];
			col_num[k - nb_cols_suppr] = col_num[k];
			if (defaultsort == k) defaultsort = k - nb_cols_suppr;
			for (j = 0; j < data_copy.length; j++)
			{
				data_copy[j][k - nb_cols_suppr] = data_copy[j][k];
			}
		}
	}
	nb_cols -= nb_cols_suppr;

	if (data_copy.length > TABLE_OPTIMIZATION_LIMIT) console.log('Table has too many rows (' + data_copy.length + '). Disabling fancy features.');
	
	// Prepare columns definition for DataTables plugin
	var colDefs = []
	for (k=0; k < nb_cols; k++)
	{
		colDefs.push({
			'data': {
				'_': k + '.text',
				'display': k + '.text',
				'filter': k + '.filter',
				'sort': k + '.sort',
			},
			// 'width': '200px',
			'type': (col_num[k] ? 'num' : 'string'),
			'orderable': (columns[k].fsort !== false) && (data_copy.length <= TABLE_OPTIMIZATION_LIMIT)
		});
	}

	// Print table
	var html = '';
	if (data_copy.length == 0)
	{
		html += '<p>' + _('None') + '</p>';
		return(html);
	}
	html += '<table id="dwr-index-' + id + '" class="table table-condensed table-bordered dt-table dt-responsive dwr-table-flat" width="100%">';
	html += '<thead><tr>';
	for (k = 0; k < nb_cols; k++)
	{
		html += '<th class="dwr-index-title">';
		html += columns[k].title;
		html += '</th>';
	}
	html += '</tr></thead>';
	html += '<tbody>';
	html += '</tbody>';
	html += '</table>';

	// Build the DataTable, see http://www.datatables.net/
	(function(){ // This is used to create instances of local variables
		$(document).ready(function() {
			$('#dwr-index-' + id).DataTable({
				'ordering': (data_copy.length <= TABLE_OPTIMIZATION_LIMIT),
				'order': defaultsort,
				'orderClasses': false,
				'info': false,
				'responsive': (data_copy.length <= TABLE_OPTIMIZATION_LIMIT),
				'stateSave': true,
				'iDisplayLength': A_LENGTH_MENU[0][search.NbEntries],
				'aLengthMenu': A_LENGTH_MENU,
				'columns': colDefs,
				'data': data_copy,
				'deferRender': (data_copy.length > TABLE_OPTIMIZATION_LIMIT),
				'autoWidth': (data_copy.length <= TABLE_OPTIMIZATION_LIMIT),
				'processing': true,
				'searching': (data_copy.length <= TABLE_OPTIMIZATION_LIMIT),
				'dom':
					'<"row"<"col-xs-12"f>>' +
					'<"row"<"col-xs-12"tr>>' +
					'<"row"<"col-xs-4"l><"col-xs-8"p>>',
				'language': {
					'emptyTable':     _('No data available in table'),
					'info':           _('Showing _START_ to _END_ of _TOTAL_ entries'),
					'infoEmpty':      _('Showing 0 to 0 of 0 entries'),
					'infoFiltered':   _('(filtered from _MAX_ total entries)'),
					'infoPostFix':    '',
					'thousands':      '',
					'lengthMenu':     _('Show _MENU_ entries'),
					'loadingRecords': _('Loading...'),
					'processing':     _('Processing...'),
					'search':         _('Search:'),
					'zeroRecords':    _('No matching records found'),
					'paginate': {
						'first':      '<span class="glyphicon glyphicon-step-backward"></span>',
						'last':       '<span class="glyphicon glyphicon-step-forward"></span>',
						'next':       '<span class="glyphicon glyphicon-chevron-right"></span>',
						'previous':   '<span class="glyphicon glyphicon-chevron-left"></span>'
					},
					'aria': {
						'sortAscending':  _(': activate to sort column ascending'),
						'sortDescending': _(': activate to sort column descending')
					}
				}
			});
		});
		if (data_copy.length <= TABLE_OPTIMIZATION_LIMIT)
			$(window).load(function() {
				$('#dwr-index-' + id).DataTable().columns.adjust().responsive.recalc();
			});
	})();

	return(html);
}


function htmlPersonsIndex(data)
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('I', 'name'),
			NameSplitScripts('I', 'gender'),
			(search.IndexShowBirth ? NameSplitScripts('I', 'birth_year') : []),
			(search.IndexShowDeath ? NameSplitScripts('I', 'death_year') : []),
			(search.IndexShowPartner ? ([].concat.apply([], [
				NameSplitScripts('I', 'fams'),
				NameSplitScripts('F', 'spou')])) : []),
			(search.IndexShowParents ? ([].concat.apply([], [
				NameSplitScripts('I', 'famc'),
				NameSplitScripts('F', 'spou')])) : [])]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('I', 'name');
	buildDataArray('I', 'gender');
	if (search.IndexShowBirth) buildDataArray('I', 'birth_year');
	if (search.IndexShowDeath) buildDataArray('I', 'death_year');
	if (search.IndexShowPartner)
	{
		buildDataArray('I', 'fams');
		buildDataArray('F', 'spou');
	}
	if (search.IndexShowParents)
	{
		buildDataArray('I', 'famc');
		buildDataArray('F', 'spou');
	}

	// Build index
	var html = '';
	if (typeof(data) == 'undefined')
	{
		html += '<h2 class="page-header">' + _('Persons Index') + '</h2>';
		data = new Array(DB_SIZES['I']);
		for (var x = 0; x < DB_SIZES['I']; x++) data[x] = x;
	}
	var columns = [{
		title: _('Name'),
		ftext: function(x, col) {return I_name[data[x]]},
		fhref: function(x) {return indiHrefOptimized(data[x])},
		fsort: function(x, col) {return data[x]}
	}, {
		title: _('Gender'),
		ftext: function(x, col) {return _(I_gender[data[x]])}
	}];
	if (search.IndexShowBirth) columns.push({
		title: _('Birth'),
		ftext: function(x, col) {return I_birth_year[data[x]];}
	});
	if (search.IndexShowDeath) columns.push({
		title: _('Death'),
		ftext: function(x, col) {return I_death_year[data[x]];}
	});
	if (search.IndexShowPartner) columns.push({
		title: _('Spouses'),
		ftext: function(x, col) {
			var txt = '';
			var sep = '';
			for (var x_fams = 0; x_fams < I_fams[data[x]].length; x_fams++)
			{
				var spouses = F_spou[I_fams[data[x]][x_fams]];
				for (var x_spou = 0; x_spou < spouses.length; x_spou++)
				{
					if (spouses[x_spou] !== data[x])
					{
						txt += sep + '<a class="dwr-index" href="' + indiHrefOptimized(spouses[x_spou]) + '">';
						txt += I_name[spouses[x_spou]] + '</a>';
						sep = '<br>';
					}
				}
			}
			return(txt);
		},
		fsort: false
	});
	if (search.IndexShowParents) columns.push({
		title: _('Parents'),
		ftext: function(x, col) {
			var txt = '';
			var sep = '';
			for (var x_famc = 0; x_famc < I_famc[data[x]].length; x_famc++)
			{
				var parents = F_spou[I_famc[data[x]][x_famc].index];
				for (var x_spou = 0; x_spou < parents.length; x_spou++)
				{
					if (parents[x_spou] !== data[x])
					{
						txt += sep + '<a class="dwr-index" href="' + indiHrefOptimized(parents[x_spou]) + '">';
						txt += I_name[parents[x_spou]] + '</a>';
						sep = '<br>';
					}
				}
			}
			return(txt);
		},
		fsort: false
	});
	html += printIndex('I', data, [0, 'asc'], columns);
	return(html);
}

function printIndexSpouseText(fdx, col)
{
	var gender = (col == 0)? 'M' : 'F';
	for (var j = 0; j < F_spou[fdx].length; j++)
		if (I_gender[F_spou[fdx][j]] == gender)
			return(I_name[F_spou[fdx][j]]);
	return('');
}
function printIndexSpouseIdx(fdx, col)
{
	var gender = (col == 0)? 'M' : 'F';
	for (var j = 0; j < F_spou[fdx].length; j++)
		if (I_gender[F_spou[fdx][j]] == gender)
			return(F_spou[fdx][j]);
	return(-1);
}


function htmlFamiliesIndex(data)
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('I', 'name'),
			NameSplitScripts('I', 'gender'),
			NameSplitScripts('F', 'spou'),
			(search.IndexShowMarriage ? NameSplitScripts('F', 'marr_year') : [])]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('I', 'name');
	buildDataArray('I', 'gender');
	buildDataArray('F', 'spou');
	if (search.IndexShowMarriage) buildDataArray('F', 'marr_year');

	// Build index
	var html = '';
	if (typeof(data) == 'undefined')
	{
		html += '<h2 class="page-header">' + _('Families Index') + '</h2>';
		data = new Array(DB_SIZES['F']);
		for (var x = 0; x < DB_SIZES['F']; x++) data[x] = x;
	}
	var columns = [{
		title: _('Father'),
		ftext: function(x, col) {return(printIndexSpouseText(data[x], col))},
		fhref: function(x) {return(famHrefOptimized(data[x]))},
		fsort: function(x, col) {return(printIndexSpouseIdx(data[x], col))}
	}, {
		title: _('Mother'),
		ftext: function(x, col) {return(printIndexSpouseText(data[x], col))},
		fhref: function(x) {return(famHrefOptimized(data[x]))},
		fsort: function(x, col) {return(printIndexSpouseIdx(data[x], col))}
	}];
	if (search.IndexShowMarriage) columns.push({
		title: _('Marriage'),
		ftext: function(x, col) {return(F_marr_year[data[x]])}
	});
	html += printIndex('F', data, [0, 'asc'], columns);
	return(html);
}


function indexBkrefName(type, referencedType, referencedDx, bk_field, objects, name_prop, ref)
{
	// Returns the nameof a back reference from objects of type <objects> listed in the field <bk_field> of record <referencedDx> of table <referencedType>
	// <type> is the type of the back reference link
	// <ref> is a function that gets the URL for the back reference
	var bk_table;
	if (type == BKREF_TYPE_SOURCE)
	{
		// Extract the list of object referencing the citations referencing the source
		var bk_table = [];
		for (var x_cita = 0; x_cita < S_bkc[referencedDx].length; x_cita++)
		{
			var cdx = S_bkc[referencedDx][x_cita];
			for (var x_bk = 0; x_bk < C(cdx, bk_field).length; x_bk++) bk_table.push(C(cdx, bk_field)[x_bk]);
		}
	}
	else
	{
		bk_table = window[referencedType + '_' + bk_field][referencedDx];
	}
	var txt = '';
	var sep = '';
	var already_found = [];
	var names = window[objects + '_' + name_prop];
	for (var x_bk = 0; x_bk < bk_table.length; x_bk++)
	{
		var x_object;
		if (type == BKREF_TYPE_INDEX) x_object = bk_table[x_bk];
		if (type == BKREF_TYPE_MEDIA) x_object = bk_table[x_bk].bk_idx;
		if (type == BKREF_TYPE_SOURCE) x_object = bk_table[x_bk];
		if (type == BKREF_TYPE_REPO) x_object = bk_table[x_bk].s_idx;
		if ($.inArray(x_object, already_found) == -1)
		{
			already_found.push(x_object);
			var name = names[x_object];
			if (name != '')
			{
				txt += sep;
				sep = '<br>';
				txt += '<a class="dwr-index" href="' + ref(x_object) + '">' + name + '</a>';
			}
		}
	}
	return(txt);
}


function htmlMediaIndex(data)
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('M', 'thumb'),
			NameSplitScripts('M', 'title'),
			NameSplitScripts('M', 'gramps_path'),
			NameSplitScripts('M', 'date'),
			NameSplitScripts('M', 'date_sdn'),
			(search.IndexShowBkrefType ? ([].concat.apply([], [
				NameSplitScripts('M', 'bki'),
				NameSplitScripts('M', 'bkf'),
				NameSplitScripts('M', 'bks'),
				NameSplitScripts('M', 'bkp'),
				NameSplitScripts('I', 'name'),
				NameSplitScripts('F', 'name'),
				NameSplitScripts('S', 'title'),
				NameSplitScripts('P', 'name')])) : [])]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('M', 'thumb');
	buildDataArray('M', 'title');
	buildDataArray('M', 'gramps_path');
	buildDataArray('M', 'date');
	buildDataArray('M', 'date_sdn');
	if (search.IndexShowBkrefType)
	{
		buildDataArray('M', 'bki');
		buildDataArray('M', 'bkf');
		buildDataArray('M', 'bks');
		buildDataArray('M', 'bkp');
		buildDataArray('I', 'name');
		buildDataArray('F', 'name');
		buildDataArray('S', 'title');
		buildDataArray('P', 'name');
	}

	// Build index
	var html = '';
	if (typeof(data) == 'undefined')
	{
		html += '<h2 class="page-header">' + _('Media Index') + '</h2>';
		data = new Array(DB_SIZES['M']);
		for (var x = 0; x < DB_SIZES['M']; x++) data[x] = x;
	}
	var columns = [{
		title: '',
		ftext: function(x, col) {return(
			'<a class="thumbnail" href="' + mediaHrefOptimized(data[x]) + '">' +
			'<img src="' + M_thumb[data[x]] + '"></a>'
		);},
		fsort: false
	}, {
		title: _('Title'),
		ftext: function(x, col) {return(M_title[data[x]]);},
		fhref: function(x) {return(mediaHrefOptimized(data[x]));},
		fsort: function(x, col) {return(data[x]);}
	}, {
		title: _('Path'),
		ftext: function(x, col) {return(M_gramps_path[data[x]]);},
		fhref: function(x) {return((M_title[data[x]] == '') ? mediaHrefOptimized(data[x]) : '');}
	}, {
		title: _('Date'),
		ftext: function(x, col) {return(M_date[data[x]]);},
		fsort: function(x, col) {return(M_date_sdn[data[x]]);}
	}];
	if (search.IndexShowBkrefType) columns.push({
		title: _('Used for person'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, 'M', data[x], 'bki', 'I', 'name', indiHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_FAMILIES) columns.push({
		title: _('Used for family'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, 'M', data[x], 'bkf', 'F', 'name', famHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_SOURCES) columns.push({
		title: _('Used for source'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, 'M', data[x], 'bks', 'S', 'title', sourceHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_PLACES) columns.push({
		title: _('Used for place'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, 'M', data[x], 'bkp', 'P', 'name', placeHrefOptimized));},
		fsort: false
	});
	html += printIndex('M', data, [1, 'asc'], columns);
	return(html);
}


function htmlSourcesIndex(data)
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('S', 'title'),
			NameSplitScripts('S', 'author'),
			NameSplitScripts('S', 'abbrev'),
			NameSplitScripts('S', 'publ'),
			(search.IndexShowBkrefType ? ([].concat.apply([], [
				NameSplitScripts('S', 'bkc'),
				NameSplitScripts('C', 'bki'),
				NameSplitScripts('C', 'bkf'),
				NameSplitScripts('C', 'bkm'),
				NameSplitScripts('C', 'bkp'),
				NameSplitScripts('I', 'name'),
				NameSplitScripts('F', 'name'),
				NameSplitScripts('M', 'title'),
				NameSplitScripts('P', 'name')])) : [])]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('S', 'title');
	buildDataArray('S', 'author');
	buildDataArray('S', 'abbrev');
	buildDataArray('S', 'publ');
	if (search.IndexShowBkrefType)
	{
		buildDataArray('S', 'bkc');
		buildDataArray('C', 'bki');
		buildDataArray('C', 'bkf');
		buildDataArray('C', 'bkm');
		buildDataArray('C', 'bkp');
		buildDataArray('I', 'name');
		buildDataArray('F', 'name');
		buildDataArray('M', 'title');
		buildDataArray('P', 'name');
	}

	// Build index
	var html = '';
	if (typeof(data) == 'undefined')
	{
		html += '<h2 class="page-header">' + _('Sources Index') + '</h2>';
		data = new Array(DB_SIZES['S']);
		for (var x = 0; x < DB_SIZES['S']; x++) data[x] = x;
	}
	var columns = [{
		title: _('Title'),
		ftext: function(x, col) {return(S_title[data[x]]);},
		fhref: function(x) {return(sourceHrefOptimized(data[x]));},
		fsort: function(x, col) {return(data[x]);}
	}, {
		title: _('Author'),
		ftext: function(x, col) {return(S_author[data[x]]);},
		fhref: function(x) {return(sourceHrefOptimized(data[x]));},
		fsort: function(x, col) {return(data[x]);}
	}, {
		title: _('Abbreviation'),
		ftext: function(x, col) {return(S_abbrev[data[x]]);},
		fhref: function(x) {return(sourceHrefOptimized(data[x]));},
		fsort: function(x, col) {return(data[x]);}
	}, {
		title: _('Publication information'),
		ftext: function(x, col) {return(S_publ[data[x]]);},
		fhref: function(x) {return(sourceHrefOptimized(data[x]));},
		fsort: function(x, col) {return(data[x]);}
	}];
	if (search.IndexShowBkrefType) columns.push({
		title: _('Used for person'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, 'S', data[x], 'bki', 'I', 'name', indiHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_FAMILIES) columns.push({
		title: _('Used for family'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, 'S', data[x], 'bkf', 'F', 'name', famHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_MEDIA) columns.push({
		title: _('Used for media'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, 'S', data[x], 'bkm', 'M', 'title', mediaHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_PLACES) columns.push({
		title: _('Used for place'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, 'S', data[x], 'bkp', 'P', 'name', placeHrefOptimized));},
		fsort: false
	});
	html += printIndex('S', data, [0, 'asc'], columns);
	return(html);
}


function printPlacesIndexColText(data, x, field)
{
	var pdx = data[x];
	if (P(pdx, 'locations').length == 0) return('');
	P(pdx, 'locations')[0]
	if (typeof(P(pdx, 'locations')[0][field]) == 'undefined') return('');
	return(P(pdx, 'locations')[0][field]);
}

function printPlacesIndexColCoord(pdx, col)
{
	var c = P(pdx, 'coords')[col - 9];
	if (c == '') return('');
	c = Number(c);
	var txt = '000' + Math.abs(c).toFixed(4);
	txt = txt.substr(txt.length - 8);
	txt = ((c < 0)? '-' : '+') + txt;
	return(txt);
}


function htmlPlacesIndex(data)
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('P', 'name'),
			NameSplitScripts('P', 'coords'),
			NameSplitScripts('P', 'type'),
			NameSplitScripts('P', 'code'),
			NameSplitScripts('P', 'locations'),
			(search.IndexShowBkrefType ? ([].concat.apply([], [
				NameSplitScripts('P', 'enclosed_by'),
				NameSplitScripts('P', 'bki'),
				NameSplitScripts('P', 'bkf'),
				NameSplitScripts('I', 'name'),
				NameSplitScripts('F', 'name')])) : [])]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('P', 'name');
	buildDataArray('P', 'coords');
	buildDataArray('P', 'type');
	buildDataArray('P', 'code');
	buildDataArray('P', 'locations');
	if (search.IndexShowBkrefType)
	{
		buildDataArray('P', 'enclosed_by');
		buildDataArray('P', 'bki');
		buildDataArray('P', 'bkf');
		buildDataArray('I', 'name');
		buildDataArray('F', 'name');
	}

	// Build index
	var html = '';
	if (typeof(data) == 'undefined')
	{
		html += '<h2 class="page-header">' + _('Places Index') + '</h2>';
		data = new Array(DB_SIZES['P']);
		for (var x = 0; x < DB_SIZES['P']; x++) data[x] = x;
	}
	var columns = [{
		title: _('Name'),
		ftext: function(x, col) {return(P_name[data[x]]);},
		fhref: function(x) {return(placeHrefOptimized(data[x]));},
		fsort: function(x, col) {return(data[x]);}
	}, {
		title: _('Latitude'),
		ftext: function(x, col) {
			if (P_coords[data[x]][0] == '') return('');
			return(Number(P_coords[data[x]][0]));
		}
	}, {
		title: _('Longitude'),
		ftext: function(x, col) {
			if (P_coords[data[x]][1] == '') return('');
			return(Number(P_coords[data[x]][1]));
		}
	}, {
		title: _('Type'),
		ftext: function(x, col) {return(P_type[data[x]]);}
	}, {
		title: _('Code'),
		ftext: function(x, col) {return(P_code[data[x]]);}
	}, {
		title: STATE,
		ftext: function(x, col) {return(printPlacesIndexColText(data, x, STATE));}
	}, {
		title: COUNTRY,
		ftext: function(x, col) {return(printPlacesIndexColText(data, x, COUNTRY));}
	}, {
		title: POSTAL,
		ftext: function(x, col) {return(printPlacesIndexColText(data, x, POSTAL));}
	}];
	if (search.IndexShowBkrefType) columns.push({
		title: _('Enclosed By'),
		ftext: function(x, col) {
			return(($.map(P_enclosed_by[data[x]], function(enc) {return(P_name[enc.pdx]);})).join('<br>'));
			}
	});
	if (search.IndexShowBkrefType) columns.push({
		title: _('Used for person'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_INDEX, 'P', data[x], 'bki', 'I', 'name', indiHrefOptimized));},
		fsort: false
	});
	if (search.IndexShowBkrefType && INC_FAMILIES) columns.push({
		title: _('Used for family'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_INDEX, 'P', data[x], 'bkf', 'F', 'name', famHrefOptimized));},
		fsort: false
	});
	html += printIndex('P', data, [0, 'asc'], columns);
	return(html);
}


function htmlAddressesIndex()
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('I', 'name'),
			NameSplitScripts('I', 'addrs'),
			NameSplitScripts('I', 'urls')]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('I', 'name');
	buildDataArray('I', 'addrs');
	buildDataArray('I', 'urls');

	// Optimize indiHref calls
	var searchString = BuildSearchString({
		Idx: -1,
		MapExpanded: false
	});
	var indiHrefOptimized = function(idx) {
		return('person.html?' + searchString + '&idx=' + idx);
	};

	// Build addresses table
	var adtable = [];
	var empty_loc = [];
	var empty_url = {type: '', uri: '', descr: ''};
	for (var x_i = 0; x_i < DB_SIZES['I']; x_i++)
	{
		for (var x_ad = 0; x_ad < I(x_i, 'addrs').length; x_ad++)
			adtable.push([x_i, I(x_i, 'addrs')[x_ad].location, empty_url])
		for (var x_url = 0; x_url < I(x_i, 'urls').length; x_url++)
			adtable.push([x_i, empty_loc, I(x_i, 'urls')[x_url]])
	}
	// Print table
	var html = '';
	html += '<h2 class="page-header">' + _('Addresses') + '</h2>';
	var columns = [{
		title: _('Person'),
		ftext: function(x_ad, col) {return(I(adtable[x_ad][0], 'name'));},
		fhref: function(x_ad) {return(indiHrefOptimized(adtable[x_ad][0]));},
		fsort: function(x, col) {return(adtable[x_ad][0]);}
	}, {
		title: _('Address'),
		ftext: function(x_ad, col) {return(locationString(adtable[x_ad][1]));},
	}, {
		title: _('Web Link'),
		ftext: function(x_ad, col) {return(adtable[x_ad][2].descr || adtable[x_ad][2].uri);},
		fhref: function(x_ad) {return(adtable[x_ad][2].uri);}
	}];
	html += printIndex('addr', adtable, [0, 'asc'], columns);
	return(html);
}


function htmlReposIndex(data)
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('R', 'name'),
			NameSplitScripts('R', 'type'),
			NameSplitScripts('R', 'addrs'),
			NameSplitScripts('R', 'urls'),
			(search.IndexShowBkrefType ? ([].concat.apply([], [
				NameSplitScripts('R', 'bks'),
				NameSplitScripts('S', 'title')])) : [])]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('R', 'name');
	buildDataArray('R', 'type');
	buildDataArray('R', 'addrs');
	buildDataArray('R', 'urls');
	if (search.IndexShowBkrefType)
	{
		buildDataArray('R', 'bks');
		buildDataArray('S', 'title');
	}

	// Build index
	var html = '';
	if (typeof(data) == 'undefined')
	{
		html += '<h2 class="page-header">' + _('Repositories') + '</h2>';
		data = new Array(DB_SIZES['R']);
		for (var x = 0; x < DB_SIZES['R']; x++) data[x] = x;
	}
	var columns = [{
		title: _('Repository'),
		ftext: function(x, col) {return(R_name[data[x]]);},
		fhref: repoHrefOptimized,
		fsort: function(x, col) {return(data[x]);}
	}, {
		title: _('Type'),
		ftext: function(x, col) {return(R_type[data[x]]);},
	}, {
		title: _('Addresses'),
		ftext: function(x, col) {
			return(($.map(R_addrs[data[x]], locationString)).join('<br>'));
		},
	}, {
		title: _('Web Links'),
		ftext: function(x, col) {
			return(($.map(R_urls[data[x]], function(url) {
				return('<a class="dwr-index" href="' + url.uri + '">' + (url.descr || url.uri) + '</a>');
			})).join('<br>'));
		},
	}];
	if (search.IndexShowBkrefType && INC_SOURCES) columns.push({
		title: _('Used for source'),
		ftext: function(x, col) {return(indexBkrefName(BKREF_TYPE_REPO, 'R', data[x], 'bks', 'S', 'title', sourceHrefOptimized));},
		fsort: false
	});
	html += printIndex('N', data, [0, 'asc'], columns);
	return(html);
}


//=================================================================
//================================================== Surnames index
//=================================================================

function printSurnameIndex()
{
	if (search.Ndx >= 0)
	{
		var html = '';
		if (N(search.Ndx, 'persons').length == 0)
		{
			html += '<p>' + _('No matching surname.') + '</p>';
		}
		else if (N(search.Ndx, 'persons').length == 1)
		{
			window.location.replace(indiHref(N(search.Ndx, 'persons')[0]));
		}
		else
		{
			var txt = htmlPersonsIndex(N(search.Ndx, 'persons'));
			html +=
				'<h2 class="page-header">' +
				((N(search.Ndx, 'surname').length > 0) ?
					N(search.Ndx, 'surname') :
					'<i>' + _('Without surname') + '</i>') +
				'</h2>' +
				txt;
		}
		return html;
	}
	else
	{
		return printSurnamesIndex();
	}
}

function surnameString(ndx, surname, number, optimize)
{
	if (surname == '') surname = _('Without surname');
	if (optimize)
		return(
			' &nbsp;<a href="surname.html?' + BuildSearchString({Ndx: ndx}) + '">' +
			surname + '</a>&nbsp;<b>(' + number + ')</b>&nbsp; ');
	else
		return(
			'<span class="dwr-nowrap"><a href="surname.html?' + BuildSearchString({Ndx: ndx}) + '">' +
			surname + '</a> <span class="badge">' + number + '</span></span> ');
}

var SURNAMES_OPTIMIZATION_LIMIT = 1000; // Fancy features are disabled above this limit

function printSurnamesIndex()
{
	// Page for all surnames sorted alphabetically
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('N', 'surname'),
			NameSplitScripts('N', 'letter'),
			NameSplitScripts('N', 'persons')]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('N', 'surname');
	buildDataArray('N', 'letter');
	buildDataArray('N', 'persons');

	if (DB_SIZES['N'] > SURNAMES_OPTIMIZATION_LIMIT) console.log('Too many surnames (' + DB_SIZES['N'] + '). Disabling fancy features.');
	
	// Build the surnames titles and texts
	var titles = [];
	var texts = [];
	for (i = 0; i < DB_SIZES['N']; i++)
	{
		if (N_surname[i].length > 0)
		{
			var letter = N_letter[i];
			if ($.inArray(letter, titles) == -1)
			{
				// New initial for the surname
				titles.push(letter);
				texts[letter] = '';
			}
			texts[letter] += surnameString(i, N_surname[i], N_persons[i].length, DB_SIZES['N'] > SURNAMES_OPTIMIZATION_LIMIT);
		}
		else
		{
			// Empty surname
			titles.push('');
			texts[''] = surnameString(i, N_surname[i], N_persons[i].length, DB_SIZES['N'] > SURNAMES_OPTIMIZATION_LIMIT);
		}
	}
	// Print surnames as bootstrap collapsible panels
	var txt = '';
	for (i = 0; i < titles.length; i++)
	{
		var letter = titles[i];
		txt += '<div class="panel panel-default">';
		if (letter != '')
		{
			txt += '<div class="panel-heading dwr-collapsible collapsed" data-toggle="collapse" data-target="#panel_surname_' + i + '">';
			txt += '<h5 class="panel-title">' + letter + '</h5>';
			txt += '</div>';
			txt += '<div id="panel_surname_' + i + '" class="panel-collapse collapse">';
			txt += '<div class="panel-body">';
			txt += texts[letter];
			txt += '</div>';
			txt += '</div>';
		}
		else
		{
			txt += '<div id="panel_surname_' + i + '" class="panel-collapse collapse in">';
			txt += '<div class="panel-body">';
			txt += texts[letter];
			txt += '</div>';
			txt += '</div>';
		}
		txt += '</div>';
	}
	return(
		'<h2 class="page-header">' +
		_('Surnames Index') +
		' <small><a href="surnames2.html?' + BuildSearchString() + '">' +
		_('(sort by quantity)') +
		'</a></small>' +
		'</h2>' +
		txt);
}

function printSurnamesIndex2()
{
	// Page for all surnames sorted by number
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('N', 'surname'),
			NameSplitScripts('N', 'persons')]),
			false);
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('N', 'surname');
	buildDataArray('N', 'persons');
	
	if (DB_SIZES['N'] > SURNAMES_OPTIMIZATION_LIMIT) console.log('Too many surnames (' + DB_SIZES['N'] + '). Disabling fancy features.');

	var html =
		'<h2 class="page-header">' +
		_('Surnames Index') +
		' <small><a href="surnames.html?' + BuildSearchString() + '">' +
		_('(sort by name)') +
		'</a></small>' +
		'</h2>';

	// Build the surnames data
	var surnames = new Array(DB_SIZES['N']);
	for (i = 0; i < DB_SIZES['N']; i++)
	{
		surnames[i] = {
			number: N_persons[i].length,
			name: N_surname[i],
			ndx: i
		};
	}
	surnames.sort(function(a, b) {return(b.number - a.number)});

	// Print surnames as bootstrap collapsible panels
	for (i = 0; i < surnames.length; i++)
	{
		var surname = surnames[i];
		html += surnameString(surname.ndx, surname.name, surname.number, DB_SIZES['N'] > SURNAMES_OPTIMIZATION_LIMIT);
	}
	return html;
}


//=================================================================
//================================================= Back references
//=================================================================

var BKREF_TYPE_INDEX = 0;
var BKREF_TYPE_MEDIA = 1;
var BKREF_TYPE_SOURCE = 2;
var BKREF_TYPE_REPO = 3;
var BKREF_TYPE_REPOREF = 4;

function printBackRefs(type, bki, bkf, bks, bkm, bkp, bkr)
{
	var html = '';
	html += printBackRef(type, bki, indiHref, function(ref) {return(I(ref, 'name'));});
	if (INC_FAMILIES)
		html += printBackRef(type, bkf, famHref, function(ref) {return(F(ref, 'name'));});
	else
		html += printBackRef(type, bkf, null, function(ref) {return(F(ref, 'name'));});
	if (INC_SOURCES)
		html += printBackRef(type, bks, sourceHref, sourName);
	if (INC_MEDIA)
		html += printBackRef(type, bkm, mediaHref, mediaName);
	if (INC_PLACES)
		html += printBackRef(type, bkp, placeHref, function(ref) {return(P(ref, 'name'));});
	if (INC_REPOSITORIES)
		html += printBackRef(type, bkr, repoHref, function(ref) {return(R(ref, 'name'));});
	if (html == '') return('');
	return('<ul class="dwr-backrefs">' + html + '</ul>');
}

function printBackRef(type, bk_table, fref, fname)
{
	var my_fref = function(ref, txt) {
		if (fref == null) return(txt);
		return('<a href="' + fref(ref) + '">' + txt + '</a>');
	};
	var html = '';
	var j;
	for (j = 0; j < bk_table.length; j++)
	{
		var ref = bk_table[j];
		var txt = '';
		if (type == BKREF_TYPE_INDEX)
		{
			// This is a citation, person or family back reference
			txt = my_fref(ref, fname(ref));
		}
		else if (type == BKREF_TYPE_MEDIA)
		{
			// This is a media back reference
			txt = my_fref(ref.bk_idx, fname(ref.bk_idx));
			txt += citaLinks(ref.cita);
			if (ref.note != '')
			{
				txt = '<div>' + txt;
				txt += notePara(ref.note, '<p>');
				txt += '</div>';
			}
		}
		else if (type == BKREF_TYPE_REPO || type == BKREF_TYPE_REPOREF)
		{
			var idx = (type == BKREF_TYPE_REPO) ? ref.s_idx : ref.r_idx;
			// This is a repository back reference
			txt = my_fref(idx, fname(idx));
			if (ref.media_type != '')
				txt += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Media Type') + ': </span>' + ref.media_type + '</p>';
			if (ref.call_number != '')
				txt += '<p class="dwr-attr-value"><span class="dwr-attr-title">' + _('Call Number') + ': </span>' + ref.call_number + '</p>';
			if (ref.note != '')
			{
				txt = '<div>' + txt;
				txt += notePara(ref.note, '<p>');
				txt += '</div>';
			}
		}
		html += '<li>' + txt + '</li>';
	}
	return(html);
}


//=================================================================
//============================================================ Maps
//=================================================================

var mapObject;


function printMap(enabled)
{
	if (!enabled || !INC_PLACES) return([]);
	// Check if there is at least 1 place with coordinates defined
	var found = false;
	for (var j = 0; j < pagePlaces.length; j++)
	{
		var pdx = pagePlaces[j].pdx;
		if (P(pdx, 'coords').join('') != '') found = true;
	}
	if (!found) return([]);
	// Schedule the differed update of the map
	if (search.TabbedPanels && !search.MapExpanded)
		$(window).load(function () {
			if ($(".tab-pane.active.dwr-panel-map").length > 0)
			{
				// The map is already the active tab
				mapUpdate();
			}
			else
			{
				// Waiting for the map to be the active tab
				$('a.dwr-panel-map').on('shown.bs.tab', mapUpdate);
			}
		});
	else
	{
		$(window).load(mapUpdate);
	}
	// Build HTML

	 // +
			// ' <a tabindex="0" data-toggle="popover" data-placement="bottom" title="" data-trigger="focus" data-content="' +
			// _('Click on the map to show it full-screen') +
			// '"><span class="glyphicon glyphicon-question-sign"></span></a>'


	var contents = {
		title: _('Map'),
		text:'<div id="gmap_canvas"></div>',
		panelclass: 'dwr-panel-map'
	};
	if (search.MapExpanded)
	{
		$('body').toggleClass('dwr-fullscreen');
		$('body').children().css('display', 'none');
	}
	return([contents]);
}


var mapUpdated = false;

function mapUpdate()
{
	if (mapUpdated) return;
	mapUpdated = true;
	// Check if online
	if (MAP_SERVICE == 'Google' && typeof(google) == 'undefined') return;
	if (MAP_SERVICE == 'OpenStreetMap' && typeof(ol) == 'undefined') return;
	// Expand map if required
	if (search.MapExpanded)
	{
		$('body').prepend($('#gmap_canvas'));
		$('#gmap_canvas').addClass('dwr-expanded');
		mapResize();
		$(window).resize(mapResize);
	}
	// Get all the coordinates, SW and NE coordinates
	var mapCoords = []; // List of markers coordinates
	var mapGotit = []; // List of markers coordinates already found
	var markerPaces = []; // List of markers places index in table pagePlaces
	var south = 1e10;
	var north = -1e10;
	var west = -1e10;
	var east = 1e10;
	var osmFromProj = 'EPSG:4326';
	var osmToProj = 'EPSG:3857';
	for (var x_place = 0; x_place < pagePlaces.length; x_place++)
	{
		var pdx = pagePlaces[x_place].pdx;
		var lat = Number(P(pdx, 'coords')[0]);
		var lon = Number(P(pdx, 'coords')[1]);
		var sc = P(pdx, 'coords').join('');
		// Check if coordinates are valid
		if (sc != '')
		{
			var x_marker = $.inArray(sc, mapGotit);
			// Check if coordinates are not already in the list
			if (x_marker == -1)
			{
				x_marker = mapGotit.length;
				mapGotit.push(sc);
				markerPaces[x_marker] = [];
			}
			if (MAP_SERVICE == 'Google')
			{
				mapCoords[x_marker] = new google.maps.LatLng(lat, lon);
			}
			else if (MAP_SERVICE == 'OpenStreetMap')
			{
				// mapCoords[mapCoords.length] = [lon, lat];
				mapCoords[x_marker] = ol.proj.transform([lon, lat], osmFromProj, osmToProj);
			}
			markerPaces[x_marker].push(x_place);
			south = Math.min(south, lat);
			north = Math.max(north, lat);
			west = Math.max(west, lon);
			east = Math.min(east, lon);
		}
	}
	// Compute optimal zoom
	var angleW = west - east;
	if (angleW < 0) angleW += 360;
	var zoom = 7;
	if (angleW > 0)
	{
		var GLOBE_WIDTH = 256;
		var GLOBE_HEIGHT = 256;
		var pixelW = $('#gmap_canvas').width();
		var zoomW = Math.log(pixelW * 360 / angleW / GLOBE_WIDTH) / Math.LN2;
		function latRad(lat) {
			var sin = Math.sin(lat * Math.PI / 180);
			var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
			return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
		}
		var angleH = latRad(north) - latRad(south);
		var pixelH = $('#gmap_canvas').height();
		var zoomH = Math.log(pixelH * Math.PI / angleH / GLOBE_HEIGHT) / Math.LN2;
		zoom = Math.floor(Math.min(zoomW, zoomH) / 1.1);
		zoom = Math.min(zoom, 15);
		zoom = Math.max(zoom, 1);
	}
	// Update map
	var osmVectorSource;
	// var osmMarkers;
	if (MAP_SERVICE == 'Google')
	{
		var centerCoord = new google.maps.LatLng((south + north) / 2, (west + east) / 2);
		var mapOptions = {
			scaleControl:    true,
			panControl:      true,
			backgroundColor: '#000000',
			draggable:       true,
			zoom:            zoom,
			center:          centerCoord,
			mapTypeId:       google.maps.MapTypeId.ROADMAP
		}
		mapObject = new google.maps.Map(document.getElementById('gmap_canvas'), mapOptions);
		// Expand event
		google.maps.event.addListener(mapObject, 'click', mapExpand);
	}
	else if (MAP_SERVICE == 'OpenStreetMap')
	{
		var centerCoord = [(west + east) / 2, (south + north) / 2];
		var centerCoord = ol.proj.transform([(west + east) / 2, (south + north) / 2], osmFromProj, osmToProj);
		mapObject = new ol.Map({
			target: $('#gmap_canvas')[0],
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM()
				})
			],
			view: new ol.View({
				center: centerCoord,
				zoom: zoom
			})
		});
		osmVectorSource = new ol.source.Vector({});
		// osmMarkers = new ol.Layer.Markers('Markers');
		// Expand event
		mapObject.on('singleclick', mapExpand);
	}
	// Place markers
	var points = [];
	var nb_max = 0;
	var GetIconProps = function(x_marker)
	{
		var point = points[x_marker];
		var nb = point.nb_birth + point.nb_marr + point.nb_death + point.nb_other;
		nb = Math.max(nb, 1);
		var src = '';
		if (point.nb_birth == nb)
			src = 'data/gramps-geo-birth.png';
		else if (point.nb_marr == nb)
			src = 'data/gramps-geo-marriage.png';
		else if (point.nb_death == nb)
			src = 'data/gramps-geo-death.png';
		else
			src = 'data/gramps-geo-mainmap.png';
		var scale = 0.5 + 1.0 * nb / Math.max(nb_max, 5);
		return({
			src: src,
			scale: scale,
			size: {w: Math.round(48 * scale), h: Math.round(48 * scale)},
			anchor: {x: Math.round(0.1 * 48 * scale), y: Math.round(0.9 * 48 * scale)}
		});
	}
	for (var x_marker = 0; x_marker < mapCoords.length; x_marker++)
	{
		// Sort markerPaces by name
		markerPaces[x_marker].sort(function(a, b) {
			return(P(pagePlaces[a].pdx, 'name').localeCompare(P(pagePlaces[b].pdx, 'name')));
		});
		// Build markers data
		var point = {
			mapName: '',
			mapInfo: '',
			nb_other: 0,
			nb_birth: 0,
			nb_marr: 0,
			nb_death: 0
		};
		var previous_pdx = -1;
		var previous_ul = false;
		for (var x_place = 0; x_place < markerPaces[x_marker].length; x_place++)
		{
			var pp = pagePlaces[markerPaces[x_marker][x_place]];
			var pdx = pp.pdx;
			if (pdx != previous_pdx)
			{
				if (point.mapName) point.mapName += '\n';
				point.mapName += P(pdx, 'name');
				if (previous_ul) point.mapInfo += '</ul>';
				point.mapInfo += '<p class="dwr-mapinfo"><a href="' + placeHref(pdx) + '">' + P(pdx, 'name') + '</a></p>';
				previous_pdx = pdx;
				previous_ul = false;
			}
			var txt = '';
			if (pp.idx >= 0)
			{
				txt += indiLinked(pp.idx, false);
			}
			if (pp.fdx >= 0)
			{
				txt += famLinked(pp.fdx, false);
			}
			if (pp.event) txt += ' (' + (pp.event.type || pp.event.descr) + ')';
			if (txt)
			{
				if (!previous_ul) point.mapInfo += '<ul class="dwr-mapinfo">';
				previous_ul = true;
				point.mapInfo += '<li class="dwr-mapinfo">' + txt + '</li>';
				if ($.inArray(pp.event.type, EVENTS_BIRTH) >= 0)
					point.nb_birth += 1;
				else if ($.inArray(pp.event.type, EVENTS_MARR) >= 0)
					point.nb_marr += 1;
				else if ($.inArray(pp.event.type, EVENTS_DEATH) >= 0)
					point.nb_death += 1;
				else
					point.nb_other += 1;
			}
		}
		if (previous_ul) point.mapInfo += '</ul>';
		nb_max = Math.max(nb_max, point.nb_birth + point.nb_marr + point.nb_death + point.nb_other);
		points[x_marker] = point;
		// Print marker
		if (MAP_SERVICE == 'Google')
		{
			(function(){ // This is used to create instances of local variables
				var ip = GetIconProps(x_marker);
				var marker = new google.maps.Marker({
					position:  mapCoords[x_marker],
					// draggable: true,
					title:     point.mapName,
					map:       mapObject,
					icon: {
						anchor: new google.maps.Point(ip.anchor.x, ip.anchor.y),
						scaledSize: new google.maps.Size(ip.size.w, ip.size.h),
						url: ip.src
					}
				});
				var infowindow = new google.maps.InfoWindow({
					content: point.mapInfo
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(mapObject, marker);
				});
			})();
		}
		else if (MAP_SERVICE == 'OpenStreetMap')
		{
			(function(){ // This is used to create instances of local variables
				var popupname = 'OsmPopup' + x_marker;
				// Create the OpenLayers icon
				var coord = new ol.geom.Point(mapCoords[x_marker]);
				var iconFeature = new ol.Feature({
					geometry: coord,
					name: popupname
				});
				osmVectorSource.addFeature(iconFeature);
				// Create the OpenLayers overlay div
				var popupdiv = $('#gmap_canvas').append('<div id="' + popupname + '"></div>').children().last();
				var popup = new ol.Overlay({
					element: popupdiv[0],
					positioning: 'top-center',
					stopEvent: false
				});
				mapObject.addOverlay(popup);
				// Create the bootstrap popup
				popupdiv.popover({
					'placement': 'top',
					'html': true,
					'title': point.mapName,
					'content': point.mapInfo
				});
				popupdiv.popover('hide');

				popupdiv.on('show.bs.popover', function () {
					// alert("show " + this.id);
					inhibitMapExpand = true;
				})
				popupdiv.on('hide.bs.popover', function () {
					// alert("hide " + this.id);
					inhibitMapExpand = true;
				})
			})();
		}
	}
	if (MAP_SERVICE == 'OpenStreetMap')
	{
		var OsmPointStyle = function(feature, resolution)
		{
			var x_marker = parseInt(feature.p.name.replace('OsmPopup', ''));
			var ip = GetIconProps(x_marker);
			var iconStyle = new ol.style.Style({
				image: new ol.style.Icon(({
					anchor: [ip.anchor.x, ip.anchor.y],
					anchorXUnits: 'pixels',
					anchorYUnits: 'pixels',
					scale: ip.scale,
					src: ip.src
				}))
			});
			return([iconStyle]);
		};

		var vectorLayer = new ol.layer.Vector({
			source: osmVectorSource,
			style: OsmPointStyle
			// style: iconStyle
		});
		mapObject.addLayer(vectorLayer);
		mapObject.on('click', OsmClick);
		$(mapObject.getViewport()).on('mousemove', OsmMove);
	}
}

var inhibitMapExpand = false;

function mapExpand()
{
	if (inhibitMapExpand) return(false);
	search.MapExpanded = !($('body').hasClass('dwr-fullscreen'));
	Redirect();
	return(false);
}


function mapResize()
{
	var div = $('.dwr-expanded');
	if (div.length != 1) return(true);
	var w = $(window).width();
	var h = $(window).height();
	div.width(w);
	div.height(h);
	if (mapObject) mapObject.checkResize();
	return(true);
}


function OsmClick(event)
{
	// Display OpenLayers popup on click

	// Get the popup divs
	var popupdivs = $('#gmap_canvas').find('div').filter(function(index) {
		return(this.id.indexOf('OsmPopup') == 0);
	})

	// Get the icon clicked
	var feature = mapObject.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
		return feature;
	});
	var popupname = '';
	var coord;
	if (feature)
	{
		var geometry = feature.getGeometry();
		coord = geometry.getCoordinates();
		popupname = feature.get('name');
	}

	// Hide all OpenLayers popups except the for clicked icon
	var overlays = mapObject.getOverlays();
	var overlay;
	for (var i = 0; i < overlays.getLength(); i++)
	{
		if (overlays.item(i).getElement().id == popupname) overlay = overlays.item(i);
	}

	inhibitMapExpand = false;
	popupdivs.each(function() {
		if (this.id == popupname)
		{
			overlay.setPosition(coord);
			$(this).popover('show');
		}
		else if ($(this).next('div.popover:visible').length)
		{
			$(this).popover('hide');
		}
	});

	return(false);
}

function OsmMove(event)
{
	// Change OpenLayers mouse cursor when over marker
	var pixel = mapObject.getEventPixel(event.originalEvent);
	var hit = mapObject.forEachFeatureAtPixel(pixel, function(feature, layer) {
		return true;
	});
	if (hit)
	{
		$(mapObject.getTarget()).css('cursor', 'pointer');
	}
	else
	{
		$(mapObject.getTarget()).css('cursor', '');
	}
}


//=================================================================
//================================================== Search by name
//=================================================================

function SearchFromString(ss, data, fextract)
{
	ss = unorm.nfkc(ss).toLowerCase();
	var terms = ss.match(/[^\s]+/ig);
	var results = [];
	if (terms == null) return(results);
	for (var x = 0; x < DB_SIZES[data]; x++)
	{
		var found = true;
		var s = fextract(x);
		s = unorm.nfkc(s).toLowerCase();
		for (var j = 0; j < terms.length; j++)
		{
			if (s.match(terms[j]) == null) found = false;
		}
		if (found) results.push(x);
		// console.log(found + ": "+ ss+"  /  "+s);
	}
	return(results);
}


function SearchObjects()
{
	if (preloadMode)
	{
		PreloadScripts([].concat.apply([], [
			NameSplitScripts('I', 'name'),
			NameSplitScripts('I', 'birth_year'),
			NameSplitScripts('I', 'death_year'),
			NameSplitScripts('M', 'title'),
			NameSplitScripts('M', 'path'),
			NameSplitScripts('S', 'title'),
			NameSplitScripts('S', 'author'),
			NameSplitScripts('S', 'abbrev'),
			NameSplitScripts('S', 'publ'),
			NameSplitScripts('P', 'name')]),
			false);
		htmlPersonsIndex();
		htmlMediaIndex();
		htmlSourcesIndex();
		htmlPlacesIndex();
		return;
	}

	// Merge preloaded data into optimized arrays
	buildDataArray('I', 'name');
	buildDataArray('I', 'birth_year');
	buildDataArray('I', 'death_year');
	buildDataArray('M', 'title');
	buildDataArray('M', 'path');
	buildDataArray('S', 'title');
	buildDataArray('S', 'author');
	buildDataArray('S', 'abbrev');
	buildDataArray('S', 'publ');
	buildDataArray('P', 'name');

	var types = [
		{
			data: 'I',
			fextract: function(idx) {
				return(I_name[idx] + ' ' + I_birth_year[idx] + ' ' + I_death_year[idx]);
			},
			text: _('Persons'),
			findex: htmlPersonsIndex,
			fref: indiHref
		},
		{
			data: 'M',
			fextract: function(mdx) {return(M_title[mdx] + ' ' + M_path[mdx]);},
			text: _('Media'),
			findex: htmlMediaIndex,
			fref: mediaHref
		},
		{
			data: 'S',
			fextract: function(sdx) {return(S_title[sdx] + ' ' + S_author[sdx] + ' ' + S_abbrev[sdx] + ' ' + S_publ[sdx]);},
			text: _('Sources'),
			findex: htmlSourcesIndex,
			fref: sourceHref
		},
		{
			data: 'P',
			fextract: function(pdx) {return(P_name[pdx]);},
			text: _('Places'),
			findex: htmlPlacesIndex,
			fref: placeHref
		}
	];
	var x;
	var nb_found = 0;
	var fref;
	var index;
	var html = '';
	var contents = [];
	for (x = 0; x < types.length; x++)
	{
		var results;
		var type = types[x];
		results = SearchFromString(search.Txt, type.data, type.fextract);
		nb_found += results.length;
		if (results.length == 1 && x == 0)
		{
			// Only 1 person found, redirect to the person page
			fref = type.fref;
			index = results[0];
			break;
		}
		if (results.length > 0)
		{
			fref = type.fref;
			index = results[0];
			contents.push({
				title: type.text + ' (' + results.length + ')',
				text: type.findex(results)
			});
		}
	}
	html += printTitle(3, contents)
	if (nb_found == 1)
	{
		window.location.replace(fref(index));
		html = '';
	}
	else if (nb_found == 0)
	{
		html = '';
		if (search.Txt != '')
		{
			html += '<p>' + _('No matches found') + '</p>';
			$('#dwr-search-txt').focus();
		}
		html += '<p>' + _('Use the search box above in order to find a person.') + '</p>';
	}
	else
	{
		html = ('<p>' + _('Several matches.<br>Precise your search or choose in the lists below.') + '</p>') + html;
	}
	return(html);
}


//=================================================================
//======================================================= Gramps ID
//=================================================================

function ManageSearchStringGids()
{
	// Select between index in table or GID (mutually exclusive)
	var gidTable = [
		['Igid', 'Idx', 'I'],
		['Fgid', 'Fdx', 'F'],
		['Mgid', 'Mdx', 'M'],
		['Sgid', 'Sdx', 'S'],
		['Pgid', 'Pdx', 'P'],
		['Rgid', 'Rdx', 'R']
	];
	for (var i = 0; i < gidTable.length; i += 1)
	{
		// Change GID into index in table
		var gid = gidTable[i][0];
		var dx = gidTable[i][1];
		var table = gidTable[i][2];
		if (search[gid] != '' && search[dx] < 0)
		{
			var xgid = window[table + '_xgid'];
			if (typeof(xgid) === 'undefined')
			{
				PreloadScripts(['dwr_db_' + table + '_xgid.js'], true);
				return;
			}
			if (xgid[search[gid]])
			{
				search[dx] = xgid[search[gid]];
			}
		}
		search[gid] = '';
	}
}


//=================================================================
//======================================================== Calendar
//=================================================================

function printCalendar()
{
	var html = '';
	html += 'printCalendar not implemented';
	return html;
}



//=================================================================
//============================================================ Home
//=================================================================

function HomePage()
{
	var html = '';
	html += '<h1>' + TITLE + '</h1>';
	html += '<p>';
	var tables = [
		["N", "surnames.html"],
        ["I", "persons.html"],
        ["F", "families.html"],
        ["S", "sources.html"],
        ["M", "medias.html"],
        ["P", "places.html"],
        ["R", "repositories.html"]
	];
	var sep = '';
	for (var i = 0; i < tables.length; i += 1)
	{
		var j = $.inArray(tables[i][1], PAGES_FILE_INDEX);
		if (j == -1) continue;
		html += sep
		html +=	'<a href="' + tables[i][1] + '?' + BuildSearchString() + '">';
		html +=	PAGES_TITLE_INDEX[j] + ': ' + DB_SIZES[tables[i][0]];
		html +=	'</a>';
		sep = '<br>';
	}
	html += '<br> <p>' + embedSearchText() + '<p>';
	return html;
}



//=================================================================
//========================================================== Config
//=================================================================

function ConfigPage()
{
	var html = '';
	html += '<h1>' + _('Configuration') + '</h1>';
	html += '<div class="panel panel-default">';
	html += '<div class="panel-body">';
	html += '<form id="dwr-chart-form" role="form" class="form-horizontal">';

	var configsCheck = [
//		['IncFamilies', _('Show family pages'), ''],
//		['IncSources', _('Show sources'), ''],
//		['IncMedia', _('Show images and media objects'), ''],
//		['IncPlaces', _('Show place pages'), ''],
//		['IncRepositories', _('Show repository pages'), ''],
//		['IncNotes', _('Show notes'), ''],
//		['IncAddresses', _('Show addresses'), '</div><hr><div class="row">'],
		['IndexShowBirth', _('Include a column for birth dates on the index pages'), ''],
		['IndexShowDeath', _('Include a column for death dates on the index pages'), ''],
		['IndexShowMarriage', _('Include a column for marriage dates on the index pages'), ''],
		['IndexShowPartner', _('Include a column for partners on the index pages'), ''],
		['IndexShowParents', _('Include a column for parents on the index pages'), ''],
		['IndexShowBkrefType', _('Include references in indexes'), '</div><hr><div class="row">'],
		['MapPlace', _('Include Place map on Place Pages'), ''],
		['MapFamily', _('Include a map in the individuals and family pages'), '</div><hr><div class="row">'],
		['ShowAllSiblings', _('Include half and/ or step-siblings on the individual pages'), '</div><div class="row">'],
		['SourceAuthorInTitle', _('Insert sources author in the sources title'), '</div><div class="row">'],
		['TabbedPanels', _('Use tabbed panels instead of sections'), ''],
		['HideGid', _('Suppress Gramps ID'), ''],
		['IncChangeTime', _('Show last modification time'), '']
	];
	html += '<div class="row">';
	for (var i = 0; i < configsCheck.length; i += 1)
	{
		var opt = configsCheck[i][0];
		html += '<div class="checkbox col-xs-12 col-md-6"><label>';
		html += '<input type="checkbox" id="dwr-cfg-' + opt + '"' + (search[opt] ? ' checked' : '') + '>';
		html += configsCheck[i][1] + '</label></div>';
		html += configsCheck[i][2];
	}
	html += '</div><hr>';
	var configsSelect = [
		['NbEntries', _('Number of entries in the tables'), A_LENGTH_MENU[1]]
	];
	html += '<div class="row">';
	for (var i = 0; i < configsSelect.length; i += 1)
	{
		var opt = configsSelect[i][0];
		var txts = configsSelect[i][2];
		html += '<label for="dwr-cfg-' + opt + '" class="control-label col-xs-8 col-md-4">' + configsSelect[i][1] + '</label>';
		html += '<div class="col-xs-4 col-md-2">';
		html += '<select name="dwr-cfg-' + opt + '" id="dwr-cfg-' + opt + '" class="form-control" size="1">';
		for (var j = 0; j < txts.length; j += 1)
		{
			html += '<option value="' + j + '"' + ((search[opt]== j) ? ' selected' : '') + '>' + txts[j] + '</option>';
		}
		html += '</select></div>';
	}
	html += '</div>'; //row
	html += '<hr>';
	html += '<div class="text-center">';
	html += '<button id="dwr-config-ok" type="button" class="btn btn-primary"> <span class="glyphicon glyphicon-ok"></span> ' + _('OK') + ' </button>';
	html += '</div>';

	html += '</form>';
	html += '</div>'; // panel-body
	html += '</div>'; // panel

	// Events
	$(window).load(function() {
		$('#dwr-config-ok').click(function() {
			for (var i = 0; i < configsCheck.length; i++)
			{
				var opt = configsCheck[i][0];
				search[opt] = $('#dwr-cfg-' + opt)[0].checked ? true : false;
			}
			for (var i = 0; i < configsSelect.length; i++)
			{
				var opt = configsSelect[i][0];
				search[opt] = $('#dwr-cfg-' + opt).val();
			}
			window.location.href = search.P + '?' + BuildSearchString();
			return(false);
		});
	});

	return(html);
}



//=================================================================
//============================================================ Main
//=================================================================

var PageContents;
var preloadMode;

function DwrMain(page)
{
	PageContents = page;
	ParseSearchString();
	preloadMode = true;
	DwrMainRun();
	$(document).ready(function(){
		preloadMode = false;
		DwrMainRun();
	});
}

function DwrMainRun()
{
	//This function is executed in 2 phases: preload and normal
	// When preload is true:
	//   Builds the page, but without printing anything
	//   This allows to preload all the database files required
	//   In this phase, only the function PreloadScripts writes to the document.
	// When preload is false:
	//   The document is printed
	//
	// During the preload phase, PreloadScripts raises exception after every script loading
	// So, during preload phase, DwrMainRun is executed again and again until no more script needs to be loaded.

	if (ScriptIsLoading())
	{
		if (preloadMode) return;
		throw "Loading problem";
	}
	var html;
	try
	{
		if (preloadMode) ManageSearchStringGids();

		if ($.inArray(PageContents, [PAGE_SVG_TREE_FULL, PAGE_SVG_TREE_SAVE, PAGE_SVG_TREE_CONF]) < 0) search.SvgExpanded = false;
		if (PageContents == PAGE_HOME)
		{
			html = HomePage();
		}
		else if (search.Idx >= 0 && ($.inArray(PageContents, [PAGE_SVG_TREE, PAGE_SVG_TREE_FULL, PAGE_SVG_TREE_SAVE]) >= 0))
		{
			if (PageContents == PAGE_SVG_TREE_FULL) search.SvgExpanded = true;
			if (preloadMode)
			{
				searchDuplicate(search.Idx);
				SvgPreload();
			}
			else
			{
				if (PageContents == PAGE_SVG_TREE_SAVE) html = SvgSavePage();
				else html = SvgCreate();
			}
		}
		else if (PageContents == PAGE_SVG_TREE_CONF)
		{
			html = SvgConfPage();
		}
		else if (search.Sdx >= 0 && PageContents == PAGE_SOURCE)
		{
			html = printSource(search.Sdx);
		}
		else if (search.Mdx >= 0 && PageContents == PAGE_MEDIA)
		{
			html = printMedia(search.Mdx);
		}
		else if (search.Idx >= 0 && PageContents == PAGE_INDI)
		{
			html = printIndi(search.Idx);
		}
		else if (search.Fdx >= 0 && PageContents == PAGE_FAM)
		{
			html = printFam(search.Fdx);
		}
		else if (search.Pdx >= 0 && PageContents == PAGE_PLACE && INC_PLACES)
		{
			html = printPlace(search.Pdx);
		}
		else if (search.Rdx >= 0 && PageContents == PAGE_REPO)
		{
			html = printRepo(search.Rdx);
		}
		else if (PageContents == PAGE_SEARCH)
		{
			html = SearchObjects();
		}
		else if (PageContents == PAGE_CONF)
		{
			html = ConfigPage();
		}
		else if (PageContents == PAGE_SURNAMES_INDEX)
		{
			html = printSurnamesIndex();
		}
		else if (PageContents == PAGE_SURNAMES_INDEX2)
		{
			html = printSurnamesIndex2();
		}
		else if (PageContents == PAGE_SURNAME_INDEX)
		{
			html = printSurnameIndex();
		}
		else if (PageContents == PAGE_PERSONS_INDEX)
		{
			html = htmlPersonsIndex();
		}
		else if (PageContents == PAGE_FAMILIES_INDEX)
		{
			html = htmlFamiliesIndex();
		}
		else if (PageContents == PAGE_SOURCES_INDEX)
		{
			html = htmlSourcesIndex();
		}
		else if (PageContents == PAGE_MEDIA_INDEX)
		{
			html = htmlMediaIndex();
		}
		else if (PageContents == PAGE_PLACES_INDEX)
		{
			html = htmlPlacesIndex();
		}
		else if (PageContents == PAGE_ADDRESSES_INDEX)
		{
			html = htmlAddressesIndex();
		}
		else if (PageContents == PAGE_REPOS_INDEX)
		{
			html = htmlReposIndex();
		}
		else
		{
			// Page without index specified. Redirect to the search page
			window.location.replace(searchHref());
		}
	}
	catch(e)
	{
		// return and wait for next DwrMainRun call
		if (!(e instanceof WaitScriptLoad) || !preloadMode)
		{
			throw e;
		}
	}
	if (!preloadMode)
	{
		if (PageContents == PAGE_SVG_TREE_FULL)
		{
			$('body').html(html).toggleClass('dwr-fullscreen');
		}
		else if (PageContents == PAGE_SVG_TREE_SAVE)
		{
			if (search.SvgExpanded) $('body').html(html);
			else $('#body-page').html(html);
		}
		else if ($.inArray(PageContents, [PAGE_SOURCE, PAGE_MEDIA, PAGE_INDI, PAGE_FAM, PAGE_PLACE, PAGE_REPO]) >= 0)
		{
			$('#body-page').html(html);
			handleCitations();
			handleTitles();
		}
		else
		{
			$('#body-page').html(html);
		}
	}
}
