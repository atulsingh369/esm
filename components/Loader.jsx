const Loader = () => {
  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="absolute rounded-full p-12 animate-pulse transition-all ease-in-out duration-300 lg:w-96 lg:h-96 w-56 h-56">
          <img
            src="https://ik.imagekit.io/xji6otwwkb/ESM/logo.png?updatedAt=1688543664251"
            alt="logo"
            className="max-h-full min-w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export default Loader;
