import * as Events from '__stdlib__/stdlib/event/event';

import GuiToolkit from './gui-toolkit';
import * as CircuitConditionSelectElement from './circuit-condition-select-element';
import * as MusicalSpeaker from '../musical-speaker';
import { categories } from '../sounds';

function L(str: string, ...formatArgs: /** @vararg */ string[]) {
	return [str, ...formatArgs] as LocalisedString;
}

const EventType = defines.events;

interface Gui {
	speaker: MusicalSpeaker.Type | undefined;
	player: LuaPlayer;

	window: LuaGuiElement;
	closeButton: LuaGuiElement;
	preview: LuaGuiElement;
	volumeSlider: LuaGuiElement;
	enabledConditionSelect: CircuitConditionSelectElement.Type;
	categorySelect: LuaGuiElement;
	instrumentSelect: LuaGuiElement;
	noteSelect: LuaGuiElement;
	volumeControlSelect: LuaGuiElement;
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
	Events.register([EventType.on_gui_closed], passToGui(onGuiClosed));

	Events.register([EventType.on_gui_value_changed], passToGui(onSliderValueChanged));
	Events.register([EventType.on_gui_elem_changed], passToGui(onEntitySelectChanged));
	Events.register([EventType.on_gui_selection_state_changed], passToGui(onSelectionChanged));
	Events.register([EventType.on_gui_click], passToGui(onClick));
}

function passToGui<T extends {player_index: number}>(guiHandler: (gui: Gui, args: T) => void) {
	return function (args: T) {
		const gui = global.gui[args.player_index];
		if (gui && gui.window.visible) {
			guiHandler(gui, args);
		}
	}
}

export function create(player: LuaPlayer): Gui {
	let gui: Partial<Gui> = {};
	gui.player = player;

	const { element, closeButton, mainContent } = GuiToolkit.window({
		parent: player.gui.screen,
		caption: L('entity-name.musical-speaker')
	});

	gui.window = element;
	gui.closeButton = closeButton;

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
		minimum_value: 1,
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
		items: categories.map(category => L(`musical-speaker-category.${category.name}`))
	} as DropDownGuiElementData);

	gui.instrumentSelect = soundSelectPanel.add({
		type: 'drop-down',
	});

	gui.noteSelect = soundSelectPanel.add({
		type: 'drop-down',
	});

	const volumeFromCircuitPanel = GuiToolkit.labelledPanel({
		parent: circuitNetworkPanel,
		caption: L('musical-speaker.volume-control-condition')
	}).content;

	gui.volumeControlSelect = volumeFromCircuitPanel.add({
		type: 'choose-elem-button',
		elem_type: 'signal'
	} as ChooseElemButtonGuiElementData);

	return gui as Gui;
}

export function updateNoteSelectOptions(gui: Gui) {
	const selectedCategory = categories[gui.categorySelect.selected_index - 1] || categories[0];
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
		noteId: gui.noteSelect.selected_index - 1,
		volumeControlSignal: gui.volumeControlSelect.elem_value as (SignalID | undefined)
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
	gui.volumeControlSelect.elem_value = settings.volumeControlSignal;
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

	if (gui.player.opened_gui_type == defines.gui_type.custom) {
		gui.player.opened = null;
	}
}

export function destroy(gui: Gui) {
	gui.window.destroy();
}

function onClick(gui: Gui, args: on_gui_click) {
	if (args.element.index == gui.closeButton.index) {
		close(gui);
	}
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
		const note = categories[gui.categorySelect.selected_index - 1]
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
		const gui = global.gui[args.player_index];

		if (gui) {
			destroy(gui);
		}

		global.gui[args.player_index] = undefined;
	}
}

function onGuiOpened(args: on_gui_opened) {
	if (args.entity && args.entity.name == 'musical-speaker') {
		const player = game.players[args.player_index];
		let gui = global.gui[args.player_index];

		if (!gui) {
			gui = create(player);
			global.gui[args.player_index] = gui;
		}

		const speaker = global.speakers[args.entity.unit_number!];

		if (!speaker) {
			player.print("That's not a musical speaker!");
		} else {
			open(gui, speaker);
		}
	}
}

function onGuiClosed(gui: Gui, args: on_gui_closed) {
	if (args.gui_type == defines.gui_type.custom) {
		if (args.element && args.element.index == gui.window.index) {
			close(gui);
		}
	}
}
