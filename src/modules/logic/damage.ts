import { ArmorType, AttackType } from '../types/unit';

const unarmored: Record<AttackType, number> = {
	[AttackType.Normal]: 1,
	[AttackType.Piercing]: 1.5,
	[AttackType.Siege]: 1.5,
	[AttackType.Magic]: 1,
	[AttackType.Chaos]: 1,
	[AttackType.Spells]: 1,
	[AttackType.Hero]: 1,
};

const light: Record<AttackType, number> = {
	[AttackType.Normal]: 1,
	[AttackType.Piercing]: 2,
	[AttackType.Siege]: 1.25,
	[AttackType.Magic]: 1,
	[AttackType.Chaos]: 1,
	[AttackType.Spells]: 1,
	[AttackType.Hero]: 1,
};

const medium: Record<AttackType, number> = {
	[AttackType.Normal]: 1.5,
	[AttackType.Piercing]: 0.75,
	[AttackType.Siege]: 0.5,
	[AttackType.Magic]: 0.75,
	[AttackType.Chaos]: 1,
	[AttackType.Spells]: 1,
	[AttackType.Hero]: 1,
};

const heavy: Record<AttackType, number> = {
	[AttackType.Normal]: 1,
	[AttackType.Piercing]: 1,
	[AttackType.Siege]: 1,
	[AttackType.Magic]: 2,
	[AttackType.Chaos]: 1,
	[AttackType.Spells]: 1,
	[AttackType.Hero]: 1,
};

const fortified: Record<AttackType, number> = {
	[AttackType.Normal]: 0.7,
	[AttackType.Piercing]: 0.35,
	[AttackType.Siege]: 1.5,
	[AttackType.Magic]: 0.35,
	[AttackType.Chaos]: 1,
	[AttackType.Spells]: 1,
	[AttackType.Hero]: 0.5,
};

const hero: Record<AttackType, number> = {
	[AttackType.Normal]: 1,
	[AttackType.Piercing]: 0.5,
	[AttackType.Siege]: 0.5,
	[AttackType.Magic]: 0.5,
	[AttackType.Chaos]: 1,
	[AttackType.Spells]: 0.7,
	[AttackType.Hero]: 1,
};

const records: Record<ArmorType, Record<AttackType, number>> = {
	[ArmorType.Unarmored]: unarmored,
	[ArmorType.Light]: light,
	[ArmorType.Medium]: medium,
	[ArmorType.Heavy]: heavy,
	[ArmorType.Fortified]: fortified,
	[ArmorType.Hero]: hero,
};

export function getDamageMultiplier(
	armor: ArmorType,
	attack: AttackType,
): number {
	return records[armor][attack];
}
