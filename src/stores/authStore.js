import { defineStore } from 'pinia'

import { api } from 'boot/axios'

import { LocalStorage, SessionStorage } from 'quasar'

export const authStore = defineStore('authStore', {
	state: () => ({
		user: LocalStorage.getItem('user') || SessionStorage.getItem('user'),
		loading: false,
		error: null,
	}),
	getters: {
		isAuthenticated: (state) => !!state.user,
	},
	actions: {
		async login(payload) {
			this.loading = true;
			try {
				await api.post('/auth', payload);
				this.user = true;
				LocalStorage.set('user', this.user);
				SessionStorage.set('user', this.user);
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
	},
	mutations: {
		logout(state) {
			state.user = null;
		}
	}
})

