import idb from './indexedDB_library.js';

export default fetch('http://localhost:8081/data/restaurants.json').then(function(data){
  return data.json();}).then(function(parsedData){
    return parsedData.restaurants}).then(function(restaurants){
        return idb.open('restaurants', 1, function(db){
          var restaurantsOS = db.createObjectStore('restaurants', {keyPath: 'id', autoIncrement: true});
          restaurantsOS.put(restaurants);
          return db;
        });
      });

