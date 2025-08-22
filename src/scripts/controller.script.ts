import * as monarch from 'monarch.monarch';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface props {}

interface action {
	pressed: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface message {}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');
	msg.post('#', 'start');
}

export function update(this: props, _dt: number): void {}

export function on_input(this: props, _actionId: hash, _action: action): void {}

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
