// This file is generated

// 'R' is sorted by repository name
// 'R' gives for each repository:
//   - gid: Gramps ID
//   - name: The repository name
//   - type: The repository type
//   - addrs: A list of addresses, with for each address:
//       - date: The address date
//       - date_sdn: The address serial date number
//       - location: The address place in the form:
//           [street, locality, parish, city, state, county, zip, country]
//       - note: The address notes
//       - cita: A list of the address source citations index (in table 'C')
//   - note: The repository notes
//   - urls: The list of the repository URL in the form:
//       [type, url, description]
//   - bks: A list of the sources referencing this repository, in the form:
//       - s_idx: source index (in table 'S')
//       - media_type: media type
//       - call_number: call number
//       - note: notes of the repository reference
R = [
    {
        "addrs": [
            {
                "cita": [],
                "date": "",
                "date_sdn": 0,
                "location": [
                    "123 Main St",
                    "",
                    "",
                    "Someville",
                    "ST",
                    "",
                    "",
                    "USA",
                    ""
                ],
                "note": ""
            }
        ],
        "bks": [
            {
                "call_number": "nothing-0",
                "media_type": "Manuscrit",
                "note": "",
                "s_idx": 3
            }
        ],
        "gid": "R0003",
        "name": "Aunt Martha's Attic",
        "note": "<div>\n<i class=\"NoteType\">\nNote sur le d\u00e9p\u00f4t\n</i>\n<div class=\"grampsstylednote\">\n<p>\nSome note on the repo\n</p>\n</div>\n</div>",
        "type": "Collection",
        "urls": [
            {
                "descr": "",
                "type": "Site internet",
                "uri": "http://library.gramps-project.org"
            }
        ]
    },
    {
        "addrs": [
            {
                "cita": [
                    2852
                ],
                "date": "",
                "date_sdn": 0,
                "location": [
                    "5th Ave at 42 street",
                    "",
                    "",
                    "New York",
                    "New York",
                    "",
                    "11111",
                    "USA",
                    ""
                ],
                "note": ""
            }
        ],
        "bks": [
            {
                "call_number": "CA-123-LL-456_Num/ber",
                "media_type": "Film",
                "note": "",
                "s_idx": 2
            },
            {
                "call_number": "what-321-ever",
                "media_type": "Photo",
                "note": "",
                "s_idx": 3
            }
        ],
        "gid": "R0002",
        "name": "New York Public Library",
        "note": "",
        "type": "Biblioth\u00e8que",
        "urls": []
    },
    {
        "addrs": [
            {
                "cita": [],
                "date": "",
                "date_sdn": 0,
                "location": [
                    "Bookstore street 5",
                    "",
                    "",
                    "Great Falls",
                    "MT",
                    "",
                    "",
                    "USA",
                    ""
                ],
                "note": ""
            }
        ],
        "bks": [
            {
                "call_number": "32Z-345",
                "media_type": "Microfilm",
                "note": "",
                "s_idx": 1
            }
        ],
        "gid": "R0000",
        "name": "Public Library Great Falls",
        "note": "<div>\n<i class=\"NoteType\">\nNote sur le d\u00e9p\u00f4t\n</i>\n<div class=\"grampsstylednote\">\n<p>\nAsk librarian for key to the microfilm closet of <a href=\"place.html?pdx=451\">Great Falls</a> church, it is closed normally\n</p>\n</div>\n</div>",
        "type": "Biblioth\u00e8que",
        "urls": [
            {
                "descr": "",
                "type": "Site internet",
                "uri": "http://great-falls.org"
            }
        ]
    }
]