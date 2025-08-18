import { useCallback, useMemo, useState } from "react";

/**
 * useUpdateMemo will  recompute the memoized value when one of the deps has changed or if the update function is called.
 */
export const useUpdateMemo = <T,>(
	callback: () => T,
	deps: React.DependencyList,
): [T, () => void] => {
	const [key, setKey] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: needs key to force re-render
	const value = useMemo(() => {
		return callback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key, callback, ...deps]);

	const update = useCallback(() => {
		setKey(key + 1);
	}, [key]);

	return [value, update];
};
