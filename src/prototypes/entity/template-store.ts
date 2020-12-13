import * as util from 'util';

const base = data.raw.container['wooden-chest'];

const debug = false;

const templateStore: PrototypeContainer = {
	type: 'container',
	name: 'musical-speaker-template-store',
	icon: base.icon,
	icon_size: base.icon_size,
	icon_mipmaps: base.icon_mipmaps,
	picture: debug ? base.picture : util.empty_sprite(),

	inventory_size: 200,

	collision_mask: undefined,
	flags: debug ? undefined : [
		"hidden", "hide-alt-info", "no-automated-item-insertion", "no-automated-item-removal",
		"no-copy-paste", "not-blueprintable", "not-deconstructable", "not-flammable", "not-on-map", "not-upgradable", "not-selectable-in-game"
	]
};

data.extend([templateStore]);
