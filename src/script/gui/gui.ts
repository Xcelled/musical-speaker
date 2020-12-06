import * as Events from '__stdlib__/stdlib/event/event';

import GuiToolkit from './gui-toolkit';
import CircuitConditionSelectElement from './circuit-condition-select-element';
import MusicalSpeaker from '../musical-speaker';
import sounds from '../sounds';

function L(str: string, ...formatArgs: /** @vararg */ string[]) {
	return [str, ...formatArgs] as LocalisedString;
}

const EventType = defines.events;

export default class Gui {
	static registerEvents() {
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

	private window: LuaGuiElement;
	private preview: LuaGuiElement;
	private volumeSlider: LuaGuiElement;
	private enabledConditionSelect: CircuitConditionSelectElement;
	private categorySelect: LuaGuiElement;
	private instrumentSelect: LuaGuiElement;
	private noteSelect: LuaGuiElement;
	private speaker: MusicalSpeaker | undefined;
	private player: LuaPlayer;

	constructor(player: LuaPlayer) {
		this.player = player;

		const { element, mainContent } = GuiToolkit.window({
			parent: player.gui.screen,
			caption: L('entity-name.musical-speaker')
		});

		this.window = element;

		const previewPanel = GuiToolkit.panel({
			parent: mainContent!,
			//style: 'bordered_frame'
		}).content;

		(previewPanel.style as LuaStyle).horizontal_align = 'center';
		(previewPanel.style as LuaStyle).vertical_align = 'center';

		this.preview = previewPanel.add({
			type: 'entity-preview'
		});

		(this.preview.style as LuaStyle).width = 400;
		(this.preview.style as LuaStyle).height = 149;

		const volumePanel = GuiToolkit.panel({
			parent: mainContent!,
			direction: "horizontal"
		}).content;

		volumePanel.add({
			type: "label",
			caption: L('gui-programmable-speaker.volume')
		});

		this.volumeSlider = volumePanel.add({
			type: 'slider',
			minimum_value: 0,
			maximum_value: 100
		} as SliderGuiElementData);

		(this.volumeSlider.style as LuaStyle).horizontally_stretchable = true;

		const circuitNetworkPanel = GuiToolkit.labelledPanel({
			parent: mainContent!,
			line: true,
			caption: L('gui-programmable-speaker.circuit-connection-settings'),
			captionStyle: 'bold_label',
			direction: 'vertical'
		}).content
	
		this.enabledConditionSelect = new CircuitConditionSelectElement(circuitNetworkPanel);
	
		// Sound select panel
		const soundSelectPanel = GuiToolkit.panel({
			parent: circuitNetworkPanel,
			direction: 'horizontal'
		}).content
	
		this.categorySelect = soundSelectPanel.add({
			type: 'drop-down',
			items: sounds.map(category => L(`musical-speaker-category.${category.name}`))
		} as DropDownGuiElementData)
	
		this.instrumentSelect = soundSelectPanel.add({
			type: 'drop-down',
		})
	
		this.noteSelect = soundSelectPanel.add({
			type: 'drop-down',
		})
	}

	get visible() {
		return this.window.visible;
	}

	get index() {
		return this.window.index;
	}

	updateNoteSelectOptions() {
		const selectedCategory = sounds[this.categorySelect.selected_index - 1];
		const selectedInstrument = selectedCategory.instruments[this.instrumentSelect.selected_index - 1];

		this.instrumentSelect.items = selectedCategory.instruments
			.map(instrument => L(`musical-speaker-instrument.${instrument.name}`));
		this.noteSelect.items = selectedInstrument.notes
			.map(note => L(`musical-speaker-note.${note.name}`));
	}

	private writeSettingsToSpeaker() {
		if (!this.speaker) {
			throw new Error("Tried to write to nothing!");
		}

		this.speaker.settings = {
			volume: this.volumeSlider.slider_value,
			enabledCondition: {
				first_signal: this.enabledConditionSelect.firstSignalChooser.elem_value as (SignalID | undefined)
			},
			categoryId: this.categorySelect.selected_index - 1,
			instrumentId: this.instrumentSelect.selected_index - 1,
			noteId: this.noteSelect.selected_index - 1
		};
	}

	private readSettingsFromSpeaker() {
		if (!this.speaker) {
			throw new Error("Tried to open a null speaker!");
		}

		const settings = this.speaker.settings;

		this.volumeSlider.slider_value = settings.volume == -1 ? 100 : settings.volume;
		this.enabledConditionSelect.firstSignalChooser.elem_value = settings.enabledCondition.first_signal;
		this.categorySelect.selected_index = settings.categoryId + 1;
		this.instrumentSelect.selected_index = settings.instrumentId + 1;
		this.noteSelect.selected_index = settings.noteId + 1;
	}

	open(speaker: MusicalSpeaker) {
		this.speaker = speaker;

		this.readSettingsFromSpeaker();

		this.preview.entity = speaker.entity;
		this.window.visible = true;
		this.player.opened = this.window;
	}

	close() {
		this.speaker = undefined;
		this.preview.entity = undefined;
		this.window.visible = false;
	}

	destroy() {
		this.window.destroy();
	}

	onEntitySelectChanged(args: on_gui_elem_changed) {
		// For now, just blind save
		this.writeSettingsToSpeaker();
	}

	onSliderValueChanged(args: on_gui_value_changed) {
		// For now, just blind save
		this.writeSettingsToSpeaker();
	}

	onSelectionChanged(args: on_gui_selection_state_changed) {
		// For now, just blind save
		this.writeSettingsToSpeaker();

		if (args.element.index === this.noteSelect.index) {
			const note = sounds[this.categorySelect.selected_index - 1]
				.instruments[this.instrumentSelect.selected_index - 1]
				.notes[this.noteSelect.selected_index - 1];
			
			if (note && note.filename) {
				this.player.play_sound({
					path: note.filename
				});
			}
		}
	}
}

function onPlayerLeave(args: on_player_left_game | on_player_removed | on_player_kicked) {
	if (global.gui.has(args.player_index)) {
		const gui = global.gui.get(args.player_index);

		if (gui) {
			gui.destroy();
		}

		global.gui.delete(args.player_index);
	}
}

function onGuiOpened(args: on_gui_opened) {
	if (args.entity && args.entity.name == 'musical-speaker') {
		const player = game.players[args.player_index];
		let gui = global.gui.get(args.player_index);

		if (!gui) {
			gui = new Gui(player);
			global.gui.set(args.player_index, gui);
		}

		const speaker = global.speakers.get(args.entity.unit_number!);

		if (!speaker) {
			player.print("That's not a musical speaker!");
		} else {
			gui.open(speaker);
		}
	}
}

function onGuiClosed(args: on_gui_closed) {
	if (args.gui_type == defines.gui_type.custom) {
		callGui(args, gui => {
			if (args.element && args.element.index == gui.index) {
				gui.close();
			}
		});
	}
}

function callGui<T extends {player_index: number} >(args: T, func: (gui: Gui, args: T) => void) {
	const gui = global.gui.get(args.player_index);
	if (gui && gui.visible) {
		func(gui, args);
	}
}

function handleSliderChanged(args: on_gui_value_changed) {
	callGui(args, gui => gui.onSliderValueChanged(args));
}

function handleChooseElementChanged(args: on_gui_elem_changed) {
	callGui(args, gui => gui.onEntitySelectChanged(args));
}

function handleDropdownChanged(args: on_gui_selection_state_changed) {
	callGui(args, gui => gui.onSelectionChanged(args));
}
