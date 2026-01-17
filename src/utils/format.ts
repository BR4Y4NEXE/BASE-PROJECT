import { format } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM dd, yyyy');
};

export const cn = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
};
