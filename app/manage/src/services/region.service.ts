import type { RegionAddReq, RegionDeleteReq, RegionEditReq, RegionListReq, RegionListResp } from "@lib/common/dto/region";
import { formatUnixTime } from "@lib/common/utils/time";
import { regionDao } from "@lib/repo/dao/region.dao";

class RegionService {
    async getRegionList(req: RegionListReq): Promise<RegionListResp> {
        const [list, total] = await Promise.all([
            regionDao.getRegionPageList(req.page, req.size, req.search),
            regionDao.getRegionTotal(req.search),
        ]);

        return {
            page: req.page,
            size: req.size,
            total,
            list: list.map((item) => ({
                id: item.id,
                name: item.name,
                currency: item.currency,
                currencySign: item.currencySign,
                createTime: formatUnixTime(item.createTime),
                updateTime: formatUnixTime(item.updateTime),
            })),
        };
    }

    async addRegion(req: RegionAddReq): Promise<void> {
        await regionDao.addRegion({
            name: req.name,
            currency: req.currency,
            currencySign: req.currencySign,
        });
    }

    async updateRegion(req: RegionEditReq): Promise<void> {
        await regionDao.updateRegionById(req.id, {
            name: req.name,
            currency: req.currency,
            currencySign: req.currencySign,
        });
    }

    async deleteRegion(req: RegionDeleteReq): Promise<void> {
        await regionDao.deleteRegionById(req.id);
    }
}

export const regionService = new RegionService();
