export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name: string): string => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        if (words[i] && words[i][0])
            initials += words[i][0].toUpperCase();
    }

    return initials;
};

export const addThousandsSeparator = (value: number | string): string => {
    if (value == null || isNaN(Number(value))) return "";

    const [integerPart, decimalPart] = value.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};