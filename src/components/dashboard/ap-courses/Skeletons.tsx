"use client";
import React from "react";

export function CourseCardSkeleton() {
	return (
		<div className="animate-pulse border rounded-lg p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-muted" />
					<div>
						<div className="h-4 w-24 bg-muted rounded mb-2" />
						<div className="h-3 w-16 bg-muted rounded" />
					</div>
				</div>
				<div className="w-5 h-5 bg-muted rounded" />
			</div>
			<div className="mt-4">
				<div className="h-2 w-full bg-muted rounded" />
			</div>
			<div className="grid grid-cols-3 gap-3 mt-4">
				<div className="h-10 bg-muted rounded" />
				<div className="h-10 bg-muted rounded" />
				<div className="h-10 bg-muted rounded" />
			</div>
		</div>
	);
}

export function GridSkeleton({ rows = 2, cols = 3 }: { rows?: number; cols?: number }) {
	const count = rows * cols;
	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
			{Array.from({ length: count }).map((_, i) => (
				<div key={i} className="animate-pulse border rounded-lg p-4 h-40 bg-muted" />
			))}
		</div>
	);
}
