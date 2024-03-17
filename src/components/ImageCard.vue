<template>
    <q-card bordered class="rounded-borders col-auto q-ma-sm">
        <rich-text-editor v-model="internalValue.caption" />
        <q-card-section>
            <q-select
                v-model="internalValue.filename"
                :options="options"
                use-input
                label="Media (image)"
                @input-value="$emit('input-value', $event)"
            />
            <q-separator />
            <q-card v-if="!!internalValue.filename" class="q-ma-lg">
                <q-img :alt="internalValue.filename" :src="`${settingsStore.CDN}/media/${internalValue.filename}`" width="150px" />
            </q-card>
            <q-select
                v-if="showPosition"
                v-model="internalValue.position"
                label="Image position"
                :options="['left', 'right']"
            />
            <q-select
                v-if="showSize"
                v-model="internalValue.size"
                label="Image size"
                :options="['xs', 'sm', 'md', 'lg', 'xl']"
            />
        </q-card-section>
        <q-card-actions>
            <q-btn class="q-mx-md q-mb-md"  color="negative" label="Delete" @click="$emit('delete')" />
        </q-card-actions>
    </q-card>
</template>
  
<script>
import { defineComponent } from 'vue'
import { settingsStore } from 'stores/settingsStore';

import RichTextEditor from './RichTextEditor.vue';
  
export default defineComponent({
    name: 'ImageCard',
    components: {
		'rich-text-editor': RichTextEditor,
	},
    props: {
        value: {
            type: Object,
            required: true,
        },
        options: {
            type: Array,
            required: true,
        },
        showPosition: {
            type: Boolean,
            default: true,
        },
        showSize: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            internalValue: this.value,
			settingsStore: settingsStore(),
        };
    },
    methods: {
        updateValue(newValue) {
            this.internalValue = newValue;
            this.$emit('update:value', newValue); // Emitting custom event
        },
    },
})
</script>
