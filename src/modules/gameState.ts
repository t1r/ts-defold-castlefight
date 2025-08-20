import { GsBuilding } from './gs/building';
import { GsUnits } from './gs/units';

const units: GsUnits = new GsUnits();
const buildings: GsBuilding = new GsBuilding();

export const gameState = {
	units: units,
	buildings: buildings,
};
