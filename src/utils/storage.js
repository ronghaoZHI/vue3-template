class Storage {
	constructor(max = 5) {
			this.storage = window.localStorage;
			this.maxCount = max
	}
	setItem(key, value) {
			if (Array.isArray(value) && value.length > this.maxCount) value.length = this.maxCount;
			if (typeof value === 'object' && value !== null) value = JSON.stringify(value);
			this.storage.setItem(key, value)
	}
	removeItem(key) {
			this.storage.removeItem(key)
	}
	getItem(key) {
			let ret = this.storage.getItem(key)
			try {
					ret = JSON.parse(ret)
			} catch (e) {
					return ret;
			}
			return ret;
	}
}
export default Storage;
export const storage = new Storage