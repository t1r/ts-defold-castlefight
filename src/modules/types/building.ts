import { ArmorType } from './unit';

export interface Building {
	hp: number;
	armorType: ArmorType;
	originTimeToRespawnUnit: number;
	// unitType: UnitType;

	// State
	id: hash;
	team: number;
	// state: BuildingState;
	timeToRespawnUnit: number;
}
