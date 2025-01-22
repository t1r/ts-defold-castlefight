import { gameState as gs } from '../modules/gameState';

interface action {
	pressed: boolean;
}

type message = {
	to?: vmath.vector3;
	enter?: boolean;
	other_id?: hash;
	group?: hash;
	other_group?: hash;
	own_group?: hash;
};

interface props {
	type: hash;
	currentAnimation?: string;
	currentAnimationProperty?: string;
}

const SPRITE_ID = '#sprite';
const ANIMATION_ATTACK = 'attack';
const ANIMATION_DAMAGED = 'damaged';
const ANIMATION_MOVING = 'moving';

const units = ['infantry'] as const;

const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;
type DIRECTIONS = (typeof directions)[number];
const ANIMATIONS = new Map<hash, Map<DIRECTIONS, hash>>();

units.forEach((unit) => {
	const dirs = new Map<DIRECTIONS, hash>();
	directions.forEach((dir) => {
		dirs.set(dir, hash(unit + '-' + dir));
	});
	ANIMATIONS.set(hash(unit), dirs);
});

go.property('type', hash('infantry'));

export function init(this: props): void {
	msg.post(SPRITE_ID, 'play_animation', {
		id: ANIMATIONS.get(this.type)?.get('n'),
	});
	msg.post('#selection', 'disable');
}

export function final(this: props): void {}

export function update(this: props, _dt: number): void {}

export function on_input(this: props, _actionId: hash, _action: action): void {}

export function on_message(
	this: props,
	messageId: hash,
	message: message,
	_sender: url,
): void {
	if (messageId === hash('moving') && message.to) {
		on_moving(this, message.to);
	} else if (messageId === hash('attack')) {
		on_attack(this);
	} else if (messageId === hash('damaged')) {
		on_damaged(this);
	} else if (messageId === hash('trigger_response')) {
		const currentId = go.get_id();
		gs.updateNearEnemy(
			gs.getUnitTeam1(),
			currentId,
			message.enter === true,
			message.other_id,
			message.own_group,
		);
	} else if (messageId !== hash('collision_response')) {
		pprint([messageId]);
	}
}

export function on_attack(ctx: props) {
	if (ctx.currentAnimation === ANIMATION_ATTACK) {
		return;
	}
	if (ctx.currentAnimationProperty !== undefined) {
		go.cancel_animations(ctx.currentAnimationProperty)
	}
	// go.animate(
	// 	SPRITE_ID,
	// 	'tint.w',
	// 	go.PLAYBACK_LOOP_PINGPONG,
	// 	0,
	// 	go.EASING_INOUTQUAD,
	// 	3,
	// );	
	go.animate(
		SPRITE_ID,
		'tint',
		go.PLAYBACK_LOOP_PINGPONG,
		vmath.vector4(0, 0.5, 0.8, 1),
		go.EASING_INOUTQUAD,
		1,
	);
	ctx.currentAnimation = ANIMATION_ATTACK;
}

export function on_damaged(ctx: props) {
	if (ctx.currentAnimation === ANIMATION_DAMAGED) {
		return;
	}
	if (ctx.currentAnimationProperty !== undefined) {
		go.cancel_animations(ctx.currentAnimationProperty)
	}
	go.animate(
		SPRITE_ID,
		'tint.w',
		go.PLAYBACK_LOOP_PINGPONG,
		0,
		go.EASING_INOUTQUAD,
		3,
	);
	ctx.currentAnimation = ANIMATION_DAMAGED;
}

export function on_moving(ctx: props, to: vmath.vector3) {
	if (ctx.currentAnimation === ANIMATION_MOVING) {
		return;
	}

	const from = go.get_position();
	const dir = vmath.normalize((to - from) as vmath.vector3);

	let dirType: DIRECTIONS = 's';
	if (dir.x < -0.8) {
		dirType = 'w';
	} else if (dir.x > 0.8) {
		dirType = 'e';
	} else if (dir.y > 0.8) {
		dirType = 'n';
	} else if (dir.y < -0.8) {
		dirType = 's';
	} else if (dir.x > 0.6 && dir.y > 0.6) {
		dirType = 'ne';
	} else if (dir.x > 0.6 && dir.y < -0.6) {
		dirType = 'se';
	} else if (dir.x < -0.6 && dir.y > 0.6) {
		dirType = 'nw';
	} else if (dir.x < -0.6 && dir.y < -0.6) {
		dirType = 'sw';
	}

	msg.post(SPRITE_ID, 'play_animation', {
		id: ANIMATIONS.get(ctx.type)?.get(dirType),
	});

	ctx.currentAnimation = ANIMATION_MOVING;
}
