import React from 'react';

import { Button } from "@geist-ui/react";

export type MainPageProps = Record<never, string>;

export const MainPage: React.FC<MainPageProps> = () => {
    return (
        <Button>
            This is test button
        </Button>
    );
};
