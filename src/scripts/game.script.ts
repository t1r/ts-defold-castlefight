import { createUnit } from '../modules/factory';
import {
	ArmorType,
	Building,
	Unit,
	UnitState,
	UnitType,
	gameState as gs,
} from '../modules/gameState';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface props {}

interface action {
	pressed: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface message {}

const BASE_TEAM_1 = vmath.vector3(100, 320, 1);
const BASE_TEAM_2 = vmath.vector3(840, 320, 1);

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');

	spawnBuildings();
}

export function update(this: props, dt: number): void {
	handleUpdateUnits(dt);
	handleUpdateBuildings(dt);
}

export function on_input(this: props, _actionId: hash, action: action): void {
	if (_actionId === hash('touch') && action.pressed) {
		pprint('----------------- touch -----------------');
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

function handleUpdateUnits(dt: number) {
	const units = gs.getUnits();

	for (let i = 0; i < units.length; i++) {
		const unit = units[i];

		if (unit.hp <= 0) {
			unit.state = UnitState.Dead;
		} else if (isAliveEnemyInRange(units, unit.enemyInAttackRange)) {
			unit.state = UnitState.Attack;
		} else if (isAliveEnemyInRange(units, unit.nearEnemy)) {
			unit.state = UnitState.MoveToEnemy;
		} else {
			unit.state = UnitState.MovingToEnemyBase;
		}

		if (unit.state === UnitState.MoveToEnemy) {
			movingToEnemy(unit, dt);
		} else if (unit.state === UnitState.MovingToEnemyBase) {
			movingToEnemyBase(unit, dt);
		} else if (unit.state === UnitState.Attack) {
			handleAttack(unit, dt);
		} else if (unit.state === UnitState.Dead) {
			handleDead(unit, dt);
		}
	}
}

function handleUpdateBuildings(dt: number) {
	const buildings = gs.getBuildings();
	for (let i = 0; i < buildings.length; i++) {
		const building = buildings[i];
		if (building.timeToRespawnUnit <= 0) {
			spawnUnit(building.team, building.unitType);
			building.timeToRespawnUnit = building.originTimeToRespawnUnit;
		} else {
			building.timeToRespawnUnit -= dt;
		}
	}
}

function spawnBuildings() {
	const building1: Building = {
		hp: 500,
		armorType: ArmorType.Heavy,
		originTimeToRespawnUnit: 10,
		unitType: 'infantry',
		team: 1,
		id: hash('buildingTeam1'),
		timeToRespawnUnit: 0,
	};
	gs.addBuilding(building1);

	const building2: Building = {
		hp: 500,
		armorType: ArmorType.Heavy,
		originTimeToRespawnUnit: 10,
		unitType: 'elite-soldier',
		team: 2,
		id: hash('buildingTeam2'),
		timeToRespawnUnit: 0,
	};
	gs.addBuilding(building2);
}

function spawnUnit(team: number, unitType: UnitType) {
	const position = team === 1 ? BASE_TEAM_1 : BASE_TEAM_2;

	const props = {
		type: hash(unitType),
	};
	const id = factory.create('/factories#unit', position, undefined, props);
	const unit = createUnit(id, team, unitType);
	gs.addUnit(unit);
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
			element.elapsedAttackTime += dt * 1000;
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
	const isExist = element === null || (go.exists(element.id) as boolean);
	if (!isExist) {
		return;
	}
	if (element.remainingTimeToDelete <= 0) {
		go.delete(element.id);
		gs.removeUnit(element.id);
	} else {
		element.remainingTimeToDelete -= dt;
	}
}
