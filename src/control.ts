import Gui from './script/gui/gui';

script.on_event(defines.events.on_gui_opened, (event: on_gui_opened) => {
	if (event.entity && event.entity.name === 'musical-speaker') {
		const player = game.players[event.player_index];

		new Gui(player.gui.screen).open(event.entity, player);
	}
});
