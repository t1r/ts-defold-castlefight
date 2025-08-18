import { Unit } from '../types/unit';

export class GsUnits {
	units: Map<number, Unit> = new Map();

	public getByTeam(team: number): Unit | undefined {
		return this.units.get(team);
	}

	public setByTeam(team: number, unit: Unit) {
		this.units.set(team, unit);
	}

	public removeByHash(id: hash) {
		for (const [key, value] of this.units.entries()) {
			if (value.id === id) {
				this.units.delete(key);
			}
		}
	}

	public getAll(): Unit[] {
		return Array.from(this.units.values());
	}
}
