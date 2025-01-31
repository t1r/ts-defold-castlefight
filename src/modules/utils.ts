export function removeItemsWithName<T>(items: T[], id: T): void {
	for (let i = 0; i < items.length; i++) {
		if (items[i] === id) {
			items.splice(i--, 1);
		}
	}
}
