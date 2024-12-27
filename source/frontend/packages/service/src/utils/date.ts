export const formatDate2DigitString = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  return date.toLocaleDateString('ja-JP', options);
};

// 参考記事：https://zenn.dev/shuh/articles/javascript-iso8601
export function toISOStringWithTimezone(date: Date): string {
  if (isUTC()) {
    return ISOStringForUTC();
  }

  return ISOStringForNoneUTC();

  // 以下ヘルパー関数
  function ISOStringForUTC() {
    const tzSign = 'Z';
    return `${localDate()}T${localTime()}${tzSign}`;
  }

  function ISOStringForNoneUTC() {
    const tzSign = diffFromUtc() < 0 ? '+' : '-';
    const tzHour = zeroPadding((Math.abs(diffFromUtc()) / 60).toString());
    const tzMinute = zeroPadding((Math.abs(diffFromUtc()) % 60).toString());

    return `${localDate()}T${localTime()}${tzSign}${tzHour}:${tzMinute}`;
  }

  function isUTC() {
    return diffFromUtc() === 0;
  }

  function localDate() {
    const { year, month, day } = zeroPaddingDateParts(date);

    return `${year}-${month}-${day}`;
  }
  function localTime() {
    const { hour, minute, second } = zeroPaddingDateParts(date);
    return `${hour}:${minute}:${second}`;
  }

  function diffFromUtc() {
    return date.getTimezoneOffset();
  }
}

function zeroPaddingDateParts(date: Date) {
  const year = date.getFullYear().toString();
  const month = zeroPadding((date.getMonth() + 1).toString());
  const day = zeroPadding(date.getDate().toString());

  const hour = zeroPadding(date.getHours().toString());
  const minute = zeroPadding(date.getMinutes().toString());
  const second = zeroPadding(date.getSeconds().toString());

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
}

function zeroPadding(s: string): string {
  return ('0' + s).slice(-2);
}
