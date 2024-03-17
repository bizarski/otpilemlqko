import { defineStore } from 'pinia'

import { api } from 'boot/axios'

const transformPost = (post) => {
	return {
		...post,
		carouselSlides: post.carouselSlides || [],
		imageCards: post.imageCards || [],
	};
};

export const postsStore = defineStore('postsStore', {
	state: () => ({
		post: null,
		posts: [],
		loading: false,
		error: null,
	}),
	actions: {
		addNewPost() {
			this.post = {
				title: '',
				body: '',
				slug: '',
				carouselType: '',
				carouselSlides: [],
				imageCards: [],
			};
			return this.post;
		},
		resetPosts() {
			this.posts = [];
		},
		async fetchPosts(queryParams) {
			this.loading = true;
			this.posts = [];
			try {
				const result = await api.get('/posts', { params: queryParams });
				this.posts = result.data;
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async fetchMorePosts(queryParams) {
			this.loading = true;
			let hasNewPosts = false;
			try {
				const result = await api.get('/posts', { params: queryParams });
				hasNewPosts = result.data.length > 0;
				if (hasNewPosts)
					this.posts = this.posts.concat(result.data);
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
			return hasNewPosts;
			
		},
		async fetchPost(id = 'dobre-doshli') {
			this.loading = true;
			try {
				const result = await api.get(`/posts/${id}`);
				this.post = transformPost(result.data.post);
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async fetchPostById(id) {
			if (!id) {
				this.post = null;
				return;
			}
			this.loading = true;
			try {
				const result = await api.get(`/posts/id/${id}`);
				this.post = transformPost(result.data.post);
				this.error = null;
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async saveNewPost(payload) {
			this.loading = true;
			let result = {};
			try {
				result = await api.post(`/posts`, payload, {
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
		async updatePost(id, payload) {
			this.loading = true;
			try {
				await api.put(`/posts/${id}`, payload, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
			} catch (error) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		}
	},
})

