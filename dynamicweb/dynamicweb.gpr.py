# -*- coding: utf-8 -*-
#
# Gramps - a GTK+/GNOME based genealogy program
#
# Copyright (C) 2014 Pierre Bélissent
#
# This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
# You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
#
# $Id: $

register(REPORT, 
	id = 'dynamicweb',
	name = _("Dynamic Web Report"),
	description =  _("Produces dynamic web pages for the database"),
	version = '0.0.2',
	gramps_target_version = '4.0',
	status = UNSTABLE,
	fname = 'dynamicweb.py',
	authors = ["Pierre Bélissent"],
	authors_email = [""],
	category = CATEGORY_WEB,
	reportclass = 'DynamicWebReport',
	optionclass = 'DynamicWebOptions',
	report_modes = [REPORT_MODE_GUI, REPORT_MODE_CLI]
)
