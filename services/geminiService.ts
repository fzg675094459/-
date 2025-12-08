import { GoogleGenAI } from "@google/genai";
import { FALLBACK_DIARY, FALLBACK_BLOOD_MSG } from "../constants";

export const generateStoryContent = async (type: 'diary' | 'blood'): Promise<string> => {
  try {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let prompt = "";
    if (type === 'diary') {
      prompt = "写一段民国时期的中式恐怖日记（300字左右）。背景：陈家祠堂冥婚失败，回煞之夜。主角是家族最后一人，躲在供桌下。内容必须包含：1. 极度具体的感官描写（如腐烂的泥土味、棺材板被指甲刮出的木屑声）。2. 描述二叔公死时的诡异姿态。3. 明确提示解谜顺序：先用雷（震）镇压，再用火（离）焚烧，最后化山（艮）镇宅。语气要绝望、疯癫。";
    } else {
      prompt = "写一段主角检查地上血迹时的心理独白（200字左右）。这不只是血，混合了朱砂、尸油和头发。血迹一路延伸到祭坛。主角触摸血迹时产生了幻觉，看到了火光和焦尸。重点描写那种粘稠、冰冷、恶心的触感。最后暗示'火'生'山'的五行关系。";
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 1.2,
        responseMimeType: "text/plain",
      },
    });

    return response.text || (type === 'diary' ? FALLBACK_DIARY : FALLBACK_BLOOD_MSG);
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return type === 'diary' ? FALLBACK_DIARY : FALLBACK_BLOOD_MSG;
  }
};
