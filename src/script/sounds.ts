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

export default require('./sound-data') as CategorySpec[]
