<template>
  <div class="container">
    <div class="pt-20 pb-14">
      <p class="text-4xl text-white font-light">{{ greet }}</p>
      <!-- Show current day and month like 22 Jul -->
      <p class="text-8xl text-white font-bold">{{ formattedDate }}</p>
      <small v-if="weathersData" class="text-white text-xl">Temperature {{ Math.round(weathersData.current.temp) || 0
      }}&deg;C</small>
    </div>
    <div class="mb-10">
      <p class="font-bold text-white text-2xl mb-4">Today</p>
      <ul v-if="weathersData" class="flex gap-2">
        <li v-for="hourData in paginationHours(weathersData.hourly)" :key="hourData.id"
          class="bg-white bg-opacity-20 p-4 border w-full h-fit border-white rounded-lg text-center">
          <p class="font-bold text-white text-sm">{{ new Date(hourData.currentTime).toLocaleTimeString("en-US", {
            hour: "numeric"
          }) }}</p>
          <div class="py-4">
            <img :src="`./icon/${checkWeatherIcon(hourData.weather[0].icon)}`" alt=""
              class="w-12 mx-auto object-cover">
          </div>
          <p class="font-bold text-white text-sm">{{ Math.round(hourData.temp) }}&deg;C</p>
        </li>
      </ul>
      <div v-else class="bg-white bg-opacity-20 p-4 border w-full h-fit border-white rounded-lg text-white">
        Loading...
      </div>
    </div>
    <div>
      <p class="font-bold text-white text-2xl mb-4">Next Forecast</p>
      <ul v-if="weathersData" class="space-y-4">
        <li v-for="dailyData in weathersData.daily" :key="dailyData.id"
          class="bg-white bg-opacity-20 p-4 border w-full h-fit border-white rounded-lg">
          <div class="grid grid-cols-3 gap-4 items-center">
            <div>
              <!-- Show day name like Monday -->
              <p class="text-white text-lg font-bold">{{ new Date(dailyData.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long"
              }) }}</p>
              <p class="text-white font-light">{{ new Date(dailyData.dt * 1000).toLocaleDateString("en-US", {
                month:
                  "short", day: "numeric"
              }) }}</p>
            </div>
            <div class="text-center">
              <p class="text-3xl m-0 p-0 my-auto font-bold text-white">{{ averageTemp(dailyData.temp.min,
                dailyData.temp.max) }}&deg;c</p>
            </div>
            <div>
              <img :src="`./icon/${checkWeatherIcon(dailyData.weather[0].icon)}`" alt=""
                class="w-12 mx-auto object-cover">
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

const locations = ref<object>({});
const weatherAppID = import.meta.env.VITE_WEATHER_APP_ID;
const date = new Date();
const weathersData = ref<any>();
const day = date.getDate();
const month = date.toLocaleString('default', { month: 'short' });
const iconWeather = [
  {
    icon: '01',
    description: 'clear sky',
    iconPath: 'clear-sky.png'
  },
  {
    icon: '02',
    description: 'few clouds',
    iconPath: 'few-clouds.png'
  },
  {
    icon: '03',
    description: 'scattered clouds',
    iconPath: 'scattered-clouds.png'
  },
  {
    icon: '04',
    description: 'broken clouds',
    iconPath: 'broken-clouds.png'
  },
  {
    icon: '09',
    description: 'shower rain',
    iconPath: 'shower-rain.png'
  },
  {
    icon: '10',
    description: 'rain',
    iconPath: 'rain.png'
  },
  {
    icon: '11',
    description: 'thunderstorm',
    iconPath: 'thunderstorm.png'
  },
  {
    icon: '13',
    description: 'snow',
    iconPath: 'snow.png'
  },
  {
    icon: '50',
    description: 'mist',
    iconPath: 'mist.png'
  }
];

const formattedDate = `${day} ${month}`;

onMounted(async () => {
  getSavedLocations(0);
})

/**
 * Calculates the average temperature between the minimum and maximum values.
 * 
 * @param {number} min - The minimum temperature value.
 * @param {number} max - The maximum temperature value.
 * @returns {number} The average temperature.
 */
const averageTemp = (min: number, max: number): number => {
  return Math.round((min + max) / 2);
}
/**
 * Removes 'd' or 'n' from the icon string.
 * 
 * @param {string} icon - The icon string to be checked.
 * @returns {string | undefined} - The path of the matching icon or undefined if not found.
 */
const checkWeatherIcon = (icon: string): string | undefined => {
  icon = icon.replace('d', ''); // Remove 'd' from icon
  icon = icon.replace('n', ''); // Remove 'n' from icon
  return iconWeather.find((item) => item.icon === icon)?.iconPath; // Find icon with matching icon string
}
/**
 * Get the first 4 elements from an array.
 *
 * @param {Array} arrayData - The input array.
 * @returns {Array} - The first 4 elements of the input array.
 */
const paginationHours = (arrayData: Array<any>): Array<any> => {
  return arrayData.slice(0, 4);
};
/**
 * Retrieves the saved locations from local storage and updates the current location based on the sorting value.
 * If a location with the specified sorting value is found, it updates the locations value and fetches the weather data.
 * 
 * @param {number} sorting - The sorting value to filter the saved locations.
 */
const getSavedLocations = async (sorting: number) => {
  try {
    // Check if savedLocation exists in local storage
    if (localStorage.getItem("savedLocation")) {
      const savedLocations = JSON.parse(localStorage.getItem("savedLocation")!);

      // Check if there are any saved locations
      if (savedLocations.length > 0) {
        // Find the location with the specified sorting value
        const location = savedLocations.find(
          (location: { sorting: number; }) => location.sorting === sorting
        );

        // If location is found, update the current location and fetch weather data
        if (location) {
          locations.value = location;
          await getWeather();
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Retrieves weather data for the given location.
 */
const getWeather = async () => {
  try {
    if (locations.value) {
      // Make a request to the OpenWeatherMap API to get weather data
      let weatherData = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${locations.value.coords.lat}&lon=${locations.value.coords.lng}&exclude={part}&appid=${weatherAppID}&units=metric`
      );

      // Calculate the local time offset
      const localOffset = new Date().getTimezoneOffset() * 60000;

      // Convert the UTC time to local time for the current weather data
      const utc = weatherData.data.current.dt * 1000 + localOffset;
      weatherData.data.currentTime = utc + 1000 * weatherData.data.timezone_offset;

      // Convert the UTC time to local time for each hourly weather data
      weatherData.data.hourly.forEach((hour: { dt: number; currentTime: number; }) => {
        const utc = hour.dt * 1000 + localOffset;
        hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
      });

      // Update the weathersData value with the retrieved weather data
      weathersData.value = weatherData.data;
    }
  } catch (error) {
    // Log any errors that occur during the API request
    console.log(error);
  }
}
/**
 * Returns a greeting message based on the current time.
 * @returns {string} The greeting message.
 */
const greetMessage = (): string => {
  // Get the current time
  const currentTime = new Date();
  const hour = currentTime.getHours();

  // Return the appropriate greeting based on the hour
  if (hour < 12) {
    return "Morning!";
  } else if (hour < 18) {
    return "Afternoon!";
  } else if (hour >= 17 && hour <= 24) {
    return "Evening!";
  } else {
    return "Hello!";
  }
}
const greet = greetMessage();

</script>