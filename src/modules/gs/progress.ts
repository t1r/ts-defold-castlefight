import { TEAM_1, TEAM_2 } from '../const';
import { Progress } from '../types/progress';

export class GsProgress {
	private list: Map<number, Progress> = new Map();

	constructor() {
		this.list.set(TEAM_1, { level: 0, factory: undefined });
		this.list.set(TEAM_2, { level: 0, factory: undefined });
	}

	public getByTeam(team: number): Progress | undefined {
		return this.list.get(team);
	}
}
