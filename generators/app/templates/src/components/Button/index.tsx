import './index.scss';

// 通用组件写在当前页面component目录，只关注UI，不关注逻辑
export default (props) => {
  return (
    <div className="btn" onClick={props.onClick}>
      按钮
    </div>
  );
};
