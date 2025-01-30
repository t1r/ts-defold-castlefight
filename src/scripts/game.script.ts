import {
	ArmorType,
	AttackType,
	Unit,
	UnitState,
	gameState as gs,
} from '../modules/gameState';
import { removeItemsWithName } from '../modules/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface props {}

interface action {
	pressed: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface message {}

const BASE_TEAM_1 = vmath.vector3(100, 320, 1);
// const BASE_TEAM_1 = vmath.vector3(0, 0, 1);
const BASE_TEAM_2 = vmath.vector3(840, 320, 1);

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');

	create_units(this);
}

export function update(this: props, dt: number): void {
	const units = gs.getUnits();
	units.forEach((element) => {
		if (element.hp <= 0) {
			element.state = UnitState.Dead;
		} else if (isAliveEnemyInRange(units, element.inAttackRange)) {
			element.state = UnitState.Attack;
		} else if (isAliveEnemyInRange(units, element.nearEnemy)) {
			element.state = UnitState.MoveToEnemy;
		} else {
			element.state = UnitState.MovingToEnemyBase;
		}

		if (element.state === UnitState.MoveToEnemy) {
			movingToEnemy(element, dt);
		} else if (element.state === UnitState.MovingToEnemyBase) {
			movingToEnemyBase(element, dt);
		} else if (element.state === UnitState.Attack) {
			handleAttack(element, dt);
		} else if (element.state === UnitState.Dead) {
			handleDead(element, dt)
		}
	});
}

export function on_input(this: props, _actionId: hash, action: action): void {
	if (_actionId === hash('touch') && action.pressed) {
		pprint('-----------------');
		// pprint([gs.unitsTeam1, gs.unitsTeam2]);
		// go.delete('/instance0')
		pprint([gs.getUnits()]);
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
	const startPositionTeam1Unit1 = BASE_TEAM_1;
	const startPositionTeam2Unit1 = BASE_TEAM_2;
	const startPositionTeam2Unit2 = BASE_TEAM_2;

	const id1 = factory.create(
		'/factories#unit',
		startPositionTeam1Unit1,
		undefined,
		'infantry',
	);
	const unit1: Unit = {
		id: id1,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		inAttackRange: [],
		team: 1,
		elapsedAttackTime: 0,

		hp: 60,
		armorType: ArmorType.Normal,
		attackType: AttackType.Normal,
		attackSpeed: 600,
		attack: 11,
		dir: vmath.vector3(0, -1, 0),
		remainingTimeToDelete: 4,
	};

	const id2 = factory.create(
		'/factories#unit',
		startPositionTeam2Unit1,
		undefined,
		'infantry',
	);
	const unit2: Unit = {
		id: id2,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		inAttackRange: [],
		team: 2,
		elapsedAttackTime: 0,

		hp: 60,
		armorType: ArmorType.Normal,
		attackType: AttackType.Normal,
		attackSpeed: 600,
		attack: 12,
		dir: vmath.vector3(0, -1, 0),
		remainingTimeToDelete: 4,
	};

	// const id4 = factory.create('/factories#unit', startPositionTeam2Unit2, undefined, 'infantry');
	// const unit4: Unit = {
	// 	id: id4,
	// 	state: UnitState.MovingToEnemyBase,
	// 	nearEnemy: [],
	// 	inAttackRange: [],
	// 	team: 2,
	// 	elapsedAttackTime: 0,

	// 	hp: 60,
	// 	armorType: ArmorType.Normal,
	// 	attackType: AttackType.Normal,
	// 	attackSpeed: 600,
	// 	attack: 10,
	// 	dir: vmath.vector3(0, -1, 0),
	//	remainingTimeToDelete: 4,
	// };

	gs.addUnit(unit1);
	gs.addUnit(unit2);
	// gs.addUnitToTeam1(unit4);
}

function movingToEnemy(element: Unit, dt: number): void {
	const target = go.get_position(element.nearEnemy[0]);
	movingTo(element, dt, target);
}

function movingToEnemyBase(element: Unit, dt: number): void {
	const target = resolveTargetBaseCoordinate(element);
	movingTo(element, dt, target);
}

function movingTo(element: Unit, dt: number, target: vmath.vector3): void {
	const position = go.get_position(element.id);
	const diffPos = (target - position) as vmath.vector3;
	const dir = vmath.normalize(
		vmath.length(diffPos) !== 0 ? diffPos : vmath.vector3(0, 1, 0),
	);
	const newPosition = (position + dir * 40 * dt) as vmath.vector3;
	element.dir = dir;
	go.set_position(newPosition, element.id);
}

function handleAttack(element: Unit, dt: number) {
	const enemy = gs
		.getUnits()
		.find((value) => value.id === element.nearEnemy[0]);

	if (enemy) {
		if (element.elapsedAttackTime < element.attackSpeed) {
			element.elapsedAttackTime = element.elapsedAttackTime + dt * 1000;
		} else {
			element.elapsedAttackTime = 0;
			enemy.hp = enemy.hp - element.attack;
		}
	}
}

function isAliveEnemyInRange(units: Unit[], inRange: hash[]): boolean {
	if (inRange.length === 0) {
		return false;
	}

	return inRange.some((nearId) => {
		return (
			units.find(
				(unit) => unit.id === nearId && unit.state !== UnitState.Dead,
			) !== undefined
		);
	});
}

function resolveTargetBaseCoordinate(element: Unit): vmath.vector3 {
	return element.team === 1 ? BASE_TEAM_2 : BASE_TEAM_1;
}

function handleDead(element: Unit, dt: number) {
	const isExist = element === null || go.exists(element.id) as boolean
	if (!isExist) {
		return
	}
	if (element.remainingTimeToDelete <= 0) {
		go.delete(element.id)
		gs.getUnits().forEach((unit)=> {
			removeItemsWithName(unit.nearEnemy, element.id)
			removeItemsWithName(unit.inAttackRange, element.id)
		})
		gs.removeUnit(element.id)
	} else {
		element.remainingTimeToDelete -= dt
	}
}