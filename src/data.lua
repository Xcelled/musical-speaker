-- set this before we define our speaker
data.raw['programmable-speaker']['programmable-speaker'].fast_replaceable_group = 'programmable-speaker'

require("prototypes.entity.musical_speaker")
require("prototypes.item.musical_speaker")
require("prototypes.recipe.musical_speaker")


table.insert(data.raw.technology['circuit-network'].effects,
	{
        type = "unlock-recipe",
        recipe = "musical-speaker"
    }
)
