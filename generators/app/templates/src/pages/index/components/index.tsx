import { submit } from '@/services';

import Button from '@/components/button';
import Input from './input';

export default {
  // 业务逻辑尽量放在这边
  Button: (props) => {
    const { options, api } = props;
    const onClick = () => {
      submit(api.modifyMobileUri, {
        name: 'shuomo',
      });
    };
    return <Button {...options} onClick={onClick} />;
  },
  Input: (props) => {
    return <Input {...props} />;
  },
};
