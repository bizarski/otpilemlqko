<template>
  <q-page class="flex">
		
		<div class="col q-pa-lg">
 
			<q-splitter :model-value=30>
			
				<template v-slot:before>
					<div class="text-center">
						<q-btn
							label="CREATE"
							push glossy
							size="xl"
							color="primary"
							class="q-ma-lg"
							@click="createNewPost"
						/>
					
						<q-infinite-scroll ref="postsInfiniteScroll" @load="onLoadMore" :offset="100">
							<q-list>
								<q-item
									v-for="post in posts"
									:key="post._id"
									:to="{ name: 'adminPostItem', params: { id: post._id } }"
									clickable
									class="col-lg-4 col-md-6 col-sm-12 text-center"
								>
									<q-item-section>{{post.title}}</q-item-section>
								</q-item>
							</q-list>
							<template v-slot:loading>
								<div class="row justify-center q-my-md">
									<q-spinner-dots color="primary" size="40px" />
								</div>
							</template>
						</q-infinite-scroll>
					</div>
				</template>
			
				<template v-slot:after>
					<div class="row q-mt-lg" v-if="post && !postsStore.loading">
						<q-card class="fit bg-grey-2">
							<q-input
								v-model="post.title"
								label="Title"
								filled
								class="q-my-sm q-mx-lg"
							/>
							
							<rich-text-editor v-model="post.body" />
					
							<q-input
								v-model="post.slug"
								label="Slug"
								filled
								class="q-my-sm q-mx-lg"
							/>
							
							<q-separator />
							<h4 class="q-mx-md">Cover image</h4>
							
							<q-file
								v-model="coverImage"
								label="Cover image"
								accept=".jpg, image/*"
								filled
								style="max-width: 400px"
								class="q-my-sm q-mx-lg"
							/>

							<q-card v-if="post.coverImage" class="q-ma-lg">
								<q-img :alt="post.coverImage" :src="`${settingsStore.CDN}/images/${post.coverImage}`" width="300px" />
							</q-card>

							<q-separator />
							<h4 class="q-mx-md">Carousel images</h4>

							<q-radio v-model="post.carouselType" val="single" label="Single Image Per Slide" />
							<q-radio v-model="post.carouselType" val="double" label="Two Images Per Slide" />
							
							<div class="row">
								<image-card
									v-for="(imageCard, index) in post.carouselSlides"
									:key="index"
									:value="imageCard"
									:options="mediaFiles.filter(mediaFilesFilter)"
									:show-size="false"
									:show-position="false"
									@input-value="filterMediaItems"
									@delete="deleteCarouselItem(index)"
								/>

								<div class="col-auto">
									<q-btn class="q-mx-md q-mb-md"  color="primary" label="Add Image Card" @click="onAddCarouselImage" />
								</div>
							</div>

							<q-separator />
							<h4 class="q-mx-md">Image cards</h4>

							<div class="row">
								<image-card
									v-for="(imageCard, index) in post.imageCards"
									:key="index"
									:value="imageCard"
									:options="mediaFiles.filter(mediaFilesFilter)"
									@input-value="filterMediaItems"
									@delete="deleteImageCardItem(index)"
								/>

								<div class="col-auto">
									<q-btn class="q-mx-md q-mb-md"  color="primary" label="Add Image Card" @click="onAddImageCard" />
								</div>
							</div>
							
							<q-card-actions>
								<q-btn class="q-mx-md q-mb-md" size="lg" push glossy color="positive" label="Save" @click="onSave" />
								<q-btn class="q-mx-md q-mb-md" size="lg" push glossy color="negative" label="Delete" @click="onDelete" />
							</q-card-actions>
						</q-card>
					</div>
					<div class="fit text-center">
						<q-spinner
							v-if="postsStore.loading"
							color="primary"
							size="3em"
						/>
					</div>
				</template>
			
			</q-splitter>
		</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { postsStore } from 'stores/postsStore';
import { settingsStore } from 'stores/settingsStore';
import { mediaStore } from 'stores/mediaStore';

import RichTextEditor from '../components/RichTextEditor.vue';
import ImageCard from '../components/ImageCard.vue';

export default defineComponent({
	name: 'AdminPostsPage',
	props: ['id'],
	components: {
		'rich-text-editor': RichTextEditor,
		'image-card': ImageCard,
	},
	computed: {
		post() {
			return this.postsStore.post;
		},
	},
	data() {
		return {
			posts: [],
			offset: 0,
			coverImage: null,
			postsStore: postsStore(),
			settingsStore: settingsStore(),
			mediaStore: mediaStore(),
			hasMorePosts: true,
			mediaFiles: [],
			mediaFilesFilter: () => true,
		};
	},
	watch: {
		'$route.params.id' (value) {
			this.postsStore.fetchPostById(value);
		},
	},
	mounted() {
		this.loadData();
	},
	methods: {
		filterMediaItems(value) {
			this.mediaFilesFilter = f => f.includes(value);
		},
		onAddImageCard() {
			this.post.imageCards.push({
				caption: '',
				filename: '',
				position: 'left',
			})
		},
		onAddCarouselImage() {
			this.post.carouselSlides.push({
				caption: '',
				filename: '',
				position: 'left',
			})
		},
		async onSave() {
			const postId = this.post._id;
			const formData = new FormData();
			if (this.coverImage) {
				formData.append('coverImage', this.coverImage);
			}
			formData.append('data', JSON.stringify({
				title: this.post.title,
				body: this.post.body,
				slug: this.post.slug,
				carouselType: this.post.carouselType,
				carouselSlides: this.post.carouselSlides,
				imageCards: this.post.imageCards,
			}));
			
			if (postId) {
				await this.postsStore.updatePost(postId, formData);
				this.$router.push({ name: 'adminPostItem', params: { id: postId } });
				return;
			}

			await this.postsStore.saveNewPost(formData);

			this.resetPosts();
			this.$router.push({ name: 'adminPosts' });
		},
		async onDelete() {
			const postId = this.post._id;
			const formData = new FormData();
			formData.append('data', JSON.stringify({ deleted: true }));
			await this.postsStore.updatePost(postId, formData);
			this.resetPosts();
			this.$router.push({ name: 'adminPosts' });
		},
		resetPosts() {
			this.hasMorePosts = true;
			this.offset = 0;
			this.postsStore.resetPosts();
			this.posts = [];
			this.$refs.postsInfiniteScroll.resume();
			this.$refs.postsInfiniteScroll.trigger();
		},
		async loadData() {
			this.postsStore.resetPosts();
			if (this.$route.params.id) {
				await this.postsStore.fetchPostById(this.$route.params.id);
			}
			await this.mediaStore.fetchFiles();
			this.mediaFiles = this.mediaStore.getFiles().map(f => f.filename);
		},
		async onLoadMore(index, done) {
			if (!this.hasMorePosts) {
				this.$refs.postsInfiniteScroll.stop();
				return done();
			}
			this.hasMorePosts = await this.postsStore.fetchMorePosts({ offset: this.offset });
			this.posts = this.postsStore.posts;
			this.offset += 9;
			done();
		},
		createNewPost() {
			this.post = this.postsStore.addNewPost();
		},
	}
})



</script>
