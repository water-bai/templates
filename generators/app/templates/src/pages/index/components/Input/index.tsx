import './index.scss';

// 定制组件写在当前页面component目录，只关注UI，不关注逻辑
export default (props) => {
  return <input className="name-input" value={props?.options?.value} />;
};
