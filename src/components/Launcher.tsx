import Image from 'next/image';
import logo from '../../public/assets/images/logo.png';
import '../../public/assets/styles/style.scss';

const Launcher = () => {
  return (
    <div className="launcher">
      <Image className="launcher__logo" src={logo} alt="logo" />
    </div>
  );
};

export default Launcher;
