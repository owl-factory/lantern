import Router from 'next/router';

function Logout(props: any) {
  // TODO - logout action
  Router.push("/");
  return null;
};

export default Logout;
