const getTypeColor = (type) => {
  const normal = '#F5F5F5';
  return (
    {
      normal,
      fire: '#FDDFDF',
      grass: '#DEFDE0',
      electric: '#FCF7DE',
      ice: '#DEF3FD',
      water: '#DEF3FD',
      ground: '#F4E7DA',
      rock: '#D5D5D4',
      fairy: '#FCEAFF',
      poison: '#98D7A5',
      bug: '#F8D5A3',
      ghost: '#CAC0F7',
      dragon: '#97B3E6',
      psychic: '#EAEDA1',
      fighting: '#E6E0D4',
    }[type] || normal
  );
};

const getOnlyFullfilled = async ({ fetchFunc, array }) => {
  const promises = array.map(fetchFunc);
  const responses = await Promise.allSettled(promises);
  return responses.filter((response) => response.status === 'fulfilled');
};

const getPokemonsType = async (pokeApiResults) => {
  const fulfilled = await getOnlyFullfilled({ array: pokeApiResults, fetchFunc: (result) => fetch(result.url) });
  const pokePromises = fulfilled.map((url) => url.value.json());
  const pokemons = await Promise.all(pokePromises);
  return pokemons.map((fulfilled) => fulfilled.types.map((info) => info.type.name));
};

const getPokemonIds = (pokeApiResults) =>
  pokeApiResults.map(({ url }) => {
    const urlAsArray = url.split('/');
    return urlAsArray.at(urlAsArray.length - 2);
  });

const getPokemonsImages = async (ids) => {
  const fulfilled = await getOnlyFullfilled({ array: ids, fetchFunc: (id) => fetch(`./assets/img/${id}.png`) });
  return fulfilled.map((response) => response.value.url);
};

const handlePageLoad = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15&offset=0');

    if (!response.ok) {
      throw Error('Não foi possível obter as informações');
    }

    const { results: pokeApiResults } = await response.json();
    const types = await getPokemonsType(pokeApiResults);
    const ids = getPokemonIds(pokeApiResults);
    const images = await getPokemonsImages(ids);
    console.log(images);
  } catch (error) {
    console.error(error);
  }
};

handlePageLoad();
