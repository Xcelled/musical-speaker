import * as util from 'util';

const baseSpeaker = data.raw['programmable-speaker']['programmable-speaker'] as PrototypeProgrammableSpeaker;

const speaker: PrototypeConstantCombinator = {
	...baseSpeaker,
	type: 'constant-combinator',
	name: 'musical-speaker',
	flags: [...baseSpeaker.flags!, 'not-rotatable', 'hide-alt-info'],
	sprites: baseSpeaker.sprite,
	item_slot_count: 40,
	activity_led_sprites: util.empty_sprite(),
	activity_led_light_offsets: [
		[0,0],
		[0,0],
		[0,0],
		[0,0],
	],
	circuit_wire_connection_points: [
		baseSpeaker.circuit_wire_connection_point!,
		baseSpeaker.circuit_wire_connection_point!,
		baseSpeaker.circuit_wire_connection_point!,
		baseSpeaker.circuit_wire_connection_point!,
	]
}


data.extend([speaker]);
