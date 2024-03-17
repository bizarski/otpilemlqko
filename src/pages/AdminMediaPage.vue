<template>
  <q-page class="flex">
		
		<div class="col q-pa-lg">
  
			<q-splitter :model-value=30>
			
				<template v-slot:before>
					<div class="text-center">
						<q-btn
							label="NEW FILE"
							push glossy
							size="xl"
							color="primary"
							class="q-ma-lg items-center"
							@click="createNewFile"
						/>
						
						<q-list>
							<q-item
								v-for="fileItem in files"
								:key="fileItem._id"
								:to="{ name: 'adminMediaFile', params: { id: fileItem._id } }"
								clickable
								class="col-lg-4 col-md-6 col-sm-12"
							>
								<q-item-section>{{fileItem.filename}}</q-item-section>
							</q-item>
						</q-list>
					</div>
				</template>
			
				<template v-slot:after>
					<q-spinner
						v-if="mediaStore.loading"
						color="primary"
						size="3em"
					/>

					<multiple-upload v-if="isNew" @files:saved="onSave" />

					<div v-if="file && !mediaStore.loading">
						<div class="row q-mt-lg q-mx-md">
							<q-input
								v-model="file.filename"
								label="File name"
							/>

							<q-btn class="q-mx-md q-mb-md" push glossy color="primary" label="Save" @click="onSave" />
							<q-btn
								class="q-mx-md q-mb-md"
								push glossy
								label="Delete"
								color="warning"
								@click="onDelete"
								/>
						</div>
						<div class="row">
							<q-card class="q-ma-lg">
								<q-img :alt="file.filename" :src="`${settingsStore.CDN}/media/${file.filename}`" width="300px" />
							</q-card>
						</div>
					</div>
				</template>
			
			</q-splitter>
		</div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { mediaStore } from 'stores/mediaStore';
import { settingsStore } from 'stores/settingsStore';

import MultipleUpload from '../components/MultipleUpload.vue';

export default defineComponent({
	name: 'AdminMediaPage',
	components: {
		'multiple-upload': MultipleUpload,
	},
	data() {
		return {
			files: [],
			file: null,
			isNew: false,
			imageFileName: {},
			mediaStore: mediaStore(),
			settingsStore: settingsStore(),
		};
	},
	watch: {
		'$route.params.id' (value) {
			if (value) {
				this.file = this.mediaStore.getFileById(value);
				this.isNew = false;
			}
		},
	},
	mounted() {
		this.loadData();
	},
	methods: {
		async onSave(data) {
			const fileId = this.file && this.file._id;
			if (fileId) {
				await this.mediaStore.updateFile(fileId, {
					filename: this.file.filename
				});
				return;
			}
			
			const formData = new FormData();
			formData.append('data', JSON.stringify({
				imageFileName: data.filenameMap,
			}));
			for (const fileData of data.selectedFiles) {
				formData.append('media', fileData);
			}

			const response = await this.mediaStore.saveNewFile(formData);

			await this.loadData();
			this.$router.push({ name: 'adminMediaFile', params: { id: response.insertedIds[0] } });
		},
		async onDelete() {
			await this.mediaStore.deleteFile(this.file._id);
			await this.loadData();
			this.file = null;
			this.$router.push({ name: 'adminMedia' });
		},
		async loadData() {
			await this.mediaStore.fetchFiles();
			this.files = this.mediaStore.getFiles();
		},
		createNewFile() {
			this.$router.push({ name: 'adminMedia' });
			this.file = null;
			this.isNew = true;
		}
	}
});
</script>
