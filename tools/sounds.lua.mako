<%!
import collections

from collections import OrderedDict
from pathlib import Path

import general_midi

def sortDumps(dumps):
	orderedDumps = collections.OrderedDict()
	for k in general_midi.sort_categories(dumps.keys()):
		orderedDumps[k] = sorted(dumps[k], key=lambda d: (d.inst.program, d.inst.bank, d.inst_name))
	return orderedDumps

def relativize(soundPath, output_dir):
	return Path('__musical-speaker__').joinpath(soundPath.relative_to(output_dir))
%>

return {
	% for category, inst_dumps in sortDumps(dumps).items():
	{
		name = "${category}",
		instruments = {
			% for inst_dump in inst_dumps:
			{
				name = "${inst_dump.inst_code}",
				notes = {
					% for note, note_name, path in inst_dump.notes:
					{ name="${note_name}", filename = "${ relativize(path, output_dir) }" },
					% endfor
				}
			},
			% endfor
		}
	},
	%endfor
}
