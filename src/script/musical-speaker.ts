import sounds from './sounds';
import * as Event from '__stdlib__/stdlib/event/event';

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

interface MusicalSpeaker {
	combinator: LuaEntity
	notePlayers: LuaEntity[]
}

export type Type = MusicalSpeaker;

export function registerEvents() {
	Event.register(
		[defines.events.on_built_entity, defines.events.on_robot_built_entity, defines.events.script_raised_built, defines.events.on_entity_cloned, defines.events.script_raised_revive],
		onBuilt
	);
	Event.register(
		[defines.events.script_raised_destroy, defines.events.on_entity_destroyed],
		onDestroyed
	);
}

export function create(combinator: LuaEntity): MusicalSpeaker {
	const speaker: MusicalSpeaker = {
		combinator,
		notePlayers: []
	}

	setSettings(speaker, {
		categoryId: 0,
		instrumentId: 0,
		noteId: 0,
		volume: 100,
		enabledCondition: {}
	});

	script.register_on_entity_destroyed(combinator);
	return speaker
}


/**
 * Reads the settings for this speaker from the backing combinator
 */
export function getSettings(speaker: MusicalSpeaker): Readonly<MusicalSpeakerSettings> {
	const m: { [key: number]: ConstantCombinatorParameters | undefined} = {};

	(speaker.combinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior).parameters?.forEach(p => m[p.index] = p);

	const volume = m[CombinatorSlots.VOLUME]?.count ?? 100;

	return {
		volume,
		enabledCondition: {
			first_signal: m[CombinatorSlots.ENABLED_FIRST_SIGNAL]?.signal,
			comparator: '>',
			constant: 0
		},
		categoryId: m[CombinatorSlots.CATEGORY_ID]?.count ?? 0,
		instrumentId: m[CombinatorSlots.INSTRUMENT_ID]?.count ?? 0,
		noteId: m[CombinatorSlots.NOTE_ID]?.count ?? 0
	}
}


/**
 * Applies new settings for this speaker and persists them to the backing combinator
 */
export function setSettings(speaker: MusicalSpeaker, settings: MusicalSpeakerSettings) {
	const parameters: ConstantCombinatorParameters[] = [
		{ index: CombinatorSlots.VOLUME, signal: { type: "virtual", name: "signal-V" }, count: settings.volume },
		{ index: CombinatorSlots.ENABLED_FIRST_SIGNAL, signal: settings.enabledCondition.first_signal!, count: 0 },
		{ index: CombinatorSlots.CATEGORY_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.categoryId },
		{ index: CombinatorSlots.INSTRUMENT_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.instrumentId },
		{ index: CombinatorSlots.NOTE_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.noteId },
	];
	
	(speaker.combinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior).parameters = parameters;

	// TODO: Skip this if we can
	initialize(speaker);
}

function getSpeakerEntityName(settings: MusicalSpeakerSettings) {
	// TODO: How does this behave with bad indicies?

	const category = sounds[settings.categoryId];
	const instrument = category.instruments[settings.instrumentId];
	const note = instrument.notes[settings.noteId];

	return `musical-speaker-note-player-${instrument.name}-${note.name}`;
}

/**
 * Destroys and recreates all note players
 */
export function initialize(speaker: MusicalSpeaker) {
	if (!speaker.combinator.valid) {
		throw new Error("Lolwhat");
	}

	speaker.notePlayers.filter(e => e.valid).forEach(e => e.destroy());
	speaker.notePlayers = [];

	const settings = getSettings(speaker);

	const notePlayer = speaker.combinator.surface.create_entity({
		name: getSpeakerEntityName(settings),
		position: {
			x: (speaker.combinator.position as PositionXY).x,
			y: (speaker.combinator.position as PositionXY).y - 1
		}
	});

	if (!notePlayer) {
		throw new Error("This should be impossible");
	}

	notePlayer.connect_neighbour({
		wire: defines.wire_type.red,
		target_entity: speaker.combinator
	});

	(notePlayer.get_or_create_control_behavior() as LuaGenericOnOffControlBehavior).circuit_condition = {
		condition: settings.enabledCondition
	}

	speaker.notePlayers.push(notePlayer);
}

/**
 * Removes all entities associated with this combinator
 */
export function destroy(speaker: MusicalSpeaker) {
	speaker.notePlayers
		.concat(speaker.combinator)
		.filter(e => e.valid)
		.forEach(e => e.destroy());
}

function onDestroyed(args: on_entity_destroyed) {
	if (!args.unit_number) {
		return;
	}

	const speaker = global.speakers.get(args.unit_number);

	if (speaker) {
		destroy(speaker);
		global.speakers.set(args.unit_number, undefined);
	}
}

function onBuilt(args: on_built_entity | on_robot_built_entity | script_raised_built | on_entity_cloned) {
	let entity;
	if ('created_entity' in args) {
		entity = args.created_entity;
	} else if ('entity' in args) {
		entity = args.entity;
	} else {
		entity = args.destination;
	}

	if (entity.name === 'musical-speaker' && entity.unit_number) {
		global.speakers.set(entity.unit_number, create(entity));
	}
}
