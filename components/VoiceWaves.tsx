const waves = [
  {
    d: "M-50 350 C 105 92, 265 82, 390 292 C 458 406, 516 338, 574 316 C 635 293, 663 382, 744 447 C 858 538, 962 548, 1068 458 C 1162 378, 1198 148, 1342 137 C 1470 127, 1540 292, 1650 351",
    opacity: 0.4,
    width: 1.2,
  },
  {
    d: "M-50 384 C 102 132, 258 116, 386 310 C 451 408, 512 360, 573 334 C 636 307, 670 390, 750 454 C 862 543, 971 558, 1076 468 C 1172 386, 1210 185, 1348 169 C 1473 155, 1547 311, 1650 370",
    opacity: 0.5,
    width: 1.2,
  },
  {
    d: "M-50 420 C 98 174, 250 151, 381 331 C 446 420, 508 383, 572 354 C 638 324, 676 400, 756 463 C 867 550, 980 568, 1084 478 C 1182 393, 1222 220, 1354 201 C 1477 184, 1552 329, 1650 390",
    opacity: 0.6,
    width: 1.2,
  },
  {
    d: "M-50 456 C 93 218, 243 188, 376 352 C 441 432, 504 407, 570 375 C 639 342, 682 410, 762 472 C 872 557, 989 578, 1092 488 C 1192 400, 1234 257, 1360 234 C 1480 212, 1558 347, 1650 411",
    opacity: 0.7,
    width: 1.2,
  },
  {
    d: "M-50 494 C 88 263, 236 225, 371 374 C 435 445, 500 431, 568 396 C 640 359, 689 421, 768 482 C 877 565, 998 588, 1100 498 C 1202 408, 1247 294, 1367 267 C 1484 241, 1564 366, 1650 432",
    opacity: 0.8,
    width: 1.2,
  },
  {
    d: "M-50 533 C 83 309, 229 263, 366 397 C 430 459, 497 456, 567 417 C 641 376, 696 433, 775 493 C 882 574, 1007 598, 1108 508 C 1212 416, 1260 332, 1374 300 C 1488 268, 1570 385, 1650 454",
    opacity: 0.85,
    width: 1.5,
  },
] as const

const zoneColors = {
  left: ["#C95F32", "#D9855B"],
  middle: ["#D8B19A", "#CFC7BB"],
  right: ["#8C9C92", "#48675C"],
} as const

type WaveZoneProps = {
  clipPath: string
  colors: readonly [string, string]
}

function WaveZone({ clipPath, colors }: WaveZoneProps) {
  return (
    <g clipPath={`url(#${clipPath})`}>
      {waves.map((wave, index) => (
        <path
          key={`${clipPath}-${index}`}
          d={wave.d}
          fill="none"
          stroke={colors[index % colors.length]}
          strokeWidth={wave.width}
          strokeOpacity={wave.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  )
}

export default function VoiceWaves() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden opacity-35 sm:opacity-55 lg:opacity-100"
      viewBox="0 0 1600 700"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <clipPath id="voice-waves-left">
          <rect x="-60" y="0" width="660" height="700" />
        </clipPath>
        <clipPath id="voice-waves-middle">
          <rect x="598" y="0" width="478" height="700" />
        </clipPath>
        <clipPath id="voice-waves-right">
          <rect x="1074" y="0" width="586" height="700" />
        </clipPath>
      </defs>

      <g transform="translate(0 64)">
        <WaveZone clipPath="voice-waves-left" colors={zoneColors.left} />
        <WaveZone clipPath="voice-waves-middle" colors={zoneColors.middle} />
        <WaveZone clipPath="voice-waves-right" colors={zoneColors.right} />
      </g>
    </svg>
  )
}
