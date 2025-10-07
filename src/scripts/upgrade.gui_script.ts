interface props {
	button1: node;
	button2: node;
}

interface action {
	released: boolean;
	x: number;
	y: number;
}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');

	this.button1 = gui.get_node('box');
	this.button2 = gui.get_node('box1');
}

export function on_message(
	this: props,
	_messageId: hash,
	_message: { score: number },
	_sender: url,
): void {}

export function on_input(this: props, actionId: hash, action: action): void {
	if (actionId === hash('touch') && action.released) {
		if (gui.pick_node(this.button1, action.x, action.y)) {
			pprint(['button 1']);
			msg.post('controller:/controller#controller', "azaza")
		} else if (gui.pick_node(this.button2, action.x, action.y)) {
			pprint(['button 2']);
		}
	}
}
