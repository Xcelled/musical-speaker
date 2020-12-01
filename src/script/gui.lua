local sounds = require('sounds')
local GuiToolkit = require('gui_toolkit')

function map(list, extractor)
	if type(extractor) ~= 'function' then
		local property = extractor
		extractor = function (val)
			return val[property]
		end
	end

	mapped = {}
	for key, val in ipairs(list) do
		mapped[key] = extractor(val)
	end

	return mapped
end

local Gui = {}

function Gui.init()
	-- Register handlers

end

function Gui.create(parent)
	local window = GuiToolkit.window({
		parent = parent,
		caption = { 'entity-name.musical-speaker' },
	})

	local previewPanel = GuiToolkit.panel({
		parent = window.mainContent,
		style = 'bordered_frame'
	}).content

	previewPanel.style.horizontal_align = "center"
	previewPanel.style.vertical_align = "center"

	local preview = previewPanel.add({
		type = 'entity-preview'
	})

	preview.style.width = 400
	preview.style.height = 149

	local volumePanel = GuiToolkit.panel({
		parent = window.mainContent,
		direction = 'horizontal'
	}).content

	volumePanel.add({
		type = 'label',
		caption = { 'gui-programmable-speaker.volume' }
	})

	local volumeSlider = volumePanel.add({
		type = 'slider',
		minimum_value = 0,
		maximum_value = 100
	})
	volumeSlider.style.horizontally_stretchable = true

	local circuitNetworkPanel = GuiToolkit.labelledPanel({
		parent = window.mainContent,
		line = true,
		caption = { 'gui-programmable-speaker.circuit-connection-settings' },
		captionStyle = 'bold_label',
		direction = 'vertical'
	}).content

	-- enabledCondition panel
	local enabledConditionPanel = GuiToolkit.labelledPanel({
		parent = circuitNetworkPanel,
		caption = { 'gui-control-behavior-modes-guis.enabled-condition' }
	}).content

	local enabledSignalChooser = enabledConditionPanel.add({
		type = 'choose-elem-button',
		elem_type = 'signal'
	})

	-- Sound select panel
	local soundSelectPanel = GuiToolkit.panel({
		parent = circuitNetworkPanel,
		direction = 'horizontal'
	}).content

	local categorySelect = soundSelectPanel.add({
		type = 'drop-down',
	})

	local instrumentSelect = soundSelectPanel.add({
		type = 'drop-down',
	})

	local noteSelect = soundSelectPanel.add({
		type = 'drop-down',
	})

	return {
		window = window.element,
		preview = preview,
		volumeSlider = volumeSlider,
		circuitNetworkPanel = circuitNetworkPanel,
		enabledSignalChooser = enabledSignalChooser,
		categorySelect = categorySelect,
		instrumentSelect = instrumentSelect,
		noteSelect = noteSelect
	}
end

function Gui.open(guiData, entity, player)
	guiData.preview.entity = entity
	guiData.preview.visible = true
	
	guiData.window.visible = true

	player.opened = guiData.window
end

function Gui.populate(guiData, combinator)
	
end

return Gui
