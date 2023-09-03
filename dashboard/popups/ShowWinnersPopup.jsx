const ShowWinnersPopup = ({ users, setShowWinners }) => {
  return (
    <>
      <div className="h-screen fixed w-1/2 bg-white top-0 right-0 p-10 shadow-xl overflow-y-scroll">
        <div
          onClick={() => setShowWinners(false)}
          className="absolute top-5 right-5 text-2xl font-semibold cursor-pointer"
        >
          X
        </div>
        {users && users.length > 0 ? (
          <>
            <div className="p-1 border m-1 px-5 mt-10 flex rounded border-primary">
              <p className="flex-1">Name</p>
              <p className="flex-1">Email</p>
              <p className="flex-1">Numbers</p>
            </div>
            <div className="numlist ">
              {users.map((user) => (
                <div key={user.id} className="p-1 m-1 px-5 flex rounded border">
                  <p className="flex-1">
                    {user.fname} {user.lname}
                  </p>
                  <p className="flex-1">{user.email}</p>
                  <p className="flex-1">{user.numbers.join(", ")}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No Winners yet</p>
        )}
      </div>
    </>
  );
};

export default ShowWinnersPopup;
