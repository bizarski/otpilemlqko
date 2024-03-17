<template>
  <q-layout view="lhr Lpr fff">
    <q-header reveal elevated class="q-pa-md">
		<h1 class="text-h3 text-bold">Admin Panel {{ adminPage }}</h1>
    </q-header>

    <q-drawer v-if="isAuthenticated" show-if-above side="left" bordered>
		<div class="q-pa-lg">
			<q-list class="fit text-center">
				<q-item
					clickable
					v-ripple
					:to="{ name: 'adminPosts' }"
				>
					<q-item-section>Posts</q-item-section>
				</q-item>
				<q-item
					clickable
					v-ripple
					:to="{ name: 'adminMedia' }"
				>
					<q-item-section>Media</q-item-section>
				</q-item>
				<q-item
					clickable
					v-ripple
					:to="{ name: 'adminMenus' }"
				>
					<q-item-section>Menus</q-item-section>
				</q-item>
				<q-item
					clickable
					v-ripple
					:to="{ name: 'adminSettings' }"
				>
					<q-item-section>General Settings</q-item-section>
				</q-item>
			</q-list>
		</div>
    </q-drawer>
	
    <q-page-container>
		<q-form v-if="!isAuthenticated" @submit="onLogin" class="row q-ma-xl">
			<q-card bordered class="col-5 q-pa-lg">
				<q-card-section horizontal>
					<q-input v-model="username" class="q-ma-sm full-width" filled label="Username" />
				</q-card-section>
				<q-card-section horizontal>
					<q-input v-model="password" type="password" class="q-ma-sm full-width" filled label="Password" />
				</q-card-section>
				<q-card-actions>
					<q-btn type="submit" label="Login" size="lg" push glossy color="primary" />
				</q-card-actions>
				<q-card-section v-if="authError">
					<span class="text-negative">{{ authError }}</span>
				</q-card-section>
			</q-card>
		</q-form>
		<router-view v-if="isAuthenticated" />
    </q-page-container>
	<q-footer elevated class="q-pa-md">
	FAK YER Reviews | FAK YER Press | 2023	
	</q-footer>
  </q-layout>
</template>


<script>
import { defineComponent } from 'vue'
import { authStore } from 'stores/authStore';

export default defineComponent({
	name: 'AdminLayout',
	computed: {
		isAuthenticated() {
			return this.authStore.isAuthenticated;
		},
		authError() {
			return this.authStore.error;
		}
	},
	data() {
		return {
			username: '',
			password: '',
			adminPage: '',
			authStore: authStore(),
		};
	},
	watch: {
		'$route' (to) {
			if (!to) {
				this.adminPage = '';
				return;
			}
			this.routeToTitle(to.name);
		},
	},
	mounted() {
		if (this.$route)
			this.routeToTitle(this.$route.name);
	},
	methods: {
		async onLogin() {
			this.authStore.login({ username: this.username, password: this.password });
		},
		routeToTitle(routeName) {
			switch (routeName) {
				case 'adminPosts':
					this.adminPage = '- Posts';
					break;
				case 'adminPostItem':
					this.adminPage = '- Add/Update Post';
					break;
				case 'adminMedia':
					this.adminPage = '- Media';
					break;
				case 'adminMediaFile':
					this.adminPage = '- Add/Update File';
					break;
				case 'adminSettings':
					this.adminPage = '- Site Settings';
					break;
				default:
					this.adminPage = '';
			}
		},
	}
})

</script>
