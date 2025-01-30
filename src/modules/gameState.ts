import { removeItemsWithName } from './utils';

export enum UnitState {
	MovingToEnemyBase,
	MoveToEnemy,
	Attack,
	Dead,
	Idle,
}

export enum ArmorType {
	Normal,
	NotArmored,
	Heavy,
}

export enum AttackType {
	Normal,
	Magic,
	Pierce,
}

export const unitTypes = ['infantry', 'elite-soldier'] as const;
// export type UnitType = 'infantry' | 'elite-soldier';
export type UnitType = typeof unitTypes[number];

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

export interface Building {
	hp: number;
	armorType: ArmorType;
	originTimeToRespawnUnit: number;
	unitType: UnitType;

	// State
	id: hash;
	team: number;
	// state: BuildingState;
	timeToRespawnUnit: number;
}

const FINDER_HASH = hash('finder');
const ATTACK_RANGE_HASH = hash('attack_range');

const units: Unit[] = [];
const buildings: Building[] = [];

function updateNearEnemy(
	unitsTeam: Unit[],
	currentId: hash,
	isEnter: boolean,
	otherId?: hash,
	ownGroup?: hash,
) {
	const element = unitsTeam.find((value) => value.id === currentId);
	const otherElement = unitsTeam.find((value) => value.id === otherId);
	const isFinder = (ownGroup && ownGroup === FINDER_HASH) === true;
	const isAttackRange = (ownGroup && ownGroup === ATTACK_RANGE_HASH) === true;

	if (
		element &&
		otherId &&
		otherElement &&
		otherElement.team !== element.team
	) {
		if (isFinder) {
			handleAddNearEnemy(isEnter, element, otherId);
		} else if (isAttackRange) {
			handleAddInAttackRange(isEnter, element, otherId);
		}
	}
}

function getUnits(): Unit[] {
	return units;
}

function addUnit(team: Unit) {
	units.push(team);
}

function getBuildings(): Building[] {
	return buildings;
}

function addBuilding(building: Building) {
	buildings.push(building);
}

function removeUnit(otherId: hash) {
	for (let i = 0; i < units.length; i++) {
		const unit = units[i];
		removeItemsWithName(unit.nearEnemy, otherId);
		removeItemsWithName(unit.enemyInAttackRange, otherId);
		if (unit.id === otherId) {
			units.splice(i--, 1);
		}
	}
}

function handleAddNearEnemy(isEnter: boolean, element: Unit, otherId: hash) {
	if (isEnter === true) {
		element.nearEnemy.push(otherId);
	} else {
		const index = element.nearEnemy.findIndex((id) => id === otherId);
		element.nearEnemy.splice(index, 1);
	}
}

function handleAddInAttackRange(
	isEnter: boolean,
	element: Unit,
	otherId: hash,
) {
	if (isEnter === true) {
		element.enemyInAttackRange.push(otherId);
	} else {
		const index = element.enemyInAttackRange.findIndex((id) => id === otherId);
		element.enemyInAttackRange.splice(index, 1);
	}
}

export const gameState = {
	updateNearEnemy: updateNearEnemy,
	getUnits: getUnits,
	addUnit: addUnit,
	removeUnit: removeUnit,

	getBuildings: getBuildings,
	addBuilding: addBuilding,
};
