import { TEAM_1, TEAM_2 } from '../const';
import { getProgressVariantByFractionAndLevel } from '../logic/progress';
import { FractionType } from '../types/fractions';
import { Progress } from '../types/progress';
import { UnitAbstractFactory } from '../types/unit';

export class GsProgress {
	private list: Map<number, Progress> = new Map();

	constructor() {
		this.list.set(TEAM_1, {
			fraction: undefined,
			level: 0,
			factory: undefined,
		});
		this.list.set(TEAM_2, {
			fraction: undefined,
			level: 0,
			factory: undefined,
		});
	}

	public getByTeam(team: number): Progress | undefined {
		return this.list.get(team);
	}

	public getUpgradeVariantsByTeam(team: number): UnitAbstractFactory[] {
		const progress = this.list.get(team);

		return progress?.fraction !== undefined && progress?.level !== undefined
			? getProgressVariantByFractionAndLevel(progress?.fraction, progress.level)
			: [];
	}

	public setProgressByTeam(team: number, factory: UnitAbstractFactory) {
		const progress = this.list.get(team);
		if (progress === undefined) {
			return;
		}

		this.list.set(team, {
			fraction: progress.fraction,
			level: progress.level + 1,
			factory: factory,
		});
	}

	public setFractionByTeam(team: number, fraction: FractionType) {
		const progress = this.list.get(team);
		if (progress === undefined) {
			return;
		}

		this.list.set(team, {
			...progress,
			fraction: fraction,
		});
	}

	public isAllFactoriesReady(): boolean {
		return Array.from(this.list.values()).every((e) => e.factory);
	}
}
