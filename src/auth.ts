import { edusoft } from "./configs/edusoft";
import { path } from "./configs/path";
import request from "./request";
import { Credentials } from "./types";

let signedIn = false;

const isSignedIn = () => {
  return signedIn;
};

const signIn = async (credentials: Credentials) => {
  if (signedIn) {
    return true;
  }

  await request.get("/default.aspx");

  const $ = await request.post("/default.aspx", {
    ...edusoft.commonBody,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$btnDangNhap: "Đăng Nhập",
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtTaiKhoa: credentials.username,
    ctl00$ContentPlaceHolder1$ctl00$ucDangNhap$txtMatKhau: credentials.password,
  });

  return signedIn = $(path.changePwdBtn).text() ? true : false;
};

const signOut = async () => {
  const $ = await request.post("/default.aspx", {
    ...edusoft.commonBody,
    __EVENTTARGET: "ctl00$Header1$Logout1$lbtnLogOut",
  });

  return !(signedIn = $(path.changePwdBtn).text() ? true : false);
};

export default { isSignedIn, signIn, signOut };
