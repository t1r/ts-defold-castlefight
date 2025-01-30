import { gameState as gs, Unit, UnitState } from '../modules/gameState';

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
	unitData?: Unit;
	currentAnimation?: string;
	currentAnimationProperty?: string;
}

const SPRITE_ID = '#sprite';
const ANIMATION_ATTACK = 'attack';
const ANIMATION_DAMAGED = 'damaged';
const ANIMATION_MOVING = 'moving';
const ANIMATION_DEAD = 'dead';

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

export function update(this: props, _dt: number): void {
	const unit = gs.getUnits().find((element) => element.id === go.get_id());
	this.unitData = unit;

	const state = this.unitData?.state;
	if (state === UnitState.Dead) {
		on_dead(this);
	} else if (state === UnitState.Attack) {
		on_attack(this);
	} else if (
		state === UnitState.MoveToEnemy ||
		state === UnitState.MovingToEnemyBase
	) {
		on_moving(this, unit);
	}
	// TODO damaged
	// on_damaged(this);
}

export function on_input(this: props, _actionId: hash, _action: action): void {}

export function on_message(
	this: props,
	messageId: hash,
	message: message,
	_sender: url,
): void {
	if (messageId === hash('trigger_response')) {
		const currentId = go.get_id();
		gs.updateNearEnemy(
			gs.getUnits(),
			currentId,
			message.enter === true,
			message.other_id,
			message.own_group,
		);
		// pprint(["TRIGGER ", message])
	} else if (messageId !== hash('collision_response')) {
		// pprint([messageId]);		
	}
}

export function on_attack(ctx: props) {
	if (ctx.currentAnimation === ANIMATION_ATTACK) {
		return;
	}
	resetAnimation();

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
	ctx.currentAnimationProperty = 'tint';
	ctx.currentAnimation = ANIMATION_ATTACK;
}

export function on_damaged(ctx: props) {
	if (ctx.currentAnimation === ANIMATION_DAMAGED) {
		return;
	}
	resetAnimation();

	go.animate(
		SPRITE_ID,
		'tint.w',
		go.PLAYBACK_LOOP_PINGPONG,
		0,
		go.EASING_INOUTQUAD,
		3,
	);
	ctx.currentAnimationProperty = 'tint.w';
	ctx.currentAnimation = ANIMATION_DAMAGED;
}

export function on_dead(ctx: props) {
	if (ctx.currentAnimation === ANIMATION_DEAD) {
		return;
	}
	resetAnimation();

	go.animate(
		SPRITE_ID,
		'tint.w',
		go.PLAYBACK_LOOP_FORWARD,
		0.1,
		go.EASING_INOUTQUAD,
		5,
		0,
		() => {
			// go.delete(go.get_id());
		},
	);
	// TODO timing and remove unit from
	// timer.delay(5, false, () => {
	// 	go.delete(go.get_id());
	// });
	ctx.currentAnimationProperty = 'tint.w';
	ctx.currentAnimation = ANIMATION_DEAD;
}

export function on_moving(ctx: props, unit?: Unit) {
	if (ctx.currentAnimation === ANIMATION_MOVING) {
		return;
	}
	resetAnimation();

	const dir = unit?.dir ?? vmath.vector3(0, -1, 0);

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

	ctx.currentAnimationProperty = undefined;
	ctx.currentAnimation = ANIMATION_MOVING;
}

function resetAnimation() {
	go.cancel_animations(SPRITE_ID);
	go.set(SPRITE_ID, 'tint', vmath.vector4(1, 1, 1, 1));
}
