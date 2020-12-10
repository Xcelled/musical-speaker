import { getProgrammableSpeakerInstrumentId } from './sounds';
import { getTemplate } from './templates';
import * as Event from '__stdlib__/stdlib/event/event';

import { position } from 'math2d';

/**
 * 1 based cause these are fed directly to the lua API
 */
enum CombinatorSlots {
	VOLUME = 1,
	VOLUME_CONTROL_SIGNAL = 2,
	ENABLED_FIRST_SIGNAL = 3,
	//ENABLED_COMPARE = 4,
	//ENABLED_SECOND_SIGNAL = 5,
	//ENABLED_SECOND_CONSTANT = 6,
	CATEGORY_ID = 7,
	INSTRUMENT_ID = 8,
	NOTE_ID = 9
}

const EMPTY_SIGNAL: SignalID = {
	type: "item",
	name: undefined
}

interface MusicalSpeakerSettings {
	volume: number,
	volumeControlSignal?: SignalID,
	enabledCondition: CircuitCondition,
	categoryId: number,
	instrumentId: number,
	noteId: number
}

interface MusicalSpeaker {
	combinator: LuaEntity
	notePlayer?: LuaEntity,
	isPlaying: boolean
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
	Event.on_nth_tick(1, checkCircuitSignals);
}

export function create(combinator: LuaEntity): MusicalSpeaker {
	const speaker: MusicalSpeaker = {
		combinator,
		notePlayer: undefined,
		isPlaying: false
	}

	setSettings(speaker, {
		categoryId: 0,
		instrumentId: 0,
		noteId: 0,
		volume: 100,
		volumeControlSignal: undefined,
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
		volumeControlSignal: m[CombinatorSlots.VOLUME_CONTROL_SIGNAL]?.signal,
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
		{ index: CombinatorSlots.VOLUME_CONTROL_SIGNAL, signal: settings.volumeControlSignal ?? EMPTY_SIGNAL, count: 0},
		{ index: CombinatorSlots.ENABLED_FIRST_SIGNAL, signal: settings.enabledCondition.first_signal ?? EMPTY_SIGNAL, count: 0 },
		{ index: CombinatorSlots.CATEGORY_ID, signal: { type: "virtual", name: "signal-C" }, count: settings.categoryId },
		{ index: CombinatorSlots.INSTRUMENT_ID, signal: { type: "virtual", name: "signal-I" }, count: settings.instrumentId },
		{ index: CombinatorSlots.NOTE_ID, signal: { type: "virtual", name: "signal-N" }, count: settings.noteId },
	];
	
	(speaker.combinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior).parameters = parameters;

	// TODO: Skip this if we can
	reset(speaker);
}

/**
 * Destroys and recreates note player
 */
export function reset(speaker: MusicalSpeaker) {
	if (!speaker.combinator.valid) {
		throw "Lolwhat";
	}

	if (speaker.notePlayer && speaker.notePlayer.valid) {
		speaker.notePlayer.destroy();
	}

	const settings = getSettings(speaker);

	const blueprint = getTemplate({
		globalPlayback: true,
		volume: settings.volume
	});

	const ghosts = blueprint.build_blueprint({
		surface: speaker.combinator.surface,
		force: speaker.combinator.force,
		position: speaker.combinator.position
	});

	if (ghosts.length != 1) {
		throw "This should be impossible";
	}

	const [_, notePlayer] = ghosts[0].silent_revive();

	if (!notePlayer) {
		throw "Failed to revive ghost";
	}

	speaker.notePlayer = notePlayer;

	notePlayer.connect_neighbour({
		wire: defines.wire_type.red,
		target_entity: speaker.combinator
	});

	notePlayer.connect_neighbour({
		wire: defines.wire_type.green,
		target_entity: speaker.combinator
	});

	const controlBehavior = notePlayer.get_or_create_control_behavior() as LuaProgrammableSpeakerControlBehavior;

	controlBehavior.circuit_condition = {
		condition: settings.enabledCondition
	};

	const programmableSpeakerInstrument = getProgrammableSpeakerInstrumentId(settings.categoryId, settings.instrumentId);

	if (!programmableSpeakerInstrument) {
		game.print(`Unknown instrument!`);
	} else {
		controlBehavior.circuit_parameters = {
			signal_value_is_pitch: false,
			note_id: settings.noteId,
			instrument_id: programmableSpeakerInstrument
		}
	}
}

/**
 * Removes all entities associated with this musical speaker
 */
export function destroy(speaker: MusicalSpeaker) {
	[speaker.notePlayer, speaker.combinator]
		.filter(e => e != undefined)
		.filter(e => e!.valid)
		.forEach(e => e!.destroy());
}

function onDestroyed(args: on_entity_destroyed) {
	if (!args.unit_number) {
		return;
	}

	const speaker = global.speakers[args.unit_number];

	if (speaker) {
		destroy(speaker);
		global.speakers[args.unit_number] = undefined;
	}
}

function onBuilt(args: on_built_entity | on_robot_built_entity | script_raised_built | on_entity_cloned) {
	let entity: LuaEntity;
	if ('created_entity' in args) {
		entity = args.created_entity;
	} else if ('entity' in args) {
		entity = args.entity;
	} else {
		entity = args.destination;
	}

	if (entity.name === 'musical-speaker' && entity.unit_number) {
		global.speakers[entity.unit_number] = create(entity);
		entity.active = false
	}
}

function checkCircuitSignals(args: on_tick) {
	for (const speakerId in global.speakers) {
		const speaker = global.speakers[speakerId];

		if (!speaker) {
			continue;
		}

		const settings = getSettings(speaker);

		if (settings.volumeControlSignal && settings.volumeControlSignal.name) {
			const volume = speaker.combinator.get_merged_signal(settings.volumeControlSignal);
			if (settings.volume != volume) {
				setSettings(speaker, {
					...settings,
					volume
				});
			}
		}

		if (speaker.notePlayer) {
			const controlBehavior = speaker.notePlayer.get_control_behavior() as LuaProgrammableSpeakerControlBehavior;

			if (controlBehavior) {
				const currentlyPlaying = controlBehavior.circuit_condition.fulfilled;

				if (currentlyPlaying) {
					speaker.isPlaying = true
				} else if (speaker.isPlaying) {
					// We think the speaker is playing, but it's not - reset it
					speaker.isPlaying = false;
					reset(speaker);				
				}
			}
		}
	}
}
