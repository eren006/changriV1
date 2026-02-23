// ==UserScript==
// @name         晚餐系统
// @author       长日将尽
// @version      2.1.0
// @description  独立的晚餐系统。自动读取“长日将尽”插件中的角色名。
// @timestamp    1740292337
// @license      MIT
// ==/UserScript==

let ext = seal.ext.find("dinner_system");
if (!ext) {
    ext = seal.ext.new("dinner_system", "长日将尽", "2.1.0");
    seal.ext.register(ext);
}

// 获取菜谱数据库 (保持不变)
const DINNER_MENUS = {
    "现代中餐": ["东坡肉", "宫保鸡丁", "清蒸鲈鱼", "麻婆豆腐", "蒜蓉西兰花", "腌笃鲜", "扬州炒饭", "北京烤鸭", "佛跳墙", "松鼠鳜鱼", "辣子鸡丁", "回锅肉", "地三鲜", "西湖牛肉羹", "糖醋排骨", "荷叶粉蒸肉", "白灼虾", "蚝油生菜", "黑椒牛柳", "赛螃蟹", "开水白菜", "虫草花炖鸡汤", "蜜汁叉烧", "金汤肥牛", "蒜泥白肉", "响油鳝糊", "四喜丸子", "大煮干丝", "避风塘炒蟹", "文思豆腐", "酸菜鱼", "老鸭汤", "麻辣小龙虾", "西湖醋鱼", "金牌脆皮乳鸽", "剁椒鱼头", "上汤娃娃菜", "干炒牛河", "XO酱爆龙虾", "陈皮红豆沙", "杨枝甘露"],
    "现代西餐": ["惠灵顿牛排", "法式洋葱汤", "香煎干贝", "松露意面", "凯撒沙拉", "波士顿龙虾", "红酒炖牛肉", "提拉米苏", "奶油蘑菇汤", "战斧牛排", "芝士焗蜗牛", "玛格丽特披萨", "西班牙海鲜饭", "意式生牛肉片", "法式烤春鸡", "香煎三文鱼", "芦笋培根卷", "南瓜浓汤", "墨鱼汁面", "托斯卡纳炖鸡", "班尼迪克蛋", "维也纳炸牛排", "澳洲和牛配芦笋", "海鲜周打汤", "法式油封鸭", "德式脆皮猪肘", "炭烤羊排", "英式炸鱼薯条", "马赛鱼汤", "慢煮低温鲑鱼", "法式鹅肝配烤面包", "黑松露烩饭", "纽约芝士蛋糕", "舒芙蕾", "波尔多炖羊腱", "香煎比目鱼", "意式番茄罗勒浓汤", "生蚝拼盘", "焦糖布丁"],
    "古代中餐": ["花炊鹌子", "炙金肠", "洗手蟹", "羹腊兔", "莲花鸭签", "拨鱼儿", "玉灌肺", "金乳酥", "鹅鸭排蒸", "山煮羊", "螃蟹酿橙", "胡炮肉", "广利肉", "五味杏酪鹅", "荔枝白腰子", "绣球乾贝", "黄金鸡", "白云猪手", "瑞雪汤", "珍珠糜", "麒麟脯", "二十四桥明月夜", "剔缕鸡", "雪霞羹", "羊皮太极软脂", "假蛤蜊", "酒炊淮白", "煿金煮玉", "拨霞供", "槐叶冷淘", "广寒糕", "煨芋头", "暗香汤", "蜜饯雕花", "胡饼", "驼蹄羹", "过门香", "通花软牛肠", "光明虾炙", "玉笛谁家听落梅"],
    "古代西餐": ["烤野猪肉", "蜂蜜炖鹅", "香料葡萄酒", "中世纪黑面包", "麦芽糊", "盐渍鹿肉", "肉豆蔻烤鱼", "无花果挞", "炖孔雀", "孔雀开屏肉馅饼", "杏仁牛奶粥", "藏红花炖鸡", "肉桂烤苹果", "野味肉冻", "姜汁炖梨", "烤鲟鱼", "蜂蜜柠檬酒", "公鸡汤", "黄油烤野兔", "香草羊排", "烤大天鹅", "芜菁炖肉", "大麦浓汤", "鼠尾草烤猪", "香草醋渍鲱鱼", "燕麦饼干", "杜松子烤肉", "黑布丁", "苹果酒炖蹄髈", "盐烤整头公牛", "玫瑰水炖雏鸡", "龙涎香布丁", "香料馅饼", "酸葡萄汁煎肉", "欧当归炖鲜鱼", "藏红花杏仁奶油", "烤白鹭", "松露灰烬煨蛋"],
    "诡秘深渊": ["不可名状的触手羹", "深潜者之卵", "米戈真菌刺身", "发光的紫色浓汤", "蠕动的肉块饼", "拉莱耶深海藻泥", "旧日支配者的低语吐司", "黄衣之王的祭礼酒", "混乱无序的炖煮", "疯狂的眼球果冻", "虚空行者的心脏", "纳克亚之影的蛛丝糖", "修格斯半流体慕斯", "远古种族的遗迹罐头", "格拉基的尖刺烤串", "冷之高原的冻肉"],
    "赛博未来": ["合成蛋白块", "营养液胶囊(草莓味)", "人造合成和牛", "霓虹酒精饮料", "增强现实全息布丁", "高浓缩能量棒", "实验室培植细胞肉", "电子羊肉串", "0卡路里数字汽水", "金属味觉感官调节片", "深度冻结脱水蔬菜", "仿生鳗鱼冻", "垃圾场回收零件餐(装饰用)", "神经连接感应咖啡", "纳米机器人清洁餐", "低层区大杂烩"]
};

