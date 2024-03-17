import { defineStore } from 'pinia'

import { api } from 'boot/axios'

export const mediaStore = defineStore('mediaStore', {
	state: () => ({
		files: [],
		loading: false,
		error: null,
	}),
	getters: {
		getFileById: (state) => (id) => state.files.find(p => p._id === id),
		getFiles: (state) => () => state.files.filter(p => !!p._id),
	},
	actions: {
		addNewFile() {
			const newRecord = {
				filename: '',
			};
			this.files.push(newRecord);
			return newRecord;
		},
		async fetchFiles(queryParams) {
			this.loading = true;
			try {
				const result = await api.get('/media', { params: queryParams });
				this.files = result.data;
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async saveNewFile(payload) {
			this.loading = true;
			let result = {};
			try {
				result = await api.post('/media', payload, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
			return result.data;
		},
		async deleteFile (id) {
			this.loading = true;
			let result = null;
			try {
				result = await api.delete(`/media/${id}`);
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
			return result;
		},
		async updateFile(id, payload) {
			this.loading = true;
			try {
				await api.put(`/media/${id}`, payload);
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		}
	},
})

