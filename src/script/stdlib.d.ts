/** @noSelfInFile */

type EventId = defines.events | number | string | Array<defines.events | number | string>

/** @noResolution */
declare module '__stdlib__/stdlib/event/event' {
	function register(event_id: EventId, handler: Function, filter?: Function, pattern?: any, options?: { [k: string]: any }): Event
	function on_init(handler: Function): Event
	function on_configuration_changed(handler: Function): Event
	
	interface Event {
		register(event_id: EventId, handler: Function, filter?: Function, pattern?: any, options?: { [k: string]: any }): Event
		on_init(handler: Function): Event
		on_configuration_changed(handler: Function): Event
	}
}

/** @noResolution */
declare module '__stdlib__/stdlib/event/gui' {
	interface Gui {
		on_click(gui_element_pattern: string, handler: (arg: on_gui_click) => void): Gui,
		on_checked_state_changed(gui_element_pattern: string, handler: (arg: on_gui_checked_state_change) => void): Gui,
		on_selection_state_changed(gui_element_pattern: string, handler: (arg: on_gui_selection_state_changed) => void): Gui,
		on_value_changed(gui_element_pattern: string, handler: (arg: on_gui_value_changed) => void): Gui
	}
}
