import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import FaceFrownIcon from "@heroicons/react/24/solid/FaceFrownIcon";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen hero bg-base-200" data-theme="light">
      <div className="text-center hero-content text-accent">
        <div className="max-w-md">
          <FaceFrownIcon className="inline-block w-48 h-48" />
          <h1 className="text-5xl font-bold">404 - Not Found</h1>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
