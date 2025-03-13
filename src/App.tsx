import React, { useEffect, useRef, useState, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
//Components
import Countries from "./routes/countries/Countries";
import Header from "./components/Header";
import Country from "./routes/country/Country";
import { CountriesInterface } from "./types/interfaces";


export const App = () => {
  const [countries, setCountries] = useState<CountriesInterface[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foundFilter, setFoundFilter] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [regionName, setRegionName] = useState<string>('all');
  const prevRegionNameRef = useRef<string>(regionName);

  useEffect(() => {
    prevRegionNameRef.current = regionName;
  }, [regionName]);

  const searchCountries = async (searchValue: string) => {
    const data = await filterCountries(regionName, true, searchValue.toLowerCase());
    setCountries(data);
    if (data.length === 0) {
      setFoundFilter(false);
    } else {
      setFoundFilter(true);
    }
  };

  const filterCountries = useCallback(async (regionName: string, search: boolean, searchInput: string) => {
    try {
      let url = regionName === "all" 
        ? `${process.env.REACT_APP_API_URL}/all`
        : `${process.env.REACT_APP_API_URL}/region/${regionName}`;
      
      const response = await fetch(url);
      const data = await response.json();

      return search 
        ? data?.filter((country: any) =>
            Object.values(country)
              .join("")
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          )
        : data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  }, []); 

  const fetchRegion = useCallback(async (regionName: string) => {
    try {
      setRegionName(regionName);
      setIsLoading(true);
      
      const data = await filterCountries(
        regionName, 
        searchInput.length > 0 && regionName !== prevRegionNameRef.current,
        searchInput
      );
      
      setCountries(data);
      setFoundFilter(data.length > 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching region:', error);
      setIsLoading(false);
      setFoundFilter(false);
    }
  }, [searchInput, filterCountries, prevRegionNameRef]);

  useEffect(() => {
    let mounted = true;

    const fetchInitialData = async () => {
      if (mounted) {
        await fetchRegion("all");
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, [fetchRegion]);
  
  return (
    <React.Fragment>
      <Header />
      <Routes>
        <Route path="/:name" element={<Country />} />
        <Route path="/" element={<Countries searchInput={searchInput} setSearchInput={setSearchInput} isLoading={isLoading} foundFilter={foundFilter}
          countries={countries} searchCountries={searchCountries} fetchRegion={fetchRegion} regionName={regionName} />} />
      </Routes>
    </React.Fragment>
  );
};
