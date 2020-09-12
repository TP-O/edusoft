import { IRegister } from '../contracts/register';
import { ISender } from '../contracts/sender';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class Register implements IRegister
{
    private _id: any;
    private _rs: any;
    private _accessed: boolean = false;
    private _sender: ISender;

    public constructor(@inject('ISender') sender: ISender)
    {
        this._sender = sender;
    }

    public setId(id: string): void
    {
        this._id = id;
    }

    public resetAccessStatus(): void
    {
        this._accessed = false;
    }

    public async access(url: string): Promise<IRegister>
    {
        if (! this._accessed) {
            await this._sender.get(url);
            this._accessed = true;
        }
        return this;
    }

    public async select(url: string): Promise<IRegister>
    {
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

    public async save(url: string): Promise<IRegister>
    {
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

    public async check(url: string): Promise<IRegister>
    {
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

    public async saved(url: string): Promise<IRegister>
    {
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

    public async saved2(url: string): Promise<boolean>
    {
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
