import React from "react";

interface ChapterMaskProps {
	/** 마스크 표시 여부 */
	isVisible: boolean;
	/** 마스크 제목 */
	title?: string;
	/** 마스크 설명 */
	description?: string;
	/** 마스크 클릭 핸들러 */
	onClick?: (e: React.MouseEvent) => void;
}

export function ChapterMask({
	isVisible,
	title = "Unavailable",
	description = "This chapter cannot be used",
	onClick,
}: ChapterMaskProps) {
	if (!isVisible) return null;

	return (
		<div
			className="absolute inset-0 z-10 flex items-center justify-center rounded-lg cursor-not-allowed"
			style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)", color: "#fff" }}
			onClick={onClick || ((e) => e.stopPropagation())}
		>
			<div className="text-center">
				<div className="text-sm font-semibold">{title}</div>
				<div className="text-xs opacity-90">{description}</div>
			</div>
		</div>
	);
}
