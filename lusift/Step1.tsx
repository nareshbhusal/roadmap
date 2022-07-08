import { db } from '../db';
import { useState, useEffect } from 'react';

const Welcome = () => {
    const [name, setName] = useState('');
    useEffect(() => {
        (async () => {
            const regInfo = await db.getRegisterationInfo();
            setName(regInfo.user.name);
        })();
    }, []);

    return (
        <div>
            <h2 className="font-bold text-2xl text-center mt-2">
                Welcome, {name} !!
            </h2>
            <div className="flex justify-center my-2">
                <button
                    className="text-xl bg-red"
                    onClick={(window['Lusift' as any] as any).next}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Welcome;
