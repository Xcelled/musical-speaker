import { programmableSpeakerInstruments } from '../../script/sounds';
import * as util from 'util';

const emptyWires: WireConnectionPoint = {
	wire: {},
	shadow: {}
};

const baseSpeaker = data.raw['programmable-speaker']['programmable-speaker'] as PrototypeProgrammableSpeaker;

const debug = true;

let notePlayer = table.deepcopy(baseSpeaker);

notePlayer.name = 'musical-speaker-note-player';
notePlayer.minable = undefined;
notePlayer.flags = ['not-on-map', 'hidden', 'not-flammable', 'no-copy-paste', 'not-deconstructable'];
notePlayer.collision_box = undefined;
notePlayer.energy_source = {
	type: 'void'
};



notePlayer.instruments = programmableSpeakerInstruments as any;

if (!debug) {
	notePlayer = {
		...notePlayer,
		...{
			circuit_wire_connection_point: emptyWires,
			sprite: util.empty_sprite(),
			circuit_connector_sprites: undefined,
			draw_circuit_wires: false,
			draw_copper_wires: false,
			selectable_in_game: false
		}
	};
}

data.extend([notePlayer]);
