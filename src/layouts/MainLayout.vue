<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated>
		<div v-if="!$q.screen.xs">
			<q-tabs
				v-for="menu in getMenusByPosition('header')"
				:key="menu._id"
				align="left"
				active-bg-color="info"
				indicator-color="dark"
				class="text-body"
			>
				<q-route-tab
					v-for="(item, index) in menu.items"
					:key="index"
					:to="`/post/${item.path}`"
					:label="item.title"
				/>
			</q-tabs>
			<div v-if="!post">
				<h1
					v-if="!post"
					class="text-weight-bold cursor-pointer"
					@click="$router.push({ name: 'home' })"
				>
					{{ pageTitle }}
				</h1>
				<p v-if="pageSubtitle" class="text-italic text-uppercase">
					{{ pageSubtitle }}
				</p>
			</div>
		</div>
		<div v-else>
			<div class="text-subtitle1 text-weight-bold float-left q-ma-md">{{ pageTitle }}</div>
			<q-btn class="float-right" size="xl" dense flat round icon="menu" @click="toggleRightDrawer" />
		</div>

    </q-header>

	<q-drawer v-model="rightDrawerOpen" side="right" bordered>
		<q-list
			v-for="menu in getMenusByPosition('header')"
			:key="menu._id"
			bordered
			separator
		>
			<q-item
				v-for="(item, index) in menu.items"
				:key="index"
				:to="`/post/${item.path}`"
				clickable
				v-ripple
			>
				<q-item-section>
					{{ item.title }}
				</q-item-section>
			</q-item>
		</q-list>
    </q-drawer>

	<q-page-container>
		<div class="row text-body2">
			<q-card
				v-for="(headerItem, index) in (settingsStore.settings.headerItems || []).filter(h => h.mobile || !$q.screen.xs)"
				:key="index"
				flat square class="col-md-3 col-xs-6"
			>
				<q-card-section>
					<q-icon
						v-if="headerItem.icon"
						color="info"
						:name="headerItem.icon"
						size="sm" 
					/> {{ headerItem.label }} <div class="text-weight-bold font-handil-pro">{{ headerItem.value }}</div>
				</q-card-section>
			</q-card>
		</div>
		<router-view />
    </q-page-container>
	<q-footer elevated class="text-center bg-info">
		<div class="row text-body2 q-ma-md">
			<q-card
				v-for="(footerItem, index) in (settingsStore.settings.footerItems || []).filter(h => h.mobile || !$q.screen.xs)"
				:key="index"
				flat square class="col-md-3 col-xs-6 transparent"
			>
				<q-card-section>{{ footerItem.label }}</q-card-section>
				<q-card-section class="text-weight-bold font-handil-pro"><div v-html="footerItem.value" /></q-card-section>
			</q-card>
		</div>
		<p>{{ settingsStore.settings.title }} | DevOp Marketing | 2024</p>
	</q-footer>
  </q-layout>
</template>

<script>
import { createMetaMixin } from 'quasar'
import { defineComponent } from 'vue'
import { settingsStore } from 'stores/settingsStore';
import { postsStore } from 'stores/postsStore';
import { menusStore } from 'stores/menusStore';

export default defineComponent({
	name: 'MainLayout',
	mixins: [
		createMetaMixin(function () {
			return {
				title: this.settingsStore.settings.title,
				titleTemplate: title => `${this.pageTitle} | ${title}`,
			}
		})
	],
	computed: {
		post() {
			return this.postsStore.post;
		},
	},
	data() {
		return {
			pageTitle: 'Home',
			pageSubtitle: 'Welcome to our website!',
			settingsStore: settingsStore(),
			postsStore: postsStore(),
			menusStore: menusStore(),
			rightDrawerOpen: false,
		};
	},
	watch: {
		'$route.params.id' (value) {
			this.getPostAndUpdate(value);
		},
	},
	mounted() {
		this.loadData();
	},
	methods: {
		async loadData() {
			await this.settingsStore.fetchSettings();
			await this.menusStore.fetchMenus();
			await this.getPostAndUpdate(this.$route.params.id);
		},
		async getPostAndUpdate(value) {
			await this.postsStore.fetchPost(value);
			this.pageTitle = this.post ? this.post.title : 'Home';
		},
		getMenusByPosition(position) {
			return this.menusStore.getByPosition(position);
		},
		toggleRightDrawer() {
			this.rightDrawerOpen = !this.rightDrawerOpen;
		}
	}
})

</script>
