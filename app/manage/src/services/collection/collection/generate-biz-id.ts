import { GenerateBusinessName } from "@lib/common/consts/generate-id";
import { generateIdDao } from "@lib/repo/dao/generate-id.dao";

const metaYear = 2024;

export async function collectionBizId(): Promise<string> {
    const nowTime = new Date();

    const year = nowTime.getFullYear();
    const month = String(nowTime.getMonth() + 1).padStart(2, '0');
    const day = String(nowTime.getDate()).padStart(2, '0');

    const dailyId = await generateIdDao.generateDailyId(GenerateBusinessName.Collection);

    return `${year - metaYear}${month}${day}${String(dailyId % 10000).padStart(4, '0')}`;
}
