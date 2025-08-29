import { GsBuilding } from './gs/building';
import { GsProgress } from './gs/progress';
import { GsUnits } from './gs/units';

const units: GsUnits = new GsUnits();
const buildings: GsBuilding = new GsBuilding();
const progress: GsProgress = new GsProgress();

export const gameState = {
	units: units,
	buildings: buildings,
	progress: progress,
};
