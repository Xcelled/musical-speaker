local sounds = require('sounds')
local util = require('util')

local emptyWires = { wire = {}, shadow = {}}

local baseEntity = data.raw['power-switch']['power-switch']
function makeNotePlayer(instrument, note)
	return {
		type = 'power-switch',
		name = string.format('musical-speaker-note-player-%s-%s', instrument, note.name),
		icon = '__base__/graphics/icons/programmable-speaker.png',
		icon_size = 64, icon_mipmaps = 4,
		flags = { 'not-on-map', 'hidden', 'not-flammable', 'no-copy-paste', 'not-deconstructable'  },
		collision_bask = {},
		working_sound = {
			sound = {
				filename = note.filename,
				preload = false,
				audible_distance_modifier = 1e99
			},
		},

		wire_max_distance = 5,

		circuit_wire_connection_point = emptyWires,
		left_wire_connection_point = emptyWires,
		right_wire_connection_point = emptyWires,
		led_off = util.empty_sprite(),
		led_on = util.empty_sprite(),
		overlay_loop = util.empty_sprite(),
		overlay_start = util.empty_sprite(),
		overlay_start_delay = 0,
		power_on_animation = util.empty_sprite()
	}
end

entities = {}
for _, category in pairs(sounds) do
	for _, instrument in pairs(category.instruments) do
		for _, note in pairs(instrument.notes) do
			table.insert(entities, makeNotePlayer(instrument.name, note))
		end
	end
end

data:extend(entities)
