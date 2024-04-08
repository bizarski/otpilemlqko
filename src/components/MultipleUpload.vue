<template>
    <div class="row q-mt-lg q-mx-md">
        <q-file
            v-model="selectedFiles"
            label="Upload image(s) or drag to here"
            accept=".jpg, image/*"
            filled
            multiple
            class="fit"
            @update:model-value="handleFileSelection"
        />
    </div>
    <div
        v-for="img in selectedFiles" 
        :key="img.name"
        class="row q-mt-lg q-mx-md"
    >
        <q-input
            v-model="filenameMap[img.name]"
            label="File name"
        />

        <q-btn
            class="q-mx-md q-mb-md"
            push glossy
            label="Delete"
            color="warning"
            @click="onDelete(img.name)"
        />
    </div>
    <q-btn v-if="selectedFiles.length" class="q-mx-md q-mb-md" push glossy color="primary" label="Save" @click="onSave" />
</template>

<script>
import { defineComponent } from 'vue'
  
export default defineComponent({
    name: 'MultipleUpload',
    emits: ['files:saved'],
    data() {
        return {
			selectedFiles: [],
            filenameMap: {},
            fileExtMap: {},
        };
    },
    watch: {
		selectedFiles (value) {
			this.filenameMap = {};
			for (let i = 0; i < value.length; i++) {
                const nameArr = value[i].name.split('.');
                this.fileExtMap[value[i].name] = nameArr.pop(); //   remove extension
				this.filenameMap[value[i].name] = nameArr.join('.');
			}
		},
	},
    methods: {
		async onSave() {
            const filenameMap = {};
            for (const file of this.selectedFiles) {
                filenameMap[file.name] = `${this.filenameMap[file.name]}.${this.fileExtMap[file.name]}`;
            }
            this.$emit('files:saved', {
                filenameMap: filenameMap,
                selectedFiles: this.selectedFiles 
            });
		},
		async onDelete(filename) {
			const ix = this.selectedFiles.findIndex(f => f.name == filename);
            this.selectedFiles.splice(ix, 1);
            delete this.filenameMap[filename];
		},
        handleFileSelection() {
            console.log(this.selectedFiles[0]);
        }
    },
})
</script>
