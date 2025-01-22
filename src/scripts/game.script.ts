import { Unit, UnitState, gameState as gs } from '../modules/gameState';

interface props {
	// unitsTeam1: Unit[],
	// unitsTeam2: Unit[],
}

interface action {
	pressed: boolean;
}

interface message {}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');

	const pos3 = vmath.vector3(800, 400, 1);
	const pos4 = vmath.vector3(800, 400, 1);
	const compare1 = vmath.vector3(0, 0, 0) === vmath.vector3(0, 0, 0);
	pprint([pos3 - pos4, compare1, vmath.length(vmath.vector3(0, 0, 0))]);

	create_units(this);

	pprint([gs.getUnitTeam1()]);
}

export function update(this: props, dt: number): void {
	gs.getUnitTeam1().forEach((element) => {
		// pprint(['-------- inAttackRange.length: ', element.inAttackRange])
		if (element.team === 2) {
			element.state = UnitState.Idle;
		} else if (element.inAttackRange.length !== 0) {
			element.state = UnitState.Attack;
		} else if (element.nearEnemy.length !== 0) {
			element.state = UnitState.MoveToEnemy;
		} else {
			element.state = UnitState.MovingToEnemyBase;
		}

		pprint([
			'- STATE - state',
			element.state,
			element.id,
			element.inAttackRange.length,
			element.inAttackRange,
			element.nearEnemy.length,
			element.nearEnemy,
		]);

		if (element.state === UnitState.MoveToEnemy) {
			movingToEnemy(element, dt);
		} else if (element.state === UnitState.MovingToEnemyBase) {
			movingToEnemyBase(element, dt);
		} else if (element.state === UnitState.Attack) {
			msg.post(element.id, 'attack');

			msg.post(element.nearEnemy[0], 'damaged');
		}
	});
}

export function on_input(this: props, _actionId: hash, action: action): void {
	if (_actionId === hash('touch') && action.pressed) {
		pprint('-----------------');
		// pprint([gs.unitsTeam1, gs.unitsTeam2]);
		// go.delete('/instance0')
		pprint([gs.getUnitTeam1()]);
	}
}

export function on_message(
	this: props,
	_messageId: hash,
	_message: message,
	_sender: url,
): void {
	pprint([_messageId, _sender]);
}

export function create_units(_ctx: props) {
	const pos1 = vmath.vector3(100, 100, 1);
	const pos3 = vmath.vector3(900, 400, 1);
	const pos4 = vmath.vector3(600, 200, 1);

	const id1 = factory.create('/factories#unit', pos1, undefined, 'infantry');
	const unit1 = {
		id: id1,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		inAttackRange: [],
		team: 1,
	};

	const id2 = factory.create('/factories#unit', pos3, undefined, 'infantry');
	const unit2 = {
		id: id2,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		inAttackRange: [],
		team: 2,
	};

	const id4 = factory.create('/factories#unit', pos4, undefined, 'infantry');
	const unit4 = {
		id: id4,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		inAttackRange: [],
		team: 2,
	};

	gs.addUnitToTeam1(unit1);
	gs.addUnitToTeam1(unit2);
	gs.addUnitToTeam1(unit4);
}

function movingToEnemy(element: Unit, dt: number): void {
	const target = go.get_position(element.nearEnemy[0]);
	movingTo(element, dt, target);
}

function movingToEnemyBase(element: Unit, dt: number): void {
	const target = vmath.vector3(800, 400, 1);
	movingTo(element, dt, target);
}

function movingTo(element: Unit, dt: number, target: vmath.vector3): void {
	const position = go.get_position(element.id);
	const diffPos = (target - position) as vmath.vector3;
	const dir = vmath.normalize(
		vmath.length(diffPos) !== 0 ? diffPos : vmath.vector3(0, 1, 0),
	);
	const newPosition = (position + dir * 40 * dt) as vmath.vector3;
	msg.post(element.id, 'moving', { to: newPosition });
	go.set_position(newPosition, element.id);
}

function walk_path(paths: vmath.vector3[], unitId: hash) {
	const pos = go.get_position(unitId);
	const step = paths.pop();
	if (step) {
		const to = (pos + step) as vmath.vector3;
		to.z = 1;
		msg.post(unitId, 'moving', { to: to });
		go.animate(
			unitId,
			'position',
			go.PLAYBACK_ONCE_FORWARD,
			to,
			go.EASING_LINEAR,
			1 / 20,
			0,
			() => {
				walk_path(paths, unitId);
			},
		);
	} else {
		msg.post(unitId, 'damaged');
	}
}
