import { Unit, UnitType } from './types/unit';
import { createEliteSoldier } from './unit/eliteSoldier';
import { createInfantry } from './unit/infantry';

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
