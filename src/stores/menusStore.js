import { defineStore } from 'pinia'

import { api } from 'boot/axios'

export const menusStore = defineStore('menusStore', {
	state: () => ({
		menus: [],
		loading: false,
		error: null,
	}),
	getters: {
		getByPosition: (state) => (position) => state.menus.filter(p => p.position === position)
	},
	actions: {
		async fetchMenus() {
			this.loading = true;
			try {
				const result = await api.get('/menus');
				this.menus = result.data;
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async updateMenu(id, payload) {
			this.loading = true;
			try {
				await api.put(`/menus/${id}`, payload);
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
	},
})

