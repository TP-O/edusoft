import { inject, injectable } from 'inversify';
import { Constracts } from '../../contracts';
import 'reflect-metadata';
import { Types } from '../../types';

@injectable()
export class Register implements Constracts.IRegister
{
    private _id: any;
    private _rs: any;
    private _accessed = false;

    constructor(@inject('HCMIUSender') private _sender: Constracts.ISender) {}

    async register(infor: Types.RegisterInfo): Promise<boolean> {

        this.setId(infor.id);

        let rs = await this.access(`${infor.host}/Default.aspx?page=dkmonhoc`)
            .then(r => this.select(`${infor.host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => this.save(`${infor.host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => this.check(`${infor.host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => this.saved(`${infor.host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .then(r => this.saved2(`${infor.host}/ajaxpro/EduSoft.Web.UC.DangKyMonHoc,EduSoft.Web.ashx`))
            .catch(e => {
                this.resetAccessStatus();
                return false;
            });

        return rs;
    }

    private setId(id: string): void {
        this._id = id;
    }

    private resetAccessStatus(): void {
        this._accessed = false;
    }

    private async access(url: string): Promise<Constracts.IRegister> {

        if (! this._accessed) {
            await this._sender.get(url);
            this._accessed = true;
        }
        return this;
    }

    private async select(url: string): Promise<Constracts.IRegister> {

        let data = this._id.split('|');
        let selected = {
            "check": true,
            "maDK": data[0],
            "maMH": data[1],
            "tenMH": data[2],
            "maNh": data[3],
            "sotc": data[4],
            "strSoTCHP": data[5],
            "ngaythistr": data[6],
            "tietbd": data[7],
            "sotiet": data[8],
            "soTCTichLuyToiThieuMonYeuCau": data[9],
            "choTrung": data[10],
            "soTCMinMonYeuCau": data[11],
            "maKhoiSinhVien": data[12]
        };
        this._rs = await this._sender
            .post(
                url,
                selected,
                {
                    "X-AjaxPro-Method": "DangKySelectedChange"
                },
                true);

        return this;
    }

    private async save(url: string): Promise<Constracts.IRegister> {

        let data = this._rs.value.split('|');
        let save = {
            "isValidCoso": false,
            "isValidTKB": false,
            "maDK": data[1],
            "maMH": data[12],
            "sotc": data[13],
            "tenMH": data[14],
            "maNh": data[15],
            "strsoTCHP": data[16],
            "isCheck": "true",
            "oldMaDK": data[4],
            "strngayThi": data[25],
            "tietBD": data[26],
            "soTiet": data[27],
            "isMHDangKyCungKhoiSV": data[35]
        }
        this._rs = await this._sender
            .post(
                url,
                save,
                {
                    "X-AjaxPro-Method": "LuuVaoKetQuaDangKy"
                },
                true);

        return this;
    }

    private async check(url: string): Promise<Constracts.IRegister> {
        this._rs = await this._sender
            .post(
                url,
                {},
                {
                    "X-AjaxPro-Method": "KiemTraTrungNhom"
                },
                true);

        return this;
    }

    private async saved(url: string): Promise<Constracts.IRegister> {
        this._rs = await this._sender
            .post(
                url,
                {},
                {
                    "X-AjaxPro-Method": "LuuDanhSachDangKy"
                },
                true);

        return this;
    }

    private async saved2(url: string): Promise<boolean> {
        let saved2 = {
            "isCheckSongHanh":false,
            "ChiaHP":false
        };
        this._rs = await this._sender
            .post(
                url,
                saved2,
                {
                    "X-AjaxPro-Method": "LuuDanhSachDangKy_HopLe"
                },
                true);

        return this._rs.value === '||default.aspx?page=dkmonhoc' ? true : false;
    }
}
