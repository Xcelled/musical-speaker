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
	'<', '>', '=', '≥', '≤', '≠'
]

interface CircuitConditionSettings {
	firstSignal: SignalID | undefined;
	comparator: ConditionComparator;
	secondSignal: SignalID | number | undefined;
}

interface CircuitConditionSelectElement {
	firstSignalChooser: LuaGuiElement;
	comparatorChooser: LuaGuiElement;
	secondConstantButton: LuaGuiElement;
	secondSignalChooser: LuaGuiElement;
}

export type Type = CircuitConditionSelectElement;

export function create(parent: LuaGuiElement): CircuitConditionSelectElement {
	let element: Partial<CircuitConditionSelectElement> = {}

	const panel = GuiToolkit.labelledPanel({
		parent,
		caption: ['gui-control-behavior-modes-guis.enabled-condition'] as LocalisedString
	}).content;

	(panel.style as LuaStyle).vertical_align = 'center';

	element.firstSignalChooser = panel.add({
		type: 'choose-elem-button',
		elem_type: 'signal'
	} as ChooseElemButtonGuiElementData);

	element.comparatorChooser = panel.add({
		type: 'drop-down',
		items: comparatorStrings,
		selected_index: 2,
		style: 'circuit_condition_comparator_dropdown'
	} as DropDownGuiElementData);

	element.secondConstantButton = panel.add({
		type: 'button',
		style: (element.firstSignalChooser.style as LuaStyle).name,
		caption: '0'
	} as ButtonGuiElementData);
	element.secondConstantButton.tags['value'] = 0;
	(element.secondConstantButton.style as LuaStyle).font_color = { r: 255, g: 255, b: 255 };

	element.secondSignalChooser = panel.add({
		type: 'choose-elem-button',
		elem_type: 'signal'
	} as ChooseElemButtonGuiElementData);

	element.secondSignalChooser.visible = false;

	element.comparatorChooser.enabled = false;
	element.secondSignalChooser.enabled = false;

	return element as CircuitConditionSelectElement;
}

export function getSettings(element: CircuitConditionSelectElement): Readonly<CircuitConditionSettings> {

	let secondSignal;

	if (element.secondConstantButton.visible) {
		secondSignal = element.secondConstantButton.tags['value'];
	} else {
		secondSignal = element.secondSignalChooser.elem_value as SignalID
	}

	return {
		firstSignal: element.firstSignalChooser.elem_value as SignalID,
		comparator: element.comparatorChooser.selected_index,
		secondSignal
	};
}

export function setSettings(element: CircuitConditionSelectElement, newValue: Readonly<CircuitConditionSettings>) {
	element.firstSignalChooser.elem_value = newValue.firstSignal;
	element.comparatorChooser.selected_index = newValue.comparator

	if (typeof newValue.secondSignal === 'number') {
		element.secondConstantButton.caption = util.format_number(newValue.secondSignal, true)
		element.secondConstantButton.tags['value'] = newValue.secondSignal;
		element.secondConstantButton.visible = true;
		element.secondSignalChooser.visible = false;
	} else {
		element.secondSignalChooser.elem_value = newValue.secondSignal;
		element.secondConstantButton.visible = false;
		element.secondSignalChooser.visible = true
	}
}
