import { ArmorType, AttackType, Unit, UnitState } from './../gameState';

export function createEliteSoldier(unitId: hash, team: number): Unit {
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
