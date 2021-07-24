import { uri } from "./configs/uri";
import request from "./request";
import { Subject } from "./types/subject";

let id = "";
let rs = { value: "" };
let accessed = false;

const register = async (subject: Subject) => {
  id = subject.id;

  return access()
    .then(() => select())
    .then(() => save())
    .then(() => check())
    .then(() => saved())
    .then(() => saved2())
    .catch(() => resetAccessStatus());
};

const resetAccessStatus = () => {
  accessed = false;

  return false;
};

const access = async () => {
  if (accessed) {
    return;
  }

  await request.get(uri.registerSubject);

  accessed = true;
};

const select = async () => {
  const infor = id.split("|");
  const data = {
    check: true,
    maDK: infor[0],
    maMH: infor[1],
    tenMH: infor[2],
    maNh: infor[3],
    sotc: infor[4],
    strSoTCHP: infor[5],
    ngaythistr: infor[6],
    tietbd: infor[7],
    sotiet: infor[8],
    soTCTichLuyToiThieuMonYeuCau: infor[9],
    choTrung: infor[10],
    soTCMinMonYeuCau: infor[11],
    maKhoiSinhVien: infor[12],
  };
  rs = await request.post(
    uri.saveSubject,
    data,
    {
      "X-AjaxPro-Method": "DangKySelectedChange",
    },
    true
  );
};

const save = async () => {
  const infor = rs.value.split("|");
  const data = {
    isValidCoso: false,
    isValidTKB: false,
    maDK: infor[1],
    maMH: infor[12],
    sotc: infor[13],
    tenMH: infor[14],
    maNh: infor[15],
    strsoTCHP: infor[16],
    isCheck: "true",
    oldMaDK: infor[4],
    strngayThi: infor[25],
    tietBD: infor[26],
    soTiet: infor[27],
    isMHDangKyCungKhoiSV: infor[35],
  };
  rs = await request.post(
    uri.saveSubject,
    data,
    {
      "X-AjaxPro-Method": "LuuVaoKetQuaDangKy",
    },
    true
  );
};

const check = async () => {
  rs = await request.post(
    uri.saveSubject,
    {},
    {
      "X-AjaxPro-Method": "KiemTraTrungNhom",
    },
    true
  );
};

const saved = async () => {
  rs = await request.post(
    uri.saveSubject,
    {},
    {
      "X-AjaxPro-Method": "LuuDanhSachDangKy",
    },
    true
  );
};

const saved2 = async () => {
  const saved2 = {
    isCheckSongHanh: false,
    ChiaHP: false,
  };
  rs = await request.post(
    uri.saveSubject,
    saved2,
    {
      "X-AjaxPro-Method": "LuuDanhSachDangKy_HopLe",
    },
    true
  );

  return rs.value === "||default.aspx?page=dkmonhoc" ? true : false;
};

export default { register };
