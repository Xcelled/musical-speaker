local Gui = require('script.gui')

script.on_init(function ()
	global.gui = {}

	for player_index, _ in pairs(game.players) do
		initGuiForPlayer(player_index)
	end
end)

script.on_event(defines.events.on_player_joined_game, function (event)
	initGuiForPlayer(event.player_index)
end)

script.on_event(defines.events.on_player_left_game, function (event)
	global.gui[event.player_index] = nil
end)

script.on_event(defines.events.on_gui_opened, function (event)

	if not event.entity or event.entity.name ~= 'musical-speaker' then
		return
	end

	Gui.open(global.gui[event.player_index], event.entity, game.players[event.player_index])

end)

function initGuiForPlayer(player_index)
	gui = global.gui[player_index]

	if gui and gui.window and gui.window.valid then gui.window.destroy() end

	global.gui[player_index] = Gui.init(game.players[player_index].gui.screen)
end
