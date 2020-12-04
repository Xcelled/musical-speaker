import GuiToolkit from './gui-toolkit';
import CircuitConditionSelectElement from './circuit-condition-select-element';

function L(str: string, ...formatArgs: /** @vararg */ string[]) {
	return [str, ...formatArgs] as LocalisedString;
}

export default class Gui {
	window: LuaGuiElement;
	preview: LuaGuiElement;
	volumeSlider: LuaGuiElement;
	enabledConditionSelect: CircuitConditionSelectElement;
	categorySelect: LuaGuiElement;
	instrumentSelect: LuaGuiElement;
	noteSelect: LuaGuiElement;

	constructor(parent: LuaGuiElement) {
		const { element, mainContent } = GuiToolkit.window({
			parent,
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
		})
	
		this.instrumentSelect = soundSelectPanel.add({
			type: 'drop-down',
		})
	
		this.noteSelect = soundSelectPanel.add({
			type: 'drop-down',
		})
	}

	open(entity: LuaEntity, player: LuaPlayer) {
		this.preview.entity = entity;
		this.window.visible = true;
		player.opened = this.window;
	}

	asCombinatorSignals() {
		const settings = this.enabledConditionSelect.settings;

		const enabled = settings.firstSignal;
	}
}
