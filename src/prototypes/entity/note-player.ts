import sounds from '../../script/sounds';
import { InstrumentSpec, NoteSpec } from '../../script/sounds';
import * as util from 'util';

const emptyWires: WireConnectionPoint = {
	wire: {},
	shadow: {}
};

const existing = data.raw['power-switch']['power-switch'] as PrototypePowerSwitch;

const debug = true;

function makeNotePlayer(instrument: InstrumentSpec, note: NoteSpec, volume: number): PrototypePowerSwitch {
	const speakerSpecific = {
		type: 'power-switch',
		name: `musical-speaker-note-player-${instrument.name}-${note.name}-${volume}`,
		icon: '__base__/graphics/icons/programmable-speaker.png',
		icon_size: 64,
		icon_mipmaps: 4,
		flags: ['not-on-map', 'hidden', 'not-flammable', 'no-copy-paste', 'not-deconstructable'],
		collision_box: undefined,
		working_sound: {
			sound: {
				filename: note.filename,
				preload: false,
				audible_distance_modifier: 1000,
				volume: volume / 100.0
			},
			match_progress_to_activity: true,
			use_doppler_shift: false
		},

		wire_max_distance: debug ? 1000 : 0,
	};

	const nullBase = {
		circuit_wire_connection_point: emptyWires,
		left_wire_connection_point: emptyWires,
		right_wire_connection_point: emptyWires,
		led_off: util.empty_sprite(),
		led_on: util.empty_sprite(),
		overlay_loop: util.empty_sprite(),
		overlay_start: util.empty_sprite(),
		overlay_start_delay: 0,
		power_on_animation: util.empty_sprite()
	}

	return {
		...(debug ? existing : nullBase),
		...speakerSpecific
	} as PrototypePowerSwitch;
}

const entities: PrototypeEntity[] = [];

for (const category of sounds) {
	for (const instrument of category.instruments) {
		for (const note of instrument.notes) {
			for (let i = 0; i <= 100; i += 5) {
				entities.push(makeNotePlayer(instrument, note, i));
			}
		}
	}
}

data.extend(entities);
