import { Storage } from '@plasmohq/storage';

export const ExtensionStorage = {
	local: new Storage({
		area: 'local',
	}),
	sync: new Storage({
		area: 'sync',
	}),
};

export function getSetting(key: keyof IStorage) {
	return ExtensionStorage.sync.get(key);
}

function isNumeric(value: string) {
    return /^-?\d+$/.test(value);
}

export async function getAllSettings() {
	const settings = (await ExtensionStorage.sync.getAll()) as unknown as IStorage;
	// iterate through settings and parse JSON strings correctly
	for (const key in DEFAULT_SETTINGS) {
		if (typeof settings[key] === 'string' && (settings[key].startsWith('"') || settings[key].startsWith('{') || settings[key].startsWith('['))) {
			let result = JSON.parse(settings[key]);
			if (isNumeric(result)) {
				// exception for csf-listingage
				if (key === 'csf-listingage') {
					result = true;
					ExtensionStorage.sync.set('csf-listingage', true);
				} else {
					result = parseInt(result);
				}
			} else if (result === 'true') {
				result = true;
			} else if (result === 'false') {
				result = false;
			}
			settings[key] = result;
		} else if (settings[key] === 'true') {
			settings[key] = true;
		} else if (settings[key] === 'false') {
			settings[key] = false;
		}
	}
	return settings;
}

export const DEFAULT_SETTINGS = {
	'csf-enable': true,
	'csf-autorefresh': true,
	'csf-stickerprices': true,
	'csf-csbluegem': true,
	'csf-pricereference': 0,
	'csf-refreshinterval': 0,
	'csf-floatappraiser': false,
	'csf-steamlink': true,
	'csf-buffdifference': true,
	'csf-buffdifferencepercent': false,
	'csf-listingage': true,
	'csf-topbutton': true,
	'csf-floatcoloring': true,
	'csf-removeclustering': false,
	'sp-enable': true,
	'sp-stickerprices': true,
	'sp-csbluegem': true,
	'sp-ocoapikey': '',
	'sp-pricereference': 0,
	'sp-currencyrates': 0,
	'sp-steamprices': false,
	'sp-buffdifference': true,
	'sp-buffdifferencepercent': false,
	'sp-bufflink': 0,
	'sp-autoclosepopup': true,
	'sp-floatcoloring': true,
	'skb-enable': true,
	'skb-pricereference': 0,
	'skb-buffdifference': true,
	'skb-listingage': true,
	'skb-stickerprices': true,
	'csf-color-profit': '#008000',
	'csf-color-loss': '#ce0000',
	'csf-color-neutral': '#708090',
	'sp-color-profit': '#008000',
	'sp-color-loss': '#ce0000',
	'sp-color-neutral': '#000000',
	'skb-color-profit': '#0cb083',
	'skb-color-loss': '#ce0000',
	'skb-color-neutral': '#FFFFFF',
	"display-updatepopup": true,
};

export const DEFAULT_FILTER = {
	priceLow: 0,
	priceHigh: 999999,
	name: '',
	types: {
		knife: true,
		gloves: true,
		agent: true,
		weapon: true,
		collectible: true,
		container: true,
		sticker: true,
	},
	new: false,
}

export type IStorage = typeof DEFAULT_SETTINGS;
export type EStorage = { key: keyof IStorage; value: IStorage[keyof IStorage] }[];
export type SPFilter = typeof DEFAULT_FILTER;
