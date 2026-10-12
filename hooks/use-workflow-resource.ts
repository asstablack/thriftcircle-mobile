import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

// Focus/version guards prevent old group responses from replacing the current view.
// An uncertain write requires a fresh read before the next write; writes are never retried.
export function useWorkflowResource<T>(
  loader: () => Promise<T>,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const version = useRef(0);
  const writing = useRef(false);
  const ready = useRef(false);
  const load = useCallback(async () => {
    if (writing.current) return;
    const current = ++version.current;
    ready.current = false;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await loader();
      if (current !== version.current) return;
      setData(result);
      setNeedsRefresh(false);
      ready.current = true;
    } catch (reason) {
      if (current === version.current)
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to load this screen.',
        );
    } finally {
      if (current === version.current) setLoading(false);
    }
  }, [loader]);
  useFocusEffect(
    useCallback(() => {
      setNotice(null);
      if (writing.current) {
        setData(null);
        setLoading(false);
        setNeedsRefresh(true);
        setError(
          'An earlier save is finishing. Refresh before continuing.',
        );
      } else void load();
      return () => {
        version.current++;
        ready.current = false;
      };
    }, [load]),
  );
  const save = async (
    action: () => Promise<unknown>,
    success: string,
  ) => {
    if (writing.current || !ready.current) return false;
    writing.current = true;
    ready.current = false;
    const current = version.current;
    setBusy(true);
    setError(null);
    setNotice(null);
    let succeeded = false;
    try {
      await action();
      succeeded = true;
      if (current === version.current) setNotice(success);
    } catch (reason) {
      if (current === version.current) {
        setError(
          (reason instanceof Error
            ? reason.message
            : 'Unable to save.') +
            ' Refresh before trying again.',
        );
        setNeedsRefresh(true);
      }
    } finally {
      writing.current = false;
      setBusy(false);
    }
    if (succeeded && current === version.current)
      await load();
    return succeeded;
  };
  return {
    data,
    loading,
    busy,
    error,
    needsRefresh,
    notice,
    refresh: load,
    save,
  };
}
