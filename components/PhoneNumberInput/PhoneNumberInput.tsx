/* eslint-disable react/display-name */
import React, { useCallback, useState } from "react";
import { Divider, Group, Input, TextInput } from "@mantine/core";
import SelectCountry, { FlagInfo } from "./SelectCountry";
import { useStyles } from "./styles";

// Should check that 1) all characters are numbers, 2) the number is at least {len} digits long
const isPhoneNumber = (str: string, len = 10): boolean => {
  const strippedNumber = str.replace(/\D/g, "");
  return strippedNumber.length >= len;
};

const PhoneInput = ({
  onValidPhonenumber,
}: {
  onValidPhonenumber: (phonenumber: string) => void;
}) => {
  const { classes, cx } = useStyles();
  const [country, setCountry] = useState<FlagInfo>({
    name: "United States",
    flag: "🇺🇸",
    code: "US",
    dial_code: "+1",
  });
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const onCountrySelect = useCallback(
    (country: FlagInfo) => {
      if (phoneNumber && isPhoneNumber(phoneNumber, country.num_digits)) {
        const strippedNumber = phoneNumber.replace(/\D/g, "");
        onValidPhonenumber(`${country.dial_code}${strippedNumber}`);
      }
      setCountry(country);
    },
    [phoneNumber, onValidPhonenumber]
  );

  const onPhoneNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = event.currentTarget.value;
      setPhoneNumber(newPhoneNumber);
      if (isPhoneNumber(newPhoneNumber)) {
        const strippedNumber = newPhoneNumber.replace(/\D/g, "");
        onValidPhonenumber(`${country.dial_code}${strippedNumber}`);
      }
    },
    [country, onValidPhonenumber]
  );

  return (
    <Group spacing={0} w="100%" className={cx(classes.container)} pl={0}>
      <SelectCountry
        onSelect={onCountrySelect}
        selectedCountry={country}
        style={{
          width: "30%",
        }}
      />
      <Divider orientation="vertical" />
      <TextInput
        value={phoneNumber}
        onChange={onPhoneNumberChange}
        placeholder={
          country.num_digits ? "0".repeat(country.num_digits) : "000 000 0000"
        }
        variant="unstyled"
        size="lg"
        w="60%"
        pl="sm"
      />
    </Group>
  );
};

export default PhoneInput;
