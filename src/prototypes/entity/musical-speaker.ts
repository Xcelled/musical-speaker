const speaker = table.deepcopy(data.raw['constant-combinator']['constant-combinator']);

speaker.name = 'musical-speaker';
speaker.minable!.result = 'musical-speaker';
speaker.circuit_wire_max_distance = 1000;

data.extend([speaker]);
