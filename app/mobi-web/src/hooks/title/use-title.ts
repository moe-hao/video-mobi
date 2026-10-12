export function useTitle(): { title: string } {
    const hostname = window.location.hostname;
    let title = '';

    if (hostname.endsWith('bluearcshow.com')) {
        title = 'Blue Arc';
    } else if (hostname.endsWith('vividarcshow.com')) {
        title = 'Vivid Arc';
    } else if (hostname.endsWith('spinarcshow.com')) {
        title = 'Spin Arc';
    }

    return { title };
}