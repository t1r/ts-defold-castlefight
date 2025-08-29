import { Building } from '../types/building';

export class GsBuilding {
	private units: Map<number, Building> = new Map();

	public getByTeam(team: number): Building | undefined {
		return this.units.get(team);
	}

	public setByTeam(team: number, unit: Building) {
		this.units.set(team, unit);
	}

	public removeByHash(id: hash) {
		for (const [key, value] of this.units.entries()) {
			if (value.id === id) {
				this.units.delete(key);
			}
		}
	}

	public getAll(): Building[] {
		return Array.from(this.units.values());
	}
}
