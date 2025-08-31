import { START_GAME_HASH } from '../modules/const';

interface props {
	buttonStart: node;
	buttonSettings: node;
	buttonExit: node;
}

interface action {
	released: boolean;
	x: number;
	y: number;
}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');

	this.buttonStart = gui.get_node('start');
	this.buttonSettings = gui.get_node('settings');
	this.buttonExit = gui.get_node('exit');
}

export function on_message(
	this: props,
	_messageId: hash,
	_message: { score: number },
	_sender: url,
): void {}

export function on_input(this: props, actionId: hash, action: action): void {
	if (actionId === hash('touch') && action.released) {
		if (gui.pick_node(this.buttonStart, action.x, action.y)) {
			// pprint(['start']);
			msg.post('controller:/controller#controller', START_GAME_HASH);
		} else if (gui.pick_node(this.buttonSettings, action.x, action.y)) {
			pprint(['TODO settings']);
		} else if (gui.pick_node(this.buttonExit, action.x, action.y)) {
			msg.post('@system:', 'exit', { code: 0 });
		}
	}
}
