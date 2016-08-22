// This file is generated

// 'M' is sorted by media title
// 'M' gives for each media object:
//   - gid: Gramps ID
//   - title: The media title
//   - gramps_path: The media path in Gramps
//   - path: The media path were the media is really located
//   - mime: The media MIME type
//   - date: The media date
//   - date_sdn: The media serial date number
//   - note: The media notes
//   - cita: A list of the media source citations index (in table 'C')
//   - attr: The list of the media attributes in the form:
//       [attribute, value, note, list of citations]
//   - thumb: Media thumbnail path
//   - bki: A list of the person referencing this media (including the person events referencing this media), in the form:
//       - bk_idx: person index (in table 'I')
//       - thumb: media thumbnail path
//       - rect: [x1, y1, x2, y2] of the media reference
//       - note: notes of the media reference
//       - cita: list of the media reference source citations index (in table 'C')
//   - bkf: A list of the family referencing this media (including the family events referencing this media), in the form:
//       - bk_idx: family index (in table 'F')
//       - thumb: media thumbnail path
//       - rect: [x1, y1, x2, y2] of the media reference
//       - note: notes of the media reference
//       - cita: list of the media reference source citations index (in table 'C')
//   - bks: A list of the source referencing this media (including the source citations referencing this media), in the form:
//       - bk_idx: source index (in table 'S')
//       - thumb: media thumbnail path
//       - rect: [x1, y1, x2, y2] of the media reference
//       - note: notes of the media reference
//       - cita: list of the media reference source citations index (in table 'C')
//   - bkp: A list of the places referencing this media, in the form:
//       - bk_idx: place index (in table 'P')
//       - thumb: media thumbnail path
//       - rect: [x1, y1, x2, y2] of the media reference
//       - note: notes of the media reference
//       - cita: list of the media reference source citations index (in table 'C')
//   - change_time: last record modification date
M = []