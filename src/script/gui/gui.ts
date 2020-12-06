import * as Events from '__stdlib__/stdlib/event/event';

import GuiToolkit from './gui-toolkit';
import * as CircuitConditionSelectElement from './circuit-condition-select-element';
import * as MusicalSpeaker from '../musical-speaker';
import sounds from '../sounds';

function L(str: string, ...formatArgs: /** @vararg */ string[]) {
	return [str, ...formatArgs] as LocalisedString;
}

const EventType = defines.events;

interface Gui {
	window: LuaGuiElement;
	preview: LuaGuiElement;
	volumeSlider: LuaGuiElement;
	enabledConditionSelect: CircuitConditionSelectElement.Type;
	categorySelect: LuaGuiElement;
	instrumentSelect: LuaGuiElement;
	noteSelect: LuaGuiElement;
	speaker: MusicalSpeaker.Type | undefined;
	player: LuaPlayer;
}

export type Type = Gui;

export function registerEvents() {
	Events.register([
		EventType.on_player_left_game,
		EventType.on_player_removed,
		EventType.on_player_kicked],
		onPlayerLeave
	);

	Events.register([EventType.on_gui_opened], onGuiOpened);
	Events.register([EventType.on_gui_closed], onGuiClosed);

	Events.register([EventType.on_gui_value_changed], handleSliderChanged);
	Events.register([EventType.on_gui_elem_changed], handleChooseElementChanged);
	Events.register([EventType.on_gui_selection_state_changed], handleDropdownChanged);
}

export function create(player: LuaPlayer): Gui {
	let gui: any = {};
	gui.player = player;

	const { element, mainContent } = GuiToolkit.window({
		parent: player.gui.screen,
		caption: L('entity-name.musical-speaker')
	});

	gui.window = element;

	const previewPanel = GuiToolkit.panel({
		parent: mainContent!,
		//style: 'bordered_frame'
	}).content;

	(previewPanel.style as LuaStyle).horizontal_align = 'center';
	(previewPanel.style as LuaStyle).vertical_align = 'center';

	gui.preview = previewPanel.add({
		type: 'entity-preview'
	});

	(gui.preview.style as LuaStyle).width = 400;
	(gui.preview.style as LuaStyle).height = 149;

	const volumePanel = GuiToolkit.panel({
		parent: mainContent!,
		direction: "horizontal"
	}).content;

	volumePanel.add({
		type: "label",
		caption: L('gui-programmable-speaker.volume')
	});

	gui.volumeSlider = volumePanel.add({
		type: 'slider',
		minimum_value: 0,
		maximum_value: 100
	} as SliderGuiElementData);

	(gui.volumeSlider.style as LuaStyle).horizontally_stretchable = true;

	const circuitNetworkPanel = GuiToolkit.labelledPanel({
		parent: mainContent!,
		line: true,
		caption: L('gui-programmable-speaker.circuit-connection-settings'),
		captionStyle: 'bold_label',
		direction: 'vertical'
	}).content

	gui.enabledConditionSelect = CircuitConditionSelectElement.create(circuitNetworkPanel);

	// Sound select panel
	const soundSelectPanel = GuiToolkit.panel({
		parent: circuitNetworkPanel,
		direction: 'horizontal'
	}).content

	gui.categorySelect = soundSelectPanel.add({
		type: 'drop-down',
		items: sounds.map(category => L(`musical-speaker-category.${category.name}`))
	} as DropDownGuiElementData);

	gui.instrumentSelect = soundSelectPanel.add({
		type: 'drop-down',
	});

	gui.noteSelect = soundSelectPanel.add({
		type: 'drop-down',
	});

	return gui;
}

export function updateNoteSelectOptions(gui: Gui) {
	const selectedCategory = sounds[gui.categorySelect.selected_index - 1] || sounds[0];
	const selectedInstrument = selectedCategory.instruments[gui.instrumentSelect.selected_index - 1] || selectedCategory.instruments[0];

	gui.instrumentSelect.items = selectedCategory.instruments
		.map(instrument => L(`musical-speaker-instrument.${instrument.name}`));
	gui.noteSelect.items = selectedInstrument.notes
		.map(note => L(`musical-speaker-note.${note.name}`));
}

