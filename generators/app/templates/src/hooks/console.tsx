import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    console.log('use hooks');
  }, []);
};
