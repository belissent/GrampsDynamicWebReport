#! /usr/bin/env python
#
# update_po - tool to update translations
#
# This program is based on "/po/update_po.py" included in Gramps
# Refer to "/po/update_po.py" for Copyrights.
#
# This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
# You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
#
# $Id$

"""
update_po.py for translations.

Examples:

   python update_po.py -t
      Tests if 'gettext' and 'python' are well configured.

   python update_po.py -h
      Calls help and command line interface.

   python update_po.py -p
      Generates a new template/catalog.

   python update_po.py -m de.po
      Merges 'de.po' file with the template/catalog '*.pot'.

   python update_po.py -k de.po
      Checks 'de.po' file, tests to compile and generates a textual resume.
"""

from __future__ import print_function
import os
import sys
from argparse import ArgumentParser

# Windows OS

if sys.platform == 'win32':
	# GetText Win 32 obtained from http://gnuwin32.sourceforge.net/packages/gettext.htm
	# ....\gettext\bin\msgmerge.exe needs to be on the path
	msgmergeCmd = os.path.join('msgmerge.exe')
	msgfmtCmd = os.path.join('msgfmt.exe')
	msgattribCmd = os.path.join('msgattrib.exe')
	xgettextCmd = os.path.join('xgettext.exe')
	pythonCmd = os.path.join('python.exe')

# Others OS

elif sys.platform in ['linux2', 'darwin', 'cygwin']:
	msgmergeCmd = 'msgmerge'
	msgfmtCmd = 'msgfmt'
	msgattribCmd = 'msgattrib'
	xgettextCmd = 'xgettext'
	pythonCmd = os.path.join(sys.prefix, 'bin', 'python')
else:
	print("Found platform %s, OS %s" % (sys.platform, os.name))
	print ("Update PO ERROR: unknown system, don't know msgmerge, ... commands")
	sys.exit(0)


# Name used for the template/catalog *.pot file
POT_NAME = "dynamicweb"

# Path of the gramps pot
GRAMPS_POT_FILE = os.path.join("..", "..", "..", "..", "..", "..", "po", "gramps.pot")


# List of available languages, useful for grouped actions

# need files with po extension
LANG = [file for file in os.listdir('.') if file.endswith('.po')]
# add a special 'all' argument (for 'check' and 'merge' arguments)
LANG.append("all")
# visual polish on the languages list
LANG.sort()

def tests():
	"""
	Testing installed programs.
	We made tests (-t flag) by displaying versions of tools if properly
	installed. Cannot run all commands without 'gettext' and 'python'.
	"""
	try:
		print ("\n====='msgmerge'=(merge our translation)================\n")
		os.system('''%(program)s -V''' % {'program': msgmergeCmd})
	except:
		print ('Please, install %(program)s for updating your translation'
					% {'program': msgmergeCmd})

	try:
		print ("\n==='msgfmt'=(format our translation for installation)==\n")
		os.system('''%(program)s -V''' % {'program': msgfmtCmd})
	except:
		print ('Please, install %(program)s for checking your translation'
					% {'program': msgfmtCmd})

	try:
		print ("\n===='msgattrib'==(list groups of messages)=============\n")
		os.system('''%(program)s -V''' % {'program': msgattribCmd})
	except:
		print ('Please, install %(program)s for listing groups of messages'
					% {'program': msgattribCmd})


	try:
		print("\n===='xgettext' =(generate a new template)==============\n")
		os.system('''%(program)s -V''' % {'program': xgettextCmd})
	except:
		print ('Please, install %(program)s for generating a new template'
					% {'program': xgettextCmd})

	try:
		print("\n=================='python'=============================\n")
		os.system('''%(program)s -V''' % {'program': pythonCmd})
	except:
		print ('Please, install python')



def main():
	"""
	The utility for handling translation stuff.
	What is need by Gramps, nothing more.
	"""

	parser = ArgumentParser(
						 description='This program generates a new template and '
									  'also provides some common features.',
						 )
	parser.add_argument("-t", "--test",
			action="store_true", dest="test",  default=True,
			help="test if 'python' and 'gettext' are properly installed")
	parser.add_argument("-g", "--glade",
			action="store_true", dest="glade",  default=False,
			help="extract messages from glade file format only")
	parser.add_argument("-c", "--clean",
			action="store_true", dest="clean",  default=False,
			help="remove created files")
	parser.add_argument("-p", "--pot",
			action="store_true", dest="catalog",  default=False,
			help="create a new catalog '%s.pot'" % POT_NAME)

	update = parser.add_argument_group('Update', 'Maintenance around translations')

	# need at least one argument (sv.po, de.po, etc ...)

	# lang.po files maintenance
	update.add_argument("-m", dest="merge",
			choices=LANG,
			help="merge lang.po files with last catalog")

	update.add_argument("-k", dest="check",
			choices=LANG,
			help="check lang.po files")

	 # testing stage
	trans = parser.add_argument_group('Translation', 'Display content of translations file')

	# need one argument (eg, de.po)

	trans.add_argument("-u", dest="untranslated",
			choices=[file for file in os.listdir('.') if file.endswith('.po')],
			help="list untranslated messages")
	trans.add_argument("-f", dest="fuzzy",
			choices=[file for file in os.listdir('.') if file.endswith('.po')],
			help="list fuzzy messages")


	args = parser.parse_args()
	namespace, extra = parser.parse_known_args()

	if args.test:
		tests()

	if args.glade:
		create_filesfile()
		extract_glade()
		if os.path.isfile('tmpfiles'):
			os.unlink('tmpfiles')

	if args.catalog:
		retrieve()

	if args.clean:
		clean()

	if args.merge:
		#retrieve() windows os?
		if sys.argv[2:] == ['all']:
			sys.argv[2:] = LANG
		merge(sys.argv[2:])

	if args.check:
		#retrieve() windows os?
		if sys.argv[2:] == ['all']:
			sys.argv[2:] = LANG
		check(sys.argv[2:])

	if args.untranslated:
		untranslated(sys.argv[2:])

	if args.fuzzy:
		fuzzy(sys.argv[2:])


