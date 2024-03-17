import { defineStore } from 'pinia'

import { api } from 'boot/axios'

export const settingsStore = defineStore('settingsStore', {
	state: () => ({
		loading: false,
		error: null,
		CDN: process.env.DEV ? 'http://localhost:3019/public' : (process.env.BACKEND_URL + '/public'),
		settings: {},
	}),
	actions: {
		async fetchSettings() {
			this.loading = true;
			try {
				const result = await api.get('/settings');
				this.settings = result.data;
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async updateSettings(payload) {
			this.loading = true;
			try {
				await api.put(`/settings`, payload);
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
	}
})

