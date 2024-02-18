import { useEffect } from "react";
import { useLoginQuery } from "../queries/useLoginQuery";

function LoginPanel() {
  const { refetch: refetchLogin, isSuccess: isSuccessLogin } = useLoginQuery();

  useEffect(() => {
    refetchLogin();
  }, []);

  return (
    <>
      <div></div>
    </>
  );
}

export default LoginPanel;