def create_filesfile():
	"""
	Create a file with all files that we should translate.
	These are all python files not in POTFILES.skip added with those in
	POTFILES.in
	"""
	topdir = os.path.join(os.getcwd(), '..')

	f = open('POTFILES.in')
	infiles = [
		file.strip()
		for file in f
		if (file.strip() and not file[0]=='#')]
	f.close()

	f = open('tmpfiles', 'w')
	for file in sorted(infiles):
		f.write(os.path.join(topdir, file))
		f.write('\n')
	f.close()


def listing(name, extensionlist):
	"""
	List files according to extensions.
	Parsing from a textual file (gramps) is faster and easy for maintenance.
	Like POTFILES.in and POTFILES.skip
	"""

	f = open('tmpfiles')
	files = [file.strip() for file in f if file and not file[0]=='#']
	f.close()

	temp = open(name, 'w')

	for entry in files:
		for ext in extensionlist:
			if entry.endswith(ext):
				temp.write(entry)
				temp.write('\n')
				break

	temp.close()


def create_template():
	"""
	Create a new file for template, if it does not exist.
	"""
	template = open('%s.pot' % POT_NAME, 'w')
	template.close()


def extract_glade():
	"""
	Extract messages from a temp file with all .glade
	"""
	if not os.path.isfile('%s.pot' % POT_NAME):
		create_template()

	listing('glade.txt', ['.glade'])
	os.system('''%(xgettext)s -F --add-comments -j -L Glade '''
			  '''--from-code=UTF-8 -o %(potname)s.pot --files-from=glade.txt '''
			  '''--exclude-file=%(potgramps)s'''
			 % {'xgettext': xgettextCmd, 'potname': POT_NAME, "potgramps": GRAMPS_POT_FILE}
			 )


def retrieve():
	"""
	Extract messages from all files used by Gramps (python, glade, xml)
	"""
	create_template()

	create_filesfile()
	listing('python.txt', ['.py', '.py.in'])

	# additional keywords must always be kept in sync with those in genpot.sh
	os.system('''%(xgettext)s -F -c -j --directory=./ -d %(potname)s '''
			  '''-L Python -o %(potname)s.pot --files-from=python.txt '''
			  '''--keyword=_ --keyword=ngettext '''
			  '''--keyword=_T_ --keyword=trans_text '''
			  '''--keyword=sgettext --from-code=UTF-8 '''
			  '''--exclude-file=%(potgramps)s'''
			  % {'xgettext': xgettextCmd, 'potname': POT_NAME, "potgramps": GRAMPS_POT_FILE}
			 )

	extract_glade()

	clean()


def clean():
	"""
	Remove created files (C format headers, temp listings)
	"""
	if os.path.isfile('python.txt'):
		os.unlink('python.txt')
		print ("Remove 'python.txt'")

	if os.path.isfile('glade.txt'):
		os.unlink('glade.txt')
		print ("Remove 'glade.txt'")

	if os.path.isfile('tmpfiles'):
		os.unlink('tmpfiles')
		print ("Remove 'tmpfiles'")


def merge(args):
	"""
	Merge messages with catalog '*.pot'
	"""

	for arg in args:
		if arg == 'all':
			continue
		print ('Merge %(lang)s with current template' % {'lang': arg})
		os.system('''%(msgmerge)s --no-wrap %(lang)s %(potname)s.pot -o updated_%(lang)s''' \
					% {'msgmerge': msgmergeCmd, 'lang': arg, 'potname': POT_NAME})
		print ("Updated file: 'updated_%(lang)s'." % {'lang': arg})

def check(args):
	"""
	Check the translation file
	"""

	for arg in args:
		if arg == 'all':
			continue
		print ("Checked file: '%(lang.po)s'. See '%(txt)s.txt'." \
					% {'lang.po': arg, 'txt': arg[:-3]})
		os.system('''%(python)s ./check_po -s %(lang.po)s > %(lang)s.txt''' \
					% {'python': pythonCmd, 'lang.po': arg, 'lang': arg[:-3]})
		os.system('''%(msgfmt)s -c -v %(lang.po)s'''
					% {'msgfmt': msgfmtCmd, 'lang.po': arg})

def untranslated(arg):
	"""
	List untranslated messages
	"""

	os.system('''%(msgattrib)s --untranslated %(lang.po)s''' % {'msgattrib': msgattribCmd, 'lang.po': arg[0]})

def fuzzy(arg):
	"""
	List fuzzy messages
	"""

	os.system('''%(msgattrib)s --only-fuzzy --no-obsolete %(lang.po)s''' % {'msgattrib': msgattribCmd, 'lang.po': arg[0]})

if __name__ == "__main__":
	main()
