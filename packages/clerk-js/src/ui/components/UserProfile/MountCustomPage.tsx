import { useEffect, useRef } from 'react';

export const MountCustomPage = ({
  mountCustomPage,
  unmountCustomPage,
}: {
  mountCustomPage: any;
  unmountCustomPage: any;
}) => {
  const nodeRef = useRef(null);
  useEffect(() => {
    if (nodeRef.current) {
      mountCustomPage(nodeRef.current);
    }
    return () => {
      if (nodeRef.current) {
        unmountCustomPage();
      }
    };
  }, [nodeRef.current]);
  return (
    <>
      <div>MountCustomPage component</div>
      <div ref={nodeRef}></div>
    </>
  );
};
