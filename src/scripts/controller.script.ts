import * as monarch from 'monarch.monarch';

interface props {
	isPaused: boolean
}

interface action {
	pressed: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface message {}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');
	msg.post('#', 'start');
	this.isPaused = false
}

export function update(this: props, _dt: number): void {
}

export function on_input(this: props, _actionId: hash, _action: action): void {
	if (_actionId === hash('pause') && _action.pressed) {
		pprint('----------------- pause -----------------');
		msg.post('/game#collectionproxy', 'set_time_step', { factor: this.isPaused ? 1 : 0, mode: 0 });
		this.isPaused = !this.isPaused
	}}

export function on_message(
	this: props,
	messageId: hash,
	_message: message,
	_sender: url,
): void {
	if (messageId === hash('start')) {
		monarch.show(hash('game'));
	}
}
