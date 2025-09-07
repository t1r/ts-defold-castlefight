import {
	ArmorType,
	AttackType,
	Unit,
	UnitAbstractFactory,
	UnitState,
	UnitTemplate,
} from '../types/unit';

export class EliteSoldierFactory implements UnitAbstractFactory {
	public createUnit(uid: hash, team: number, template: UnitTemplate): Unit {
		return {
			...template,
			id: uid,
			state: UnitState.MovingToEnemyBase,
			nearEnemy: [],
			enemyInAttackRange: [],
			team: team,
			elapsedAttackTime: 0,
			dir: vmath.vector3(0, -1, 0),
			remainingTimeToDelete: 2,
		};
	}

	public createUnitTemplate(): UnitTemplate {
		return {
			hp: 80,
			armorType: ArmorType.Heavy,
			attackType: AttackType.Normal,
			attackSpeed: 700,
			attack: 15,
			unitType: 'elite-soldier',
			armor: 1,
		};
	}
}
