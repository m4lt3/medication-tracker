import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { handler as db, storeNames } from '@/utils/DataHandler.js';
import { handler as config } from '@/utils/ConfigHandler.js';

export const useIndexedStore = defineStore('indexed', () => {
  let initiated = false;

  async function init() {
    if (!initiated) {
      await db.init();
      for (let storeName in storeNames) {
        await db.sanitizeStore(storeNames[storeName]);
      }

      for (let storeName in storeNames) {
        await loadStore(storeName);
      }

      initiated = true;
    }
  }

  async function purge() {
    if (!initiated) {
      await db.init();
    }

    await db.purge();

    for (let storeName in storeNames) {
      loadStore(storeName);
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
    await loadStore(store)
  }

  async function remove (store, id) {
    await db.delete(storeNames[store], id);
    await loadStore(store)
  }

  async function update (store, id, item) {
    await db.update(storeNames[store], id, item);
    await loadStore(store)
  }

  async function markOrDeleteExpiredIntakes() {
    let toDelete = [];
    let now = Date.now();

    for (let itemId in intakes.value) {
      let expired = [];

      // checking each ingredient for expiry
      for (let ingredient of pills.value[intakes.value[itemId].pill].contents) {
        if (intakes.value[itemId].takenAt <= now - categories.value[ingredient.ingredient].expires) {
          expired.push(Number(ingredient.ingredient));
        }
      }


      if (expired.length == pills.value[intakes.value[itemId].pill].contents.length) {
        // If all contents have expired, mark intake for deletion
        toDelete.push(Number(itemId));
      }
      if (expired.length > 0) {
        // if any contents have expired, save it to the db
        let newIntake = JSON.parse(JSON.stringify(intakes.value[itemId]));
        delete newIntake.id;
        newIntake.expired = expired;

        await db.update(storeNames["intakes"], Number(itemId), newIntake);
      }
    }


    if (!config.read().intakeHistory) {
      // deleting completely expired intakes
      for (let del of toDelete) {
        await db.delete(storeNames["intakes"], del);
      }
    }

    await loadStore("intakes");
  }

  const pills = ref({});
  const pillGroups = ref({});
  const categories = ref({});
  const intakes = ref([]);

  const passwordRequired = ref(false);

  return {
    init, purge,
    add, remove, update, markOrDeleteExpiredIntakes,
    pills, pillGroups, categories, intakes,
    passwordRequired
  };
})
