Building instructions

- In directory "po", update translations:
	python update_po.py -p
	For each translation "*-local.po":
	With poedit, update catalog from POT file "dynamicweb.pot"
	Update translations
	Copy results to local directory:
	copy /Y fr-local.mo ..\locale\fr\LC_MESSAGES\addon.mo
	
- In directory "test":
	Import example database:
	python dynamicweb_test.py -i
	Run tests:
	python dynamicweb_test.py 999
