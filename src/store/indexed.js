import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { handler as db, storeNames } from '@/utils/DataHandler.js';

export const useIndexedStore = defineStore('indexed', () => {
  let initiated = false;

  async function init() {
    if (!initiated) {
      await db.init();
      for (let storeName in storeNames) {
        await db.sanitizeStore(storeNames[storeName]);
      }

      for (let storeName in storeNames) {
        loadStore(storeName);
      }

      initiated = true;
    }
  }

  async function loadStore(storeName) {
    switch(storeName){
      case 'pills':
        pills.value = await db.getAllFrom(storeNames['pills']);
        break;
      case 'pillGroups':
        pillGroups.value = await db.getAllFrom(storeNames['pillGroups']);
        break;
      case 'categories':
        categories.value = await db.getAllFrom(storeNames['categories']);
        break;
      case 'intakes':
        intakes.value = await db.getAllFrom(storeNames['intakes']);
        break;
    }
  }

  async function add (store, item, id = null) {
    await db.insert(storeNames[store], item, id);
    loadStore(store)
  }

  async function remove (store, id) {
    await db.delete(storeNames[store], id);
    loadStore(store)
  }

  async function update (store, id, item) {
    await db.update(storeNames[store], id, item);
    loadStore(store)
  }

  const pills = ref({});
  const pillGroups = ref({});
  const categories = ref({});
  const intakes = ref([]);

  return { init, add, remove, update, pills, pillGroups, categories, intakes };
})
