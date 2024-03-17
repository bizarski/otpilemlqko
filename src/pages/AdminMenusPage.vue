<template>
    <q-page class="flex">
          <div class="col q-pa-lg">
            <div class="row">Main menu items:</div>
            <div v-if="mainMenuState.items && mainMenuState.items.length" class="row">
                <menu-item
                    v-for="(menuItem, index) in mainMenuState.items"
                    :key="index"
                    :value="menuItem"
                    @update:value="updateMenuItem(index, $event)"
                    @delete="deleteMenuItem(index)"
                />

                <div class="col-auto">
                    <q-btn class="q-mx-md q-mb-md"  color="primary" label="Add New Menu Item" @click="onAddMenuItem" />
                </div>
            </div>

            <q-btn class="q-mx-md q-mb-md" push glossy color="primary" label="Save" @click="onSave" />
          </div>
    </q-page>
  </template>
  
<script>
import { defineComponent } from 'vue'
import { menusStore } from 'stores/menusStore';
import MenuItem from '../components/MenuItem.vue';

export default defineComponent({
    name: 'AdminSettingsPage',
    props: ['id'],
    components: {
        'menu-item': MenuItem,
    },
    computed: {

    },
    data() {
        return {
            mainMenuState: {},
            menusStore: menusStore(),
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        async onSave() {
            await this.menusStore.updateMenu(this.mainMenuState._id, this.mainMenuState);
        },
        async loadData() {
            await this.menusStore.fetchMenus();
            this.mainMenuState = this.menusStore.getByPosition('header')[0];
        },
        onAddMenuItem() {
            this.mainMenuState.items.push({
                title: '',
                path: '',
            });
        },
        updateMenuItem(item, index) {
            this.mainMenuState.items[index] = item;
        },
        deleteMenuItem(index) {
            this.mainMenuState.items = this.mainMenuState.items.filter((item, ix) => ix !== index);
        }
    }
})
</script>
  