import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
const key = import.meta.env.VITE_MAPS_KEY;
import AutoComplete from "react-google-autocomplete";
export const AutoComp = ({ value, onChange }) => {
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    lat: null,
    lng: null,
  });

  const handlePlaceSelected = (place) => {
    const newAddressDetails = {
      street: "",
      city: "",
      state: "",
      country: "",
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };

    for (const component of place.address_components) {
      const type = component.types[0];
      switch (type) {
        case "street_number":
          newAddressDetails.street = component.long_name + " ";
          break;
        case "route":
          newAddressDetails.street += component.long_name;
          break;
        case "locality":
          newAddressDetails.city = component.long_name;
          break;
        case "administrative_area_level_1":
          newAddressDetails.state = component.long_name;
          break;
        case "country":
          newAddressDetails.country = component.long_name;
          break;
      }
    }
    setAddressDetails(newAddressDetails);
    console.log(newAddressDetails); // You can see the saved details here
    if (onChange) {
      onChange(newAddressDetails); // Pass the details up if an onChange prop is provided
    }
  };
  useEffect(() => {
    onChange(addressDetails);
  }, [addressDetails]);

  return (
    <div>
      <label htmlFor="" className="fieldset-label mb-2 text-sm font-bold">
        Update Address
      </label>
      <AutoComplete
        apiKey={"AIzaSyDb-oNzv69h3dx7alQoli6PTO7mDgk1YQM"}
        className="input w-full"
        placeholder="Enter your address"
        onPlaceSelected={handlePlaceSelected}
        options={{
          types: ["geocode"], // Changed to 'geocode' for more specific street results
          componentRestrictions: { country: "ng" },
        }}
      />
    </div>
  );
};
