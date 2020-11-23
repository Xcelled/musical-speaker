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

local musical_speaker = table.deepcopy(data.raw['programmable-speaker']['programmable-speaker'])

musical_speaker.name = 'musical-speaker'
musical_speaker.minable.result = 'musical-speaker'
musical_speaker.maximum_polyphony = 124 --maximum number of samples that can play at the same time

musical_speaker.instruments = {
	% for category, inst_dumps in sortDumps(dumps).items():
	-- Start of category ${category}
	{
		name = "category-${category.lower().replace(' ', '-')}",
		notes = {
			{ name="category-placeholder", sound = { filename = "__base__/sound/silence-1sec.ogg", preload=false }}
		}
	},
	% for inst_dump in inst_dumps:
	{
		name = "${inst_dump.inst_code}",
		notes = {
			% for note, note_name, path in inst_dump.notes:
			{ name="${note_name}", sound = { filename = "${ relativize(path, output_dir) }", preload = false }},
			% endfor
		}
	},

	% endfor
	% endfor
}

data:extend({
	musical_speaker
})
