# GRAMPS Dynamic Web Report

## Description
This add-on for GRAMPS is an alternative to the Narrative Web Report.
It exports the database as web pages

## Features
Compared to the Narrative Web Report, the Dynamic Web Report has the following differences:
- The web pages could include a **browsable** family tree.
  This graphical family tree is printed using the SVG format.
- The web pages include a **search form**, in order to search for an individual.
- The web pages include index pages that could be sorted by any column.
- The web pages generated are based on **client-side Javascript**
  Hence, the generated site is smaller, and contains much less files.
  The web pages could be browsed in a regular web site or on the local machine.

## Demos
[Example using the default style](test_000/indi.html?FsearchTxt=Garner%20von%20Zieli%u0144ski%2C%20Lewis%20Anderson%20Sr)
[Example of graphical family tree](test_000/tree_svg.html?FsearchTxt=Garner%20von%20Zieli%u0144ski%2C%20Lewis%20Anderson%20Sr)
[Example using another style ('Mayence' style of the narrative web report)](test_001/indi.html?FsearchTxt=Garner%20von%20Zieli%u0144ski%2C%20Lewis%20Anderson%20Sr)
[Example with minimal features (without private data, notes, sources, addresses, gallery, places, families, events)](test_004/indi.html?FsearchTxt=Garner%20von%20Zieli%u0144ski%2C%20Lewis%20Anderson%20Sr)

## Development status
This report is only a **prototype** for evalutation.
The to do list first item is: *Build a to do list*.
The *dynamic path* (javascript) could be cool for implementing nice features.
The code is not ready for coming out (not commented, poorly architectured, etc.)