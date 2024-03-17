
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
	props: true,
    children: [
		{ path: '', name: 'home', component: () => import('pages/SinglePostPage.vue') },
		{ path: 'post/:id', name: 'post', component: () => import('pages/SinglePostPage.vue'), props: true },
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
	props: true,
    children: [
		{ path: 'posts', name: 'adminPosts', component: () => import('pages/AdminPostsPage.vue') },
		{ path: 'posts/:id', name: 'adminPostItem', component: () => import('pages/AdminPostsPage.vue'), props: true },
		{ path: 'media', name: 'adminMedia', component: () => import('pages/AdminMediaPage.vue') },
		{ path: 'media/:id', name: 'adminMediaFile', component: () => import('pages/AdminMediaPage.vue'), props: true },
    { path: 'menus', name: 'adminMenus', component: () => import('pages/AdminMenusPage.vue') },
		{ path: 'settings', name: 'adminSettings', component: () => import('pages/AdminSettingsPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
