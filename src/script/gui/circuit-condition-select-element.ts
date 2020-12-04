import guiToolkit from './gui-toolkit';
import GuiToolkit from './gui-toolkit';
import * as util from 'util';

enum ConditionComparator {
	LESS_THAN = 1,
	GREATER_THAN,
	EQUAL_TO,
	GREATER_THAN_OR_EQUAL_TO,
	LESS_THAN_OR_EQUAL_TO,
	NOT_EQUAL_TO
}

const comparatorStrings: ReadonlyArray<string | undefined> = [
	undefined, '<', '>', '=', '≥', '≤', '≠'
]

interface CircuitConditionSettings {
	firstSignal: SignalID | undefined;
	comparator: ConditionComparator;
	secondSignal: SignalID | number | undefined;
}

export default class CircuitConditionSelectElement{
	firstSignalChooser: LuaGuiElement;
	comparatorChooser: LuaGuiElement;
	secondConstantButton: LuaGuiElement;
	secondSignalChooser: LuaGuiElement;

	constructor(parent: LuaGuiElement) {
		const panel = GuiToolkit.labelledPanel({
			parent,
			caption: ['gui-control-behavior-modes-guis.enabled-condition'] as LocalisedString
		}).content;

		this.firstSignalChooser = panel.add({
			type: 'choose-elem-button',
			elem_type: 'signal'
		} as ChooseElemButtonGuiElementData);

		this.comparatorChooser = panel.add({
			type: 'drop-down',
			items: comparatorStrings,
			selected_index: 0
		} as DropDownGuiElementData);

		this.secondConstantButton = panel.add({
			type: 'button'
		});

		this.secondSignalChooser = panel.add({
			type: 'choose-elem-button',
			elem_type: 'signal'
		} as ChooseElemButtonGuiElementData);

		this.secondSignalChooser.visible = false;
	}

	get settings(): Readonly<CircuitConditionSettings> {

		let secondSignal;

		if (this.secondConstantButton.visible) {
			secondSignal = this.secondConstantButton.tags['value'];
		} else {
			secondSignal = this.secondSignalChooser.elem_value as SignalID
		}

		return {
			firstSignal: this.firstSignalChooser.elem_value as SignalID,
			comparator: this.comparatorChooser.selected_index,
			secondSignal
		};
	}

	set settings(newValue: Readonly<CircuitConditionSettings>) {
		this.firstSignalChooser.elem_value = newValue.firstSignal;
		this.comparatorChooser.selected_index = newValue.comparator

		if (typeof newValue.secondSignal === 'number') {
			this.secondConstantButton.caption = util.format_number(newValue.secondSignal, true)
			this.secondConstantButton.tags['value'] = newValue.secondSignal;
			this.secondConstantButton.visible = true;
			this.secondSignalChooser.visible = false;
		} else {
			this.secondSignalChooser.elem_value = newValue.secondSignal;
			this.secondConstantButton.visible = false;
			this.secondSignalChooser.visible = true
		}
	}
}
