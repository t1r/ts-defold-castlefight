import { ArmorType, AttackType, Unit, UnitState } from '../types/unit';

export function createInfantry(unitId: hash, team: number): Unit {
	return {
		id: unitId,
		state: UnitState.MovingToEnemyBase,
		nearEnemy: [],
		enemyInAttackRange: [],
		team: team,
		elapsedAttackTime: 0,

		hp: 60,
		armorType: ArmorType.Medium,
		attackType: AttackType.Normal,
		attackSpeed: 600,
		attack: 10,
		dir: vmath.vector3(0, -1, 0),
		remainingTimeToDelete: 2,
	};
}
