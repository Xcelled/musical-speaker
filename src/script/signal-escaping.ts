export const SIGNAL_PLACEHOLDER_NAME_PREFIX = "musical-speaker-signal-placeholder-";

export function escapeSignal(signal: SignalID): SignalID {
	
	switch (signal.name) {
		case 'signal-anything':
		case 'signal-each':
		case 'signal-everything':
			return { ...signal, name: SIGNAL_PLACEHOLDER_NAME_PREFIX + signal.name };
		default:
			return signal;
	}
}

export function unescapeSignal(signal?: SignalID): SignalID | undefined {
	if (signal && signal.name && signal.name.startsWith(SIGNAL_PLACEHOLDER_NAME_PREFIX)) {
		return { ...signal, name: signal.name.substring(SIGNAL_PLACEHOLDER_NAME_PREFIX.length) }
	} else {
		return signal;
	}
}
 