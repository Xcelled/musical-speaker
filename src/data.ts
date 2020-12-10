// set this before we define our speaker
data.raw['programmable-speaker']['programmable-speaker'].fast_replaceable_group = 'programmable-speaker';

import "./prototypes/entity/musical-speaker";
import "./prototypes/entity/note-player";
import "./prototypes/entity/template-store";

import "./prototypes/item/musical-speaker";
import "./prototypes/item/note-player";

import "./prototypes/recipe/musical-speaker";

data.raw.technology['circuit-network'].effects!.push(
	{
		type: "unlock-recipe",
		recipe: "musical-speaker"
	}
);
