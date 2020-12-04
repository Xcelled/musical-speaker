const speaker = table.deepcopy(data.raw['constant-combinator']['constant-combinator']);

speaker.name = 'musical-speaker';
speaker.minable!.result = 'musical-speaker';

data.extend([speaker]);
