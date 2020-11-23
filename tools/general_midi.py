from enum import Enum, IntEnum

from collections import namedtuple, OrderedDict

class PercussionNote(IntEnum):
	BassDrum2 = 35
	BassDrum1 = 36
	SideStick = 37
	SnareDrum1 = 38
	HandClap = 39
	SnareDrum2 = 40
	LowTom2 = 41
	ClosedHiHat = 42
	LowTom1 = 43
	PedalHiHat = 44
	MidTom2 = 45
	OpenHiHat = 46
	MidTom1 = 47
	HighTom2 = 48
	CrashCymbal1 = 49
	HighTom1 = 50
	RideCymbal1 = 51
	ChineseCymbal = 52
	RideBell = 53
	Tambourine = 54
	SplashCymbal = 55
	Cowbell = 56
	CrashCymbal2 = 57
	VibraSlap = 58
	RideCymbal2 = 59
	HighBongo = 60
	LowBongo = 61
	MuteHighConga = 62
	OpenHighConga = 63
	LowConga = 64
	HighTimbale = 65
	LowTimbale = 66
	HighAgogo = 67
	LowAgogo = 68
	Cabasa = 69
	Maracas = 70
	ShortWhistle = 71
	LongWhistle = 72
	ShortGuiro = 73
	LongGuiro = 74
	Claves = 75
	HighWoodBlock = 76
	LowWoodBlock = 77
	MuteCuica = 78
	OpenCuica = 79
	MuteTriangle = 80
	OpenTriangle = 81

StandardInstrument = namedtuple('StandardInstrument', ('name', 'category', 'program', 'bank'))

