import * as monarch from 'monarch.monarch';
import { gameState as gs } from '../modules/gameState';
import {
	NAV_GAME,
	NAV_MAIN_MENU,
	NAV_PRE_START_GAME,
	NAV_UPGRADE,
	START_GAME_MSG,
} from '../modules/const';

interface props {
	isPaused: boolean;
}

interface action {
	pressed: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface message {}

export function init(this: props): void {
	msg.post('.', 'acquire_input_focus');
	msg.post('#', 'start');
	this.isPaused = false;

	handlePauseGame(this);
}

export function update(this: props, _dt: number): void {}

export function on_input(this: props, actionId: hash, action: action): void {
	if (actionId === hash('pause') && action.pressed) {
		pprint('----------------- pause -----------------');
		handlePauseGame(this);
	} else if (actionId === hash('upgrade') && action.pressed) {
		pprint('----------------- upgrade -----------------');
		monarch.show(NAV_UPGRADE);
	}
}

export function on_message(
	this: props,
	messageId: hash,
	_message: message,
	_sender: url,
): void {
	if (messageId === hash('start')) {
		monarch.show(NAV_MAIN_MENU);
	} else if (messageId === START_GAME_MSG) {
		monarch.show(NAV_GAME);
	} else if (messageId === hash('close_pre_start_game')) {
		pprint(["CLOSE PRE START"])
		monarch.hide(NAV_PRE_START_GAME);
	}
}

function handlePauseGame(ctx: props) {
	if (!gs.progress.isAllFactoriesReady()) {
		ctx.isPaused = false;
	}
	msg.post('/game#collectionproxy', 'set_time_step', {
		factor: ctx.isPaused ? 1 : 0,
		mode: 0,
	});
}
