"use client";

import { useState, useEffect, useRef } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddressSearchProps {
  onSelect?: (address: {
    formattedAddress: string;
    lat: number;
    lng: number;
  }) => void;
  className?: string;
  placeholder?: string;
  value?: string;
}

export function AddressSearch({ 
  onSelect, 
  className,
  placeholder = "Search address...",
  value: initialValue
}: AddressSearchProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "us" },
    },
    debounce: 300,
    defaultValue: initialValue,
  });

  useEffect(() => {
    // Load the Google Places script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setValue(suggestion.description, false);
    clearSuggestions();
    setShowSuggestions(false);

    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      
      onSelect?.({
        formattedAddress: suggestion.description,
        lat,
        lng,
      });
    } catch (error) {
      console.error("Error selecting address:", error);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        disabled={!ready || !isLoaded}
        placeholder={placeholder}
        className={cn(
          "w-full transition-all duration-200",
          className
        )}
      />

      {status === "OK" && showSuggestions && (
        <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {data.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}