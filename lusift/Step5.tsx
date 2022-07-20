import Progress from './Progress';

const Step5 = () => {
    return (
        <div className="font-normal">
            <p>
                This sidebar section lists all of<br></br>
                our boards automatically sorted <br></br> by last active time.
            </p>
            <p className="mt-1">
                Try accessing <b>First Board 🔖</b>
            </p>
            <Progress />
        </div>
    );
}

export default Step5;
