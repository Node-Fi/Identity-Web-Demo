/* eslint-disable react/display-name */
import React, { useCallback, useState } from "react";
import { Divider, Group, Input, TextInput } from "@mantine/core";
import SelectCountry, { FlagInfo } from "./SelectCountry";
import { useStyles } from "./styles";

const isPhoneNumber = (str: string): boolean =>
  /^(\+\d{1,2})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(str);

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
      if (phoneNumber && isPhoneNumber(phoneNumber)) {
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
        placeholder="000 000 0000"
        variant="unstyled"
        size="lg"
        w="60%"
        pl="sm"
      />
    </Group>
  );
};

export default PhoneInput;
