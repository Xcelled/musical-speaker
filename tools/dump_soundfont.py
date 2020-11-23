import logging
logging.basicConfig(level=logging.INFO)

import collections
import subprocess
import tempfile
import io
import soundfile
import os
import multiprocessing

from pathlib import Path
from enum import IntEnum
from collections import namedtuple
from collections import defaultdict

from tqdm import tqdm
from mako.template import Template

from soundfont_dumper import *
from note import *
import general_midi

LOG = logging.getLogger(__name__)

default_soundfont = '/usr/share/sounds/sf2/FluidR3_GM.sf2'

instruments = list(get_inst_list(default_soundfont))

LOG.info("Found %s instruments", len(instruments))

notes = [Note.from_midi(x) for x in range(21, 109)]
percussion_notes = [Note.from_midi(x.value) for x in general_midi.PercussionNote]

out_dir = Path('../src').absolute()

sound_dir = out_dir.joinpath('sound')

Dump = namedtuple('Dump', ('inst_code', 'inst_name', 'inst_category', 'inst', 'notes'))

dumps_by_category = defaultdict(list)

for inst in tqdm(instruments, desc='Dumping instruments', unit='instrument'):
	is_percussion = inst.bank == 128

	inst_code = inst.name.lower().replace(" ", '-')

	inst_dir = sound_dir.joinpath(inst_code)
	inst_dir.mkdir(parents=True, exist_ok=True)
	length = 0.45 if is_percussion else 0.45
	velocity = 127 if is_percussion else 64
	n = percussion_notes if is_percussion else notes
	note_dumps = dump_inst(inst, default_soundfont, inst_dir, length, n, velocity)

	namefunc = lambda n: general_midi.PercussionNote(n.to_midi()).name if is_percussion else str(n)
	notes_by_name = [(n, namefunc(n), f) for n, f in note_dumps.items()]
	notes_by_name.sort(key=lambda n: n[0].to_midi())

	std_inst = general_midi.INSTRUMENTS_BY_PATCH.get((inst.program, inst.bank), None)

	category_name = std_inst.category if std_inst else "Misc"
	category_code = category_name.lower().replace(" ", '-')

	d = Dump(
		inst_code,
		std_inst.name if std_inst else inst.name,
		category_name,
		inst,
		notes_by_name
	)

	dumps_by_category[category_name].append(d)

LOG.info("Writing musical_speaker.lua")
lua = Template(filename='musical_speaker.lua.mako').render(output_dir=out_dir, dumps=dumps_by_category)

entity_prototypes = out_dir.joinpath('prototypes/entity')
entity_prototypes.mkdir(exist_ok=True, parents=True)
entity_prototypes.joinpath('musical_speaker.lua').write_text(lua)
LOG.info("Written to %s", entity_prototypes.absolute())

LOG.info("Writing instruments.cfg")
cfg = Template(filename='instruments.cfg.mako').render(dumps=dumps_by_category)

locale = out_dir.joinpath('locale/en')
locale.mkdir(exist_ok=True, parents=True)
locale.joinpath('instruments.cfg').write_text(cfg)
LOG.info("Written to %s", locale.absolute())
