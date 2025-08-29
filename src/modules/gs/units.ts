import { ATTACK_RANGE, NEAR_RANGE, TEAM_1, TEAM_2 } from '../const';
import { Unit } from '../types/unit';
import { removeItemsWithName } from '../utils';

export class GsUnits {
	private units: Map<number, Unit> = new Map();

	public getByTeam(team: number): Unit | undefined {
		return this.units.get(team);
	}

	public setByTeam(team: number, unit: Unit) {
		this.units.set(team, unit);
	}

	public removeByHash(id: hash) {
		for (const [key, value] of this.units.entries()) {
			removeItemsWithName(value.nearEnemy, id);
			removeItemsWithName(value.enemyInAttackRange, id);
			if (value.id === id) {
				this.units.delete(key);
			}
		}
	}

	public getAll(): Unit[] {
		return Array.from(this.units.values());
	}

	/**
	 * TODO rework
	 */
	public updateInRange(getPosition: (id: hash) => vmath.vector3) {
		const unit1 = this.units.get(TEAM_1);
		const unit2 = this.units.get(TEAM_2);

		if (unit1) {
			unit1.enemyInAttackRange = [];
			unit1.nearEnemy = [];
		}

		if (unit2) {
			unit2.enemyInAttackRange = [];
			unit2.nearEnemy = [];
		}

		if (unit1 && unit2) {
			const pos1 = getPosition(unit1.id);
			const pos2 = getPosition(unit2.id);

			const len = vmath.length((pos1 - pos2) as vmath.vector3);

			if (len <= ATTACK_RANGE) {
				unit1.enemyInAttackRange = [unit2.id];
				unit2.enemyInAttackRange = [unit1.id];
			} else if (len <= NEAR_RANGE) {
				unit1.nearEnemy = [unit2.id];
				unit2.nearEnemy = [unit1.id];
			}
		}
	}
}
