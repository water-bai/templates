import { Mtop } from '@ali/bp-utils';
import { MtopRequestConfig } from '@ali/bp-utils/lib/fetch/mtop';
import { Message } from '@alifd/meet-react';

interface IRequestParams<T> extends MtopRequestConfig<T> {
  toastOnError?: boolean;
}

export const getErrorMsgCode = (ret: string[]) => {
  return ret?.[0]?.split('::')[0];
};

export const getErrorMsg = (ret: string[]) => {
  return ret?.[0]?.split('::')[1];
};

const request = async <R = any, P = any>(params: IRequestParams<P>): Promise<R> => {
  try {
    const res = await Mtop.request({
      dataType: 'json',
      valueType: 'original',
      type: 'POST',
      ...params,
    });
    return res;
  } catch (error) {
    const { toastOnError } = params;

    if (toastOnError) {
      // 统一包装错误信息
      const msg = getErrorMsg(error.ret);
      if (msg) {
        Message.error(msg);
      }
    }

    throw error;
  }
};

export default request;