// ========================
// 核心逻辑：读取主插件存储
// ========================

function getChangriRoleName(ctx, msg) {
    // 1. 寻找长日将尽系统插件 (扩展ID为 changriV1)
    let crExt = seal.ext.find("changriV1");
    if (!crExt) return msg.sender.nickname; // 没找到则回退到昵称

    try {
        // 2. 获取存储
        const platform = "QQ"; // 默认平台
        const uid = msg.sender.userId;
        let charPlatform = JSON.parse(crExt.storageGet("Character_Platform") || "{}");
        
        // 3. 遍历存储寻找该 UID 对应的角色名
        // 根据 v1.3 代码结构：Character_Platform[platform][charName] = [uid, gid]
        if (charPlatform[platform]) {
            for (let name in charPlatform[platform]) {
                if (charPlatform[platform][name][0] === uid) {
                    return name; // 找到了返回角色名
                }
            }
        }
    } catch (e) {
        console.log("晚餐系统读取主插件数据失败: " + e.message);
    }
    
    return msg.sender.nickname; // 没绑定角色则用昵称
}

// 权限检查
function isUserAdmin(ctx) {
    return ctx.privilegeLevel >= 40;
}

// ========================
// 指令 (保持功能一致，仅修改了取名部分)
// ========================

// 1. 开始晚餐
let cmd_start = seal.ext.newCmdItemInfo();
cmd_start.name = "开始晚餐";
cmd_start.solve = (ctx, msg, cmdArgs) => {
    if (!isUserAdmin(ctx)) return seal.ext.newCmdExecuteResult(true);
    
    let num = parseInt(cmdArgs.getArgN(1));
    let era = cmdArgs.getArgN(2) || "现代中餐";
    if (isNaN(num) || num <= 0) return seal.ext.newCmdExecuteResult(true);

    let dishes = (era === "无菜") ? [] : (DINNER_MENUS[era] || ["家常小菜"]).sort(() => 0.5 - Math.random()).slice(0, 5 + Math.floor(num/3));

    let data = {
        status: "开始",
        max: num,
        era: era,
        dishes: dishes,
        list: new Array(num).fill(null)
    };
    ext.storageSet("dinner_system_data", JSON.stringify(data));

    let text = `🍽️ 【晚餐开始】\n风格：${era}\n`;
    if (dishes.length > 0) text += `菜谱：${dishes.join("、")}\n`;
    text += "────────────────\n";
    for (let i = 0; i < num; i++) text += `${i + 1}. （空位）\n`;
    seal.replyToSender(ctx, msg, text);
    return seal.ext.newCmdExecuteResult(true);
};
ext.cmdMap["开始晚餐"] = cmd_start;

// 2. 入座
let cmd_sit = seal.ext.newCmdItemInfo();
cmd_sit.name = "入座";
cmd_sit.solve = (ctx, msg, cmdArgs) => {
    let data = JSON.parse(ext.storageGet("dinner_system_data") || '{"status": "结束"}');
    if (data.status !== "开始") return seal.ext.newCmdExecuteResult(true);

    let index = parseInt(cmdArgs.getArgN(1)) - 1;
    if (isNaN(index) || index < 0 || index >= data.max) return seal.ext.newCmdExecuteResult(true);

    // 调用读取主插件名字的函数
    const roleName = getChangriRoleName(ctx, msg);

    // 换座逻辑
    for (let i = 0; i < data.list.length; i++) {
        if (data.list[i] === roleName) data.list[i] = null;
    }

    data.list[index] = roleName;
    ext.storageSet("dinner_system_data", JSON.stringify(data));

    let text = `🍽️ 【晚餐席位 - ${data.era}】\n`;
    text += "────────────────\n";
    for (let i = 0; i < data.max; i++) {
        text += `${i + 1}. ${data.list[i] || "（空位）"}\n`;
    }
    seal.replyToSender(ctx, msg, text);
    return seal.ext.newCmdExecuteResult(true);
};
ext.cmdMap["入座"] = cmd_sit;

// 3. 结束晚餐
let cmd_end = seal.ext.newCmdItemInfo();
cmd_end.name = "结束晚餐";
cmd_end.solve = (ctx, msg) => {
    if (!isUserAdmin(ctx)) return seal.ext.newCmdExecuteResult(true);
    ext.storageSet("dinner_system_data", JSON.stringify({status: "结束"}));
    seal.replyToSender(ctx, msg, "🏁 晚餐已结束。");
    return seal.ext.newCmdExecuteResult(true);
};
ext.cmdMap["结束晚餐"] = cmd_end;