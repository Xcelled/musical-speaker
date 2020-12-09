export interface NoteSpec {
	name: string,
	filename: string
}

export interface InstrumentSpec {
	name: string,
	notes: NoteSpec[]
}

export interface CategorySpec {
	name: string,
	instruments: InstrumentSpec[]
}

export interface ProgrammableSpeakerNote {
	name: string,
	sound: Sound
}

export interface ProgrammableSpeakerInstrument {
	name: string;
	notes: ProgrammableSpeakerNote[];
}

const categories = require('./sound-data') as CategorySpec[];

const mapping: Table<string, number> = new Table() as any;

const programmableSpeakerInstruments: ProgrammableSpeakerInstrument[] = [];

categories.forEach((category, categoryIndex) => {
	category.instruments.forEach((instrument, instrumentIndex) => {
		const programmableSpeakerIndex = programmableSpeakerInstruments.push({
			name: instrument.name,
			notes: instrument.notes.map(note => ({
				name: note.name,
				sound: { filename: note.filename, preload: false }
			}))
		});

		mapping.set(`${categoryIndex}-${instrumentIndex}`, programmableSpeakerIndex - 1);
	});
})

export function getProgrammableSpeakerInstrumentId(categoryId: number, instrumentId: number): number | undefined {
	return mapping.get(`${categoryId}-${instrumentId}`);
}

export {
	categories,
	programmableSpeakerInstruments
};
