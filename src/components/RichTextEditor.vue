<template>
    <q-tabs v-model="tab">
        <q-tab name="rich" icon="edit" label="Rich Text Editor" />
        <q-tab name="plain" icon="code" label="Code Editor" />
    </q-tabs>
    <q-separator />
    <q-tab-panels v-model="tab" animated class="bg-grey-1">
        <q-tab-panel name="rich">
            <q-editor v-model="internalValue" class="full-height" @update:model-value="updateValue" />
        </q-tab-panel>

        <q-tab-panel name="plain">
            <q-input
                v-model="internalValue"
                filled
                type="textarea"
                class="full-height"
                @update:model-value="updateValue"
            />
        </q-tab-panel>
    </q-tab-panels>
</template>
  
<script>
import { defineComponent } from 'vue'
  
export default defineComponent({
    name: 'RichTextEditor',
    props: {
        modelValue: {
            type: String,
            required: true,
        },
    },
    emits: ['update:modelValue'],
    data() {
        return {
			tab: 'rich',
            internalValue: this.modelValue,
        };
    },
    watch: {
		modelValue (value) {
			this.internalValue = value;
		},
	},
    methods: {
        updateValue(newValue) {
            this.$emit('update:modelValue', newValue); // Emitting custom event
        },
    },
})
</script>
