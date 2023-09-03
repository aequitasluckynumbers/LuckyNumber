import { useEffect } from "react";

const Step3 = ({ odd, setOdd, setIsDisabled }) => {
  useEffect(() => {
    setIsDisabled(false);
  }, []);

  return (
    <>
      <div className="">
        <h2 className="text-center">Add number of winning cards per round</h2>
        <div className="flex gap-6">
          <div className="card w-1/3 mx-auto mt-10 border rounded-2xl px-6 py-8">
            <h3>
              Predetermined winning cards - <strong>Full house</strong>
            </h3>
            <div className="flex flex-col gap-2 my-3">
              <label>Odds</label>
              <input
                type="number"
                value={odd}
                onChange={(e) => setOdd(e.target.value)}
                name="odds"
                className="input"
              />
            </div>

            <p>
              Enter a number to specify the frequency of winning cards among all
              cards. For instance, if you input &apos;10&apos;, a winning card
              will be generated for every 10th game card downloaded
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3;
