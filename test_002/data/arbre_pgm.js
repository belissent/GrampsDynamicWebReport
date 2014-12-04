// Gramps - a GTK+/GNOME based genealogy program
//
// Copyright (C) 2014 Pierre Bélissent
//
// This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA


//=================================================================
//====== Indexes of the fields in the database exported from GRAMPS
//=================================================================

// I: Individual
I_NAME = 0;
I_SHORT_NAME = 1;
I_NAMES = 2;
I_GENDER = 3;
I_BIRTH_YEAR = 4;
I_DEATH_YEAR = 5;
I_DEATH_AGE = 6;
I_EVENTS = 7;
I_ADDRS = 8;
I_NOTE = 9;
I_MEDIA = 10;
I_CITA = 11;
I_ATTR = 12;
I_URLS = 13;
I_FAMS = 14;
I_FAMC = 15;
I_ASSOC = 16;

// N: Name
N_FULL = 0;
N_TYPE = 1;
N_TITLE = 2;
N_NICK = 3;
N_CALL = 4;
N_GIVEN = 5;
N_SUFFIX = 6;
N_SURNAMES = 7;
N_FAM_NICK = 8
N_DATE = 9;
N_NOTE = 10;
N_CITA = 11;

// A: Attribute
A_TYPE = 0;
A_VALUE = 1;
A_NOTE = 2;
A_CITA = 3;

// F: Family
F_NAME = 0;
F_TYPE = 1;
F_MARR_YEAR = 2;
F_EVENTS = 3;
F_NOTE = 4;
F_MEDIA = 5;
F_CITA = 6;
F_ATTR = 7;
F_SPOU = 8;
F_CHIL = 9;

// FC: Child relationship
FC_INDEX = 0;
FC_TO_FATHER = 1;
FC_TO_MOTHER = 2;
FC_NOTE = 3;
FC_CITA = 4;

// E: Event
E_TYPE = 0;
E_DATE = 1;
E_DATE_ISO = 2;
E_PLACE = 3;
E_DESCR = 4;
E_TEXT = 5;
E_MEDIA = 6;
E_CITA = 7;

// S: Source
S_TITLE = 0;
S_TEXT = 1;
S_NOTE = 2;
S_MEDIA = 3;
S_BKC = 4;
S_REPO = 5;

// C: Citation
C_SOURCE = 0;
C_TEXT = 1;
C_NOTE = 2;
C_MEDIA = 3;
C_BKI = 4;
C_BKF = 5;
C_BKM = 6;
C_BKP = 7;
C_BKR = 8;

// R: Repository
R_NAME = 0;
R_TYPE = 1;
R_ADDRS = 2;
R_NOTE = 3;
R_URLS = 4;
R_BKS = 5;

// M: Media
M_TITLE = 0;
M_GRAMPS_PATH = 1;
M_PATH = 2;
M_MIME = 3;
M_DATE = 4;
M_DATE_ISO = 5;
M_NOTE = 6;
M_CITA = 7;
M_ATTR = 8;
M_BKI = 9;
M_BKF = 10;
M_BKS = 11;
M_BKP = 12;

// P: Place
P_NAME = 0;
P_LOCATIONS = 1;
P_COORDS = 2;
P_NOTE = 3;
P_MEDIA = 4;
P_CITA = 5;
P_URLS = 6;
P_BKI = 7;
P_BKF = 8;

// MR: Media reference
MR_M_IDX = 0;
MR_BK_IDX = 0;
MR_THUMB = 1;
MR_RECT = 2;
MR_NOTE = 3;
MR_CITA = 4;

// RR: Repository reference
RR_R_IDX = 0;
RR_S_IDX = 0;
RR_MEDIA_TYPE = 1;
RR_CALL_NUMBER = 2;
RR_NOTE = 3;

// U: URL
U_TYPE = 0;
U_URI = 1;
U_DESCR = 2;

// AC: Association
AC_PERSON = 0;
AC_RELATIONSHIP = 1;
AC_NOTE = 2;
AC_CITA = 3;

// AD: Address
AD_DATE = 0;
AD_DATE_ISO = 1;
AD_LOCATION = 2;
AD_NOTE = 3;
AD_CITA = 4;

// LOC: Location (for places and addresses)
LOC_STREET = 0;
LOC_LOCALITY = 1;
LOC_PARISH = 2;
LOC_CITY = 3;
LOC_STATE = 4;
LOC_COUNTY = 5;
LOC_ZIP = 6;
LOC_COUNTRY = 7;
LOC_PHONE = 8;;


// Initialize empty arrays by default
if (typeof(I) == "undefined") I = []
if (typeof(F) == "undefined") F = []
if (typeof(S) == "undefined") S = []
if (typeof(R) == "undefined") R = []
if (typeof(M) == "undefined") M = []
if (typeof(P) == "undefined") P = []


//=================================================================
//======================================================= Constants
//=================================================================

// Type of the page
PAGE_INDI = 1;
PAGE_FAM = 2;
PAGE_SOURCE = 3;
PAGE_MEDIA = 4;
PAGE_PLACE = 5;
PAGE_REPO = 6;
PAGE_SIMPLE_TREE = 9;
PAGE_SVG_TREE = 10;
PAGE_SVG_TREE_FULL = 11

//=================================================================
//==================================================== Localisation
//=================================================================

function _(text)
{
	if (__[text]) return(__[text]);
	return(text);
}


//=================================================================
//=============================================== Recherche par nom
//=================================================================

function SearchIFromString(ss)
{
	ss = char_iso2ascii(ss);
	ss = ss.replace(/[^a-zA-Z0-9]+/g, " ");
	ss = ss.toLowerCase();
	var terms = ss.match(/[^\s]+/ig);
	var ti = [];
	if (terms == null) return(ti);
	var i, j, k = 0;
	for (idx = 0; idx < NBI; idx++)
	{
		var found = true;
		var s = I[idx][I_NAME] + " " + I[idx][I_BIRTH_YEAR] + " " + I[idx][I_DEATH_YEAR];
		s = char_iso2ascii(s);
		s = s.replace(/[^a-zA-Z0-9]+/g, " ");
		s = s.toLowerCase();
		for (j = 0; j < terms.length; j++)
		{
			if (s.match(terms[j]) == null) found = false;
		}
		if (found) ti.push(idx);
	}
	return(ti);
}


//=================================================================
//=========================================================== Liens
//=================================================================

function indiRef(idx)
{
	idx = (typeof(idx) !== 'undefined') ? idx : searchIdx;
	window.location.href = "indi.html?" + buildSearchString(idx, -1, -1, -1, -1, -1);
	return(false);
}

function famRef(fdx)
{
	fdx = (typeof(fdx) !== 'undefined') ? fdx : searchFdx;
	window.location.href = "fam.html?" + buildSearchString(-1, fdx, -1, -1, -1, -1);
	return(false);
}

function mediaRef(mdx, m_list)
{
	mdx = (typeof(mdx) !== 'undefined') ? mdx : searchMdx;
	m_list = (typeof(m_list) !== 'undefined') ? m_list : [];
	var lt = "";
	if (searchMdx >= 0 && ArbreType == PAGE_MEDIA)
	{
		m_list = searchImgList;
	}
	if (m_list.length > 0) lt = "&searchImgList=[" + m_list.join(",") + "]";
	window.location.href = "media.html?" + buildSearchString(-1, -1, mdx, -1, -1, -1) + lt;
	return(false);
}

function m_list_from_mr(mr_list)
{
	var m_list = [];
	for (var j = 0; j < mr_list.length; j++)
		m_list[j] = mr_list[j][MR_M_IDX];
	return("[" + m_list.join(",") + "]");
}

function sourRef(sdx)
{
	sdx = (typeof(sdx) !== 'undefined') ? sdx : searchSdx;
	window.location.href = "sour.html?" + buildSearchString(-1, -1, -1, sdx, -1, -1);
	return(false);
}

function treeRef(idx)
{
	idx = (typeof(idx) !== 'undefined') ? idx : searchIdx;
	var url = window.location.href;
	// this removes the anchor at the end, if there is one
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	// this removes the query after the file name, if there is one
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	// The file name is everything before the last slash in the path
	var file = url.substring(url.lastIndexOf("/") + 1, url.length);
	// this remocves the file name
	url = url.substring(0, url.lastIndexOf("/"));
 	// get a valid file name (i.e. centered on an individual)
	ok_files = [
		"indi.html",
		"tree.html",
		"tree_svg.html",
		"tree_svg_full.html"
	];
	var j = 0;
	while ((j < PAGES_FILE.length) && ($.inArray(file, ok_files) == -1))
	{
		file = PAGES_FILE[j];
		j += 1;
	}
	// redirect browser
	window.location.href = url + "/" + file + "?" + buildSearchString(idx, -1, -1, -1, -1, -1);
	return(false);
}

function svgRef(expand)
{
	if (typeof(expand) == "undefined") expand = true
	var page = "tree_svg";
	if (expand) page = "tree_svg_full";
	window.location.href = page + ".html?" + buildSearchString(-1, -1, -1, -1, -1, -1);
	return(false);
}

function placeRef(pdx)
{
	pdx = (typeof(pdx) !== 'undefined') ? pdx : searchPdx;
	window.location.href = "place.html?" + buildSearchString(-1, -1, -1, -1, pdx, -1);
	return(false);
}

function repoRef(rdx)
{
	rdx = (typeof(rdx) !== 'undefined') ? rdx : searchRdx;
	window.location.href = "repo.html?" + buildSearchString(-1, -1, -1, -1, -1, rdx);
	return(false);
}


//=================================================================
//==================================================== Arbre rapide
//=================================================================

var levMax;


function tdClass(lev)
{
	return("simpletree gen" + lev);
}


function tdIshort(idx, lev, tree, style)
{
	tree = (typeof(tree) !== 'undefined') ? tree : true;
	style = (typeof(style) !== 'undefined') ? style : true;
	var page = (tree) ? "tree" : "indi";
	txt = "<a class='simpletree_link' href='javascript:" + page + "Ref(" + idx + ")'>" + I[idx][I_SHORT_NAME];
	var cl = "in0";
	var fz = 12;
	if (idx == searchIdx)
	{
		cl = "in1";
		fz = 16;
		txt += " <span class='simpletree_details'>(" + _("details") + ")</span>";
	}
	txt += "</a>";
	var td =
		"<td" + (style ? " class='simpletree gen" + (levMax-parseInt(lev)) +
		(isImplex(idx) ? " implex" : "") +
		((I[idx][I_GENDER] == "M") ? " male" : ((I[idx][I_GENDER] == "F") ? " female" : " unknown")) +
		"'" : "") + ">" +
		"<p class='" + cl + "' + style='font-size:" + fz + "px;'>" + txt + "</td>";
	return(td);
}

