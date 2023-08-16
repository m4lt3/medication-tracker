import { validator } from '@/utils/DataValidator.js';

let db = { db: {}, stores: {} };

const handler = {};

const storeNames = {
  categories: import.meta.env.VITE_CATEGORY_STORE_NAME,
  pillGroups: import.meta.env.VITE_PILL_GROUP_STORE_NAME,
  pills: import.meta.env.VITE_PILL_STORE_NAME,
  intakes: import.meta.env.VITE_INTAKE_STORE_NAME
};

function getStaticNameOf(storeName) {
  for (let staticName in storeNames) {
    if (storeNames[staticName] == storeName) {
      return staticName;
    }
  }
  return false;
}

function validate(storeName, item, checkDependencies = true) {
  return new Promise(async (resolve, reject) => {
    let valid = validator.validate(getStaticNameOf(storeName), item);
    if (valid !== true) {
      reject(valid);
      return;
    }

    if (checkDependencies) {
      switch (getStaticNameOf(storeName)) {
        case 'pills':
          for (let ingredient of item.contents) {
            if ((await handler.getById(storeNames.categories, ingredient.ingredient)) == null) {
              reject(new Error(`referenced ingredient with the id '${ingredient.ingredient}' does not exist`));
              return;
            }
          }

          if (item.group) {
            if ((await handler.getById(storeNames.pillGroups, item.group)) == null) {
              reject(new Error(`referenced pill group with id '${item.group}' does not exist`));
              return;
            }
          }
          break;
        case 'intakes':
          if ((await handler.getById(storeNames.pills, item.pill)) == null) {
            reject(new Error(`pill with id '${item.pill}' does not exist`));
            return;
          }
          break;
      }
    }

    resolve(true);
  });
}

handler.init = () => {
  return new Promise((resolve, reject) => {
    let request = window.indexedDB.open(import.meta.env.VITE_DATABASE_NAME, 1);

    request.onerror = (e) => {
      console.error(e);
      reject(e);
    };

    request.onsuccess = (e) => {
      db.db = e.target.result;
      resolve();
    };

    request.onupgradeneeded = (e) => {
      db.db = e.target.result;

      for (let storeName in storeNames) {
        db.stores[storeName] = db.db.createObjectStore(storeNames[storeName], { autoIncrement: true });
      }
    };
  });

};

handler.sanitizeStore = (storeName) =>  {
  return new Promise(async (resolve, reject) => {
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }


    let items = await handler.getAllFrom(storeName);
    let toDelete = [];

    for (let itemId in items) {
      try {
        await validate(storeName, items[itemId]);
      } catch (e) {
        toDelete.push(itemId);
      }
    }

    for (let del of toDelete) {
      await handler.delete(storeName, del);
    }
    resolve();
  });
}

handler.getAllFrom = (storeName) => {
  return new Promise((resolve, reject) => {
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }

    const transaction = db.db.transaction([storeName]);
    const loadStore = transaction.objectStore(storeName);
    const result = loadStore.openCursor();

    const results = {};

    result.onerror = (e) => {
      console.error(`Could not load items from Collection '${storeName}':`, e);
      reject(e);
    }

    result.onsuccess = (e) => {
      const cursor = e.target.result
      if (cursor) {
        // TODO check for encryption

        results[cursor.key] = cursor.value;
        cursor.continue();

      } else {
        resolve(results);
      }

    }
  });
};

handler.getById = (storeName, id) => {
  return new Promise((resolve, reject) => {
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }

    const transaction = db.db.transaction([storeName]);
    const loadStore = transaction.objectStore(storeName);
    let request = loadStore.get(IDBKeyRange.only(id));

    request.onerror = (e) => {
      reject(e);
    }

    request.onsuccess = (e) => {
      // TODO check for encryption
      if ( (e.target.result == undefined) || Object.keys(e.target.result).length == 0) {
        resolve(null);
        return;
      }
      resolve(e.target.result);
    }
  });
};

