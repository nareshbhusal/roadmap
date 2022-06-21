import { useState, useLayoutEffect }  from 'react'
import useResizeObserver from '@react-hook/resize-observer'

const useSize = (target: React.RefObject<HTMLElement>) => {
  const [size, setSize] = useState<any>();

  useLayoutEffect(() => {
    setSize(target.current!.getBoundingClientRect())
  }, [target]);

  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
}

export default useSize;