function ascendants(idx, lev)
{
	var txt = "<table border='0' cellspacing='0' cellpadding='0'>";
	var i, j;
	if (lev > 1)
	{
		txt += "<tr align='center' valign='bottom'>";
		for (i = 0; i < I[idx][I_FAMC].length; i++)
		{
			for (j = 0; j < F[I[idx][I_FAMC][i][FC_INDEX]][F_SPOU].length; j++)
			{
				txt += "<td>" + ascendants(F[I[idx][I_FAMC][i][FC_INDEX]][F_SPOU][j], lev - 1) + "</td>";
			}
		}
		txt += "</tr>\n";
	}
	txt += "<tr align='center'>";
	for (i = 0; i < I[idx][I_FAMC].length; i++)
	{
		for (j = 0; j < F[I[idx][I_FAMC][i][FC_INDEX]][F_SPOU].length; j++)
		{
			txt += tdIshort(F[I[idx][I_FAMC][i][FC_INDEX]][F_SPOU][j], lev-1);
		}
	}
	txt += "</tr></table>\n";
	return(txt);
}


function descendants(idx, lev)
{
	var i, j, txt = "";
	if (I[idx][I_FAMS].length > 1) txt += "<table border='0' cellspacing='0' cellpadding='0'><tr align='center' valign='top'>\n";
	for (i = 0; i < I[idx][I_FAMS].length; i++)
	{
		if (I[idx][I_FAMS].length > 1) txt += "<td>";
		txt += "<table border='0' cellspacing='0' cellpadding='0'>";
		var spouses = [];
		for (j = 0; j < F[I[idx][I_FAMS][i]][F_SPOU].length; j++)
		{
			if (F[I[idx][I_FAMS][i]][F_SPOU][j] != idx)
			{
				spouses.push(F[I[idx][I_FAMS][i]][F_SPOU][j]);
			}
		}
		if ((lev == levMax) || (spouses.length > 0))
		{
			txt += "<tr align='center'>";
			var cs = F[I[idx][I_FAMS][i]][F_CHIL].length;
			txt += "<td class='" + tdClass(levMax - parseInt(lev)) + "'" + ((cs > 1) ? (" colspan='" + cs + "'") : "") + ">";
			txt += "<table border='0' cellspacing='0' cellpadding='0'>";
			txt += "<tr align='center'>";
			if (spouses.length == 0)
			{
				txt += "<td><p class='in0'>?</p></td>";
			}
			for (j = 0; j < spouses.length; j++)
			{
				txt += tdIshort(spouses[j], lev, true, false);
			}
			txt += "</tr></table></td></tr>";
		}
		txt += "<tr align='center'>";
		for (j = 0; j < F[I[idx][I_FAMS][i]][F_CHIL].length; j++)
		{
			txt += tdIshort(F[I[idx][I_FAMS][i]][F_CHIL][j][FC_INDEX], lev - 1);
		}
		txt += "</tr>";
		if (lev > 1)
		{
			txt += "<tr align='center' valign='top'>";
			for (j = 0; j < F[I[idx][I_FAMS][i]][F_CHIL].length; j++)
			{
				txt += "<td>";
				txt += descendants(F[I[idx][I_FAMS][i]][F_CHIL][j][FC_INDEX], lev - 1);
				txt += "</td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		if (I[idx][I_FAMS].length > 1) txt += "</td>";
	}
	if (I[idx][I_FAMS].length > 1) txt += "</tr></table>";
	return(txt);
}


function treeBuild(idx)
{
	var html = "";
	var levAsc = $("#FsearchAsc").val();
	var levDesc = $("#FsearchDsc").val();
	html += ("<table border='0' cellspacing='0' cellpadding='0'>");
	levMax = levAsc;
	if (levAsc > 0)
		html += ("<tr align='center' valign='bottom'><td>" + ascendants(idx, levAsc) + "</td></tr>\n");
	html += ("<tr align='center'>" + tdIshort(idx, levAsc, false));
	var fr = [];
	var i,j;
	for (i = 0; i < I[idx][I_FAMC].length; i++)
	{
		for (j = 0; j < F[I[idx][I_FAMC][i][FC_INDEX]][F_CHIL].length; j++)
		{
			if (F[I[idx][I_FAMC][i][FC_INDEX]][F_CHIL][j][FC_INDEX] != idx)
			{
				fr.push(F[I[idx][I_FAMC][i][FC_INDEX]][F_CHIL][j][FC_INDEX]);
			}
		}
	}
	if (fr.length > 0)
	{
		html += (
			"<td><table border='0' cellspacing='0' cellpadding='0'>" +
			"<tr><td><p class='in0'>" + _("Brothers and Sisters") + ":</td></tr>\n");
		for (j = 0; j < fr.length; j++)
		{
			html += ("<tr>" + tdIshort(fr[j], levMax) + "</tr>\n");
		}
		html += ("</table></td>\n");
	}
	html += ("</tr>\n");
	levMax = levDesc;
	if (levDesc > 0)
		html += ("<tr align='center' valign='top'><td>" + descendants(idx,levDesc) + "</td></tr>\n");
	html += ("</table>");
	return(html);
}


//=================================================================
//======================================================= Implexes
//=================================================================

// List of the persons index "idx" of table "I", that appear several times in the ancestry or descendants of the center person
var implexes = [];


function searchImplex(idx)
{
	implexes = [];
	var levAsc = parseInt($("#FsearchAsc").val());
	var levDsc = parseInt($("#FsearchDsc").val());
	searchImplexAsc(idx, levAsc, []);
	searchImplexDsc(idx, levDsc, []);
}


function searchImplexAsc(idx, lev, found)
{
	if (($.inArray(idx, found) >= 0) && ($.inArray(idx, implexes) < 0))
	{
		implexes.push(idx);
		return;
	}
	found.push(idx);
	if (lev <= 0) return;
	for (var x_fam = 0; x_fam < I[idx][I_FAMC].length; x_fam++)
	{
		var fam = F[I[idx][I_FAMC][x_fam][FC_INDEX]];
		for (var x_spou = 0; x_spou < fam[F_SPOU].length; x_spou++)
			searchImplexAsc(fam[F_SPOU][x_spou], lev - 1, found);
	}
}


function searchImplexDsc(idx, lev, found, fnext)
{
	if (($.inArray(idx, found) >= 0) && ($.inArray(idx, implexes) < 0))
	{
		implexes.push(idx);
	}
	found.push(idx);
	if (lev <= 0) return;
	for (var x_fam = 0; x_fam < I[idx][I_FAMS].length; x_fam++)
	{
		var fam = F[I[idx][I_FAMS][x_fam]];
		if (!isImplex(idx))
			for (var x_chil = 0; x_chil < fam[F_CHIL].length; x_chil++)
				searchImplexDsc(fam[F_CHIL][x_chil][FC_INDEX], lev - 1, found);
		for (var x_spou = 0; x_spou < fam[F_CHIL].length; x_spou++)
			if (idx != fam[F_SPOU][x_spou])
				searchImplexDsc(fam[F_SPOU][x_spou], -1, found);
	}
}


function isImplex(idx)
{
	return($.inArray(idx, implexes) >= 0);
}


//=================================================================
//================================= Text for individuals / families
//=================================================================

function indiShortLinked(idx)
{
	return("<a href='javascript:indiRef(" + idx + ")'>" + I[idx][I_SHORT_NAME] + "</a>");
}


function indiLinked(idx, citations)
{
	citations = (typeof(citations) !== 'undefined') ? citations : true;
	var txt = I[idx][I_NAME] + " (" + I[idx][I_BIRTH_YEAR] + "-" + I[idx][I_DEATH_YEAR] + ")";
	if (citations) txt += " " + citaLinks(I[idx][I_CITA]);
	if (idx != searchIdx || ArbreType != PAGE_INDI)
		txt = "<a href='javascript:indiRef(" + idx + ")'>" + txt + "</a>";
	return(txt);
}


function indiDetails(i)
{
	var genders = {
		"M": _("Male"),
		"F": _("Female"),
		"U": _("Unknown")
	};
	var txt = "";
	var x_name;
	txt += "<table class='names'>";
	for (x_name = 0; x_name < i[I_NAMES].length; x_name++)
	{
		var name = i[I_NAMES][x_name];
		var name_full = name[N_FULL];
		if (name[N_DATE] != "") name_full += " (" + name[N_DATE] + ")";
		if (name[N_CITA].length > 0) name_full += " " + citaLinks(name[N_CITA]);
		txt += "<tr><td><p class='attribute_title'>" + name[N_TYPE] + "</p></td><td colspan='2'><p class='attribute_value'>" + name_full + "</p></td></tr>";
		if (name[N_NICK] != "") txt += "<tr><td class='empty'></td><td><p class='attribute_title'>" + _("Nick Name") + "</p></td><td><p class='attribute_value'>" + name[N_NICK] + "</p></td></tr>";
		if (name[N_CALL] != "") txt += "<tr><td class='empty'></td><td><p class='attribute_title'>" + _("Call Name") + "</p></td><td><p class='attribute_value'>" + name[N_CALL] + "</p></td></tr>";
		if (name[N_FAM_NICK] != "") txt += "<tr><td class='empty'></td><td><p class='attribute_title'>" + _("Family Nick Name") + "</p></td><td><p class='attribute_value'>" + name[N_FAM_NICK] + "</p></td></tr>";
		if (name[N_NOTE] != "") txt += "<tr><td class='empty'></td><td><p class='attribute_title'>" + _("Notes") + "</p></td><td>" + notePara(name[N_NOTE], "<p class='attribute_value'>") + "</td></tr>";
	}
	txt += "<tr><td><p class='attribute_title'>" + _("Gender") + "</p></td><td colspan='2'><p class='attribute_value'>" + genders[i[I_GENDER]] + "</p></td></tr>";
	if (i[I_DEATH_AGE] != "") txt += "<tr><td><p class='attribute_title'>" + _("Age at Death") + "</p></td><td colspan='2'><p class='attribute_value'>" + i[I_DEATH_AGE] + "</p></td></tr>";
	txt += "</table>";
	return(txt);
}


function famLinked(fdx, citations)
{
	citations = (typeof(citations) !== 'undefined') ? citations : true;
	var txt =F[fdx][F_NAME];
	if (citations) txt += " " + citaLinks(F[fdx][F_CITA]);
	if (fdx != searchFdx || ArbreType != PAGE_FAM)
		txt = "<a href='javascript:famRef(" + fdx + ")'>" + txt + "</a>";
	return(txt);
}


function noteSection(note, level)
{
	level = (typeof(level) !== 'undefined') ? level : 1;
	var txt = "";
	if (note != "")
	{
		txt += printTitle(level, _("Notes") + ":");
		txt += notePara(note, "<p>");
		txt += printTitleEnd();
	}
	return(txt);
}


function mediaSection(media, level)
{
	level = (typeof(level) !== 'undefined') ? level : 1;
	var txt = "";
	if (media.length > 0)
	{
		txt += printTitle(level, _("Media") + ":");
		txt += "<p>" + mediaLinks(media) + "</p>";
		txt += printTitleEnd();
	}
	return(txt);
}


function eventTable(events, idx, fdx)
{
	var j;
	var txt = "";
	if (events.length > 0)
	{
		txt += "<p class='attribute_section'>" + _("Events") + "</p>";
		txt += "<table class='events'>";
		txt += "<thead><tr>";
		txt += "<th><p class='attribute_header'>" + _("Event") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Date") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Place") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Description") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Notes") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Media") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Sources") + "</p></th>";
		txt += "</tr></thead><tbody>";
		for (j = 0; j < events.length; j++)
		{
			var e = events[j];
			txt += "<tr>";
			txt += "<td><p class='attribute_title'>" + e[E_TYPE] + "</p></td>";
			txt += "<td><p class='attribute_value'>" + e[E_DATE] + "</p></td>";
			txt += "<td><p class='attribute_value'>" + placeLink(e[E_PLACE], idx, fdx, e) + "</p></td>";
			txt += "<td><p class='attribute_value'>" + e[E_DESCR] + "</p></td>";
			txt += "<td>" + notePara(e[E_TEXT], "<p class='attribute_value'>") + "</td>";
			txt += "<td><p class='attribute_value'>" + mediaLinks(e[E_MEDIA]) + "</p></td>";
			txt += "<td><p class='attribute_value'>" + citaLinks(e[E_CITA]) + "</p></td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
	}
	return(txt);
}


