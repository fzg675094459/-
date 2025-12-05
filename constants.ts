
// Placeholder images from picsum
export const IMAGES = {
  BG_HALL: 'https://picsum.photos/800/1200?grayscale&blur=2',
  BG_ALTAR: 'https://picsum.photos/800/1200?grayscale&contrast=1.2',
  PAPER_TEXTURE: 'https://picsum.photos/600/800?sepia',
  GHOST_HAND: 'https://picsum.photos/400/400?grayscale', 
};

// Richer fallback content for better playability without API
export const FALLBACK_DIARY = `
民国廿三年，七月十四，子时，大雨。

我是陈家最后活下来的人了。
二叔公死在了天井里，死状和当年姑婆一模一样——嘴里塞满了湿透的纸钱，膝盖骨跪得粉碎，像是生前在这个位置重重地磕了无数个响头。
我早就说过，那口红棺材绝不能抬进祠堂。那是给“她”准备的，不是给活人准备的。

虽然我们在棺材上贴了七道“震”字雷符，又用三年生的公鸡血封了顶，但今晚... 封印松动了。
我听见棺材里有指甲抓挠木板的声音。
刺啦... 刺啦... 指甲断裂的声音清晰可闻。
它在叫我的名字。它想让我回头。

如果有后人看到这张沾血的家书，记住：
想活命，必须逆转五行，重新加固封印。
先引“雷”（震）声震慑其魂，再借“火”（离）势焚烧其尸... 最后化为不动之“山”（艮），将其永镇地下。
切记，仪式完成前，千万别回头看神像。
`;

export const FALLBACK_BLOOD_MSG = `
（你强忍着恶心，蹲下身查看那摊暗红色的痕迹...）

这不是普通的血。
粘稠的黑红色液体里，混杂着大量的朱砂粉末，还有... 
你用手电筒照亮了那一团纠缠的东西——是一绺长长的、湿漉漉的黑色头发，发丝间还缠绕着几片未烧尽的纸灰。

血迹在地板上蜿蜒拖行，像是有人——或者有东西——被人拖拽着身体，一路挣扎留下的痕迹。
指甲在地板上抓出的深痕清晰可见。
它一直延伸到右侧祭坛的供桌下方。
在那个位置，地板上有一个被火燎过的焦黑印记，隐约散发着一股烧焦的肉味。

（线索：火 能生 土/山。这似乎印证了家书中提到的最后一步。）
`;

// Audio frequencies for procedural generation
export const AUDIO_PARAMS = {
  BASE_FREQ: 55,
  HEARTBEAT_LOW: 40,
  HEARTBEAT_HIGH: 100
};

export const SCARY_TEXTS = [
  "它在看你", "别回头", "还有一个人", "就在梁上", "嘻嘻...", "并没有逃掉", "把头还给我", "嘘...别出声", "你的背好重", "找到你了"
];
