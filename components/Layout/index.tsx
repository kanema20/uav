import { ReactNode } from 'react';
import NavBar from '../NavBar';

function Layout({ children }: { readonly children: ReactNode }) {
    return (
        <div>
            <NavBar
                links={[
                    {
                        title: 'Contact',
                        url: '/contact',
                    },
                ]}
            />
            {children}
        </div>
    );
}

export default Layout;
