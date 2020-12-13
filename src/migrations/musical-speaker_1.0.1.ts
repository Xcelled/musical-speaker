import * as MusicalSpeaker from '../script/musical-speaker';

if (global.speakers) {
	for (const speakerId in global.speakers) {
		const speaker = global.speakers[speakerId];

		if (speaker) {
			if (speaker.notePlayer && 'name' in speaker.notePlayer) {
				(speaker.notePlayer as unknown as LuaEntity).destroy()
				speaker.notePlayer = undefined
			}

			speaker.controlBehavior = speaker.combinator.get_or_create_control_behavior() as LuaConstantCombinatorControlBehavior;
			MusicalSpeaker.reset(speaker);
		}
	}
}
