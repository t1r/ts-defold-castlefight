export enum UnitState {
	MovingToEnemyBase,
	MoveToEnemy,
	Attack,
	Dead,
	Idle,
}

export enum ArmorType {
	Unarmored,
	Light,
	Medium,
	Heavy,
	Fortified,
	Hero,
}

export enum AttackType {
	Normal,
	Piercing,
	Siege,
	Magic,
	Chaos,
	Spells,
	Hero,
}

export const unitTypes = ['infantry', 'elite-soldier'] as const;
// export type UnitType = 'infantry' | 'elite-soldier';
export type UnitType = (typeof unitTypes)[number];

export interface Unit {
	hp: number;
	armorType: ArmorType;
	attackType: AttackType;
	attackSpeed: number;
	attack: number;

	// State
	id: hash;
	state: UnitState;
	nearEnemy: hash[];
	enemyInAttackRange: hash[];
	team: number;
	elapsedAttackTime: number;
	dir: vmath.vector3;
	remainingTimeToDelete: number;
}
