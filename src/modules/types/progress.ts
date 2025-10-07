import { FractionType } from './fractions';
import { UnitAbstractFactory } from './unit';

export interface Progress {
	fraction: FractionType | undefined;
	factory: UnitAbstractFactory | undefined;
	level: number;
}
