<template>
    <header class="sticky top-0">
        <nav class="container py-4 relative" :class="{ 'bg-weather-primary/80 shadow-lg' : scrollPosition > 10 }">
            <p class="gap-2 flex justify-center items-center text-sm text-white">
                <i class="fa-solid fa-location-arrow text-lg"></i>
                <!-- Show places saved if sorting is 0. -->
                <template v-for="(savedLocation, indexSavedLocation) in savedLocations" :key="indexSavedLocation">
                    <span v-if="savedLocation.sorting === 0">
                        {{ savedLocation.place }}
                    </span>
                </template>
            </p>
            <p class="absolute top-1/2 right-4 -translate-y-1/2 text-xs text-white space-x-4">
                <i @click="toggleModalSearchResult" class="fa-solid fa-pen-to-square cursor-pointer"></i>
                <i @click="toggleModal" class="fa-solid fa-circle-info cursor-pointer"></i>
            </p>
        </nav>
        <BaseModal :modal-active="modalActive" @close-modal="toggleModal">
            <div class="text-black text-sm mb-8">
                <div class="border-b border-gray-500 text-xl mb-8 pb-2">
                    Information About System
                </div>
                <div class="font-light text-xs text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua.
                </div>
            </div>
        </BaseModal>
        <BaseModal :modal-active="modalSearchResult" @close-modal="toggleModalSearchResult">
            <div class="text-black">
                <div class="relative">
                    <div class="mb-8 relative">
                        <input type="text" v-model="searchQuery" placeholder="Search for a city or state"
                            @input="getSearchResult"
                            class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-primary focus:outline-none placeholder:text-black/20" />
                        <!-- Reset button -->
                        <button v-if="mapBoxSearchResult.length > 0" @click="resetSearchQuery"
                            class="absolute top-1/2 right-0 -translate-y-1/2">
                            <i class="fa-solid fa-circle-xmark"></i>
                        </button>
                    </div>
                    <ul class="text-black w-full shadow-md p-3 mb-8 rounded-md border-weather-primary border-2"
                        v-if="mapBoxSearchResult && searchQuery">
                        <p class="py-2" v-if="searchError">
                            Sorry, something went wrong, please try again.
                        </p>
                        <p class="py-2" v-if="!searchError && mapBoxSearchResult.length === 0 && searchQuery">
                            No results match your query, try a different term.
                        </p>
                        <template v-else>
                            <li v-for="searchResult in mapBoxSearchResult" :key="searchResult.id"
                                class="py-2 cursor-pointer border-b border-gray-500"
                                @click="addCity(searchResult.place_name, searchResult.geometry.coordinates[1], searchResult.geometry.coordinates[0])">
                                {{ searchResult.place_name }}
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </BaseModal>
    </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { uid } from 'uid';
// @ts-ignore
import BaseModal from './BaseModal.vue';

interface Location {
    id: string;
    place: string;
    coords: {
        lat: number;
        lng: number;
    };
    sorting: number;
}

const mapBoxApiKey = import.meta.env.VITE_MAP_BOX_KEY;
const searchQuery = ref<string>('');
const savedLocations = ref<Array<Location>>([]);
const modalSearchResult = ref<boolean>(false);
const modalActive = ref<boolean>(false);
const mapBoxSearchResult = ref<any[]>([]);
const searchError = ref<boolean>(false);
const scrollPosition = ref<number>(0);

onMounted(() => {
    getLocationGeolocation();

    window.addEventListener('scroll', updateScrollPosition);
})

/**
 * Toggles the modalActive value between true and false.
 */
const toggleModal = () => {
  // Negate the current value of modalActive
  modalActive.value = !modalActive.value;
};
/**
 * Toggles the visibility of the search result modal.
 */
const toggleModalSearchResult = () => {
    // Get the current value of the modalSearchResult
    const currentValue = modalSearchResult.value;

    // Toggle the value of modalSearchResult
    modalSearchResult.value = !currentValue;
}
/**
 * Retrieves search results from the Mapbox API based on a given search query.
 */
