/*
    This utility function converts a string to kebab case.
    For example, 'Hello World' will be converted to 'hello-world'.

    @param str: string - The string to convert to kebab case.
    @returns string - The kebab-case string.
*/
export default function toKebabCase( str: string ): string {
    return str
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
}