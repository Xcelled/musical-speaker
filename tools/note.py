from enum import IntEnum

class Pitch(IntEnum):
	C = 0
	C_SHARP = 1
	D = 2
	D_SHARP = 3
	E = 4
	F = 5
	F_SHARP = 6
	G = 7
	G_SHARP = 8
	A = 9
	A_SHARP = 10
	B = 11

class Note:
	def __init__(self, pitch: Pitch, octave: int):
		self.pitch = pitch
		self.octave = octave
	
	def to_midi(self):
		return (self.octave + 1) * 12 + self.pitch.value

	def __str__(self):
		return self.pitch.name.replace('_SHARP', '#') + str(self.octave)

	def __repr__(self):
		return str(self)

	@staticmethod
	def from_midi(midi_code):
		return Note(Pitch(midi_code % 12), (midi_code // 12) - 1)
