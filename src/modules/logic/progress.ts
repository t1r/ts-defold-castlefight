import { UnitAbstractFactory } from '../types/unit';
import { EliteSoldierFactory } from '../unit/eliteSoldier';
import { InfantryFactory } from '../unit/infantry';

const allianceProgress: Record<number, UnitAbstractFactory[]> = {
	0: [new EliteSoldierFactory(), new InfantryFactory()],
	1: [],
	2: [],
};

export function getProgressVariantByLevel(
	level: number,
): UnitAbstractFactory[] {
	return allianceProgress[level];
}
