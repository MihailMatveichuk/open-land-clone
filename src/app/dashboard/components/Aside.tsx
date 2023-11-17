import { GoBell } from 'react-icons/go';
import { AiOutlinePlus } from 'react-icons/ai';

type AsideProps = {
  title: string;
  children: React.ReactNode | undefined;
};

const Aside: React.FC<AsideProps> = ({ title, children }) => {
  return (
    <div className="aside">
      <div className="container">
        <div className="aside__top">
          <h3>{title}</h3>
          <div className="navbar_top_right">
            <GoBell className="navbar_icon" />
            <AiOutlinePlus className="navbar_icon" />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Aside;
