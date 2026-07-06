export function convertURLSearchParams<T>(params: T): string {
    const urlSearchParams = new URLSearchParams();
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
        if (value != null) {
            urlSearchParams.append(key as string, value as string);
        }
    });
    return urlSearchParams.toString();
}
