import * as MusicalSpeaker from './script/musical-speaker';
import * as Gui from './script/gui/gui';

import * as Event from '__stdlib__/stdlib/event/event';

declare global {
	interface Globals {
		speakers: {
			[key: number] : MusicalSpeaker.Type | undefined
		};
		gui: {
			[key: number] : Gui.Type | undefined
		},

		speakerTemplates: {
			stores: {
				[key: number]: LuaEntity
			},

			currentStore: LuaEntity | undefined,
	
			templates: {
				[key: string]: LuaItemStack
			},
		}
	}
}

MusicalSpeaker.registerEvents();
Gui.registerEvents();

Event.on_init(() => {
	global.speakers = {};
	global.gui = {};
	global.speakerTemplates = {
		stores: {},
		currentStore: undefined,
		templates: {}
	};
});

Event.on_configuration_changed(() => {
	for (const speakerId in global.speakers) {
		const speaker = global.speakers[speakerId];

		if (speaker) {
			MusicalSpeaker.reset(speaker);
		}
	}
});
