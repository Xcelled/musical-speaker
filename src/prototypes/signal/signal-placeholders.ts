import { SIGNAL_PLACEHOLDER_NAME_PREFIX } from '../../script/signal-escaping';

// Copy virtual logic signals, since they can't be set on a combinator

data.extend([
	makeVirtualSignalPlaceholder(data.raw["virtual-signal"]['signal-anything']),
	makeVirtualSignalPlaceholder(data.raw["virtual-signal"]['signal-each']),
	makeVirtualSignalPlaceholder(data.raw["virtual-signal"]['signal-everything']),
])

function makeVirtualSignalPlaceholder(base: PrototypeVirtualSignal): PrototypeVirtualSignal {
	const newSignal = table.deepcopy(base);

	newSignal.name = SIGNAL_PLACEHOLDER_NAME_PREFIX + base.name;
	newSignal.order = 'zzz[do-not-use]';
	newSignal.icon = '__core__/graphics/empty.png';
	newSignal.icon_size = 1;
	newSignal.icon_mipmaps = 0;

	return newSignal;
}
