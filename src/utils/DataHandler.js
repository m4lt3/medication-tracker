import { validator } from '@/utils/DataValidator.js';
import { handler as config } from '@/utils/ConfigHandler.js';
import CryptoJS from 'crypto-js';

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

function handleEncryption(item) {
  if (config.read().encrypted) {
    item = CryptoJS.AES.encrypt(JSON.stringify(item), config.getPassword()).toString();
  }
  return item;
}

function handleDecryption(item, decrypt) {
  if (typeof(item) == 'string' && decrypt) {
    try {
      let decrypted = CryptoJS.AES.decrypt(item, config.getPassword()).toString(CryptoJS.enc.Utf8);
      item = JSON.parse(decrypted);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(`Could not decrypt database. Is the password correct?`);
      } else {
        throw e;
      }
    }
  }
  return item;
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

handler.getAllFrom = (storeName, decrypt = true) => {
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
        let item = handleDecryption(cursor.value, decrypt);

        results[cursor.key] = item;
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
      if (e.target.result == undefined) {
        resolve(null);
        return;
      }
      resolve(handleDecryption(e.target.result));
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

        let decryptedItem = handleDecryption(cursor.value);

        for (let filter in filters) {
          if (typeof filters[filter] == 'object') {
            // special comparators
            if (filters[filter].$elemMatch != undefined) {
              // item is array and children should be matched
              let itemMatched = false;
              for (let item of decryptedItem[filter]) {
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
            if (decryptedItem[filter] != filters[filter]) {
              cursor.continue();
              return;
            }
          }
        }

        results[cursor.key] = decryptedItem;
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

    item = handleEncryption(item);

    const transaction = db.db.transaction([storeName], "readwrite");
    const insertStore = transaction.objectStore(storeName);
    let request;
    if (id) {
      request = insertStore.add(item, id);
    } else {
      request = insertStore.add(item);
    }
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

    newItem = handleEncryption(newItem);

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

handler.encryptDB = () => {
  return new Promise(async (resolve, reject) => {
    // since encryption is already enabled in the settings, all new writes will be encrypted
    // thus i just need to "update" every entry
    for (let storeName in storeNames) {
      let store = await handler.getAllFrom(storeNames[storeName]);
      for (let itemId in store) {
        await handler.update(storeNames[storeName], Number(itemId), store[itemId]);
      }
    }

    resolve();
  });
};

handler.decryptDB = () => {
  return new Promise(async (resolve, reject) => {
    let tmpStores = {};

    for (let storeName in storeNames) {
      tmpStores[storeName] = await handler.getAllFrom(storeNames[storeName]);
    }

    let conf = config.read();
    conf.encrypted = false;
    delete conf.testphrase;
    config.write(conf);
    config.setPassword();

    for (let storeName in tmpStores) {
      for (let itemId in tmpStores[storeName]) {
        await handler.update(storeNames[storeName], Number(itemId), tmpStores[storeName][itemId]);
      }
    }

    resolve();
  });
};

handler.purge = () => {
  return new Promise((resolve, reject) => {
    let stores = {};
    for (let storeName in storeNames) {
      stores[storeNames[storeName]] = false;
    }

    let purgeTransaction = db.db.transaction(Object.keys(stores), "readwrite");

    for (let storeName in storeNames) {
      purgeTransaction.objectStore(storeNames[storeName]).clear().onsuccess = (e) => {
        if (e.target.result === undefined) {
          stores[storeNames[storeName]] = true;

          for (let store in stores) {
            if (!stores[store]) {
              return;
            }
          }

          resolve();
        }
      }
    }
  });
}

export { handler, storeNames };
