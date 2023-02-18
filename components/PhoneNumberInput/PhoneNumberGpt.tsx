import React, { useState } from "react";
import { Input, Select, SelectItem, TextInput, Title } from "@mantine/core";
import flagsData from "./flags.json";

type Country = {
  name: string;
  flag: string;
  dial_code: string;
};

const flags = flagsData.map((c) => ({
  value: c.name,
  label: c.dial_code,
  icon: c.flag,
  dial_code: c.dial_code,
}));

const valueToFlag = flags.reduce(
  (acc, flag) => {
    acc[flag.value] = flag;
    return acc;
  },
  {} as Record<
    string,
    {
      value: string;
      label: string;
      icon: string;
      dial_code: string;
    }
  >
);

const PhoneInputGpt = () => {
  const [country, setCountry] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <div style={{ marginRight: 10 }}>
          <Select
            placeholder="Select country"
            searchable
            label={country ? valueToFlag[country]?.dial_code : undefined}
            icon={country ? <Title>{valueToFlag[country].icon}</Title> : null}
            data={flags}
            value={country}
            onChange={handleCountryChange}
            maxDropdownHeight={280}
            width={100}
            rightSection={
              <Input
                style={{ paddingLeft: "calc(3.5rem + 10px)" }}
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.currentTarget.value)}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneInputGpt;
