import { db } from '../db';
import { useState, useEffect } from 'react';
import Lusift from 'lusift/dev/react';
import { BsFillKanbanFill } from 'react-icons/bs';

const Welcome = () => {
    const [name, setName] = useState('$name');
    useEffect(() => {
        (async () => {
            const regInfo = await db.getRegisterationInfo();
            setName(regInfo.user?.name);
        })();
    }, []);

    return (
        <div>
            <h2 className="font-bold text-2xl text-center mt-1">
                Welcome to Roadmap, {name} !!
            </h2>
            <div className="flex justify-center flex-col text-gray-800 text-md items-center my-3">
                <div className="text-5xl text-gray-300 mb-2">
                <BsFillKanbanFill />
                </div>
                <p className="text-md leading-7">
                    This is an app to demo
                    &nbsp;<span className="underline decoration-primary decoration-4">Lusift</span>.
                </p>
                <p className="text-md">
                    Let's take you through a small tour of the app.
                </p>
                <button
                    className="text-lg bg-blue-600 px-3 py-2 mt-4 rounded-md font-semibold"
                    onClick={Lusift.next}>
                    Start Tour
                </button>
            </div>
        </div>
    );
}

export default Welcome;
