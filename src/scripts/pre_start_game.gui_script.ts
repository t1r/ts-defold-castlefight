import { START_GAME_MSG, TEAM_1, TEAM_2 } from '../modules/const';
import { gameState as gs } from '../modules/gameState';
import { UnitAbstractFactory, UnitTemplate } from '../modules/types/unit';
// import * as druid from 'druid.druid';

interface props {
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

	const factories = gs.progress.getUserUpgradeVariantsByTeam(TEAM_1);
	pprint([factories]);
	for (let index = 0; index < factories.length; index++) {
		const factory = factories[index];
		const template = factory.createUnitTemplate();
		const node = createUnitCard(index * 120 + 160, buildString(template));
		this.upgradeUnitList.push({
			node: node,
			factory: factory,
		});
	}
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
				gs.progress.setUseProgressByTeam(TEAM_1, item.factory);
				gs.progress.setUseProgressByTeam(TEAM_2, item.factory);
				msg.post('controller:/controller#controller', 'close_pre_start_game');
			}
		}
	}
}

function createUnitCard(y: number, text: string): node {
	pprint(['y', y]);
	const nodeBox = gui.new_box_node(
		vmath.vector3(470, y, 0),
		vmath.vector3(400, 100, 0),
	);
	gui.new_text_node(vmath.vector3(470, y, 0), text);
	// gui.set_color(nodeText, vmath.vector3(1, 1, 1))
	gui.set_color(nodeBox, vmath.vector3(0.1, 0.1, 0.1));
	// gui.set_parent(nodeText, nodeBox)

	return nodeBox;
}

function buildString(template: UnitTemplate): string {
	return `${template.unitType} att ${template.attackType}, attk ${template.attack}, art ${template.armorType}, ar ${template.armor}`;
}
