interface action {
	pressed: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface props {}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');
	msg.post('#', 'use_camera_projection');
}
export function on_message(
	this: props,
	messageId: hash,
	_message: { other_id: hash },
	sender: url,
): void {
	if (messageId === hash('follow')) {
		go.set_parent('.', sender);
	} else if (messageId === hash('unfollow')) {
		go.set_parent('camera', undefined, true);
	}
}

export function on_input(this: props, actionId: hash, _action: action): void {
	if (actionId === hash('right')) {
		const position = go.get('.', 'position') as vmath.vector3;
		const newPosition = vmath.vector3(position.x + 50, position.y, position.z);
		go.animate(
			'.',
			'position',
			go.PLAYBACK_ONCE_FORWARD,
			newPosition,
			go.EASING_LINEAR,
			0.5,
			0,
		);
	} else if (actionId === hash('left')) {
		const position = go.get('.', 'position') as vmath.vector3;
		const newPosition = vmath.vector3(position.x - 50, position.y, position.z);
		go.animate(
			'.',
			'position',
			go.PLAYBACK_ONCE_FORWARD,
			newPosition,
			go.EASING_LINEAR,
			0.5,
			0,
		);
	}
}
