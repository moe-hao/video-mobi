export async function concurrencyLimit<T>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<void>
): Promise<void> {
    const queue = [...items];
    const executing: Promise<void>[] = [];

    async function executeNext(): Promise<void> {
        if (queue.length === 0) return;

        const item = queue.shift();
        if (!item) return;

        const promise = fn(item).then(() => {
            executing.splice(executing.indexOf(promise), 1);
        });

        executing.push(promise);

        if (executing.length >= limit) {
            await Promise.race(executing);
        }

        await executeNext();
    }

    await executeNext();
    await Promise.all(executing);
}
