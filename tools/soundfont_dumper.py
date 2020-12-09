import logging
import collections
import subprocess
import mido
import tempfile
import io
import soundfile
import os
import multiprocessing

from pathlib import Path
from enum import IntEnum

from note import *

from tqdm import tqdm

LOG = logging.getLogger(__name__)

Instrument = collections.namedtuple('Instrument', ['bank', 'program', 'name'])

def get_inst_list(soundfont):
	cmd_file = tempfile.mktemp()
	Path(cmd_file).write_text(
'''inst 1
quit
'''
	)

	output = subprocess.check_output(['fluidsynth', '-qnif', cmd_file, soundfont], stderr=subprocess.DEVNULL)

	for line in output.decode('utf-8').splitlines():
		line = line.strip()
		if not line:
			continue
		if line == 'cheers!':
			return
		LOG.debug("Found instrument %s", line)
		selector, name = line.split(maxsplit=1)
		bank, program = (int(x) for x in selector.split('-'))

		if bank > 128 or program > 127: # can't handle anything above these two
			LOG.warn("Skipping %s in bank %s, out of range", name, bank)
			continue

		yield Instrument(bank, program, name)

def dump_inst(instrument: Instrument, soundfont, outdir: Path, sample_len, notes, velocity):
	with tqdm(total=len(notes), desc=instrument.name, leave=False, unit='note') as progress:
		results = []
		for note in notes:
			local_note = note
			note_result = dump_pool.apply_async(
				dump_note,
				[instrument, soundfont, outdir, sample_len, local_note, velocity],
				callback=lambda x: progress.update(1)
			)
			results.append((note, note_result))

		LOG.debug("All tasks submitted to pool")

		files = {}
		for note, result in results:
			files[note] = result.get()
	return files

def dump_note(instrument: Instrument, soundfont, outdir: Path, sample_len, note: Note, velocity):
		midi = write_midi(instrument, note, sample_len, velocity)
		flac_file = tempfile.mktemp()
		LOG.debug("Writing flac file to %s", flac_file)
		subprocess.check_output(['fluidsynth', '-qni', '-C', 'no', '-R', 'no', '-a', 'alsa', '-g', '5', '-T', 'flac', '-F', flac_file, soundfont, midi])

		if not os.path.exists(flac_file):
			raise Exception('FLAC file was never written!')

		

		ogg = outdir.joinpath(f'{note.pitch.name.lower().replace("_", "-")}-{note.octave}.ogg')

		if ogg.exists(): ogg.unlink()

		soundfile.write(str(ogg), *soundfile.read(flac_file))
		LOG.debug("Wrote %s", ogg)
		os.unlink(flac_file)
		os.unlink(midi)

		return ogg
	

def write_midi(instrument: Instrument, note: Note, sample_len, velocity):
	LOG.debug("Writing midi for %s, note %s", instrument, note)
	midi = mido.MidiFile()
	track = midi.add_track()
	control_msb = (instrument.bank >> 7) & 0x7F
	control_lsb = instrument.bank & 0x7F


	if instrument.bank != 128:
		channel = 0
		track.extend([
			mido.Message('control_change', control=0x0, value=control_msb),
			mido.Message('control_change', control=0x20, value=control_lsb),
		])
	else:
		channel = 9

	track.extend([
		mido.Message('program_change', channel=channel, program=instrument.program),
		mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(120)),
		mido.Message('note_on', channel=channel, note=note.to_midi(), velocity=velocity),
		mido.Message('note_off', channel=channel, note=note.to_midi(), time=int(mido.second2tick(sample_len, midi.ticks_per_beat, mido.bpm2tempo(120))))
	])
	midi_file = tempfile.mktemp()
	midi.save(midi_file)
	LOG.debug("MIDI written to %s", midi_file)
	return midi_file

dump_pool = multiprocessing.Pool(multiprocessing.cpu_count() - 1)