const getSearchResult = async () => {
    if (searchQuery.value !== '') {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapBoxApiKey}`);

        mapBoxSearchResult.value = response.data.features;
    }

    mapBoxSearchResult.value = [];
};
/**
 * Resets the search query and map box search result.
 */
const resetSearchQuery = () => {
    // Reset the search query value
    searchQuery.value = '';

    // Clear the map box search result
    mapBoxSearchResult.value = [];
};
/**
 * Add a city to the saved locations.
 * 
 * @param {string} placeName - The name of the place (city, state).
 * @param {number} latValue - The latitude value of the city.
 * @param {number} lngValue - The longitude value of the city.
 */
const addCity = (placeName: any, latValue: number, lngValue: number) => {
    try {
        // Create a location object with the city, state, coordinates, and sorting value.
        const locationObject = {
            id: uid(), // Generate a unique id for the location
            place: placeName, // Set the name of the place
            coords: { // Set the coordinates of the place
                lat: latValue,
                lng: lngValue,
            },
            sorting: 1 // Set a sorting value for ordering the locations
        }

        // Before saving the location, check if it already exists
        if (localStorage.getItem("savedLocation")) {
            savedLocations.value = JSON.parse(localStorage.getItem("savedLocation")!);
        }

        if (savedLocations.value.length > 0) {
            // Check if the location already exists
            if (savedLocations.value.some((location) => location.coords.lat === locationObject.coords.lat && location.coords.lng === locationObject.coords.lng)) {
                alert("City already exists");
                // Reset mapBoxSearchResult and modalSearchResult.
                mapBoxSearchResult.value = [];
                searchQuery.value = '';
                return;
            }
        }

        // Merge the location object with the saved location
        savedLocations.value.push(locationObject);

        // Save the location object to localStorage.
        localStorage.setItem("savedLocation", JSON.stringify(savedLocations.value));

        // Reset mapBoxSearchResult and modalSearchResult.
        searchQuery.value = '';
        mapBoxSearchResult.value = [];
        modalSearchResult.value = false;
    } catch (error) {
        // Log any errors that occur during the process.
        console.log(error);
    }
}
/**
 * Retrieves the user's current location using the Geolocation API
 * and saves it to the local storage.
 */
const getLocationGeolocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      // Retrieve the latitude and longitude
      const { latitude, longitude } = position.coords;

      /**
       * Fetches country cities using the Mapbox Geocoding API.
       * @returns {Promise<Array<Object>>} - The array of country cities.
       */
      const getCountryCities = async () => {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?types=place&access_token=${mapBoxApiKey}`
        );
        return result.data.features;
      };

      const countryCities = await getCountryCities();

      // Create a location object with the latitude, longitude, and default values
      const locationObject = {
        id: uid(),
        place: countryCities[0].place_name,
        coords: {
          lat: latitude,
          lng: longitude,
        },
        sorting: 0,
      };

      // Before saving the location, check if it already exists
      if (localStorage.getItem("savedLocation")) {
        savedLocations.value = JSON.parse(localStorage.getItem("savedLocation")!);
      }

      // Before merge check the coords is not same.
      if (savedLocations.value.length > 0) {
        // Find in savedLocation the location with the same coords, if any
        const havedLocation = savedLocations.value.some(
          (location) =>
            location.coords.lat === latitude && location.coords.lng === longitude
        );

        if (!havedLocation) {
          savedLocations.value.push(locationObject);
        }
      } else {
        // Merge savedLocation with locationObject
        savedLocations.value.push(locationObject);
      }

      // Save the location object to local storage
      localStorage.setItem("savedLocation", JSON.stringify(savedLocations.value));
    });
  }
};
/**
 * Updates the scroll position value based on the current window scroll.
 */
const updateScrollPosition = () => {
    // Get the current vertical scroll position of the window
    const scrollY = window.scrollY;

    // Update the scroll position value
    scrollPosition.value = scrollY;
}
</script>

<style scoped></style>