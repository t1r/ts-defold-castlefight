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
export type UnitType = (typeof unitTypes)[number];

export interface UnitTemplate {
	hp: number;
	readonly armorType: ArmorType;
	readonly attackType: AttackType;
	readonly attackSpeed: number;
	readonly attack: number;
	readonly unitType: UnitType;
	readonly armor: number;
}

export interface UnitCharacteristics {
	id: hash;
	state: UnitState;
	nearEnemy: hash[];
	enemyInAttackRange: hash[];
	team: number;
	elapsedAttackTime: number;
	dir: vmath.vector3;
	remainingTimeToDelete: number;
}

export interface Unit extends UnitTemplate, UnitCharacteristics {}

export interface UnitAbstractFactory {
	createUnit(uid: hash, team: number, template: UnitTemplate): Unit;
	createUnitTemplate(): UnitTemplate;
}
