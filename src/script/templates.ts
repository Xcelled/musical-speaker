export interface TemplateSettings {
	globalPlayback: boolean
	volume: number, 
}

interface ProgrammableSpeakerBlueprintEntity extends BlueprintEntity {
	alert_parameters: {
		alert_message: string,
		show_alert: boolean,
		show_on_map: boolean
	},
	parameters: {
		allow_polyphony: boolean,
		playback_globally: boolean,
		playback_volume: number
	}
}

function getKey(store: TemplateSettings) {
	return [
		store.globalPlayback,
		store.volume
	].join('-');
}

export function getTemplate(settings: TemplateSettings): LuaItemStack {
	const key = getKey(settings);

	let stack = global.speakerTemplates.templates[key];

	if (!stack || !stack.valid) {
		stack = global.speakerTemplates.templates[key] = createTemplate(settings);
	}

	return stack;
}

function createTemplate(settings: TemplateSettings): LuaItemStack {
	const stack = findStackToUse();

	stack.set_stack('blueprint');

	stack.set_blueprint_entities([
		{
			entity_number: 1,
			name: 'musical-speaker-note-player',
			position: [0, 0],
			parameters: {
				allow_polyphony: false,
				playback_globally: settings.globalPlayback,
				playback_volume: settings.volume / 100.0
			},
			alert_parameters: {
				alert_message: '',
				show_alert: false,
				show_on_map: true
			}
		} as ProgrammableSpeakerBlueprintEntity
	]);

	return stack;
}

function findStackToUse(): LuaItemStack {
	const currentStore = global.speakerTemplates.currentStore;
	if (currentStore && currentStore.valid) {
		const inventory = currentStore.get_inventory(defines.inventory.chest)!;

		const [stack, ] = inventory.find_empty_stack();

		if (stack) {
			return stack;
		}
	}

	const newStore = game.get_surface('nauvis').create_entity({
		name: 'musical-speaker-template-store',
		force: game.forces['neutral'],
		position: { x: 0, y: 0 }
	});

	if (!newStore) {
		throw "Failed to create a new template store";
	}

	global.speakerTemplates.currentStore = newStore;

	return newStore.get_inventory(defines.inventory.chest)!.find_empty_stack()[0]!
}
