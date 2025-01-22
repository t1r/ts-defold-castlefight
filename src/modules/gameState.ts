export enum UnitState {
	MovingToEnemyBase,
	MoveToEnemy,
	Attack,
	Dead,
	Idle,
}

export interface Unit {
	id: hash;
	state: UnitState;
	nearEnemy: hash[];
	inAttackRange: hash[];
	team: number;
}

const FINDER_HASH = hash('finder');
const ATTACK_RANGE_HASH = hash('attack_range');

const unitsTeam1: Unit[] = [];

function updateNearEnemy(
	unitsTeam: Unit[],
	currentId: hash,
	isEnter: boolean,
	otherId?: hash,
	ownGroup?: hash,
) {
	pprint([
		'------------ updateNearEnemy currentid ',
		tostring(currentId),
		isEnter,
		' otherid ',
		tostring(otherId),
	]);
	const element = unitsTeam.find((value) => value.id === currentId);
	const otherElement = unitsTeam.find((value) => value.id === otherId);
	const isFinder = (ownGroup && ownGroup === FINDER_HASH) === true;
	const isAttackRange = (ownGroup && ownGroup === ATTACK_RANGE_HASH) === true;

	pprint([
		"'------------ element ",
		element,
		' otherId ',
		otherId,
		' otherElement ',
		otherElement,
		' isFinder ',
		isFinder,
	]);

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

function getUnitTeam1(): Unit[] {
	return unitsTeam1;
}

function addUnitToTeam1(team: Unit) {
	unitsTeam1.push(team);
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
		element.inAttackRange.push(otherId);
	} else {
		const index = element.inAttackRange.findIndex((id) => id === otherId);
		element.inAttackRange.splice(index, 1);
	}
}

export const gameState = {
	updateNearEnemy: updateNearEnemy,
	getUnitTeam1: getUnitTeam1,
	addUnitToTeam1: addUnitToTeam1,
};