function locationString(loc)
{
	var loc2 = [];
	for (var x_loc = 0; x_loc < loc.length; x_loc++)
		if (loc[x_loc] != "") loc2.push(loc[x_loc]);
	return(loc2.join(", "));
}


function addrsTable(addrs)
{
	var x_addr;
	var txt = "";
	if (addrs.length > 0)
	{
		txt += "<p class='attribute_section'>" + _("Addresses") + "</p>";
		txt += "<table class='addrs'>";
		txt += "<thead><tr>";
		txt += "<th><p class='attribute_header'>" + _("Address") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Date") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Notes") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Sources") + "</p></th>";
		txt += "</tr></thead><tbody>";
		for (x_addr = 0; x_addr < addrs.length; x_addr++)
		{
			var addr = addrs[x_addr];
			txt += "<tr>";
			txt += "<td><p class='attribute_value'>" + locationString(addr[AD_LOCATION]) + "</p></td>";
			txt += "<td><p class='attribute_value'>" + addr[AD_DATE] + "</p></td>";
			txt += "<td>" + notePara(addr[AD_NOTE], "<p class='attribute_value'>") + "</td>";
			txt += "<td><p class='attribute_value'>" + citaLinks(addr[AD_CITA]) + "</p></td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
	}
	return(txt);
}


function attrsTable(attrs)
{
	var x_attr;
	var txt = "";
	if (attrs.length > 0)
	{
		txt += "<p class='attribute_section'>" + _("Attributes") + "</p>";
		txt += "<table class='attrs'>";
		txt += "<thead><tr>";
		txt += "<th><p class='attribute_header'>" + _("Attribute") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Value") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Notes") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Sources") + "</p></th>";
		txt += "</tr></thead><tbody>";
		for (x_attr = 0; x_attr < attrs.length; x_attr++)
		{
			var a = attrs[x_attr];
			txt += "<tr>";
			txt += "<td><p class='attribute_title'>" + a[A_TYPE] + "</p></td>";
			txt += "<td><p class='attribute_value'>" + a[A_VALUE] + "</p></td>";
			txt += "<td>" + notePara(a[A_NOTE], "<p class='attribute_value'>") + "</td>";
			txt += "<td><p class='attribute_value'>" + citaLinks(a[A_CITA]) + "</p></td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
	}
	return(txt);
}


function urlsTable(urls)
{
	var x_url;
	var txt = "";
	if (urls.length > 0)
	{
		txt += "<p class='attribute_section'>" + _("Web Links") + "</p>";
		txt += "<table class='urls'>";
		txt += "<thead><tr>";
		txt += "<th><p class='attribute_header'>" + _("Link") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Description") + "</p></th>";
		txt += "</tr></thead><tbody>";
		for (x_url = 0; x_url < urls.length; x_url++)
		{
			var url = urls[x_url];
			txt += "<tr>";
			txt += "<td><p class='attribute_value'><a href='" + url[U_URI] + "'>" + url[U_URI] + "</a></p></td>";
			txt += "<td><p class='attribute_value'>" + url[U_DESCR] + "</p></td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
	}
	return(txt);
}


function assocsTable(assocs)
{
	var x_assoc;
	var txt = "";
	if (assocs.length > 0)
	{
		txt += "<p class='attribute_section'>" + _("Associations") + "</p>";
		txt += "<table class='assocs'>";
		txt += "<thead><tr>";
		txt += "<th><p class='attribute_header'>" + _("Person") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Relationship") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Notes") + "</p></th>";
		txt += "<th><p class='attribute_header'>" + _("Sources") + "</p></th>";
		txt += "</tr></thead><tbody>";
		for (x_assoc = 0; x_assoc < assocs.length; x_assoc++)
		{
			var assoc = assocs[x_assoc];
			txt += "<tr>";
			txt += "<td><p class='attribute_value'>" + indiLinked(assoc[AC_PERSON], false) + "</p></td>";
			txt += "<td><p class='attribute_value'>" + assoc[AC_RELATIONSHIP] + "</p></td>";
			txt += "<td>" + notePara(assoc[AC_NOTE], "<p class='attribute_value'>") + "</td>";
			txt += "<td><p class='attribute_value'>" + citaLinks(assoc[AC_CITA]) + "</p></td>";
			txt += "</tr>";
		}
		txt += "</tbody></table>";
	}
	return(txt);
}


function notePara(note, p)
{
	if (note.indexOf("<div>") == -1 && note.indexOf("<p>") == -1)
		note = p + note + "</p>";
	return(note);
}

var pageSources = [];
var pageCitations = [];
var pageCitationsBullets = [];

function citaLinks(cita)
{
	var txt = "";
	var j, k;
	for (j = 0; j < cita.length; j++)
	{
		var c = C[cita[j]];
		var sdx = c[C_SOURCE];
		var title = S[sdx][S_TITLE];
		if (title != "") title=" title='" + title + "'";
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
		var c_m = mediaLinks(c[C_MEDIA])
		for (k = 0; k < pageCitations[x1].length; k++)
		{
			var c2 = C[pageCitations[x1][k]];
			var c2_m = mediaLinks(c2[C_MEDIA])
			if (c2[C_TEXT] == c[C_TEXT] &&
				c2[C_NOTE] == c[C_NOTE] &&
				c2_m == c_m)
			{
				x2 = k;
				break;
			}
		}
		pageCitations[x1][x2] = cita[j];
		// Reference text
		txt += " <a class='citation_ref' href='#cita_" + sdx + "'" + title + ">" + x1 + "," + x2 + "</a> ";
	}
	return(txt);
}

function printCitations()
{
	if (pageSources.length == 0) return("");
	var txt = "";
	var j, k;
	// Print output
	txt += "<ol>";
	for (j = 0; j < pageSources.length; j++)
	{
		var sdx = pageSources[j];
		txt += "<li><a name='cita_" + sdx + "' href='javascript:sourRef(" + sdx + ")'>";
		txt += sourName(sdx) + "</a>";
		var txts = "";
		pageCitationsBullets[j] = [];
		for (k = 0; k < pageCitations[j].length; k++)
		{
			var cdx = pageCitations[j][k];
			var c = C[cdx];
			var txtc = c[C_TEXT] + c[C_NOTE] + mediaLinks(c[C_MEDIA])
			if (txtc != "")
			{
				txts += "<li>" + txtc + "</li>";
				pageCitationsBullets[j][k] = (j + 1) + citationBullet(k);
			}
			else
			{
				pageCitationsBullets[j][k] = (j + 1) + "";
			}
		}
		if (txts != "") txt += "<ol style='list-style-type: lower-alpha'>" + txts + "</ol>";
		txt += "</li>";
	}
	txt += "</ol>";
	return(txt);
}

function handleCitations()
{
	// Replace references text by the list index
	$(".citation_ref").each(function(i, e) {
		var txt = $(this).text();
		var x = txt.split(",");
		$(this).text(pageCitationsBullets[x[0]][x[1]]);
	});
}

