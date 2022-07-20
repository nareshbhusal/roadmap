import Lusift from 'lusift/dev/react';
import Progress from './Progress';

const Step2 = () => {
    return (
        <div className="font-normal">
            <p>
                Click on the <b className="text-gray-600">Boards</b> link <br></br>
                to navigate to the page that <br></br>
                lists all of the boards.
            </p>
            <Progress />
        </div>
    );
}

export default Step2;
