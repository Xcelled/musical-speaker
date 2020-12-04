import MusicalSpeaker from './script/musical-speaker';
import Gui from './script/gui/gui';

import * as Event from '__stdlib__/stdlib/event/event';

declare global {
	interface GlobalType {
		speakers: Array<MusicalSpeaker | undefined>;
	}
}

MusicalSpeaker.registerEvents();

Event.on_init(() => global.speakers = []);

Event.on_configuration_changed(() => {
	for (const speaker of global.speakers) {
		if (speaker) {
			speaker.initialize();
		}
	}
});
