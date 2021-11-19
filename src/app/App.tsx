import React from 'react';

import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { MainPage } from "../pages";

export const App = () => {
    return (
        <GeistProvider>
            <CssBaseline />
            <MainPage />
        </GeistProvider>
    );
};
