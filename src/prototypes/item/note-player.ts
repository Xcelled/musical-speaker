const notePlayerItem: PrototypeItem = table.deepcopy(data.raw.item['programmable-speaker']);

notePlayerItem.name = 'musical-speaker-note-player-dummy';
notePlayerItem.place_result = 'musical-speaker-note-player';

notePlayerItem.flags = ['hidden'];

data.extend([notePlayerItem]);
