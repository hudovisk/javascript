import { useCallback, useEffect, useMemo, useState } from 'react';

import { extractDigits, formatPhoneNumber, parsePhoneString } from '../../utils';
import type { CountryIso } from './countryCodeData';
import { IsoToCountryMap } from './countryCodeData';

type UseFormattedPhoneNumberProps = { initPhoneWithCode: string; locationBasedCountryIso?: CountryIso };

const format = (str: string, iso: CountryIso) => {
  if (!str) {
    return '';
  }
  const country = IsoToCountryMap.get(iso);
  return formatPhoneNumber(str, country?.pattern, country?.code);
};

export const useFormattedPhoneNumber = (props: UseFormattedPhoneNumberProps) => {
  const { initPhoneWithCode, locationBasedCountryIso } = props;
  const [number, setNumber] = useState(() => {
    const { number } = parsePhoneString(initPhoneWithCode || '');
    return number;
  });

  const [iso, setIso] = useState(
    parsePhoneString(initPhoneWithCode || '').number
      ? parsePhoneString(initPhoneWithCode || '').iso
      : locationBasedCountryIso || 'us',
  );

  useEffect(() => {
    setNumber(parsePhoneString(props.initPhoneWithCode || '').number);
  }, [initPhoneWithCode]);

  useEffect(() => {
    setNumber(extractDigits(number));
  }, [iso, number]);

  const numberWithCode = useMemo(() => {
    if (!number) {
      return '';
    }
    const dialCode = IsoToCountryMap.get(iso)?.code || '1';
    return '+' + extractDigits(`${dialCode}${number}`);
  }, [iso, number]);

  const formattedNumber = useMemo(() => {
    return format(number, iso);
  }, [iso, number]);

  const setNumberAndIso = useCallback(
    (str: string) => {
      const { iso, number } = parsePhoneString(str);
      setNumber(number);
      setIso(iso);
    },
    [iso, number],
  );

  return {
    setNumber,
    setIso,
    setNumberAndIso,
    iso,
    number,
    numberWithCode,
    formattedNumber,
  };
};