class Instrument(Enum):
	# Piano:
	AcousticGrandPiano = StandardInstrument("Acoustic Grand Piano", "Piano", 0, 0)
	WideAcousticGrand = StandardInstrument("Wide Acoustic Grand", "Piano", 0, 1)
	DarkAcousticGrand = StandardInstrument("Dark Acoustic Grand", "Piano", 0, 2)
	BrightAcousticPiano = StandardInstrument("Bright Acoustic Piano", "Piano", 1, 0)
	WideBrightAcoustic = StandardInstrument("Wide Bright Acoustic", "Piano", 1, 1)
	ElectricGrandPiano = StandardInstrument("Electric Grand Piano", "Piano", 2, 0)
	WideElectricGrand = StandardInstrument("Wide Electric Grand", "Piano", 2, 1)
	HonkytonkPiano = StandardInstrument("Honky-tonk Piano", "Piano", 3, 0)
	WideHonkytonk = StandardInstrument("Wide Honky-tonk", "Piano", 3, 1)
	RhodesPiano = StandardInstrument("Rhodes Piano", "Piano", 4, 0)
	DetunedElectricPiano1 = StandardInstrument("Detuned Electric Piano 1", "Piano", 4, 1)
	ElectricPiano1Variation = StandardInstrument("Electric Piano 1 Variation", "Piano", 4, 2)
	SixtiesElectricPiano = StandardInstrument("60's Electric Piano", "Piano", 4, 3)
	ChorusedElectricPiano = StandardInstrument("Chorused Electric Piano", "Piano", 5, 0)
	DetunedElectricPiano2 = StandardInstrument("Detuned Electric Piano 2", "Piano", 5, 1)
	ElectricPiano2Variation = StandardInstrument("Electric Piano 2 Variation", "Piano", 5, 2)
	ElectricPianoLegend = StandardInstrument("Electric Piano Legend", "Piano", 5, 3)
	ElectricPianoPhase = StandardInstrument("Electric Piano Phase", "Piano", 5, 4)
	Harpsichord = StandardInstrument("Harpsichord", "Piano", 6, 0)
	CoupledHarpsichord = StandardInstrument("Coupled Harpsichord", "Piano", 6, 1)
	WideHarpsichord = StandardInstrument("Wide Harpsichord", "Piano", 6, 2)
	OpenHarpsichord = StandardInstrument("Open Harpsichord", "Piano", 6, 3)
	Clavinet = StandardInstrument("Clavinet", "Piano", 7, 0)
	PulseClavinet = StandardInstrument("Pulse Clavinet", "Piano", 7, 1)

	# Chromatic Percussion
	Celesta = StandardInstrument("Celesta", "Chromatic Percussion", 8, 0)
	Glockenspiel = StandardInstrument("Glockenspiel", "Chromatic Percussion", 9, 0)
	MusicBox = StandardInstrument("Music Box", "Chromatic Percussion", 10, 0)
	Vibraphone = StandardInstrument("Vibraphone", "Chromatic Percussion", 11, 0)
	WetVibraphone = StandardInstrument("Wet Vibraphone", "Chromatic Percussion", 11, 1)
	Marimba = StandardInstrument("Marimba", "Chromatic Percussion", 12, 0)
	WideMarimba = StandardInstrument("Wide Marimba", "Chromatic Percussion", 12, 1)
	Xylophone = StandardInstrument("Xylophone", "Chromatic Percussion", 13, 0)
	TubularBells = StandardInstrument("Tubular Bells", "Chromatic Percussion", 14, 0)
	ChurchBells = StandardInstrument("Church Bells", "Chromatic Percussion", 14, 1)
	Carillon = StandardInstrument("Carillon", "Chromatic Percussion", 14, 2)
	Dulcimer_Santur = StandardInstrument("Dulcimer/Santur", "Chromatic Percussion", 15, 0)

	# Organ
	HammondOrgan = StandardInstrument("Hammond Organ", "Organ", 16, 0)
	DetunedOrgan1 = StandardInstrument("Detuned Organ 1", "Organ", 16, 1)
	SixtiesOrgan1 = StandardInstrument("60's Organ 1", "Organ", 16, 2)
	Organ4 = StandardInstrument("Organ 4", "Organ", 16, 3)
	PercussiveOrgan = StandardInstrument("Percussive Organ", "Organ", 17, 0)
	DetunedOrgan2 = StandardInstrument("Detuned Organ 2", "Organ", 17, 1)
	Organ5 = StandardInstrument("Organ 5", "Organ", 17, 2)
	RockOrgan = StandardInstrument("Rock Organ", "Organ", 18, 0)
	ChurchOrgan1 = StandardInstrument("Church Organ 1", "Organ", 19, 0)
	ChurchOrgan2 = StandardInstrument("Church Organ 2", "Organ", 19, 1)
	ChurchOrgan3 = StandardInstrument("Church Organ 3", "Organ", 19, 2)
	ReedOrgan = StandardInstrument("Reed Organ", "Organ", 20, 0)
	PuffOrgan = StandardInstrument("Puff Organ", "Organ", 20, 1)
	FrenchAccordion = StandardInstrument("French Accordion", "Organ", 21, 0)
	ItalianAccordion = StandardInstrument("Italian Accordion", "Organ", 21, 1)
	Harmonica = StandardInstrument("Harmonica", "Organ", 22, 0)
	Bandoneon = StandardInstrument("Bandoneon", "Organ", 23, 0)

	# Guitar
	NylonStringGuitar = StandardInstrument("Nylon-String Guitar", "Guitar", 24, 0)
	Ukelele = StandardInstrument("Ukelele", "Guitar", 24, 1)
	OpenNylonGuitar = StandardInstrument("Open Nylon Guitar", "Guitar", 24, 2)
	NylonGuitar2 = StandardInstrument("Nylon Guitar 2", "Guitar", 24, 3)
	SteelStringGuitar = StandardInstrument("Steel-String Guitar", "Guitar", 25, 0)
	TwelveStringGuitar = StandardInstrument("12-String Guitar", "Guitar", 25, 1)
	Mandolin = StandardInstrument("Mandolin", "Guitar", 25, 2)
	SteelBody = StandardInstrument("Steel + Body", "Guitar", 25, 3)
	JazzGuitar = StandardInstrument("Jazz Guitar", "Guitar", 26, 0)
	HawaiianGuitar = StandardInstrument("Hawaiian Guitar", "Guitar", 26, 1)
	CleanElectricGuitar = StandardInstrument("Clean Electric Guitar", "Guitar", 27, 0)
	ChorusGuitar = StandardInstrument("Chorus Guitar", "Guitar", 27, 1)
	MidToneGuitar = StandardInstrument("Mid Tone Guitar", "Guitar", 27, 2)
	MutedElectricGuitar = StandardInstrument("Muted Electric Guitar", "Guitar", 28, 0)
	FunkGuitar = StandardInstrument("Funk Guitar", "Guitar", 28, 1)
	FunkGuitar2 = StandardInstrument("Funk Guitar 2", "Guitar", 28, 2)
	JazzMan = StandardInstrument("Jazz Man", "Guitar", 28, 3)
	OverdrivenGuitar = StandardInstrument("Overdriven Guitar", "Guitar", 29, 0)
	GuitarPinch = StandardInstrument("Guitar Pinch", "Guitar", 29, 1)
	DistortionGuitar = StandardInstrument("Distortion Guitar", "Guitar", 30, 0)
	FeedbackGuitar = StandardInstrument("Feedback Guitar", "Guitar", 30, 1)
	DistortionRtmGuitar = StandardInstrument("Distortion Rtm Guitar", "Guitar", 30, 2)
	GuitarHarmonics = StandardInstrument("Guitar Harmonics", "Guitar", 31, 0)
	GuitarFeedback = StandardInstrument("Guitar Feedback", "Guitar", 31, 1)

	# Brass
	AcousticBass = StandardInstrument("Acoustic Bass", "Bass", 32, 0)
	FingeredBass = StandardInstrument("Fingered Bass", "Bass", 33, 0)
	FingerSlap = StandardInstrument("Finger Slap", "Bass", 33, 1)
	PickedBass = StandardInstrument("Picked Bass", "Bass", 34, 0)
	FretlessBass = StandardInstrument("Fretless Bass", "Bass", 35, 0)
	SlapBass1 = StandardInstrument("Slap Bass 1", "Bass", 36, 0)
	SlapBass2 = StandardInstrument("Slap Bass 2", "Bass", 37, 0)
	SynthBass1 = StandardInstrument("Synth Bass 1", "Bass", 38, 0)
	SynthBass101 = StandardInstrument("Synth Bass 101", "Bass", 38, 1)
	SynthBass3 = StandardInstrument("Synth Bass 3", "Bass", 38, 2)
	ClaviBass = StandardInstrument("Clavi Bass", "Bass", 38, 3)
	Hammer = StandardInstrument("Hammer", "Bass", 38, 4)
	SynthBass2 = StandardInstrument("Synth Bass 2", "Bass", 39, 0)
	SynthBass4 = StandardInstrument("Synth Bass 4", "Bass", 39, 1)
	RubberBass = StandardInstrument("Rubber Bass", "Bass", 39, 2)
	AttackPulse = StandardInstrument("Attack Pulse", "Bass", 39, 3)

	# Strings
	Violin = StandardInstrument("Violin", "Strings", 40, 0)
	SlowViolin = StandardInstrument("Slow Violin", "Strings", 40, 1)
	Viola = StandardInstrument("Viola", "Strings", 41, 0)
	Cello = StandardInstrument("Cello", "Strings", 42, 0)
	Contrabass = StandardInstrument("Contrabass", "Strings", 43, 0)
	TremoloStrings = StandardInstrument("Tremolo Strings", "Strings", 44, 0)
	PizzicatoStrings = StandardInstrument("Pizzicato Strings", "Strings", 45, 0)
	Harp = StandardInstrument("Harp", "Strings", 46, 0)
	YangQin = StandardInstrument("Yang Qin", "Strings", 46, 1)
	Timpani = StandardInstrument("Timpani", "Strings", 47, 0)

	# Ensemble
	StringEnsemble = StandardInstrument("String Ensemble", "Ensemble", 48, 0)
	OrchestraStrings = StandardInstrument("Orchestra Strings", "Ensemble", 48, 1)
	SixtiesStrings = StandardInstrument("60's Strings", "Ensemble", 48, 2)
	SlowStringEnsemble = StandardInstrument("Slow String Ensemble", "Ensemble", 49, 0)
	SynthStrings1 = StandardInstrument("Synth Strings 1", "Ensemble", 50, 0)
	SynthStrings3 = StandardInstrument("Synth Strings 3", "Ensemble", 50, 1)
	SynthStrings2 = StandardInstrument("Synth Strings 2", "Ensemble", 51, 0)
	ChoirAahs = StandardInstrument("Choir Aahs", "Ensemble", 52, 0)
	ChoirAahs2 = StandardInstrument("Choir Aahs 2", "Ensemble", 52, 1)
	VoiceOohs = StandardInstrument("Voice Oohs", "Ensemble", 53, 0)
	Humming = StandardInstrument("Humming", "Ensemble", 53, 1)
	SynthVoice = StandardInstrument("Synth Voice", "Ensemble", 54, 0)
	AnalogVoice = StandardInstrument("Analog Voice", "Ensemble", 54, 1)
	OrchestraHit = StandardInstrument("Orchestra Hit", "Ensemble", 55, 0)
	BassHit = StandardInstrument("Bass Hit", "Ensemble", 55, 1)
	SixthHit = StandardInstrument("6th Hit", "Ensemble", 55, 2)
	EuroHit = StandardInstrument("Euro Hit", "Ensemble", 55, 3)

	# Brass
	Trumpet = StandardInstrument("Trumpet", "Brass", 56, 0)
	DarkTrumpet = StandardInstrument("Dark Trumpet", "Brass", 56, 1)
	Trombone = StandardInstrument("Trombone", "Brass", 57, 0)
	Trombone2 = StandardInstrument("Trombone 2", "Brass", 57, 1)
	BrightTrombone = StandardInstrument("Bright Trombone", "Brass", 57, 2)
	Tuba = StandardInstrument("Tuba", "Brass", 58, 0)
	MutedTrumpet = StandardInstrument("Muted Trumpet", "Brass", 59, 0)
	MutedTrumpet2 = StandardInstrument("Muted Trumpet 2", "Brass", 59, 1)
	FrenchHorn = StandardInstrument("French Horn", "Brass", 60, 0)
	FrenchHorn2 = StandardInstrument("French Horn 2", "Brass", 60, 1)
	BrassSection = StandardInstrument("Brass Section", "Brass", 61, 0)
	BrassSection2 = StandardInstrument("Brass Section 2", "Brass", 61, 1)
	SynthBrass1 = StandardInstrument("Synth Brass 1", "Brass", 62, 0)
	SynthBrass3 = StandardInstrument("Synth Brass 3", "Brass", 62, 1)
	AnalogBrass1 = StandardInstrument("Analog Brass 1", "Brass", 62, 2)
	JumpBrass = StandardInstrument("Jump Brass", "Brass", 62, 3)
	SynthBrass2 = StandardInstrument("Synth Brass 2", "Brass", 63, 0)
	SynthBrass4 = StandardInstrument("Synth Brass 4", "Brass", 63, 1)
	AnalogBrass2 = StandardInstrument("Analog Brass 2", "Brass", 63, 2)

	# Reed
	SopranoSax = StandardInstrument("Soprano Sax", "Reed", 64, 0)
	AltoSax = StandardInstrument("Alto Sax", "Reed", 65, 0)
	TenorSax = StandardInstrument("Tenor Sax", "Reed", 66, 0)
	BaritoneSax = StandardInstrument("Baritone Sax", "Reed", 67, 0)
	Oboe = StandardInstrument("Oboe", "Reed", 68, 0)
	EnglishHorn = StandardInstrument("English Horn", "Reed", 69, 0)
	Bassoon = StandardInstrument("Bassoon", "Reed", 70, 0)
	Clarinet = StandardInstrument("Clarinet", "Reed", 71, 0)

	# Wind
	Piccolo = StandardInstrument("Piccolo", "Wind", 72, 0)
	Flute = StandardInstrument("Flute", "Wind", 73, 0)
	Recorder = StandardInstrument("Recorder", "Wind", 74, 0)
	PanFlute = StandardInstrument("Pan Flute", "Wind", 75, 0)
	BlownBottle = StandardInstrument("Blown Bottle", "Wind", 76, 0)
	Shakuhachi = StandardInstrument("Shakuhachi", "Wind", 77, 0)
	Whistle = StandardInstrument("Whistle", "Wind", 78, 0)
	Ocarina = StandardInstrument("Ocarina", "Wind", 79, 0)

	# Synth Lead
	SquareLead = StandardInstrument("Square Lead", "Synth Lead", 80, 0)
	SquareWave = StandardInstrument("Square Wave", "Synth Lead", 80, 1)
	SineWave = StandardInstrument("Sine Wave", "Synth Lead", 80, 2)
	SawLead = StandardInstrument("Saw Lead", "Synth Lead", 81, 0)
	SawWave = StandardInstrument("Saw Wave", "Synth Lead", 81, 1)
	DoctorSolo = StandardInstrument("Doctor Solo", "Synth Lead", 81, 2)
	NaturalLead = StandardInstrument("Natural Lead", "Synth Lead", 81, 3)
	SequencedSaw = StandardInstrument("Sequenced Saw", "Synth Lead", 81, 4)
	SynthCalliope = StandardInstrument("Synth Calliope", "Synth Lead", 82, 0)
	ChifferLead = StandardInstrument("Chiffer Lead", "Synth Lead", 83, 0)
	Charang = StandardInstrument("Charang", "Synth Lead", 84, 0)
	WireLead = StandardInstrument("Wire Lead", "Synth Lead", 84, 1)
	SoloSynthVox = StandardInstrument("Solo Synth Vox", "Synth Lead", 85, 0)
	FifthSawWave = StandardInstrument("5th Saw Wave", "Synth Lead", 86, 0)
	BassLead = StandardInstrument("Bass & Lead", "Synth Lead", 87, 0)
	DelayedLead = StandardInstrument("Delayed Lead", "Synth Lead", 87, 1)

	# Synth Pad
	FantasiaPad = StandardInstrument("Fantasia Pad", "Synth Pad", 88, 0)
	WarmPad = StandardInstrument("Warm Pad", "Synth Pad", 89, 0)
	SinePad = StandardInstrument("Sine Pad", "Synth Pad", 89, 1)
	PolysynthPad = StandardInstrument("Polysynth Pad", "Synth Pad", 90, 0)
	SpaceVoicePad = StandardInstrument("Space Voice Pad", "Synth Pad", 91, 0)
	Itopia = StandardInstrument("Itopia", "Synth Pad", 91, 1)
	BowedGlassPad = StandardInstrument("Bowed Glass Pad", "Synth Pad", 92, 0)
	MetalPad = StandardInstrument("Metal Pad", "Synth Pad", 93, 0)
	HaloPad = StandardInstrument("Halo Pad", "Synth Pad", 94, 0)
	SweepPad = StandardInstrument("Sweep Pad", "Synth Pad", 95, 0)

	# Synth Effects
	IceRain = StandardInstrument("Ice Rain", "Synth Effects", 96, 0)
	Soundtrack = StandardInstrument("Soundtrack", "Synth Effects", 97, 0)
	Crystal = StandardInstrument("Crystal", "Synth Effects", 98, 0)
	SynthMallet = StandardInstrument("Synth Mallet", "Synth Effects", 98, 1)
	Atmosphere = StandardInstrument("Atmosphere", "Synth Effects", 99, 0)
	Brightness = StandardInstrument("Brightness", "Synth Effects", 100, 0)
	Goblin = StandardInstrument("Goblin", "Synth Effects", 101, 0)
	EchoDrops = StandardInstrument("Echo Drops", "Synth Effects", 102, 0)
	EchoBell = StandardInstrument("Echo Bell", "Synth Effects", 102, 1)
	EchoPan = StandardInstrument("Echo Pan", "Synth Effects", 102, 2)
	StarTheme = StandardInstrument("Star Theme", "Synth Effects", 103, 0)

	# Ethnic
	Sitar = StandardInstrument("Sitar", "Ethnic", 104, 0)
	Sitar2 = StandardInstrument("Sitar 2", "Ethnic", 104, 1)
	Banjo = StandardInstrument("Banjo", "Ethnic", 105, 0)
	Shamisen = StandardInstrument("Shamisen", "Ethnic", 106, 0)
	Koto = StandardInstrument("Koto", "Ethnic", 107, 0)
	TaishoKoto = StandardInstrument("Taisho Koto", "Ethnic", 107, 1)
	Kalimba = StandardInstrument("Kalimba", "Ethnic", 108, 0)
	Bagpipe = StandardInstrument("Bagpipe", "Ethnic", 109, 0)
	Fiddle = StandardInstrument("Fiddle", "Ethnic", 110, 0)
	Shanai = StandardInstrument("Shanai", "Ethnic", 111, 0)

	# Percussive
	TinkleBell = StandardInstrument("Tinkle Bell", "Percussive", 112, 0)
	Agogo = StandardInstrument("Agogo", "Percussive", 113, 0)
	SteelDrums = StandardInstrument("Steel Drums", "Percussive", 114, 0)
	Woodblock = StandardInstrument("Woodblock", "Percussive", 115, 0)
	Castanets = StandardInstrument("Castanets", "Percussive", 115, 1)
	TaikoDrum = StandardInstrument("Taiko Drum", "Percussive", 116, 0)
	ConcertBassDrum = StandardInstrument("Concert Bass Drum", "Percussive", 116, 1)
	MelodicTom1 = StandardInstrument("Melodic Tom 1", "Percussive", 117, 0)
	MelodicTom2 = StandardInstrument("Melodic Tom 2", "Percussive", 117, 1)
	SynthDrum = StandardInstrument("Synth Drum", "Percussive", 118, 0)
	EightOhEightTom = StandardInstrument("808 Tom", "Percussive", 118, 1)
	ElectricPercussion = StandardInstrument("Electric Percussion", "Percussive", 118, 2)
	ReverseCymbal = StandardInstrument("Reverse Cymbal", "Percussive", 119, 0)

	# Sound Effects
	GuitarFretNoise = StandardInstrument("Guitar Fret Noise", "Sound effects", 120, 0)
	GuitarCutNoise = StandardInstrument("Guitar Cut Noise", "Sound effects", 120, 1)
	StringSlap = StandardInstrument("String Slap", "Sound effects", 120, 2)
	BreathNoise = StandardInstrument("Breath Noise", "Sound effects", 121, 0)
	FluteKeyClick = StandardInstrument("Flute Key Click", "Sound effects", 121, 1)
	Seashore = StandardInstrument("Seashore", "Sound effects", 122, 0)
	Rain = StandardInstrument("Rain", "Sound effects", 122, 1)
	Thunder = StandardInstrument("Thunder", "Sound effects", 122, 2)
	Wind = StandardInstrument("Wind", "Sound effects", 122, 3)
	Stream = StandardInstrument("Stream", "Sound effects", 122, 4)
	Bubble = StandardInstrument("Bubble", "Sound effects", 122, 5)
	BirdTweet = StandardInstrument("Bird Tweet", "Sound effects", 123, 0)
	Dog = StandardInstrument("Dog", "Sound effects", 123, 1)
	HorseGallop = StandardInstrument("Horse Gallop", "Sound effects", 123, 2)
	Bird2 = StandardInstrument("Bird 2", "Sound effects", 123, 3)
	Telephone1 = StandardInstrument("Telephone 1", "Sound effects", 124, 0)
	Telephone2 = StandardInstrument("Telephone 2", "Sound effects", 124, 1)
	DoorCreaking = StandardInstrument("Door Creaking", "Sound effects", 124, 2)
	DoorClosing = StandardInstrument("Door Closing", "Sound effects", 124, 3)
	Scratch = StandardInstrument("Scratch", "Sound effects", 124, 4)
	WindChimes = StandardInstrument("Wind Chimes", "Sound effects", 124, 5)
	Helicopter = StandardInstrument("Helicopter", "Sound effects", 125, 0)
	CarEngine = StandardInstrument("Car Engine", "Sound effects", 125, 1)
	CarStop = StandardInstrument("Car Stop", "Sound effects", 125, 2)
	CarPass = StandardInstrument("Car Pass", "Sound effects", 125, 3)
	CarCrash = StandardInstrument("Car Crash", "Sound effects", 125, 4)
	Siren = StandardInstrument("Siren", "Sound effects", 125, 5)
	Train = StandardInstrument("Train", "Sound effects", 125, 6)
	Jetplane = StandardInstrument("Jetplane", "Sound effects", 125, 7)
	Starship = StandardInstrument("Starship", "Sound effects", 125, 8)
	BurstNoise = StandardInstrument("Burst Noise", "Sound effects", 125, 9)
	Applause = StandardInstrument("Applause", "Sound effects", 126, 0)
	Laughing = StandardInstrument("Laughing", "Sound effects", 126, 1)
	Screaming = StandardInstrument("Screaming", "Sound effects", 126, 2)
	Punch = StandardInstrument("Punch", "Sound effects", 126, 3)
	HeartBeat = StandardInstrument("Heart Beat", "Sound effects", 126, 4)
	Footsteps = StandardInstrument("Footsteps", "Sound effects", 126, 5)
	GunShot = StandardInstrument("Gun Shot", "Sound effects", 127, 0)
	MachineGun = StandardInstrument("Machine Gun", "Sound effects", 127, 1)
	Lasergun = StandardInstrument("Lasergun", "Sound effects", 127, 2)
	Explosion = StandardInstrument("Explosion", "Sound effects", 127, 3)

	# Drumkit
	Standard = StandardInstrument("Standard", "Drumkit", 00, 128)
	Standard1 = StandardInstrument("Standard 1", "Drumkit", 1, 128)
	Standard2 = StandardInstrument("Standard 2", "Drumkit", 2, 128)
	Standard3 = StandardInstrument("Standard 3", "Drumkit", 3, 128)
	Standard4 = StandardInstrument("Standard 4", "Drumkit", 4, 128)
	Standard5 = StandardInstrument("Standard 5", "Drumkit", 5, 128)
	Standard6 = StandardInstrument("Standard 6", "Drumkit", 6, 128)
	Standard7 = StandardInstrument("Standard 7", "Drumkit", 7, 128)
	Room = StandardInstrument("Room", "Drumkit", 8, 128)
	Room1 = StandardInstrument("Room 1", "Drumkit", 9, 128)
	Room2 = StandardInstrument("Room 2", "Drumkit", 10, 128)
	Room3 = StandardInstrument("Room 3", "Drumkit", 11, 128)
	Room4 = StandardInstrument("Room 4", "Drumkit", 12, 128)
	Room5 = StandardInstrument("Room 5", "Drumkit", 13, 128)
	Room6 = StandardInstrument("Room 6", "Drumkit", 14, 128)
	Room7 = StandardInstrument("Room 7", "Drumkit", 15, 128)
	Power = StandardInstrument("Power", "Drumkit", 16, 128)
	Power1 = StandardInstrument("Power 1", "Drumkit", 17, 128)
	Power2 = StandardInstrument("Power 2", "Drumkit", 18, 128)
	Power3 = StandardInstrument("Power 3", "Drumkit", 19, 128)
	Electronic = StandardInstrument("Electronic", "Drumkit", 24, 128)
	TrEightOhEight = StandardInstrument("TR-808", "Drumkit", 25, 128)
	Jazz = StandardInstrument("Jazz", "Drumkit", 32, 128)
	Jazz1 = StandardInstrument("Jazz 1", "Drumkit", 33, 128)
	Jazz2 = StandardInstrument("Jazz 2", "Drumkit", 34, 128)
	Jazz3 = StandardInstrument("Jazz 3", "Drumkit", 35, 128)
	Jazz4 = StandardInstrument("Jazz 4", "Drumkit", 36, 128)
	Brush = StandardInstrument("Brush", "Drumkit", 40, 128)
	Brush1 = StandardInstrument("Brush 1", "Drumkit", 41, 128)
	Brush2 = StandardInstrument("Brush 2", "Drumkit", 42, 128)
	OrchestraKit = StandardInstrument("Orchestra Kit", "Drumkit", 48, 128)


INSTRUMENTS_BY_PATCH = {(x.value.program, x.value.bank): x.value for x in Instrument}

CATEGORIES = tuple(OrderedDict.fromkeys(x.value.category for x in Instrument))

def sort_categories(categories):
	def sort_key(c):
		i = CATEGORIES.index(c) if c in CATEGORIES else len(CATEGORIES)
		return (i, c)
	return sorted(categories, key=sort_key)
