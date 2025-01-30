import { ArmorType, AttackType, Unit, UnitState, UnitType } from './gameState';

export function createUnit(
	unitId: hash,
	team: number,
	unitType: UnitType,
): Unit {
	if (unitType === 'elite-soldier') {
		return createEliteSoldier(unitId, team);
	} else {
		return createInfantry(unitId, team);
	}
}

function createInfantry(unitId: hash, team: number): Unit {
	return {
		id: unitId,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		enemyInAttackRange: [],
		team: team,
		elapsedAttackTime: 0,

		hp: 60,
		armorType: ArmorType.Normal,
		attackType: AttackType.Normal,
		attackSpeed: 600,
		attack: 10,
		dir: vmath.vector3(0, -1, 0),
		remainingTimeToDelete: 2,
	};
}

function createEliteSoldier(unitId: hash, team: number): Unit {
	return {
		id: unitId,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		enemyInAttackRange: [],
		team: team,
		elapsedAttackTime: 0,

		hp: 80,
		armorType: ArmorType.Heavy,
		attackType: AttackType.Normal,
		attackSpeed: 700,
		attack: 15,
		dir: vmath.vector3(0, -1, 0),
		remainingTimeToDelete: 2,
	};
}