function citationBullet(x2)
{
	var num = "";
	num = String.fromCharCode("a".charCodeAt(0) + (x2 % 26)) + num;
	x2 = Math.floor(x2 / 26);
	if (x2 > 0) num = String.fromCharCode("a".charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode("a".charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode("a".charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode("a".charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	if (x2 > 0) num = String.fromCharCode("a".charCodeAt(0) + (x2 % 27) - 1) + num;
	x2 = Math.floor(x2 / 27);
	return(num);
}

function sourName(sdx)
{
	if (S[sdx][S_TITLE] != "") return(S[sdx][S_TITLE]);
	return(_("Source") + " " + sdx);
}


function mediaName(mdx)
{
	var txt = "";
	var m = M[mdx];
	if (m[M_TITLE] != "") return(m[M_TITLE]);
	return(m[M_GRAMPS_PATH]);
}


// List of places refenreced in the page with for each one:
//    - the place index in table 'P'
//    - the referencing person index in table 'I', -1 if none
//    - the referencing family index in table 'F', -1 if none
//    - the referencing event, if any
var pagePlaces = [];
PP_PDX = 0;
PP_IDX = 1;
PP_FDX = 2;
PP_EVENT = 3;


function placeLink(pdx, idx, fdx, event)
{
	if (typeof(idx) == "undefined") idx = -1;
	if (typeof(fdx) == "undefined") fdx = -1;
	if (typeof(event) == "undefined") event = null;
	if (pdx == -1) return("");
	pagePlaces.push([pdx, idx, fdx, event]);
	if (!INC_PLACES) return(P[pdx][P_NAME]);
	if (ArbreType == PAGE_PLACE && pdx == searchPdx) return(P[pdx][P_NAME]);
	return("<a href='javascript:placeRef(" + pdx + ")'>" + P[pdx][P_NAME] + "</a>");
}


function repoLink(rdx)
{
	if (rdx == -1) return("");
	if (ArbreType == PAGE_REPO && rdx == searchRdx) return(R[rdx][R_NAME]);
	return("<a href='javascript:repoRef(" + rdx + ")'>" + R[rdx][R_NAME] + "</a>");
}


//=================================================================
//========================================================== Titles
//=================================================================

var titleNames = [];


function printTitle(level, title)
{
	var html = "";
	var id = "section_" + titleNames.length;
	var tid = "title_" + id;
	titleNames.push(tid);
	html += "<div class='tree_title' id='" + tid + "'>";
	html += "<h" + level + ">" + title + "</h" + level + ">";
	html += "</div><div id='" + id + "' class='tree_sec" + level + "'>";
	return(html);
}
function printTitleEnd()
{
	return("</div>");
}

function handleTitles()
{
	var j;
	for (j = 0; j < titleNames.length; j++)
	{
		$("#" + titleNames[j]).click(function(event)
		{
			var target = $(event.target);
			if (!target.is("a"))
			{
				var id = $(this).attr("id");
				id = id.replace(/title_/, "");
				$("#" + id).toggleClass("title_hide");
			}
		}).mouseenter(function ()
		{
			$(this).addClass("title_hover");
		}).mouseleave(function ()
		{
			$(this).removeClass("title_hover");
		});
	}
}


//=================================================================
//====================================================== Individual
//=================================================================

function printIndi(idx)
{
	var j, k;
	var html = "";
	html += "<div class='tree_sec1'>";
	html += "<p class='contents_title'>" + I[idx][I_NAME] + " " + citaLinks(I[idx][I_CITA]) + "</p>";
	html += indiDetails(I[idx]);
	html += eventTable(I[idx][I_EVENTS], idx, -1);
	html += addrsTable(I[idx][I_ADDRS]);
	html += attrsTable(I[idx][I_ATTR]);
	html += urlsTable(I[idx][I_URLS]);
	html += assocsTable(I[idx][I_ASSOC]);
	html += mediaSection(I[idx][I_MEDIA]);
	html += noteSection(I[idx][I_NOTE]);
	html += "</div>";
	html += printTitle(1, _("Ancestry") + ":");
	var famc_list = $.map(I[idx][I_FAMC], function (fc) {return(fc[FC_INDEX]);});
	if (INDEX_SHOW_ALL_SIBLINGS)
	{
		for (j = 0; j < I[idx][I_FAMC].length; j++)
		{
			var fdx = I[idx][I_FAMC][j][FC_INDEX];
			for (k = 0; k < F[fdx][F_SPOU].length; k++)
			{
				var spou = I[F[fdx][F_SPOU][k]];
				for (var x_fams = 0; x_fams < spou[I_FAMS].length; x_fams++)
				{
					var fams = spou[I_FAMS][x_fams];
					if ($.inArray(fams, famc_list) < 0) famc_list.push(fams);
				}
			}
		}
	}
	for (j = 0; j < famc_list.length; j++)
	{
		var fdx = famc_list[j];
		html += printTitle(2, _("Parents") + ": " + famLinked(fdx));
		for (k = 0; k < F[fdx][F_SPOU].length; k++)
		{
			html += "<p class='ref_parent'>" + indiLinked(F[fdx][F_SPOU][k]) + "</p>";
		}
		if (F[fdx][F_SPOU].length == 0) html += ("<p class='ref_parent'>" + _("None."));
		
		html += printTitle(3, _("Brothers and Sisters") + ":");
		if (F[fdx][F_CHIL].length > 0) 
		{
			html += "<ol class='ref_brother'>";
			for (k = 0; k < F[fdx][F_CHIL].length; k++)
			{
				html += "<li class='ref_brother'>";
				html += printChildRef(F[fdx][F_CHIL][k]);
				html += "</li>";
			}
			html += "</ol>";
		}
		else
		{
			html += ("<p class='ref_brother'>" + _("None."));
		}
		html += printTitleEnd();
		html += printTitleEnd();
	}
	if (famc_list.length == 0) html += ("<p class='ref_parent'>" + _("None."));
	html += printTitleEnd();
	html += printTitle(1, _("Descendants") + ":");
	for (j = 0; j < I[idx][I_FAMS].length; j++)
	{
		var fdx = I[idx][I_FAMS][j];
		var spouses = [];
		var sep = "";
		for (k = 0; k < F[fdx][F_SPOU].length; k++)
		{
			var spou = F[fdx][F_SPOU][k]
			if (spou != idx)
			{
				spouses.push(spou);
				sep = ", ";
			}
		}
		html += printTitle(2, famLinked(fdx));
		for (k = 0; k < spouses.length; k++)
		{
			html += "<p class='ref_spouse'>" + indiLinked(spouses[k]) + "</p>";
		}
		html += eventTable(F[fdx][F_EVENTS], -1, fdx);
		html += attrsTable(F[fdx][F_ATTR]);
		html += mediaSection(F[fdx][F_MEDIA], 3);
		html += noteSection(F[fdx][F_NOTE], 3);
		html += printTitle(3, _("Children") + ":");
		html += "<ol class='ref_child'>";
		for (k = 0; k < F[fdx][F_CHIL].length; k++)
		{
			html += "<li class='ref_child'>";
			html += printChildRef(F[fdx][F_CHIL][k]);
			html += "</li>";
		}
		html += "</ol>";
		if (F[fdx][F_CHIL].length == 0) html += "<p class='ref_child'>" + _("None.") + "</p>";
		html += printTitleEnd();
		html += printTitleEnd();
	}
	if (I[idx][I_FAMS].length == 0) html += ("<p class='ref_spouse'>" + _("None.") + "</p>");
	html += printTitleEnd();
	// Citations and source references
	var ctxt = printCitations();
	if (ctxt != "")
	{
		html += printTitle(1, _("Sources") + ":");
		html += ctxt;
		html += printTitleEnd();
	}
	return(html);
}


function printChildRef(fc)
{
	var txt = "";
	txt += indiLinked(fc[FC_INDEX]);
	txt += " " + citaLinks(fc[FC_CITA]);
	if (fc[FC_NOTE] != "") txt += "<p><b>" + _("Notes") + ":</b></p>" + notePara(fc[FC_NOTE], "</p>");
	rel = fc[FC_TO_FATHER];
	title = _("Relationship to Father");
	if (rel != "" && rel != _("Birth")) txt += "<p class='attribute_value'><span class='attribute_title'>" + title + ": </span>" + rel + "</p>";
	rel = fc[FC_TO_MOTHER];
	title = _("Relationship to Mother");
	if (rel != "" && rel != _("Birth")) txt += "<p class='attribute_value'><span class='attribute_title'>" + title + ": </span>" + rel + "</p>";
	return(txt);
}


//=================================================================
//========================================================== Family
//=================================================================

function printFam(fdx)
{
	var j, k;
	var html = "";
	html += "<p class='contents_title'>" + famLinked(fdx) + "</p>";
	html += eventTable(F[fdx][F_EVENTS], -1, fdx);
	html += attrsTable(F[fdx][F_ATTR]);
	html += mediaSection(F[fdx][F_MEDIA]);
	html += noteSection(F[fdx][F_NOTE]);
	var spouses = F[fdx][F_SPOU];
	html += printTitle(1, _("Parents") + ":");
	for (k = 0; k < spouses.length; k++)
	{
		var idx = spouses[k];
		html += "<div class='tree_sec2'>";
		html += "<p class='ref_spouse_detailed'>" + indiLinked(idx) + "</a></p>";
		html += indiDetails(I[idx]);
		html += eventTable(I[idx][I_EVENTS], idx, -1);
		// html += attrsTable(I[idx][I_ATTR]);
		// html += noteSection(I[idx][I_NOTE]);
		html += "<p>" + mediaLinks(I[idx][I_MEDIA]) + "</p>";
		html += "</div>";
	}
	if (spouses.length == 0) html += ("<p class='ref_spouse'>" + _("None."));
	html += printTitleEnd();
	html += printTitle(1, _("Children") + ":");
	html += "<ol class='ref_child_detailed'>";
	for (k = 0; k < F[fdx][F_CHIL].length; k++)
	{
		var fc = F[fdx][F_CHIL][k];
		var idx = F[fdx][F_CHIL][k][FC_INDEX];
		html += "<li class='ref_child_detailed'>" + printChildRef(F[fdx][F_CHIL][k])
		html += indiDetails(I[idx]);
		html += eventTable(I[idx][I_EVENTS], idx, -1);
		// html += attrsTable(I[idx][I_ATTR]);
		// html += noteSection(I[idx][I_NOTE]);
		html += "<p>" + mediaLinks(I[idx][I_MEDIA]) + "</p>";
		html += "</li>";
	}
	if (F[fdx][F_CHIL].length == 0) html += ("<p class='ref_child'>" + _("None.") + "</p>");
	html += "</ol>";
	html += printTitleEnd();
	// Map
	if (MAP_FAMILY)
		html += printMap();
	// Citations and source references
	var ctxt = printCitations();
	if (ctxt != "")
	{
		html += printTitle(1, _("Sources") + ":");
		html += ctxt;
		html += printTitleEnd();
	}
	return(html);
}


//=================================================================
//=========================================================== Media
//=================================================================

function mediaLinks(media)
{
	var txt = "";
	var j;
	for (j = 0; j < media.length; j++)
	{
		var mr = media[j];
		var m = M[mr[MR_M_IDX]];
		var alt = m[M_TITLE];
		if (alt == "") alt = m[M_TITLE];
		if (alt == "") alt = m[M_GRAMPS_PATH];
		if (alt == "") alt = _("Media") + " " + mr[MR_M_IDX];
		txt += " <a title='" + alt + "' href='javascript:mediaRef(";
		txt += mr[MR_M_IDX] + "," + m_list_from_mr(media) + ")'>";
		txt += "<img src='" + mr[MR_THUMB] + "' alt='" + alt + "'></a> ";
	}
	return(txt);
}


function printMedia(mdx)
{
	var html = "";
	var m = M[mdx];
	html += "<div id='img_div'>";
	var title = m[M_TITLE];
	if (title == "") title = m[M_GRAMPS_PATH];
	html += "<p class='contents_title'>" + title + " " + citaLinks(m[M_CITA]) + "</p>";
	if (m[M_MIME].indexOf("image") == 0)
	{
		html += "<p class='centered'><img src='" + m[M_PATH] + "'usemap='#imgmap'></p>";
		html += printMediaMap(mdx);
	}
	else
	{
		var name = m[M_GRAMPS_PATH];
		name = name.replace(/.*[\\\/]/, "");
		html += "<p class='centered'><a href='" + m[M_PATH] + "'>" + name + "</a></p>";
	}
	if (m[M_DATE] != "") html += "<p><b>" + _("Date") + ": </b>" + m[M_DATE] + "</p>";
	html += noteSection(m[M_NOTE]);
	html += attrsTable(m[M_ATTR]);
	// Back references
	var bk_txt = printBackRefs(BKREF_TYPE_MEDIA, m[M_BKI], m[M_BKF], m[M_BKS], [], m[M_BKP], []);
	if (bk_txt != "")
	{
		html += printTitle(1, _("References") + ":");
		html += bk_txt;
		html += printTitleEnd();
	}
	// Citations and source references
	var ctxt = printCitations();
	if (ctxt != "")
		html += printTitle(1, _("Sources") + ":");
		html += ctxt;
		html += printTitleEnd();
	html += "</div>";

	// Build the media menu
	var imgI = searchImgList.indexOf(mdx);
	$(window).load(function()
	{
		$("#img_div").prepend(
			"<p class='media_buttons'>" +
			"<a class='media_button' href='javascript:mediaButtonClick(-1)'>" + _("Previous") + "</a>" +
			"<a class='media_button' href='javascript:mediaButtonClick(1)'>" + _("Next") + "</a>" +
			"<a class='media_button' href='javascript:mediaButtonClick(0)'>" + _("Maximize") + "</a>" +
			"<span class='media_button_num'>(&nbsp;" + (imgI + 1) + "&nbsp;/&nbsp;" + searchImgList.length + "&nbsp;)</span>" +
			"</p>");

		placeObjeBtn();
		$("#img_div img").load(placeObjeBtn);
	});

	return(html);
}


function mediaButtonClick(button)
{
	if (button == 0)
	{
		window.location.href = M[searchMdx][M_PATH];
		return(false);
	}
	var imgI = searchImgList.indexOf(searchMdx);
	var i = imgI + button;
	i = (i + searchImgList.length) % searchImgList.length;
	mediaRef(searchImgList[i]);
	return(false);
}


function placeObjeBtn()
{
	var img_w0, img_h0;
	var img = $("#img_div img");
	if ((typeof(img_w0) == 'undefined') || (img_w0 <= 0))
	{
		img_w0 = img.width();
		img_h0 = img.height();
	}
	var dim = bodyContentsMaxSize();
	var pos = img.offset();
	dim.height -= (pos.top - $("#img_div").offset().top);
	dim.width = Math.max(dim.width, 300);
	dim.height = Math.max(dim.height, 300);
	var ratio = Math.min(1.0 * dim.width / img_w0, 1.0 * dim.height / img_h0);
	if (ratio < 1.0)
	{
		img_w0 = img_w0 * ratio;
		img_h0 = img_h0 * ratio;
		img.width(img_w0);
		img.height(img_h0);
	}
	$("area").each(function(j) {
		c = $(this).attr("coords");
		rect = c.split(",");
		rect_img = [img_w0, img_h0, img_w0, img_h0];
		for (var k = 0; k < 4; k++)
		{
			rect[k] = parseInt(rect[k]);
			rect[k] = Math.round(rect[k] * rect_img[k] / 10000.0);
		}
		$(this).attr("coords", rect.join(","));
	});
}

function printMediaMap(mdx)
{
	var html = "";
	var j, k;
	var m = M[mdx];
	html += "<map name='imgmap'>";
	var bkp = m[M_BKP];
	if (!INC_PLACES) bkp = [];
	html += printMediaRefArea(m[M_BKI], "indiRef", function(ref) {return(I[ref][I_NAME]);});
	html += printMediaRefArea(m[M_BKF], "famRef", function(ref) {return(F[ref][F_NAME]);});
	html += printMediaRefArea(m[M_BKS], "sourRef", sourName);
	html += printMediaRefArea(bkp, "placeRef", function(ref) {return(P[ref][P_NAME]);});
	html += "</map>";
	return(html);
}

function printMediaRefArea(bk_table, fref, fname)
{
	var html = "";
	var j, k;
	for (j = 0; j < bk_table.length; j++)
	{
		var ref = bk_table[j];
		idx = ref[MR_BK_IDX];
		var rect = [];
		for (k = 0; k < 4; k++)
		{
			rect[k] = parseInt(ref[MR_RECT][k]);
			rect[k] = Math.round(rect[k] * 100);
		}
		if (!isNaN(rect[0]) && rect.join(",") != "0,0,10000,10000")
		{
			html += "<area shape='rect' coords='" + rect.join(",") + "'";
			html += " href='javascript:" + fref + "(" + idx + ")'";
			html += " title='" + fname(idx) + "'>";
		}
	}
	return(html);
}


//=================================================================
//========================================================== Source
//=================================================================

function printSource(sdx)
{
	var html = "";
	var s = S[sdx];
	if (s[S_TITLE] != "") html += "<p class='contents_title'>" + s[S_TITLE] + "</p>";
	if (s[S_TEXT] != "") html += s[S_TEXT];
	html += mediaSection(s[S_MEDIA]);
	html += noteSection(s[S_NOTE]);
	// Repositories for this source
	if (S[sdx][S_REPO].length > 0)
		html += printTitle(1, _("Repositories") + ":");
		html += printBackRefs(BKREF_TYPE_REPO, [], [], [], [], [], S[sdx][S_REPO]);
		html += printTitleEnd();
	// Citations referencing this source
	html += printTitle(1, _("Citations") + ":");
	if (s[S_BKC].length > 0)
	{
		html += "<ul class='citations'>";
		var j;
		for (j = 0; j < s[S_BKC].length; j++)
		{
			c = C[s[S_BKC][j]]
			// html += "<li>" + _("Citation") + ": ";
			html += "<li>";
			if (c[C_TEXT] != "") html += notePara(c[C_TEXT], "<p>");
			if (c[C_NOTE] != "") html += "<p><b>" + _("Notes") + ":</b></p>" + notePara(c[C_NOTE], "<p>");
			if (c[C_MEDIA].length > 0) html += "<p>" + _("Media") + ": " + mediaLinks(media) + "</p>";
			// Back references
			html += printBackRefs(BKREF_TYPE_INDEX, c[C_BKI], c[C_BKF], [], c[C_BKM], c[C_BKP], c[C_BKR]);
			html += "</li>";
		}
		html += "</ul>";
	}
	else
	{
		html += "<p>" + _("None.") + "</p>";
	}
	html += printTitleEnd();
	return(html);
}


//=================================================================
//========================================================== Places
//=================================================================

function printPlace(pdx)
{
	var p = P[pdx]
	var html = "";
	var parts = [
		_("Street"),
		_("Locality"),
		_("City"),
		_("Church Parish"),
		_("County"),
		_("State/ Province"),
		_("Postal Code"),
		_("Country"),
		_("Latitude"),
		_("Longitude")
	];
	placeLink(pdx);
	var name = p[P_NAME];
	if (name == "") name = locationString(p[P_LOCATIONS]);
	html += "<p class='contents_title'>" + name + " " + citaLinks(p[P_CITA]) + "</p>";
	var j, k;
	for (j = 0; j < p[P_LOCATIONS].length; j++)
	{
		if (p[P_LOCATIONS].length > 1)
		{
			if (j == 0) html += "<p>" + _("Location") + ": </p>";
			else html += "<p>" + _("Alternate Name") + " " + j + ": </p>";
		}
		var loc = p[P_LOCATIONS][j];
		loc[8] = p[P_COORDS][0];
		loc[9] = p[P_COORDS][1];
		html += "<table class='place'>";
		for (k = 0; k < parts.length / 2; k ++)
		{
			html += "<tr><th><p class='attribute_header'>" + parts[k] + "</p></th>";
			html += "<td><p class='attribute_value'>" + loc[k] + "</p></td>";
			html += "<th><p class='attribute_header'>" + parts[k + parts.length / 2] + "</p></th>";
			html += "<td><p class='attribute_value'>" + loc[k + parts.length / 2] + "</p></td></tr>";
		}
		html += "</table>";
	}
	html += urlsTable(p[P_URLS]);
	html += mediaSection(p[P_MEDIA]);
	html += noteSection(p[P_NOTE]);
	// Map
	if (MAP_PLACE)
		html += printMap();
	// Citations and source references
	var ctxt = printCitations();
	if (ctxt != "")
		html += printTitle(1, _("Sources") + ":");
		html += ctxt;
		html += printTitleEnd();
	// Back references
	var bk_txt = printBackRefs(BKREF_TYPE_INDEX, p[P_BKI], p[P_BKF], [], [], [], []);
	if (bk_txt != "")
	{
		html += printTitle(1, _("References") + ":");
		html += bk_txt;
		html += printTitleEnd();
	}
	return(html);
}


//=================================================================
//==================================================== Repositories
//=================================================================

function printRepo(rdx)
{
	var r = R[rdx]
	var html = "";
	html += "<p class='contents_title'>" + r[R_NAME] + "</p>";
	html += "<p class='attribute_value'><span class='attribute_title'>" + _("Type") + ": </span>"
	html += r[R_TYPE] + "</p>";
	html += addrsTable(r[R_ADDRS]);
	html += urlsTable(r[R_URLS]);
	html += noteSection(r[R_NOTE]);
	// Back references
	html += printTitle(1, _("References") + ":");
	var bk_txt = printBackRefs(BKREF_TYPE_REPO, [], [], r[R_BKS], [], [], []);
	if (bk_txt == "") bk_txt = _("None.");
	html += bk_txt;
	html += printTitleEnd();
	// Citations and source references
	var ctxt = printCitations();
	if (ctxt != "")
		html += printTitle(1, _("Sources") + ":");
		html += ctxt;
		html += printTitleEnd();
	return(html);
}


//=================================================================
//=========================================================== Index
//=================================================================


function printIndex(data, defaultsort, columns)
{
	// var time = Date.now();
	var j, k;
	SearchInit();
	// Extract sort commands for the search string
	sort_cmd = searchSort.match(new RegExp("[ad][0-9]+", "g"));
	if (!sort_cmd) sort_cmd = [];
	// Append default sort commands
	for (j = 0; j < defaultsort.length; j++)
		if (($.inArray("a" + defaultsort[j].substr(1), sort_cmd) == -1) &&
			($.inArray("d" + defaultsort[j].substr(1), sort_cmd) == -1))
		{
			sort_cmd[sort_cmd.length] = defaultsort[j];
			searchSort += defaultsort[j];
		}
	// Convert search commands to numbers
	for (j = 0 ; j < sort_cmd.length; j++)
		sort_cmd[j] = [
			(sort_cmd[j].charAt(0) == "a") ? 1 : -1,
			Number(sort_cmd[j].substr(1))
		];
	// Compute data
	// (optimization: copy data in another array in order to call functions ftext, fsort, fhref only once)
	// Also check if a column is empty
	var data_copy = Array(data.length);
	var nb_cols = columns.length;
	var col_empty = [];
	for (j = 0; j < nb_cols; j++) col_empty.push(true);
	for (j = 0; j < data.length; j++)
	{
		var line = [];
		for (k = 0; k < nb_cols; k++)
		{
			var col = [];
			var text = columns[k].ftext(j, k);
			if (typeof(text) == "undefined") text = "";
			text = text.toString();
			col.push(text);
			if (text != "")
			{
				col_empty[k] = false;
				if (columns[k].fhref)
				{
					var hr = columns[k].fhref(j);
					if (hr != "") col[0] = "<a class='index' href='" + hr + "'>" + text + "</a>";
				}
			}
			var text_sort = text;
			if (columns[k].fsort)
			{
				text_sort = columns[k].fsort(j, k);
				if (typeof(text_sort) == "undefined") text_sort = "";
				text_sort = text_sort.toString();
			}
			text_sort = text_sort.replace(/<[^>]*>/g, "");
			col.push(text_sort);
			line.push(col);
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
			for (j = 0; j < data_copy.length; j++)
			{
				data_copy[j][k - nb_cols_suppr] = data_copy[j][k];
			}
		}
	}
	nb_cols -= nb_cols_suppr;
	
	// Sort data
	data_copy.sort(function (la, lb) {
		for (var j = 0; j < sort_cmd.length; j++)
		{
			var k = sort_cmd[j][1];
			var a = la[k][1];
			var b = lb[k][1];
			var cmp = a.localeCompare(b);
			if (cmp != 0) return(cmp * sort_cmd[j][0]);
		}
		return(0);
	});
	
	// Print table
	var html = "";
	if (data_copy.length == 0)
	{
		html += "<p>" + _("None.") + "</p>";
	}
	html += "<table class='index'><tr>";
	for (k=0; k < nb_cols; k++)
	{
		html += "<th><a class='index_title' href='javascript:sortIndex(" + k + ")'>" + columns[k].title + "</a></th>";
	}
	html += "</tr>";
	for (j = 0; j < data_copy.length; j++)
	{
		html += "<tr>";
		for (k = 0; k < nb_cols; k++)
		{
			html += "<td>" + data_copy[j][k][0] + "</td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	// alert(Date.now() - time);
	return(html);
}


function sortIndex(col)
{
	var s = "a" + col;
	// Extract all the sorted columns.
	// searchSort is a string in the form "a1d12a8"
	// "a" means ascending, "d" means descending, followed by the column number
	var sort_cmd = searchSort.match(new RegExp("[ad][0-9]+", "g"));
	// Check if the table is already sorted by the same column
	if (sort_cmd.length > 0 && sort_cmd[0] == "a" + col) s = "d" + col;
	// Remove the previous sort command for the same column
	searchSort = searchSort.replace(new RegExp("[ad]" + col + "(a|d|$)", "g"), "$1");
	// Add the sort command
	searchSort = s + searchSort;
	var url = window.location.href;
	// this removes the anchor at the end, if there is one
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	// this removes the query after the file name, if there is one
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	// redirect page
	window.location.href = url + "?" + buildSearchString() + "&searchSort=" + searchSort;
	return(false);
}


function printPersonsIndex(persons)
{
	document.write(htmlPersonsIndex(persons));
}
function htmlPersonsIndex(persons)
{
	var html = "";
	if (typeof(persons) == "undefined")
	{
		html += "<h1>" + _("Persons Index") + "</h1>";
		persons = [];
		for (var idx = 0; idx < I.length; idx++) persons.push(idx);
	}
	var columns = [{
		title: _("Name"),
		ftext: function(idx, col) {return(I[persons[idx]][I_NAME]);},
		fhref: function(idx) {return("javascript:indiRef(" + persons[idx] + ")");}
	}, {
		title: _("Gender"),
		ftext: function(idx, col) {return(I[persons[idx]][I_GENDER]);}
	}];
	if (INDEX_SHOW_BIRTH) columns.push({
		title: _("Birth"),
		ftext: function(idx, col) {return(I[persons[idx]][I_BIRTH_YEAR]);}
	});
	if (INDEX_SHOW_DEATH) columns.push({
		title: _("Death"),
		ftext: function(idx, col) {return(I[persons[idx]][I_DEATH_YEAR]);}
	});
	if (INDEX_SHOW_PARTNER) columns.push({
		title: _("Spouses"),
		ftext: function(idx, col) {
			var txt = "";
			var sep = "";
			for (var x_fams = 0; x_fams < I[persons[idx]][I_FAMS].length; x_fams++)
			{
				var spouses = F[I[persons[idx]][I_FAMS][x_fams]][F_SPOU];
				for (var x_spou = 0; x_spou < spouses.length; x_spou++)
				{
					if (spouses[x_spou] !== persons[idx])
					{
						txt += sep + "<a class='index' href='javascript:indiRef(" + spouses[x_spou] + ")'>";
						txt += I[spouses[x_spou]][I_NAME] + "</a>";
						sep = "<br>";
					}
				}
			}
			return(txt);
		}
	});
	if (INDEX_SHOW_PARENTS) columns.push({
		title: _("Parents"),
		ftext: function(idx, col) {
			var txt = "";
			var sep = "";
			for (var x_famc = 0; x_famc < I[persons[idx]][I_FAMC].length; x_famc++)
			{
				var parents = F[I[persons[idx]][I_FAMC][x_famc][FC_INDEX]][F_SPOU];
				for (var x_spou = 0; x_spou < parents.length; x_spou++)
				{
					if (parents[x_spou] !== persons[idx])
					{
						txt += sep + "<a class='index' href='javascript:indiRef(" + parents[x_spou] + ")'>";
						txt += I[parents[x_spou]][I_NAME] + "</a>";
						sep = "<br>";
					}
				}
			}
			return(txt);
		}
	});
	html += printIndex(persons, ["a0"], columns);
	return(html);
}


function printIndexSpouseText(fdx, col)
{
	var gender = (col == 0)? "M" : "F";
	for (var j = 0; j < F[fdx][F_SPOU].length; j++)
		if (I[F[fdx][F_SPOU][j]][I_GENDER] == gender)
			return(I[F[fdx][F_SPOU][j]][I_NAME]);
	return("");
}

function printFamiliesIndex()
{
	document.write(htmlFamiliesIndex());
}
function htmlFamiliesIndex()
{
	var html = "";
	html += "<h1>" + _("Families Index") + "</h1>";
	var columns = [{
		title: _("Father"),
		ftext: printIndexSpouseText,
		fhref: function(fdx) {return("javascript:famRef(" + fdx + ")");}
	}, {
		title: _("Mother"),
		ftext: printIndexSpouseText,
		fhref: function(fdx) {return("javascript:famRef(" + fdx + ")");}
	}];
	if (INDEX_SHOW_MARRIAGE) columns.push({
		title: _("Marriage"),
		ftext: function(fdx, col) {return(F[fdx][F_MARR_YEAR]);}
	});
	html += printIndex(F, ["a0", "a1"], columns);
	return(html);
}


function indexBkrefName(type, referenced_object, bk_field, objects, name_index)
{
	var ref = "";
	if (objects === I) ref = "indiRef";
	if (objects === F) ref = "famRef";
	if (objects === S) ref = "sourRef";
	if (objects === M) ref = "mediaRef";
	var bk_table;
	if (type == BKREF_TYPE_SOURCE)
	{
		// Extract the list of object referencing the citations referencing the source
		var bk_table = [];
		for (var x_cita = 0; x_cita < referenced_object[S_BKC].length; x_cita++)
		{
			var citation = C[referenced_object[S_BKC][x_cita]];
			for (var x_bk = 0; x_bk < citation[bk_field].length; x_bk++) bk_table.push(citation[bk_field][x_bk]);
		}
	}
	else
	{
		bk_table = referenced_object[bk_field];
	}
	var txt = "";
	var sep = "";
	var already_found = [];
	for (var x_bk = 0; x_bk < bk_table.length; x_bk++)
	{
		var x_object;
		if (type == BKREF_TYPE_INDEX) x_object = bk_table[x_bk];
		if (type == BKREF_TYPE_MEDIA) x_object = bk_table[x_bk][MR_BK_IDX];
		if (type == BKREF_TYPE_SOURCE) x_object = bk_table[x_bk];
		if (type == BKREF_TYPE_REPO) x_object = bk_table[x_bk][RR_S_IDX];
		if ($.inArray(x_object, already_found) == -1)
		{
			already_found.push(x_object);
			var name = objects[x_object][name_index];
			if (name != "")
			{
				txt += sep + "<a class='index' href='javascript:" + ref + "(" + x_object + ")'>";
				txt += objects[x_object][name_index] + "</a>";
				sep = "<br>";
			}
		}
	}
	return(txt);
}


function printMediaIndex()
{
	document.write(htmlMediaIndex());
}
function htmlMediaIndex()
{
	var html = "";
	html += "<h1>" + _("Media Index") + "</h1>";
	var columns = [{
		title: _("Title"),
		ftext: function(mdx, col) {return(M[mdx][M_TITLE]);},
		fhref: function(mdx) {return("javascript:mediaRef(" + mdx + ")");}
	}, {
		title: _("Path"),
		ftext: function(mdx, col) {return(M[mdx][M_GRAMPS_PATH]);},
		fhref: function(mdx) {return((M[mdx][M_TITLE] == "") ? "javascript:mediaRef(" + mdx + ")" : "");}
	}, {
		title: _("Date"),
		ftext: function(mdx, col) {return(M[mdx][M_DATE]);},
		fsort: function(mdx, col) {return(M[mdx][M_DATE_ISO]);}
	}];
	if (INDEX_SHOW_BKREF_TYPE) columns.push({
		title: _("Used for person"),
		ftext: function(mdx, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, M[mdx], M_BKI, I, I_NAME));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_FAMILIES) columns.push({
		title: _("Used for family"),
		ftext: function(mdx, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, M[mdx], M_BKF, F, F_NAME));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_SOURCES) columns.push({
		title: _("Used for source"),
		ftext: function(mdx, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, M[mdx], M_BKS, S, S_TITLE));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_PLACES) columns.push({
		title: _("Used for place"),
		ftext: function(mdx, col) {return(indexBkrefName(BKREF_TYPE_MEDIA, M[mdx], M_BKP, P, P_NAME));}
	});
	html += printIndex(M, ["a0", "a1"], columns);
	return(html);
}


function printSourcesIndex()
{
	document.write(htmlSourcesIndex());
}
function htmlSourcesIndex()
{
	var html = "";
	html += "<h1>" + _("Sources Index") + "</h1>";
	var columns = [{
		title: _("Title"),
		ftext: function(sdx, col) {return(sourName(sdx));},
		fhref: function(sdx) {return("javascript:sourRef(" + sdx + ")");}
	}];
	if (INDEX_SHOW_BKREF_TYPE) columns.push({
		title: _("Used for person"),
		ftext: function(sdx, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, S[sdx], C_BKI, I, I_NAME));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_FAMILIES) columns.push({
		title: _("Used for family"),
		ftext: function(sdx, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, S[sdx], C_BKF, F, F_NAME));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_MEDIA) columns.push({
		title: _("Used for media"),
		ftext: function(sdx, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, S[sdx], C_BKM, S, S_TITLE));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_PLACES) columns.push({
		title: _("Used for place"),
		ftext: function(sdx, col) {return(indexBkrefName(BKREF_TYPE_SOURCE, S[sdx], C_BKP, P, P_NAME));}
	});
	html += printIndex(S, ["a0"], columns);
	return(html);
}


function printPlacesIndexColText(pdx, col)
{
	if (P[pdx][P_LOCATIONS].length == 0) return("");
	return(P[pdx][P_LOCATIONS][0][8 - col]);
}

function printPlacesIndexColCoord(pdx, col)
{
	var c = P[pdx][P_COORDS][col - 9];
	if (c == "") return("");
	c = Number(c);
	var txt = "000" + Math.abs(c).toFixed(4);
	txt = txt.substr(txt.length - 8);
	txt = ((c < 0)? "-" : "+") + txt;
	return(txt);
}

function printPlacesIndex()
{
	document.write(htmlPlacesIndex());
}
function htmlPlacesIndex()
{
	var html = "";
	html += "<h1>" + _("Places Index") + "</h1>";
	var columns = [{
		title: _("Name"),
		ftext: function(pdx, col) {return(P[pdx][P_NAME]);},
		fhref: function(pdx) {return("javascript:placeRef(" + pdx + ")");}
	}, {
		title: _("Country"),
		ftext: printPlacesIndexColText
	}, {
		title: _("Postal Code"),
		ftext: printPlacesIndexColText
	}, {
		title: _("State/ Province"),
		ftext: printPlacesIndexColText
	}, {
		title: _("County"),
		ftext: printPlacesIndexColText
	// }, {
		// title: _("Church Parish"),
		// ftext: printPlacesIndexColText
	}, {
		title: _("City"),
		ftext: printPlacesIndexColText
	// }, {
		// title: _("Locality"),
		// ftext: printPlacesIndexColText
	// }, {
		// title: _("Street"),
		// ftext: printPlacesIndexColText
	}, {
		title: _("Latitude"),
		ftext: function(pdx, col) {
			if (P[pdx][P_COORDS][0] == "") return("");
			return(Number(P[pdx][P_COORDS][0]));
		}
	}, {
		title: _("Longitude"),
		ftext: function(pdx, col) {
			if (P[pdx][P_COORDS][1] == "") return("");
			return(Number(P[pdx][P_COORDS][1]));
		}
	}];
	if (INDEX_SHOW_BKREF_TYPE) columns.push({
		title: _("Used for person"),
		ftext: function(pdx, col) {return(indexBkrefName(BKREF_TYPE_INDEX, P[pdx], P_BKI, I, I_NAME));}
	});
	if (INDEX_SHOW_BKREF_TYPE && INC_FAMILIES) columns.push({
		title: _("Used for family"),
		ftext: function(pdx, col) {return(indexBkrefName(BKREF_TYPE_INDEX, P[pdx], P_BKF, F, F_NAME));}
	});
	html += printIndex(P, ["a0"], columns);
	return(html);
}



function printAddressesIndex()
{
	document.write(htmlAddressesIndex());
}
function htmlAddressesIndex()
{
	// Build addresses table
	var adtable = [];
	var empty_loc = [];
	var empty_url = ["", ""];
	for (var x_i = 0; x_i < I.length; x_i++)
	{
		var i = I[x_i];
		for (var x_ad = 0; x_ad < i[I_ADDRS].length; x_ad++)
			adtable.push([x_i, i[I_ADDRS][x_ad][AD_LOCATION], empty_url])
		for (var x_url = 0; x_url < i[I_URLS].length; x_url++)
			adtable.push([x_i, empty_loc, i[I_URLS][x_url]])
	}
	// Print table
	var html = "";
	html += "<h1>" + _("Addresses") + "</h1>";
	var columns = [{
		title: _("Person"),
		ftext: function(x_ad, col) {return(I[adtable[x_ad][0]][I_NAME]);},
		fhref: function(x_ad) {return("javascript:indiRef(" + adtable[x_ad][0] + ")");}
	}, {
		title: _("Address"),
		ftext: function(x_ad, col) {return(locationString(adtable[x_ad][1]));},
	}, {
		title: _("Web Link"),
		ftext: function(x_ad, col) {return(adtable[x_ad][2][2] || adtable[x_ad][2][1]);},
		fhref: function(x_ad) {return(adtable[x_ad][2][1]);}
	}];
	html += printIndex(adtable, ["a0"], columns);
	return(html);
}



function printReposIndex()
{
	document.write(htmlReposIndex());
}
function htmlReposIndex()
{
	var html = "";
	html += "<h1>" + _("Repositories") + "</h1>";
	var columns = [{
		title: _("Repository"),
		ftext: function(rdx, col) {return(R[rdx][R_NAME]);},
		fhref: function(rdx) {return("javascript:repoRef(" + rdx + ")");}
	}, {
		title: _("Type"),
		ftext: function(rdx, col) {return(R[rdx][R_TYPE]);},
	}, {
		title: _("Addresses"),
		ftext: function(rdx, col) {
			return(($.map(R[rdx][R_ADDRS], locationString)).join("<br>"));
		},
	}, {
		title: _("Web Links"),
		ftext: function(rdx, col) {
			return(($.map(R[rdx][R_URLS], function(url) {
				return("<a class='index' href='" + url[1] + "'>" + (url[2] || url[1]) + "</a>");
			})).join("<br>"));
		},
	}];
	if (INDEX_SHOW_BKREF_TYPE && INC_SOURCES) columns.push({
		title: _("Used for source"),
		ftext: function(rdx, col) {return(indexBkrefName(BKREF_TYPE_REPO, R[rdx], R_BKS, S, S_TITLE));}
	});
	html += printIndex(R, ["a0"], columns);
	return(html);
}


//=================================================================
//================================================== Surnames index
//=================================================================

function printSurnameIndex()
{
	SearchInit();
	if (searchSurn >= 0)
	{
		document.write("<h1>", ((LIsurn[searchSurn][0].length > 0) ? LIsurn[searchSurn][0] : "<i>" + _("Without surname") + "</i>"), "</h1>");
		document.write(htmlPersonsIndex(LIsurn[searchSurn][1]));
	}
	else
	{
		printSurnamesIndex();
	}
}

function printSurnamesIndex()
{
	SearchInit();
	document.write("<h1>", _("Surnames Index"), "</h1>");

	var l = "}";
	var sep = "<p>";
	for (i=0; i<LIsurn.length; i++)
	{
		var l2 = char_iso2ascii(LIsurn[i][0].substring(0, 1)).toUpperCase();
		if (l2 != l)
		{
			l = l2;
			document.write("<h2>", ((l.length > 0) ? l : "<i>" + _("Without surname") + "</i>"), "</h2>");
			sep = "<p>";
		}
		document.write(sep,
			"<a href='surname.html?", buildSearchString(-1, -1, -1, -1, -1, -1, i), "'>",
			((LIsurn[i][0].length > 0) ? LIsurn[i][0] : "<i>" + _("Without surname") + "</i>"), "</a> (", LIsurn[i][1].length, ")");
		sep = ", ";
	}
}


//=================================================================
//================================================= Back references
//=================================================================

BKREF_TYPE_INDEX = 0;
BKREF_TYPE_MEDIA = 1;
BKREF_TYPE_SOURCE = 2;
BKREF_TYPE_REPO = 3;

function printBackRefs(type, bki, bkf, bks, bkm, bkp, bkr)
{
	if (!INC_PLACES) bkp = [];
	var html = "";
	html += printBackRef(type, bki, "indiRef", function(ref) {return(I[ref][I_NAME]);});
	html += printBackRef(type, bkf, "famRef", function(ref) {return(F[ref][F_NAME]);});
	html += printBackRef(type, bks, "sourRef", sourName);
	html += printBackRef(type, bkm, "mediaRef", mediaName);
	html += printBackRef(type, bkp, "placeRef", function(ref) {return(P[ref][P_NAME]);});
	html += printBackRef(type, bkr, "repoRef", function(ref) {return(R[ref][R_NAME]);});
	if (html == "") return("");
	return("<ul class='backrefs'>" + html + "</ul>");
}

function printBackRef(type, bk_table, fref, fname)
{
	var html = "";
	var j;
	for (j = 0; j < bk_table.length; j++)
	{
		var ref = bk_table[j];
		var txt = "";
		if (type == BKREF_TYPE_INDEX)
		{
			// This is a citation, person or family back reference
			txt = "<a href='javascript:" + fref + "(" + ref + ")'>" + fname(ref) + "</a>";
		}
		else if (type == BKREF_TYPE_MEDIA)
		{
			// This is a media back reference
			txt = "<a href='javascript:" + fref + "(" + ref[MR_BK_IDX] + ")'>" + fname(ref[MR_BK_IDX]) + "</a>";
			txt += " " + citaLinks(ref[MR_CITA]);
			if (ref[MR_NOTE] != "")
			{
				txt = "<div>" + txt;
				txt += notePara(ref[MR_NOTE], "<p>");
				txt += "</div>";
			}
		}
		else if (type == BKREF_TYPE_REPO)
		{
			// This is a media back reference
			txt = "<a href='javascript:" + fref + "(" + ref[RR_R_IDX] + ")'>" + fname(ref[RR_R_IDX]) + "</a>";
			if (ref[RR_MEDIA_TYPE] != "")
				txt += "<p class='attribute_value'><span class='attribute_title'>" + _("Media Type") + ": </span>" + ref[RR_MEDIA_TYPE] + "</p>";
			if (ref[RR_CALL_NUMBER] != "")
				txt += "<p class='attribute_value'><span class='attribute_title'>" + _("Call Number") + ": </span>" + ref[RR_CALL_NUMBER] + "</p>";
			if (ref[RR_NOTE] != "")
			{
				txt = "<div>" + txt;
				txt += notePara(ref[RR_NOTE], "<p>");
				txt += "</div>";
			}
		}
		html += "<li>" + txt + "</li>";
	}
	return(html);
}


//=================================================================
//============================================================ Maps
//=================================================================

var mapObject;
var mapExpanded = false;


function printMap()
{
	var html = "";
	// Check if there is at least 1 place with coordinates defined
	var found = false;
	for (var j = 0; j < pagePlaces.length; j++)
	{
		var pdx = pagePlaces[j][PP_PDX];
		if (P[pdx][P_COORDS].join("") != "") found = true;
	}
	if (!found) return("");
	// Schedule the differed update of the map
	$(window).load(mapUpdate)
	// Build HTML
	html += printTitle(1, _("Map"));
	html += "<div id='map_div1' class='map_div1'>";
	html += "<div id='gmap_canvas' class='map_div2'>";
	html += "</div>";
	html += "<style>";
	html += "#gmap_canvas img{max-width:none!important;background:none!important}";
	html += "</style>";
	html += "</div>";
	html += printTitleEnd();
	if (mapExpanded)
	{
		$("body").toggleClass("fullscreen");
		$("body > div").css("display", "none");
	}
	return(html);
}


function mapUpdate()
{
	// Check if online
	if (MAP_SERVICE == "Google" && typeof(google) == "undefined") return;
	if (MAP_SERVICE == "OpenStreetMap" && typeof(ol) == "undefined") return;
	// Expand map if required
	if (mapExpanded)
	{
		$("body").prepend($("#map_div1"));
		$("#map_div1").removeClass("map_div1");
		$("#map_div1").addClass("map_div1_expanded");
		$("#gmap_canvas").removeClass("map_div2");
		$("#gmap_canvas").addClass("map_div2_expanded");
		mapResizeDivs();
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
	var osmFromProj = "EPSG:4326";
	var osmToProj = "EPSG:3857";
	for (var x_place = 0; x_place < pagePlaces.length; x_place++)
	{
		var pdx = pagePlaces[x_place][PP_PDX];
		var lat = Number(P[pdx][P_COORDS][0]);
		var lon = Number(P[pdx][P_COORDS][1]);
		var sc = P[pdx][P_COORDS].join("");
		// Check if coordinates are valid
		if (sc != "")
		{
			var x_marker = $.inArray(sc, mapGotit);
			// Check if coordinates are not already in the list
			if (x_marker == -1)
			{
				x_marker = mapGotit.length;
				mapGotit.push(sc);
				markerPaces[x_marker] = [];
			}
			if (MAP_SERVICE == "Google")
				mapCoords[x_marker] = new google.maps.LatLng(lat, lon);
			else if (MAP_SERVICE == "OpenStreetMap")
				// mapCoords[mapCoords.length] = [lon, lat];
				mapCoords[x_marker] = ol.proj.transform([lon, lat], osmFromProj, osmToProj);
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
		var pixelW = $("#gmap_canvas").width();
		var zoomW = Math.log(pixelW * 360 / angleW / GLOBE_WIDTH) / Math.LN2;
		function latRad(lat) {
			var sin = Math.sin(lat * Math.PI / 180);
			var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
			return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
		}
		var angleH = latRad(north) - latRad(south);
		var pixelH = $("#gmap_canvas").height();
		var zoomH = Math.log(pixelH * Math.PI / angleH / GLOBE_HEIGHT) / Math.LN2;
		zoom = Math.floor(Math.min(zoomW, zoomH) / 1.1);
		zoom = Math.min(zoom, 15);
		zoom = Math.max(zoom, 1);
	}
	// Update map
	var osmVectorSource;
	if (MAP_SERVICE == "Google")
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
		mapObject = new google.maps.Map(document.getElementById("gmap_canvas"), mapOptions);
		// Expand event
		google.maps.event.addListener(mapObject, 'click', mapExpand);
	}
	else if (MAP_SERVICE == "OpenStreetMap")
	{
		var centerCoord = [(west + east) / 2, (south + north) / 2];
		// map = L.map("gmap_canvas");
		// map.setView(centerCoord, zoom);
		// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		// }).addTo(map);
		var centerCoord = ol.proj.transform([(west + east) / 2, (south + north) / 2], osmFromProj, osmToProj);
		mapObject = new ol.Map({
			target: "gmap_canvas",
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
	}
	// Place markers
	for (var x_marker = 0; x_marker < mapCoords.length; x_marker++)
	{
		// Sort markerPaces by name
		markerPaces[x_marker].sort(function(a, b) {
			return(P[pagePlaces[a][PP_PDX]][P_NAME].localeCompare(P[pagePlaces[b][PP_PDX]][P_NAME]));
		});
		// Build markers data
		var mapName = "";
		var mapInfo = "";
		var previous_pdx = -1;
		var previous_ul = false;
		for (var x_place = 0; x_place < markerPaces[x_marker].length; x_place++)
		{
			var pp = pagePlaces[markerPaces[x_marker][x_place]];
			var pdx = pp[PP_PDX];
			if (pdx != previous_pdx)
			{
				if (mapName) mapName += "\n";
				mapName += P[pdx][P_NAME];
				if (previous_ul) mapInfo += "</ul>";
				mapInfo += "<p class='mapinfo'><a href='javascript:placeRef(" + pdx + ")'>" + P[pdx][P_NAME] + "</a></p>";
				previous_pdx = pdx;
				previous_ul = false;
			}
			var txt = "";
			if (pp[PP_IDX] >= 0) txt += indiLinked(pp[PP_IDX], false);
			if (pp[PP_FDX] >= 0) txt += famLinked(pp[PP_FDX], false);
			if (pp[PP_EVENT]) txt += " (" + (pp[PP_EVENT][E_TYPE] || pp[PP_EVENT][E_DESCR]) + ")";
			if (txt)
			{
				if (!previous_ul) mapInfo += "<ul class='mapinfo'>";
				previous_ul = true;
				mapInfo += "<li class='mapinfo'>" + txt + "</li>";
			}
		}
		if (previous_ul) mapInfo += "</ul>";
		// Print marker
		if (MAP_SERVICE == "Google")
		{
			(function(){ // This is used to create instances of local variables
				var marker = new google.maps.Marker({
					position:  mapCoords[x_marker],
					draggable: true,
					title:     mapName,
					map:       mapObject
				});
				var infowindow = new google.maps.InfoWindow({
					content: mapInfo
				});
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(mapObject, marker);
				});
			})();
		}
		else if (MAP_SERVICE == "OpenStreetMap")
		{
			// L.marker(mapCoords[x_marker]).addTo(mapObject);
			var iconFeature = new ol.Feature({
				geometry: new ol.geom.Point(mapCoords[x_marker]),
				name: mapNames[x_marker]
			});
			osmVectorSource.addFeature(iconFeature);
		}
	}
	if (MAP_SERVICE == "OpenStreetMap")
	{
		var iconStyle = new ol.style.Style({
			image: new ol.style.Icon(({
				anchor: [0.5, 46],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: 0.75,
				src: 'http://ol3js.org/en/master/examples/data/icon.png'
			}))
		});
		var vectorLayer = new ol.layer.Vector({
			source: osmVectorSource,
			// style: iconStyle
		});
		mapObject.addLayer(vectorLayer);
	}
}


function mapExpand()
{
	var url = window.location.href;
	// this removes the anchor at the end, if there is one
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	// this removes the query after the file name, if there is one
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	if (mapExpanded)
		window.location.href = url + "?" + buildSearchString();
	else
		window.location.href = url + "?" + buildSearchString() + "&mapExpanded=1";
	return(false);
}


function mapResizeDivs()
{
	var w = $(window).width();
	var h = $(window).height();
	$("#map_div1").width(w);
	$("#map_div1").height(h);
	$("#gmap_canvas").width(w);
	$("#gmap_canvas").height(h);
}


function mapResize()
{
	if (!mapExpanded) return(true);
	mapResizeDivs();
	mapObject.checkResize();
	return(true);
}


//=================================================================
//======================================================= Affichage
//=================================================================

// var ArbreSearch;
var ArbreType;

function arbreMain(arbreSearch, arbreType)
{
	// ArbreSearch = arbreSearch;
	ArbreType = arbreType;

	SearchInit();

	$(document).ready(function(){
		if (searchIdx >= 0)
		{
			FsearchTxt = char_html2iso(I[searchIdx][I_NAME]);
			$("input#FsearchTxt").val(FsearchTxt).trigger("change");
		}
		arbreMainSub();
	});
}

function arbreMainSub()
{
	var html = "";

	if (searchIdx >= 0 && ArbreType == PAGE_SIMPLE_TREE)
	{
		searchImplex(searchIdx);
		// Print individual tree
		html += treeBuild(searchIdx);
		$("#body_tree_inner").html(html);
		$("#body_tree").show();
		$("#body_page").hide();
	}
	else if (searchIdx >= 0 && ArbreType == PAGE_SVG_TREE)
	{
		searchImplex(searchIdx);
		// SVG tree
		html += SvgCreate();
	}
	else if (searchIdx >= 0 && ArbreType == PAGE_SVG_TREE_FULL)
	{
		searchImplex(searchIdx);
		html = SvgCreate(true);
		$("body").html(html).css("overflow", "hidden");
	}
	else if (searchSdx >= 0 && ArbreType == PAGE_SOURCE)
	{
		// Print 1 source
		html += printSource(searchSdx);
	}
	else if (searchMdx >= 0 && ArbreType == PAGE_MEDIA)
	{
		// Print 1 media
		html += printMedia(searchMdx);
	}
	else if (searchIdx >= 0 && ArbreType == PAGE_INDI)
	{
		// Print individual
		html += printIndi(searchIdx);
	}
	else if (searchFdx >= 0 && ArbreType == PAGE_FAM)
	{
		// Print individual
		html += printFam(searchFdx);
	}
	else if (searchPdx >= 0 && ArbreType == PAGE_PLACE && INC_PLACES)
	{
		// Print place
		html += printPlace(searchPdx);
	}
	else if (searchRdx >= 0 && ArbreType == PAGE_REPO)
	{
		// Print repository
		html += printRepo(searchRdx);
	}
	else
	{
		// Force to print TOC
		if ($(".tocless").length > 0)
		{
			$("body").html("").toggleClass("tocless");
			bodyDecorate();
		}
		// Print individuals search result
		var ti;
		if (searchIdx >= 0) ti = [searchIdx];
		else ti = SearchIFromString(FsearchTxt);
		if (ti.length == 1)
		{
			FsearchModified[0] = false;
			// treeRef(ti[0]);
			indiRef(ti[0]);
		}
		else if (ti.length == 0)
		{
			FsearchModified[0] = true;
			if (FsearchTxt != "")
			{
				html += "<p>" + _("There is no matching name.") + "</p>";
				$("#FsearchTxt").focus();
			}
			html += "<p>" + _("Use the search box above in order to find a person.<br>Women are listed with their maiden name.") + "</p>";
		}
		else
		{
			FsearchModified[0] = true;
			html += ("<p>" + _("Several people match.<br>Precise your search or choose in the list below.") + "</p>");
			html += htmlPersonsIndex(ti);
		}
	}

	if (!(searchIdx >= 0 && ArbreType == PAGE_SIMPLE_TREE))
		$("#body_page_inner").html(html);

	if ((ArbreType == PAGE_SIMPLE_TREE) || (ArbreType == PAGE_SVG_TREE))
	{
		// The page is a tree: show tree buttons
		$("#menu_form_tree_buttons").toggleClass("hidden");
	}

	if ((searchIdx >= 0 && ArbreType == PAGE_INDI) ||
		(searchFdx >= 0 && ArbreType == PAGE_FAM))
	{
		handleTitles();
	}
	handleCitations();
}
