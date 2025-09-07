import { UnitAbstractFactory } from '../types/unit';

export class GsAi {
	private getUpgradeVariants: () => UnitAbstractFactory[];
	private setUseProgress: (factory: UnitAbstractFactory) => void;

	constructor(
		getUpgradeVariants: () => UnitAbstractFactory[],
		setUseProgress: (factory: UnitAbstractFactory) => void,
	) {
		this.getUpgradeVariants = getUpgradeVariants;
		this.setUseProgress = setUseProgress;
	}

	public performStartGameProgress() {
		const factories = this.getUpgradeVariants();

		// TODO refactoring add not random logic
		const selectedIndex = Math.floor(Math.random() * factories.length);

		const factory = factories[selectedIndex];
		this.setUseProgress(factory);
	}
}