handler.query = (storeName, filters) => {
  return new Promise((resolve, reject) => {
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }

    const transaction = db.db.transaction([storeName]);
    const loadStore = transaction.objectStore(storeName);
    const result = loadStore.openCursor();

    const results = {};

    result.onerror = (e) => {
      console.error(`Could not load items from Collection '${storeName}':`, e);
      reject(e);
    }

    result.onsuccess = (e) => {
      const cursor = e.target.result
      if (cursor) {

        // TODO check for encryption

        for (let filter in filters) {
          if (typeof filters[filter] == 'object') {
            // special comparators
            if (filters[filter].$elemMatch != undefined) {
              // item is array and children should be matched
              let itemMatched = false;
              for (let item of cursor.value[filter]) {
                let thisItemMatches = true;
                // checking filters for this element
                for (let elemFilter in filters[filter].$elemMatch) {
                  if (item[elemFilter] != filters[filter].$elemMatch[elemFilter]) {
                    thisItemMatches = false;
                    break;
                  }
                }


                if (thisItemMatches) {
                  itemMatched = true;
                  break;
                }
              }

              if (!itemMatched) {
                cursor.continue();
                return;
              }
            }
          } else {
            // compare primitive values
            if (cursor.value[filter] != filters[filter]) {
              cursor.continue();
              return;
            }
          }
        }

        results[cursor.key] = cursor.value;
        cursor.continue();

      } else {
        resolve(results);
      }

    }
  });
}

handler.insert = (storeName, item, id = null) => {
  return new Promise(async (resolve, reject) => {
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }

    // Validating
    try {
      await validate(storeName, item);
    } catch (e) {
      reject(e);
      return
    }

    // TODO add encryption

    const transaction = db.db.transaction([storeName], "readwrite");
    const insertStore = transaction.objectStore(storeName);
    const request = insertStore.add(item, id);
    request.onsuccess = (e) => {
      resolve(e.target.result);
    };
    request.onerror = (e) => {
      reject(e);
    };
  });
};

handler.update = (storeName, id, newItem) => {
  return new Promise(async (resolve, reject) => {
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }

    // Validating
    try {
      await validate(storeName, newItem);
    } catch (e) {
      reject(e);
      return
    }

    // TODO add ancryption

    const transaction = db.db.transaction([storeName], "readwrite");
    const insertStore = transaction.objectStore(storeName);
    const request = insertStore.put(newItem, id);

    request.onerror = (e) => {
      reject(e);
    }

    request.onsuccess = (e) => {
      resolve();
    }

  });
};

handler.delete = (storeName, id, retainReferences = true) => {
  return new Promise(async (resolve, reject) => {
    id = Number(id);
    if (! db.db.objectStoreNames.contains(storeName)) {
      reject(new Error(`Store with name '${storeName}' does not exist`));
      return;
    }

    let delItem = await handler.getById(storeName, id);


    if (delItem == null) {
      resolve();
      return;
    }

    if (retainReferences) {
      let dependents = [];
      switch (getStaticNameOf(storeName)) {
        case 'categories':
          dependents = await handler.query(storeNames.pills, { contents: { $elemMatch: { ingredient: id } } });
          if (Object.keys(dependents).length > 0) {
            reject(new Error(`Category with the ID '${id}' cannot be deleted as it has pills referencing this ingredient: ` + JSON.stringify(dependents)));
            return;
          }
          break;
        case 'pillGroups':
          dependents = await handler.query(storeNames.pills, { group: id });
          if (Object.keys(dependents).length > 0) {
            reject(new Error(`Pill group with the ID '${id}' cannot be deleted as it has members: ` + JSON.stringify(dependents)));
            return;
          }
          break;
        case 'pills':
          dependents = await handler.query(storeNames.intakes, { pill: id });
          if (Object.keys(dependents).length > 0) {
            reject(new Error(`Pill with the ID '${id}' cannot be deleted as it has active intakes: ` + JSON.stringify(dependents)));
            return;
          }
          break;
      }
    }

    const transaction = db.db.transaction([storeName], "readwrite");
    const insertStore = transaction.objectStore(storeName);
    const request = insertStore.delete(id);

    request.onsuccess = (e) => {
      resolve();
    }

    request.onerror = (e) => {
      reject(e);
    }
  });
}

export { handler, storeNames };