function writeSettingsToSpeaker(gui: Gui) {
	if (!gui.speaker) {
		throw new Error("Tried to write to nothing!");
	}

	MusicalSpeaker.setSettings(gui.speaker, {
		volume: gui.volumeSlider.slider_value,
		enabledCondition: {
			first_signal: gui.enabledConditionSelect.firstSignalChooser.elem_value as (SignalID | undefined)
		},
		categoryId: gui.categorySelect.selected_index - 1,
		instrumentId: gui.instrumentSelect.selected_index - 1,
		noteId: gui.noteSelect.selected_index - 1
	});
}

function readSettingsFromSpeaker(gui: Gui) {
	if (!gui.speaker) {
		throw new Error("Tried to open a null speaker!");
	}

	const settings = MusicalSpeaker.getSettings(gui.speaker);

	updateNoteSelectOptions(gui);

	gui.volumeSlider.slider_value = settings.volume;
	gui.enabledConditionSelect.firstSignalChooser.elem_value = settings.enabledCondition.first_signal;
	gui.categorySelect.selected_index = settings.categoryId + 1;
	gui.instrumentSelect.selected_index = settings.instrumentId + 1;
	gui.noteSelect.selected_index = settings.noteId + 1;
}

export function open(gui: Gui, speaker: MusicalSpeaker.Type) {
	gui.speaker = speaker;

	readSettingsFromSpeaker(gui);

	gui.preview.entity = speaker.combinator;
	gui.window.visible = true;
	gui.player.opened = gui.window;
}

export function close(gui: Gui) {
	gui.speaker = undefined;
	gui.preview.entity = undefined;
	gui.window.visible = false;
}

export function destroy(gui: Gui) {
	gui.window.destroy();
}

function onEntitySelectChanged(gui:Gui, args: on_gui_elem_changed) {
	// For now, just blind save
	writeSettingsToSpeaker(gui);
}

function onSliderValueChanged(gui:Gui, args: on_gui_value_changed) {
	// For now, just blind save
	writeSettingsToSpeaker(gui);
}

function onSelectionChanged(gui:Gui, args: on_gui_selection_state_changed) {
	// For now, just blind save
	writeSettingsToSpeaker(gui);

	if (args.element.index === gui.noteSelect.index) {
		const note = sounds[gui.categorySelect.selected_index - 1]
			.instruments[gui.instrumentSelect.selected_index - 1]
			.notes[gui.noteSelect.selected_index - 1];
		
		if (note && note.filename) {
			// gui.player.play_sound({
			// 	path: note.filename
			// });
		}
	}
}

function onPlayerLeave(args: on_player_left_game | on_player_removed | on_player_kicked) {
	if (args.player_index in global.gui) {
		const gui = global.gui.get(args.player_index);

		if (gui) {
			destroy(gui);
		}

		global.gui.set(args.player_index, undefined);
	}
}

function onGuiOpened(args: on_gui_opened) {
	if (args.entity && args.entity.name == 'musical-speaker') {
		const player = game.players[args.player_index];
		let gui = global.gui.get(args.player_index);

		if (!gui) {
			gui = create(player);
			global.gui.set(args.player_index, gui);
		}

		const speaker = global.speakers.get(args.entity.unit_number!);

		if (!speaker) {
			player.print("That's not a musical speaker!");
		} else {
			open(gui, speaker);
		}
	}
}

function onGuiClosed(args: on_gui_closed) {
	if (args.gui_type == defines.gui_type.custom) {
		callGui(args, gui => {
			if (args.element && args.element.index == gui.window.index) {
				close(gui);
			}
		});
	}
}

function callGui<T extends {player_index: number} >(args: T, func: (gui: Gui, args: T) => void) {
	const gui = global.gui.get(args.player_index);
	if (gui && gui.window.visible) {
		func(gui, args);
	}
}

function handleSliderChanged(args: on_gui_value_changed) {
	callGui(args, onSliderValueChanged);
}

function handleChooseElementChanged(args: on_gui_elem_changed) {
	callGui(args, onEntitySelectChanged);
}

function handleDropdownChanged(args: on_gui_selection_state_changed) {
	callGui(args, onSelectionChanged);
}
