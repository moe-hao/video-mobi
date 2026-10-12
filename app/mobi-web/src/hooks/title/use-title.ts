export function useTitle(): { title: string } {
    const hostname = window.location.hostname;
    let title = '';

    if (hostname.endsWith('bluearcshow.com')) {
        title = 'Blue Arc';
    } else if (hostname.endsWith('vividarc.com')) {
        title = 'Vivid Arc';
    } else if (hostname.endsWith('localhost')) {
        title = 'Spin Arc';
    }

    return { title };
}