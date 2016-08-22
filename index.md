---
layout: index
---
# GRAMPS dynamic web report examples

## Description
This add-on for [Gramps](https://gramps-project.org/) is an alternative to the [Narrative Web Report](https://gramps-project.org/wiki/index.php?title=Gramps_4.0_Wiki_Manual_-_Reports_-_part_7).  
It exports the database as web pages.

## Features
- **Browsable** and zoomable bi-directional family tree view [[demo]](reports/report_000/tree_svg.html?igid=I0044).  
- **Search** by individual.  
- Clickable pictures [[demo]](reports/report_001/media.html?mgid=O0010)  
- Based on client-side **Javascript**.  

## Demos
- [Example using the default style](reports/report_000/person.html?igid=I0044)  
- [Example of graphical family tree](reports/report_000/tree_svg.html?igid=I0044) - 
[example bis](reports/report_000/tree_svg.html?igid=I0044&svgshape=4&svgbk=0) - 
[example ter](reports/report_000/tree_svg.html?igid=I0177&svgshape=0&svgbk=7)  
- [Example using another style ('Mainz' style of the narrative web report)](reports/report_001/person.html?igid=I0044)  
- [Example of clickable picture](reports/report_001/media.html?mgid=O0010)  
- [Example with minimal features (without private data, notes, sources, addresses, gallery, places, families, events)](reports/report_004/person.html?igid=I0044)

## Features details
- **browsable** family tree:
  This graphical family tree is printed using the SVG format.  
  It could be zoomed (like google map) in order to print 20 generations or more.  
  It show descendants or ancestry (or both), as a tree or as concentric circles.  
  Possibility to use the mouse or a context menu for navigation in the tree.  
- **Indexes** could be sorted by any column.  
- Clickable pictures:  
  The clickable regions correspond to the Gramps database media references regions  
- Client-side **Javascript**:  
  No impact on server resources  
  The generated site is smaller, and contains much less files.  
  The web pages could be browsed in a regular web site or on the local machine.  

## More...
See:
- [Gramps project](https://gramps-project.org/)  
- Source code in the [GRAMPS addon repository](https://github.com/gramps-project/addons-source)  
