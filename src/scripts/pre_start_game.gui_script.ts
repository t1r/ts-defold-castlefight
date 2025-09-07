import { TEAM_1 } from '../modules/const';
import { gameState as gs } from '../modules/gameState';
import { FractionType, fractionTypes } from '../modules/types/fractions';
import { UnitAbstractFactory, UnitTemplate } from '../modules/types/unit';
// import * as druid from 'druid.druid';

const UNIT_ROW_SIZE = 120;
const UNIT_ROW_START_OFFSET = 160;

interface props {
	upgradeUnitList: { node: node; factory: UnitAbstractFactory }[];
	fractionList: { node: node; fraction: FractionType }[];
}

interface action {
	released: boolean;
	x: number;
	y: number;
}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');

	this.upgradeUnitList = [];
	this.fractionList = [];

	showFractionMenu(this);
}

export function on_message(
	this: props,
	_messageId: hash,
	_message: { score: number },
	_sender: url,
): void {}

export function on_input(this: props, actionId: hash, action: action): void {
	if (actionId === hash('touch') && action.released) {
		for (const item of this.upgradeUnitList) {
			if (gui.pick_node(item.node, action.x, action.y)) {
				gs.progress.setProgressByTeam(TEAM_1, item.factory);
				gs.ai.performStartGameProgress();

				// TODO refactoring
				msg.post('controller:/controller#controller', 'close_pre_start_game');
			}
		}

		for (const item of this.fractionList) {
			if (gui.pick_node(item.node, action.x, action.y)) {
				gs.progress.setFractionByTeam(TEAM_1, item.fraction);
			}
		}
	}
}

function showFractionMenu(ctx: props) {
	for (let index = 0; index < fractionTypes.length; index++) {
		const fraction = fractionTypes[index];
		const node = createUiRow(
			index * UNIT_ROW_SIZE + UNIT_ROW_START_OFFSET,
			fraction,
		);

		ctx.fractionList.push({
			node: node,
			fraction: fraction,
		});
	}
}

function showUnitsMenu(ctx: props) {
	const factories = gs.progress.getUpgradeVariantsByTeam(TEAM_1);

	for (let index = 0; index < factories.length; index++) {
		const factory = factories[index];
		const template = factory.createUnitTemplate();
		const node = createUiRow(
			index * UNIT_ROW_SIZE + UNIT_ROW_START_OFFSET,
			buildUnitRowString(template),
		);

		ctx.upgradeUnitList.push({
			node: node,
			factory: factory,
		});
	}
}

function createUiRow(y: number, text: string): node {
	pprint(['y', y]);
	const nodeBox = gui.new_box_node(
		vmath.vector3(470, y, 0),
		vmath.vector3(400, 100, 0),
	);
	const nodeText = gui.new_text_node(vmath.vector3(470, y, 0), text);
	// gui.set_color(nodeText, vmath.vector3(1, 1, 1))
	gui.set_color(nodeBox, vmath.vector3(0.1, 0.1, 0.1));
	gui.set_parent(nodeText, nodeBox);

	gui.set_enabled(nodeText, true);

	return nodeBox;
}

function buildUnitRowString(template: UnitTemplate): string {
	return `${template.unitType} att ${template.attackType}, attk ${template.attack}, art ${template.armorType}, ar ${template.armor}`;
}
