<template>
    <q-card bordered class="rounded-borders col-auto q-ma-sm">
        <q-input
            v-model="internalValue.label"
            label="Label"
            filled
            class="q-my-sm q-mx-lg"
        />
        <q-input
            v-model="internalValue.value"
            label="Value"
            filled
            class="q-my-sm q-mx-lg"
        />
        <q-input
            v-model="internalValue.icon"
            label="Icon"
            filled
            class="q-my-sm q-mx-lg"
        />
        <q-checkbox
            v-model="internalValue.mobile"
            label="Show in Mobile"
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
    name: 'HeaderItem',
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
