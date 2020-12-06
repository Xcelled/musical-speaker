import MusicalSpeaker from './script/musical-speaker';
import Gui from './script/gui/gui';

import * as Event from '__stdlib__/stdlib/event/event';

declare global {
	interface GlobalType {
		speakers: Map<number, MusicalSpeaker>;
		gui: Map<number, Gui>;
	}
}

MusicalSpeaker.registerEvents();
Gui.registerEvents();

Event.on_init(() => {
	log('*************** frobbles')

	global.speakers = new Map();
	global.gui = new Map();
});

Event.on_configuration_changed(() => {
	for (const speaker of global.speakers.values()) {
		if (speaker) {
			speaker.initialize();
		}
	}
});
