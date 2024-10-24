import { currencies } from "./currencies"

export function DateToUTCDate(date:Date) {
    
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            0,0,0,
        )
    )
}
export function GetFormatterForCurrency(currency:string) {
    const locale = currencies.find(c=> c.value === currency)?.locale
    return new Intl.NumberFormat(locale,{
        style:"currency",
        currency,
    })
}