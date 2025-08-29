import { UnitAbstractFactory } from './unit';

export interface Progress {
	factory: UnitAbstractFactory | undefined;
	level: number;
}
