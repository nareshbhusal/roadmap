import React from 'react';
import Sidebar from '../components/Sidebar';

interface ILayout {
    children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
    return (
        <main className="p-0 mx-auto m-0">
            <Sidebar />
            {children}
        </main>
    );
}

export default Layout;
