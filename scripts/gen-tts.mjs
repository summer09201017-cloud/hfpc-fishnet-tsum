// 烤曉臻(zh-TW-HsiaoChenNeural)語音三句 → voice/*.mp3(逐句落盤,重跑到「新產 0」即完成)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require2 = createRequire("C:/Users/agape250/AppData/Local/Temp/claude/C--Users-agape250-Downloads-0721---0721--/27311019-9255-4b25-b9d1-1b523af380a2/scratchpad/node_modules/");
const { MsEdgeTTS, OUTPUT_FORMAT } = require2('msedge-tts');

const OUT = path.resolve(import.meta.dirname, '..', 'voice');
fs.mkdirSync(OUT, { recursive: true });
const LINES = [
  [
    "intro",
    "耶穌說:你們把網撒在船的右邊,就必得著。"
  ],
  [
    "bless",
    "他們便撒下網去,竟拉不上來了,因為魚甚多。"
  ],
  [
    "win",
    "西門彼得就去,把網拉到岸上。那網滿了大魚,共一百五十三條;魚雖這樣多,網卻沒有破。約翰福音二十一章十一節。"
  ]
];
let made = 0;
for (const [name, text] of LINES) {
  const file = path.join(OUT, name + '.mp3');
  if (fs.existsSync(file) && fs.statSync(file).size > 2000) continue;
  const tts = new MsEdgeTTS();
  await tts.setMetadata('zh-TW-HsiaoChenNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = await tts.toStream(text);
  const chunks = [];
  await new Promise((res, rej) => {
    audioStream.on('data', c => chunks.push(c));
    audioStream.on('end', res);
    audioStream.on('error', rej);
  });
  fs.writeFileSync(file, Buffer.concat(chunks));
  made++;
  console.log('baked', name, fs.statSync(file).size, 'bytes');
}
console.log('done, new files:', made);
