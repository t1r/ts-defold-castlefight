import { TEAM_1, TEAM_2 } from '../const';
import { getProgressVariantByLevel } from '../logic/progress';
import { Progress } from '../types/progress';
import { UnitAbstractFactory } from '../types/unit';

export class GsProgress {
	private list: Map<number, Progress> = new Map();

	constructor() {
		this.list.set(TEAM_1, { level: 0, factory: undefined });
		this.list.set(TEAM_2, { level: 0, factory: undefined });
	}

	public getByTeam(team: number): Progress | undefined {
		return this.list.get(team);
	}

	public getUserUpgradeVariantsByTeam(team: number): UnitAbstractFactory[] {
		const level = this.list.get(team)?.level;
		return level !== undefined ? getProgressVariantByLevel(level) : [];
	}

	public setUseProgressByTeam(team: number, factory: UnitAbstractFactory) {
		const progress = this.list.get(team);
		if (progress === undefined) {
			return
		}
		
		this.list.set(team, { level: progress.level + 1, factory: factory });
	}

	public isAllFactoriesReady(): boolean {
		return Array.from(this.list.values()).every((e) => e.factory);
	}
}
