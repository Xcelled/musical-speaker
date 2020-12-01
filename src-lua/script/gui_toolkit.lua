local util = require('util')

GuiToolkit = {}

function GuiToolkit.window(args)
	local window = args.parent.add({
		type = 'frame',
		direction = 'vertical'
	})

	window.auto_center = true
	window.visible = false

	local titlebar = window.add({
		type = 'flow',
		direction = 'horizontal'
	})

	titlebar.style.horizontally_stretchable = true
	titlebar.style.horizontal_spacing = 8

	local titlebarText = titlebar.add({
		type = 'label',
		caption = args.caption,
		style = "frame_title"
	})

	titlebarText.drag_target = window

	local pusher = titlebar.add({
		type = 'empty-widget',
		style = 'draggable_space_header'
	})

	pusher.style.height = 24
	pusher.style.horizontally_stretchable = true
	pusher.drag_target = window

	local guiData = {
		element = window,
		titlebar = titlebar
	}

	if args.closeButton == nil or args.closeButton then
		guiData.closeButton = titlebar.add(GuiToolkit.closeButton())
	end

	if args.mainContent == nil or args.mainContent then
		guiData.mainContent = window.add(GuiToolkit.mainContent())
	end

	return guiData
end

function GuiToolkit.closeButton(extra)
	return util.merge({ {type = "sprite-button", style = "frame_action_button", sprite = "utility/close_white"}, extra or {} })
end

function GuiToolkit.mainContent(extra)
	return util.merge({ {type = "frame", style = "inside_shallow_frame_with_padding", direction = "vertical"}, extra or {} })
end

function GuiToolkit.panel(args)
	local element = args.parent.add({
		type = 'flow',
		direction = args.direction or 'vertical'
	})

	if args.line then
		-- todo: invert line from direction
		element.add({type = 'line'})
	end

	return { element = element, content = element }
end

function GuiToolkit.labelledPanel(args)
	-- todo: pass through arg to control element direction
	local element = GuiToolkit.panel(args).element

	-- TODO: nest another vertical panel if the element is horizontal
	local caption = element.add({
		type = 'label',
		caption = args.caption,
		style = args.captionStyle or 'heading_2_label'
	})

	local content = element.add({
		type = 'flow',
		direction = args.direction or 'horizontal'
	})

	return {
		element = element,
		caption = caption,
		content = content
	}
end

return GuiToolkit
