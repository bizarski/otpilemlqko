<template>
  <q-page class="flex">
		<div
			v-if="post"
			class="full-width"
		>
			<q-parallax v-if="post.coverImage && !hasCarousel" :height="300" class="bg-black">
				<template v-slot:media>
					<img style="opacity: .7" :src="`${settingsStore.CDN}/images/${post.coverImage}`">
				</template>
				<template v-slot:content>
					<h1 class="text-white font-handil-pro text-h2 text-center">{{ post.title }}</h1>
				</template>
			</q-parallax>
			<div v-if="!post.coverImage && !hasCarousel" class="row justify-center">
				<div class="col-6 bg-primary rounded-borders">
					<h1 class="font-handil-pro text-h2 text-center">{{ post.title }}</h1>
				</div>
			</div>

			<div
				v-if="hasCarousel"
				class="row justify-center"
			>
				<div class="col">
					<q-carousel
						v-if="post.carouselType === 'double'"
						v-model="currentSlide"
						animated
						transition-prev="slide-right"
						transition-next="slide-left"
						swipeable
						autoplay
						control-color="primary"
						navigation
						height="400px"
						class="bg-grey-9"
					>
						<q-carousel-slide
							v-for="slide in post.carouselSlides.map((f, ix) => ({ ...f, index: ix })).filter((_, ix) => ix === 0 || ix % 2 === 0)"
							:key="slide.filename" 
							:name="slide.filename"
							class="column no-wrap"
						>
							<div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
								<q-img class="full-height col-6" :src="`${settingsStore.CDN}/media/${post.carouselSlides[slide.index].filename}`">
									<div class="absolute-top text-subtitle1">{{ `${post.carouselSlides[slide.index].caption}` }}</div>
								</q-img>
								<q-img class="full-height col-6" :src="`${settingsStore.CDN}/media/${post.carouselSlides[slide.index+1].filename}`">
									<div class="absolute-top text-subtitle1">{{ `${post.carouselSlides[slide.index+1].caption}` }}</div>
								</q-img>
							</div>
						</q-carousel-slide>
					</q-carousel>
				</div>
			</div>

			<div class="row justify-center">
				<div class="col col-xl-7 col-lg-7 col-md-12 col-xs-12 col-sm-12">

					<q-carousel
						v-if="post.carouselType === 'single'"
						v-model="currentSlide"
						animated
						transition-prev="slide-right"
						transition-next="slide-left"
						swipeable
						autoplay
						control-color="primary"
						navigation
						height="400px"
					>
						<q-carousel-slide
							v-for="slide in post.carouselSlides"
							:key="slide.filename" 
							:name="slide.filename"
							class="column no-wrap"
						>
							<div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
								<q-img class="full-height" :src="`${settingsStore.CDN}/media/${slide.filename}`">
									<div class="absolute-top text-subtitle1">{{ `${slide.caption}` }}</div>
								</q-img>
							</div>
						</q-carousel-slide>
					</q-carousel>

					<div
						v-if="post.imageCards && post.imageCards.length"
					>
						<q-card
							v-for="(imageCard, index) in post.imageCards"
							:key="index"
							square
							class="row q-ma-md"
						>
							<q-card-section horizontal class="full-width">
								<div v-if="imageCard.position === 'right'" v-html="imageCard.caption" class="col q-px-sm" />
								<div class="col" :class="getImageCardSize(imageCard.size)">
									<q-img
										:src="`${settingsStore.CDN}/media/${imageCard.filename}`"
										:class="{ 'float-right': (imageCard.position === 'right') }"
									/>
								</div>
								<div v-if="imageCard.position === 'left'" v-html="imageCard.caption" class="col q-px-sm" />
							</q-card-section>
						</q-card>
					</div>

					<div v-html="post.body" class="q-pa-lg text-body" />
				</div>
			</div>
		</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { postsStore } from 'stores/postsStore';
import { settingsStore } from 'stores/settingsStore';

export default defineComponent({
	name: 'SinglePostPage',
	props: ['id'],
	watch: {
		post() {
			this.currentSlide = this.post?.carouselSlides?.length && this.post.carouselSlides[0].filename;
		},
	},
	computed: {
		post() {
			return this.postsStore.post;
		},
		hasCarousel() {
			return this.postsStore.post.carouselSlides && this.postsStore.post.carouselSlides.length
		},
	},
	data() {
		return {
			message: 'Hello, world',
			content: 'test',
			postsStore: postsStore(),
			settingsStore: settingsStore(),
			currentSlide: null,
		};
	},
	methods: {
		getImageCardSize(size) {
			switch (size) {
				case 'xs':
					return 'col-2';
				case 'sm':
					return 'col-3';
				case 'md':
					return 'col-4';
				case 'lg':
					return 'col-5';
				case 'xl':
					return 'col-6';
			}
		},
	},
})

</script>
