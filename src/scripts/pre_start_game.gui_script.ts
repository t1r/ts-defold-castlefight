import { START_GAME_MSG, TEAM_1, TEAM_2 } from '../modules/const';
import { gameState as gs } from '../modules/gameState';
import { UnitAbstractFactory } from '../modules/types/unit';

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
		const node = createUnitCard(
			index * 120 + 160,
			template.attackType.toString(),
			template.attack,
			template.armorType.toString(),
			0,
		);
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

function createUnitCard(
	y: number,
	attackType: string,
	attack: number,
	armorType: string,
	armor: number,
): node {
	pprint(["y", y])
	const nodeBox = gui.new_box_node(
		vmath.vector3(470, y, 0),
		vmath.vector3(400, 100, 0),
	);
	gui.new_text_node(
		vmath.vector3(470, y, 0),
		`att ${attackType}, attk ${attack}, art ${armorType}, ar ${armor}`,
	);
	// gui.set_color(nodeText, vmath.vector3(1, 1, 1))
	gui.set_color(nodeBox, vmath.vector3(0.1, 0.1, 0.1));
	// gui.set_parent(nodeText, nodeBox)

	return nodeBox;
}
