import { FractionType } from '../types/fractions';
import { UnitAbstractFactory } from '../types/unit';
import { EliteSoldierFactory } from '../unit/eliteSoldier';
import { InfantryFactory } from '../unit/infantry';

const alliance: Record<number, UnitAbstractFactory[]> = {
	0: [new EliteSoldierFactory(), new InfantryFactory()],
	1: [],
	2: [],
};

const darkElfs: Record<number, UnitAbstractFactory[]> = {
	0: [new EliteSoldierFactory(), new InfantryFactory()],
	1: [],
	2: [],
};

const fractions: Record<FractionType, Record<number, UnitAbstractFactory[]>> = {
	alliance: alliance,
	'dark-elfs': darkElfs,
};

export function getProgressVariantByFractionAndLevel(
	fraction: FractionType,
	level: number,
): UnitAbstractFactory[] {
	return fractions[fraction][level];
}
