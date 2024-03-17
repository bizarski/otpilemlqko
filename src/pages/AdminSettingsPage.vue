<template>
    <q-page class="flex">
          <div class="col q-pa-lg">
            <q-input
                v-model="settingsState.title"
                label="Site Title"
                filled
                class="q-my-sm q-mx-lg"
            />

            <q-input
                v-model="settingsState.description"
                label="Site Description"
                filled
                class="q-my-sm q-mx-lg"
            />

            <div class="row">Header items:</div>
            <div class="row">
                <header-item
                    v-for="(headerItem, index) in settingsState.headerItems"
                    :key="index"
                    :value="headerItem"
                    @update:value="updateHeaderItem(index, $event)"
                    @delete="deleteHeaderItem(index)"
                />
                <div class="col-auto">
                    <q-btn class="q-mx-md q-mb-md"  color="primary" label="Add New Header Item" @click="onAddHeaderItem" />
                </div>
            </div>

            <div class="row">Footer items:</div>
            <div class="row">
                <footer-item
                    v-for="(footerItem, index) in settingsState.footerItems"
                    :key="index"
                    :value="footerItem"
                    @update:value="updateFooterItem(index, $event)"
                    @delete="deleteFooterItem(index)"
                />
                <div class="col-auto">
                    <q-btn class="q-mx-md q-mb-md"  color="primary" label="Add New Footer Item" @click="onAddFooterItem" />
                </div>
            </div>
            
            <q-btn class="q-mx-md q-mb-md" push glossy color="primary" label="Save" @click="onSave" />
          </div>
    </q-page>
  </template>
  
<script>
import { defineComponent } from 'vue'
import { settingsStore } from 'stores/settingsStore';
import HeaderItem from '../components/HeaderItem.vue';
import FooterItem from '../components/FooterItem.vue';

export default defineComponent({
    name: 'AdminSettingsPage',
    props: ['id'],
    components: {
        'header-item': HeaderItem,
        'footer-item': FooterItem,
    },
    computed: {

    },
    data() {
    return {
        settingsState: {},
        settingsStore: settingsStore(),
    };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async onSave() {
            await this.settingsStore.updateSettings(this.settingsState);
        },
        async loadData() {
            await this.settingsStore.fetchSettings();
            this.settingsState = { ...this.settingsStore.settings };
        },
        updateHeaderItem(item, index) {
            this.settingsState.headerItems[index] = item;
        },
        updateFooterItem(item, index) {
            this.settingsState.footerItems[index] = item;
        },
        deleteHeaderItem(index) {
            this.settingsState.headerItems = this.settingsState.headerItems.filter((_, ix) => ix !== index);
        },
        deleteFooterItem(index) {
            this.settingsState.footerItems = this.settingsState.footerItems.filter((_, ix) => ix !== index);
        },
        onAddHeaderItem() {
            this.settingsState.headerItems.push({
                label: '',
                value: '',
                icon: '',
                mobile: true,
            });
        },
        onAddFooterItem() {
            this.settingsState.footerItems.push({
                label: '',
                value: '',
                mobile: true,
            });
        },
    }
})
</script>
  