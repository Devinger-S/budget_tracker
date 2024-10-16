export function DateToUTCDate(date:Date) {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getMonth(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    )
}