import accounting from "accounting";

const intl = new Intl.NumberFormat();

export const format = {
    toCurrency: (value: number) => accounting.formatMoney(value, 'R$ ', 2, '.', ','),
    currencyToNumber: (value: string) => {
        const cleanedCurrency = value.replace(/[R$\s]/g, '');
        const withoutThousandSeparator = cleanedCurrency.replace(/\./g, '');
        const normalizedCurrency = withoutThousandSeparator.replace(',', '.');
        const result = parseFloat(normalizedCurrency);

        if (isNaN(result)) {
            throw new Error('Formato inválido para moeda');
        }

        return result;
    },
    toDocument: (value: string) => {
        if (!value) return value;
        let v = value.replace(/\D/g, '');
        if (v.length <= 11) {
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            v = v.replace(/(\d{2})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1/$2');
            v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        }
        return v;
    },
    toPhone: (value: string) => {
        if (!value) return value;
        let v = value.replace(/\D/g, '');
        v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
        v = v.replace(/(\d)(\d{4})$/, '$1-$2');
        return v;
    },
    toCNPJ: (value: string) => value && value.length === 14 ? value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') : value,
    toMask: (value: string, mask: string) => {
        let result = '';
        let inputIndex = 0;

        value = value.replace(/\D/g, '');
        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === '#') {
                if (inputIndex < value.length) {
                    result += value[inputIndex];
                    inputIndex++;
                } else {
                    break;
                }
            } else {
                result += mask[i];
            }
        }

        return result;
    },
    unmask: (value: string) => value.replace(/\D/g, '')
}