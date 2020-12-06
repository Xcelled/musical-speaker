// set this before we define our speaker
data.raw['programmable-speaker']['programmable-speaker'].fast_replaceable_group = 'programmable-speaker';

import "./prototypes/entity/musical-speaker";
import "./prototypes/item/musical-speaker";
import "./prototypes/recipe/musical-speaker";
import "./prototypes/entity/note-player";

data.raw.technology['circuit-network'].effects!.push(
	{
		type: "unlock-recipe",
		recipe: "musical-speaker"
	}
);
