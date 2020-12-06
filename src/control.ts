import * as MusicalSpeaker from './script/musical-speaker';
import * as Gui from './script/gui/gui';

import * as Event from '__stdlib__/stdlib/event/event';

declare global {
	interface GlobalType {
		speakers: Table<number, MusicalSpeaker.Type>;
		gui: Table<number, Gui.Type>;
	}
}

MusicalSpeaker.registerEvents();
Gui.registerEvents();

Event.on_init(() => {
	log('*************** frobbles')

	global.speakers = new Table() as any;
	global.gui = new Table() as any;
});

Event.on_configuration_changed(() => {
	for (const speaker of global.speakers as IterTable<MusicalSpeaker.Type>) {
		if (speaker) {
			MusicalSpeaker.initialize(speaker);
		}
	}
});
