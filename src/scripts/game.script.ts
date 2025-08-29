import * as monarch from 'monarch.monarch';
import { TEAM_1, TEAM_2 } from '../modules/const';
import { gameState as gs } from '../modules/gameState';
import { getDamageMultiplier } from '../modules/logic/damage';
import { Building } from '../modules/types/building';
import { ArmorType, Unit, UnitState } from '../modules/types/unit';

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
	// msg.post('/dumb', 'disable');
}

export function update(this: props, dt: number): void {
	// pprint(["update", dt])
	handleUpdateUnits(dt);
	handleUpdateBuildings(dt);
}

export function on_input(this: props, actionId: hash, action: action): void {
	if (actionId === hash('touch') && action.pressed) {
		pprint('----------------- touch -----------------');
		pprint([
			gs.units.getAll().map((e) => ({ unit: e, pos: go.get_position(e.id) })),
		]);
	} else if (actionId === hash('upgrade') && action.pressed) {
		pprint('----------------- upgrade -----------------');
		// TODO
		// msg.post('/dumb', 'enable');
		monarch.show(hash('upgrade'));
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

/* -------------- TODO move to module --------------- */
function handleUpdateUnits(dt: number) {
	gs.units.updateInRange((id) => go.get_position(id));
	const units = gs.units.getAll();

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
	const buildings = gs.buildings.getAll();
	for (let i = 0; i < buildings.length; i++) {
		const building = buildings[i];
		if (building.timeToRespawnUnit <= 0 && !gs.units.getByTeam(building.team)) {
			spawnUnit(building.team);
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
		team: TEAM_1,
		id: hash('buildingTeam1'),
		timeToRespawnUnit: 0,
	};
	gs.buildings.setByTeam(TEAM_1, building1);

	const building2: Building = {
		hp: 500,
		armorType: ArmorType.Heavy,
		originTimeToRespawnUnit: 10,
		team: TEAM_2,
		id: hash('buildingTeam2'),
		timeToRespawnUnit: 0,
	};
	gs.buildings.setByTeam(TEAM_2, building2);
}

function spawnUnit(team: number) {
	const position = team === TEAM_1 ? BASE_TEAM_1 : BASE_TEAM_2;
	const unitFactory = gs.progress.getByTeam(team)?.factory;
	if (!unitFactory) {
		return;
	}

	const template = unitFactory.createUnitTemplate();

	const props = {
		type: hash(template.unitType),
	};
	const id = factory.create('/factories#unit', position, undefined, props);
	const unit = unitFactory.createUnit(id, team, template);
	gs.units.setByTeam(team, unit);
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
	const enemy = gs.units
		.getAll()
		.find((value) => value.id === element.enemyInAttackRange[0]);

	if (enemy) {
		if (element.elapsedAttackTime < element.attackSpeed) {
			element.elapsedAttackTime += dt * 1000;
		} else {
			element.elapsedAttackTime = 0;
			enemy.hp =
				enemy.hp -
				element.attack *
					getDamageMultiplier(enemy.armorType, element.attackType);
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
		gs.units.removeByHash(element.id);
	} else {
		element.remainingTimeToDelete -= dt;
	}
}
