import { TEAM_1, TEAM_2 } from './const';
import { GsAi } from './gs/ai';
import { GsBuilding } from './gs/building';
import { GsProgress } from './gs/progress';
import { GsUnits } from './gs/units';

const units: GsUnits = new GsUnits();
const buildings: GsBuilding = new GsBuilding();
const progress: GsProgress = new GsProgress();
const ai: GsAi = new GsAi(
	(fraction) => {
		return progress.setFractionByTeam(TEAM_2, fraction);
	},
	() => {
		return progress.getUpgradeVariantsByTeam(TEAM_2);
	},
	(factory) => {
		progress.setProgressByTeam(TEAM_2, factory);
	},
	() => {
		return progress.getByTeam(TEAM_1);
	},
);

export const gameState = {
	units: units,
	buildings: buildings,
	progress: progress,
	ai: ai,
};
