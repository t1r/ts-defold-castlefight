import { GsBuilding } from './gs/building';
import { GsUnits } from './gs/units';
import { ArmorType, UnitType } from './types/unit';
import { removeItemsWithName } from './utils';

const FINDER_HASH = hash('finder');
const ATTACK_RANGE_HASH = hash('attack_range');

const units: GsUnits = new GsUnits();
const buildings: GsBuilding = new GsBuilding();

// function updateNearEnemy(
// 	unitsTeam: Unit[],
// 	currentId: hash,
// 	isEnter: boolean,
// 	otherId?: hash,
// 	ownGroup?: hash,
// ) {
// 	const element = unitsTeam.find((value) => value.id === currentId);
// 	const otherElement = unitsTeam.find((value) => value.id === otherId);
// 	const isFinder = (ownGroup && ownGroup === FINDER_HASH) === true;
// 	const isAttackRange = (ownGroup && ownGroup === ATTACK_RANGE_HASH) === true;

// 	if (
// 		element &&
// 		otherId &&
// 		otherElement &&
// 		otherElement.team !== element.team
// 	) {
// 		if (isFinder) {
// 			handleAddNearEnemy(isEnter, element, otherId);
// 		} else if (isAttackRange) {
// 			handleAddInAttackRange(isEnter, element, otherId);
// 		}
// 	}
// }

// function getBuildings(): Building[] {
// 	return buildings;
// }

// function addBuilding(building: Building) {
// 	buildings.push(building);
// }

// function removeUnit(otherId: hash) {
// 	for (let i = 0; i < units.length; i++) {
// 		const unit = units[i];
// 		removeItemsWithName(unit.nearEnemy, otherId);
// 		removeItemsWithName(unit.enemyInAttackRange, otherId);
// 		if (unit.id === otherId) {
// 			units.splice(i--, 1);
// 		}
// 	}
// }

// function handleAddNearEnemy(isEnter: boolean, element: Unit, otherId: hash) {
// 	if (isEnter === true) {
// 		element.nearEnemy.push(otherId);
// 	} else {
// 		const index = element.nearEnemy.findIndex((id) => id === otherId);
// 		element.nearEnemy.splice(index, 1);
// 	}
// }

// function handleAddInAttackRange(
// 	isEnter: boolean,
// 	element: Unit,
// 	otherId: hash,
// ) {
// 	if (isEnter === true) {
// 		element.enemyInAttackRange.push(otherId);
// 	} else {
// 		const index = element.enemyInAttackRange.findIndex((id) => id === otherId);
// 		element.enemyInAttackRange.splice(index, 1);
// 	}
// }

export const gameState = {
	// updateNearEnemy: updateNearEnemy,
	units: units,
	// getUnits: getUnits,
	// addUnit: addUnit,
	// removeUnit: removeUnit,

	// getBuildings: getBuildings,
	// addBuilding: addBuilding,
	buildings: buildings,
};
