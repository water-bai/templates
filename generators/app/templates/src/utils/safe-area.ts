import { isAndroid, isIOS } from '@ali/uni-env';

if (isAndroid) {
  document.body.classList.add('safe-area-variable-android');
}

if (isIOS) {
  document.body.classList.add('safe-area-variable-ios');
}
