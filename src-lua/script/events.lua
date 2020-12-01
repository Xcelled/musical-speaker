local Gui = require('gui')

script.on_event(defines.events.on_gui_opened, function (event)

	if not event.entity or event.entity.name ~= 'musical-speaker' then
		return
	end

	local player = game.players[event.player_index]

	local window = Gui.init(player.gui.center)

	window.visible = true
	
end)
