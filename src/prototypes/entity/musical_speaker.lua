local speaker = table.deepcopy(data.raw['constant-combinator']['constant-combinator'])

speaker.name = 'musical-speaker'
speaker.minable.result = 'musical-speaker'
speaker.fast_replacable_group = nil

data:extend({speaker})
