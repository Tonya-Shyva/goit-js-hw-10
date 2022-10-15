export const fetchCountries = name => {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (response.ok === false) {
        // або (!response.ok)
        if (response.status === 404) {
          return [];
        }
        throw new Error(response.status);
      }
      // console.log(response);
      return response.json();
    })
    .catch(error => {
      console.error(error);
    });
};
