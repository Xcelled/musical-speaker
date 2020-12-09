import * as MusicalSpeaker from './script/musical-speaker';
import * as Gui from './script/gui/gui';

import * as Event from '__stdlib__/stdlib/event/event';

declare global {
	interface GlobalType {
		speakers: {
			[key: number] : MusicalSpeaker.Type | undefined
		};
		gui: {
			[key: number] : Gui.Type | undefined
		}
	}
}

MusicalSpeaker.registerEvents();
Gui.registerEvents();

Event.on_init(() => {
	global.speakers = {};
	global.gui = {};
});

Event.on_configuration_changed(() => {
	for (const speakerId in global.speakers) {
		const speaker = global.speakers[speakerId];

		if (speaker) {
			MusicalSpeaker.reset(speaker);
		}
	}
});
