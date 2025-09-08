import { FractionType, fractionTypes } from '../types/fractions';
import { Progress } from '../types/progress';
import { UnitAbstractFactory } from '../types/unit';

export class GsAi {
	private setFractionByTeam: (fraction: FractionType) => void;
	private getUpgradeVariants: () => UnitAbstractFactory[];
	private setProgress: (factory: UnitAbstractFactory) => void;
	private getByTeam: () => Progress | undefined;

	constructor(
		setFractionByTeam: (fraction: FractionType) => void,
		getUpgradeVariants: () => UnitAbstractFactory[],
		setProgress: (factory: UnitAbstractFactory) => void,
		getByTeam: () => Progress | undefined,
	) {
		this.setFractionByTeam = setFractionByTeam;
		this.getUpgradeVariants = getUpgradeVariants;
		this.setProgress = setProgress;
		this.getByTeam = getByTeam;
	}

	public performStartGameProgress() {
		// Fraction
		const userFraction = this.getByTeam()?.fraction;
		const filtredFraction = fractionTypes.filter((e) => e !== userFraction);
		const selectedFractionIndex = Math.floor(
			Math.random() * filtredFraction.length,
		);
		this.setFractionByTeam(filtredFraction[selectedFractionIndex]);

		// Units
		const factories = this.getUpgradeVariants();
		// TODO refactoring add not random logic
		const selectedUnitIndex = Math.floor(Math.random() * factories.length);
		const factory = factories[selectedUnitIndex];
		this.setProgress(factory);
	}
}
