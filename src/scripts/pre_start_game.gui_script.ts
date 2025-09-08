import { TEAM_1 } from '../modules/const';
import { gameState as gs } from '../modules/gameState';
import { FractionType, fractionTypes } from '../modules/types/fractions';
import { UnitAbstractFactory, UnitTemplate } from '../modules/types/unit';
// import * as druid from 'druid.druid';

const UNIT_ROW_SIZE = 120;
const UNIT_ROW_START_OFFSET = 160;

interface props {
	fractionList: { node: node; fraction: FractionType }[];
	fractionNextNode: node;
	selectedFraction: FractionType | undefined;

	fractionBackNode: node | undefined;
	upgradeUnitList: { node: node; factory: UnitAbstractFactory }[];
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

	createFractionMenu(this);
}

export function on_message(
	this: props,
	_messageId: hash,
	_message: { score: number },
	_sender: url,
): void {}

export function on_input(this: props, actionId: hash, action: action): void {
	if (actionId === hash('touch') && action.released) {
		// Fractions
		for (const item of this.fractionList) {
			if (gui.pick_node(item.node, action.x, action.y)) {
				pprint(['click fraction']);
				gs.progress.setFractionByTeam(TEAM_1, item.fraction);
				this.selectedFraction = item.fraction;
			}
		}
		if (
			this.selectedFraction !== undefined &&
			gui.pick_node(this.fractionNextNode, action.x, action.y)
		) {
			handleFractionsNext(this);
		}

		// Units
		for (const item of this.upgradeUnitList) {
			if (gui.pick_node(item.node, action.x, action.y)) {
				pprint(['click unit']);
				gs.progress.setProgressByTeam(TEAM_1, item.factory);
				gs.ai.performStartGameProgress();

				// TODO refactoring
				msg.post('controller:/controller#controller', 'close_pre_start_game');
			}
		}
		if (
			this.fractionBackNode &&
			gui.pick_node(this.fractionBackNode, action.x, action.y)
		) {
			handleUnitsBack(this);
		}
	}
}

function createFractionMenu(ctx: props) {
	const nextNode = createUiRow(UNIT_ROW_START_OFFSET, 'Next');
	ctx.fractionNextNode = nextNode;

	for (let index = 0; index < fractionTypes.length; index++) {
		const fraction = fractionTypes[index];
		const node = createUiRow(
			(index + 1) * UNIT_ROW_SIZE + UNIT_ROW_START_OFFSET,
			fraction,
		);

		ctx.fractionList.push({
			node: node,
			fraction: fraction,
		});
	}
}

function setFractionMenuEnabled(ctx: props, enabled: boolean) {
	for (const { node } of ctx.fractionList) {
		gui.set_enabled(node, enabled);
	}
	gui.set_enabled(ctx.fractionNextNode, enabled);
}

function showUnitsMenu(ctx: props) {
	const backNode = createUiRow(UNIT_ROW_START_OFFSET, 'Back');
	ctx.fractionBackNode = backNode;

	const factories = gs.progress.getUpgradeVariantsByTeam(TEAM_1);
	for (let index = 0; index < factories.length; index++) {
		const factory = factories[index];
		const template = factory.createUnitTemplate();
		const node = createUiRow(
			(index + 1) * UNIT_ROW_SIZE + UNIT_ROW_START_OFFSET,
			buildUnitRowString(template),
		);

		ctx.upgradeUnitList.push({
			node: node,
			factory: factory,
		});
	}
}

function handleFractionsNext(ctx: props) {
	pprint(['click fraction next']);
	setFractionMenuEnabled(ctx, false);

	timer.delay(0.3, false, () => {
		showUnitsMenu(ctx);
	});
}

function handleUnitsBack(ctx: props) {
	pprint(['click units back']);
	for (const item of ctx.upgradeUnitList) {
		gui.delete_node(item.node);
	}
	ctx.upgradeUnitList = [];
	if (ctx.fractionBackNode) {
		gui.delete_node(ctx.fractionBackNode);
	}
	ctx.fractionBackNode = undefined;
	ctx.selectedFraction = undefined;

	timer.delay(0.3, false, () => setFractionMenuEnabled(ctx, true));
}

function createUiRow(y: number, text: string): node {
	const nodeBox = gui.new_box_node(
		vmath.vector3(470, y, 0),
		vmath.vector3(400, 100, 0),
	);
	const nodeText = gui.new_text_node(vmath.vector3(0, 0, 0), text);
	gui.set_color(nodeBox, vmath.vector3(0.1, 0.1, 0.1));
	gui.set_parent(nodeText, nodeBox);

	return nodeBox;
}

function buildUnitRowString(template: UnitTemplate): string {
	return `${template.unitType} att ${template.attackType}, attk ${template.attack}, art ${template.armorType}, ar ${template.armor}`;
}
