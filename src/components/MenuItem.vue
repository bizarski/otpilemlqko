<template>
    <q-card bordered class="rounded-borders col-auto q-ma-sm">
        <q-input
            v-model="internalValue.title"
            label="Title"
            filled
            class="q-my-sm q-mx-lg"
        />
        <q-input
            v-model="internalValue.path"
            label="Slug (target)"
            filled
            class="q-my-sm q-mx-lg"
        />
        <q-card-actions>
            <q-btn class="q-mx-md q-mb-md"  color="negative" label="Delete" @click="$emit('delete')" />
        </q-card-actions>
    </q-card>
</template>
  
<script>
import { defineComponent } from 'vue'
  
export default defineComponent({
    name: 'MenuItem',
    props: {
        value: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            internalValue: this.value,
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
