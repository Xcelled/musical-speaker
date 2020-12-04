import sounds from '../../script/sounds';
import { InstrumentSpec, NoteSpec } from '../../script/sounds';
import * as util from 'util';

const emptyWires: WireConnectionPoint = {
	wire: {},
	shadow: {}
};

function makeNotePlayer(instrument: InstrumentSpec, note: NoteSpec): PrototypePowerSwitch {
	return {
		type: 'power-switch',
		name: `musical-speaker-note-player-${instrument.name}-${note.name}`,
		icon: '__base__/graphics/icons/programmable-speaker.png',
		icon_size: 64,
		icon_mipmaps: 4,
		flags: ['not-on-map', 'hidden', 'not-flammable', 'no-copy-paste', 'not-deconstructable'],
		collision_box: {},
		working_sound: {
			sound: {
				filename: note.filename,
				preload: false,
				audible_distance_modifer: 1e99
			}
		},

		wire_max_distance: 5,

		circuit_wire_connection_point: emptyWires,
		left_wire_connection_point: emptyWires,
		right_wire_connection_point: emptyWires,
		led_off: util.emptySprite(),
		led_on: util.emptySprite(),
		overlay_loop: util.emptySprite(),
		overlay_start: util.emptySprite(),
		overlay_start_delay: 0,
		power_on_animation: util.emptySprite()
	};
}

const entities: PrototypeEntity[] = [];

for (const category of sounds) {
	for (const instrument of category.instruments) {
		for (const note of instrument.notes) {
			entities.push(makeNotePlayer(instrument, note));
		}
	}
}

data.extend(entities);
