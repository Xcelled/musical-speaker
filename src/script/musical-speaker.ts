import sounds from './sounds';

/**
 * 1 based cause these are fed directly to the lua API
 */
enum CombinatorSlots {
	VOLUME = 1,
	ENABLED_FIRST_SIGNAL = 2,
	//ENABLED_COMPARE = 3,
	//ENABLED_SECOND_SIGNAL = 4,
	//ENABLED_SECOND_CONSTANT = 5,
	CATEGORY_ID = 6,
	INSTRUMENT_ID = 7,
	NOTE_ID = 8
}

interface MusicalSpeakerSettings {
	volume: number,
	enabledCondition: CircuitCondition,
	categoryId: number,
	instrumentId: number,
	noteId: number
}


export default class MusicalSpeaker {
	private combinator: LuaEntity
	private notePlayers: LuaEntity[]

	constructor(combinator: LuaEntity) {
		this.combinator = combinator;
		this.notePlayers = [];
		this.initialize();
	}

	/**
	 * Reads the settings for this speaker from the backing combinator
	 */
	get settings(): Readonly<MusicalSpeakerSettings> {
		const m: Map<number, ConstantCombinatorParameters> = new Map();

		(this.combinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior).parameters?.forEach(p => m.set(p.index, p));

		const volume = m.get(CombinatorSlots.VOLUME)?.count || -1;

		return {
			volume,
			enabledCondition: {
				first_signal: m.get(CombinatorSlots.ENABLED_FIRST_SIGNAL)?.signal,
				comparator: '>',
				constant: 0
			},
			categoryId: m.get(CombinatorSlots.CATEGORY_ID)?.count || 0,
			instrumentId: m.get(CombinatorSlots.INSTRUMENT_ID)?.count || 0,
			noteId: m.get(CombinatorSlots.NOTE_ID)?.count || 0
		}
	}

	/**
	 * Applies new settings for this speaker and persists them to the backing combinator
	 */
	set settings(settings: Readonly<MusicalSpeakerSettings>) {
		const parameters: ConstantCombinatorParameters[] = [
			{ index: CombinatorSlots.VOLUME, signal: { type: "virtual", name: "signal-V" }, count: settings.volume },
			{ index: CombinatorSlots.ENABLED_FIRST_SIGNAL, signal: settings.enabledCondition.first_signal!, count: 0 },
			{ index: CombinatorSlots.CATEGORY_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.categoryId },
			{ index: CombinatorSlots.INSTRUMENT_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.instrumentId },
			{ index: CombinatorSlots.NOTE_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.noteId },
		];

		(this.combinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior).parameters = parameters;

		// TODO: Skip this if we can
		this.initialize();
	}

	private getSpeakerEntityName(settings: MusicalSpeakerSettings) {
		// TODO: How does this behave with bad indicies?

		const category = sounds[settings.categoryId];
		const instrument = category.instruments[settings.instrumentId];
		const note = instrument.notes[settings.noteId];

		return `musical-speaker-note-player-${instrument.name}-${note.name}`;
	}

	/**
	 * Destroys and recreates all note players
	 */
	initialize() {
		if (!this.combinator.valid) {
			throw new Error("Lolwhat");
		}

		this.notePlayers.filter(e => e.valid).forEach(e => e.destroy());
		this.notePlayers = [];

		const settings = this.settings;

		const notePlayer = this.combinator.surface.create_entity({
			name: this.getSpeakerEntityName(settings),
			position: {
				x: (this.combinator.position as PositionXY).x,
				y: (this.combinator.position as PositionXY).y - 1
			}
		});

		if (!notePlayer) {
			throw new Error("This should be impossible");
		}

		notePlayer.connect_neighbour({
			wire: defines.wire_type.red,
			target_entity: this.combinator
		});

		(notePlayer.get_or_create_control_behavior() as LuaGenericOnOffControlBehavior).circuit_condition = {
			condition: settings.enabledCondition
		}

		this.notePlayers.push(notePlayer);
	}

	/**
	 * Removes all entities associated with this combinator
	 */
	destroy() {
		this.notePlayers
			.concat(this.combinator)
			.filter(e => e.valid)
			.forEach(e => e.destroy());
	}
}
