type PersonName = {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  prefix?: string | null;
  suffix?: string | null;
};

export const formatSignatureName = (person?: PersonName): string => {
  if (!person) return '';

  let name = [person.prefix, person.firstName, person.middleName]
    .filter(Boolean)
    .join(' ');

  if (person.lastName) {
    name = name ? `${name}, ${person.lastName}` : person.lastName;
  }

  if (person.suffix) {
    name = `${name} ${person.suffix}`.trim();
  }

  return name;
};


export const stripTrailingColon = (label?: string | null): string => {
  if (!label) return '';
  return label.replace(/\s*:\s*$/, '');
};


export const formatDate = (
  date?: string | Date | null
): string => {
  if (!date) return '';

  if (typeof date === 'string') {
    const [year, month, day] = date.substring(0, 10).split('-');

    if (year && month && day) {
      return `${month}/${day}/${year}`;
    }
  }

  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  return '';
};