import React from "react";

interface PhoneNumberInputProps {
  onValidPhoneNumber: (phoneNumber: string) => void;
  onValueChange?: (value: string) => void;
  value?: string;
}

const phoneNumberRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

const isValidPhoneNumber = (phoneNumber: string) => {
  return phoneNumberRegex.test(phoneNumber);
};

export default function PhoneNumberInput({
  onValidPhoneNumber,
  onValueChange,
  value,
}: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = React.useState(value || "");

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (onValueChange) {
      onValueChange(value);
    }

    if (isValidPhoneNumber(value)) {
      onValidPhoneNumber(value);
    }
  };

  const handlePhoneNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phoneNumber) {
      onValidPhoneNumber(phoneNumber);
    }
  };

  return (
    <form onSubmit={handlePhoneNumberSubmit}>
      <input
        type="text"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
