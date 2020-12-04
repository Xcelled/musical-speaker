import * as util from 'util';

function window(args: {
	parent: LuaGuiElement,
	caption?: LocalisedString,
	noCloseButton?: boolean,
	noMainContent?: boolean
}) {
	const window = args.parent.add({
		type: 'frame',
		direction: 'vertical'
	} as FrameGuiElementData);

	window.auto_center = true;
	window.visible = true;

	const titleBar = window.add({
		type: 'flow',
		direction: 'horizontal'
	} as FlowGuiElementData);

	(titleBar.style as LuaStyle).horizontally_stretchable = true;
	(titleBar.style as LuaStyle).horizontal_spacing = 8;

	const titleBarText = titleBar.add({
		type: 'label',
		caption: args.caption,
		style: 'frame_title'
	});

	titleBarText.drag_target = window;

	const pusher = titleBar.add({
		type: 'empty-widget',
		style: 'draggable_space_header'
	});

	(pusher.style as LuaStyle).height = 24;
	(pusher.style as LuaStyle).horizontally_stretchable = true;
	pusher.drag_target = window;

	let cb;
	if (!args.noCloseButton) {
		cb = titleBar.add(closeButton());
	}

	let mc;
	if (!args.noMainContent) {
		mc = window.add(mainContent());
	}

	return {
		element: window,
		titleBar,
		closeButton: cb,
		mainContent: mc
	};
}

function closeButton(extra?: object) {
	return util.merge([
		{
			type: "sprite-button",
			style: "frame_action_button",
			sprite: "utility/close_white"
		} as SpriteButtonGuiElementData,
		extra || {}
	]);
}

function mainContent(extra?: object) {
	return util.merge([
		{
			type: "frame",
			style: "inside_shallow_frame_with_padding",
			direction: "vertical"
		} as FrameGuiElementData,
		extra || {}
	]);
}

type LayoutDirection = 'horizontal' | 'vertical';

function panel(args: {
	parent: LuaGuiElement,
	line?: boolean,
	direction?: LayoutDirection,
	style?: string
}) {
	const element = args.parent.add({
		type: 'flow',
		direction: args.direction || 'vertical',
		style: args.style
	} as FlowGuiElementData);

	if (args.line) {
		element.add({
			type: "line",
			direction: element.direction === 'horizontal' ? 'vertical' : 'horizontal'
		} as LineGuiElementData);
	}

	return {
		element,
		content: element
	};
}

function labelledPanel(args: {
	parent: LuaGuiElement,
	line?: boolean,
	caption: LocalisedString,
	captionStyle?: string,
	direction?: LayoutDirection
}) {
	// TODO: New arg for element direction
	const element = panel(args).element;

	// TODO: nest another vertical panel if element is horizontal
	const caption = element.add({
		type: 'label',
		caption: args.caption,
		style: args.captionStyle || 'heading_2_label'
	});

	const content = element.add({
		type: 'flow',
		direction: args.direction || 'horizontal'
	} as FlowGuiElementData);

	return {
		element,
		caption,
		content
	};
}

export default {
	window,
	closeButton,
	mainContent,
	panel,
	labelledPanel
};
