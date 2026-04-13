import fs from "fs";

const path = "src/components/results/v2/sections/DaewoonV2.tsx";
let text = fs.readFileSync(path, "utf8");

const marker = '        <SectionHeader title="대운의 ��국(格局)" />\n\n';
if (!text.includes(marker)) {
  console.error("marker not found");
  process.exit(1);
}

const insert = `        <SectionHeader title="대운의 ��국(格局)" />
        <p className="mb-6 text-[13px] leading-[1.9] text-text-muted">
          ��국(格局)은 일간과 사주 구조를 기준으로, 이 사주�� 방향으로
          기운을 모으는지를 가리키는 이름입니다. 대운이 들어오면 성격(成格)이
          더 분명해지기도 하고, 파격(破格)의 요�러나기도 ��니다. 아래는
          현재까지 ��정된 ��국과 그에 따른 해설입니다.
        </p>

`;

text = text.replace(marker, insert);
fs.writeFileSync(path, text, "utf8");
console.log("ok");
