/*
    This function takes a Date object and returns a string with the date in the format YYMMDDHHmm.
    For example, if the input is new Date('2021-10-10T10:10:10'), the output will be '2110101010'.
*/

export default function toFormattedDate(date: Date): string {
    const format = (value: number): string =>
        value
            .toString()
            .padStart( 2, '0');
  
    return [
        String( date.getFullYear() ).slice(-2),
        format( date.getMonth() + 1 ),
        format( date.getDate()),
        format( date.getHours()),
        format( date.getMinutes())
    ].join('');
  }