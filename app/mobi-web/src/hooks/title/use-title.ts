import { useState } from "react";

export function useTitle(): { title: string } {
    const [title, setTitle] = useState<string>('');
    if (window.location.hostname.endsWith('bluearcshow.com')) {
        setTitle('Blue Arc');
    }

    if (window.location.hostname.endsWith('vividarc.com')) {
        setTitle('Vivid Arc');
    }

    if (window.location.hostname.endsWith('spinarcshow.com')) {
        setTitle('Spin Arc');
    }

    return { title };
}